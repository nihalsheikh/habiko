const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(
      `[Config Error] Missing required environment variable: ${key}`,
    );
  }
  return value;
};

export const PORT = Number(process.env.PORT) || 5000;
export const MONGODB_URL = getEnv("MONGODB_URL");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const GEMINI_API_KEY = getEnv("GEMINI_API_KEY");
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
