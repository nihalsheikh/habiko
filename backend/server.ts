import express from "express";
import "dotenv/config";
import cors, { type CorsOptions } from "cors";
import { connectDB } from "./config/db";
import {
  notFound,
  errorHandler,
} from "./middleware/errorHandler.middleware.ts";
import { FRONTEND_URL, PORT as BACKEND_PORT } from "./config/envConfig";
import authRoutes from "./routes/auth.routes.ts";
import habitRoutes from "./routes/habits.routes.ts";
import logRoutes from "./routes/logs.routes.ts";
import aiRoutes from "./routes/ai.routes.ts";

const app = express();

// Multiple Origins Access
const allowedOrigins = (FRONTEND_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Dynamic Origin fn for precise control
const corsOptions: CorsOptions = {
  origin(origin, cb) {
    // Allow requests without an origin (curl, same-origin, mobile apps, server-to-server)
    if (!origin) return cb(null, true);

    // Allow localhost or 127.0.0.1 origin in development
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return cb(null, true);
    }

    // Validate against allowed Origin list
    if (allowedOrigins.includes(origin)) return cb(null, true);

    // Reject all other origins
    return cb(new Error(`Origin ${origin} not allowed by CORS`));
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
// Custom CORS config and preflight option req for browser based users
app.use(cors(corsOptions));

// JSON Parsing with size limit to prevent large payloads from affecting performance
app.use(express.json({ limit: "1mb" }));

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", time: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/ai", aiRoutes);

// Handle Erros centrally
// Catch unknown routes
app.use(notFound);

// Process all app errors
app.use(errorHandler);

const PORT = BACKEND_PORT || 5000;

// Connect DB
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}`),
  );
});
