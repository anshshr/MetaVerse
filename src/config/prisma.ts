import { PrismaClient } from "../generated/prisma/client.js";
import * as dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config();
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });
