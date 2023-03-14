import { Post } from "@prisma/client";
import { API_URL, POST_ENDPOINT } from "../constant";
import axios from "axios";

const baseUrl = `${API_URL}/${POST_ENDPOINT}`;

export async function getPostAPI(postId: number) {
  const url = baseUrl + `/${postId}`;
  const response = (await axios.get(url)).data;

  return response;
}

export async function getAllPostsInChannelAPI(channelId: number) {
  const response = (await axios.get(baseUrl, {
    params: {
      channelId: channelId
    }
  })).data;

  return response;
}

export async function createPostAPI(
  content: string,
  media: string[],
  creatorId: number,
  channelId: number
) {
  const response = (await axios.post(baseUrl,
    {
      content: content,
      media: media,
      creatorId: creatorId,
      channelId: channelId
    }
  )).data;
  return response;
}

export async function updatePostAPI(
  postId: number, 
  content: string,
  media: string[],
  isPinned: boolean
) {
  const url = baseUrl + `/${postId}`;
  const response = (await axios.post(url, 
    {
      content: content,
      media: media,
      isPinned: isPinned
    })).data;
  return response;
}

export async function deletePostAPI(postId: number) {
  const url = baseUrl + `/${postId}`;
  const response = (await axios.delete(url)).data;
  return response;
}

export async function likePostAPI(postId: number, userId: number) {
  const url = baseUrl + `/${postId}/like`;
  const response = (await axios.post(url, {}, {
    params: {
      userId: userId
    }
  })).data;
  return response;
}

export async function unlikePostAPI(postId: number, userId: number) {
  const url = baseUrl + `/${postId}/unlike`;
  const response = (await axios.post(url, {}, {
    params: {
      userId: userId
    }
  })).data;
  return response;
}
