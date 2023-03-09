import { API_URL, TICKET_ENDPOINT } from "../constant";
import axios from "axios";

export async function getTicketInfo(ticketId: number) {
  const url = `${API_URL}/${TICKET_ENDPOINT}/${ticketId}`;
  const response = (await axios.get(url)).data;
  return response;
}

export async function getTicketsOwned(userId: number) {
  const url = `${API_URL}/${TICKET_ENDPOINT}/user/${userId}`;
  const response = (await axios.get(url)).data;
  return response;
}
