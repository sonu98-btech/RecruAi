import AuditLog from "../models/AuditLog.js";

class AuditLogRepository {
  record({ companyId, actorId, action, entity, entityId, metadata }) {
    return AuditLog.create({ companyId, actorId, action, entity, entityId, metadata });
  }
}

export default new AuditLogRepository();
