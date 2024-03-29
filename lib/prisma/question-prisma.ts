import { PrismaClient, Question } from "@prisma/client";

const prisma = new PrismaClient();

export async function getQuestion(questionId: number) {
  return prisma.question.findFirst({
    where: {
      questionId: questionId,
    },
    include: {
      user: {
        select: { username: true, profilePic: true }
      }
    },
  });
}

export async function getAllQuestionsInChannel(channelId: number) {
  return prisma.question.findMany({
    where: {
      channelId: channelId
    },
    include: {
      user: {
        select: { username: true, profilePic: true }
      }
    },
    orderBy: {
      date: "desc",
    },
  });
}

export async function createQuestion(question: Question) {
  return prisma.question.create({
    data: {
      ...question,
    },
    include: {
      user: {
        select: { username: true, profilePic: true }
      }
    },
  });
}

export async function updateQuestion(questionId: number, question: Question) {
  return prisma.question.update({
    where: {
      questionId: questionId,
    },
    data: { ...question },
    include: {
      user: {
        select: { username: true, profilePic: true }
      }
    },
  });
}

export async function deleteQuestion(questionId: number) {
  return prisma.question.delete({
    where: {
      questionId: questionId,
    },
  });
}