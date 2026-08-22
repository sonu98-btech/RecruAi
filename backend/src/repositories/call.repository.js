import Call from "../models/Call.js";
import { BaseRepository } from "./base.repository.js";

class CallRepository extends BaseRepository {
  constructor() {
    super(Call);
  }

  findByProviderSid(providerCallSid) {
    return Call.findOne({ "telephony.providerCallSid": providerCallSid });
  }
}

export default new CallRepository();
