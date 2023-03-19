import { Merchandise, Ticket, Transaction } from "@prisma/client";
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
import { createTransaction } from "../../../../lib/prisma/transaction-prisma";

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
 * /api/users/{userId}:
 *   post:
 *     description: Updates a single User object
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: String ID of the User to update.
 *         schema:
 *           type: string
 *       - in: object
 *         name: User
 *         required: true
 *         description: User object to update
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/User"
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

  switch (req.method) {
    case "POST":
      const user = JSON.parse(JSON.stringify(req.body)) as UserWithAllInfo;
      await handlePOST(userId);
      break;
    case "DELETE":
      await handleDELETE(userId);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST(userId: number) {
    try {
      const userInfo = await searchUser({ userId });
      if (!userInfo) res.status(200).json({ message: "user not found" });

      const walletBalance = userInfo?.walletBalance ?? 0;

      if (walletBalance <= 0)
        res.status(200).json({ message: "Not enough balance" });
      else {
        const newTransaction = {
          userId: userId,
          amount: walletBalance,
        } as Transaction;

        await createTransaction(newTransaction);

        const response = await updateUser(userId, {
          walletBalance: 0,
        });

        res.status(200).json(response);
      }
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handleDELETE(userId: number) {
    try {
      const response = await deleteUser(userId);
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
