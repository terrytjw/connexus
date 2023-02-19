import { useContext, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import StepsMobile from "../../components/EventPages/StepsMobile";
import StepsDesktop, { Step } from "../../components/EventPages/StepsDesktop";
import EventFormPage from "../../components/EventPages/Creator/CreateEventForms/EventFormPage";
import TicketFormPage from "../../components/EventPages/Creator/CreateEventForms/TicketFormPage";
import PublishFormPage from "../../components/EventPages/Creator/CreateEventForms/PublishFormPage";

import { FaChevronLeft } from "react-icons/fa";
import { Ticket, PrivacyType, Promotion, VisibilityType } from "@prisma/client";
import { StepStatus } from "../../utils/enums";

// hard coded tag type, will be replaced with prisma type
export type Venue = {
  lat: number | undefined;
  lng: number | undefined;
  venueName: string;
  address1: string;
  address2: string;
  postalCode: number;
};

export type Event = {
  name: string;
  description: string;
  bannerPic: File | null;
  profilePic: File | null;
  startDateTime: string;
  endDateTime: string;
  venue: Venue;
  maxAttendees: number;
  tags: string[];
  tickets: Ticket[];
  privacy: PrivacyType;
  visibility: VisibilityType;
  promo?: Promotion;
};

// hard coded tag types, will be replaced
const labels = [
  "NFT",
  "Lifestyle",
  "Fitness",
  "Entertainment",
  "Fashion",
  "Animals",
  "Travel",
  "Education",
  "Health",
];

// hard coded data
const privacy = [
  {
    id: "public",
    name: "Public",
    description: "description..",
  },
  {
    id: "private",
    name: "Private",
    description: "description..",
  },
];

const publish = [
  {
    id: "now",
    name: "Publish now",
    description: "description..",
  },
  {
    id: "later",
    name: "Schedule for later",
    description: "description..",
  },
];

const CreatorEventCreate = () => {
  // hard coded default event, will be replaced to match prisma type
  const { handleSubmit, setValue, control, watch, trigger } = useForm<Event>({
    defaultValues: {
      name: "",
      description: "",
      startDateTime: "",
      endDateTime: "",
      tags: [""],
      venue: {
        lat: undefined,
        lng: undefined,
        venueName: "",
        address1: "",
        address2: "",
        postalCode: 0 as unknown as number,
      },
      tickets: [],
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

  // a null/ undefined state is needed for form validation
  const addNewTicket = (): void => {
    append({
      ticketId: 1,
      name: "",
      description: "",
      price: null as unknown as number,
      quantity: null as unknown as number,
      startDate: null as unknown as Date,
      endDate: null as unknown as Date,
      eventId: Number.MIN_VALUE,
    });
  };

  useEffect(() => {
    // scroll to ticket
    document.getElementById(`ticket-${tickets.length}`)?.scrollIntoView({
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
          onSubmit={handleSubmit((data: Event) =>
            console.log("Submitting Form Data", data)
          )}
        >
          {/* Step 1 */}
          {currentStep?.id === "Step 1" &&
            currentStep?.status === StepStatus.CURRENT && (
              <EventFormPage
                watch={watch}
                labels={labels}
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
                privacy={privacy}
                publish={publish}
              />
            )}
        </form>
      </div>
    </main>
  );
};

export default CreatorEventCreate;
