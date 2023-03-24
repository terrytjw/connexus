import {
  ALCHEMY_API,
  EVENT_ENDPOINT,
  TICKET_ENDPOINT,
  USER_TICKET_ENDPOINT,
  smartContract,
} from "./../constant";
import {
  CategoryType,
  Collection,
  Event,
  Raffles,
  User,
  VisibilityType,
} from "@prisma/client";
import { API_URL, COLLECTION_ENDPOINT, USER_ENDPOINT } from "../constant";
import axios from "axios";
import { ethers } from "ethers";
import contract from "../../artifacts/contracts/SimpleEvent.sol/SimpleEvent.json";

const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API);
const abi = contract.abi;
const bytecode = contract.bytecode;
const signer = new ethers.Wallet(smartContract.privateKey, provider);

/**
 * APIs for Creator
 */
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

export async function viewAttendeeList(eventId: number) {
  const url = `${API_URL}/${EVENT_ENDPOINT}/${eventId}/attendee`;
  const response = (await axios.get(url)).data;
  return response;
}

export async function filterAttendeeList(
  eventId: number,
  cursor: number | undefined,
  displayName: string = ""
) {
  const object = {
    displayName,
  } as any;
  if (cursor) object["cursor"] = cursor;

  const params = new URLSearchParams(object).toString();
  const url = `${API_URL}/${EVENT_ENDPOINT}/${eventId}/attendee?${params}`;
  const response = (await axios.get(url)).data;
  return response;
}

export async function viewEndedEvents(userId: number) {
  const url = `${API_URL}/${EVENT_ENDPOINT}/?userId=${userId}&viewEndedEvent=true`;
  const response = (await axios.get(url)).data;
  return response;
}

/**
 * APIs for Fans
 */

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

export async function checkIn(
  eventId: number,
  ticketId: number,
  userId: number
) {
  const eventResponse = (await getEventInfo(eventId)) as Event;
  const eventContract = new ethers.Contract(
    eventResponse.eventScAddress,
    abi,
    signer
  );

  const tx = await eventContract.checkIn(ticketId, {
    gasLimit: 2100000,
  });

  const url = `${API_URL}/${TICKET_ENDPOINT}/${ticketId}/checkin?userId=${userId}`;
  const response = (await axios.post(url)).data;

  return response;
}

// export async function retrieveVisitedEvents(userId: number) {
//   const url = `${API_URL}/${USER_TICKET_ENDPOINT}/${userId}/visited`;
//   const response = (await axios.get(url)).data;
//   return response;
// }

export async function viewTrendingEvents() {
  const url = `${API_URL}/${EVENT_ENDPOINT}/trending`;
  const response = (await axios.get(url)).data;
  return response;
}

export async function retrieveVisitedEvents(userId: number) {
  const url = `${API_URL}/${USER_TICKET_ENDPOINT}/?userId=${userId}&viewVisitedEvent=true`;
  const response = (await axios.get(url)).data;
  return response;
}

export async function viewExpiredEvent(userId: number) {
  const url = `${API_URL}/${USER_TICKET_ENDPOINT}/?userId=${userId}&viewVisitedEvent=false`;
  const response = (await axios.get(url)).data;
  return response;
}

export function exportPDF(eventId: number) {
  const url = `${API_URL}/${EVENT_ENDPOINT}/${eventId}/attendee/pdf`;
  return url;
}

export function exportCSV(eventId: number) {
  const url = `${API_URL}/${EVENT_ENDPOINT}/${eventId}/attendee/csv`;
  return url;
}

export async function updateRaffle(raffleId: number, raffles: Raffles) {
  const url = `${API_URL}/${EVENT_ENDPOINT}/raffle`;
  const response = (
    await axios.post(url, {
      raffleId,
      raffles,
    })
  ).data;
}

export async function registerEventClick(eventId: number) {
  const url = `${API_URL}/${EVENT_ENDPOINT}/${eventId}/click`;
  const response = (await axios.post(url)).data;
  return response;
}

export async function filterEvent(
  keyword: string | undefined,
  categories: CategoryType[],
  startDate: Date | undefined,
  endDate: Date | undefined,
  // likedEvent: boolean = false,
  // userId: number | undefined,
  status: VisibilityType | undefined
) {
  const baseUrl = `${API_URL}/${EVENT_ENDPOINT}`;

  const response = (
    await axios.get(baseUrl, {
      params: {
        keyword,
        tags: categories.toString(),
        startDate,
        endDate,
        // likedEvent,
        // userId,
        status,
      },
    })
  ).data;
  return response;
}
