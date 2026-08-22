import Client from "../models/Client.js";
import { BaseRepository } from "./base.repository.js";

class ClientRepository extends BaseRepository {
  constructor() {
    super(Client);
  }
}

export default new ClientRepository();
