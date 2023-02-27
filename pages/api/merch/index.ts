import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, Merchandise } from "@prisma/client";
import { MERCH_PROFILE_BUCKET } from "../../../lib/constant";
import {
  deleteMerchandise,
  searchMerchandise,
  updatedMerchandise,
} from "../../../lib/merch";
import { retrieveImageUrl, uploadImage } from "./../../../lib/supabase";

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
  res: NextApiResponse<Merchandise[] | ErrorResponse>
) {
  const { method, body } = req;

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
      const { image, ...merchInfo } = merch;
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

      const response = await prisma.merchandise.create({
        data: { ...merchInfo, image: imageUrl, merchId: undefined },
      });
      res.status(200).json([response]);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
