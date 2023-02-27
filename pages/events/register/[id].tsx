import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { StepStatus } from "../../../lib/enums";
import StepsMobile from "../../../components/EventPages/StepsMobile";
import StepsDesktop, {
  Step,
} from "../../../components/EventPages/StepsDesktop";
import { FaChevronLeft } from "react-icons/fa";
import Loading from "../../../components/Loading";
import Layout from "../../../components/Layout";
import ConfirmationPage from "../../../components/EventPages/Fan/RegisterEventForms/ConfirmationPage";
import TicketSelectionFormPage from "../../../components/EventPages/Fan/RegisterEventForms/TicketSelectionFormPage";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { User } from "@prisma/client";

import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { EventWithTicketsandAddress } from "../../../utils/types";
import { ethers } from "ethers";
import contract from "../../../artifacts/contracts/SimpleEvent.sol/SimpleEvent.json";
import { smartContract } from "../../../lib/constants";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import Link from "next/link";

export type Venue = {
  lat: number | undefined;
  lng: number | undefined;
  venueName: string;
  address1: string;
  address2: string;
  postalCode: number;
};

export type SelectedTicket = {
  ticketName: string;
  qty: number;
  price: number;
};

export type UserWithSelectedTicket = User & { selectedTicket: SelectedTicket };

type FanEventReigsterProps = {
  userData: User;
  event: EventWithTicketsandAddress;
};

