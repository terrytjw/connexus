// export type Community = {
//   communityId: number;
//   name: string;
//   description: string;
//   bannerPic: string;
//   profilePic: string;
//   tags: string[];
//   maxMembers: number;
//   numMembers: number;
//   channels: Channel[];
// };

// export enum ChannelType {
//   HOME,
//   PREMIUM,
// }

// export type Channel = {
//   channelId: number;
//   name: string;
//   channelType: ChannelType;
//   posts: Post[];
// };

// export type Post = {
//   postId: number;
//   title: string;
//   content: string;
//   date: Date;
//   media: string[];
//   isPinned: boolean;
//   creator: {
//     userId: string;
//     displayName: string;
//     profilePic: string;
//   };
//   likes: number;
//   comments: Comment[];
// };

// export type Comment = {
//   commentId: number;
//   content: string;
//   date: Date;
//   commentor: {
//     userId: string;
//     displayName: string;
//     profilePic: string;
//   };
//   likes: number;
//   replies: Comment[];
// };
