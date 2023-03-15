import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { PrismaClient, Channel } from "@prisma/client";
import { createChannel, getAllChannelsInCommunity } from "../../../lib/prisma/channel-prisma";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/channel:
 *   get:
 *     description: Returns a list of Channel objects
 *     responses:
 *       200:
 *         description: A list of Channel objects
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Channel"
 *   post:
 *     description: Create a Channel object. communityId and userId of creator are required
 *     requestBody:
 *       name: Channel
 *       required: true
 *       description: Channel object to create
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/Channel"
 *     responses:
 *       200:
 *         description: The created Channel object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Channel"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Channel[] | ErrorResponse>
) {
  const { method, body, query } = req;

  switch (method) {
    case "GET":
      const communityId = parseInt(query.communityId as string);
      await handleGET(communityId);
      break;
    case "POST":
      const channel = JSON.parse(JSON.stringify(body)) as Channel;
      await handlePOST(channel);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(communityId: number) {
    try {
      const channels = await getAllChannelsInCommunity(communityId);
      res.status(200).json(channels);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(channel: Channel) {
    try {
      const response = await createChannel(channel);
      res.status(200).json([response]);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
