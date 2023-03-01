// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, Address } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/addresses/{addressId}:
 *   get:
 *     description: Returns a single Address object
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         description: String ID of the Address to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Address object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Address"
 *   post:
 *     description: Updates a single Address object
 *     parameters:
 *       - in: object
 *         name: Address
 *         required: true
 *         description: Address object to update
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/Address"
 *     responses:
 *       200:
 *         description: A single Address object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Address"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Address | ErrorResponse | {}>
) {
  const { query, method } = req;
  let addressId = parseInt(query.addressId as string);

  switch (req.method) {
    case "GET":
      await handleGET(addressId);
      break;
    case "POST":
      const address = JSON.parse(JSON.stringify(req.body)) as Address;
      await handlePOST(addressId, address);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(addressId: number) {
    try {
      const address = await prisma.address.findUnique({
        where: {
          addressId: addressId,
        },
      });

      if (!address) res.status(200).json({});
      else res.status(200).json(address);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(addressId: number, address: Address) {
    try {
      const response = await prisma.address.update({
        where: {
          addressId: addressId,
        },
        data: { ...address, addressId: undefined },
      });
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
      console.log(errorResponse);
    }
  }
}
