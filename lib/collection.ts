import { Collection } from "@prisma/client";
import { API_URL, COLLECTION_ENDPOINT } from "./constant";
import axios from "axios";

// export async function filterCollectionByName(
//   cursor?: number,
//   userId?: number,
//   keyword?: string
// ) {
//   const object = { cursor, userId, keyword } as any;

//   const params = new URLSearchParams(object).toString();
//   const url = `${API_URL}/${COLLECTION_ENDPOINT}?${params}`;
//   const response = (await axios.get(url)).data;
//   console.log(response)

//   response.map((item: Collection) => {
//     return {
//       collectionName : item.collectionName
      
//     }
//   })
//   return response;
// }

export function filterCollectionByName(merchandises :any[],keyword: string){
  return merchandises.filter((item: any) => {
    return item.collectionName.toLowerCase().includes(keyword.toLowerCase())
  })
}
