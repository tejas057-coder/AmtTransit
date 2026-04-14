import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import routesRoute from "./routes/routesRoute";
import busesRoute from "./routes/busesRoute";
import stopsRoute from "./routes/stopsRoute";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8082";

// Middleware
app.use(express.json());
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/routes", routesRoute);
app.use("/api/buses", busesRoute);
app.use("/api/stops", stopsRoute);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    timestamp: new Date().toISOString()
  });
});

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    timestamp: new Date().toISOString()
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 CORS enabled for ${FRONTEND_URL}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log("\n📡 Available Endpoints:");
  console.log("  GET  /api/routes           - Get all routes");
  console.log("  GET  /api/routes/:id       - Get single route");
  console.log("  GET  /api/routes/:id/buses - Get buses on route");
  console.log("  GET  /api/buses            - Get all buses (optional: ?routeId=xxx, ?status=xxx)");
  console.log("  GET  /api/buses/:id        - Get single bus");
  console.log("  GET  /api/buses/stats      - Get bus statistics");
  console.log("  GET  /api/stops            - Get all stops");
  console.log("  GET  /api/stops/:id        - Get single stop");
  console.log("  GET  /api/stops/search     - Search stops (query: ?q=xxx)");
});
