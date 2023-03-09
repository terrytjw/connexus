import { Prisma, PrismaClient, Ticket, User } from "@prisma/client";
import { generateUniqueUsername } from "../../utils/user-util";

const prisma = new PrismaClient();

export type TicketWithUser = Prisma.TicketGetPayload<{
  include: { users: true };
}>;

export async function saveUserTicket(tickets: TicketWithUser[]) {
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
        },
      });
    });
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
