import { PrismaClient, Channel } from "@prisma/client";

const prisma = new PrismaClient();

export async function getChannel(channelId: number) {
  return prisma.channel.findFirst({
    where: {
      channelId: channelId,
    },
    include: {
      members: {
        select: { userId: true, username: true, profilePic: true },
      },
    },
  });
}

export async function getAllChannelsInCommunity(communityId: number) {
  return prisma.channel.findMany({
    where: {
      communityId: communityId
    }
  });
}

export async function createChannel(channel: Channel) {
  return prisma.channel.create({
    data: {
      ...channel,
    },
  });
}

export async function updateChannel(channelId: number, channel: Channel) {
  return prisma.channel.update({
    where: {
      channelId: channelId,
    },
    data: { ...channel },
  });
}

export async function deleteChannel(channelId: number) {
  return prisma.channel.delete({
    where: {
      channelId: channelId,
    },
  });
}

export async function joinChannel(channelId: number, userId: number) {
  return prisma.channel.update({
    where: {
      channelId: channelId,
    },
    data: {
      members: {
        connect: {
          userId: userId,
        },
      },
    },
    include: {
      members: true,
    },
  });
}

export async function leaveChannel(channelId: number, userId: number) {
  return prisma.channel.update({
    where: {
      channelId: channelId,
    },
    data: {
      members: {
        disconnect: {
          userId: userId,
        },
      },
    },
    include: {
      members: true,
    },
  });
}

export async function searchUsersInChannel(channelId: number, keyword: string) {
  const channel = await getChannel(channelId);
  const users = channel!.members.filter((user) =>
    user.username.includes(keyword)
  );
  return users;
}

export async function getChannelsForAnalytics() {
  return await prisma.channel.findMany({
    include: {
      posts: {
        include: {
          _count: {
            select: { likes: true, comments: true }
          }
        }
      },
      _count: {
        select: { members: true, posts: true }
      }
    }
  });
}