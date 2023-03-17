import { Channel, ChannelType } from "@prisma/client";
import { API_URL, CHANNEL_ENDPOINT } from "../constant";
import axios from "axios";
import { checkIfMemberOfCommunity } from "../prisma/community-prisma";

const baseUrl = `${API_URL}/${CHANNEL_ENDPOINT}`;

export async function getChannelAPI(channelId: number) {
  const url = baseUrl + `/${channelId}`;
  const response = (await axios.get(url)).data;
  return response;
}

export async function getAllChannelsInCommunityAPI(communityId: number) {
  const response = (await axios.get(baseUrl, {
    params: {
      communityId: communityId
    }
  })).data;
  return response;
}

export async function createPremiumChannelAPI(
  name: string,
  collectionId: number,
  communityId: number
) {
  const response = (await axios.post(baseUrl, {
    name: name,
    channelType: ChannelType.PREMIUM,
    collectionId: collectionId,
    communityId: communityId
  })).data;
  return response;
}

export async function updateChannelAPI(
  channelId: number,
  name: string
) {
  const url = baseUrl + `/${channelId}`;
  const response = (await axios.post(url, {
    name: name
  })).data;
  return response;
}

export async function deleteChannelAPI(channelId: number) {
  const url = baseUrl + `/${channelId}`;
  const response = (await axios.delete(url)).data;
  return response;
}

export async function joinChannelAPI(communityId: number, channelId: number, userId: number) {
  const isMember = await checkIfMemberOfCommunity(communityId, userId);
  if (isMember) {
    const url = baseUrl + `/${channelId}/join`;
    const response = (await axios.post(url, {}, {
      params: {
        userId: userId
      }
    })).data;
    return response;
  }

  const url = baseUrl + `/${communityId}/join`;
    const response = (await axios.post(url, {}, {
      params: {
        userId: userId
      }
    })).data;
    return response;
}

export async function leaveChannelAPI(channelId: number, userId: number) {
  const url = baseUrl + `/${channelId}/leave`;
  const response = (await axios.post(url, {}, {
    params: {
      userId: userId
    }
  })).data;
  return response;
}

export async function searchUsersInChannelAPI(channelId: number, keyword: string) {
  const url = baseUrl + `/${channelId}/users`;
  const response = (await axios.get(url,{
    params: {
      keyword: keyword
    }
  })).data;
  return response;
}