import {
  PrismaClient,
  Community,
  CategoryType,
  ChannelType,
} from "@prisma/client";
import { Prisma } from "@prisma/client";

export interface CommunityPartialType extends Partial<Community> {}

const prisma = new PrismaClient();

export async function saveCommunity(community: Community) {
  return prisma.community.create({
    data: {
      ...community,
      channels: {
        create: [
          {
            name: "Home",
            channelType: ChannelType.REGULAR,
          },
        ],
      },
    },
  });
}

export async function getCommunityById(communityId: number) {
  return prisma.community.findFirst({
    where: {
      communityId: communityId,
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
        select: { userId: true, profilePic: true, username: true },
      },
      members: {
        select: { userId: true },
      },
    },
  });
}

export async function searchCommunities(
  keyword: string,
  cursor: number,
  filter?: CategoryType[]
) {
  return prisma.community.findMany({
    take: 10,
    skip: cursor ? 1 : 0, // Skip cursor
    cursor: cursor ? { communityId: cursor } : undefined,
    where: {
      name: {
        contains: keyword,
        mode: "insensitive",
      },
      tags: filter
        ? {
            hasSome: filter,
          }
        : undefined,
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

export async function findAllCommunities(
  cursor: number,
  filter?: CategoryType[]
) {
  const filterCondition = {
    tags: filter
      ? {
          hasSome: filter,
        }
      : undefined,
  };

  return prisma.community.findMany({
    take: 10,
    skip: cursor ? 1 : 0, // Skip cursor
    cursor: cursor ? { communityId: cursor } : undefined,
    where: { ...filterCondition },
    include: {
      members: {
        select: { userId: true },
      },
    },
  });
}

export async function deleteCommunity(communityId: number) {
  return prisma.community.delete({
    where: {
      communityId: communityId,
    },
  });
}

export async function updateCommunity(
  communityId: number,
  updateType: CommunityPartialType
) {
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
          channelId: true,
        },
        orderBy: {
          channelId: "asc",
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
          channelId: true,
        },
        orderBy: {
          channelId: "asc",
        },
      },
    },
  });
}

export async function getCommunitiesForAnalytics() {
  return await prisma.community.findMany({
    include: {
      _count: {
        select: { members: true },
      },
      channels: {
        include: {
          _count: {
            select: { members: true },
          },
        },
      },
      analyticsTimestamps: true,
    },
  });
}
