import Notification from "../models/Notification.js";

class NotificationRepository {
  create(data) {
    return Notification.create(data);
  }

  createMany(docs) {
    return Notification.insertMany(docs);
  }

  findForUser(userId, { skip = 0, limit = 30 } = {}) {
    return Notification.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
  }

  countUnread(userId) {
    return Notification.countDocuments({ userId, read: false });
  }

  markRead(userId, id) {
    return Notification.findOneAndUpdate({ _id: id, userId }, { read: true }, { new: true });
  }

  markAllRead(userId) {
    return Notification.updateMany({ userId, read: false }, { read: true });
  }
}

export default new NotificationRepository();
