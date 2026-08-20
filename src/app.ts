import express from "express";
import http from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(express.json());

export const startApolloServer = async () => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ")
          ? authHeader.slice(7)
          : null;

        if (!token) return { userId: null };

        try {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string,
          ) as {
            userId: number;
          };
          return { userId: decoded.userId };
        } catch {
          return { userId: null };
        }
      },
    }),
  );

  return { app, httpServer };
};

export default app;
