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

export function castAppropriateType(object: any) {
  try {
    console.log("original", object);
    const castObject = {} as any;
    for (const property in object) {
      // if (Boolean(object[property])) {
      //   castObject[property] =
      //     (object[property] == "false") != Boolean(object[property]);
      // } else if (Number(object[property]))
      //   castObject[property] = Number(object[property]);

      if (Number(object[property])) {
        castObject[property] = Number(object[property]);
      } else if (Boolean(object[property])) {
        castObject[property] =
          (object[property] == "false") != Boolean(object[property]);
      }
    }
    return castObject;
  } catch (error) {
    console.log(error);
  }
}
export function checkIfRequireSuggestions(url: string): Boolean {
  if (url.includes("suggestions")) return true;
  else return false;
}

export function transformPropertyToContains(object: any) {
  const castObject = {} as any;

  console.log(object);
  for (const property in object) {
    castObject[property] = {
      contains: object[property],
    };
  }
  return castObject;
}
