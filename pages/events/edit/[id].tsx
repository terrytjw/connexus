import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { StepStatus } from "../../../lib/enums";
import StepsMobile from "../../../components/EventPages/StepsMobile";
import StepsDesktop, {
  Step,
} from "../../../components/EventPages/StepsDesktop";
import EventFormPage from "../../../components/EventPages/Creator/EventForms/EventFormPage";
import TicketFormPage from "../../../components/EventPages/Creator/EventForms/TicketFormPage";
import PublishFormPage from "../../../components/EventPages/Creator/EventForms/PublishFormPage";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Layout from "../../../components/Layout";
import Loading from "../../../components/Loading";

import { FaChevronLeft } from "react-icons/fa";
import { EventWithTicketsandAddress } from "../../../utils/types";
import { Ticket, Address } from "@prisma/client";

import axios from "axios";

import { ethers } from "ethers";
import contract from "../../../artifacts/contracts/SimpleEvent.sol/SimpleEvent.json";
import { smartContract } from "../../../lib/constants";
import Modal from "../../../components/Modal";
import Link from "next/link";
import Button from "../../../components/Button";
import { GetStaticPaths, GetStaticProps } from "next";

// smart contract stuff
const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/3oE8BGNsfXndWYJbZxEkLCsZZ6STLO2R"
);
const abi = contract.abi;
const bytecode = contract.bytecode;
var signer = new ethers.Wallet(smartContract.privateKey, provider);
console.log(signer);

type CreatorEventPageProps = {
  event: EventWithTicketsandAddress;
  address: Address;
};

