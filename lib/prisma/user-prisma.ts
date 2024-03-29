import { events } from "./../../utils/dummyData";
import { PrismaClient, User } from "@prisma/client";
import { generateUniqueUsername } from "../../utils/user-util";

export interface UserPartialType extends Partial<User> {}

const prisma = new PrismaClient();

export async function saveUser(user: any) {
  let username = "";
  if (user.username) username = await generateUniqueUsername(user.username);

  return prisma.user.create({
    data: { ...user, userId: undefined, username: username },
  });
}

export async function searchUser(searchType: UserPartialType) {
  return prisma.user.findFirst({
    where: {
      ...searchType,
    },
    include: {
      createdCollections: {
        include: { merchandise: true, premiumChannel: true },
      },
      createdCommunities: { include: { channels: true } },
      joinedCommunities: {
        include: {
          _count: {
            select: { members: true },
          },
        },
      },
      joinedChannels: true,
      tickets: true,
      merchandise: {
        include: {
          collection: {
            include: {
              premiumChannel: { select: { channelId: true } },
            },
          },
        },
      },
      bankAccount: true,
      transactions: true,
      userTicket: {
        include: {
          ticket: {
            include: {
              event: true,
            },
          },
        },
      },
    },
  });
}

export async function findAllUser(cursor: number, filter?: string) {
  const filterCondition = filter
    ? {
        OR: [
          { username: { contains: filter } },
          { displayName: { contains: filter } },
          { email: { contains: filter } },
          { bio: { contains: filter } },
        ],
      }
    : undefined;

  return prisma.user.findMany({
    take: 10,
    skip: cursor ? 1 : undefined, // Skip cursor
    cursor: cursor ? { userId: cursor } : undefined,
    where: { ...filterCondition },
  });
}

export async function deleteUser(userId: number) {
  return prisma.user.delete({
    where: {
      userId: userId,
    },
  });
}

export async function updateUser(userId: number, updateType: UserPartialType) {
  return prisma.user.update({
    include: {
      bankAccount: true,
      transactions: true,
    },
    where: {
      userId: userId,
    },
    data: { ...updateType, userId: undefined },
  });
}
