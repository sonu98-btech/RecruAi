import User from "../models/User.js";

class UserRepository {
  create(data) {
    return User.create(data);
  }

  findByEmail(email, { withPassword = false } = {}) {
    const query = User.findOne({ email: email.toLowerCase() });
    if (withPassword) query.select("+password");
    return query;
  }

  findById(id, { withPassword = false } = {}) {
    const query = User.findById(id);
    if (withPassword) query.select("+password");
    return query;
  }

  findCompanyMembers(companyId, filter = {}, { skip = 0, limit = 50 } = {}) {
    return User.find({ companyId, ...filter })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  countCompanyMembers(companyId, filter = {}) {
    return User.countDocuments({ companyId, ...filter });
  }

  updateById(id, update) {
    const hasOperator = Object.keys(update).some(k => k.startsWith('$'));
    const finalUpdate = hasOperator ? update : { $set: update };
    return User.findByIdAndUpdate(id, finalUpdate, { new: true, runValidators: true });
  }
}

export default new UserRepository();
