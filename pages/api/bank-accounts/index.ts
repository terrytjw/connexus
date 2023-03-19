import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { PrismaClient, Channel, BankAccount } from "@prisma/client";
import {
  createChannel,
  getAllChannelsInCommunity,
} from "../../../lib/prisma/channel-prisma";
import { upsertBankAccount } from "../../../lib/prisma/bank-account-prisma";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/bank-accounts:
 *   post:
 *     description: Create a Bank Account object. userId of creator are required
 *     requestBody:
 *       name: Bank Account
 *       required: true
 *       description: Bank Account object to create
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/BankAccount"
 *     responses:
 *       200:
 *         description: The created Bank Account object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BankAccount"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BankAccount | ErrorResponse>
) {
  const { method, body } = req;

  switch (method) {
    case "POST":
      const bankAccount = JSON.parse(JSON.stringify(body)) as BankAccount;
      await handlePOST(bankAccount);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST(bankAccount: BankAccount) {
    try {
      const response = await upsertBankAccount(bankAccount);
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
