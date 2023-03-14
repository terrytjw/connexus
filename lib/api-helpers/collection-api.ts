import React from "react";
import {
  Prisma,
  Merchandise,
  CollectionState,
  Collection,
} from "@prisma/client";
import axios from "axios";
import { ethers } from "ethers";
import { API_URL, COLLECTION_ENDPOINT, smartContract } from "../constant";
import { CollectionsGETParams } from "../../pages/api/collections";

export type CollectionwithMerch = Prisma.CollectionGetPayload<{
  include: { merchandise: true };
}>;

export type CollectionWithMerchAndPremiumChannel = Prisma.CollectionGetPayload<{
  include: { merchandise: true; premiumChannel: true };
}>;

/** Smart Contract information */
const contract = require("../../artifacts/contracts/Collection.sol/Collection.json");
const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/3oE8BGNsfXndWYJbZxEkLCsZZ6STLO2R"
);
const abi = contract.abi;
const bytecode = contract.bytecode;
var signer = new ethers.Wallet(smartContract.privateKey, provider);

const baseUrl = `${API_URL}/${COLLECTION_ENDPOINT}`;

/**
 * Description: Creates a new collection
 * Parameters:
 * - collectionName: string (name of collection)
 * - description: string (description of collection)
 * - creator_id: number (id of the person creating the collection)
 * - price: number (price of each merchandise in the collection)
 */
export async function createCollection(
  collectionName: string,
  description: string,
  creator_id: number,
  price: number,
  collectibles: Merchandise[] // an array of collectible objects | TODO: change to collectible type
) {
  const Collection_Contract = new ethers.ContractFactory(abi, bytecode, signer);

  let categories: string[] = []; // type of merchandise in the collection
  let category_quantity = []; // qty of a specific type of merchandise in the collection
  let category_price = []; // price of a specific type of merchandise in the collection

  for (let i = 0; i < collectibles.length; i++) {
    let cat = collectibles[i];

    categories.push(cat.name);
    category_quantity.push(cat.totalMerchSupply);
    category_price.push(price);
    collectibles[i].price = price;
  }

  /** Deploying a custom smart contract for a new collection */
  const collection_contract = await Collection_Contract.deploy(
    categories,
    category_price,
    category_quantity,
    collectionName,
    description,
    2, // commission
    collectionName
  ); //1 merch max per person

  console.log(
    "Contract successfully deployed => ",
    collection_contract.address
  );

  /** Creating a new collection item in the DB */
  const newCollection = {
    collectionName: collectionName,
    description: description,
    currency: "USD",
    collectionState: CollectionState.ON_SALE,
    scAddress: collection_contract.address,
    merchURIs: [],
    merchandise: collectibles,
    fixedPrice: price,
    creatorId: creator_id,
  };

  const createdResponseData = await axios.post(baseUrl, newCollection);
  console.log("==================================");
  console.log("Collection created: ", createdResponseData);
  console.log("==================================");
  return createdResponseData;
}

/**
 * Description: Updates an existing collection
 * Parameters:
 * - updatedName: string (name of collection)
 * - updatedDescription: string (description of collection)
 * - collection_id: number (id of the collection u are updating)
 */
export async function updateCollection(
  updatedName: string,
  updatedDescription: string,
  collectionId: number
) {
  const collectionUrl = baseUrl + `/${collectionId}`;
  const retrievedCollectionResponse = (await axios.get(collectionUrl)).data;

  console.log("retrieved collection: ", retrievedCollectionResponse);

  const { merchandise, ...collectionInfo } =
    retrievedCollectionResponse as CollectionWithMerchAndPremiumChannel;

  /** update ur collection in the collectionName and description fields below */
  const updatedCollection: Partial<Collection> = {
    ...collectionInfo,
    collectionName: updatedName,
    description: updatedDescription,
  };

  console.log("updated collection: ", updatedCollection);

  const updatedCollectionResponse = (
    await axios.post(collectionUrl, updatedCollection)
  ).data;

  console.log("==================================");
  console.log("Collection updated: ", updatedCollectionResponse);
  console.log("==================================");
  return updatedCollectionResponse;
}

