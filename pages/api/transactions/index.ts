import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { Transaction } from "@prisma/client";
import { createTransaction } from "../../../lib/prisma/transaction-prisma";

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     description: Create a Transaction object. userId are required.
 *     requestBody:
 *       name: Transaction
 *       required: true
 *       description: Transaction object to create
 *       application/json:
 *       schema:
 *         $ref: "#/components/schemas/Transaction"
 *     responses:
 *       200:
 *         description: The created Transaction object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Transaction"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Transaction | ErrorResponse>
) {
  const { method, body } = req;

  switch (method) {
    case "POST":
      const transaction = JSON.parse(JSON.stringify(body)) as Transaction;
      await handlePOST(transaction);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST(transaction: Transaction) {
    try {
      const response = await createTransaction(transaction);
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
