import { ethers } from "ethers";
import contract from "../../artifacts/contracts/DigitalBadge.sol/DigitalBadge.json";
import { ALCHEMY_API, smartContract } from "../constant";
import { Event } from "@prisma/client";
import axios from "axios";

const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API);
const abi = contract.abi;
const bytecode = contract.bytecode;
const signer = new ethers.Wallet(smartContract.privateKey, provider);
const digitalBadgeContract = new ethers.ContractFactory(abi, bytecode, signer);

export async function deployDigitalBadge(
  categories: String[],
  eventName: String,
  eventSymbol: String
) {
  const response = await digitalBadgeContract.deploy(
    categories,
    eventName,
    2,
    eventSymbol
  );

  console.log(
    "Digital Badge Contract successfully deployed => ",
    response.address
  );

  return response.address;
}

export async function mintDigitalBadge(
  eventInfo: Partial<Event>,
  ticketCategory: string,
  userWallet: string
) {
  const response = await mintOnChainDigitalBadge(eventInfo);
  let ipfsHash = response.data.IpfsHash;
  console.log(ipfsHash);

  if (ipfsHash == "") return;
  const link = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;
  console.log("Digital Badge PFS Hash Link  : ", link);
  const scAddress = eventInfo.digitalBadgeScAddress ?? "";
  const digitalBadgeContract = new ethers.Contract(scAddress, abi, signer);
  console.log("smart contract address ->", scAddress);

  await digitalBadgeContract.mint(ticketCategory, userWallet, link, {
    gasLimit: 2100000,
  });

  return link;
}

async function mintOnChainDigitalBadge(eventInfo: Partial<Event>) {
  const { eventName, startDate, endDate } = eventInfo;

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
      event: eventName,
      startDate: startDate,
      endDate: endDate,
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
