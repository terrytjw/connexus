import { Comment } from "@prisma/client";
import { API_URL, ANALYTICS_ENDPOINT } from "../constant";
import axios from "axios";
import { lastWeek, removeTime } from "../../utils/date-util";

const baseUrl = `${API_URL}/${ANALYTICS_ENDPOINT}`;

enum AnalyticsEntity {
  CHANNEL,
  COMMUNITY,
  EVENT,
  COLLECTION
}

export async function getChannelAnalyticsByCreatorAPI(
  userId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = new Date()
) {
  return await getAnalytics(userId, AnalyticsEntity.CHANNEL, lowerBound, upperBound);
}

export async function getChannelAnalyticsByChannelAPI(
  channelId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = new Date()
) {
  return await getAnalytics(channelId, AnalyticsEntity.CHANNEL, lowerBound, upperBound, true);
}

export async function getCommunityAnalyticsByCreatorAPI(
  userId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = new Date()
) {
  return await getAnalytics(userId, AnalyticsEntity.COMMUNITY, lowerBound, upperBound);
}

export async function getCollectionAnalyticsByCreatorAPI(
  userId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = new Date()
) {
  return await getAnalytics(userId, AnalyticsEntity.COMMUNITY, lowerBound, upperBound);
}

export async function getCollectionAnalyticsByCollectionAPI(
  collectionId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = new Date()
) {
  return await getAnalytics(collectionId, AnalyticsEntity.COMMUNITY, lowerBound, upperBound, true);
}

export async function getEventAnalyticsByCreatorAPI(
  userId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = new Date()
) {
  return await getAnalytics(userId, AnalyticsEntity.EVENT, lowerBound, upperBound)
}

export async function getEventAnalyticsByEventAPI(
  eventId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = new Date()
) {
  return await getAnalytics(eventId, AnalyticsEntity.EVENT, lowerBound, upperBound, true)
}

async function getAnalytics(
  id: number, // either userId of the owner of the entities or id of entity itself
  entity: AnalyticsEntity,
  lowerBound: Date = lastWeek(),
  upperBound: Date = new Date(),
  filter: boolean = false
) {
  lowerBound = removeTime(lowerBound);
  upperBound = removeTime(upperBound);
  let url = baseUrl + `/${AnalyticsEntity[entity].toLowerCase()}`
  if (filter) {
    url += "/filter"
  }

  const response = (await axios.get(url, {
    params: {
      id: id,
      lowerBound: lowerBound,
      upperBound: upperBound
    }
  })).data;
  return response;
}