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
import { Ticket, Address, TicketType } from "@prisma/client";

import axios from "axios";

import { ethers } from "ethers";
import contract from "../../../artifacts/contracts/SimpleEvent.sol/SimpleEvent.json";
import { smartContract } from "../../../lib/constant";
import Modal from "../../../components/Modal";
import Link from "next/link";
import Button from "../../../components/Button";
import { GetServerSideProps } from "next";
import { formatDateForInput } from "../../../utils/date-util";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const { id: eventId } = router.query;
  const { handleSubmit, setValue, control, watch, trigger, getFieldState } =
    useForm<EventWithTicketsandAddress>({
      defaultValues: {
        ...event,
        address: {
          ...address,
        },
      },
    });

  // listen to tickets array
  const { fields, append, remove, update } = useFieldArray({
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

  async function mintOnChain(
    eventInfo: Partial<EventWithTicketsandAddress>,
    ticket_category: string
  ) {
    console.log(ticket_category);

    // event from db
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
    console.log("newEvent form data -> ", newEvent);
    setIsLoading(true);

    // fetch db event
    const event_id = newEvent?.eventId;
    let response_event = await axios.get(
      "http://localhost:3000/api/events/" + event_id.toString()
    );
    const eventInfo = response_event.data as EventWithTicketsandAddress;
    const { scAddress, ticketURIs, tickets } = eventInfo;
    console.log("db eventInfo -> ", eventInfo);

    //assign new tickets into ticket categories
    const ticket_categories = newEvent.tickets;

    let map = {} as any;

    // variable to hold updated tickets, initial value is from db
    const updatedTickets: Partial<Ticket>[] = [...tickets];

    // loop new tickets array length
    for (let k = 0; k < ticket_categories.length; k++) {
      // case ADDED tickets
      if (k > tickets.length - 1) {
        //create new ticket category
        console.log("tickets -> ", tickets);
        var new_ticket = {
          name: ticket_categories[k].name,
          totalTicketSupply: ticket_categories[k].totalTicketSupply,
          currentTicketSupply: 0,
          price: ticket_categories[k].price,
          startDate: ticket_categories[k].startDate,
          endDate: ticket_categories[k].endDate,
          description: ticket_categories[k].description,
          eventId: event_id,
          ticketType: ticket_categories[k].ticketType,
        };
        // append new ticket to updated tickets array
        updatedTickets.push(new_ticket);
        // api cal for additional tickets
        await axios.post("http://localhost:3000/api/tickets", new_ticket);
      } else {
        // case NO ADDED or REMOVED tickets, don't let creator set total supply < existing ticket supply
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

        // store a mapping of { db ticket name : new ticket name }
        if (updatedTickets[k].name !== undefined) {
          const updatedTicketName = updatedTickets[k].name as string;
          map[updatedTicketName] = ticket_categories[k].name;
        }
      }
    }

    console.log("updating tickets");
    // case REMOVE tickets
    if (ticket_categories.length < tickets.length) {
      //new set of categories is less the original set -> time to go through the remaining and delete acordingly
      for (let j = ticket_categories.length - 1; j < tickets.length; j++) {
        console.log("new ticket array -> ", ticket_categories);
        console.log("db ticket array -> ", tickets);

        // case at least one ticket has been minted
        if (tickets[j].currentTicketSupply > 0) {
          console.log(
            "Not allowed to change, at least ticket one ticket minted"
          );
          // return ""
        } else {
          // delete tickets from db
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

    // smart contract updates
    let categories = [];
    let category_quantity = [];
    let category_price = [];

    for (let i = 0; i < ticket_categories.length; i++) {
      var cat = ticket_categories[i];
      categories.push(cat.name);
      category_quantity.push(cat.totalTicketSupply);
      var input = cat.price;
      category_price.push(input);
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

    // case if db event has tickets
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

      // remove tickets since its updated separately before
      const {
        address,
        tickets: { tempTickets },
        ...newEventWOTicketsNAddress
      } = newEvent;

      // update address separately
      const addressRes = await axios.post(
        "http://localhost:3000/api/addresses/" + newEvent.addressId.toString(),
        address
      );

      console.log("updated address ->", addressRes.data);

      const updated_event_withuri: Partial<EventWithTicketsandAddress> = {
        ...newEventWOTicketsNAddress,
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
      // no change in tickets
      console.log("Nothing to update for tokenURIs in event");
      // remove tickets since its updated separately before
      const {
        address,
        tickets: { tempTickets },
        ...newEventWOTicketsNAddress
      } = newEvent;

      // update address separately
      const addressRes = await axios.post(
        "http://localhost:3000/api/addresses/" + newEvent.addressId.toString(),
        address
      );

      console.log("updated address ->", addressRes.data);

      const updated_event_WITHOUT_uri: Partial<EventWithTicketsandAddress> = {
        ...newEventWOTicketsNAddress,
      }; //redo again to add the new URI arr

      console.log("updated event WITHOUT uri: -", updated_event_WITHOUT_uri);
      let updated_response = await axios.post(
        "http://localhost:3000/api/events/" + event_id.toString(),
        updated_event_WITHOUT_uri
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

    const { tickets, startDate, endDate, maxAttendee } = event;

    // parse to prisma type
    const prismaEvent = {
      ...event,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      maxAttendee: Number(maxAttendee),
      tickets: tickets.map(
        ({
          price,
          totalTicketSupply,
          startDate,
          endDate,
          ...ticketInfo
        }: Ticket) => ({
          ...ticketInfo,
          price: Number(price),
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
      ticketType: TicketType.ON_SALE,
      totalTicketSupply: undefined as unknown as number,
      currentTicketSupply: undefined as unknown as number,
      startDate: undefined as unknown as Date,
      endDate: undefined as unknown as Date,
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
              <Loading className="!h-full !bg-transparent" />
            ) : (
              <div className="flex flex-col gap-6 py-4">
                <h3 className="text-xl font-semibold">Event Updated!</h3>
                <h3 className="text-md font-normal text-gray-500">
                  Your Event Page can be viewed in the 'Events' tab in the
                  navigation bar.
                </h3>

                <Link href={`/events/${eventId}`}>
                  <Button
                    variant="solid"
                    size="md"
                    className="border-0"
                    onClick={() => setIsCreateSuccessModalOpen(false)}
                  >
                    Confirm
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
            <StepsDesktop steps={steps} setSteps={setSteps} isEdit={true} />
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
                    isEdit={true} // tells the form page that user is not editing
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
                    isEdit={true}
                    getFieldState={getFieldState}
                    watch={watch}
                    control={control}
                    trigger={trigger}
                    fields={fields}
                    update={update}
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
                    isLoading={isLoading}
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // use axios GET method to fetch data
  const { data: event } = await axios.get(
    `http://localhost:3000/api/events/${params?.id}`
  );

  // parsing to format date for html 'date-time-local' inputs
  const parsedEvent: Partial<EventWithTicketsandAddress> = {
    ...event,
    startDate: formatDateForInput(event.startDate) as unknown as Date, // hack to fit string into Date type -
    endDate: formatDateForInput(event.endDate) as unknown as Date,
    tickets: event.tickets.map((ticket: Ticket) => ({
      ...ticket,
      startDate: formatDateForInput(ticket.startDate) as unknown as Date,
      endDate: formatDateForInput(ticket.endDate) as unknown as Date,
    })),
  };

  const { data: address } = await axios.get(
    `http://localhost:3000/api/addresses/${event?.addressId}`
  );

  return {
    props: {
      event: parsedEvent,
      address,
    },
  };
};
