import { Comment } from "@prisma/client";
import { API_URL, ANALYTICS_ENDPOINT } from "../constant";
import axios from "axios";
import { lastWeek, setTo2359, yesterday } from "../../utils/date-util";

const baseUrl = `${API_URL}/${ANALYTICS_ENDPOINT}`;

export enum AnalyticsEntity {
  CHANNEL,
  COMMUNITY,
  EVENT,
  COLLECTIONS
}

export async function getChannelAnalyticsByCreatorAPI(
  userId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = yesterday(),
) {
  return await getAnalytics(userId, AnalyticsEntity.CHANNEL, lowerBound, upperBound);
}

export async function getChannelAnalyticsByChannelAPI(
  channelId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = yesterday(),
) {
  return await getAnalytics(channelId, AnalyticsEntity.CHANNEL, lowerBound, upperBound, true);
}

export async function getCommunityAnalyticsByCreatorAPI(
  userId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = yesterday(),
) {
  return await getAnalytics(userId, AnalyticsEntity.COMMUNITY, lowerBound, upperBound);
}

export async function getCollectionAnalyticsByCreatorAPI(
  userId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = yesterday(),
) {
  return await getAnalytics(userId, AnalyticsEntity.COLLECTIONS, lowerBound, upperBound);
}

export async function getCollectionAnalyticsByCollectionAPI(
  collectionId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = yesterday(),
) {
  return await getAnalytics(collectionId, AnalyticsEntity.COLLECTIONS, lowerBound, upperBound, true);
}

export async function getEventAnalyticsByCreatorAPI(
  userId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = yesterday(),
) {
  return await getAnalytics(userId, AnalyticsEntity.EVENT, lowerBound, upperBound)
}

export async function getEventAnalyticsByEventAPI(
  eventId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = yesterday(),
) {
  return await getAnalytics(eventId, AnalyticsEntity.EVENT, lowerBound, upperBound, true)
}

async function getAnalytics(
  id: number, // either userId of the owner of the entities or id of entity itself
  entity: AnalyticsEntity,
  lowerBound: Date = lastWeek(),
  upperBound: Date = yesterday(),
  filter: boolean = false
) {
  lowerBound = setTo2359(lowerBound);
  upperBound = setTo2359(upperBound);
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

export async function getTopNSellingCollectionsAPI(
  lowerBound: Date = lastWeek(),
  upperBound: Date = yesterday(),
  n: number = 3,
  id? : number
) {
  lowerBound = setTo2359(lowerBound);
  upperBound = setTo2359(upperBound);
  const url = baseUrl + `/collections/best-selling`
  const response = (await axios.get(url, {
    params: {
      id: id,
      lowerBound: lowerBound,
      upperBound: upperBound,
      n: n
    }
  })).data;
  return response
}

export function exportAnalyticsToPDF(
  userId: number,
  entity: AnalyticsEntity,
  lowerBound: Date = lastWeek(),
  upperBound: Date = yesterday(),
) {
  return exportAnalytics(userId, entity, true, lowerBound, upperBound)
}

export function exportAnalyticsToCSV(
  userId: number,
  entity: AnalyticsEntity,
  lowerBound: Date = lastWeek(),
  upperBound: Date = yesterday(),
) {
  return exportAnalytics(userId, entity, false, lowerBound, upperBound)
}

function exportAnalytics(
  userId: number,
  entity: AnalyticsEntity,
  pdf: boolean,
  lowerBound: Date = lastWeek(),
  upperBound: Date = yesterday(),
) {
  lowerBound = setTo2359(lowerBound);
  upperBound = setTo2359(upperBound);

  let url = baseUrl;
  if (pdf) {
    url = baseUrl + `/pdf`;
  } else {
    url = baseUrl + `/csv`
  }

  url = url + `?userId=${userId}&entity=${entity}&lowerBound=${lowerBound}&upperBound=${upperBound}`;
  
  return url;
}