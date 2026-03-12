import { ZodError } from "zod";

export function ZodErrorMessage(error: ZodError): string {
  return JSON.parse(error as unknown as string)[0].message;
}
