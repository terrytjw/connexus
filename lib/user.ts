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

export async function findAllUser() {
  return prisma.user.findMany();
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
