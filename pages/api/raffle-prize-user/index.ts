// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RafflePrizeUser } from "@prisma/client";

import { saveRafflePrizeUser } from "../../../lib/prisma/raffle-prisma";
import { ErrorResponse, handleError } from "../../../lib/prisma/prisma-helpers";

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
  const { method } = req;

  switch (req.method) {
    case "POST":
      const { rafflePrizeId, userId } = req.body;

      console.log("testtest ->", rafflePrizeId, userId);
      await handlePOST(rafflePrizeId, userId);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST(rafflePrizeId: number, userId: number) {
    try {
      const response = await saveRafflePrizeUser(rafflePrizeId, userId);
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
