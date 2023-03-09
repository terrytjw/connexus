import {
  PrismaClient,
  Event,
  Prisma,
  Ticket,
  CategoryType,
  PublishType,
  Address,
} from "@prisma/client";

export interface EventPartialType extends Partial<Event> {}

const prisma = new PrismaClient();

export async function retrieveEventInfo(eventId: number) {
  return prisma.event.findUnique({
    where: {
      eventId: eventId,
    },
    include: { tickets: true },
  });
}

export async function createEventWithTickets(event: Event, tickets: Ticket[]) {
  return prisma.event.create({
    data: { ...event, eventId: undefined, tickets: { create: tickets } },
    include: { tickets: true },
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
  });
}

export async function retrieveAttendee(eventId: number) {
  const tickets = await prisma.ticket.findMany({
    where: {
      eventId: eventId,
    },
  });

  const ticketIds = tickets.map((ticket) => ticket.ticketId);

  return prisma.user.findMany({
    where: {
      tickets: {
        some: {
          ticketId: {
            in: ticketIds,
          },
        },
      },
    },
  });
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
