import { Prisma, Merchandise, CollectionState, Currency } from "@prisma/client";
import useSWR from "swr";
import axios from "axios";
import React from "react";
import { ethers } from "ethers";
import { smartContract } from "../lib/constants";
import {img} from "../lib/image";
import { swrFetcher } from "../lib/swrFetcher";


type CollectionwithMerch = Prisma.CollectionGetPayload<{
  include: { merchandise: true };
}>;
type UserWithTicketsandMerch = Prisma.UserGetPayload<{
  include: { tickets: true; merchandise: true };
}>;

const BigNumber = require("bignumber.js");

//Smart Contract Stuff:
const contract = require("../artifacts/contracts/Collection.sol/Collection.json");
const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/3oE8BGNsfXndWYJbZxEkLCsZZ6STLO2R"
);
const abi = contract.abi;
const bytecode = contract.bytecode;
var signer = new ethers.Wallet(smartContract.privateKey, provider);

const CollectionsPage = (props: any) => {
  async function fetchCollections(url: string) {
    const response = await axios.get(url);
    const data = response.data as CollectionwithMerch[];
    return data;
  }

  async function createCollection() {
    /*
    Inputs: 
    1. Collection Info
    2. Merch Info
    */

    const Collection_Contract = new ethers.ContractFactory(
      abi,
      bytecode,
      signer
    );

    //Whole list of collection and merch info
    const description = "NFT merch digital";
    const currency = "USD";
    const collectionState = "CREATED";
    const creator_id = 1;
    const collectionName = "collection10";

    const merchandise_categories = [
      {
        name: "Merch1",
        media: img,
        description: "cool items",
        totalMerchSupply: 200,
        price: 10,
      },
      {
        name: "Merch2",
        media: img,
        description: "cool items 2",
        totalMerchSupply: 200,
        price: 50,
      },
    ];
    //ends here

    let categories = [];
    let category_quantity = [];
    let category_price = [];

    for (let i = 0; i < merchandise_categories.length; i++) {
      let cat = merchandise_categories[i];
      categories.push(cat.name);
      category_quantity.push(cat.totalMerchSupply);
      let input = cat.price;
      category_price.push(input);
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
      merchandise: merchandise_categories,
      creatorId: creator_id,
    };
    console.log(new_collection);

    let response = await axios.post(
      "http://localhost:3000/api/collections",
      new_collection
    );
    let data = response.data;
    console.log("Collection Created");
  }

  async function deleteCollection() {
    let response = await axios.delete(
      "http://localhost:3000/api/collections/2"
    );
    let data = response.data;
    console.log("Collection Deleted");
  }

  async function mintOnChain(
    collectioInfo: Partial<CollectionwithMerch>,
    merch_category: string
  ) {
    console.log("IPFS");
    const { collectionName, description } = collectioInfo;
    console.log(description);
    let metaData = JSON.stringify({
      pinataOptions: {
        cidVersion: 1,
      },
      pinataMetadata: {
        name: "testing",
        keyvalues: {
          customKey: "customValue",
          customKey2: "customValue2",
        },
      },
      pinataContent: {
        collectionName: collectionName,
        description: description,
        category: merch_category,
      },
    });

    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    return axios.post(url, metaData, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: smartContract.pinataApiKey,
        pinata_secret_api_key: smartContract.pinataSecretApiKey,
      },
    });
  }

  async function mintMerch() {
    /*
    Inputs: 
    1. Collection id 
    2. Merch category 
    3. User id
    */

    const userId = 1;
    const collectionId = 4;
    const merch_category = "Merch2";

    let response = await axios.get(
      "http://localhost:3000/api/collections/" + collectionId.toString()
    );
    const collectionInfo = response.data as CollectionwithMerch;
    const { scAddress, merchURIs, merchandise } = collectionInfo;

    let user_response = await axios.get(
      "http://localhost:3000/api/users/" + userId.toString()
    );
    const userInfo = user_response.data as UserWithTicketsandMerch;
    var user_merch = userInfo.merchandise;

    //Mint + IPFS
    response = await mintOnChain(collectionInfo, merch_category);
    let ipfsHash = response.data.IpfsHash;
    console.log(ipfsHash);

    if (ipfsHash == "") return;
    const link = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;
    console.log("IPFS Hash Link  : ", link);
    console.log(scAddress);
    const collection_contract = new ethers.Contract(scAddress, abi, signer);

    const category_info = await collection_contract.getMerchinformation(
      merch_category
    );
    const price_needed = category_info._price._hex;
    console.log(price_needed);
    console.log("output : ", parseInt(price_needed, 16));
    const mint_merch = await collection_contract.mint(merch_category, link, {
      gasLimit: 2100000,
      value: price_needed,
    });
    console.log(mint_merch.hash);

    for (let j = 0; j < merchandise.length; j++) {
      console.log(merchandise[j].name);
      if (merchandise[j].name == merch_category) {
        console.log(merchandise[j].currMerchSupply);
        var new_merch: Partial<Merchandise> = {
          merchId: merchandise[j].merchId,
          name: merchandise[j].name,
          totalMerchSupply: merchandise[j].totalMerchSupply,
          currMerchSupply: merchandise[j].currMerchSupply + 1,
          price: merchandise[j].price,
          media: merchandise[j].media,
          description: merchandise[j].description,
        };
        console.log(new_merch);
        let response_merch = await axios.post(
          "http://localhost:3000/api/merch/" +
            merchandise[j].merchId.toString(),
          new_merch
        );
        console.log(response_merch);
        user_merch.push(merchandise[j]);
        const updated_user = {
          ...userInfo,
          merchandise: user_merch,
        };
        console.log(updated_user);
        let user_update = await axios.post(
          "http://localhost:3000/api/users/" + userId.toString(),
          updated_user
        );
        console.log(user_update);

        break;
      }
    }
    merchURIs.push(link);

    const updated_collection = {
      collectionName: collectionInfo.collectionName,
      description: collectionInfo.description,
      currency: collectionInfo.currency,
      collectionState: collectionInfo.collectionState,
      fixedPrice: collectionInfo.fixedPrice,
      scAddress: collectionInfo.scAddress,
      merchURIs: merchURIs,
    };

    console.log(updated_collection);
    let updated_response = await axios.post(
      "http://localhost:3000/api/collections/" + collectionId.toString(),
      updated_collection
    );
    let updated_data = updated_response.data;
    console.log("Data uploaded for both collection + user");
  }

  async function getMerch(ipfs_link: string) {
    let response = await axios.get(ipfs_link, {
      headers: {
        Accept: "text/plain",
      },
    });
    console.log(response);
    return response;
  }

  async function updateCollection() {
    /*
    Inputs: 
    1. Merch Id
    2. Collection Id
    3. Collection Info
    4. Merch Info
    */

    const collection_id = 4;
    let response_collection = await axios.get(
      "http://localhost:3000/api/collections/" + collection_id.toString()
    );
    const collectionInfo = response_collection.data as CollectionwithMerch;
    const { scAddress, merchURIs, merchandise } = collectionInfo;
    console.log(collectionInfo);

    //updating merch categories -> new merch
    const merch_categories = [
      {
        name: "jacketsssss",
        media: img,
        description: "cool items",
        totalMerchSupply: 200,
        price: 10,
      },
      {
        name: "lightstics",
        media: img,
        description: "cool items 2",
        totalMerchSupply: 10,
        price: 50,
      },
    ];
    let map = {} as any;

    const updatedMerchandise: Partial<Merchandise>[] = merchandise;

    for (let k = 0; k < merch_categories.length; k++) {
      if (k > merchandise.length - 1) {
        //create new merch category
        console.log(merchandise);
        var new_merch: Partial<Merchandise> = {
          name: merch_categories[k].name,
          totalMerchSupply: merch_categories[k].totalMerchSupply,
          currMerchSupply: 0,
          media : img, 
          price: merch_categories[k].price,
          description: merch_categories[k].description,
          collectionId: collection_id,
        };
        updatedMerchandise.push(new_merch);
        await axios.post("http://localhost:3000/api/merch", new_merch);
      } else {
        if (
          merchandise[k].currMerchSupply >= merch_categories[k].totalMerchSupply
        ) {
          console.log("Not allowed to change");
          //return ""
        }

        //Update existing merch category
        var merch: Partial<Merchandise> = {
          merchId: merchandise[k].merchId,
          media : merch_categories[k].media,
          name: merch_categories[k].name,
          totalMerchSupply: merch_categories[k].totalMerchSupply,
          currMerchSupply: merchandise[k].currMerchSupply,
          price: merch_categories[k].price,
          description: merch_categories[k].description,
        };
        await axios.post(
          "http://localhost:3000/api/merch/" +
            merchandise[k].merchId.toString(),
          merch
        );
        console.log(merch);
        console.log("Updated existing");

        if (updatedMerchandise[k].name !== undefined) {
          const updatedMerchandiseName = updatedMerchandise[k].name as string;
          map[updatedMerchandiseName] = merch_categories[k].name;
        }
      }
    }

    if (merch_categories.length < merchandise.length) {
      //new set of categories is less the original set -> time to go through the remaining and delete acordingly
      for (let j = merch_categories.length - 1; j < merchandise.length; j++) {
        if (merchandise[j].currMerchSupply > 0) {
          console.log("Not allowed to change");
          // return ""
        } else {
          await axios.delete(
            "http://localhost:3000/api/merch/" +
              merchandise[j].merchId.toString()
          );
        }
      }
    }

    let categories = [];
    let category_quantity = [];
    let category_price = [];

    for (let i = 0; i < merch_categories.length; i++) {
      var cat = merch_categories[i];
      categories.push(cat.name);
      category_quantity.push(cat.totalMerchSupply);
      var input = cat.price;
      category_price.push(input);
      /*
      issues with big number
      if (input < 0.1){
        category_price.push(input * 10**(18));
      } else{
        category_price.push(ethers.BigNumber.from(input).mul(BigNumber.from(10).pow(18)));
      } 
      //rounds off to 1 matic bcos bigint > float*/
    }

    const event_contract = new ethers.Contract(scAddress, abi, signer);
    const category_info = await event_contract.changeCategories(
      categories,
      category_price,
      category_quantity,
      {
        gasLimit: 2100000,
      }
    );
    console.log("Contract for merch categories updated");

    //Updating Collection Information + repin all ipfs links again -> new collection info
    console.log("Collection Info");

    let newMerchURI = [];
    const updated_collection: Partial<CollectionwithMerch> = {
      collectionName: "This is a new collection",
      description: "This is just a description",
      currency: Currency.USD,
      collectionState: CollectionState.CREATED,
    };

    console.log("Map");
    console.log(map);
    if (merchURIs.length > 0) {
      for (let i = 0; i < merchURIs.length; i++) {
        var merchURI = merchURIs[i];
        console.log(merchURI);
        let response_metadata = await getMerch(merchURI);
        console.log(response_metadata.data);
        let existing_user_merch_category = response_metadata.data.category;
        console.log("Existing merch");
        console.log(existing_user_merch_category);

        var new_user_merch_category = map[existing_user_merch_category];

        let category_chosen = new_user_merch_category;
        console.log("Updated Category => ", category_chosen);
        const event_contract = new ethers.Contract(scAddress, abi, signer);
        let response_pinning = await mintOnChain(
          updated_collection,
          category_chosen
        );
        let ipfsHash = response_pinning.data.IpfsHash;
        console.log(ipfsHash);

        if (ipfsHash == "") return;

        const link = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;
        console.log("IPFS Hash Link  : ", link);
        var changeTokenURI = await event_contract.setNewTokenURI(i, link, {
          gasLimit: 2100000,
        });
        console.log("Changed for Token ", i);
        newMerchURI.push(link);
      }

      console.log("Updated Merch => ", merchandise);
      const updated_collection_withuri: Partial<CollectionwithMerch> = {
        collectionName: "This is a new collection",
        description: "This is just a description",
        currency: "USD",
        collectionState: CollectionState.CREATED,
        merchURIs: newMerchURI,
      };
      console.log("updated collection:");
      console.log(updated_collection_withuri);
      let updated_response = await axios.post(
        "http://localhost:3000/api/collections/" + collection_id.toString(),
        updated_collection_withuri
      );
      let updated_data = updated_response.data;
      console.log("Data uploaded");
    } else {
      console.log("Nothing to update for tokenURIs in event");
    }
  }

  const { data, error, isLoading } = useSWR(
    "http://localhost:3000/api/collections",
    swrFetcher
  );

  console.log(data);

  return (
    <div>
      CollectionsPage
      <br />
      <button onClick={updateCollection}>Click me to update</button>;
      <br />
      <button onClick={createCollection}>Click me to create</button>;
      <br />
      <button onClick={deleteCollection}>Click me to delete</button>;
      <br />
      <br />
      <br />
      <button onClick={mintMerch}>Click me to mint </button>;
      <br />
    </div>
  );
};

export default CollectionsPage;
