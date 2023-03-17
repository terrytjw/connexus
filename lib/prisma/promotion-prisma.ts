import { Promotion } from "@prisma/client";
import prisma from ".";

export interface PromotionPartialType extends Partial<Promotion> {}

export async function filterPromotion(
  cursor: number | undefined,
  promotionId: number | undefined,
  ticketId: number | undefined,
  promotionCode: string | undefined
) {
  return prisma.promotion.findMany({
    take: 10,
    skip: cursor ? 1 : undefined, // Skip cursor
    cursor: cursor ? { promotionId: cursor } : undefined,
    where: {
      promotionId: promotionId,
      name: {
        contains: promotionCode,
        mode: "insensitive",
      },
      ticketId: ticketId,
    },
  });
}

export async function createPromotion(promotion: Promotion) {
  return prisma.promotion.create({
    data: { ...promotion, promotionId: undefined },
  });
}

export async function updatePromotion(
  promotionId: number,
  updateType: PromotionPartialType
) {
  return prisma.promotion.update({
    where: {
      promotionId: promotionId,
    },
    data: { ...updateType, promotionId: undefined },
  });
}
