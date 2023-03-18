import type { NextApiRequest, NextApiResponse } from "next";
import { Promotion } from "@prisma/client";
import {
  filterPromotion,
  updatePromotion,
} from "../../../../lib/prisma/promotion-prisma";
import {
  ErrorResponse,
  handleError,
} from "../../../../lib/prisma/prisma-helpers";

/**
 * @swagger
 * /api/promotions/:id:
 *   get:
 *     description: The promotion ID
 *     parameters:
 *       - in: query
 *         name: promotionId
 *         required: true
 *         description: Promotion ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns a Promotion object
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Promotion"
 *   post:
 *     description: Update a Promotion object
 *     requestBody:
 *       name: Promotion
 *       required: true
 *       description: Promotion object to update
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

  const promotionId = parseInt(query.promotionId as string);

  switch (method) {
    case "GET":
      await handleGET(promotionId);
      break;
    case "POST":
      const promotion = JSON.parse(JSON.stringify(body)) as Promotion;
      await handlePOST(promotionId, promotion);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(promotionId: number) {
    try {
      const posts = await filterPromotion(
        undefined,
        promotionId,
        undefined,
        undefined
      );
      res.status(200).json(posts);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(promotionId: number, promotion: Promotion) {
    try {
      const response = await updatePromotion(promotionId, promotion);
      res.status(200).json([response]);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
