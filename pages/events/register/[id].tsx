import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import StepsMobile from "../../../components/EventPages/StepsMobile";
import StepsDesktop, {
  Step,
} from "../../../components/EventPages/StepsDesktop";

import { FaChevronLeft } from "react-icons/fa";
import { StepStatus } from "../../../utils/enums";
import ParticularsFormPage from "../../../components/EventPages/Fan/RegisterEventForms/ParticularsFormPage";
import { Event } from "../create";
import TicketSelectionFormPage from "../../../components/EventPages/Fan/RegisterEventForms/TicketSelectionFormPage";
import { PrivacyType, VisibilityType } from "@prisma/client";
import ConfirmationPage from "../../../components/EventPages/Fan/RegisterEventForms/ConfirmationPage";

// hard coded tag type, will be replaced with prisma type
export type Attendee = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  attendeeTickets: {
    name: string;
    ticketIds: string[];
    qty: number;
    // rest of ticket details
  }[];
};

export type Venue = {
  lat: number | undefined;
  lng: number | undefined;
  venueName: string;
  address1: string;
  address2: string;
  postalCode: number;
};

const FanEventRegister = () => {
  // TO replace: fetch event data using ID from api
  const [event, setEvent] = useState<Event>({
    name: "Blockchain Event",
    description: "Event Description",
    bannerPic: null,
    profilePic: null,
    startDateTime: "2023-02-19T08:08",
    endDateTime: "2023-02-19T20:08",
    tags: [""],
    venue: {
      lat: 1.2942824,
      lng: 103.7741012,
      venueName: "COM 2",
      address1: "15 Computing Drive",
      address2: "01-15",
      postalCode: 117418,
    },
    tickets: [
      {
        ticketId: 1,
        name: "Cat A",
        description: "Good views",
        price: 69,
        quantity: 10,
        startDate: new Date("2023-03-21T12:31"),
        endDate: new Date("2023-03-22T00:32"),
        eventId: 5e-324,
      },
      {
        ticketId: 1,
        name: "Cat B",
        description: "Slightly worse views",
        price: 10,
        quantity: 30,
        startDate: new Date("20-03-12T03:12"),
        endDate: new Date("2023-02-19T08:10"),
        eventId: 5e-324,
      },
    ],
    maxAttendees: 30,
    privacy: PrivacyType.PUBLIC,
    visibility: VisibilityType.PUBLISHED,
  });

  // hard coded default event, will be replaced to match prisma type
  // this is the attendee object used for an api call to the backend
  const { handleSubmit, setValue, control, watch, trigger } = useForm<Attendee>(
    {
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        attendeeTickets: [],
      },
    }
  );

  const [steps, setSteps] = useState<Step[]>([
    { id: "Step 1", name: "Particulars", status: StepStatus.CURRENT },
    { id: "Step 2", name: "Select Tickets", status: StepStatus.UPCOMING },
    { id: "Step 3", name: "Confirm Registration", status: StepStatus.UPCOMING },
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
          onSubmit={handleSubmit((data: Attendee) =>
            console.log("Submitting Form Data", data)
          )}
        >
          {/* Step 1 */}
          {currentStep?.id === "Step 1" &&
            currentStep?.status === StepStatus.CURRENT && (
              <ParticularsFormPage
                watch={watch}
                control={control}
                trigger={trigger}
                proceedStep={proceedStep}
              />
            )}
          {/* Step 2 */}
          {currentStep?.id === "Step 2" &&
            currentStep?.status === StepStatus.CURRENT && (
              <TicketSelectionFormPage
                event={event}
                setValue={setValue}
                watch={watch}
                control={control}
                trigger={trigger}
                proceedStep={proceedStep}
              />
            )}
          {/* Step 3 */}
          {currentStep?.id === "Step 3" &&
            currentStep?.status === StepStatus.CURRENT && (
              <ConfirmationPage
                watch={watch}
                control={control}
                trigger={trigger}
                proceedStep={proceedStep}
              />
            )}
        </form>
      </div>
    </main>
  );
};

export default FanEventRegister;
