import {
  PrismaClient,
  Event,
  Prisma,
  Ticket,
  CategoryType,
  PublishType,
  Address,
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
      tickets: { create: tickets },
      address: { create: event.address },
      creator: { connect: { userId: creatorId } },
      promotion: { create: promotion },
    },
    include: { tickets: true, promotion: true },
  });
}

export async function filterEvent(
  cursor: number | undefined,
  eventIds: number[] | undefined,
  tags: CategoryType[] | undefined,
  address: Partial<Address> | undefined,
  startDate: Date | undefined,
  endDate: Date | undefined,
  maxAttendee: number | undefined,
  status: PublishType | undefined
) {
  return prisma.event.findMany({
    include: { userLikes: true, address: true },
    take: 10,
    skip: cursor ? 1 : undefined, // Skip cursor
    cursor: cursor ? { eventId: cursor } : undefined,
    orderBy: {
      eventId: "asc",
    },
    where: {
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
      address: {
        locationName: {
          contains: address?.locationName,
          mode: "insensitive",
        },
        address1: {
          contains: address?.address1,
          mode: "insensitive",
        },
      },
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
      maxAttendee: {
        lte: maxAttendee,
      },
      publishType: status,
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
          event: true,
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
