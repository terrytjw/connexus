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
  
  //Smart Contract Stuff:
  const contract = require("../artifacts/contracts/SimpleEvent.sol/SimpleEvent.json");
  console.log("ABI");
  const abi = contract.abi; 
  const bytecode = contract.bytecode;
  // for provider
  const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/3oE8BGNsfXndWYJbZxEkLCsZZ6STLO2R");
  // for signer
  var privateKey = "3340e2f92064b7494823da63fcaa1dd1515e87e72aaa2d18e461238ce4133cf9";
  var signer = new ethers.Wallet(privateKey, provider);
  //for polygon explorer - verification of contract 
  const polygon_explorer_api = "RRZFZGGV2K9VB7CGAT92981EAPBSSD4RZ7";
  
  
  const TicketsPage = (props: any) => {
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
        price: 10,
        startDate: new Date(),
        endDate: new Date(),
        description: "General Admission",
      },
      {
        name: "VIP Pass",
        quantity: 100,
        price: 10,
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
        category_price.push(cat.price);
      }
      //const event_contract = await Event_contract.deploy(categories, category_price, category_quantity, eventName, date, location, 1, 1, eventName);  //1 ticket max per person
  
      //const event_contract = await Event.deploy(["a","b"], [1,1], [1,1], "nice", "02021200", "capitol", 1, 1, "yo"); 
      //console.log(event_contract.address);
      console.log("Contract successfully deployed")
      //https://mumbai.polygonscan.com/address/0x88013546dada44befa72af6c517613d5a8e3f95e#code
      /*
      Minted : https://mumbai.polygonscan.com/tx/0x0955287ce5f43dbf38639a1e46bc48d01b283dc651ac025badbd8f2b9885acf3 
      Max Minting : https://mumbai.polygonscan.com/tx/0xa0b27dc693e9c20625ec395f0396f0dec29f16e4aa7877c34a700f7d5b2a9cc2 
      */
  
      const event: Event = {
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
        scAddress : "s", //event_contract.address,
  
      };
  
      let response = await axios.post("http://localhost:3000/api/events", event);
      let data = response.data;
      console.log(data);
  
  
      
      console.log("Pinning metadata");
  
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
        "pinataContent": {
          "somekey": "somevalue"
        }
      });
      
      const pinataApiKey = "be74f69d81d8435228e2";
      const pinataSecretApiKey=  "9556c5997d472165edae4fd15461a8bac3d454bd73088101a95ae45657ea4bdf";
      const JWT= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzNWRhMWQzNS0xZjc0LTRhNTUtODBlMC04NTMwNzE2OGU5Y2EiLCJlbWFpbCI6ImNjd2hoOThAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImJlNzRmNjlkODFkODQzNTIyOGUyIiwic2NvcGVkS2V5U2VjcmV0IjoiOTU1NmM1OTk3ZDQ3MjE2NWVkYWU0ZmQxNTQ2MWE4YmFjM2Q0NTRiZDczMDg4MTAxYTk1YWU0NTY1N2VhNGJkZiIsImlhdCI6MTY3NjYwMzU2Nn0.kGTRDcG0Xe0Be8yfzT9A4Vuc2jkxs32JqjJF0XqOOmY";
  
      const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  //we gather a local file from the API for this example, but you can gather the file from anywhere
      await axios.post(url,
          data,
          {
              headers: {
                'Content-Type': 'application/json', 
                  'pinata_api_key': pinataApiKey,
                  'pinata_secret_api_key': pinataSecretApiKey
              }, 
              data : metadata_data
          }
      ).then(function (response) {
          //handle response here
          console.log(response.data);
          /*  
          Returns the IPFS hash  
          https://gateway.pinata.cloud/ipfs/QmY8vLqisQKUQPYxmX4ufxpFCp9gMjCRByRsCNmqUTMakE 
          //set tokenURI for the mint function when user wants to mint the ticket 
  
  
          */
      }).catch(function (error) {
          //handle error here
      });
      
      
      
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
      </div>
    );
  };
  
  export default TicketsPage;