import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { PrismaClient,} from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean | ErrorResponse>
) {
  const { method } = req;

  switch (method) {
    case "POST":
      await handlePOST();
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST() {
    try {
      const events = await prisma.event.findMany({
        include: {
          _count: {
            select: { tickets: true }
          }
        }
      });
      for (let event of events) {
        await prisma.eventTicketsSoldTimestamp.create({
          data: {
            ticketsSold: event._count.tickets
            event: {
              connect: {
                postId: event.eventId
              }
            }
          }
        });
      }
      res.status(200).json(true);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
