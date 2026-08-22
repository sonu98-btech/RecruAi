import mongoose from "mongoose";
import env from "./env.js";
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import { logger } from "../utils/logger.js";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.mongoUri, {
    autoIndex: !env.isProduction,
    maxPoolSize: 20,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 10_000,
  });

  logger.info("MongoDB connected");

  mongoose.connection.on("error", (error) => {
    logger.error("MongoDB connection error", error);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });
}

export async function disconnectDatabase() {
  await mongoose.connection.close();
}
