import {
  Event,
  DurationType,
  PrivacyType,
  VisibilityType,
  Prisma,
  CategoryType,
} from "@prisma/client";
import useSWR from "swr";
import axios from "axios";
import { ethers } from 'ethers';
import React from "react";

type EventWithTickets = Prisma.EventGetPayload<{ include: { tickets: true } }>;

const BigNumber = require('bignumber.js');

//Pinata
const pinataApiKey = "be74f69d81d8435228e2";
const pinataSecretApiKey=  "9556c5997d472165edae4fd15461a8bac3d454bd73088101a95ae45657ea4bdf";
const JWT= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzNWRhMWQzNS0xZjc0LTRhNTUtODBlMC04NTMwNzE2OGU5Y2EiLCJlbWFpbCI6ImNjd2hoOThAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImJlNzRmNjlkODFkODQzNTIyOGUyIiwic2NvcGVkS2V5U2VjcmV0IjoiOTU1NmM1OTk3ZDQ3MjE2NWVkYWU0ZmQxNTQ2MWE4YmFjM2Q0NTRiZDczMDg4MTAxYTk1YWU0NTY1N2VhNGJkZiIsImlhdCI6MTY3NjYwMzU2Nn0.kGTRDcG0Xe0Be8yfzT9A4Vuc2jkxs32JqjJF0XqOOmY";


//Smart Contract Stuff:
const contract = require("../artifacts/contracts/SimpleEvent.sol/SimpleEvent.json");
console.log("ABI");
const abi = contract.abi; 
const bytecode = contract.bytecode;
// for provider
const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/3oE8BGNsfXndWYJbZxEkLCsZZ6STLO2R");
// for signer
var privateKey = "";
var signer = new ethers.Wallet(privateKey, provider);
//for polygon explorer - verification of contract 
const polygon_explorer_api = "RRZFZGGV2K9VB7CGAT92981EAPBSSD4RZ7";


