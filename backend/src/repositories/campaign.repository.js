import Campaign from "../models/Campaign.js";
import { BaseRepository } from "./base.repository.js";

class CampaignRepository extends BaseRepository {
  constructor() {
    super(Campaign);
  }
}

export default new CampaignRepository();
