import { TicketWithUser } from "./../../../lib/prisma/user-ticket-prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import {
  PrismaClient,
  Event,
  Prisma,
  CategoryType,
  Ticket,
  Address,
  PublishType,
  Raffles,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import {
  checkIfStringIsBase64,
  retrieveImageUrl,
  uploadImage,
} from "./../../../lib/supabase";
import {
  createEventWithTickets,
  filterEvent,
} from "../../../lib/prisma/event-prisma";
import { EVENT_PROFILE_BUCKET } from "../../../lib/constant";
import { saveRaffles } from "../../../lib/prisma/raffle-prisma";

export type EventCreation = Prisma.EventGetPayload<{
  include: {
    tickets: {
      include: { users: true };
    };
    address: true;
    userLikes: true;
    raffles: {
      include: { rafflePrizes: true };
    };
  };
}>;

type RaffleWithPrizes = Prisma.RafflesGetPayload<{
  include: { rafflePrizes: true };
}>;

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
  res: NextApiResponse<Event[] | Event | ErrorResponse>
) {
  // console.log(session);

  // if (!session) {
  //   res.status(401).json({ error: "401", message: "Unauthorized" });
  // }

  const { method, body, query } = req;

  switch (req.method) {
    case "GET":
      const cursor = query.cursor
        ? parseInt(query.cursor as string)
        : undefined;

      const eventIds = query.eventIds
        ? (query.eventIds as string).split(",").map((id) => parseInt(id))
        : undefined;

      const tags = query.tags
        ? ((query.tags as string).split(",") as CategoryType[])
        : undefined;

      const locationName = query.locationName;
      const address1 = query.address1;
      const address = { locationName, address1 } as Partial<Address>;

      const startDate = query.startDate
        ? new Date(query.startDate as string)
        : undefined;

      const endDate = query.endDate
        ? new Date(query.endDate as string)
        : undefined;

      const maxAttendee = query.maxAttendee
        ? parseInt(query.maxAttendee as string)
        : undefined;
      const status = query.status as PublishType;

      await handleGET(
        cursor,
        eventIds,
        tags,
        address,
        startDate,
        endDate,
        maxAttendee,
        status
      );
      break;
    case "POST":
      const event = JSON.parse(JSON.stringify(body)) as EventCreation;
      await handlePOST(event);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(
    cursor: number | undefined,
    eventIds: number[] | undefined,
    tags: CategoryType[] | undefined,
    address: Partial<Address> | undefined,
    startDate: Date | undefined,
    endDate: Date | undefined,
    maxAttendee: number | undefined,
    status: PublishType | undefined
  ) {
    try {
      const events = await filterEvent(
        cursor,
        eventIds,
        tags,
        address,
        startDate,
        endDate,
        maxAttendee,
        status
      );
      res.status(200).json(events);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(eventWithTickets: EventCreation) {
    try {
      const {
        tickets,
        eventPic,
        bannerPic,
        creatorId,
        userLikes,
        raffles,
        ...eventInfo
      } = eventWithTickets;
      const updatedTickets = tickets.map((ticket: TicketWithUser) => {
        const { ticketId, eventId, users, ...ticketInfo } = ticket;
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

      const updatedEvent = {
        ...eventInfo,
        eventPic: eventImageUrl,
        bannerPic: eventBannerPictureUrl,
      } as EventCreation;

      const response = await createEventWithTickets(
        updatedEvent as EventCreation,
        updatedTickets as Ticket[],
        creatorId
      );

      raffles.forEach(async (raffle) => {
        await saveRaffles(response.eventId, raffle.rafflePrizes);
      });

      res.status(200).json(response);
      // now create the contract
    } catch (error) {
      console.log(error);
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
