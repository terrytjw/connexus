import {
  PrivacyType,
  VisibilityType,
  Prisma,
  CategoryType,
  Ticket,
  TicketType,
} from "@prisma/client";
import useSWR from "swr";
import axios from "axios";
import React from "react";
import { ethers } from "ethers";
import { smartContract } from "../lib/constant";
import { img } from "../lib/image";
import { swrFetcher } from "../lib/swrFetcher";

type EventWithTickets = Prisma.EventGetPayload<{ include: { tickets: true } }>;
type UserWithTicketsandMerch = Prisma.UserGetPayload<{
  include: { tickets: true };
}>;
``;

const BigNumber = require("bignumber.js");
//Smart Contract Stuff:
const contract = require("../artifacts/contracts/SimpleEvent.sol/SimpleEvent.json");
const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/3oE8BGNsfXndWYJbZxEkLCsZZ6STLO2R"
);
const abi = contract.abi;
const bytecode = contract.bytecode;
var signer = new ethers.Wallet(smartContract.privateKey, provider);

const EventsPage = (props: any) => {
  async function fetchEvents(url: string) {
    const response = await axios.get(url);
    const data = response.data as EventWithTickets[];
    return data;
  }

  async function createEvent() {
    /*
    Inputs: 
    1. Event Info
    2. Ticket Info
    */

    const Event_contract = new ethers.ContractFactory(abi, bytecode, signer);

    const address = {
      address1: "123 Main St",
      address2: "Apt 1",
      locationName: "Tenderloin",
      postalCode: "31231",
    };

    const eventPic = img;
    const bannerPic = img;
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
        ticketType: TicketType.ON_SALE,
      },
      {
        name: "VIP Pass",
        totalTicketSupply: 100,
        price: 1,
        startDate: new Date(),
        endDate: new Date(),
        description: "This is a VIP Pass",
        ticketType: TicketType.ON_SALE,
      },
    ];
    //till here ^^event and ticket input

    let categories = [];
    let category_quantity = [];
    let category_price = [];

    for (let i = 0; i < ticket_categories.length; i++) {
      let cat = ticket_categories[i];
      categories.push(cat.name);
      category_quantity.push(cat.totalTicketSupply);
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

    console.log("Contract successfully deployed => ", event_contract.address);

    const event = {
      eventId: 1,
      eventName: "This is a new event",
      eventPic: eventPic,
      bannerPic: bannerPic,
      category: [CategoryType.AUTOCAR],
      address: {
        create: {
          address1: address.address1,
          address2: address.address2,
          lat: 1.91,
          lng: 1.91,
          locationName: address.locationName,
          postalCode: address.postalCode,
        },
      },
      startDate: new Date(),
      endDate: new Date(),
      summary: "This is just a summary",
      description: "This is just a description",
      visibilityType: VisibilityType.DRAFT,
      privacyType: PrivacyType.PUBLIC,
      publishStartDate: new Date(),
      eventScAddress: event_contract.address,
      ticketURIs: [],
      publishType: "NOW",
      tickets: ticket_categories,
    };

    let response = await axios.post("http://localhost:3000/api/events", event);
    let data = response.data;
    console.log("Event Created");
  }

  async function deleteEvent() {
    let response = await axios.delete("http://localhost:3000/api/events/3");
    let data = response.data;
    console.log("Event Deleted");
  }

  async function mintOnChain(
    eventInfo: Partial<EventWithTickets>,
    ticket_category: string
  ) {
    console.log(ticket_category);
    const { eventName, addressId, startDate, endDate } = eventInfo;
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
        pinata_api_key: smartContract.pinataApiKey,
        pinata_secret_api_key: smartContract.pinataSecretApiKey,
      },
    });
  }

  async function mintTicket() {
    /*
    Inputs: 
    1. Event id 
    2. Ticket category 
    3. User id
    */

    const userId = 1;
    const eventId = 2;
    const ticket_category = "Genera";

    let response = await axios.get(
      "http://localhost:3000/api/events/" + eventId.toString()
    );
    const eventInfo = response.data as EventWithTickets;
    const { eventScAddress, ticketURIs, tickets } = eventInfo;

    //stop minting if paused
    for (let j = 0; j < tickets.length; j++) {
      if (tickets[j].name == ticket_category) {
        let ticket_type = tickets[j].ticketType;
        if (ticket_type == TicketType.PAUSED) {
          console.log("paused");
          return "";
        } else {
          break;
        }
      }
    }

    let user_response = await axios.get(
      "http://localhost:3000/api/users/" + userId.toString()
    );
    const userInfo = user_response.data as UserWithTicketsandMerch;
    var user_tickets = userInfo.tickets;

    //Mint + IPFS
    response = await mintOnChain(eventInfo, ticket_category);
    let ipfsHash = response.data.IpfsHash;
    console.log(ipfsHash);

    if (ipfsHash == "") return;
    const link = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;
    console.log("IPFS Hash Link  : ", link);
    const event_contract = new ethers.Contract(eventScAddress, abi, signer);
    console.log(eventScAddress);
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
        var ticket = {
          ticketId: tickets[j].ticketId,
          name: tickets[j].name,
          totalTicketSupply: tickets[j].totalTicketSupply,
          currentTicketSupply: tickets[j].currentTicketSupply + 1,
          price: tickets[j].price,
          startDate: tickets[j].startDate,
          endDate: tickets[j].endDate,
          description: tickets[j].description,
          ticketType: tickets[j].ticketType,
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
          "http://localhost:3000/api/users/" + userId.toString(),
          updated_user
        );
        console.log(user_update);

        break;
      }
    }
    ticketURIs.push(link);

    const updated_event = {
      eventName: eventInfo.eventName,
      addressId: eventInfo.addressId,
      category: eventInfo.category,
      startDate: eventInfo.startDate,
      endDate: eventInfo.endDate,
      eventPic: eventInfo.eventPic,
      bannerPic: eventInfo.bannerPic,
      summary: eventInfo.summary,
      description: eventInfo.description,
      visibilityType: eventInfo.visibilityType,
      privacyType: eventInfo.privacyType,
      publishStartDate: eventInfo.publishStartDate,
      ticketURIs: ticketURIs,
      publishType: eventInfo.publishType,
    };

    console.log(updated_event);
    let updated_response = await axios.post(
      "http://localhost:3000/api/events/" + eventId.toString(),
      updated_event
    );
    let updated_data = updated_response.data;
    console.log("Data uploaded for both event + user");
  }

  async function getTicket(ipfs_link: string) {
    let response = await axios.get(ipfs_link, {
      headers: {
        Accept: "text/plain",
      },
    });
    console.log(response);
    return response;
  }

  async function updateEvent() {
    /*
    Inputs: 
    1. Event Id
    2. Ticket Id
    3. Event Info
    4. Ticket Info
    */

    const event_id = 2;
    let response_event = await axios.get(
      "http://localhost:3000/api/events/" + event_id.toString()
    );
    const eventInfo = response_event.data as EventWithTickets;
    const { eventScAddress, ticketURIs, tickets } = eventInfo;
    console.log(eventInfo);

    //updating ticket categories
    const ticket_categories = [
      {
        name: "Genera",
        totalTicketSupply: 100,
        price: 1,
        startDate: new Date(),
        endDate: new Date(),
        description: "General Admission",
        ticketType: TicketType.PAUSED,
      },
      {
        name: "VI",
        totalTicketSupply: 1,
        price: 1,
        startDate: new Date(),
        endDate: new Date(),
        description: "This is a VIP Pass",
        ticketType: TicketType.ON_SALE,
      },
      {
        name: "Club Pengu",
        totalTicketSupply: 0,
        price: 1,
        startDate: new Date(),
        endDate: new Date(),
        description: "",
        ticketType: TicketType.ON_SALE,
      },
    ];
    let map = {} as any;

    const updatedTickets: Partial<Ticket>[] = [...tickets];

    for (let k = 0; k < ticket_categories.length; k++) {
      if (k > tickets.length - 1) {
        //create new ticket category
        console.log(tickets);
        var new_ticket = {
          name: ticket_categories[k].name,
          totalTicketSupply: ticket_categories[k].totalTicketSupply,
          currentTicketSupply: 0,
          price: ticket_categories[k].price,
          startDate: ticket_categories[k].startDate,
          endDate: ticket_categories[k].endDate,
          description: ticket_categories[k].description,
          eventId: event_id,
          ticketType: TicketType.ON_SALE,
        };
        updatedTickets.push(new_ticket);
        await axios.post("http://localhost:3000/api/tickets", new_ticket);
      } else {
        if (
          tickets[k].currentTicketSupply >=
          ticket_categories[k].totalTicketSupply
        ) {
          console.log("Not allowed to change");
          //return ""
        }
        //time to update
        var ticket = {
          ticketId: tickets[k].ticketId,
          name: ticket_categories[k].name,
          totalTicketSupply: ticket_categories[k].totalTicketSupply,
          currentTicketSupply: tickets[k].currentTicketSupply,
          price: ticket_categories[k].price,
          startDate: ticket_categories[k].startDate,
          endDate: ticket_categories[k].endDate,
          description: ticket_categories[k].description,
          ticketType: ticket_categories[k].ticketType,
        };
        await axios.post(
          "http://localhost:3000/api/tickets/" + tickets[k].ticketId.toString(),
          ticket
        );
        console.log(ticket);
        console.log("Updated existing");

        if (updatedTickets[k].name !== undefined) {
          const updatedTicketName = updatedTickets[k].name as string;
          map[updatedTicketName] = ticket_categories[k].name;
        }
      }
    }

    console.log("updating tickets");
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
    let categories = [];
    let category_quantity = [];
    let category_price = [];

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

    const event_contract = new ethers.Contract(eventScAddress, abi, signer);
    const category_info = await event_contract.changeCategories(
      categories,
      category_price,
      category_quantity,
      {
        gasLimit: 2100000,
      }
    );
    console.log("Contract for ticket categories updated");

    //Updating Event Information + repin all ipfs links again
    console.log("Event Info");

    let newticketURIs = [];
    const updated_event: Partial<EventWithTickets> = {
      //whatever the updated ticket details are
      eventName: "This is a new event",
      addressId: eventInfo.addressId,
      category: [CategoryType.AUTOCAR],
      startDate: new Date(),
      endDate: new Date(),
      eventPic: img,
      bannerPic: img,
      summary: "This is just a summary",
      description: "This is just a description",
      visibilityType: VisibilityType.DRAFT,
      privacyType: PrivacyType.PUBLIC,
      publishStartDate: new Date(),
      ticketURIs: [],
      publishType: "NOW",
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
        const event_contract = new ethers.Contract(eventScAddress, abi, signer);
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

      console.log("Updated Tickets => ", tickets);
      const updated_event_withuri: Partial<EventWithTickets> = {
        eventName: "This is a new event",
        addressId: eventInfo.addressId,
        category: [CategoryType.AUTOCAR],
        startDate: new Date(),
        endDate: new Date(),
        eventPic: img,
        bannerPic: img,
        summary: "This is just a summary",
        description: "This is just a description",
        visibilityType: VisibilityType.DRAFT,
        privacyType: PrivacyType.PUBLIC,
        publishStartDate: new Date(),
        ticketURIs: newticketURIs, //redo again to add the new URI arr
        publishType: "NOW",
      };
      console.log("updated event:");
      console.log(updated_event_withuri);
      let updated_response = await axios.post(
        "http://localhost:3000/api/events/" + event_id.toString(),
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
    swrFetcher
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
