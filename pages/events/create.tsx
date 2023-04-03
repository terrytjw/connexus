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
import _ from "lodash";

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
        raffles: [
          {
            raffleId: undefined,
            eventId: undefined,
            isEnabled: false,
          },
        ],
      },
    });

  // useForm<EventWithAllDetails>({
  //   defaultValues: {
  //     eventName: "event 1",
  //     description: "event 1 desc",
  //     eventPic:
  //       "data:image/png;base64,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",
  //     bannerPic:
  //       "data:image/png;base64,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",
  //     category: [],
  //     tickets: [
  //       {
  //         ticketId: 1,
  //         name: "tname",
  //         description: "desc",
  //         price: "1",
  //         totalTicketSupply: "6",
  //         startDate: "2023-03-30T23:57",
  //         endDate: "2023-04-30T23:57",
  //         eventId: 5e-324,
  //         ticketType: "ON_SALE",
  //       },
  //     ],
  //     visibilityType: "PUBLISHED",
  //     privacyType: "PUBLIC",
  //     publishType: "NOW",
  //     address: {
  //       address1: "123 Bukit Merah Lane 1",
  //       address2: "",
  //       locationName: "123 Bukit Merah Lane 1",
  //       postalCode: "150123",
  //       lat: 1.2867152,
  //       lng: 103.8037402,
  //     },
  //     promotion: [
  //       {
  //         name: "",
  //         promotionValue: undefined,
  //         stripePromotionId: "",
  //         isEnabled: false,
  //       },
  //     ],
  //     raffles: [
  //       {
  //         isEnabled: true,
  //         rafflePrizes: [
  //           {
  //             name: "Raffle Prize 1",
  //           },
  //         ],
  //       },
  //     ],
  //     startDate: "2023-03-30T23:55",
  //     endDate: "2023-05-20T23:55",
  //     maxAttendee: "12",
  //   },
  // });
  const currentFormData = watch();
  console.log("current form data -> ", currentFormData);

  // listen to tickets array
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "tickets",
  });
  const { tickets } = watch();

  // listen to raffles array
  const {
    fields: prizesFields,
    append: appendPrize,
    remove: removePrize,
    update: updatePrize,
  } = useFieldArray({
    control,
    name: "raffles.0.rafflePrizes",
  });
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

    console.log("Posting Parsed Event Object -> ", event);

    // call post api
    const { data: response } = await axios.post(
      "http://localhost:3000/api/events",
      {
        ...event,
        eventScAddress: event_contract.address,
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
    let prismaEvent = {
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

    if (!promotion[0].isEnabled) {
      const newEvent = _.omit(prismaEvent, "promotion");
      createEvent(newEvent);
    } else {
      createEvent(prismaEvent);
    }
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
    // scroll to ticket from 2nd ticket onwards
    if (tickets.length > 1) {
      document.getElementById(`ticket-${tickets?.length}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
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
                <h3 className="text-xl font-semibold text-gray-900">
                  Event Created!
                </h3>
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
            <h2 className="text-2xl font-bold text-gray-900 sm:text-4xl">
              {currentStep?.id === "Step 1"
                ? "Create a New Event"
                : currentStep?.id === "Step 2"
                ? "Create New Tickets"
                : "Publish Event"}
            </h2>
          </nav>

          {/* Steps */}
          <div className="relative justify-center text-gray-900 sm:py-8">
            {/* conditionally rendered via css */}
            <StepsDesktop steps={steps} setSteps={setSteps} />
            <StepsMobile currentStep={currentStep} steps={steps} />
          </div>

          {/* Form */}
          <div>
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
                    prizesFields={prizesFields}
                    appendPrize={appendPrize}
                    removePrize={removePrize}
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
