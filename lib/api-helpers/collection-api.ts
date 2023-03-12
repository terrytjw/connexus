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

type CollectionwithMerch = Prisma.CollectionGetPayload<{
  include: { merchandise: true };
}>;

/** Smart Contract information */
const contract = require("../../artifacts/contracts/Collection.sol/Collection.json");
const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/3oE8BGNsfXndWYJbZxEkLCsZZ6STLO2R"
);
const abi = contract.abi;
const bytecode = contract.bytecode;
var signer = new ethers.Wallet(smartContract.privateKey, provider);

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

  const collectionUrl = `${API_URL}/${COLLECTION_ENDPOINT}`;
  const createdResponseData = (await axios.post(collectionUrl, newCollection))
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
  const collectionUrl = `${API_URL}/${COLLECTION_ENDPOINT}/${collectionId}`;
  const retrievedCollectionResponse = (await axios.get(collectionUrl)).data;

  console.log("retrieved collection: ", retrievedCollectionResponse);

  const { merchandise, ...collectionInfo } =
    retrievedCollectionResponse as CollectionwithMerch;

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
  const collectionUrl = `${API_URL}/${COLLECTION_ENDPOINT}/${collectionId}`;
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
  const collectionUrl = `${API_URL}/${COLLECTION_ENDPOINT}/${collectionId}`;
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

export async function searchCollectionByName(
  cursor?: number,
  userId?: number,
  keyword?: string
) {
  const object = { cursor, userId, keyword } as any;

  const params = new URLSearchParams(object).toString();
  const url = `${API_URL}/${COLLECTION_ENDPOINT}?${params}`;
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
  const url = `${API_URL}/${COLLECTION_ENDPOINT}/${userId}`;
  const response = (await axios.get(url)).data;
  return response;
}
