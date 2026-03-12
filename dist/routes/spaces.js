import { Router } from "express";
import { PrismaClient } from "../generated/prisma/index.js";
import { authMiddleware } from "../middleware/auth.js";
export default function spaceRoutes(prisma) {
    const router = Router();
    // Create space
    router.post("/", authMiddleware, async (req, res) => {
        try {
            const { name, maxUsers } = req.body;
            if (!name) {
                return res.status(400).json({ error: "Space name required" });
            }
            const space = await prisma.space.create({
                data: {
                    name,
                    createdBy: req.userId,
                    maxUsers: maxUsers || 50,
                },
            });
            res.json(space);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to create space" });
        }
    });
    // Get all spaces
    router.get("/", async (req, res) => {
        try {
            const spaces = await prisma.space.findMany({
                include: {
                    creator: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                    avatars: {
                        select: {
                            userId: true,
                            user: {
                                select: {
                                    username: true,
                                },
                            },
                        },
                    },
                },
            });
            const spacesWithUserCount = spaces.map((space) => ({
                ...space,
                userCount: space.avatars.length,
            }));
            res.json(spacesWithUserCount);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to get spaces" });
        }
    });
    // Get space details
    router.get("/:id", async (req, res) => {
        try {
            const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
            const space = await prisma.space.findUnique({
                where: { id },
                include: {
                    creator: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                    avatars: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!space) {
                return res.status(404).json({ error: "Space not found" });
            }
            res.json(space);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to get space" });
        }
    });
    // Delete space (only creator)
    router.delete("/:id", authMiddleware, async (req, res) => {
        try {
            const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
            const space = await prisma.space.findUnique({
                where: { id },
            });
            if (!space) {
                return res.status(404).json({ error: "Space not found" });
            }
            if (space.createdBy !== req.userId) {
                return res.status(403).json({ error: "Only creator can delete space" });
            }
            await prisma.space.delete({
                where: { id },
            });
            res.json({ success: true });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to delete space" });
        }
    });
    return router;
}
//# sourceMappingURL=spaces.js.map