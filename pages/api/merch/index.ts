import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { Merchandise } from "@prisma/client";
import { MERCH_PROFILE_BUCKET } from "../../../lib/constant";
import {
  createMerchandise,
  filterMerchandiseByPriceType,
  findAllMerchandise,
  searchMerchandiseByUser,
} from "../../../lib/prisma/merchandise-prisma";
import {
  checkIfStringIsBase64,
  retrieveImageUrl,
  uploadImage,
} from "./../../../lib/supabase";

export interface MerchandisePartialType extends Partial<Merchandise> {}
export enum MerchandisePriceType {
  FREE,
  PAID,
}

import prisma from "../../../lib/prisma";
import { createProduct } from "../../../lib/stripe/api-helpers";

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
  res: NextApiResponse<Merchandise[] | Merchandise | ErrorResponse>
) {
  const { method, body, query } = req;

  const collectionId = parseInt(query.collectionId as string);
  const priceType = query.priceType as unknown as MerchandisePriceType;
  const cursor = parseInt(query.cursor as string);
  const userId = parseInt(query.userId as string);
  const keyword = query.keyword as string;

  switch (method) {
    case "GET":
      if (query) {
        // await handleGETWithFilter(cursor, collectionId, priceType);
        await handleGETWithKeyword(userId, keyword, cursor, priceType);
      } else {
        await handleGET();
      }
      break;
    case "POST":
      const merch = JSON.parse(JSON.stringify(body)) as Merchandise; //@@ Double check
      await handlePOST(merch);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET() {
    try {
      const merchandises = await findAllMerchandise();
      res.status(200).json(merchandises);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handleGETWithKeyword(
    userId: number,
    keyword: string,
    cursor: number,
    priceType?: MerchandisePriceType
  ) {
    try {
      console.log({ userId, keyword, cursor, priceType });
      const merch = await searchMerchandiseByUser(
        userId,
        keyword,
        cursor,
        priceType
      );
      res.status(200).json(merch);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(merch: Merchandise) {
    try {
      const { image, ...merchInfo } = merch;
      let imageUrl = "";

      if (image && checkIfStringIsBase64(image)) {
        const { data, error } = await uploadImage(MERCH_PROFILE_BUCKET, image);
        if (error) {
          const errorResponse = handleError(error);
          res.status(400).json(errorResponse);
        }

        if (data)
          imageUrl = await retrieveImageUrl(MERCH_PROFILE_BUCKET, data.path);
      }

      console.log(imageUrl);

      const stripePriceId = await createProduct(
        merchInfo.name,
        "", // merchInfo.description,
        imageUrl,
        false,
        merchInfo.price
      );

      const merchandise = {
        ...merchInfo,
        image: imageUrl,
        stripePriceId: stripePriceId,
      } as Merchandise;

      const response = await createMerchandise(merchandise);

      res.status(200).json(response);
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
      const response = await filterMerchandiseByPriceType(
        cursor,
        collectionId,
        priceType
      );
      res.status(200).json(response);
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
