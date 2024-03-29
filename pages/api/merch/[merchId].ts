// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { PrismaClient, Merchandise, Prisma } from "@prisma/client";
import { MERCH_PROFILE_BUCKET } from "../../../lib/constant";
import { updatedMerchandise } from "../../../lib/prisma/merchandise-prisma";
import {
  uploadImage,
  retrieveImageUrl,
  checkIfStringIsBase64,
} from "../../../lib/supabase";

const prisma = new PrismaClient();
type UserWithTicketsandMerch = Prisma.UserGetPayload<{
  include: { tickets: true; merchandise: true };
}>;

type MerchandiseWithUser = Prisma.MerchandiseGetPayload<{
  include: { users: true };
}>;

/**
 * @swagger
 * /api/merch/{merchId}:
 *   get:
 *     description: Returns a single Merchandise object
 *     parameters:
 *       - in: path
 *         name: merchId
 *         required: true
 *         description: String ID of the Merchandise to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Merchandise object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Merchandise"
 *   post:
 *     description: Updates a single Merchandise object
 *     parameters:
 *       - in: object
 *         name: Merchandise
 *         required: true
 *         description: Merchandise object to update
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/Merchandise"
 *     responses:
 *       200:
 *         description: A single Merchandise object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Merchandise"
 *   delete:
 *     description: Delete a single Merchandise object
 *     parameters:
 *       - in: path
 *         name: merchId
 *         required: true
 *         description: String ID of the Merchandise to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The deleted Ticket object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Ticket"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Merchandise | ErrorResponse | {}>
) {
  const { query, method } = req;
  let merchId = parseInt(query.merchId as string);
  let userId = parseInt(query.userId as string);

  switch (req.method) {
    case "GET":
      await handleGET(merchId);
      break;
    case "POST":
      const merch = JSON.parse(JSON.stringify(req.body)) as MerchandiseWithUser;
      await handlePOST(merchId, merch, userId);
      break;
    case "DELETE":
      await handleDELETE(merchId);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(merchId: number) {
    try {
      const merch = await prisma.merchandise.findUnique({
        where: {
          merchId: merchId,
        },
      });

      if (!merch) res.status(200).json({});
      else res.status(200).json(merch);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(
    merchId: number,
    merch: MerchandiseWithUser,
    userId: number | undefined
  ) {
    try {
      const { image } = merch;
      let merchUrl = "";

      if (image && checkIfStringIsBase64(image)) {
        const { data, error } = await uploadImage(MERCH_PROFILE_BUCKET, image);
        if (error) {
          const errorResponse = handleError(error);
          res.status(400).json(errorResponse);
        }

        if (data)
          merchUrl = await retrieveImageUrl(MERCH_PROFILE_BUCKET, data.path);
      }

      const updatedMerchInfo = {
        ...merch,
        users: { connect: { userId: userId } },
      };
      console.log(merchUrl);

      if (merchUrl) updatedMerchInfo.image = merchUrl;
      const response = await updatedMerchandise(merchId, updatedMerchInfo);
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
      console.log(errorResponse);
    }
  }

  async function handleDELETE(merchId: number) {
    try {
      const response = await prisma.merchandise.delete({
        where: {
          merchId: merchId,
        },
      });
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