/**
 * Description: Pauses a collection sale
 * Parameters:
 * - collection_id: number (id of the collection u are updating)
 */
export async function pauseCollectionMint(collectionId: number) {
  const collectionUrl = baseUrl + `/${collectionId}`;
  const retrievedCollectionResponse = (await axios.get(collectionUrl)).data;

  const { merchandise, ...collectionInfo } =
    retrievedCollectionResponse as CollectionwithMerch;

  /** update ur collection in the collectionName and description fields below */
  const updatedCollection: Partial<Collection> = {
    ...collectionInfo,
    collectionState: CollectionState.PAUSED,
  };

  const updatedCollectionResponse = (
    await axios.post(collectionUrl, updatedCollection)
  ).data;

  console.log("Pause collection response: ", updatedCollectionResponse);
}

/**
 * Description: Starts a collection sale
 * Parameters:
 * - collection_id: number (id of the collection u are updating)
 */
export async function startCollectionMint(collectionId: number) {
  const collectionUrl = baseUrl + `/${collectionId}`;
  const retrievedCollectionResponse = (await axios.get(collectionUrl)).data;

  const { merchandise, ...collectionInfo } =
    retrievedCollectionResponse as CollectionwithMerch;

  /** update ur collection in the collectionName and description fields below */
  const updatedCollection: Partial<Collection> = {
    ...collectionInfo,
    collectionState: CollectionState.ON_SALE,
  };

  const updatedCollectionResponse = (
    await axios.post(collectionUrl, updatedCollection)
  ).data;

  console.log("Start collection response: ", updatedCollectionResponse);
  return updatedCollectionResponse;
}

export async function searchAllCollections(
  cursor: number,
  keyword: string,
  isLinked?: boolean
) {
  const params = { 
    cursor: cursor,
    keyword: keyword,
    isLinked: isLinked 
  };
  const response = await searchCreatorCollections(params);
  return response;
}

export async function getLinkedCollections(userId: number) {
  const params = { userId: userId };
  const response = await searchCreatorCollections(params);
  return response;
}

export async function searchCreatorCollectionsByState(params: {
  userId: number;
  collectionState: CollectionState;
  keyword: string;
}) {
  // const params = {
  //   userId: userId,
  //   collectionState: collectionState,
  //   keyword: keyword,
  // };
  const convertedParams = {
    userId: params.userId,
    collectionState: params.collectionState,
    keyword: params.keyword
  }
  const response = await searchCreatorCollections(convertedParams)
  return response;
}


export async function getUnsoldUnlinkedCollections(userId: number) {
  const params = {
    userId: userId,
    isLinked: false,
    omitSold: true
  }

  const response = await searchCreatorCollections(params);
  return response;
}

function setDefaultParams(params: CollectionsGETParams) {
  if (!params.keyword) params.keyword = "";
  if (!params.cursor) params.cursor = 0;
  if (!params.omitSold) params.omitSold = false;
  return params;
}

async function searchCreatorCollections(params: CollectionsGETParams) {
  setDefaultParams(params);
  console.log(params);
  const response = (
    await axios.get(baseUrl, {
      params: params,
    })
  ).data;
  return response;
}

export async function getCollection(collectionId: number) {
  const url = baseUrl + `${collectionId}`;
  const response = (await axios.get(url)).data;
  return response;
}


// Old functions

export async function searchCollectionByName(
  cursor?: number,
  userId?: number,
  keyword?: string
) {
  const object = { cursor, userId, keyword } as any;
  const params = new URLSearchParams(object).toString();
  const url = baseUrl + `?${params}`;
  const response = (await axios.get(url)).data;
  console.log("search response: ", response);

  response.map((item: Collection) => {
    return {
      collectionName: item.collectionName,
    };
  });
  return response;
}

// get all collection info @@To be edited because we need additional endpoint to retrieve collection info by userId
export async function getCollectionInfo(userId: number) {
  const url = baseUrl + `/${userId}`;
  const response = (await axios.get(url)).data;
  return response;
}

