import { PrismaClient, Merchandise } from "@prisma/client";
import axios from "axios";
import prisma from "./prisma";

export interface MerchandisePartialType extends Partial<Merchandise> {}
export enum MerchandisePriceType {
  FREE,
  PAID,
}

export async function searchMerchandise(searchType: MerchandisePartialType) {
  return prisma.merchandise.findFirst({
    where: {
      ...searchType,
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

// export async function filterByMerchandisePurchaseType(
//   cursor: number = 1,
//   collectionId: number,
//   priceType: MerchandisePriceType
// ) {
//   const filterCondition =
//     priceType === MerchandisePriceType.FREE ? { equals: 0 } : { gt: 0 };
//   return prisma.merchandise.findMany({
//     take: 10,
//     skip: cursor ? 1 : undefined, // Skip cursor
//     cursor: cursor ? { merchId: cursor } : undefined,
//     where: {
//       price: filterCondition,
//     },
//   });

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
