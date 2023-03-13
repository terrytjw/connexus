import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import {
  PrismaClient,
  Event,
  Prisma,
  CategoryType,
  Ticket,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import {
  checkIfStringIsBase64,
  retrieveImageUrl,
  uploadImage,
} from "./../../../lib/supabase";
import {
  deleteEvent,
  searchEvent,
  updateEvent,
} from "../../../lib/prisma/event-prisma";
import { EVENT_PROFILE_BUCKET } from "../../../lib/constant";

const prisma = new PrismaClient();

type EventWithTickets = Prisma.EventGetPayload<{ include: { tickets: true } }>;

/**
 * @swagger
 * /api/events:
 *   get:
 *     description: Returns a list of Event objects
 *     responses:
 *       200:
 *         description: A list of Event objects
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Event"
 *   post:
 *     description: Create a Event object
 *     parameters:
 *       - in: object
 *         name: Event
 *         required: true
 *         description: Event object to create
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/Event"
 *     responses:
 *       200:
 *         description: The created Event object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Event"
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Event[] | ErrorResponse>
) {
  const session = await getServerSession(req, res, authOptions);
  // console.log(session);

  // if (!session) {
  //   res.status(401).json({ error: "401", message: "Unauthorized" });
  // }

  const { method, body, query } = req;

  const keyword = query.keyword as string;
  const cursor = parseInt(query.cursor as string);
  const filter = query.filter as CategoryType[];

  switch (req.method) {
    case "GET":
      if (keyword) {
        await handleGETWithKeyword(keyword, cursor, filter);
      } else {
        await handleGET(cursor, filter);
      }
    case "POST":
      const event = JSON.parse(JSON.stringify(req.body)) as EventWithTickets;
      await handlePOST(event);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(cursor: number, filter?: CategoryType[]) {
    try {
      const events = await prisma.event.findMany({
        take: 10,
        skip: cursor ? 1 : undefined, // Skip cursor
        cursor: cursor ? { eventId: cursor } : undefined,
        orderBy: {
          eventId: "asc",
        },
        where: {
          category: filter
            ? {
                hasSome: filter,
              }
            : undefined,
        },
      });
      res.status(200).json(events);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handleGETWithKeyword(
    keyword: string,
    cursor: number,
    filter?: CategoryType[]
  ) {
    try {
      const events = await prisma.event.findMany({
        take: 10,
        skip: cursor ? 1 : undefined, // Skip cursor
        cursor: cursor ? { eventId: cursor } : undefined,
        orderBy: {
          eventId: "asc",
        },
        where: {
          eventName: {
            contains: keyword,
            mode: "insensitive",
          },
          category: filter
            ? {
                hasSome: filter,
              }
            : undefined,
        },
      });
      res.status(200).json(events);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(eventWithTickets: EventWithTickets) {
    try {
      const { tickets, eventPic, bannerPic, ...eventInfo } = eventWithTickets;
      const updatedTickets = tickets.map((ticket: Ticket) => {
        const { ticketId, eventId, ...ticketInfo } = ticket;
        return ticketInfo;
      });
      let eventImageUrl = "";
      let eventBannerPictureUrl = "";

      if (eventPic && checkIfStringIsBase64(eventPic)) {
        const { data, error } = await uploadImage(
          EVENT_PROFILE_BUCKET,
          eventPic
        );
        if (error) {
          const errorResponse = handleError(error);
          res.status(400).json(errorResponse);
        }

        if (data)
          eventImageUrl = await retrieveImageUrl(
            EVENT_PROFILE_BUCKET,
            data.path
          );
      }

      if (bannerPic && checkIfStringIsBase64(bannerPic)) {
        const { data, error } = await uploadImage(
          EVENT_PROFILE_BUCKET,
          bannerPic
        );

        if (error) {
          const errorResponse = handleError(error);
          res.status(400).json(errorResponse);
        }
        if (data)
          eventBannerPictureUrl = await retrieveImageUrl(
            EVENT_PROFILE_BUCKET,
            data.path
          );
      }

      console.log(eventBannerPictureUrl, eventImageUrl);
      const response = await prisma.event.create({
        data: {
          ...eventInfo,
          eventId: undefined,
          eventPic: eventImageUrl,
          bannerPic: eventBannerPictureUrl,
          tickets: { create: updatedTickets },
          eventTicketsSoldTimestamps: { create: { ticketsSold: 0 } }
        },
        include: {
          tickets: true,
        },
      });
      res.status(200).json([response]);
      // now create the contract
    } catch (error) {
      console.log(error);
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
