import React from "react";
import { Ticket, TicketType } from "@prisma/client";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { TicketsForm } from "../../pages/events/register/[id]";

type TicketCardInputProps = {
  ticket: Ticket;
  watch: UseFormWatch<TicketsForm>;
  setValue: UseFormSetValue<TicketsForm>;
  isPromoApplied: boolean;
};

const TicketCardInput = ({
  ticket,
  watch,
  setValue,
  isPromoApplied,
}: TicketCardInputProps) => {
  const {
    selectedTicket: {
      ticketId: selectedTicketId,
      ticketName: selectedTicketName,
      qty: selectedQty,
    },
    preDiscountedTickets,
    discountedTickets,
  } = watch();

  const showInputStepper = (): boolean => {
    // case sold out
    if (isSoldOut()) {
      return false;
    }
    // case ticket not paused AND no selected ticekts
    if (!isPaused() && !selectedTicketName) {
      // show tickets
      return true;
    }
    // else show input stepper only for selected ticket
    return !isPaused() && selectedTicketId === ticket.ticketId;
  };

  const isSoldOut = (): boolean => {
    return ticket.currentTicketSupply === ticket.totalTicketSupply;
  };

  const isPaused = (): boolean => {
    return ticket.ticketType === TicketType.PAUSED;
  };

  const getTicketPrice = (ticketId: number): number | undefined => {
    // render different prices based on whether promo is applied
    if (isPromoApplied) {
      return discountedTickets.find(
        (ticket: Ticket) => Number(ticket.ticketId) === Number(ticketId)
      )?.price;
    }
    return preDiscountedTickets.find(
      (ticket: Ticket) => Number(ticket.ticketId) === Number(ticketId)
    )?.price;
  };

  const getPreDiscountedPrice = (ticketId: number): number | undefined => {
    return preDiscountedTickets.find(
      (ticket: Ticket) => Number(ticket.ticketId) === Number(ticketId)
    )?.price;
  };

  return (
    <div>
      <div className="pb-2 sm:pb-4">
        <div
          className={`center card flex flex-row justify-between gap-6 border-2 ${
            selectedTicketName === ticket.name
              ? "!border-sky-500"
              : "!bg-gray-white"
          } ${
            ticket.ticketType === TicketType.ON_SALE ? "bg-white" : "bg-gray-50"
          } border-gray-200 bg-white p-6 lg:card-side`}
        >
          {/* Ticket Details */}
          <div className="flex flex-col gap-y-4">
            <h1 className="flex gap-4 text-xl font-bold text-gray-700">
              {ticket.name}{" "}
              {isPaused() && (
                <span className="flex items-center rounded-full border-2 border-red-100 bg-red-100 px-2 text-sm font-normal text-red-500">
                  Sale Paused
                </span>
              )}
              {isSoldOut() && (
                <span className="flex items-center rounded-full border-2 border-blue-100 bg-blue-100 px-2 text-sm font-normal text-blue-600">
                  Sold Out
                </span>
              )}
            </h1>
            <span>
              <p className="text-md font-semibold text-blue-600">Ticket Type</p>
              <p className="text-sn text-gray-700">
                {ticket.price !== 0 ? " Premium" : "Free"}
              </p>
            </span>
            <span>
              <p className="text-md font-semibold text-blue-600">Price</p>
              <span className="flex items-center gap-2">
                {/* final price */}
                <p className="text-md font-medium text-gray-700">
                  ${getTicketPrice(ticket.ticketId)?.toFixed(2)}
                </p>
                {/* pre-discounted price, if any */}
                {isPromoApplied && (
                  <p
                    className={`text-md font-medium text-gray-700 ${
                      isPromoApplied && "!text-xs !text-gray-400 line-through"
                    }`}
                  >
                    ${getPreDiscountedPrice(ticket.ticketId)?.toFixed(2)}
                  </p>
                )}
              </span>
            </span>
            <span className="flex flex-col">
              <p className="text-md font-semibold text-blue-600">Perks</p>
              <p className="text-sn text-gray-700">{ticket.description}</p>
            </span>
          </div>
          {/* Input Stepper */}
          {showInputStepper() && (
            <div className="flex items-center">
              <div className="flex h-10 w-32 flex-row">
                {/* decrease button */}
                <button
                  type="button" // prevent form submission
                  className="w-20 rounded-l bg-gray-200 hover:bg-gray-300"
                  onClick={() => {
                    // only allow resetting of selected ticket if ticket name matches
                    if (ticket.ticketId === selectedTicketId) {
                      setValue("selectedTicket", {
                        ticketId: undefined,
                        ticketName: "",
                        qty: 0,
                        price: 0,
                        stripePriceId: "",
                      });
                    }
                  }}
                >
                  <span className="m-auto text-2xl">-</span>
                </button>
                <input
                  type="number"
                  disabled
                  min={1}
                  step={1}
                  value={ticket.ticketId === selectedTicketId ? 1 : 0}
                  className="w-full appearance-none bg-gray-200 text-center outline-none"
                ></input>
                {/* increase button */}
                <button
                  type="button" // prevent form submission
                  className="w-20 rounded-r bg-gray-200 hover:bg-gray-300"
                  onClick={() => {
                    // only replace selected ticket if no existing tickets are selected
                    if (selectedQty === 0) {
                      setValue("selectedTicket", {
                        ticketId: ticket.ticketId,
                        ticketName: ticket.name,
                        qty: 1,
                        price: getTicketPrice(ticket.ticketId) ?? 0,
                        stripePriceId: ticket.stripePriceId ?? "",
                      });
                    }
                  }}
                >
                  <span className="m-auto text-2xl font-thin">+</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCardInput;
