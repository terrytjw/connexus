import { Prisma } from "@prisma/client";

export enum ChannelType {
  HOME,
  PREMIUM,
}

export type CommunityWithMemberIds = Prisma.CommunityGetPayload<{
  include: {
    members: { select: { userId: true } };
    _count: { select: { members: true } };
  };
}>;

export type CommunityWithCreatorAndChannelsAndMembers =
  Prisma.CommunityGetPayload<{
    include: {
      creator: { select: { userId: true; username: true; profilePic: true } };
      channels: {
        include: {
          members: {
            select: { userId: true; username: true; profilePic: true };
          };
        };
      };
      members: { select: { userId: true } };
    };
  }>;

export type ChannelWithMembers = Prisma.ChannelGetPayload<{
  include: {
    members: { select: { userId: true; username: true; profilePic: true } };
  };
}>;

export type PostWithCreatorAndLikes = Prisma.PostGetPayload<{
  include: {
    creator: { select: { userId: true; profilePic: true; username: true } };
    likes: { select: { userId: true } };
  };
}>;

export type CommentWithCommenterAndLikes = Prisma.CommentGetPayload<{
  include: {
    commenter: { select: { userId: true; profilePic: true; username: true } };
    likes: { select: { userId: true } };
  };
}>;

export type EventWithTicketsandAddress = Prisma.EventGetPayload<{
  include: { tickets: true; address: true };
}>;

export type UserWithTickets = Prisma.UserGetPayload<{
  include: { tickets: true };
}>;

export type MerchandiseWithCollectionName = Prisma.MerchandiseGetPayload<{
  include: {
    collection: { select: { collectionName: true } };
  };
}>;
