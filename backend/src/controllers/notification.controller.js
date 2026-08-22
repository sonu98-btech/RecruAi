import notificationService from "../services/notification.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const data = await notificationService.list(req.user.id, req.query);
  return ApiResponse.success(res, { message: "Notifications fetched", data });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const data = await notificationService.markRead(req.user.id, req.params.id);
  return ApiResponse.success(res, { message: "Notification marked read", data });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllRead(req.user.id);
  return ApiResponse.success(res, { message: "All notifications marked read", data: null });
});
