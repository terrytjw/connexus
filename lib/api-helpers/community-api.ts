import { CategoryType, Community } from "@prisma/client";
import { API_URL, COMMUNITY_ENDPOINT } from "../constant";
import axios from "axios";

export async function getCommunityInfo(communityId: number) {
	const url = `${API_URL}/${COMMUNITY_ENDPOINT}/${communityId}`;
	const response = (await axios.get(url)).data;

	return response;
}

export async function updateCommunityInfo(communityId: number, communityInfo: Community) {
	const url = `${API_URL}/${COMMUNITY_ENDPOINT}/${communityId}`;
  const response = (await axios.post(url, communityInfo)).data;

  return response;
}
export async function deleteCommunity(communityId: Number) {
	const url = `${API_URL}/${COMMUNITY_ENDPOINT}/${communityId}`;
  const response = (await axios.delete(url)).data;

  return response;
}

export async function createCommunity(communityInfo: Community) {
	const url = `${API_URL}/${COMMUNITY_ENDPOINT}`;
  const response = (await axios.post(url, communityInfo)).data;

  return response;
}

export async function getAllCommunities(cursor: number, filter?: CategoryType[]) {
	const url = `${API_URL}/${COMMUNITY_ENDPOINT}`;
  const response = (await axios.get(url, {
		params: {
			cursor: cursor,
			filter: filter ? filter : undefined
		}
	})).data;
}

export async function searchCommunities(keyword: string, cursor: number, filter?: CategoryType[]) {
	const url = `${API_URL}/${COMMUNITY_ENDPOINT}`;
  const response = (await axios.get(url, {
		params: {
			keyword: keyword,
			cursor: cursor,
			filter: filter ? filter : undefined
		}
	})).data;
}

export async function joinCommunity(communityId: number, userId: number) {
	const url = `${API_URL}/${COMMUNITY_ENDPOINT}/${communityId}/join`;
  const response = (await axios.post(url, userId)).data;

	return response;
}

export async function leaveCommunity(communityId: number, userId: number) {
	const url = `${API_URL}/${COMMUNITY_ENDPOINT}/${communityId}/leave`;
  const response = (await axios.post(url, userId)).data;

	return response;
}
