import {
  Prisma,
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
  rafflePrizeId: number,
  userId: number
) {
  return prisma.rafflePrizeUser.create({
    data: {
      prizeWon: {
        connect: {
          rafflePrizeId: rafflePrizeId,
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

export async function updateRafflePrizes(
  rafflePrizeId: number,
  rafflePrize: RafflePrize
) {
  return prisma.rafflePrize.update({
    where: {
      rafflePrizeId: rafflePrizeId,
    },
    data: {
      ...rafflePrize,
      rafflePrizeId: undefined,
    },
  });
}

export async function updateRaffle(raffleId: number, raffles: Raffles) {
  return prisma.raffles.update({
    where: {
      raffleId: raffleId,
    },
    data: {
      ...raffles,
      raffleId: undefined,
    },
    include: { event: true },
  });
}
