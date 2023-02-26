import { PrismaClient, Merchandise } from "@prisma/client";

export interface MerchandisePartialType extends Partial<Merchandise> {}

const prisma = new PrismaClient();


export async function searchMerchandise(searchType: MerchandisePartialType) {
  return prisma.merchandise.findFirst({
    where: {
      ...searchType,
    },
  });
}

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

export async function updatedMerchandise(merchId: number, updateType: MerchandisePartialType) {
  return prisma.merchandise.update({
    where: {
      merchId: merchId,
    },
    data: { ...updateType, merchId: undefined },
  });
}
