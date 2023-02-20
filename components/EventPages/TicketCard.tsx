import React from "react";
import { Ticket } from "@prisma/client";
import { format } from "date-fns";

type TicketCardProps = {
  ticket: Ticket;
};

const TicketCard = ({ ticket }: TicketCardProps) => {
  return (
    <div>
      <h1 className="mt-12 text-xl font-semibold sm:text-2xl ">
        Ticket Options (Types)
      </h1>
      <div className="py-4 sm:py-8">
        <div className="center card flex items-center justify-between gap-6 border-2 border-gray-200 bg-white p-6 lg:card-side">
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
            <span className="flex flex-col">
              <p className="text-md font-semibold text-gray-700">
                Sale Duration
              </p>
              <p className="text-sn text-gray-700">
                {format(new Date(ticket.startDate), "PPPPpppp")} -{" "}
                {format(new Date(ticket.endDate), "PPPPpppp")}
              </p>
            </span>
            <span className=" flex flex-col gap-4">
              <p className="text-md text-blue-600">
                Perks of owning this ticket:
              </p>
              <p className="text-sn text-gray-700">{ticket.description}</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
