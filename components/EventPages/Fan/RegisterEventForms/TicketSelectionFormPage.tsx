import {
  Control,
  useFieldArray,
  UseFormReset,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";
import Button from "../../../Button";
import TicketCardInput from "../../TicketCardInput";
import { Ticket } from "@prisma/client";
import { EventWithTicketsandAddress } from "../../../../utils/types";
import {
  SelectedTicket,
  UserWithSelectedTicket,
} from "../../../../pages/events/register/[id]";
import { useState } from "react";

type TicketSelectionFormPageProps = {
  event: EventWithTicketsandAddress;
  reset: UseFormReset<UserWithSelectedTicket>;
  setValue: UseFormSetValue<UserWithSelectedTicket>;
  watch: UseFormWatch<UserWithSelectedTicket>;
  control: Control<UserWithSelectedTicket, any>;
  trigger: UseFormTrigger<UserWithSelectedTicket>;

  proceedStep: () => void;
};

const TicketSelectionFormPage = ({
  event,
  reset,
  setValue,
  watch,
  control,
  trigger,
  proceedStep,
}: TicketSelectionFormPageProps) => {
  // event data from db
  const { tickets } = event;
  const {
    selectedTicket: { ticketName, qty },
  } = watch();

  return (
    <div>
      <section>
        {/* map the available tickets from an event */}
        {tickets.map((ticket) => (
          <TicketCardInput
            key={ticket.ticketId}
            ticket={ticket}
            watch={watch}
            setValue={setValue}
            reset={reset}
          />
        ))}
        {!(ticketName && qty) && (
          <p className="text-red-400">Please select at least one ticket </p>
        )}
      </section>

      <div className="sticky bottom-0 z-30 flex items-center justify-end gap-6 bg-sky-100 py-2 sm:relative">
        <Button
          variant="solid"
          size="md"
          className="max-w-3xl px-12"
          onClick={async () => {
            if (ticketName && qty) {
              proceedStep();
              document
                .getElementById("scrollable")
                ?.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TicketSelectionFormPage;
