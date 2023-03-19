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
import { EventWithAllDetails } from "../../utils/types";
import {
  PrivacyType,
  Promotion,
  PublishType,
  Ticket,
  TicketType,
  VisibilityType,
} from "@prisma/client";

import axios from "axios";

import { ethers } from "ethers";
import contract from "../../artifacts/contracts/SimpleEvent.sol/SimpleEvent.json";
import { ALCHEMY_API, smartContract } from "../../lib/constant";
import Modal from "../../components/Modal";
import Link from "next/link";
import Button from "../../components/Button";
import { useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";

// smart contract stuff
const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API);
const abi = contract.abi;
const bytecode = contract.bytecode;
const signer = new ethers.Wallet(smartContract.privateKey, provider);

const CreatorEventCreate = () => {
  const { data: session } = useSession();
  const userId = session?.user.userId;
  const { handleSubmit, setValue, control, watch, trigger, getFieldState } =
    useForm<EventWithAllDetails>({
      defaultValues: {
        eventName: "test",
        description: "desc",
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
        promotion: [
          {
            name: "",
            promotionValue: undefined,
            eventId: undefined,
            stripePromotionId: "",
            isEnabled: false,
          },
        ],
      },
    });
  // const { handleSubmit, setValue, control, watch, trigger, getFieldState } =
  //   useForm<EventWithAllDetails>({
  //     defaultValues: {
  //       eventName: "test",
  //       description: "desc",
  //       eventPic: "",
  //       bannerPic: "",
  //       category: [],
  //       tickets: [
  //         {
  //           ticketId: 1,
  //           name: "tname",
  //           description: "desc",
  //           price: "1",
  //           totalTicketSupply: "6",
  //           startDate: "2023-03-20T23:57",
  //           endDate: "2023-03-22T23:57",
  //           eventId: 5e-324,
  //           ticketType: "ON_SALE",
  //         },
  //       ],
  //       visibilityType: "PUBLISHED",
  //       privacyType: "PUBLIC",
  //       publishType: "NOW",
  //       address: {
  //         address1: "123 Bukit Merah Lane 1",
  //         address2: "",
  //         locationName: "123 Bukit Merah Lane 1",
  //         postalCode: "150123",
  //         lat: 1.2867152,
  //         lng: 103.8037402,
  //       },
  //       promotion: [
  //         {
  //           name: "promo200",
  //           promotionValue: "10",
  //           stripePromotionId: "",
  //           isEnabled: true,
  //         },
  //       ],
  //       startDate: "2023-03-20T23:55",
  //       endDate: "2023-03-31T23:55",
  //       maxAttendee: "12",
  //     },
  //   });

  // listen to tickets array
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "tickets",
  });
  const { tickets } = watch();
  const [steps, setSteps] = useState<Step[]>([
    { id: "Step 1", name: "Event Details", status: StepStatus.CURRENT },
    { id: "Step 2", name: "Ticket Details", status: StepStatus.UPCOMING },
    { id: "Step 3", name: "Publish Details", status: StepStatus.UPCOMING },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>();
  const [isCreateSuccessModalOpen, setIsCreateSuccessModalOpen] =
    useState(false);
  const [createdEventId, setCreatedEventId] = useState<number | undefined>();

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
    // console.log(category_price);

    const event_contract = await Event_contract.deploy(
      categories,
      category_price,
      category_quantity,
      event.eventName,
      new Date(event.startDate), // what is this?
      event.address.locationName,
      1,
      100,
      event.eventName
    ); //1 ticket max per person

    console.log("Contract successfully deployed => ", event_contract.address);

    // call post api
    const { data: response } = await axios.post(
      "http://localhost:3000/api/events",
      {
        ...event,
        scAddress: event_contract.address,
      }
    );
    const data = response;
    console.log("Event Created -> ", data);
    setIsLoading(false);
    setCreatedEventId(data.eventId); // used to route to event
  };

  const parseAndCreate = (event: EventWithAllDetails): void => {
    console.log("Submitting Form Data", event);

    const { tickets, startDate, endDate, maxAttendee, promotion } = event;

    console.log(tickets.map((ticket) => ({ ...ticket })));
    // parse to prisma type
    const prismaEvent = {
      ...event,
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
          // currentTicketSupply: 0, don't pass in current supply
          totalTicketSupply: Number(totalTicketSupply),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        })
      ),
      promotion: promotion.map((promo: Promotion) => ({
        ...promo,
        promotionValue: Number(promo.promotionValue),
      })),
      creatorId: userId,
    };
    createEvent(prismaEvent);
  };

  // a null/ undefined state is needed for form validation
  const addNewTicket = (): void => {
    append({
      ticketId: 1,
      name: "",
      description: "",
      price: undefined as unknown as number,
      totalTicketSupply: undefined as unknown as number,
      currentTicketSupply: undefined as unknown as number,
      startDate: undefined as unknown as Date,
      endDate: undefined as unknown as Date,
      eventId: Number.MIN_VALUE,
      ticketType: TicketType.ON_SALE,
      stripePriceId: "",
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
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#FFFFFF",
                color: "#34383F",
                textAlign: "center",
              },
            }}
          />

          {/* Register success modal */}
          <Modal
            isOpen={isCreateSuccessModalOpen}
            setIsOpen={setIsCreateSuccessModalOpen}
          >
            {isLoading ? (
              <Loading className="!h-full !bg-transparent" />
            ) : (
              <div className="flex flex-col gap-6 py-4">
                <h3 className="text-xl font-semibold">Event Created!</h3>
                <h3 className="text-md font-normal text-gray-500">
                  Your Event Page can be viewed in the 'Events' tab in the
                  navigation bar.
                </h3>

                <Link href={`/events/${createdEventId}`}>
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
                ? "Create a New Event"
                : currentStep?.id === "Step 2"
                ? "Create New Tickets"
                : "Publish Event"}
            </h2>
          </nav>

          {/* Steps */}
          <div className="justify-cente relative sm:py-8">
            {/* conditionally rendered via css */}
            <StepsDesktop steps={steps} setSteps={setSteps} />
            <StepsMobile currentStep={currentStep} steps={steps} />
          </div>

          {/* Form */}
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <form
              onSubmit={handleSubmit((event: EventWithAllDetails) =>
                parseAndCreate(event)
              )}
            >
              {/* Step 1 */}
              {currentStep?.id === "Step 1" &&
                currentStep?.status === StepStatus.CURRENT && (
                  <EventFormPage
                    isEdit={false} // tells the form page that user is not editing
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
                    isEdit={false} // tells the form page that user is not editing
                    watch={watch}
                    setValue={setValue}
                    getFieldState={getFieldState}
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

export default CreatorEventCreate;
