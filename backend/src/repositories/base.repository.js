import { ApiError } from "../utils/ApiError.js";

export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  scoped(companyId, extra = {}) {
    if (!companyId) {
      throw ApiError.badRequest("Tenant companyId is required for this query");
    }
    return { companyId, ...extra };
  }

  create(data) {
    return this.model.create(data);
  }

  findById(companyId, id, populate = "") {
    return this.model.findOne(this.scoped(companyId, { _id: id })).populate(populate);
  }

  findOne(companyId, filter = {}) {
    return this.model.findOne(this.scoped(companyId, filter));
  }

  findMany(companyId, filter = {}, { skip = 0, limit = 20, sort = { createdAt: -1 }, populate = "" } = {}) {
    return this.model
      .find(this.scoped(companyId, filter))
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(populate);
  }

  count(companyId, filter = {}) {
    return this.model.countDocuments(this.scoped(companyId, filter));
  }

  updateById(companyId, id, update, options = { new: true, runValidators: true }) {
    const hasOperator = Object.keys(update).some(k => k.startsWith('$'));
    const finalUpdate = hasOperator ? update : { $set: update };
    return this.model.findOneAndUpdate(this.scoped(companyId, { _id: id }), finalUpdate, options);
  }

  deleteById(companyId, id) {
    return this.model.findOneAndDelete(this.scoped(companyId, { _id: id }));
  }
}
