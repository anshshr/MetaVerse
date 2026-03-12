import { Router } from "express";
import { PrismaClient } from "../generated/prisma/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/auth.js";
export default function authRoutes(prisma) {
    const router = Router();
    // Register
    router.post("/register", async (req, res) => {
        try {
            const { email, password, username } = req.body;
            if (!email || !password || !username) {
                return res
                    .status(400)
                    .json({ error: "Email, password, and username required" });
            }
            // Check if user exists
            const existing = await prisma.user.findFirst({
                where: {
                    OR: [{ email }, { username }],
                },
            });
            if (existing) {
                return res
                    .status(400)
                    .json({ error: "User with that email or username already exists" });
            }
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            // Create user
            const user = await prisma.user.create({
                data: {
                    email,
                    username,
                    password: hashedPassword,
                },
            });
            // Generate JWT
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret", {
                expiresIn: "7d",
            });
            res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                },
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Registration failed" });
        }
    });
    // Login
    router.post("/login", async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: "Email and password required" });
            }
            // Find user
            const user = await prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            // Check password
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            // Generate JWT
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret", {
                expiresIn: "7d",
            });
            res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                },
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Login failed" });
        }
    });
    // Get current user
    router.get("/me", authMiddleware, async (req, res) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.userId },
            });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json({
                id: user.id,
                email: user.email,
                username: user.username,
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to get user" });
        }
    });
    return router;
}
//# sourceMappingURL=auth.js.map