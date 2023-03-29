import { Prisma, Ticket } from "@prisma/client";

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

export type QuestionWithUser = Prisma.QuestionGetPayload<{
  include: {
    user: { select: { profilePic: true; username: true } };
  };
}>;

export type EventWithAllDetails = Prisma.EventGetPayload<{
  include: {
    tickets: true;
    address: true;
    userLikes: true;
    promotion: true;
    raffles: {
      include: { rafflePrizes: true };
    };
  };
}>;

export type UserWithTickets = Prisma.UserGetPayload<{
  include: { tickets: true };
}>;

export type UserWithTicketsAndEvent = UserTicket & { ticket: TicketWithEvent }

export type MerchandiseWithCollectionName = Prisma.MerchandiseGetPayload<{
  include: {
    collection: { select: { collectionName: true } };
  };
}>;

export type TicketWithEvent = Prisma.TicketGetPayload<{
  include: {
    event: {
      include: { raffles: true };
    };
  };
}>;

export type AttendeeListType = {
  userId: number;
  displayName: string;
  email: string;
  checkIn: boolean;
  ticket: TicketWithEvent;
};
