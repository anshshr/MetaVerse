import { WebSocket, WebSocketServer } from "ws";
import { PrismaClient } from "../generated/prisma/client.js";
import jwt from "jsonwebtoken";
// Store active connections by space
const spaceConnections = new Map();
export function setupWebSocket(wss, prisma) {
    wss.on("connection", (ws) => {
        console.log("New WebSocket connection");
        ws.on("message", async (data) => {
            try {
                const message = JSON.parse(data.toString());
                switch (message.type) {
                    case "authenticate":
                        handleAuthenticate(ws, message, prisma);
                        break;
                    case "join_space":
                        await handleJoinSpace(ws, message, prisma);
                        break;
                    case "leave_space":
                        await handleLeaveSpace(ws, message, prisma);
                        break;
                    case "move":
                        await handleMove(ws, message, prisma);
                        break;
                    case "ping":
                        ws.send(JSON.stringify({ type: "pong" }));
                        break;
                    default:
                        console.log("Unknown message type:", message.type);
                }
            }
            catch (error) {
                console.error("WebSocket message error:", error);
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Invalid message format",
                }));
            }
        });
        ws.on("close", async () => {
            console.log("WebSocket closed");
            if (ws.currentSpaceId) {
                await handleLeaveSpace(ws, { spaceId: ws.currentSpaceId }, prisma);
            }
        });
        ws.on("error", (error) => {
            console.error("WebSocket error:", error);
        });
    });
}
function handleAuthenticate(ws, message, prisma) {
    const token = message.token;
    if (!token) {
        ws.send(JSON.stringify({ type: "error", message: "Token required" }));
        ws.close();
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        ws.userId = decoded.userId;
        ws.send(JSON.stringify({ type: "authenticated", userId: decoded.userId }));
    }
    catch (error) {
        ws.send(JSON.stringify({ type: "error", message: "Invalid token" }));
        ws.close();
    }
}
async function handleJoinSpace(ws, message, prisma) {
    if (!ws.userId) {
        ws.send(JSON.stringify({ type: "error", message: "Not authenticated" }));
        return;
    }
    const spaceId = message.spaceId;
    if (!spaceId) {
        ws.send(JSON.stringify({ type: "error", message: "Space ID required" }));
        return;
    }
    try {
        // Verify space exists
        const space = await prisma.space.findUnique({
            where: { id: spaceId },
        });
        if (!space) {
            ws.send(JSON.stringify({ type: "error", message: "Space not found" }));
            return;
        }
        // Create or update avatar
        const avatar = await prisma.avatar.upsert({
            where: {
                userId_spaceId: {
                    userId: ws.userId,
                    spaceId,
                },
            },
            create: {
                userId: ws.userId,
                spaceId,
                x: 0,
                y: 0,
            },
            update: {
                updatedAt: new Date(),
            },
            include: {
                user: {
                    select: {
                        username: true,
                    },
                },
            },
        });
        // Get all users in space
        const spaceAvatars = await prisma.avatar.findMany({
            where: { spaceId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });
        // Add to space connections
        if (!spaceConnections.has(spaceId)) {
            spaceConnections.set(spaceId, new Set());
        }
        spaceConnections.get(spaceId).add(ws);
        ws.currentSpaceId = spaceId;
        // Send current state to new user
        ws.send(JSON.stringify({
            type: "space_joined",
            spaceId,
            users: spaceAvatars.map((a) => ({
                userId: a.user.id,
                username: a.user.username,
                x: a.x,
                y: a.y,
            })),
        }));
        // Notify others that user joined
        broadcastToSpace(spaceId, {
            type: "user_joined",
            userId: ws.userId,
            username: avatar.user.username,
            x: avatar.x,
            y: avatar.y,
        });
    }
    catch (error) {
        console.error("Join space error:", error);
        ws.send(JSON.stringify({ type: "error", message: "Failed to join space" }));
    }
}
async function handleLeaveSpace(ws, message, prisma) {
    const spaceId = ws.currentSpaceId || message.spaceId;
    if (!spaceId || !ws.userId) {
        return;
    }
    try {
        // Delete avatar
        await prisma.avatar.delete({
            where: {
                userId_spaceId: {
                    userId: ws.userId,
                    spaceId,
                },
            },
        });
        // Remove from space connections
        const connections = spaceConnections.get(spaceId);
        if (connections) {
            connections.delete(ws);
            if (connections.size === 0) {
                spaceConnections.delete(spaceId);
            }
        }
        delete ws.currentSpaceId;
        // Notify others that user left
        broadcastToSpace(spaceId, {
            type: "user_left",
            userId: ws.userId,
        });
    }
    catch (error) {
        console.error("Leave space error:", error);
    }
}
async function handleMove(ws, message, prisma) {
    if (!ws.userId || !ws.currentSpaceId) {
        return;
    }
    const { x, y } = message;
    if (typeof x !== "number" || typeof y !== "number") {
        return;
    }
    try {
        // Update avatar position
        await prisma.avatar.update({
            where: {
                userId_spaceId: {
                    userId: ws.userId,
                    spaceId: ws.currentSpaceId,
                },
            },
            data: {
                x,
                y,
            },
        });
        // Broadcast new position to all users in space
        broadcastToSpace(ws.currentSpaceId, {
            type: "user_moved",
            userId: ws.userId,
            x,
            y,
        });
    }
    catch (error) {
        console.error("Move error:", error);
    }
}
function broadcastToSpace(spaceId, message) {
    const connections = spaceConnections.get(spaceId);
    if (!connections)
        return;
    const data = JSON.stringify(message);
    connections.forEach((ws) => {
        if (ws.readyState === 1) {
            // OPEN
            ws.send(data);
        }
    });
}
//# sourceMappingURL=handler.js.map