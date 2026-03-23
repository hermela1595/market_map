import express from "express";
import cors from "cors";
import "./config/loadEnv.js";
import pool from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "http://localhost:4173", // Vite preview
  process.env.CLIENT_ORIGIN, // production origin via env
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow server-to-server / curl / Postman (no Origin header)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/verify", verificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({
      status: "ok",
      database: "up",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "degraded",
      database: "down",
      error: error.code || error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 4001;

const startServer = async () => {
  if (!process.env.JWT_SECRET || !process.env.JWT_SECRET.trim()) {
    console.warn("JWT_SECRET is missing. Auth endpoints will return 500.");
  }

  try {
    await pool.query("SELECT 1");
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.code || error.message);
    console.warn("Starting server in degraded mode (database unavailable)");
  }

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use`);
      return;
    }

    console.error("Server startup failed:", error.message);
  });
};

startServer();
