import Company from "../models/Company.js";

class CompanyRepository {
  create(data) {
    return Company.create(data);
  }

  findById(id) {
    return Company.findById(id);
  }

  findByEmail(email) {
    return Company.findOne({ email: email.toLowerCase() });
  }

  findMany(filter = {}, { skip = 0, limit = 20, sort = { createdAt: -1 } } = {}) {
    return Company.find(filter).sort(sort).skip(skip).limit(limit);
  }

  count(filter = {}) {
    return Company.countDocuments(filter);
  }

  updateById(id, update) {
    const hasOperator = Object.keys(update).some(k => k.startsWith('$'));
    const finalUpdate = hasOperator ? update : { $set: update };
    return Company.findByIdAndUpdate(id, finalUpdate, { new: true, runValidators: true });
  }

  consumeCredit(companyId, amount = 1) {
    return Company.findOneAndUpdate(
      { _id: companyId, "subscription.credits": { $gte: amount } },
      { $inc: { "subscription.credits": -amount } },
      { new: true },
    );
  }
}

export default new CompanyRepository();
