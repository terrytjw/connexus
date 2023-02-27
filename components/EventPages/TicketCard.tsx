import React from "react";
import { Ticket } from "@prisma/client";

type TicketCardProps = {
  ticket: Ticket;
};

const TicketCard = ({ ticket }: TicketCardProps) => {
  return (
    <div>
      <div className="pb-2 sm:pb-4">
        <div className="center card flex items-start justify-between gap-6 border-2 border-gray-200 bg-white p-6 lg:card-side">
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
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