const EventsPage = (props: any) => {
  async function fetchEvents(url: string) {
    const response = await axios.get(url);
    const data = response.data as EventWithTickets[];
    return data;
  }

  async function createEvent() {
    const Event_contract = new ethers.ContractFactory(abi, bytecode, signer); 
    const location = "Singapore Expo"; 
    const eventName = "Connexus"; 
    const date = new Date();
    const ticket_categories = [ {
      name: "General Admission",
      quantity: 100,
      price: 1,
      startDate: new Date(),
      endDate: new Date(),
      description: "General Admission",
    },
    {
      name: "VIP Pass",
      quantity: 100,
      price: 1,
      startDate: new Date(),
      endDate: new Date(),
      description: "This is a VIP Pass",
    }]; 

    var categories = [];
    var category_quantity = [];
    var category_price = [];
    
    

    for(let i = 0 ; i < ticket_categories.length; i ++){
      var cat = ticket_categories[i]; 
      categories.push( cat.name); 
      category_quantity.push(cat.quantity); 
      var input = (cat.price);
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
    const event_contract = await Event_contract.deploy(categories, category_price, category_quantity, eventName, date, location, 1, 100, eventName);  //1 ticket max per person

    console.log(event_contract.address);
    console.log("Contract successfully deployed")
    //https://mumbai.polygonscan.com/address/0x56efFE82a73515C0559ED8daE55e4Aa58c79B8Ea
    /*
    Minted : https://mumbai.polygonscan.com/tx/0x0955287ce5f43dbf38639a1e46bc48d01b283dc651ac025badbd8f2b9885acf3 
    Max Minting : https://mumbai.polygonscan.com/tx/0xa0b27dc693e9c20625ec395f0396f0dec29f16e4aa7877c34a700f7d5b2a9cc2 
    */

    const event: EventWithTickets = {
      eventId: 1,
      title: "This is a new event",
      category: CategoryType.AUTO_BOAT_AIR,
      location: "Singapore Expo",
      eventDurationType: DurationType.SINGLE,
      startDate: new Date(),
      endDate: new Date(),
      images: [],
      summary: "This is just a summary",
      description: "This is just a description",
      visibilityType: VisibilityType.DRAFT,
      privacyType: PrivacyType.PUBLIC,
      scAddress : "0x85DC03b19148468Bb306Ff5389d300E7893cAf80", //event_contract.address,
      /*tickets:[   issues with ticket addition to event
        {
          ticketId: 1, 
          eventId: 1, 
          name : "General Admission", 
          quantity: 100, 
          price: 10, 
          startDate : new Date(), 
          endDate: new Date(), 
          description: "General Admission"
    }
      ]*/
    };

    let response = await axios.post("http://localhost:3000/api/events", event);
    let data = response.data;
    console.log(data);

    
    
  }

  async function updateEvent() {
    const event: Event = {
      eventId: 1,
      title: "This is a new updated event",
      category: CategoryType.AUTO_BOAT_AIR,
      location: "Singapore Expo",
      eventDurationType: DurationType.SINGLE,
      startDate: new Date(),
      endDate: new Date(),
      images: [],
      summary: "This is just a summary",
      description: "This is just a description",
      visibilityType: VisibilityType.DRAFT,
      privacyType: PrivacyType.PRIVATE,
      scAddress : "s", //event_contract.address,

    };

    let response = await axios.post(
      "http://localhost:3000/api/events/1",
      event
    );
    let data = response.data;
    console.log(data);
  }

  async function deleteEvent() {
    let response = await axios.delete("http://localhost:3000/api/events/3");
    let data = response.data;
    console.log(data);
  }

  async function mintTicket(){
    //promotion will be separately applied 
    //get event details -> fish out to put into metadata 
    //once pinned -> go to smart contract mint function  -> input the ipfs link as tokenuri to mint 

    console.log("Pinning metadata");
    let response = await axios.get("http://localhost:3000/api/events/10");
    const event_details = response.data; 
    const event_sc = "0xeaBFF06FeBFEC94Cf39f0388fE80153fEB82d35F";//event_details.scAddress;
    const event_name = event_details.title; 
    const location = event_details.location; 
    const endDate = event_details.endDate; 
    const startDate = event_details.startDate; 
    const category = "General Admission"; 
    
    console.log(response.data);

    var metadata_data = JSON.stringify({
      "pinataOptions": {
        "cidVersion": 1
      },
      "pinataMetadata": {
        "name": "testing",
        "keyvalues": {
          "customKey": "customValue",
          "customKey2": "customValue2"
        }
      },
      "pinataContent": { //this is the metadata being stored 
        "event" : event_name,
        "location" : location,
        "startDate" : startDate, 
        "endDate" : endDate, 
        "category" : category
      }
    });
    
    var accepted = 0;
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    
    await axios.post(url,
      metadata_data,
        {
            headers: {
              'Content-Type': 'application/json', 
                'pinata_api_key': pinataApiKey,
                'pinata_secret_api_key': pinataSecretApiKey
            }, 
        }
    ).then(function (response) {
        //handle response here
        
        accepted = 1; 
        console.log(response.data)
        /*
        Returns the IPFS hash  
        https://gateway.pinata.cloud/ipfs/bafkreia3atgjtyhg2cqqwbjkeccr4mbqxfwlwbccup7o3kztw43fn7wnvy 
        //set tokenURI for the mint function when user wants to mint the ticket 
        // contract instance */

    }).catch(function (error) {
        //handle error here
    }); 
    accepted = 1;
    if (accepted == 1){
      let ipfshash = response.data.IpfsHash; 
      const link = "https://gateway.pinata.cloud/ipfs/" + "bafkreia3atgjtyhg2cqqwbjkeccr4mbqxfwlwbccup7o3kztw43fn7wnvy";
      console.log("IPFS Hash Link  : ", link);
      const event_contract = new ethers.Contract(event_sc, abi, signer);
      console.log(event_sc);
      console.log(event_contract)
      const category_info = await event_contract.getCategoryInformation(category);
      const price_needed = category_info._price._hex;
      console.log(price_needed);
      console.log("output : ",  parseInt(price_needed, 16));
      const mint_ticket = await event_contract.mint("General Admission", link, {gasLimit: 2100000, value : price_needed});
      /*
      The code will return errors eg. max minting reached, max minting per category reached. so if error -> for FE
      */
      console.log(mint_ticket);
}


    
  }

  async function getTicket(){
    const event_sc = "0xeaBFF06FeBFEC94Cf39f0388fE80153fEB82d35F";
    const event_contract = new ethers.Contract(event_sc, abi, signer);
    console.log(event_sc);
    console.log(event_contract)
    const tokenURI = await event_contract.tokenURI(2);
    console.log(tokenURI);
    //const res = await axios.get(tokenURI).then(response=>{console.log(response.data)});
    console.log(res);


  }
  const { data, error, isLoading } = useSWR(
    "http://localhost:3000/api/events",
    fetchEvents
  );

  console.log(data);

  return (
    <div>
      EventsPage
      <br />
      <button onClick={updateEvent}>Click me to update</button>;
      <br />
      <button onClick={createEvent}>Click me to create</button>;
      <br />
      <button onClick={deleteEvent}>Click me to delete</button>;
      <br />
      <br />
      <br />

      <button onClick={mintTicket}>Click me to mint tickets</button>;
      <br/>
      <button onClick={getTicket}>Click me to get your ticket details</button>;
    </div>
  );
};

export default EventsPage;