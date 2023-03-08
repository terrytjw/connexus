import { PrismaClient, Community, CategoryType } from "@prisma/client";
import { Prisma } from "@prisma/client";

export interface CommunityPartialType extends Partial<Community> { }

const prisma = new PrismaClient();

export async function saveCommunity(community: any) {

  return prisma.community.create({
    data: { ...community, communityId: undefined },
  });
}

export async function getCommunityById(communityId: number) {
  return prisma.community.findFirst({
    where: {
      communityId: communityId
    },
    include: {
      channels: {
        include: {
          members: {
            select: { userId: true, username: true, profilePic: true },
          },
        },
      },
      creator: {
        select: { profilePic: true, username: true },
      },
      members: {
        select: { userId: true },
      },
    },
  });
}

export async function searchCommunity(searchType: CommunityPartialType, filter?: CategoryType[]) {
  const { name } = searchType;

  return prisma.community.findMany({
    where: {
      name: {
        contains: name,
        mode: 'insensitive'
      }
    },
    include: {
      channels: {
        include: {
          members: {
            select: { userId: true, username: true, profilePic: true },
          },
        },
      },
      creator: {
        select: { profilePic: true, username: true },
      },
      members: {
        select: { userId: true },
      },
    },
  });
}

export async function findAllCommunity(cursor: number, filter?: CategoryType[]) {
  const filterCondition = {
    tags : filter 
    ? {
      hasSome: filter,
    }
    : undefined
  }

  return prisma.community.findMany({
    take: 10,
    skip: cursor ? 1 : undefined, // Skip cursor
    cursor: cursor ? { communityId: cursor } : undefined,
    where: { ...filterCondition },
  });
}

export async function deleteCommunity(communityId: number) {
  return prisma.community.delete({
    where: {
      communityId: communityId,
    },
  });
}

export async function updateCommunity(communityId: number, updateType: CommunityPartialType) {
  return prisma.community.update({
    where: {
      communityId: communityId,
    },
    data: { ...updateType, communityId: undefined },
  });
}

export async function joinCommunity(communityId: number, userId: number) {
  return prisma.community.update({
    where: {
      communityId: communityId,
    },
    data: {
      members: {
        connect: {
          userId: userId,
        },
      },
    },
    include: {
      channels: {
        select: { 
          channelId: true 
        },
        orderBy: { 
          channelId: "asc" 
        },
      },
    },
  });
}

export async function leaveCommunity(communityId: number, userId: number) {
  return prisma.community.update({
    where: {
      communityId: communityId,
    },
    data: {
      members: {
        disconnect: {
          userId: userId,
        },
      },
    },
    include: {
      channels: {
        select: { 
          channelId: true 
        },
        orderBy: { 
          channelId: "asc" 
        },
      },
    },
  });
}
