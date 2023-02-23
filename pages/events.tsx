import {
  Event,
  DurationType,
  PrivacyType,
  VisibilityType,
  Prisma,
  CategoryType,
  Ticket,
  User,
} from "@prisma/client";
import useSWR from "swr";
import axios from "axios";
import { ethers } from "ethers";
import React from "react";

type EventWithTickets = Prisma.EventGetPayload<{ include: { tickets: true } }>;
type UserWithTickets = Prisma.UserGetPayload<{ include: { tickets: true } }>;

const BigNumber = require("bignumber.js");

//Pinata
const pinataApiKey = "be74f69d81d8435228e2";
const pinataSecretApiKey =
  "9556c5997d472165edae4fd15461a8bac3d454bd73088101a95ae45657ea4bdf";
const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzNWRhMWQzNS0xZjc0LTRhNTUtODBlMC04NTMwNzE2OGU5Y2EiLCJlbWFpbCI6ImNjd2hoOThAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImJlNzRmNjlkODFkODQzNTIyOGUyIiwic2NvcGVkS2V5U2VjcmV0IjoiOTU1NmM1OTk3ZDQ3MjE2NWVkYWU0ZmQxNTQ2MWE4YmFjM2Q0NTRiZDczMDg4MTAxYTk1YWU0NTY1N2VhNGJkZiIsImlhdCI6MTY3NjYwMzU2Nn0.kGTRDcG0Xe0Be8yfzT9A4Vuc2jkxs32JqjJF0XqOOmY";

