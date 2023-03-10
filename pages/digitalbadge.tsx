import { ethers } from "ethers";
import { smartContract } from "../lib/constant";

const BigNumber = require("bignumber.js");
//Smart Contract Stuff:
const contract = require("../artifacts/contracts/DigitalBadge.sol/DigitalBadge.json");
const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/3oE8BGNsfXndWYJbZxEkLCsZZ6STLO2R"
);
const abi = contract.abi;
const bytecode = contract.bytecode;
var signer = new ethers.Wallet(smartContract.privateKey, provider);

//To create badge contract -> similar to event contract

/*
Construct: 
eventName = _eventName; 
eventSymbol = _eventSymbol;
categories = _categories; 

const badge_contract = await badge_contract.deploy(
      eventName,
      eventSymbol,
      categories,
    ); 


To mint: 
mint(string memory category, address owner, string memory tokenURI)
//owner is the address owner, fetch rom db to get wallet address for the badge owner 
tokenURI -> as usual, update information on ipfs 
just eventname, badgeOwner, category
*/