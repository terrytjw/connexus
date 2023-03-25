import { Merchandise } from "@prisma/client";
import { MerchandisePriceType } from "../../pages/api/merch";
import { API_URL, MERCHANDISE_ENDPOINT } from "../constant";
import axios from "axios";

const baseUrl = `${API_URL}/${MERCHANDISE_ENDPOINT}`;

export function filterMerchandiseByPriceType(
  merchandises: any[],
  priceType: MerchandisePriceType
) {
  return merchandises.filter((item: any) => {
    if (priceType === MerchandisePriceType.FREE) return item.price == 0;
    if (priceType === MerchandisePriceType.PAID) return item.price > 0;
  });
}

export function filterMerchandiseByName(merchandise: any[], keyword: string) {
  return merchandise.filter((item: any) => {
    return item.name.toLowerCase().includes(keyword.toLowerCase());
  });
}

export async function searchCollectedMerchandise(
  userId: number,
  keyword: string,
  cursor: number,
  priceType?: MerchandisePriceType
) {
  const response = (
    await axios.get(baseUrl, {
      params: {
        userId: userId,
        keyword: keyword,
        cursor: cursor,
        priceType: priceType,
      },
    })
  ).data;
  return response;
}

export async function updateMerchandise(
  mercId: number,
  merch: Merchandise,
  userId: number | undefined
) {
  const response = (
    await axios.post(baseUrl + `/${mercId}?userId=${userId}`, merch)
  ).data;
  return response;
}