//Smart Contract Stuff:
const contract = require("../artifacts/contracts/SimpleEvent.sol/SimpleEvent.json");
console.log("ABI");
const abi = contract.abi;
const bytecode = contract.bytecode;
// for provider
const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/3oE8BGNsfXndWYJbZxEkLCsZZ6STLO2R"
);
// for signer
var privateKey =
  "3340e2f92064b7494823da63fcaa1dd1515e87e72aaa2d18e461238ce4133cf9";
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
    const address = {
      address1: "123 Main St",
      address2: "Apt 1",
      locationName: "Tenderloin",
      postalCode: "31231",
    };
    const eventName = "Connexus";
    const date = new Date();
    const ticket_categories = [
      {
        name: "General Admission",
        totalTicketSupply: 100,
        price: 1,
        startDate: new Date(),
        endDate: new Date(),
        description: "General Admission",
      },
      {
        name: "VIP Pass",
        totalTicketSupply: 100,
        price: 1,
        startDate: new Date(),
        endDate: new Date(),
        description: "This is a VIP Pass",
      },
    ];

    var categories = [];
    var category_quantity = [];
    var category_price = [];

    for (let i = 0; i < ticket_categories.length; i++) {
      var cat = ticket_categories[i];
      categories.push(cat.name);
      category_quantity.push(cat.totalTicketSupply);
      var input = cat.price;
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
    const event_contract = await Event_contract.deploy(
      categories,
      category_price,
      category_quantity,
      eventName,
      date,
      address.locationName,
      1,
      100,
      eventName
    ); //1 ticket max per person

    console.log(event_contract.address);
    console.log("Contract successfully deployed");
    //https://mumbai.polygonscan.com/address/0x56efFE82a73515C0559ED8daE55e4Aa58c79B8Ea
    /*
    Minted : https://mumbai.polygonscan.com/tx/0x0955287ce5f43dbf38639a1e46bc48d01b283dc651ac025badbd8f2b9885acf3 
    Max Minting : https://mumbai.polygonscan.com/tx/0xa0b27dc693e9c20625ec395f0396f0dec29f16e4aa7877c34a700f7d5b2a9cc2 
    */

    const event: EventWithTickets = {
      eventId: 1,
      eventName: "This is a new event",
      category: CategoryType.AUTO_BOAT_AIR,
      address: {
        create: {
          address1: address.address1,
          address2: address.address2,
          locationName: address.locationName,
          postalCode: address.postalCode,
        },
      },
      startDate: new Date(),
      endDate: new Date(),
      images: [],
      summary: "This is just a summary",
      description: "This is just a description",
      visibilityType: VisibilityType.DRAFT,
      privacyType: PrivacyType.PUBLIC,
      publishStartDate: new Date(),
      scAddress: event_contract.address,
      ticketURIs: [],
      publishType: "NOW",
      tickets: ticket_categories,
    };

    let response = await axios.post("http://localhost:3000/api/events", event);
    let data = response.data;
    console.log(data);
  }

  async function deleteEvent() {
    let response = await axios.delete("http://localhost:3000/api/events/3");
    let data = response.data;
    console.log(data);
  }

  async function mintOnChain(eventInfo: EventWithTickets, ticket_category) {
    console.log(ticket_category);
    const { eventName, addressId, startDate, endDate } = eventInfo;
    console.log("Event Info");
    console.log(eventInfo);
    let response_location = await axios.get(
      "http://localhost:3000/api/addresses/" + addressId
    );

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
        location: response_location.data.locationName,
        startDate: startDate,
        endDate: endDate,
        category: ticket_category,
      },
    });

    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    return axios.post(url, metaData, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    });
  }

  async function mintTicket() {
    //promotion will be separately applied
    //get event details -> fish out to put into metadata
    //once pinned -> go to smart contract mint function  -> input the ipfs link as tokenuri to mint

    console.log("Pinning metadata");
    let response = await axios.get("http://localhost:3000/api/events/2");
    const eventInfo = response.data as EventWithTickets;
    const { scAddress, ticketURIs, tickets } = eventInfo;

    const ticket_category = "VIP Pass";

    const userId = 1;
    let user_response = await axios.get("http://localhost:3000/api/users/2");
    const userInfo = user_response.data as UserWithTickets;
    var user_tickets = userInfo.tickets;

    response = await mintOnChain(eventInfo, ticket_category);
    let ipfsHash = response.data.IpfsHash;
    console.log(ipfsHash);

    if (ipfsHash == "") return;

    const link = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;
    console.log("IPFS Hash Link  : ", link);
    const event_contract = new ethers.Contract(scAddress, abi, signer);
    console.log(scAddress);
    const category_info = await event_contract.getCategoryInformation(
      ticket_category
    );
    const price_needed = category_info._price._hex;
    console.log(price_needed);
    console.log("output : ", parseInt(price_needed, 16));
    const mint_ticket = await event_contract.mint(ticket_category, link, {
      gasLimit: 2100000,
      value: price_needed,
    });
    console.log(mint_ticket.hash);

    for (let j = 0; j < tickets.length; j++) {
      if (tickets[j].name == ticket_category) {
        console.log(tickets[j].currentTicketSupply);
        //to update the tickets -> but it creates a new set of tickets each time
        var ticket: Ticket = {
          ticketId: tickets[j].ticketId,
          name: tickets[j].name,
          totalTicketSupply: tickets[j].totalTicketSupply,
          currentTicketSupply: tickets[j].currentTicketSupply + 1,
          price: tickets[j].price,
          startDate: tickets[j].startDate,
          endDate: tickets[j].endDate,
          description: tickets[j].description,
        };
        let response_tickets = await axios.post(
          "http://localhost:3000/api/tickets/" + tickets[j].ticketId.toString(),
          ticket
        );

        user_tickets.push(tickets[j]);
        const updated_user = {
          ...userInfo,
          tickets: user_tickets,
        };
        console.log(updated_user);
        let user_update = await axios.post(
          "http://localhost:3000/api/users/1",
          updated_user
        );
        console.log(user_update);

        break;
      }
    }
    ticketURIs.push(link);

    //updates

    const updated_event = {
      eventName: eventInfo.eventName,
      addressId: eventInfo.addressId,
      category: eventInfo.category,
      startDate: eventInfo.startDate,
      endDate: eventInfo.endDate,
      images: eventInfo.images,
      summary: eventInfo.summary,
      description: eventInfo.description,
      visibilityType: eventInfo.visibilityType,
      privacyType: eventInfo.privacyType,
      publishStartDate: eventInfo.publishStartDate,
      ticketURIs: ticketURIs,
      publishType: eventInfo.publishType,
      // tickets: eventInfo.tickets,
    };

    console.log(updated_event);
    let updated_response = await axios.post(
      "http://localhost:3000/api/events/2",
      updated_event
    );
    let updated_data = updated_response.data;
    console.log("Data uploaded");
  }

  async function getTicket(ipfs_link) {
    let response = await axios.get(ipfs_link, {
      headers: {
        Accept: "text/plain",
      },
    });
    console.log(response);
    return response;
  }

  async function updateEvent() {
    let response_event = await axios.get("http://localhost:3000/api/events/1");
    const eventInfo = response_event.data as EventWithTickets;
    const { scAddress, ticketURIs, tickets } = eventInfo;
    console.log(eventInfo);

    const ticket_categories = [
      //sample ticket categories
      {
        name: "Genera",
        totalTicketSupply: 100,
        price: 1,
        startDate: new Date(),
        endDate: new Date(),
        description: "General Admission",
      },
      {
        name: "VIP Pass",
        totalTicketSupply: 1,
        price: 1,
        startDate: new Date(),
        endDate: new Date(),
        description: "This is a VIP Pass",
      },
      {
        name: "Club Pengu",
        totalTicketSupply: 0,
        price: 1,
        startDate: new Date(),
        endDate: new Date(),
        description: "",
      },
    ];
    console.log("Tickets => ", tickets);
    var map = {};

    for (let k = 0; k < ticket_categories.length; k++) {
      if (k > tickets.length - 1) {
        //create new ones
        var new_category: EventWithTickets = {
          eventId: 1,
          tickets: [ticket_categories[k]],
        };
        console.log(new_category);
        let response = await axios.post(
          "http://localhost:3000/api/events/1",
          new_category
        );
        console.log(response);
      } else {
        if (
          tickets[k].currentTicketSupply >=
          ticket_categories[k].totalTicketSupply
        ) {
          console.log("Not allowed to change");
          //return "Not allowed to change"
        }
        //time to update
        var ticket: Ticket = {
          ticketId: tickets[k].ticketId,
          name: ticket_categories[k].name,
          totalTicketSupply: ticket_categories[k].totalTicketSupply,
          price: ticket_categories[k].price,
          startDate: ticket_categories[k].startDate,
          endDate: ticket_categories[k].endDate,
          description: ticket_categories[k].description,
        };
        await axios.post(
          "http://localhost:3000/api/tickets/" + tickets[k].ticketId.toString(),
          ticket
        );
        console.log("Updated existing");
        map[tickets[k].name] = ticket_categories[k].name;
      }
    }
    if (ticket_categories.length < tickets.length) {
      //new set of categories is less the original set -> time to go through the remaining and delete acordingly
      for (let j = ticket_categories.length - 1; j <= tickets.length; j++) {
        if (tickets[j].currentTicketSupply > 0) {
          console.log("Not allowed to change");
          // return ""
        } else {
          await axios.delete(
            "http://localhost:3000/api/tickets/" +
              tickets[j].ticketId.toString()
          );
        }
      }
    }
    var categories = [];
    var category_quantity = [];
    var category_price = [];

    for (let i = 0; i < ticket_categories.length; i++) {
      var cat = ticket_categories[i];
      categories.push(cat.name);
      category_quantity.push(cat.totalTicketSupply);
      var input = cat.price;
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

    const event_contract = new ethers.Contract(scAddress, abi, signer);
    console.log(event_contract);
    const category_info = await event_contract.changeCategories(
      categories,
      category_price,
      category_quantity,
      {
        gasLimit: 2100000,
      }
    );
    console.log(category_info);

    var newticketURIs = [];

    //delete ticket categories so can just create again

    const updated_event: EventWithTickets = {
      //whatever the updated ticket details are
      eventName: "This is a new event",
      addressId: eventInfo.addressId,
      category: CategoryType.AUTO_BOAT_AIR,
      startDate: new Date(),
      endDate: new Date(),
      images: [],
      summary: "This is just a summary",
      description: "This is just a description",
      visibilityType: VisibilityType.DRAFT,
      privacyType: PrivacyType.PUBLIC,
      publishStartDate: new Date(),
      ticketURIs: [],
      publishType: "NOW",
      tickets: ticket_categories,
    };

    if (ticketURIs.length > 0) {
      for (let i = 0; i < ticketURIs.length; i++) {
        var ticketURI = ticketURIs[i];
        console.log(ticketURI);
        let response_metadata = await getTicket(ticketURI);
        console.log(response_metadata.data);
        let existing_user_ticket_category = response_metadata.data.category;
        var new_user_ticket_category = map[existing_user_ticket_category];

        let category_chosen = new_user_ticket_category;
        console.log(category_chosen);
        const event_contract = new ethers.Contract(scAddress, abi, signer);
        let response_pinning = await mintOnChain(
          updated_event,
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
        newticketURIs.push(link);
      }
      console.log(newticketURIs);

      const updated_event_withuri: EventWithTickets = {
        eventName: "This is a new event",
        addressId: eventInfo.addressId,
        category: CategoryType.AUTO_BOAT_AIR,
        startDate: new Date(),
        endDate: new Date(),
        images: [],
        summary: "This is just a summary",
        description: "This is just a description",
        visibilityType: VisibilityType.DRAFT,
        privacyType: PrivacyType.PUBLIC,
        publishStartDate: new Date(),
        ticketURIs: newticketURIs,
        publishType: "NOW",
        tickets: ticket_categories,
      };
      let updated_response = await axios.post(
        "http://localhost:3000/api/events/1",
        updated_event_withuri
      );
      let updated_data = updated_response.data;
      console.log("Data uploaded");
    } else {
      console.log("Nothing to update for tokenURIs in event");
    }
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
      <br />
    </div>
  );
};

export default EventsPage;
