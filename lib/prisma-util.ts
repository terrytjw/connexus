import { Prisma } from "@prisma/client";

export function handleError(error: any): ErrorResponse {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const errorResponse: ErrorResponse = {
      error: error.code,
      message: error.message,
    };
    return errorResponse;
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    const errorResponse: ErrorResponse = {
      error: "400",
      message: error.message,
    };
    return errorResponse;
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    const errorResponse: ErrorResponse = {
      error: "400",
      message: error.message,
    };
    return errorResponse;
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    const errorResponse: ErrorResponse = {
      error: error.errorCode ? error.errorCode : "400",
      message: error.message,
    };
    return errorResponse;
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    const errorResponse: ErrorResponse = {
      error: "400",
      message: error.message,
    };
    return errorResponse;
  } else {
    const errorResponse: ErrorResponse = {
      error: "400",
      message: "Something went wrong",
    };
    return errorResponse;
  }
}

export type ErrorResponse = {
  error: string;
  message: string;
};
