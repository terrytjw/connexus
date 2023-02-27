import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, Merchandise } from "@prisma/client";
import { MERCH_PROFILE_BUCKET } from "../../../lib/constant";
import { retrieveImageUrl, uploadImage } from "./../../../lib/supabase";
import axios from "axios";
// import prisma from "../../../lib/prisma";

export interface MerchandisePartialType extends Partial<Merchandise> {}
export enum MerchandisePriceType {
  FREE,
  PAID,
}

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/merch:
 *   get:
 *     description: Returns a list of Merchandise objects
 *     responses:
 *       200:
 *         description: A list of Merchandise objects
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Merchandise"
 *   post:
 *     description: Create a Merchandise object.
 *     requestBody:
 *       name: Ticket
 *       required: true
 *       description: Merchandise object to create
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/Merchandise"
 *     responses:
 *       200:
 *         description: The created Merchandise object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Merchandise"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Partial<Merchandise[]> | ErrorResponse>
) {
  const { method, body } = req;

  const collectionId = parseInt(body.collectionId as string);

  const priceType = parseInt(
    body.priceType as keyof typeof MerchandisePriceType
  );
  const cursor = parseInt(body.cursor as string);

  if (collectionId || priceType || cursor)
    filterMerchandise(cursor, collectionId, priceType);

  switch (method) {
    case "GET":
      await handleGET();
      break;
    case "POST":
      const merch = JSON.parse(JSON.stringify(body)) as Merchandise;
      await handlePOST(merch);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET() {
    try {
      const merchs = await prisma.merchandise.findMany({});
      res.status(200).json(merchs);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(merch: Merchandise) {
    try {
      const { media, ...merchInfo } = merch;
      let mediaUrl = "";

      if (media) {
        const { data, error } = await uploadImage(MERCH_PROFILE_BUCKET, media);
        if (error) {
          const errorResponse = handleError(error);
          res.status(400).json(errorResponse);
        }

        if (data)
          mediaUrl = await retrieveImageUrl(MERCH_PROFILE_BUCKET, data.path);
      }

      console.log(mediaUrl);

      const response = await prisma.merchandise.create({
        data: { ...merchInfo, media: mediaUrl, merchId: undefined },
      });
      res.status(200).json([response]);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handleGETWithFilter(
    cursor: number,
    collectionId: number,
    priceType: MerchandisePriceType
  ) {
    try {
      const response = (await filterMerchandise(
        cursor,
        collectionId,
        priceType
      )) as Partial<Merchandise>;
      res.status(200).json([response]);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}

// xxx.com/api/merch?cursor=1&collectionId=1&priceType=0
// export async function filterByMerchandisePurchaseType(
//   cursor: number = 1,
//   collectionId: number,
//   priceType: MerchandisePriceType
// ) {
//   const filterCondition =
//     priceType === MerchandisePriceType.FREE ? { equals: 0 } : { gt: 0 };

//   return prisma.merchandise.findMany({
//     take: 10,
//     skip: cursor ? 1 : undefined, // Skip cursor
//     cursor: cursor ? { merchId: cursor } : undefined,
//     // where: {
//     //   price: filterCondition,
//     // },
//   });
// }

export async function filterMerchandise(
  cursor: number,
  collectionId: number,
  priceType: MerchandisePriceType
) {
  const filterCondition =
    priceType === MerchandisePriceType.FREE ? { equals: 0 } : { gt: 0 };

  return prisma.merchandise.findMany({
    take: 10,
    skip: cursor ? 1 : undefined, // Skip cursor
    cursor: cursor ? { merchId: cursor } : undefined,
    where: { collectionId: collectionId, price: filterCondition },
  });
}
