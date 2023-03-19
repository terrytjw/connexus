// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { updateRafflePrizeUser } from "../../../../lib/prisma/raffle-prisma";
import { RafflePrizeUser } from "@prisma/client";
import {
  ErrorResponse,
  handleError,
} from "../../../../lib/prisma/prisma-helpers";

/**
 * Todo: Add swagger documentation
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb", // Set desired value here
    },
  },
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RafflePrizeUser | ErrorResponse | {}>
) {
  const { method, query } = req;

  const rafflePrizeUserId = parseInt(query.rafflePrizeUserId as string);

  switch (req.method) {
    case "POST":
      const rafflePrizeUser = JSON.parse(
        JSON.stringify(req.body)
      ) as RafflePrizeUser;
      await handlePOST(rafflePrizeUserId, rafflePrizeUser);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST(
    rafflePrizeUserId: number,
    rafflePrizeUser: RafflePrizeUser
  ) {
    try {
      const response = await updateRafflePrizeUser(
        rafflePrizeUserId,
        rafflePrizeUser
      );
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
