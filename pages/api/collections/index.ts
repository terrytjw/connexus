import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import {
  PrismaClient,
  Collection,
  Prisma,
  Merchandise,
  CategoryType,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { MERCH_PROFILE_BUCKET } from "../../../lib/constant";
import {
  deleteMerchandise,
  MerchandisePartialType,
  searchMerchandise,
  updatedMerchandise,
} from "../../../lib/merch";
import { retrieveImageUrl, uploadImage } from "../../../lib/supabase";
const prisma = new PrismaClient();

type CollectionwithMerch = Prisma.CollectionGetPayload<{
  include: { merchandise: true };
}>;

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
  // const session = await getServerSession(req, res, authOptions);
  // console.log(session);

  // if (!session) {
  //   res.status(401).json({ error: "401", message: "Unauthorized" });
  // }

  const { method, body, query } = req;

  const userId = parseInt(query.userId as string);
  const keyword = query.keyword as string;
  const cursor = parseInt(query.cursor as string);

  switch (req.method) {
    case "GET":
      if (query) {
        await handleGETWithKeyword(userId, keyword, cursor);
      }
      break;
    case "POST":
      const collection = JSON.parse(
        JSON.stringify(req.body)
      ) as CollectionwithMerch;
      await handlePOST(collection);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGETWithKeyword(
    userId: number,
    keyword: string,
    cursor: number
  ) {
    try {
      const collections = await prisma.collection.findMany({
        take: 10,
        skip: cursor ? 1 : undefined, // Skip cursor
        cursor: cursor ? { collectionId: cursor } : undefined,
        orderBy: {
          collectionId: "asc",
        },
        where: {
          creatorId: userId,
          collectionName: { contains: keyword, mode: "insensitive" },
        },
      });
      res.status(200).json(collections);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function updateMerchMedia(
    image: string | null,
    merchInfo: MerchandisePartialType
  ) {
    let imageUrl = "";
    if (image) {
      const { data, error } = await uploadImage(MERCH_PROFILE_BUCKET, image);
      if (error) {
        const errorResponse = handleError(error);
        res.status(400).json(errorResponse);
      }

      if (data)
        imageUrl = await retrieveImageUrl(MERCH_PROFILE_BUCKET, data.path);
    }

    console.log(imageUrl);
    if (imageUrl) merchInfo.image = imageUrl;
    return merchInfo;
  }

  async function handlePOST(collectionwithMerch: CollectionwithMerch) {
    try {
      const { merchandise, ...collectionInfo } = collectionwithMerch;
      const updatedMerchs = await Promise.all(
        merchandise.map(async (merch: Merchandise) => {
          const { merchId, collectionId, image, ...merchInfo } = merch;
          let updatedMerchInfo = await updateMerchMedia(image, merchInfo);
          return updatedMerchInfo;
        })
      );

      console.log(updatedMerchs);
      console.log(collectionInfo);

      const response = await prisma.collection.create({
        data: {
          ...collectionInfo,
          collectionId: undefined,
          merchandise: { create: updatedMerchs as Merchandise[] },
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
