import { MerchandisePriceType } from "../../pages/api/merch";
import { API_URL, MERCHANDISE_ENDPOINT } from "../constant";
import axios from "axios";

// export async function filterMerchandiseByPriceType(
//   cursor?: number,
//   collectionId?: number,
//   priceType?: MerchandisePriceType
// ) {
//   const object = { cursor, collectionId, priceType } as any;

//   const params = new URLSearchParams(object).toString();
//   const url = `${API_URL}/${MERCHANDISE_ENDPOINT}?${params}`;
//   const response = (await axios.get(url)).data;
//   console.log(response);
//   return response;
// }

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
  priceType: MerchandisePriceType
) {
  const response = (await axios.get(baseUrl, {
    params: {
      userId: userId,
      keyword: keyword,
      priceType: priceType
    }
  })).data;
  return response;
}
