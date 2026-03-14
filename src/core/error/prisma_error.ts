import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/client";

export function prismaErrorMessage(error: any): string {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P1000":
        return "Database authentication failed. Check DATABASE_URL username/password.";
      case "P1001":
        return "Database is unreachable. Check host/port and ensure DB is running.";
      case "P1002":
        return "Database connection timed out. Please try again.";
      case "P2002":
        return "This value already exists.";
      case "P2025":
        return "Requested resource not found.";
      case "P2003":
        return "Invalid reference provided.";
      case "P2011":
        return "A required field is missing.";
      case "P2012":
        return "Missing required input data.";
      case "P2000":
        return "Input value is too long.";
      case "P2014":
        return "Relation constraint violation.";
      case "P2016":
        return "No matching record found.";
      case "P2010":
        return "Database query failed.";
      case "P2004":
        return "Database constraint failed.";
      default:
        return "Something went wrong. Please try again.";
    }
  } else if (error instanceof PrismaClientUnknownRequestError) {
    return "Something went wrong. Please try again later.";
  } else if (error instanceof PrismaClientRustPanicError) {
    return "Something went wrong on our side.";
  } else if (error instanceof PrismaClientInitializationError) {
    return "We are unable to connect to the server right now.";
  } else if (error instanceof PrismaClientValidationError) {
    return "Some fields may be missing or contain invalid values.";
  } else {
    return "Something occured that we are not able to figure out but we will do it soon";
  }
}
