import express from "express";
import http from "http";
import cors from "cors";
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

  app.use("/graphql", cors(), express.json(), expressMiddleware(apolloServer));

  return { app, httpServer };
};

export default app;
