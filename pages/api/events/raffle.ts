// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { PrismaClient, Comment, Raffles, Prisma } from "@prisma/client";
import { likeEvent } from "../../../lib/prisma/event-prisma";
import {
  updateRaffle,
  updateRafflePrizes,
} from "../../../lib/prisma/raffle-prisma";
import { updateRafflePrize } from "../../../lib/api-helpers/user-api";

const prisma = new PrismaClient();

type RaffleWithAllInfo = Prisma.RafflesGetPayload<{
  include: {
    rafflePrizes: {
      include: { rafflePrizeUser: true };
    };
    rafflePrizeUser: true;
  };
}>;
/**
 * @swagger
 * /api/events/{EventId}/raffle
 *   comment:
 *     description: Updates an Raffle object
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: Event ID of the Event to update.
 *         schema:
 *           type: string
 *       - in: query
 *         name: raffleId
 *         required: true
 *         description: Raffles ID of the Raffles to update.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Raffles object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Raffles"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Event | ErrorResponse | {}>
) {
  const { query, method, body } = req;

  switch (req.method) {
    case "POST":
      const raffleObject = JSON.parse(JSON.stringify(body));
      await handlePOST(raffleObject.raffleId, raffleObject.raffles);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST(raffleId: number, raffles: RaffleWithAllInfo) {
    try {
      const { rafflePrizes, ...updatedRaffles } = raffles;

      // rafflePrizes.forEach(async (rafflePrize) => {
      //   await updateRafflePrizes(rafflePrize.rafflePrizeId, rafflePrize);
      // });
      const response = await updateRaffle(raffleId, raffles);
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
