const ts = () => new Date().toISOString();

export const logger = {
  info: (message, extra) => {
    console.log(`[INFO] ${ts()} ${message}`, extra ?? "");
  },
  warn: (message, extra) => {
    console.warn(`[WARN] ${ts()} ${message}`, extra ?? "");
  },
  error: (message, extra) => {
    console.error(`[ERROR] ${ts()} ${message}`, extra ?? "");
  },
};
