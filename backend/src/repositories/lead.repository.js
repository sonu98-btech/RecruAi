import Lead from "../models/Lead.js";
import { BaseRepository } from "./base.repository.js";

class LeadRepository extends BaseRepository {
  constructor() {
    super(Lead);
  }
}

export default new LeadRepository();
