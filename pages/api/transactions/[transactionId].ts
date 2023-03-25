import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { Transaction } from "@prisma/client";
import {
  createTransaction,
  updateTransaction,
} from "../../../lib/prisma/transaction-prisma";

/**
 * @swagger
 * /api/transactions/:id:
 *   post:
 *     description: Update a Transaction object. transactionId are required.
 *     requestBody:
 *       name: Transaction
 *       required: true
 *       description: Transaction object to update
 *       application/json:
 *       schema:
 *         $ref: "#/components/schemas/Transaction"
 *     responses:
 *       200:
 *         description: The updated Transaction object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Transaction"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Transaction | ErrorResponse>
) {
  const { method, body, query } = req;
  let transactionId = parseInt(query.transactionId as string);

  switch (method) {
    case "POST":
      const transaction = JSON.parse(JSON.stringify(body)) as Transaction;
      await handlePOST(transactionId, transaction);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST(transactionId: number, transaction: Transaction) {
    try {
      const response = await updateTransaction(transactionId, transaction);
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
