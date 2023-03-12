import { Collection, User } from "@prisma/client";
import {
  API_URL,
  COLLECTION_ENDPOINT,
  EVENT_ENDPOINT,
  USER_ENDPOINT,
} from "../constant";
import axios from "axios";

export async function paginateEvent(cursor: number) {
  const object = { cursor } as any;

  const params = new URLSearchParams(object).toString();
  const url = `${API_URL}/${EVENT_ENDPOINT}?${params}`;
  const response = (await axios.get(url)).data;
  response.map((item: Collection) => {
    return {
      collectionName: item.collectionName,
    };
  });
  return response;
}
