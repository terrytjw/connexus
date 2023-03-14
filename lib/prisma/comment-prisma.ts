import { PrismaClient, Comment } from "@prisma/client";

const prisma = new PrismaClient();

export async function getComment(commentId: number) {
  return prisma.comment.findFirst({
    where: {
      commentId: commentId,
    },
  });
}

export async function getAllCommentsOnPost(postId: number) {
  return prisma.comment.findMany({
    where: {
      postId: postId,
    },
    include: {
      likes: {
        select: { userId: true },
      },
      commenter: {
        select: { userId: true, username: true, profilePic: true },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
}

export async function createComment(comment: Comment) {
  return prisma.comment.create({
    data: {
      ...comment,
    },
    include: {
      likes: {
        select: { userId: true },
      },
      commenter: {
        select: { userId: true, username: true, profilePic: true },
      },
    },
  });
}

export async function updateComment(commentId: number, comment: Comment) {
  return prisma.comment.update({
    where: {
      commentId: commentId,
    },
    data: { ...comment },
    include: {
      likes: {
        select: { userId: true },
      },
      commenter: {
        select: { userId: true, username: true, profilePic: true },
      },
    },
  });
}

export async function deleteComment(commentId: number) {
  return prisma.comment.delete({
    where: {
      commentId: commentId,
    },
  });
}

export async function likeComment(commentId: number, userId: number) {
  return prisma.comment.update({
    where: {
      commentId: commentId,
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

export async function unlikeComment(commentId: number, userId: number) {
  return prisma.comment.update({
    where: {
      commentId: commentId,
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