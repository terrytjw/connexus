import React from "react";
import { Ticket } from "@prisma/client";
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFormSetValue,
} from "react-hook-form";
import { Attendee } from "../../pages/events/register/[id]";

type TicketCardInputProps = {
  ticket: Ticket;
  setValue: UseFormSetValue<Attendee>;
  fields: FieldArrayWithId<Attendee, "attendeeTickets", "id">[];
  append: UseFieldArrayAppend<Attendee, "attendeeTickets">;
};

const TicketCardInput = ({
  ticket,
  setValue,
  fields,
  append,
}: TicketCardInputProps) => {
  console.log("attendeeTickets ", fields);
  return (
    <div>
      <div className="pb-2 sm:pb-4">
        <div className="center card flex flex-row justify-between gap-6 border-2 border-gray-200 bg-white p-6 lg:card-side">
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
                className="w-20 rounded-l bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  // if (item.quantity && item.quantity > 1) {
                  //   updateItem({ ...item, quantity: item.quantity - 1 });
                  //   return;
                  // }
                  // updateItem({ ...item, quantity: 1 });
                }}
              >
                <span className="m-auto text-2xl">-</span>
              </button>
              <input
                type="number"
                min={1}
                step={1}
                value={
                  fields.find(
                    (attendeeTicket) => attendeeTicket.name === ticket.name
                  )?.qty ?? 0
                }
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
                onChange={(e) => {
                  // updateItem({ ...item, quantity: e.target.valueAsNumber });
                }}
                className="w-full appearance-none bg-gray-200 text-center outline-none"
              ></input>
              {/* increase button */}
              <button
                className="w-20 rounded-r bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  // if ticket category exist, update array
                  // else add a new object representing a new ticket category
                  if (
                    fields.find(
                      (attendeeTicket) => attendeeTicket.name === ticket.name
                    )
                  ) {
                    // To change depending on schema
                    setValue(
                      "attendeeTickets",
                      fields.map((attendeeTicket) =>
                        attendeeTicket.name === ticket.name
                          ? {
                              ...attendeeTicket,
                              ticketIds: [
                                ...attendeeTicket.ticketIds,
                                "new id",
                              ],
                              qty: attendeeTicket.qty + 1,
                            }
                          : attendeeTicket
                      )
                    );
                  } else {
                    append({ name: ticket.name, ticketIds: ["id1"], qty: 1 });
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
