import notificationRepository from "../repositories/notification.repository.js";
import userRepository from "../repositories/user.repository.js";
import { emitToCompany, emitToUser } from "../sockets/index.js";
import { parsePagination, paginatedResult } from "../utils/pagination.js";

class NotificationService {
  async notifyUsers({ userIds, companyId, message, type, metadata }) {
    const uniqueIds = [...new Set(userIds.map(String))];
    const docs = uniqueIds.map((userId) => ({
      userId,
      companyId,
      message,
      type,
      metadata,
    }));
    const created = await notificationRepository.createMany(docs);

    created.forEach((n) => {
      emitToUser(n.userId.toString(), "notification", n);
    });
    emitToCompany(companyId, "notification:company", { message, type, metadata });
    return created;
  }

  async notifyCompanyAdmins({ companyId, message, type, metadata }) {
    const members = await userRepository.findCompanyMembers(
      companyId,
      { isActive: true },
      { limit: 200 },
    );
    return this.notifyUsers({
      userIds: members.map((m) => m.id),
      companyId,
      message,
      type,
      metadata,
    });
  }

  async list(userId, query) {
    const { page, limit, skip } = parsePagination(query);
    const [items, unread] = await Promise.all([
      notificationRepository.findForUser(userId, { skip, limit }),
      notificationRepository.countUnread(userId),
    ]);
    return { ...paginatedResult({ items, total: items.length, page, limit }), unread };
  }

  markRead(userId, id) {
    return notificationRepository.markRead(userId, id);
  }

  markAllRead(userId) {
    return notificationRepository.markAllRead(userId);
  }
}

export default new NotificationService();
