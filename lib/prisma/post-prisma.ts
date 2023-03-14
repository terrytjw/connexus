import { PrismaClient, Post } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllPostsInChannel(channelId: number) {
  return prisma.post.findMany({
    where: {
      channelId: channelId,
    },
    include: {
      likes: {
        select: {
          userId: true,
        },
      },
      creator: {
        select: {
          userId: true,
          profilePic: true,
          username: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
}

export async function createPost(post: Post) {
  return prisma.post.create({
    data: { ...post, postId: undefined },
    include: {
      likes: {
        select: { userId: true },
      },
      creator: {
        select: { userId: true, profilePic: true, username: true },
      },
    },
  });
}

export async function getPost(postId: number) {
  return prisma.post.findUnique({
    where: {
      postId: postId,
    },
  });
}

export async function updatePost(postId: number, post: Post) {
  return prisma.post.update({
    where: {
      postId: postId,
    },
    data: { ...post },
    include: {
      likes: {
        select: { userId: true },
      },
      creator: {
        select: { userId: true, profilePic: true, username: true },
      },
    },
  });
}

export async function deletePost(postId: number) {
  return prisma.post.delete({
    where: {
      postId: postId,
    },
  });
}

export async function likePost(postId: number, userId: number) {
  return prisma.post.update({
    where: {
      postId: postId,
    },
    data: {
      likes: {
        connect: {
          userId: userId,
        },
      },
    },
  });
}

export async function unlikePost(postId: number, userId: number) {
  return prisma.post.update({
    where: {
      postId: postId,
    },
    data: {
      likes: {
        disconnect: {
          userId: userId,
        },
      },
    },
  });
}