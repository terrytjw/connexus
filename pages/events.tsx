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
var privateKey = ""
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
      privacyType: PrivacyType.PRIVATE,
      //tickets: [], 
    };

    let response = await axios.post("http://localhost:3000/api/events", event);
    let data = response.data;
    console.log(data);
    const Event = new ethers.ContractFactory(abi, bytecode, signer); 
    const eventName = event.eventId; 
    const location = event.location; 
    const date = event.endDate; 
    
    const event_contract = await Event.deploy(["a","b"], [1,1], [1,1], eventName, date, location, 1, 1, eventName);  //1 ticket max per person
    
    //const event_contract = await Event.deploy(["a","b"], [1,1], [1,1], "nice", "02021200", "capitol", 1, 1, "yo"); 
    console.log(event_contract.address);
    console.log("Contract successfully deployed")
    //https://mumbai.polygonscan.com/address/0x88013546dada44befa72af6c517613d5a8e3f95e#code
    /*
    Minted : https://mumbai.polygonscan.com/tx/0x0955287ce5f43dbf38639a1e46bc48d01b283dc651ac025badbd8f2b9885acf3 
    Max Minting : https://mumbai.polygonscan.com/tx/0xa0b27dc693e9c20625ec395f0396f0dec29f16e4aa7877c34a700f7d5b2a9cc2 
    */
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

export default EventsPage;
