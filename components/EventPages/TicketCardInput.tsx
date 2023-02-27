import React from "react";
import { Ticket } from "@prisma/client";
import { UseFormReset, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { UserWithSelectedTicket } from "../../pages/events/register/[id]";

type TicketCardInputProps = {
  ticket: Ticket;
  watch: UseFormWatch<UserWithSelectedTicket>;
  setValue: UseFormSetValue<UserWithSelectedTicket>;
  reset: UseFormReset<UserWithSelectedTicket>;
};

const TicketCardInput = ({
  ticket,
  watch,
  setValue,
  reset,
}: TicketCardInputProps) => {
  // form data from parent component
  const {
    selectedTicket: { ticketName, qty },
  } = watch();
  return (
    <div>
      <div className="pb-2 sm:pb-4">
        <div
          className={`center card flex flex-row justify-between gap-6 border-2 ${
            ticketName === ticket.name ? "!border-sky-500" : "!bg-gray-300"
          } border-gray-200 bg-white p-6 lg:card-side`}
        >
          {/* Ticket Details */}
          <div className="flex flex-col gap-y-4">
            <h1 className="text-xl font-bold text-gray-700">{ticket.name}</h1>
            <span>
              <p className="text-md font-semibold text-blue-600">Ticket Type</p>
              <p className="text-sn text-gray-700">Premium</p>
            </span>
            <span>
              <p className="text-md font-semibold text-blue-600">Price</p>
              <p className="text-sn text-gray-700">${ticket.price}</p>
            </span>
            <span className=" flex flex-col gap-4">
              <p className="text-md text-blue-600">
                Perks of owning this ticket:
              </p>
              <p className="text-sn text-gray-700">{ticket.description}</p>
            </span>
          </div>
          {/* Input Stepper */}
          <div className="flex items-center">
            <div className="flex h-10 w-32 flex-row">
              {/* decrease button */}
              <button
                type="button" // prevent form submission
                className="w-20 rounded-l bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  // only allow resetting of selected ticket if ticket name matches
                  if (ticket.name === ticketName) {
                    setValue("selectedTicket", {
                      ticketName: "",
                      qty: 0,
                      price: 0,
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
                value={ticket.name === ticketName ? 1 : 0}
                onKeyDown={(e) => {
                  // disallow decimal
                  // only allow numbers, backspace, arrow left and right for editing
                  if (
                    e.code == "Backspace" ||
                    e.code == "ArrowLeft" ||
                    e.code == "ArrowRight" ||
                    (e.key >= "0" && e.key <= "9")
                  ) {
                    return;
                  }
                  e.preventDefault();
                }}
                className="w-full appearance-none bg-gray-200 text-center outline-none"
              ></input>
              {/* increase button */}
              <button
                type="button" // prevent form submission
                className="w-20 rounded-r bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  // only replace selected ticket if no existing tickets are selected
                  if (qty === 0) {
                    setValue("selectedTicket", {
                      ticketName: ticket.name,
                      qty: 1,
                      price: ticket.price,
                    });
                  }
                }}
              >
                <span className="m-auto text-2xl font-thin">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCardInput;
