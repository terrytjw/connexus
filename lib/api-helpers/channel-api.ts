import { Channel, ChannelType } from "@prisma/client";
import { API_URL, CHANNEL_ENDPOINT } from "../constant";
import axios from "axios";

const baseUrl = `${API_URL}/${CHANNEL_ENDPOINT}`;

export async function getChannel(channelId: number) {
  const url = baseUrl + `/${channelId}`;
  const response = (await axios.get(url)).data;
  return response;
}

export async function getAllChannelsInCommunity(communityId: number) {
  const response = (await axios.get(baseUrl, {
    params: {
      communityId: communityId
    }
  })).data;
  return response;
}

export async function createChannel(
  name: string,
  channelType: ChannelType,
  communityId: number
) {
  const response = (await axios.post(baseUrl, {
    name: name,
    channelType: channelType,
    communityId: communityId
  })).data;
  return response;
}

export async function updateChannel(
  channelId: number,
  name: string
) {
  const url = baseUrl + `/${channelId}`;
  const response = (await axios.post(baseUrl, {
    name: name
  })).data;
  return response;
}

export async function deleteChannel(channelId: number) {
  const url = baseUrl + `/${channelId}`;
  const response = (await axios.delete(baseUrl)).data;
  return response;
}

export async function joinChannel(channelId: number, userId: number) {
  const url = baseUrl + `/${channelId}/join`;
  const response = (await axios.post(baseUrl, {}, {
    params: {
      userId: userId
    }
  })).data;
  return response;
}

export async function leaveChannel(channelId: number, userId: number) {
  const url = baseUrl + `/${channelId}/leave`;
  const response = (await axios.post(baseUrl, {}, {
    params: {
      userId: userId
    }
  })).data;
  return response;
}

export async function searchUsersInChannel(channelId: number, keyword: string) {
  const url = baseUrl + `/${channelId}/users`;
  const response = (await axios.get(baseUrl,{
    params: {
      keyword: keyword
    }
  })).data;
  return response;
}