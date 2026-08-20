import "dotenv/config";
import app, { startApolloServer } from "./app";
import { connectDB } from "./config/database";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();
  const { httpServer } = await startApolloServer();

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
