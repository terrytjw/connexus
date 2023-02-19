import {
  Control,
  useFieldArray,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";
import Button from "../../../Button";
import { Event } from "../../../../pages/events/create";
import { Attendee } from "../../../../pages/events/register/[id]";
import TicketCardInput from "../../TicketCardInput";

type TicketSelectionFormPageProps = {
  event: Event;
  setValue: UseFormSetValue<Attendee>;
  watch: UseFormWatch<Attendee>;
  control: Control<Attendee, any>;
  trigger: UseFormTrigger<Attendee>;
  proceedStep: () => void;
};

const TicketSelectionFormPage = ({
  event,
  setValue,
  watch,
  control,
  trigger,
  proceedStep,
}: TicketSelectionFormPageProps) => {
  const { tickets } = event;
  console.log(tickets);

  // listen to attendee tickets array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "attendeeTickets",
  });

  return (
    <div>
      <section>
        {/* map the available tickets from an event */}
        {tickets.map((ticket) => (
          <TicketCardInput
            key={ticket.ticketId}
            ticket={ticket}
            fields={fields}
            setValue={setValue}
            append={append} // to add tickets to attendee.attendeeTickets array
          />
        ))}
      </section>
      <div className="sticky bottom-0 z-30 flex items-center justify-end gap-6 bg-sky-100 py-2 sm:relative">
        <Button
          variant="solid"
          size="md"
          className="max-w-3xl px-12"
          onClick={async () => {
            const isValidated = true; // todo: replace validation logic

            if (isValidated) {
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
