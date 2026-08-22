import http from "node:http";
import env from "./config/env.js";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { initSockets } from "./sockets/index.js";
import { startFollowupScheduler } from "./utils/scheduler.js";
import { logger } from "./utils/logger.js";

const app = createApp();
const server = http.createServer(app);

initSockets(server);

async function bootstrap() {
  await connectDatabase();
  startFollowupScheduler();

  server.listen(env.port, () => {
    logger.info(`AI Calling CRM API listening on port ${env.port} [${env.nodeEnv}]`);
  });
}

bootstrap().catch((error) => {
  logger.error("Failed to start server", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection", reason);
});
