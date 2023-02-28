// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, Collection, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();
type CollectionwithMerch = Prisma.CollectionGetPayload<{
  include: { merchandise: true };
}>;

/**
 * @swagger
 * /api/collections/{collectionId}:
 *   get:
 *     description: Returns a single Collection object
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         required: true
 *         description: String ID of the Collection to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Collection object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Collection"
 *   post:
 *     description: Updates a single Collection object
 *     parameters:
 *       - in: object
 *         name: Collection
 *         required: true
 *         description: Collection object to update
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/Collection"
 *     responses:
 *       200:
 *         description: A single Collection object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Collection"
 *   delete:
 *     description: Delete a single Collection object
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         required: true
 *         description: String ID of the Collection to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The deleted Collection object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Collection"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Collection | ErrorResponse | {}>
) {
  const { query, method } = req;
  let collectionId = parseInt(query.collectionId as string);

  switch (req.method) {
    case "GET":
      await handleGET(collectionId);
      break;
    case "POST":
      const collection = JSON.parse(JSON.stringify(req.body)) as Collection;
      await handlePOST(collectionId, collection);
      break;
    case "DELETE":
      await handleDELETE(collectionId);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(collectionId: number) {
    try {
      const collection = await prisma.collection.findUnique({
        where: {
          collectionId: collectionId,
        },
        include: { merchandise: true },
      });

      if (!collection) res.status(200).json({});
      else res.status(200).json(collection);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(
    collectionId: number,
    collectionwithMerch: Collection
  ) {
    try {
      const response = await prisma.collection.update({
        where: {
          collectionId: collectionId,
        },
        data: { ...collectionwithMerch, collectionId: undefined },
      });
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handleDELETE(collectionId: number) {
    try {
      const response = await prisma.collection.delete({
        where: {
          collectionId: collectionId,
        },
      });
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
