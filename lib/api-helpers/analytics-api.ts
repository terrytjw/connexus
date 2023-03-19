import { Comment } from "@prisma/client";
import { API_URL, ANALYTICS_ENDPOINT } from "../constant";
import axios from "axios";
import { lastWeek } from "../../utils/date-util";

const baseUrl = `${API_URL}/${ANALYTICS_ENDPOINT}`;

export async function getChannelAnalyticsByCreatorAPI(
  userId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = new Date()
) {
  const url = baseUrl + '/channel'
  const response = (await axios.get(url, {
    params: {
      userId: userId,
      lowerBound: lowerBound,
      upperBound: upperBound
    }
  })).data;
  return response;
}

export async function getChannelAnalyticsByChannelAPI(
  channelId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = new Date()
) {
  const url = baseUrl + '/channel/filter'
  const response = (await axios.get(url, {
    params: {
      channelId: channelId,
      lowerBound: lowerBound,
      upperBound: upperBound
    }
  })).data;
  return response;
}

export async function getCommunityAnalyticsByCreatorAPI(
  userId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = new Date()
) {
  const url = baseUrl + '/community'
  const response = (await axios.get(url, {
    params: {
      userId: userId,
      lowerBound: lowerBound,
      upperBound: upperBound
    }
  })).data;
  return response;
}

export async function getCollectionAnalyticsByCreatorAPI(
  userId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = new Date()
) {
  const url = baseUrl + '/collections'
  const response = (await axios.get(url, {
    params: {
      userId: userId,
      lowerBound: lowerBound,
      upperBound: upperBound
    }
  })).data;
  return response;
}

export async function getCollectionAnalyticsByCollectionAPI(
  channelId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = new Date()
) {
  const url = baseUrl + '/collection/filter'
  const response = (await axios.get(url, {
    params: {
      channelId: channelId,
      lowerBound: lowerBound,
      upperBound: upperBound
    }
  })).data;
  return response;
}

export async function getEventAnalyticsByCreatorAPI(
  userId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = new Date()
) {
  const url = baseUrl + '/channel'
  const response = (await axios.get(url, {
    params: {
      userId: userId,
      lowerBound: lowerBound,
      upperBound: upperBound
    }
  })).data;
  return response;
}

export async function getEventAnalyticsByEventAPI(
  channelId: number,
  lowerBound: Date = lastWeek(),
  upperBound: Date = new Date()
) {
  const url = baseUrl + '/event/filter'
  const response = (await axios.get(url, {
    params: {
      channelId: channelId,
      lowerBound: lowerBound,
      upperBound: upperBound
    }
  })).data;
  return response;
}