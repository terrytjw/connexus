// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  handleError,
  ErrorResponse,
} from "../../../../lib/prisma/prisma-helpers";
import { PrismaClient, Channel } from "@prisma/client";
import { deleteChannel, getChannel, updateChannel } from "../../../../lib/prisma/channel-prisma";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/channel/{channelId}
 *   get:
 *     description: Returns a single Channel object
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         description: String ID of the Channel to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Channel object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Channel"
 *   post:
 *     description: Updates a single Channel object
 *     parameters:
 *       - in: path
 *         name: channelid
 *         required: true
 *         description: String ID of the Channel to retrieve.
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/Channel"
 *     requestBody:
 *       name: Channel
 *       required: true
 *       description: Channel object to create
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/Channel"
 *     responses:
 *       200:
 *         description: A single Channel object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Channel"
 *   delete:
 *     description: Delete a single Channel object
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         description: String ID of the Channel to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The deleted Channel object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Channel"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Channel | ErrorResponse | {}>
) {
  const { query, method } = req;
  const channelId = parseInt(query.channelId as string);

  switch (req.method) {
    case "GET":
      await handleGET(channelId);
      break;
    case "POST":
      const channel = JSON.parse(JSON.stringify(req.body)) as Channel;
      await handlePOST(channelId, channel);
      break;
    case "DELETE":
      await handleDELETE(channelId);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(channelId: number) {
    try {
      const channel = await getChannel(channelId);

      if (!channel) res.status(200).json({});
      else res.status(200).json(channel);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(channelId: number, channel: Channel) {
    try {
      const response = await updateChannel(channelId, channel);
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handleDELETE(channelId: number) {
    try {
      const response = await deleteChannel(channelId);
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
