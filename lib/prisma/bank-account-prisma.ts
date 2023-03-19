import { BankAccount, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function upsertBankAccount(bankAccount: BankAccount) {
  return prisma.bankAccount.upsert({
    where: {
      userId: bankAccount.userId,
    },
    update: {
      ...bankAccount,
    },
    create: {
      ...bankAccount,
    },
  });
}
