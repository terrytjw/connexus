// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Event, User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "../../../prisma/generated/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/events:
 *   get:
 *     description: Returns a list of @event
 *     responses:
 *       200:
 *         description: hello world
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Event[]>
) {
  if (req.method === "GET") {
    const events = await prisma.event.findMany();
    res.status(200).json(events);
  }
}