const CreatorEventEdit = ({ event, address }: CreatorEventPageProps) => {
  const {
    handleSubmit,
    setValue,
    control,
    watch,
    trigger,
    formState: { dirtyFields },
  } = useForm<EventWithTicketsandAddress>({
    defaultValues: {
      ...event,
      // startDate: new Date(
      //   format(new Date(event?.startDate), "yyyy-MM-dd'T'HH:mm")
      // ),
      address: {
        ...address,
      },
    },
  });

  type UnknownArrayOrObject = unknown[] | Record<string, unknown>;

  // https://github.com/react-hook-form/react-hook-form/discussions/1991#discussioncomment-351784
  const dirtyValues = (
    dirtyFields: UnknownArrayOrObject | boolean,
    allValues: UnknownArrayOrObject
  ): UnknownArrayOrObject => {
    // NOTE: Recursive function.

    // If *any* item in an array was modified, the entire array must be submitted, because there's no
    // way to indicate "placeholders" for unchanged elements. `dirtyFields` is `true` for leaves.
    if (dirtyFields === true || Array.isArray(dirtyFields)) {
      return allValues;
    }

    // Here, we have an object.
    return Object.fromEntries(
      Object.keys(dirtyFields).map((key) => [
        key,
        dirtyValues(dirtyFields[key], allValues[key]),
      ])
    );
  };

  const eventFormData = watch();
  console.log("form data", eventFormData);
  console.log("dirty fields -> ", dirtyFields);
  // console.log(
  //   "parsed date string -> ",
  //   format(new Date(event.startDate), "yyyy-MM-dd'T'HH:mm")
  // );

  // listen to tickets array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tickets",
  });
  const [tickets] = watch(["tickets"]);
  const [steps, setSteps] = useState<Step[]>([
    { id: "Step 1", name: "Event Details", status: StepStatus.CURRENT },
    { id: "Step 2", name: "Ticket Details", status: StepStatus.UPCOMING },
    { id: "Step 3", name: "Publish Details", status: StepStatus.UPCOMING },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>();
  const [isCreateSuccessModalOpen, setIsCreateSuccessModalOpen] =
    useState(false);

  // create contract and db entry
  const createEvent = async (event: any) => {
    /*
    Inputs: 
    1. Event Info
    2. Ticket Info
    */

    // create smart contract
    const Event_contract = new ethers.ContractFactory(abi, bytecode, signer);

    let categories = [];
    let category_quantity = [];
    let category_price = [];

    for (let i = 0; i < tickets.length; i++) {
      let cat = tickets[i];
      categories.push(cat.name);
      category_quantity.push(cat.totalTicketSupply);
      let input = cat.price;
      category_price.push(input);
    }
    console.log(category_price);

    setIsLoading(true);
    const event_contract = await Event_contract.deploy(
      categories,
      category_price,
      category_quantity,
      event.eventName,
      new Date(event.startDate), // what is this?
      event.address.create.locationName,
      1,
      100,
      event.eventName
    ); //1 ticket max per person

    console.log("Contract successfully deployed => ", event_contract.address);

    // call post api
    let { data: response } = await axios.post(
      "http://localhost:3000/api/events",
      {
        ...event,
        scAddress: event_contract.address,
      }
    );
    let data = response.data;
    console.log("Event Created");
    setIsLoading(false);
  };

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

  async function getTicket(ipfs_link: string) {
    let response = await axios.get(ipfs_link, {
      headers: {
        Accept: "text/plain",
      },
    });
    console.log(response);
    return response;
  }

  // edit contracts and db entry
  async function updateEvent(newEvent: any) {
    /*
    Inputs: 
    1. Event Id
    2. Ticket Id
    3. Event Info
    4. Ticket Info
    */

    console.log("newEvent form data -> ", newEvent);
    setIsLoading(true);
    const event_id = newEvent?.eventId;
    let response_event = await axios.get(
      "http://localhost:3000/api/events/" + event_id.toString()
    );
    const eventInfo = response_event.data as EventWithTicketsandAddress;
    const { scAddress, ticketURIs, tickets } = eventInfo;
    console.log(eventInfo);

    //updating ticket categories
    const ticket_categories = newEvent.tickets;
    //updating ticket categories
    // const ticket_categories = [
    //   {
    //     name: "Genera",
    //     totalTicketSupply: 100,
    //     price: 1,
    //     startDate: new Date(),
    //     endDate: new Date(),
    //     description: "General Admission",
    //   },
    //   {
    //     name: "VI",
    //     totalTicketSupply: 1,
    //     price: 1,
    //     startDate: new Date(),
    //     endDate: new Date(),
    //     description: "This is a VIP Pass",
    //   },
    //   {
    //     name: "Club Pengu",
    //     totalTicketSupply: 0,
    //     price: 1,
    //     startDate: new Date(),
    //     endDate: new Date(),
    //     description: "",
    //   },
    // ];

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
          const updated_response = await axios.delete(
            "http://localhost:3000/api/tickets/" +
              tickets[j].ticketId.toString()
          );
          const updated_data = updated_response.data;

          console.log(
            `updating ticket ${tickets[
              j
            ].ticketId.toString()} via /tickets/${tickets[
              j
            ].ticketId.toString()} ->`,
            updated_data
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

    const event_contract = new ethers.Contract(scAddress, abi, signer);
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
    const updated_event: Partial<EventWithTicketsandAddress> = { ...newEvent };

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

      console.log("Updated Tickets => ", tickets);
      const updated_event_withuri: Partial<EventWithTicketsandAddress> = {
        ...newEvent,
        ticketURIs: newticketURIs,
      }; //redo again to add the new URI arr

      console.log("updated event with uri: -", updated_event_withuri);
      let updated_response = await axios.post(
        "http://localhost:3000/api/events/" + event_id.toString(),
        updated_event_withuri
      );

      let updated_data = updated_response.data;
      console.log(
        `updating event via /events/${event_id.toString()} ->`,
        updated_data
      );
      console.log("Data uploaded");
      setIsLoading(false);
    } else {
      console.log("Nothing to update for tokenURIs in event");

      // remove untouched data
      const {
        address,
        tickets,
        // bannerPic,
        // eventPic,
        addressId,
        ...newEventWOTicketsNAddress
      } = newEvent;

      // change address
      let update_address_response = await axios.post(
        "http://localhost:3000/api/addresses/" + addressId.toString(),
        address
      );
      let updated_address_data = update_address_response.data;
      console.log(
        `updating address via /addresses/${addressId.toString()} ->`,
        updated_address_data
      );

      const updated_event: Partial<EventWithTicketsandAddress> = {
        ...newEventWOTicketsNAddress,
      };

      console.log("updated event: -", updated_event);
      let updated_response = await axios.post(
        "http://localhost:3000/api/events/" + event_id.toString(),
        updated_event
      );
      let updated_data = updated_response.data;
      console.log(
        `updating event via /events/${event_id.toString()} ->`,
        updated_data
      );
      console.log("Data uploaded");
      setIsLoading(false);
    }
  }

  const parseAndUpdate = (event: EventWithTicketsandAddress): void => {
    console.log("Submitting Form Data", event);

    const { address, eventId, tickets, startDate, endDate, maxAttendee } =
      event;

    console.log(tickets.map((ticket) => ({ ...ticket })));

    // JSON.stringify(dirtyValues(dirtyFields, event))

    // parse to prisma type
    const prismaEvent = {
      ...event,
      // address: {
      //   create: { ...address },
      // },
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      maxAttendee: Number(maxAttendee),
      tickets: tickets.map(
        ({
          price,
          currentTicketSupply,
          totalTicketSupply,
          startDate,
          endDate,
          ...ticketInfo
        }: Ticket) => ({
          ...ticketInfo,
          price: Number(price),
          currentTicketSupply: Number(totalTicketSupply), // set current supply to total supply number
          totalTicketSupply: Number(totalTicketSupply),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        })
      ),
    };
    updateEvent(prismaEvent);
  };

  // a null/ undefined state is needed for form validation
  const addNewTicket = (): void => {
    append({
      ticketId: 1,
      name: "",
      description: "",
      price: null as unknown as number,
      totalTicketSupply: undefined as unknown as number,
      currentTicketSupply: undefined as unknown as number,
      startDate: null as unknown as Date,
      endDate: null as unknown as Date,
      eventId: Number.MIN_VALUE,
    });
  };

  useEffect(() => {
    // scroll to ticket
    document.getElementById(`ticket-${tickets?.length}`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }, [tickets]);

  const removeTicket = (index: number): void => {
    remove(index);
  };

  const getCurrentStep = (): Step | undefined => {
    return steps.find((step) => step.status === StepStatus.CURRENT);
  };

  const proceedStep = (): void => {
    switch (getCurrentStep()?.id) {
      case "Step 1":
        setSteps((prev) =>
          prev.map((step) =>
            step.id === "Step 1"
              ? { ...step, status: StepStatus.COMPLETE }
              : step.id === "Step 2"
              ? { ...step, status: StepStatus.CURRENT }
              : step
          )
        );
        if (tickets.length === 0) {
          addNewTicket();
        }
        break;
      case "Step 2":
        setSteps((prev) =>
          prev.map((step) =>
            step.id === "Step 2"
              ? { ...step, status: StepStatus.COMPLETE }
              : step.id === "Step 3"
              ? { ...step, status: StepStatus.CURRENT }
              : step
          )
        );
        break;
      default:
        break;
    }
  };

  const reverseStep = (): void => {
    switch (getCurrentStep()?.id) {
      case "Step 2":
        setSteps((prev) =>
          prev.map((step) =>
            step.id === "Step 1"
              ? { ...step, status: StepStatus.CURRENT }
              : step.id === "Step 2"
              ? { ...step, status: StepStatus.UPCOMING }
              : step
          )
        );
        break;
      case "Step 3":
        setSteps((prev) =>
          prev.map((step) =>
            step.id === "Step 2"
              ? { ...step, status: StepStatus.CURRENT }
              : step.id === "Step 3"
              ? { ...step, status: StepStatus.UPCOMING }
              : step
          )
        );
        break;
      default:
        break;
    }
  };

  // memoizing so that react only calculates the current step when it changes
  const currentStep: Step | undefined = useMemo(
    () => getCurrentStep(),
    [getCurrentStep]
  );

  return (
    <ProtectedRoute>
      <Layout>
        <main className="py-12 px-4 sm:px-12">
          {/* Register success modal */}
          <Modal
            isOpen={isCreateSuccessModalOpen}
            setIsOpen={setIsCreateSuccessModalOpen}
          >
            {isLoading ? (
              <Loading className="!h-full" />
            ) : (
              <div className="flex items-center justify-between">
                <h3 className="ml-2 text-xl font-semibold">
                  {isLoading ? "Creating Event..." : "Event Created!"}
                </h3>

                <Link href="/events">
                  <Button
                    variant="solid"
                    size="md"
                    className="border-0"
                    onClick={() => setIsCreateSuccessModalOpen(false)}
                  >
                    View Event
                  </Button>
                </Link>
              </div>
            )}
          </Modal>

          {/* Header */}
          <nav className="flex items-center gap-6">
            {currentStep?.id !== "Step 1" && (
              <FaChevronLeft
                className="text-lg text-blue-600 hover:cursor-pointer sm:text-xl"
                onClick={reverseStep}
              />
            )}
            <h2 className="text-2xl font-bold sm:text-4xl">
              {currentStep?.id === "Step 1"
                ? "Edit Event"
                : currentStep?.id === "Step 2"
                ? "Edit Tickets"
                : "Publish Event Changes"}
            </h2>
          </nav>

          {/* Steps */}
          <div className="justify-cente relative sm:py-8">
            {/* conditionally rendered via css */}
            <StepsDesktop steps={steps} />
            <StepsMobile currentStep={currentStep} steps={steps} />
          </div>

          {/* Form */}
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <form
              onSubmit={handleSubmit((event: EventWithTicketsandAddress) =>
                parseAndUpdate(event)
              )}
            >
              {/* Step 1 */}
              {currentStep?.id === "Step 1" &&
                currentStep?.status === StepStatus.CURRENT && (
                  <EventFormPage
                    watch={watch}
                    setValue={setValue}
                    control={control}
                    trigger={trigger}
                    proceedStep={proceedStep}
                  />
                )}
              {/* Step 2 */}
              {currentStep?.id === "Step 2" &&
                currentStep?.status === StepStatus.CURRENT && (
                  <TicketFormPage
                    watch={watch}
                    control={control}
                    trigger={trigger}
                    fields={fields}
                    addNewTicket={addNewTicket}
                    removeTicket={removeTicket}
                    proceedStep={proceedStep}
                  />
                )}
              {/* Step 3 */}
              {currentStep?.id === "Step 3" &&
                currentStep?.status === StepStatus.CURRENT && (
                  <PublishFormPage
                    watch={watch}
                    setValue={setValue}
                    setIsCreateSuccessModalOpen={setIsCreateSuccessModalOpen}
                  />
                )}
            </form>
          </div>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default CreatorEventEdit;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: "1" } }, { params: { id: "2" } }],
    fallback: true, // Set to true if there are more dynamic routes to be added later
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // use axios GET method to fetch data
  const { data: event } = await axios.get(
    `http://localhost:3000/api/events/${params?.id}`
  );

  const { data: address } = await axios.get(
    `http://localhost:3000/api/addresses/${event?.addressId}`
  );

  return {
    props: {
      event,
      address,
    },
  };
};
