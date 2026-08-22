import env from "../config/env.js";
import { connectDatabase, disconnectDatabase } from "../config/db.js";
import User from "../models/User.js";
import { ROLES } from "../utils/constants.js";
import { logger } from "../utils/logger.js";

async function seed() {
  await connectDatabase();
  const existing = await User.findOne({ email: env.seed.email.toLowerCase() });
  if (existing) {
    logger.info("Super admin already exists", existing.email);
    await disconnectDatabase();
    return;
  }

  await User.create({
    name: env.seed.name,
    email: env.seed.email,
    password: env.seed.password,
    role: ROLES.SUPER_ADMIN,
    companyId: null,
    isActive: true,
  });

  logger.info(`Seeded SUPER_ADMIN ${env.seed.email}`);
  await disconnectDatabase();
}

seed().catch(async (error) => {
  logger.error("Seed failed", error);
  await disconnectDatabase();
  process.exit(1);
});
