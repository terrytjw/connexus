import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { Promotion } from "@prisma/client";
import {
  createPromotion,
  filterPromotion,
} from "../../../lib/prisma/promotion-prisma";

/**
 * @swagger
 * /api/promotions:
 *   get:
 *     description: Returns a list of Promotion objects
 *     parameters:
 *       - in: query
 *         name: promotionId
 *         required: true
 *         description: Promotion ID of the channel
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of Promotion objects
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Promotion"
 *   post:
 *     description: Create a Promotion object.
 *     requestBody:
 *       name: Promotion
 *       required: true
 *       description: Promotion object to create
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/Promotion"
 *     responses:
 *       200:
 *         description: The created Promotion object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Promotion"
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Promotion[] | ErrorResponse>
) {
  const { method, body, query } = req;

  const promotionCode = query.promotionCode as string;
  const eventId = query.eventId ? parseInt(query.eventId as string) : undefined;

  const promotionId = query.promotionId
    ? parseInt(query.promotionId as string)
    : undefined;

  switch (method) {
    case "GET":
      await handleGET();
      break;
    case "POST":
      const promotion = JSON.parse(JSON.stringify(body)) as Promotion;
      await handlePOST(promotion);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET() {
    try {
      const promotions = await filterPromotion(
        undefined,
        promotionId,
        eventId,
        promotionCode
      );
      res.status(200).json(promotions);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(promotion: Promotion) {
    try {
      const response = await createPromotion(promotion);
      res.status(200).json([response]);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
