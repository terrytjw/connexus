import {
  PrismaClient,
  RafflePrize,
  RafflePrizeUser,
  Raffles,
} from "@prisma/client";

const prisma = new PrismaClient();

export async function saveRaffles(
  eventId: number,
  rafflesPrizes: RafflePrize[]
) {
  const rafflePrizeData = rafflesPrizes.map((prize) => ({ name: prize.name }));

  return prisma.raffles.create({
    data: {
      event: {
        connect: {
          eventId: eventId,
        },
      },
      rafflePrizes: {
        createMany: {
          data: rafflePrizeData,
        },
      },
    },
  });
}

export async function saveRafflePrizeUser(
  rafflePriceId: number,
  userId: number
) {
  return prisma.rafflePrizeUser.create({
    data: {
      prizeWon: {
        connect: {
          rafflePrizeId: rafflePriceId,
        },
      },
      user: {
        connect: {
          userId: userId,
        },
      },
    },
  });
}

export async function updateRafflePrizeUser(
  rafflePrizeUserId: number,
  rafflePrizeUser: RafflePrizeUser
) {
  return prisma.rafflePrizeUser.update({
    where: {
      rafflePrizeUserId: rafflePrizeUserId,
    },
    data: {
      ...rafflePrizeUser,
    },
  });
}
