import { PrismaClient, Collection } from "@prisma/client";

export interface CollectionPartialType extends Partial<Collection> {}

const prisma = new PrismaClient();

export async function getCollection(collectionId: number) {
  return prisma.collection.findUnique({
    where: {
      collectionId: collectionId,
    },
    include: { 
      merchandise: true
      premiumChannel: { select: { name: true }}
    },
  });
}