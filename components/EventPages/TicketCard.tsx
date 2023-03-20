import React, { useState } from "react";
import { Ticket, TicketType } from "@prisma/client";
import { formatDate } from "../../utils/date-util";
import Button from "../Button";
import { useSession } from "next-auth/react";
import useInterval from "../../utils/useInterval";
import { TicketWithEvent } from "../../utils/types";

type TicketCardProps = {
  ticket: TicketWithEvent;
  isOwnedTicket?: boolean; // conditionally render elements based on whether this is a generic or owned ticket
  setIsModalOpen?: (value: boolean) => void;
  setQrValue?: (value: string) => void;
  setIsPrizeModalOpen?: (value: boolean) => void;
  setRafflePrizes?: (value: any) => void;
  setSelectedTicket?: (value: any) => void;
};

const TicketCard = ({
  ticket,
  isOwnedTicket,
  setIsModalOpen,
  setQrValue,
  setIsPrizeModalOpen,
  setRafflePrizes,
  setSelectedTicket,
}: TicketCardProps) => {
  const { data: session, status } = useSession();
  const userId = session?.user.userId;
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>();

  // custom hook to call a function every 3s with proper memory cleanup
  useInterval(() => {
    getCheckInStatus();
  }, 3000);

  const getCheckInStatus = async () => {
    try {
      // todo: replace with actual user Ticket info
      const checkInStatus = false;
      setIsCheckedIn(checkInStatus);
    } catch (error) {
      console.error("Error fetching state:", error);
    }
  };

  const getQrString = (): string => {
    const qrString = ticket.eventId + "," + ticket.ticketId + "," + userId;
    return qrString;
  };

  const isSoldOut = (): boolean => {
    return ticket.currentTicketSupply === ticket.totalTicketSupply;
  };

  const isPaused = (): boolean => {
    return ticket.ticketType === TicketType.PAUSED;
  };

  const isRaffleActivated = (): boolean => {
    return ticket.event.raffles[0]?.isActivated;
  };

  const isPrizeClaimed = (ticket: any): boolean | undefined => {
    return ticket?.event.raffles[0]?.rafflePrizes.find(
      (prize: any) =>
        prize.rafflePrizeUser.find(
          (rafflePrizeUser: any) => rafflePrizeUser.userId === userId
        )?.isClaimed
    );
  };

  const getRafflePrizes = (ticket: any): any[] => {
    return ticket?.event.raffles[0]?.rafflePrizes;
  };

  return (
    <div>
      <div className="pb-2 sm:pb-4">
        <div
          className={`card flex flex-col justify-between gap-6 border-2 border-gray-200 sm:flex-row ${
            isOwnedTicket || ticket.ticketType === TicketType.ON_SALE
              ? "bg-white shadow-md"
              : "bg-gray-50"
          } p-6 lg:card-side`}
        >
          {/* Left column */}
          <div className="flex flex-col gap-y-5">
            <h1 className="flex gap-4 text-xl font-bold text-gray-700">
              {ticket.name}
              {isOwnedTicket && isCheckedIn && (
                <span className="flex items-center rounded-full border-2 border-green-100 bg-green-100 px-2 text-sm font-medium text-green-400">
                  Checked In
                </span>
              )}
              {!isOwnedTicket && (
                <div className="flex gap-4">
                  {isPaused() && (
                    <span className="flex items-center rounded-full border-2 border-rose-100 bg-rose-100 px-2 text-sm font-normal text-rose-400">
                      Sale Paused
                    </span>
                  )}
                  {isSoldOut() && (
                    <span className="flex items-center rounded-full border-2 border-blue-100 bg-blue-100 px-2 text-sm font-normal text-blue-400">
                      Sold Out
                    </span>
                  )}
                </div>
              )}
            </h1>
            <span>
              <p className="text-md font-semibold text-blue-600">Ticket Type</p>
              <p className="text-md text-gray-700">
                {Number(ticket.price) === 0 ? "Free " : "Premium"}
              </p>
            </span>
            <span>
              <p className="text-md font-semibold text-blue-600">Price</p>
              <p className="text-md font-medium text-gray-700">
                ${Number(ticket.price)?.toFixed(2)}
              </p>
            </span>
            <span>
              <p className="text-md font-semibold text-blue-500">
                Sale Duration
              </p>
              <p className="text-sn text-gray-700">
                {formatDate(ticket.startDate)} - {formatDate(ticket.endDate)}
              </p>
            </span>
            <span className=" flex flex-col">
              <p className="text-md text-blue-600">
                Perks of owning this ticket:
              </p>
              <p className="text-sn text-gray-700">{ticket.description}</p>
            </span>
          </div>

          {/* Right column */}
          <div className="flex flex-col justify-end gap-4">
            {isOwnedTicket && isRaffleActivated() && (
              <Button
                variant="outlined"
                size="md"
                className={`max-w-xs ${isPrizeClaimed(ticket) && "border-0"}`}
                onClick={() => {
                  if (setIsPrizeModalOpen && setRafflePrizes) {
                    setRafflePrizes(getRafflePrizes(ticket));
                    setIsPrizeModalOpen(true);
                  }
                }}
                disabled={isPrizeClaimed(ticket)}
              >
                {!isPrizeClaimed(ticket) ? "Spin the Wheel" : "Prize Claimed"}
              </Button>
            )}
            {isOwnedTicket && (
              <Button
                variant="solid"
                size="md"
                className="max-w-xs "
                onClick={() => {
                  if (setIsModalOpen && setQrValue && setSelectedTicket) {
                    setSelectedTicket(ticket);
                    setQrValue(getQrString());
                    setIsModalOpen(true);
                  }
                }}
              >
                Generate QR Code
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
