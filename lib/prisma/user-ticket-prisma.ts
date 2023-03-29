import { Prisma, PrismaClient, Ticket, User, UserTicket } from "@prisma/client";
import { generateUniqueUsername } from "../../utils/user-util";
import { filterEvent, searchEventContainingTickets } from "./event-prisma";

const prisma = new PrismaClient();

export type TicketWithUser = Prisma.TicketGetPayload<{
  include: { users: true };
}>;

export async function saveUserTickets(
  tickets: TicketWithUser[],
  checkIn: boolean = false
) {
  tickets.forEach(async (ticket) => {
    ticket.users.forEach(async (user) => {
      await prisma.userTicket.create({
        data: {
          ticket: {
            connect: {
              ticketId: ticket.ticketId,
            },
          },
          user: {
            connect: {
              userId: user.userId,
            },
          },
          checkIn: checkIn,
        },
      });
    });
  });
}

export async function saveUserTicket(
  ticketId: number | undefined,
  userId: number | undefined
) {
  return prisma.userTicket.create({
    data: {
      ticket: {
        connect: {
          ticketId: ticketId,
        },
      },
      user: {
        connect: {
          userId: userId,
        },
      },
    },
  });
}

export async function updateUserTicket(
  ticketId: number,
  userId: number,
  userTicket: UserTicket
) {
  console.log("ticketId: ", ticketId);
  console.log("userId: ", userId);
  console.log("BE userTicket: ", userTicket);
  return prisma.userTicket.update({
    where: {
      userId_ticketId: {
        userId: userId,
        ticketId: ticketId,
      },
    },
    data: {
      badgeUrl: userTicket.badgeUrl,
    },
  });
}

export async function getUserTicketInfo(
  ticketId: number | undefined,
  userId: number | undefined
) {
  return prisma.userTicket.findFirst({
    where: {
      ticketId: ticketId,
      userId: userId,
    },
  });
}

export async function checkIn(ticketId: number, userId: number) {
  return prisma.userTicket.update({
    where: {
      userId_ticketId: {
        userId: userId,
        ticketId: ticketId,
      },
    },
    data: {
      checkIn: true,
    },
  });
}

export async function retrieveVisitedEvents(
  ticketId: number | undefined,
  userId: number | undefined
) {
  const userTickets = await prisma.userTicket.findMany({
    where: {
      ticketId: ticketId,
      userId: userId,
      checkIn: true,
    },
  });

  const ticketIds = userTickets.map((userTicket) => userTicket.ticketId);
  const events = await searchEventContainingTickets(ticketIds);

  return events.filter((event) => event.endDate < new Date());
}

export async function retrieveExpiredEvents(
  ticketId: number | undefined,
  userId: number | undefined
) {
  const userTickets = await prisma.userTicket.findMany({
    where: {
      ticketId: ticketId,
      userId: userId,
      checkIn: false,
    },
  });

  const ticketIds = userTickets.map((userTicket) => userTicket.ticketId);
  const events = await searchEventContainingTickets(ticketIds);

  return events.filter((event) => event.endDate < new Date());
}
