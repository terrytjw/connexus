import {
  Prisma,
  Merchandise,
  CollectionState,
  Currency,
  Collection,
} from "@prisma/client";
import axios from "axios";
import React from "react";
import { ethers } from "ethers";
import { smartContract } from "./constants";

//Smart Contract Stuff:
const contract = require("../artifacts/contracts/Collection.sol/Collection.json");
const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/3oE8BGNsfXndWYJbZxEkLCsZZ6STLO2R"
);
const abi = contract.abi;
const bytecode = contract.bytecode;
var signer = new ethers.Wallet(smartContract.privateKey, provider);

export const printVariables = () => {
  console.log("contract -> ", contract);
  console.log("provider -> ", provider);
  console.log("abi -> ", abi);
  console.log("bytecode -> ", bytecode);
  console.log("signer -> ", signer);
};

type CollectionwithMerch = Prisma.CollectionGetPayload<{
  include: { merchandise: true };
}>;

/**
 * Creates a new collection
 * inputs:
 * - collectionName: string (name of collection)
 * - description: string (description of collection)
 * - creator_id: number (id of the person creating the collection)
 */
export async function createCollection(
  collectionName: string,
  description: string,
  creator_id: number,
  price: number,
  collectibles: any // an array of collectible objects | TODO: change to collectible type
) {
  const Collection_Contract = new ethers.ContractFactory(abi, bytecode, signer);

  //Whole list of collection and merch info
  // const collectionName = "Ayuma Origin";
  // const description = "Ayuma is a very sexy NFT collection.";
  // const currency = "USD";
  // const collectionState = "CREATED";
  // const creator_id = 4;

  // const merchandise_categories = [
  //   {
  //     name: "Merch1",
  //     image: "....com",
  //     totalMerchSupply: 200,
  //     price: 10,
  //   },
  //   {
  //     name: "Merch2",
  //     image: "....com",
  //     totalMerchSupply: 200,
  //     price: 50,
  //   },
  // ];
  //ends here

  let categories = [];
  let category_quantity = [];
  let category_price = [];

  for (let i = 0; i < collectibles.length; i++) {
    let cat = collectibles[i];

    categories.push(cat.name);
    category_quantity.push(cat.totalMerchSupply);
    // let input = cat.price;
    category_price.push(price);
    collectibles[i].price = price;

    /* issues with big number
      if (input < 0.1){
        category_price.push(input * 10**(18));
      } else{
        category_price.push(ethers.BigNumber.from(input).mul(BigNumber.from(10).pow(18)));
      } */
    //rounds off to 1 matic bcos bigint > float
  }
  console.log(category_price);
  const collection_contract = await Collection_Contract.deploy(
    categories,
    category_price,
    category_quantity,
    collectionName,
    description,
    2,
    collectionName
  ); //1 merch max per person

  console.log(
    "Contract successfully deployed => ",
    collection_contract.address
  );

  const new_collection = {
    collectionName: collectionName,
    description: description,
    currency: "USD",
    collectionState: CollectionState.CREATED,
    scAddress: collection_contract.address,
    merchURIs: [],
    merchandise: collectibles,
    creatorId: creator_id,
  };
  console.log(new_collection);

  let response = await axios.post(
    "http://localhost:3000/api/collections",
    new_collection
  );
  let data = response.data;
  console.log("==================================");
  console.log("Collection Created");
  console.log("==================================");
}

/**
 * inputs:
 * - updatedName: string (name of collection)
 * - updatedDescription: string (description of collection)
 * - collection_id: number (id of the collection u are updating)
 */
export async function updateCollection(
  updatedName: string,
  updatedDescription: string,
  collection_id: number
) {
  let response_collection = await axios.get(
    `http://localhost:3000/api/collections/${collection_id}`
  );

  const { merchandise, ...collectionInfo } =
    response_collection.data as CollectionwithMerch;

  /** update ur collection in the collectionName and description fields below */
  const updated_collection: Partial<Collection> = {
    ...collectionInfo,
    collectionName: updatedName,
    description: updatedDescription,
  };

  console.log("updated collection: ", updated_collection);

  let update_response = await axios.post(
    `http://localhost:3000/api/collections/${collection_id}`,
    updated_collection
  );

  console.log("Data uploaded -> ", update_response.data);
}

export async function pauseCollectionMint(collection_id: number) {
  let response_collection = await axios.get(
    `http://localhost:3000/api/collections/${collection_id}`
  );

  const { merchandise, ...collectionInfo } =
    response_collection.data as CollectionwithMerch;

  /** update ur collection in the collectionName and description fields below */
  const updated_collection: Partial<Collection> = {
    ...collectionInfo,
    collectionState: CollectionState.PAUSED,
  };

  console.log("updated collection: ", updated_collection);

  let update_response = await axios.post(
    `http://localhost:3000/api/collections/${collection_id}`,
    updated_collection
  );

  console.log("Data uploaded -> ", update_response.data);
}

export async function startCollectionMint(collection_id: number) {
  let response_collection = await axios.get(
    `http://localhost:3000/api/collections/${collection_id}`
  );

  const { merchandise, ...collectionInfo } =
    response_collection.data as CollectionwithMerch;

  /** update ur collection in the collectionName and description fields below */
  const updated_collection: Partial<Collection> = {
    ...collectionInfo,
    collectionState: CollectionState.ON_SALE,
  };

  console.log("updated collection: ", updated_collection);

  let update_response = await axios.post(
    `http://localhost:3000/api/collections/${collection_id}`,
    updated_collection
  );

  console.log("Data uploaded -> ", update_response.data);
}
