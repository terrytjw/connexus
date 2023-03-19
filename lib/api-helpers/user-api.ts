import { BankAccount, Collection, RafflePrizeUser, User } from "@prisma/client";
import {
  API_URL,
  BANK_ACCOUNT_ENDPOINT,
  COLLECTION_ENDPOINT,
  RAFFLE_PRIZE_USER_ENDPOINT,
  USER_ENDPOINT,
} from "../constant";
import axios from "axios";

// get all user info, including settings and notifications
export async function getUserInfo(userId: number) {
  const url = `${API_URL}/${USER_ENDPOINT}/${userId}`;
  const response = (await axios.get(url)).data;

  return response;
}

// 1. update basic user info
// 2. update user settings
export async function updateUserInfo(userId: number, userInfo: User) {
  const url = `${API_URL}/${USER_ENDPOINT}/${userId}`;
  const response = (await axios.post(url, userInfo)).data;
  return response;
}

export async function withdraw(userId: number) {
  const url = `${API_URL}/${USER_ENDPOINT}/${userId}/withdraw`;
  const response = (await axios.post(url)).data;
  return response;
}

export async function upsertBankAccount(
  userId: number,
  bankAccount: BankAccount
) {
  const response = (
    await axios.post(`${API_URL}/${BANK_ACCOUNT_ENDPOINT}`, {
      ...bankAccount,
      userId: userId,
    })
  ).data;
  return response;
}

export async function insertRafflePrize(rafflePriceId: number, userId: number) {
  const url = `${API_URL}/${RAFFLE_PRIZE_USER_ENDPOINT}`;
  const response = (
    await axios.post(url, {
      rafflePriceId,
      userId,
    })
  ).data;
  return response;
}

export async function updateRafflePrize(
  rafflePriceUserId: number,
  rafflePrizeUser: RafflePrizeUser
) {
  const url = `${API_URL}/${RAFFLE_PRIZE_USER_ENDPOINT}/${rafflePriceUserId}`;
  const response = (await axios.post(url, rafflePrizeUser)).data;
  return response;
}
