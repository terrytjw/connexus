import React from "react";
import { Ticket, TicketType } from "@prisma/client";
import { formatDate } from "../../utils/date-util";
import Button from "../Button";

type TicketCardProps = {
  ticket: Ticket;
  isOwnedTicket?: boolean;
  setIsModalOpen: (value: boolean) => void;
};

const TicketCard = ({
  ticket,
  isOwnedTicket,
  setIsModalOpen,
}: TicketCardProps) => {
  return (
    <div>
      <div className="pb-2 sm:pb-4">
        <div
          className={`center card flex items-start justify-between gap-6 border-2 border-gray-200 ${
            ticket.ticketType === TicketType.ON_SALE ? "bg-white" : "bg-gray-50"
          } p-6 lg:card-side`}
        >
          <div className="flex flex-col gap-y-5">
            <h1 className="flex gap-4 text-xl font-bold text-gray-700">
              {ticket.name}{" "}
              {ticket.ticketType === TicketType.ON_SALE ? (
                ""
              ) : (
                <span className="flex items-center rounded-full border-2 border-rose-200 bg-rose-200 px-2 text-sm font-normal text-rose-400">
                  Sale Paused
                </span>
              )}
            </h1>
            <span>
              <p className="text-md font-semibold text-blue-600">Ticket Type</p>
              <p className="text-md text-gray-700">
                {ticket.price === 0 ? "Free " : "Premium"}
              </p>
            </span>
            <span>
              <p className="text-md font-semibold text-blue-600">Price</p>
              <p className="text-sn text-gray-700">${ticket.price}</p>
            </span>
            <span>
              <p className="text-md font-semibold text-blue-500">
                Sale Duration
              </p>
              <p className="text-sn text-gray-700">
                {formatDate(ticket.startDate)} - {formatDate(ticket.endDate)}
              </p>
            </span>
            <span className=" flex flex-col gap-4">
              <p className="text-md text-blue-600">
                Perks of owning this ticket:
              </p>
              <p className="text-sn text-gray-700">{ticket.description}</p>
            </span>
          </div>
          {isOwnedTicket && (
            <div className="flex items-end">
              <Button
                variant="solid"
                size="md"
                className="max-w-xs "
                onClick={() => setIsModalOpen(true)}
              >
                Generate QR Code
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
