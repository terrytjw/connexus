import {
  Prisma,
  PrismaClient,
  RafflePrize,
  RafflePrizeUser,
  Raffles,
} from "@prisma/client";

const prisma = new PrismaClient();

export type RafflesWithPrizes = Prisma.RafflesGetPayload<{
  include: { rafflePrizes: true };
}>;

export async function saveRaffles(eventId: number, raffles: RafflesWithPrizes) {
  const rafflePrizeData = raffles.rafflePrizes.map((prize) => ({
    name: prize.name,
  }));

  return prisma.raffles.create({
    data: {
      event: {
        connect: {
          eventId: eventId,
        },
      },
      ...raffles,
      raffleId: undefined,
      eventId: undefined,
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

export async function createafflePrizes(rafflePrize: RafflePrize) {
  return prisma.rafflePrize.create({
    data: {
      ...rafflePrize,
      rafflePrizeId: undefined,
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

export async function updateRaffle(
  raffleId: number,
  raffles: RafflesWithPrizes
) {
  // raffles.rafflePrizes.forEach(async (prize) => {
  //   if (prize.rafflePrizeId) {
  //     await updateRafflePrizes(prize.rafflePrizeId, prize);
  //   } else {
  //     await createafflePrizes(prize);
  //   }
  // });

  const { rafflePrizes, ...updatedRaffles } = raffles;

  await prisma.rafflePrize.deleteMany({
    where: {
      rafflesId: raffleId,
    },
  });

  return prisma.raffles.update({
    where: {
      raffleId: raffleId,
    },
    data: {
      ...updatedRaffles,
      raffleId: undefined,
      rafflePrizes: {
        createMany: {
          data: rafflePrizes.map((prize) => ({ name: prize.name })),
        },
      },
    },
    include: {
      event: true,
      rafflePrizes: {
        select: {
          rafflePrizeId: true,
        },
        orderBy: {
          rafflePrizeId: "asc",
        },
      },
    },
  });
}
