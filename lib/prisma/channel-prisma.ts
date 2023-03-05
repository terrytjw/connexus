import { PrismaClient, Channel } from "@prisma/client";

const prisma = new PrismaClient();

export async function joinChannel(channelId: number, userId: number) {
  return prisma.channel.update({
    where: {
      channelId: channelId
    },
    data: {
      members: {
        connect: {
          userId: userId
        }
      }
    }
  })
}

export async function leaveChannel(channelId: number, userId: number) {
  return prisma.channel.update({
    where: {
      channelId: channelId,
    },
    data: {
      members: {
        disconnect: {
          userId: userId
        }
      }
    }
  })
}
