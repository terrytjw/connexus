import { Comment } from "@prisma/client";
import { API_URL, COMMENT_ENDPOINT } from "../constant";
import axios from "axios";

const baseUrl = `${API_URL}/${COMMENT_ENDPOINT}`;

export async function getComment(commentId: number) {
  const url = baseUrl + `/${commentId}`;
  const response = (await axios.get(url)).data;

  return response;
}

export async function getAllCommentsOnPost(postId: number) {
  const response = (await axios.get(baseUrl, {
    params: {
      postId: postId
    }
  })).data;
  return response;
}

export async function createComment(
  content: string,
  postId: number
) {
  const response = (await axios.post(baseUrl, {
    content: content,
    postId: postId
  })).data;
  return response;
}

export async function updateComment(
  commentId: number,
  content: string
) {
  const url = baseUrl + `/${commentId}`;
  const response = (await axios.post(url, {
    content: content
  })).data;
  return response;
}

export async function deleteComment(commentId: number) {
  const url = baseUrl + `/${commentId}`;
  const response = (await axios.delete(url)).data;
  return response;
}

export async function likeComment(commentId: number, userId: number) {
  const url = baseUrl + `/${commentId}/like`;
  const response = (await axios.post(url, {}, {
    params: {
      userId: userId
    }
  })).data;
  return response;
}

export async function unlikeComment(commentId: number, userId: number) {
  const url = baseUrl + `/${commentId}/unlike`;
  const response = (await axios.post(url, {}, {
    params: {
      userId: userId
    }
  })).data;
  return response;
}
