import { Collection, User } from "@prisma/client";
import { API_URL, COLLECTION_ENDPOINT, USER_ENDPOINT } from "../constant";
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

// api call function to filter notifications by ____