const FanEventRegister = ({ userData, event }: FanEventReigsterProps) => {
  const { data: session, status } = useSession();
  const userId = session?.user.userId;

  console.log("user data ->", userData);
  console.log("event data ->", event);

  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mumbai.g.alchemy.com/v2/3oE8BGNsfXndWYJbZxEkLCsZZ6STLO2R"
  );
  const abi = contract.abi;
  const bytecode = contract.bytecode;
  var signer = new ethers.Wallet(smartContract.privateKey, provider);
  console.log(signer);

  // use form for selected ticket state
  const { handleSubmit, setValue, reset, control, watch, trigger } =
    useForm<UserWithSelectedTicket>({
      defaultValues: {
        ...userData,
        selectedTicket: { ticketName: "", qty: 0, price: 0 },
      },
    });

  // watch user form data
  const userFormData = watch();

  const [isRegisterSuccessModalOpen, setIsRegisterSuccessModalOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [steps, setSteps] = useState<Step[]>([
    { id: "Step 1", name: "Select Tickets", status: StepStatus.CURRENT },
    { id: "Step 2", name: "Confirm Registration", status: StepStatus.UPCOMING },
  ]);

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

  const mintOnChain = async (
    eventInfo: Partial<EventWithTicketsandAddress>,
    ticket_category: string // ticket name
  ) => {
    console.log(ticket_category);
    const { eventName, addressId, startDate, endDate } = eventInfo;
    let response_location = await axios.get(
      "http://localhost:3000/api/addresses/" + addressId
    );

    // stringy data to store on pinata
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
  };

  const mintTicket = async (
    userFormData: User,
    userId: number,
    eventId: number,
    ticketCategory: string
  ) => {
    /*
    Inputs: 
    1. Event id 
    2. Ticket category 
    3. User id
    */
    setIsLoading(true);
    let response = await axios.get(
      "http://localhost:3000/api/events/" + eventId.toString()
    );
    const eventInfo = response.data as EventWithTicketsandAddress;
    const { scAddress, ticketURIs, tickets } = eventInfo;

    let user_response = await axios.get(
      "http://localhost:3000/api/users/" + userId.toString()
    );
    const userInfo = user_response.data as EventWithTicketsandAddress;
    var user_tickets = userInfo.tickets;

    //Mint + IPFS
    response = await mintOnChain(eventInfo, ticketCategory);
    let ipfsHash = response.data.IpfsHash;
    console.log(ipfsHash);

    if (ipfsHash == "") return;
    const link = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;
    console.log("IPFS Hash Link  : ", link);
    const event_contract = new ethers.Contract(scAddress, abi, signer);
    console.log("smart contract address ->", scAddress);
    const category_info = await event_contract.getCategoryInformation(
      ticketCategory
    );
    const price_needed = category_info._price._hex;
    console.log(price_needed);
    console.log("output : ", parseInt(price_needed, 16));
    const mint_ticket = await event_contract.mint(ticketCategory, link, {
      gasLimit: 2100000,
      value: price_needed,
    });
    console.log("returned ticket hash -> ", mint_ticket.hash);

    for (let j = 0; j < tickets.length; j++) {
      if (tickets[j].name == ticketCategory) {
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
        };
        let response_tickets = await axios.post(
          "http://localhost:3000/api/tickets/" + tickets[j].ticketId.toString(),
          ticket
        );
        user_tickets.push(tickets[j]);

        // remove extra fields
        // const { , ...cleansedUser} = userIn

        // destructure from user form data
        const { displayName, email, phoneNumber } = userFormData;

        // upsert user with minted tickets and profile info
        const updated_user = {
          ...userInfo,
          displayName,
          email,
          phoneNumber,
          tickets: user_tickets,
        };
        console.log("updating user in prisma", updated_user);
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
    setIsLoading(false);
  };

  async function getTicket(ipfs_link: string) {
    let response = await axios.get(ipfs_link, {
      headers: {
        Accept: "text/plain",
      },
    });
    console.log(response);
    return response;
  }

  return (
    <ProtectedRoute>
      <Layout>
        {/* Register success modal */}
        <Modal
          isOpen={isRegisterSuccessModalOpen}
          setIsOpen={setIsRegisterSuccessModalOpen}
        >
          {isLoading ? (
            <Loading className="!h-full" />
          ) : (
            <div className="flex items-center justify-between">
              <h3 className="ml-2 text-xl font-semibold">
                Registered and Minted Tickets!
              </h3>
              <Link href="/events/tickets">
                <Button
                  variant="outlined"
                  size="sm"
                  className="border-0"
                  onClick={() => setIsRegisterSuccessModalOpen(false)}
                >
                  View Tickets
                </Button>
              </Link>
            </div>
          )}
        </Modal>

        <main className="py-12 px-4 sm:px-12">
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
                ? "Register for Event"
                : currentStep?.id === "Step 2"
                ? "Select Tickets"
                : "Confirm Registration"}
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
              onSubmit={handleSubmit((data: UserWithSelectedTicket) => {
                console.log("Submitting Ticket Data to mint", data);
                // remove selectedTickets field from form data
                const { selectedTicket, ...userWithNoSelectedTickets } =
                  userFormData;
                mintTicket(
                  userWithNoSelectedTickets,
                  Number(userId),
                  event.eventId,
                  data.selectedTicket.ticketName
                );
              })}
            >
              {/* Step 1 */}
              {currentStep?.id === "Step 1" &&
                currentStep?.status === StepStatus.CURRENT && (
                  <TicketSelectionFormPage
                    reset={reset}
                    event={event}
                    setValue={setValue}
                    watch={watch}
                    control={control}
                    trigger={trigger}
                    proceedStep={proceedStep}
                  />
                )}
              {/* Step 2 */}
              {currentStep?.id === "Step 2" &&
                currentStep?.status === StepStatus.CURRENT && (
                  <ConfirmationPage
                    watch={watch}
                    control={control}
                    trigger={trigger}
                    setIsRegisterSuccessModalOpen={
                      setIsRegisterSuccessModalOpen
                    }
                  />
                )}
            </form>
          </div>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default FanEventRegister;

// use axios GET method to fetch data
export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);
  const userId = session?.user.userId;

  // use axios GET method to fetch data
  const { data: userData } = await axios.get(
    `http://localhost:3000/api/users/${userId}`
  );

  const { data: event } = await axios.get(
    `http://localhost:3000/api/events/${context.params?.id}`
  );

  return {
    props: {
      userData,
      event,
    },
  };
};
