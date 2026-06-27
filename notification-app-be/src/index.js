import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Log, setToken } from "affordmed-logging-middleware";
import { initDB } from "./db/init.js";
import notificationRoutes from "./routes/notifications.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

setToken(process.env.AUTH_TOKEN);

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  await Log("backend", "info", "middleware", `${req.method} ${req.path}`);
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/notifications", notificationRoutes);

app.use(async (err, req, res, next) => {
  await Log("backend", "error", "handler", `Unhandled: ${err.message}`);
  res.status(500).json({ error: "Internal server error" });
});

async function start() {
  try {
    await initDB();
    await Log("backend", "info", "config", "Database initialized");
    app.listen(PORT, async () => {
      await Log("backend", "info", "config", `Server started on port ${PORT}`);
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    await Log("backend", "fatal", "config", `Startup failed: ${err.message}`);
    process.exit(1);
  }
}

start();
