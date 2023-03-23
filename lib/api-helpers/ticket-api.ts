import { Ticket, UserTicket } from "@prisma/client";
import { API_URL, TICKET_ENDPOINT, USER_TICKET_ENDPOINT } from "../constant";
import axios from "axios";

export async function getTicketInfo(ticketId: number) {
  const url = `${API_URL}/${TICKET_ENDPOINT}/${ticketId}`;
  const response = (await axios.get(url)).data;
  return response;
}

export async function getTicketsOwned(userId: number) {
  const url = `${API_URL}/${TICKET_ENDPOINT}?userId=${userId}`;
  const response = (await axios.get(url)).data;
  return response;
}

export async function saveUserTicket(ticketId: number, userId: number) {
  const url = `${API_URL}/${USER_TICKET_ENDPOINT}`;
  const response = (
    await axios.post(url, {
      ticketId: ticketId,
      userId: userId,
    })
  ).data;
  return response;
}

export async function updateUserTicket(
  ticketId: number,
  userId: number,
  userTicket: UserTicket
) {
  const url = `${API_URL}/${USER_TICKET_ENDPOINT}/general`;
  const response = (
    await axios.post(url, {
      ticketId: ticketId,
      userId: userId,
      userTicket: userTicket,
    })
  ).data;
  return response;
}

export async function getUserTicketInfo(ticketId: number, userId: number) {
  const url = `${API_URL}/${USER_TICKET_ENDPOINT}/general`;
  const response = (
    await axios.get(url, {
      params: {
        ticketId: ticketId,
        userId: userId,
      },
    })
  ).data;
  return response;
}
