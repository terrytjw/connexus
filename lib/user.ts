import { PrismaClient, User } from "@prisma/client";
import { castAppropriateType } from "./prisma-util";
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

export async function findAllUser(filterQuery: UserPartialType) {
  // console.log(filterQuery.userId, filterQuery.notificationBySMS);

  console.log(castAppropriateType(filterQuery));

  const filterObj = castAppropriateType(filterQuery);
  console.log("heelo");
  // const filterObj = {} as UserPartialType;
  // if (filterQuery.userId) filterObj["userId"] = Number(filterQuery.userId);
  // if (filterQuery.notificationBySMS)
  //   filterObj["notificationBySMS"] = Boolean(filterQuery.notificationBySMS);
  // if (filterQuery.notificationByEmail)
  //   filterObj["notificationByEmail"] = Boolean(filterQuery.notificationByEmail);
  return prisma.user.findMany({
    where: { ...filterObj },
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
