import { PrismaClient, Event, CategoryType } from "@prisma/client";

export interface EventPartialType extends Partial<Event> {}

const prisma = new PrismaClient();

export async function searchEvent(searchType: EventPartialType) {

  const {category, ticketURIs, ...searchFilter} = searchType 

  return prisma.event.findFirst({
    where: {
      ...searchFilter,
    },
  });

  /*

  prisma.event.findMany({
    where: {
      category: {
        has: CategoryType.ANIMALS
      }
    }
  })
  */
}

export async function findAllEvent() {
  return prisma.user.findMany();
}

export async function deleteEvent(eventId: number) {
  return prisma.event.delete({
    where: {
      eventId: eventId,
    },
  });
}

export async function updateEvent(eventId: number, updateType: EventPartialType) {
  return prisma.event.update({
    where: {
      eventId: eventId,
    },
    data: { ...updateType, eventId: undefined },
  });
}
