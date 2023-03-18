import {
  Control,
  UseFormReset,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";
import Button from "../../../Button";
import TicketCardInput from "../../TicketCardInput";
import { Ticket } from "@prisma/client";
import { TicketsForm } from "../../../../pages/events/register/[id]";
import { useState } from "react";
import Input from "../../../Input";
import { toast } from "react-hot-toast";
import { getPromotionCodeByName } from "../../../../lib/api-helpers/promotion-api";
import { useRouter } from "next/router";

type TicketSelectionFormPageProps = {
  reset: UseFormReset<TicketsForm>;
  setValue: UseFormSetValue<TicketsForm>;
  watch: UseFormWatch<TicketsForm>;
  control: Control<TicketsForm, any>;
  trigger: UseFormTrigger<TicketsForm>;

  proceedStep: () => void;
};

const TicketSelectionFormPage = ({
  setValue,
  watch,
  proceedStep,
}: TicketSelectionFormPageProps) => {
  const router = useRouter();
  const { id: eventId } = router.query;
  // this tickets array is used to render the ticket cards
  const {
    preDiscountedTickets: tickets,
    selectedTicket: { ticketName, qty },
  } = watch();
  const [promoInput, setPromoInput] = useState<string>("");
  const [isPromoApplied, setIsPromoApplied] = useState<boolean>(false);

  // replace with this with actual promo code field
  const promoCode = {
    promoId: 1,
    promoName: "PROMO10",
    discount: 0.23,
  };

  const getDiscountedPrice = (price: number, discount: number): number => {
    return price * (discount / 100);
  };

  const applyPromoCode = async () => {
    // fetch promo code
    console.log("promo Input ->", promoInput);
    console.log("eventID ->", Number(eventId));

    const promo = await getPromotionCodeByName(promoInput, Number(eventId));
    console.log("api res ->", promo);
    // checks for valid promo code from event object

    if (promo.length !== 0) {
      // set tickets with new price
      setValue(
        "discountedTickets",
        tickets.map((ticket: Ticket) => ({
          ...ticket,
          price: getDiscountedPrice(ticket.price, promo[0].promotionValue),
        }))
      );

      // change promo applied state
      setIsPromoApplied(true);
      // update state for stripe promo id
      setValue("stripePromotionId", promo[0].stripePromotionId);
      toast.success("Promo Code Applied!");
    } else {
      toast.error("Invalid Promo Code!");
    }
  };

  // tickets.map((ticket: Ticket) => ({
  //   ...ticket,
  //   price: getDiscountedPrice(ticket.price, promoCode.discount),
  return (
    <div>
      <section>
        {/* promo code */}
        <div className="relative pb-2">
          <Input
            type="text"
            label="Promotion Code"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            placeholder="Promo Code"
            size="md"
            variant="bordered"
            className="w-full"
          />
          <div className="absolute top-11 right-2">
            <Button
              variant="outlined"
              size="sm"
              className="border-0"
              onClick={(e) => {
                e.preventDefault();
                applyPromoCode();
              }}
            >
              Apply
            </Button>
          </div>
        </div>

        {/* map the available tickets from an event */}
        {tickets.map((ticket: Ticket) => (
          <TicketCardInput
            key={ticket.ticketId}
            ticket={ticket}
            watch={watch}
            setValue={setValue}
            isPromoApplied={isPromoApplied}
          />
        ))}
      </section>

      <div className="sticky bottom-0 z-30 flex items-center justify-end gap-6 bg-sky-100 py-2 sm:relative">
        <Button
          variant="solid"
          size="md"
          className="max-w-3xl px-12"
          onClick={async (e) => {
            e.preventDefault();
            if (ticketName && qty) {
              proceedStep();
              document
                .getElementById("scrollable")
                ?.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              toast.error("Please select at least 1 ticket");
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
