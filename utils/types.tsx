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
