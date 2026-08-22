import clientRepository from "../repositories/client.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { assertValidObjectId, escapeRegex } from "../utils/mongo.js";
import { parsePagination, paginatedResult } from "../utils/pagination.js";

class ClientService {
  async create(actor, companyId, payload) {
    return clientRepository.create({
      ...payload,
      companyId,
      createdBy: actor.id,
    });
  }

  async list(companyId, query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.search) {
      const rx = new RegExp(escapeRegex(query.search), "i");
      filter.$or = [{ companyName: rx }, { contactPerson: rx }, { email: rx }];
    }
    const [items, total] = await Promise.all([
      clientRepository.findMany(companyId, filter, { skip, limit }),
      clientRepository.count(companyId, filter),
    ]);
    return paginatedResult({ items, total, page, limit });
  }

  async get(companyId, id) {
    assertValidObjectId(id);
    const client = await clientRepository.findById(companyId, id);
    if (!client) throw ApiError.notFound("Client not found");
    return client;
  }

  async update(companyId, id, payload) {
    await this.get(companyId, id);
    const update = { ...payload };
    delete update.companyId;
    delete update.createdBy;
    return clientRepository.updateById(companyId, id, update);
  }

  async remove(companyId, id) {
    await this.get(companyId, id);
    return clientRepository.deleteById(companyId, id);
  }
}

export default new ClientService();
