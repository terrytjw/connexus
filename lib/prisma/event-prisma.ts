import {
  PrismaClient,
  Event,
  Prisma,
  Ticket,
  CategoryType,
  PublishType,
  Address,
  Raffles,
  Promotion,
} from "@prisma/client";
import { AttendeeListType } from "../../utils/types";
import { EventCreation } from "../../pages/api/events";

export interface EventPartialType extends Partial<Event> {}

const prisma = new PrismaClient();

export async function retrieveEventInfo(eventId: number) {
  return prisma.event.findUnique({
    where: {
      eventId: eventId,
    },
    include: {
      tickets: {
        include: { users: true },
      },
      userLikes: true,
      address: true,
      raffles: {
        include: {
          rafflePrizes: true,
        },
      },
      promotion: true,
    },
  });
}

export async function createEventWithTickets(
  event: EventCreation,
  tickets: Ticket[],
  creatorId: number,
  promotion: Promotion[]
) {
  return prisma.event.create({
    data: {
      ...event,
      eventId: undefined,
      addressId: undefined,
      creatorId: undefined,
      userLikes: undefined,
      raffles: undefined,
      tickets: { create: tickets },
      address: { create: event.address },
      creator: { connect: { userId: creatorId } },
      analyticsTimestamps: {
        create: { ticketsSold: 0, revenue: 0, clicks: 0, likes: 0 },
      },
      promotion: { create: promotion },
    },
    include: {
      tickets: true,
      promotion: true,
      raffles: {
        include: { rafflePrizes: true },
      },
    },
  });
}

export async function filterEvent(
  cursor: number | undefined,
  keyword: string | undefined,
  eventIds: number[] | undefined,
  tags: CategoryType[] | undefined,
  startDate: Date | undefined,
  endDate: Date | undefined
) {
  console.log(
    "filterEvent",
    cursor,
    keyword,
    eventIds,
    tags,
    startDate,
    endDate
  );
  return prisma.event.findMany({
    include: { userLikes: true, address: true, tickets: true },
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
      category: tags
        ? {
            hasSome: tags,
          }
        : undefined,

      eventId: eventIds
        ? {
            in: eventIds,
          }
        : undefined,
      AND: [
        {
          startDate: {
            gte: startDate,
          },
        },
        {
          endDate: {
            lte: endDate,
          },
        },
      ],
    },
  });
}

export async function deleteEvent(eventId: number) {
  return prisma.event.delete({
    where: {
      eventId: eventId,
    },
  });
}

export async function updateEvent(
  eventId: number,
  updateType: EventPartialType
) {
  return prisma.event.update({
    where: {
      eventId: eventId,
    },
    data: { ...updateType, eventId: undefined },
    include: {
      promotion: true,
      address: true,
    },
  });
}

export async function filterAttendee(
  eventId: number,
  cursor?: number,
  displayName?: string
) {
  const userTickets = await prisma.userTicket.findMany({
    include: {
      user: true,
      ticket: {
        include: {
          event: {
            include: {
              raffles: {
                include: {
                  rafflePrizes: {
                    include: {
                      rafflePrizeUser: {
                        include: {
                          user: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    take: 10,
    skip: cursor ? 1 : undefined, // Skip cursor
    cursor: cursor ? { userTicketId: cursor } : undefined,
    where: {
      ticket: {
        eventId: eventId,
      },
      user: {
        displayName: {
          contains: displayName,
          mode: "insensitive",
        },
      },
    },
    orderBy: {
      user: {
        userId: "asc",
      },
    },
  });

  const response = [] as AttendeeListType[];
  for (const userTicket of userTickets) {
    const userId = userTicket.userId;
    const displayName = userTicket.user.displayName;
    const email = userTicket.user.email;
    const checkInStatus = userTicket.checkIn;
    const ticket = userTicket.ticket;

    response.push({
      userId: userId,
      displayName: displayName,
      email: email,
      checkIn: checkInStatus,
      ticket: ticket,
    } as AttendeeListType);
  }

  return response;
}

export async function unlikeEvent(eventId: number, userId: number) {
  return prisma.event.update({
    where: {
      eventId: eventId,
    },
    data: {
      userLikes: {
        disconnect: {
          userId: userId,
        },
      },
    },
    include: {
      userLikes: true,
    },
  });
}

export async function likeEvent(eventId: number, userId: number) {
  return prisma.event.update({
    where: {
      eventId: eventId,
    },
    data: {
      userLikes: {
        connect: {
          userId: userId,
        },
      },
    },
    include: {
      userLikes: true,
    },
  });
}

export async function searchEventContainingTickets(ticketId: number[]) {
  return prisma.event.findMany({
    include: { userLikes: true, address: true },
    where: {
      tickets: {
        some: {
          ticketId: {
            in: ticketId,
          },
        },
      },
    },
  });
}

export async function retrieveTrendingEvents() {
  return prisma.event.findMany({
    orderBy: {
      userLikes: {
        _count: "desc",
      },
    },
    take: 1,
    include: { userLikes: true, address: true },
  });
}

export async function getEventsForAnalytics() {
  return prisma.event.findMany({
    include: {
      tickets: true,
      analyticsTimestamps: true,
      _count: {
        select: { userLikes: true },
      },
    },
  });
}
