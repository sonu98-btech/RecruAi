import { Server } from "socket.io";
import env from "../config/env.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { logger } from "../utils/logger.js";
import User from "../models/User.js";

let io;

export function initSockets(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: env.clientOrigin,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie || "";
      const match = cookieHeader.match(new RegExp(`${env.cookieName}=([^;]+)`));
      const token = match?.[1] || socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Unauthorized"));
      }
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.sub);
      if (!user || !user.isActive) {
        return next(new Error("Unauthorized"));
      }
      socket.user = user;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    const companyId = socket.user.companyId?.toString();
    socket.join(`user:${userId}`);
    if (companyId) socket.join(`company:${companyId}`);
    logger.info("Socket connected", { userId });

    socket.on("disconnect", () => {
      logger.info("Socket disconnected", { userId });
    });
  });

  return io;
}

export function getIo() {
  return io;
}

export function emitToUser(userId, event, payload) {
  getIo()?.to(`user:${userId}`).emit(event, payload);
}

export function emitToCompany(companyId, event, payload) {
  if (!companyId) return;
  getIo()?.to(`company:${companyId}`).emit(event, payload);
}
