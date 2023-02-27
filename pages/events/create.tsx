import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { StepStatus } from "../../lib/enums";
import StepsMobile from "../../components/EventPages/StepsMobile";
import StepsDesktop, { Step } from "../../components/EventPages/StepsDesktop";
import EventFormPage from "../../components/EventPages/Creator/EventForms/EventFormPage";
import TicketFormPage from "../../components/EventPages/Creator/EventForms/TicketFormPage";
import PublishFormPage from "../../components/EventPages/Creator/EventForms/PublishFormPage";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";

import { FaChevronLeft } from "react-icons/fa";
import { EventWithTicketsandAddress } from "../../utils/types";
import {
  PrivacyType,
  PublishType,
  Ticket,
  VisibilityType,
} from "@prisma/client";

import axios from "axios";

import { ethers } from "ethers";
import contract from "../../artifacts/contracts/SimpleEvent.sol/SimpleEvent.json";
import { smartContract } from "../../lib/constants";
import Modal from "../../components/Modal";
import Link from "next/link";
import Button from "../../components/Button";

// smart contract stuff
const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/3oE8BGNsfXndWYJbZxEkLCsZZ6STLO2R"
);
const abi = contract.abi;
const bytecode = contract.bytecode;
var signer = new ethers.Wallet(smartContract.privateKey, provider);
console.log(signer);

const CreatorEventCreate = () => {
  const { handleSubmit, setValue, control, watch, trigger } =
    useForm<EventWithTicketsandAddress>({
      defaultValues: {
        eventName: "",
        description: "",
        eventPic: "",
        bannerPic: "",
        category: [],
        tickets: [],
        visibilityType: VisibilityType.PUBLISHED,
        privacyType: PrivacyType.PUBLIC,
        publishType: PublishType.NOW,
        address: {
          address1: "",
          address2: "",
          locationName: "",
          postalCode: "",
        },
      },
    });
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
    //  render spinner
    setIsLoading(true);
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

  const parseAndCreate = (event: EventWithTicketsandAddress): void => {
    console.log("Submitting Form Data", event);

    const { address, tickets, startDate, endDate, maxAttendee } = event;

    console.log(tickets.map((ticket) => ({ ...ticket })));
    // parse to prisma type
    const prismaEvent = {
      ...event,
      address: {
        create: { ...address },
      },
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
    createEvent(prismaEvent);
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
                ? "Create a New Event"
                : currentStep?.id === "Step 2"
                ? "Create New Tickets"
                : "Publish Event"}
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
                parseAndCreate(event)
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

export default CreatorEventCreate;
