import { PrismaClient, Event } from "@prisma/client";

export interface EventPartialType extends Partial<Event> {}

const prisma = new PrismaClient();

export async function searchEvent(searchType: EventPartialType) {
  const { category, ticketURIs, ...searchFilter } = searchType;

  return prisma.event.findFirst({
    where: {
      ...searchFilter,
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
