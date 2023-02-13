import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, Channel } from "@prisma/client";

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
  const { method, body } = req;

  switch (method) {
    case "GET":
      await handleGET();
      break;
    case "POST":
      const channel = JSON.parse(JSON.stringify(body)) as Channel
      await handlePOST(channel);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET() {
    try {
      const communities = await prisma.channel.findMany();
      res.status(200).json(communities);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(channel: Channel) {
    try {
      const response = await prisma.channel.create({
        data: { 
          ...channel
        }
      });
      res.status(200).json([response]);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}