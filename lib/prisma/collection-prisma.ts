import { PrismaClient, Collection, CollectionState } from "@prisma/client";
import { CollectionsGETParams } from "../../pages/api/collections";
import { CollectionWithMerchAndPremiumChannel } from "../api-helpers/collection-api";

export interface CollectionPartialType extends Partial<Collection> {}

const prisma = new PrismaClient();

export async function getCollection(collectionId: number) {
  return prisma.collection.findUnique({
    where: {
      collectionId: collectionId,
    },
    include: {
      creator: { select: { username: true } },
      merchandise: true,
      premiumChannel: true,
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

export async function updateCollection(
  collectionId: number,
  collection: CollectionWithMerchAndPremiumChannel
) {
  // theres some error if i pass a collection with merch/premiumChannel to data, so im taking them out.
  const { creator, merchandise, premiumChannel, ...collectionInfo } = collection;
  return prisma.collection.update({
    where: {
      collectionId: collectionId,
    },
    data: { 
      ...collectionInfo,
      collectionId: undefined,
    },
  });
}

export async function getCollectionsForAnalytics() {
  return await prisma.collection.findMany({
    include: { merchandise: true, analyticsTimestamps: true }
  });
}

export async function getCollectionMerchOwners(collectionId: number) {
  const collection = await prisma.collection.findUnique({
    where: {
      collectionId: collectionId,
    },
    include: {
      merchandise: {
        include: {
          users: {
            select: { userId: true }
          }
        }
      }
    },
  });

  return collection!.merchandise
    .filter(merch => merch.users.length > 0)
    .flatMap(merch => merch.users);
}