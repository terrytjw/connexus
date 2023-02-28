import { MerchandisePriceType } from "../pages/api/merch";
import { API_URL, MERCHANDISE_ENDPOINT } from "./constant";
import axios from "axios";

export async function filterMerchandiseByPriceType(
  cursor?: number,
  collectionId?: number,
  priceType?: MerchandisePriceType
) {
  const object = { cursor, collectionId, priceType } as any;

  const params = new URLSearchParams(object).toString();
  const url = `${API_URL}/${MERCHANDISE_ENDPOINT}?${params}`;
  const response = (await axios.get(url)).data;
  console.log(response);
  return response;
}
