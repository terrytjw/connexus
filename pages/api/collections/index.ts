import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, Collection , Prisma} from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

type CollectionwithMerch = Prisma.CollectionGetPayload<{ include: { merchandise: true } }>;

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
  const session = await getServerSession(req, res, authOptions);
  // console.log(session);

  // if (!session) {
  //   res.status(401).json({ error: "401", message: "Unauthorized" });
  // }

  const { method } = req;

  switch (req.method) {
    case "GET":
      await handleGET();
      break;
    case "POST":
      const collection = JSON.parse(JSON.stringify(req.body)) as CollectionwithMerch;
      await handlePOST(collection);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET() {
    try {
      const collections = await prisma.collection.findMany({
        include: {
          merchandise: true,
        },
      });
      res.status(200).json(collections);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(collectionwithMerch: CollectionwithMerch) {
    try {
      const { merchandise, ...collectionInfo } = collectionwithMerch;
      const updatedMerchs = merchandise.map((merch) => {
        const { merchId, collectionId, ...merchInfo } = merch;
        return merchInfo;
      });

      console.log(updatedMerchs); 
      console.log(collectionInfo); 

      const response = await prisma.collection.create({
        data: {
          ...collectionInfo,
          collectionId: undefined,
          merchandise: { create: updatedMerchs },
        },
        include: {
          merchandise: true,
        },
      });
      res.status(200).json([response]);
    } catch (error) {
      console.log(error);
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
