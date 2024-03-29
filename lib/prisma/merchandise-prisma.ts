import { PrismaClient, Merchandise } from "@prisma/client";
import axios from "axios";
import prisma from ".";

export interface MerchandisePartialType extends Partial<Merchandise> {}
export enum MerchandisePriceType {
  FREE,
  PAID,
}

export async function createMerchandise(merchandise: Merchandise) {
  return prisma.merchandise.create({
    data: { ...merchandise, merchId: undefined },
  });
}

export async function searchMerchandise(searchType: MerchandisePartialType) {
  return prisma.merchandise.findFirst({
    where: {
      ...searchType,
    },
  });
}

export async function searchMerchandiseByUser(
  userId: number,
  keyword: string,
  cursor: number,
  priceType?: MerchandisePriceType
) {
  const filterCondition =
    priceType == MerchandisePriceType.FREE
      ? { equals: 0 }
      : priceType == MerchandisePriceType.PAID
      ? { gt: 0 }
      : undefined;
  return prisma.merchandise.findMany({
    take: 10,
    skip: cursor ? 1 : undefined, // Skip cursor
    cursor: cursor ? { merchId: cursor } : undefined,
    where: {
      users: {
        some: { userId: userId },
      },
      name: {
        contains: keyword,
        mode: "insensitive",
      },
      price: filterCondition,
    },
    include: {
      collection: { select: { collectionName: true } },
    },
  });
}

export function filterMerchandiseByPriceType(
  cursor: number,
  collectionId: number,
  priceType: MerchandisePriceType
) {
  console.log(cursor, collectionId, priceType);
  const filterCondition =
    priceType == MerchandisePriceType.FREE ? { equals: 0 } : { gt: 0 };

  console.log(filterCondition);
  return prisma.merchandise.findMany({
    take: 10,
    skip: cursor ? 1 : undefined, // Skip cursor
    cursor: cursor ? { merchId: cursor } : undefined,
    where: { collectionId: collectionId, price: filterCondition },
  });
}

//   //this is what we should do

//   const response = await axios.get(
//     "http://localhost:3000/api/merch?cursor=1&collectionId=1&priceType=0"
//   );

//   // =========================================================
//   // EXAMPLE: xxx.com/api/merch?cursor=1&collectionId=1&priceType=0
//   // =========================================================
//   // export const callDummyApi = async <T>(
//   //   route: string,
//   //   options: RequestOptions
//   // ): Promise<T> => {
//   //   const { accessToken, method, body, headers, signal } = options;
//   //   if (accessToken) {
//   //     const res = await window.fetch(`${API_HOST_V2}/${route}`, {
//   //       method,
//   //       headers: {
//   //         ...headers,
//   //         Authorization: `Bearer ${accessToken}`,
//   //       },
//   //       body,
//   //       signal,
//   //     });
//   //     return parseAPIResponse(res);
//   //   } else {
//   //     throw new AuthorizationError(
//   //       "Called authenticated API without accesstoken"
//   //     );
//   //   }
//   // };
// }

export async function findAllMerchandise() {
  return prisma.merchandise.findMany();
}

export async function deleteMerchandise(merchId: number) {
  return prisma.merchandise.delete({
    where: {
      merchId: merchId,
    },
  });
}

export async function updatedMerchandise(
  merchId: number,
  updateType: MerchandisePartialType
) {
  return prisma.merchandise.update({
    where: {
      merchId: merchId,
    },
    data: { ...updateType, merchId: undefined },
  });
}
