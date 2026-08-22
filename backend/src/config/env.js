import dotenv from "dotenv";

dotenv.config();

const required = ["MONGODB_URI", "JWT_SECRET"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT) || 5000,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cookieName: process.env.COOKIE_NAME || "accessToken",
  cookieSecure: process.env.COOKIE_SECURE === "true",
  cookieSameSite: process.env.COOKIE_SAMESITE || "lax",
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || "AI Calling CRM <noreply@recruai.local>",
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    webhookBaseUrl: process.env.TWILIO_WEBHOOK_BASE_URL,
  },
  ai: {
    sttProvider: process.env.STT_PROVIDER || "stub",
    llmProvider: process.env.LLM_PROVIDER || "demo",
    ttsProvider: process.env.TTS_PROVIDER || "stub",
    vectorDbUrl: process.env.VECTOR_DB_URL || "",
  },
  seed: {
    name: process.env.SEED_SUPER_ADMIN_NAME || "Platform Super Admin",
    email: process.env.SEED_SUPER_ADMIN_EMAIL || "superadmin@recruai.local",
    password: process.env.SEED_SUPER_ADMIN_PASSWORD || "ChangeMeNow!123",
  },
};

export default env;
