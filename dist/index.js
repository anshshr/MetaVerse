import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import authRoutes from "./routes/auth.js";
import spaceRoutes from "./routes/spaces.js";
import { setupWebSocket } from "./websocket/handler.js";
const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });
// Initialize Prisma Client with PostgreSQL adapter
const connectionString = process.env.DATABASE_URL || "postgresql://ansh:ansh@localhost:5432/metaverse";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
// Middleware
app.use(cors());
app.use(express.json());
// API Routes
app.use("/api/auth", authRoutes(prisma));
app.use("/api/spaces", spaceRoutes(prisma));
// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});
// WebSocket setup
setupWebSocket(wss, prisma);
const PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WS_PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Also run WebSocket on separate port if needed
const standaloneWss = new WebSocketServer({ port: WS_PORT });
setupWebSocket(standaloneWss, prisma);
console.log(`WebSocket server running on port ${WS_PORT}`);
// Graceful shutdown
process.on("SIGINT", async () => {
    console.log("Shutting down...");
    await prisma.$disconnect();
    process.exit(0);
});
//# sourceMappingURL=index.js.map