import { Prisma, Ticket } from "@prisma/client";

export type Community = {
  communityId: number;
  name: string;
  description: string;
  bannerPic: string;
  profilePic: string;
  tags: string[];
  maxMembers: number;
  numMembers: number;
  channels: Channel[];
};

export enum ChannelType {
  HOME,
  PREMIUM,
}

export type Channel = {
  channelId: number;
  name: string;
  channelType: ChannelType;
  posts: Post[];
};

export type Post = {
  postId: number;
  title: string;
  content: string;
  date: Date;
  media: string[];
  isPinned: boolean;
  creator: {
    userId: string;
    displayName: string;
    profilePic: string;
  };
  likes: number;
  comments: Comment[];
};

export type Comment = {
  commentId: number;
  content: string;
  date: Date;
  commentor: {
    userId: string;
    displayName: string;
    profilePic: string;
  };
  likes: number;
  replies: Comment[];
};

export type Collectible = {
  collectibleId?: number;
  image: string;
  name: string;
  totalMerchSupply: number;
  collectionName?: string;
};

export type Collection = {
  collectionId: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  collectibles: Collectible[];
  premiumChannel: Channel | null;
  creator: {
    userId: number;
    displayName: string;
    profilePic: string;
  };
};

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
  include: { tickets: true; address: true, userLikes: true };
}>;

export type UserWithTickets = Prisma.UserGetPayload<{
  include: { tickets: true };
}>;

export type AttendeeListType = {
  userId: number;
  displayName: string;
  email: string;
  checkIn: boolean;
  ticket: Ticket;
};
