import { ZodError } from "zod";
import { ZodErrorMessage } from "./zod_error.js";
import { prismaErrorMessage } from "./prisma_error.js";

export function customErrorMessgae(error: any): string {
  if (error instanceof ZodError) return ZodErrorMessage(error);
  else if (typeof error === "string") return error;
  else return prismaErrorMessage(error);
}
