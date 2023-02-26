import { PrismaClient, User } from "@prisma/client";
import { generateUniqueUsername } from "./user-util";

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
    where: {
      userId: userId,
    },
    data: { ...updateType, userId: undefined },
  });
}
