import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, Event, Prisma } from "@prisma/client";
import { Network, Alchemy, Wallet } from "alchemy-sdk";
import { ethers, SigningKey } from "ethers";
import fs from "fs";
import { Networkish } from "ethers/types/providers";
import path from "path";
import EventJSON from "./Event.json";
import axios from "axios";

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
  const { method } = req;

  switch (req.method) {
    case "GET":
      await handleGET();
      break;
    case "POST":
      const event = JSON.parse(JSON.stringify(req.body)) as EventWithTickets;
      await handlePOST(event);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET() {
    // Optional Config object, but defaults to demo api-key and eth-mainnet.
    // const settings = {
    //   apiKey: "6ycDX83NnrwWaaZZDB8ic_xPMc88ClwD", // Replace with your Alchemy API Key.
    //   network: Network.MATIC_MUMBAI, // Replace with your network.
    // };
    // const alchemy = new Alchemy(settings);
    // const latestBlock = await alchemy.core.getBlockNumber();
    // console.log("The latest block number is", latestBlock);

    try {
      const events = await prisma.event.findMany({
        include: {
          tickets: true,
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
      const { tickets, ...eventInfo } = eventWithTickets;
      const updatedTickets = tickets.map((ticket) => {
        const { ticketId, eventId, ...ticketInfo } = ticket;
        return ticketInfo;
      });

      const response = await prisma.event.create({
        data: {
          ...eventInfo,
          eventId: undefined,
          tickets: { create: updatedTickets },
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
