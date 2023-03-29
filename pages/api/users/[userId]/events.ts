import { Merchandise, Ticket } from "@prisma/client";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  handleError,
  ErrorResponse,
} from "../../../../lib/prisma/prisma-helpers";
import { PrismaClient, User, Prisma } from "@prisma/client";
import {
  deleteUser,
  searchUser,
  updateUser,
} from "../../../../lib/prisma/user-prisma";
import { USER_PROFILE_BUCKET } from "../../../../lib/constant";
import {
  uploadImage,
  retrieveImageUrl,
  checkIfStringIsBase64,
} from "../../../../lib/supabase";
import { searchEventByUser } from "../../../../lib/prisma/event-prisma";

export type UserWithAllInfo = Prisma.UserGetPayload<{
  include: {
    tickets: true;
    merchandise: true;
    joinedChannels: true;
    joinedCommunities: true;
    createdCommunities: true;
    bankAccount: true;
    transactions: true;
  };
}>;

/**
 * @swagger
 * /api/users/{userId}/events:
 *   get:
 *     description: Returns a single User object
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: String ID of the User to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single User object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
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
  res: NextApiResponse<UserWithAllInfo | ErrorResponse | {}>
) {
  const { query, method } = req;

  let userId = parseInt(query.userId as string);
  let isCreated = (query.isCreated as string) == "true";

  switch (req.method) {
    case "GET":
      await handleGET(userId, isCreated);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(userId: number, isCreated: boolean) {
    try {
      const user = await searchEventByUser(userId, isCreated);
      if (!user) res.status(200).json({});
      else res.status(200).json(user);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
