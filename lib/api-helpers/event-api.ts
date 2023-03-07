import { EVENT_ENDPOINT } from "./../constant";
import { Collection, User } from "@prisma/client";
import { API_URL, COLLECTION_ENDPOINT, USER_ENDPOINT } from "../constant";
import axios from "axios";

export async function getEventInfo(eventId: number) {
  const url = `${API_URL}/${EVENT_ENDPOINT}/${eventId}`;
  const response = (await axios.get(url)).data;
  return response;
}

export async function updateEventInfo(eventId: number, eventInfo: Event) {
  const url = `${API_URL}/${EVENT_ENDPOINT}/${eventId}`;
  const response = (await axios.post(url, eventInfo)).data;
  return response;
}

export async function createEvent(eventInfo: Event) {
  const url = `${API_URL}/${EVENT_ENDPOINT}`;
  const response = (await axios.post(url, eventInfo)).data;
  return response;
}

export async function registerEvent(eventId: number) {
  const url = `${API_URL}/${EVENT_ENDPOINT}/${eventId}/register`;
  const response = (await axios.post(url)).data;
  return response;
}

export async function likeEvent(eventId: number, userId: number) {
  const url = `${API_URL}/${EVENT_ENDPOINT}/${eventId}/like?userId=${userId}`;
  const response = (await axios.post(url)).data;
  return response;
}

export async function unlikeEvent(eventId: number, userId: number) {
  const url = `${API_URL}/${EVENT_ENDPOINT}/${eventId}/unlike?userId=${userId}`;
  const response = (await axios.post(url)).data;
  return response;
}

export async function viewAttendeeList(eventId: number) {
  const url = `${API_URL}/${EVENT_ENDPOINT}/${eventId}/attendee`;
  const response = (await axios.post(url)).data;
  return response;
}
