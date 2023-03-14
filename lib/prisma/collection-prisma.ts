import { PrismaClient, Collection, CollectionState } from "@prisma/client";
import { CollectionsGETParams } from "../../pages/api/collections";

export interface CollectionPartialType extends Partial<Collection> {}

const prisma = new PrismaClient();

export async function getCollection(collectionId: number) {
  return prisma.collection.findUnique({
    where: {
      collectionId: collectionId,
    },
    include: { 
      merchandise: true,
      premiumChannel: { select: { name: true } }
    },
  });
}

export async function searchCollections({
  userId,
  keyword,
  cursor,
  collectionState,
  isLinked,
  omitSold
}: CollectionsGETParams) {
  return prisma.collection.findMany({
    take: 10,
    skip: cursor ? 1 : undefined, // Skip cursor
    cursor: cursor ? { collectionId: cursor } : undefined,
    where: {
      creatorId: userId ? userId : undefined,
      collectionName: { contains: keyword, mode: "insensitive" },
      collectionState: 
        omitSold
          ? undefined
          : collectionState
          ? collectionState
          : undefined,
      NOT: 
        omitSold
          ? { collectionState: CollectionState.SOLD }
          : undefined,
      premiumChannel: 
        isLinked 
          ? { is: {} }
          : isLinked === undefined
          ? undefined
          : { isNot: {} }
    },
    include: { merchandise: true, premiumChannel: true },
  });
}