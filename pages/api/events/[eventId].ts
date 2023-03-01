// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, Event, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { uploadImage, retrieveImageUrl, checkIfStringIsBase64 } from "../../../lib/supabase";
import { EVENT_PROFILE_BUCKET } from "../../../lib/constant";
import {
  deleteEvent,
  searchEvent,
  updateEvent,
} from "../../../lib/event";

const prisma = new PrismaClient();
type EventWithTickets = Prisma.EventGetPayload<{ include: { tickets: true } }>;

/**
 * @swagger
 * /api/events/{eventId}:
 *   get:
 *     description: Returns a single Event object
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: String ID of the Event to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Event object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Event"
 *   post:
 *     description: Updates a single Event object
 *     parameters:
 *       - in: object
 *         name: Event
 *         required: true
 *         description: Event object to update
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/Event"
 *     responses:
 *       200:
 *         description: A single Event object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Event"
 *   delete:
 *     description: Delete a single Event object
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: String ID of the Event to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The deleted Event object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Event"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Event | ErrorResponse | {}>
) {
  /*
  const session = await getServerSession(req, res, authOptions);
  console.log(session);

  if (!session) {
    res.status(401).json({ error: "401", message: "Unauthorized" });
  }
  */

  const { query, method } = req;
  let eventId = parseInt(query.eventId as string);

  switch (req.method) {
    case "GET":
      await handleGET(eventId);
      break;
    case "POST":
      const event = JSON.parse(JSON.stringify(req.body)) as Event;
      await handlePOST(eventId, event);
      break;
    case "DELETE":
      await handleDELETE(eventId);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(eventId: number) {
    try {
      const event = await prisma.event.findUnique({
        where: {
          eventId: eventId,
        },
        include: { tickets: true },
      });

      if (!event) res.status(200).json({});
      else res.status(200).json(event);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(eventId: number, eventWithTickets: Event) {
    try {
      const { eventPic, bannerPic } = eventWithTickets;
      let eventImageUrl = "";
      let eventBannerPictureUrl = "";

      if(eventPic && checkIfStringIsBase64(eventPic)){
        const{data, error} = await uploadImage(
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

      const updatedEventInfo = {
        ...eventWithTickets,
      };

      if (eventImageUrl) updatedEventInfo.eventPic = eventImageUrl;
      if (eventBannerPictureUrl)
        updatedEventInfo.bannerPic = eventBannerPictureUrl;
      const response = await updateEvent(eventId, updatedEventInfo);

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handleDELETE(eventId: number) {
    try {
      const response = await prisma.event.delete({
        where: {
          eventId: eventId,
        },
      });
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
