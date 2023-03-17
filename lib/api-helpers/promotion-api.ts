import axios from "axios";
import { API_URL, PROMOTION_ENDPOINT } from "./../constant";

const baseUrl = `${API_URL}/${PROMOTION_ENDPOINT}`;

export async function getPromotionCodeByName(
  promotionCode: string,
  ticketId: number
) {
  const response = (
    await axios.get(baseUrl, {
      params: {
        promotionCode: promotionCode,
        ticketId: ticketId,
      },
    })
  ).data;

  return response;
}

// export async function createPromo(
//     promotionCode: string,
//     ticketId: number
//   ) {
//     const response = (
//       await axios.get(baseUrl, {
//         params: {
//           promotionCode: promotionCode,
//           ticketId: ticketId,
//         },
//       })
//     ).data;

//     return response;
//   }
