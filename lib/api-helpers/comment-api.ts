import { Comment } from "@prisma/client";
import { API_URL, COMMENT_ENDPOINT } from "../constant";
import axios from "axios";

const baseUrl = `${API_URL}/${COMMENT_ENDPOINT}`;

export async function getCommentAPI(commentId: number) {
  const url = baseUrl + `/${commentId}`;
  const response = (await axios.get(url)).data;

  return response;
}

export async function getAllCommentsOnPostAPI(postId: number) {
  const response = (await axios.get(baseUrl, {
    params: {
      postId: postId
    }
  })).data;
  return response;
}

export async function createCommentAPI(
  content: string,
  postId: number,
  userId: number
) {
  const response = (await axios.post(baseUrl, {
    content: content,
    postId: postId,
    userId: userId
  })).data;
  return response;
}

export async function updateCommentAPI(
  commentId: number,
  content: string
) {
  const url = baseUrl + `/${commentId}`;
  const response = (await axios.post(url, {
    content: content
  })).data;
  return response;
}

export async function deleteCommentAPI(commentId: number) {
  const url = baseUrl + `/${commentId}`;
  const response = (await axios.delete(url)).data;
  return response;
}

export async function likeCommentAPI(commentId: number, userId: number) {
  const url = baseUrl + `/${commentId}/like`;
  const response = (await axios.post(url, {}, {
    params: {
      userId: userId
    }
  })).data;
  return response;
}

export async function unlikeCommentAPI(commentId: number, userId: number) {
  const url = baseUrl + `/${commentId}/unlike`;
  const response = (await axios.post(url, {}, {
    params: {
      userId: userId
    }
  })).data;
  return response;
}
