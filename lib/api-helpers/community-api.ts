import { CategoryType, Community } from "@prisma/client";
import { API_URL, COMMUNITY_ENDPOINT } from "../constant";
import axios from "axios";

const baseUrl = `${API_URL}/${COMMUNITY_ENDPOINT}`;

export async function getCommunityAPI(communityId: number) {
	const url = baseUrl + `/${communityId}`;
	const response = (await axios.get(url)).data;

	return response;
}

export type UpdateCommunityParams = {
	communityId: number
	name?: string,
	description?: string,
	profilePic?: string,
	bannerPic?: string,
	tags: CategoryType[],
	maxMembers?: number
}

export async function updateCommunityAPI(community: UpdateCommunityParams) {
	const url = baseUrl + `/${community.communityId}`;
  const response = (await axios.post(url, community)).data;

  return response;
}
export async function deleteCommunityAPI(communityId: Number) {
	const url = baseUrl + `/${communityId}`;
  const response = (await axios.delete(url)).data;

  return response;
}

export type CreateCommunityParams = {
	name: string,
	description?: string,
	profilePic?: string,
	bannerPic?: string,
	tags: CategoryType[],
	maxMembers?: number,
	userId: number
}

export async function createCommunityAPI(community: CreateCommunityParams) {
  const response = (await axios.post(baseUrl, community)).data;

  return response;
}

export async function getAllCommunitiesAPI(cursor: number, filter?: CategoryType[]) {
  const response = (await axios.get(baseUrl, {
		params: {
			cursor: cursor,
			filter: filter ? filter : undefined
		}
	})).data;

  return response;
}

export async function searchCommunitiesAPI(keyword: string, cursor: number, filter?: CategoryType[]) {
  const response = (await axios.get(baseUrl, {
		params: {
			keyword: keyword,
			cursor: cursor,
			filter: filter ? filter : undefined
		}
	})).data;

  return response;
}

export async function joinCommunityAPI(communityId: number, userId: number) {
	const url = baseUrl + `/${communityId}/join`;
  const response = (await axios.post(url, {}, // empty object for empty req body
    {
    params: {
      userId: userId
    }
  })).data;
	return response;
}

export async function leaveCommunityAPI(communityId: number, userId: number) {
	const url = baseUrl + `/${communityId}/leave`;
  const response = (await axios.post(url, {}, { // empty object for empty req body
    params: {
      userId: userId
    }
  })).data;

	return response;
}

export async function registerCommunityClick(communityId: number) {
  const communityUrl = baseUrl + `/${communityId}`

  const retrievedCommunityResponse = (await axios.get(communityUrl)).data;

  const updatedCommunity: Partial<Event> = {
    ...retrievedCommunityResponse,
    clicks: retrievedCommunityResponse.clicks + 1
  };

  const updatedCommunityResponse = (
    await axios.post(communityUrl, updatedCommunity)
  ).data;

  console.log("Start community response: ", updatedCommunityResponse);
  return updatedCommunityResponse;
}
