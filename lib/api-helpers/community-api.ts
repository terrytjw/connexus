import { CategoryType, Community } from "@prisma/client";
import { API_URL, COMMUNITY_ENDPOINT } from "../constant";
import axios from "axios";

const baseUrl = `${API_URL}/${COMMUNITY_ENDPOINT}`;

export async function getCommunity(communityId: number) {
	const url = baseUrl + `/${communityId}`;
	const response = (await axios.get(url)).data;

	return response;
}

export async function updateCommunity(communityId: number, communityInfo: Community) {
	const url = baseUrl + `/${communityId}`;
  const response = (await axios.post(url, communityInfo)).data;

  return response;
}
export async function deleteCommunity(communityId: Number) {
	const url = baseUrl + `/${communityId}`;
  const response = (await axios.delete(url)).data;

  return response;
}

export async function createCommunity(communityInfo: Community) {
  const response = (await axios.post(baseUrl, communityInfo)).data;

  return response;
}

export async function getAllCommunities(cursor: number, filter?: CategoryType[]) {
  const response = (await axios.get(baseUrl, {
		params: {
			cursor: cursor,
			filter: filter ? filter : undefined
		}
	})).data;

  return response;
}

export async function searchCommunities(keyword: string, cursor: number, filter?: CategoryType[]) {
  const response = (await axios.get(baseUrl, {
		params: {
			keyword: keyword,
			cursor: cursor,
			filter: filter ? filter : undefined
		}
	})).data;

  return response;
}

export async function joinCommunity(communityId: number, userId: number) {
	const url = baseUrl + `/${communityId}/join`;
  const response = (await axios.post(url, {}, // empty object for empty req body
    {
    params: {
      userId: userId
    }
  })).data;
	return response;
}

export async function leaveCommunity(communityId: number, userId: number) {
	const url = baseUrl + `/${communityId}/leave`;
  const response = (await axios.post(url, {}, { // empty object for empty req body
    params: {
      userId: userId
    }
  })).data;

	return response;
}
