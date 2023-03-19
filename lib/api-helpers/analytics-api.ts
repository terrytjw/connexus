import { Comment } from "@prisma/client";
import { API_URL, ANALYTICS_ENDPOINT } from "../constant";
import axios from "axios";
import { lastWeek } from "../../utils/date-util";

const baseUrl = `${API_URL}/${ANALYTICS_ENDPOINT}`;

export async function getChannelAnalyticsInRangeAPI(
  userId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = new Date()
) {
  const response = (await axios.get(baseUrl, {
    params: {
      userId: userId,
      lowerBound: lowerBound,
      upperBound: upperBound
    }
  })).data;
  return response;
}