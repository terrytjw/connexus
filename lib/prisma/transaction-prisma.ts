import { PrismaClient, Transaction } from "@prisma/client";
const prisma = new PrismaClient();

export async function createTransaction(transaction: Transaction) {
  return prisma.transaction.create({
    data: {
      ...transaction,
    },
  });
}

export async function updateTransaction(
  transactionId: number,
  transaction: Transaction
) {
  return prisma.transaction.update({
    where: {
      transactionId: transactionId,
    },
    data: {
      ...transaction,
      userId: undefined,
    },
  });
}
