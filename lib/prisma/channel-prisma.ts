import { PrismaClient, Channel, Prisma } from "@prisma/client";
import { getUserInfo } from "../api-helpers/user-api";

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

type MerchandiseWithCollectionWithPremiumChannelId =
  Prisma.MerchandiseGetPayload<{
    include: {
      collection: {
        include: {
          premiumChannel: { select: { channelId: true } };
        };
      };
    };
  }>;

export async function getChannelsToJoin(userId: number) {
  const user = await getUserInfo(userId);
  const channelIDs = [] as number[];
  user.merchandise.forEach(
    (merchandise: MerchandiseWithCollectionWithPremiumChannelId) => {
      if (merchandise.collection.premiumChannel) {
        channelIDs.push(merchandise.collection.premiumChannel.channelId);
      }
    }
  );
  return channelIDs;
}

export async function getChannelsToLeave(communityId: number, userId: number) {
  const user = await getUserInfo(userId);
  const channelIDs = [] as number[];
  user.joinedChannels.forEach((channel: Channel) => {
    if (channel.communityId == communityId) {
      channelIDs.push(channel.channelId);
    }
  });
  return channelIDs;
}
