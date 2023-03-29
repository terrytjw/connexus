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
  Promotion,
  VisibilityType,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import {
  checkIfStringIsBase64,
  retrieveImageUrl,
  uploadImage,
} from "./../../../lib/supabase";
import {
  createEventWithTickets as createEvent,
  filterEvent,
} from "../../../lib/prisma/event-prisma";
import { EVENT_PROFILE_BUCKET } from "../../../lib/constant";
import { saveRaffles } from "../../../lib/prisma/raffle-prisma";
import { createProduct, createPromo } from "../../../lib/stripe/api-helpers";

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
    promotion: true;
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

      const keyword = query.keyword as string;

      const eventIds = query.eventIds
        ? (query.eventIds as string).split(",").map((id) => parseInt(id))
        : undefined;

      const likedEvents = query.likedEvent === "true";

      console.log("tags -> ", query.tags);

      const tags = query.tags
        ? ((query.tags as string).split(",") as CategoryType[])
        : undefined;

      const startDate = query.startDate
        ? new Date(query.startDate as string)
        : undefined;

      const endDate = query.endDate
        ? new Date(query.endDate as string)
        : undefined;

      const userId = query.userId
        ? parseInt(query.userId as string)
        : undefined;

      const status = query.status as string as VisibilityType;

      await handleGET(
        cursor,
        keyword,
        eventIds,
        tags,
        startDate,
        endDate,
        // likedEvents,
        // userId,
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
    keyword: string | undefined,
    eventIds: number[] | undefined,
    tags: CategoryType[] | undefined,
    startDate: Date | undefined,
    endDate: Date | undefined,
    // likedEvents: boolean | undefined,
    // userId: number | undefined,
    status: VisibilityType | undefined
  ) {
    try {
      const events = await filterEvent(
        cursor,
        keyword,
        eventIds,
        tags,
        startDate,
        endDate,
        // likedEvents,
        // userId,
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
        promotion,
        ...eventInfo
      } = eventWithTickets;

      const updatedTickets = tickets.map((ticket: TicketWithUser) => {
        const { ticketId, eventId, users, ...ticketInfo } = ticket;
        return ticketInfo;
      });

      let updatedPromo;

      if (promotion) {
        updatedPromo = await Promise.all(
          promotion.map(async (promo: Promotion) => {
            const { eventId, ...promoInfo } = promo;

            const stripePromoId = await createPromo(promoInfo.promotionValue);
            promoInfo.stripePromotionId = stripePromoId as string;

            return promoInfo;
          })
        );
      }

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

      // updatedTickets.forEach(async (ticket) => {
      //   const stripePriceId = await createProduct(
      //     ticket.name,
      //     ticket.description ?? "",
      //     eventImageUrl,
      //     true,
      //     ticket.price
      //   );

      //   ticket.stripePriceId = stripePriceId as string;
      //   ticket;
      // }, updatedTickets);

      console.log("TESTEST", eventImageUrl);
      for (let i = 0; i < updatedTickets.length; i++) {
        const image = eventImageUrl.length > 0 ? eventImageUrl : eventPic;

        const stripePriceId = await createProduct(
          updatedTickets[i].name,
          updatedTickets[i].description ?? "",
          image as string,
          true,
          updatedTickets[i].price
        );
        updatedTickets[i].stripePriceId = stripePriceId as string;
      }

      const updatedEvent = {
        ...eventInfo,
        eventPic: eventImageUrl,
        bannerPic: eventBannerPictureUrl,
      } as EventCreation;

      const response = await createEvent(
        updatedEvent as EventCreation,
        updatedTickets as Ticket[],
        creatorId,
        updatedPromo as Promotion[]
      );

      raffles.forEach(async (raffle) => {
        await saveRaffles(response.eventId, raffle);
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
