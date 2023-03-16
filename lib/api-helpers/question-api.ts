import { Question } from "@prisma/client";
import { API_URL, QUESTION_ENDPOINT } from "../constant";
import axios from "axios";

const baseUrl = `${API_URL}/${QUESTION_ENDPOINT}`;

export async function getQuestionAPI(questionId: number) {
  const url = baseUrl + `/${questionId}`;
  const response = (await axios.get(url)).data;

  return response;
}

export async function getAllQuestionsInChannelAPI(params: { channelId: number }) {
  const response = (await axios.get(baseUrl, {
    params: params
  })).data;
  return response;
}

export async function createQuestionAPI(
  question: string,
  channelId: number,
  userId: number
) {
  const response = (await axios.post(baseUrl, {
    question: question,
    channelId: channelId,
    userId: userId
  })).data;
  return response;
}

export async function editQuestionAPI(
  questionId: number,
  question: string
) {
  const url = baseUrl + `/${questionId}`;
  const response = (await axios.post(url, {
    question: question
  })).data;
  return response;
}

export async function answerQuestionAPI(
  questionId: number,
  answer: string
) {
  const url = baseUrl + `/${questionId}`;
  const response = (await axios.post(url, {
    answer: answer
  })).data;
  return response;
}