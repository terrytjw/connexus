import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, Collection } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/collections:
 *   get:
 *     description: Returns a list of Collection objects
 *     responses:
 *       200:
 *         description: A list of Collection objects
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Collection"
 *   post:
 *     description: Create a Collection object
 *     parameters:
 *       - in: object
 *         name: Collection
 *         required: true
 *         description: Collection object to create
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/Collection"
 *     responses:
 *       200:
 *         description: The created Collection object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Collection"
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Collection[] | ErrorResponse>
) {
  const { method } = req;

  switch (req.method) {
    case "GET":
      await handleGET();
      break;
    case "POST":
      const collection = JSON.parse(JSON.stringify(req.body)) as Collection;
      await handlePOST(collection);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET() {
    try {
      const collections = await prisma.collection.findMany();
      res.status(200).json(collections);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(collection: Collection) {
    try {
      const response = await prisma.collection.create({
        data: { ...collection, collectionId: undefined },
      });
      res.status(200).json([response]);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
