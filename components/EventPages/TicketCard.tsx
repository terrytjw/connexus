import React, { useEffect, useState } from "react";
import { TicketType } from "@prisma/client";
import { formatDate } from "../../utils/date-util";
import Button from "../Button";
import { useSession } from "next-auth/react";
import { TicketWithEvent } from "../../utils/types";
import { CurrentTicket } from "../../pages/events/tickets";

type TicketCardProps = {
  ticket: TicketWithEvent | any;
  isOwnedTicket?: boolean; // conditionally render elements based on whether this is a generic or owned ticket
  setIsModalOpen?: (value: boolean) => void;
  setQrValue?: (value: string) => void;
  setIsPrizeModalOpen?: (value: boolean) => void;
  setRafflePrizes?: (value: any) => void;
  setCurrentTicket?: React.Dispatch<React.SetStateAction<CurrentTicket>>;
};

const TicketCard = ({
  ticket,
  isOwnedTicket,
  setIsModalOpen,
  setQrValue,
  setIsPrizeModalOpen,
  setRafflePrizes,
  setCurrentTicket,
}: TicketCardProps) => {
  const { data: session, status } = useSession();
  const userId = Number(session?.user.userId);

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

  const getPrizeWinner = (ticket: any): any => {
    return ticket?.event.raffles[0]?.rafflePrizes.find((prize: any) =>
      prize.rafflePrizeUser.find(
        (rafflePrizeUser: any) => rafflePrizeUser.userId === userId
      )
    );
  };

  const getPrizeNameByRafflePrizeId = (rId: number): any => {
    return ticket?.event.raffles[0]?.rafflePrizes.find(
      (prize: any) => prize.rafflePrizeId === rId
    );
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

  const isCheckedIn = (ticket: any): boolean | undefined => {
    // returns undefined if user has not been registered, true/false if reg-ed but not checked-in
    return ticket.userTicket.find(
      (userTicket: any) => userTicket.userId === userId
    )?.checkIn;
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
              {isOwnedTicket && isCheckedIn(ticket) && (
                <div className="flex">
                  <span className="flex h-fit items-center whitespace-nowrap rounded-full border-2 border-teal-100 bg-teal-100 px-2 py-px text-sm font-normal text-teal-500">
                    Checked In
                  </span>
                </div>
              )}
              {!isOwnedTicket && (
                <div className="flex w-20 gap-4">
                  {isPaused() && (
                    <span className="flex h-fit items-center whitespace-nowrap rounded-full border-2 border-red-100 bg-red-100 py-px px-2 text-sm font-normal text-red-500">
                      Sale Paused
                    </span>
                  )}
                  {isSoldOut() && (
                    <span className="flex h-fit items-center whitespace-nowrap rounded-full border-2 border-blue-100 bg-blue-100 px-2 py-px text-sm font-normal text-blue-600">
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
              <p className="text-md font-semibold text-blue-600">
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
                  if (
                    setIsPrizeModalOpen &&
                    setRafflePrizes &&
                    setCurrentTicket
                  ) {
                    setCurrentTicket({
                      eventName: ticket.event.eventName,
                      isCheckedIn: isCheckedIn(ticket) ?? false,
                      rafflePrizeWinner: getPrizeWinner(ticket) ?? undefined,
                      rafflePrizeName:
                        getPrizeNameByRafflePrizeId(
                          getPrizeWinner(ticket)?.rafflePrizeId
                        )?.name || "",
                    });

                    console.log("setting current ticket ->", {
                      eventName: ticket.event.eventName,
                      isCheckedIn: isCheckedIn(ticket) ?? false,
                      rafflePrizeWinner: getPrizeWinner(ticket) ?? undefined,
                      rafflePrizeName:
                        getPrizeNameByRafflePrizeId(
                          getPrizeWinner(ticket)?.rafflePrizeId
                        )?.name || "",
                    });
                    setRafflePrizes(getRafflePrizes(ticket));
                    setIsPrizeModalOpen(true);
                  }
                }}
                disabled={isPrizeClaimed(ticket)}
              >
                {isPrizeClaimed(ticket)
                  ? "Prize Claimed"
                  : getPrizeWinner(ticket)
                  ? "View Prize Won"
                  : "Spin the Wheel"}
              </Button>
            )}
            {isOwnedTicket && (
              <Button
                variant="solid"
                size="md"
                className="w-full sm:max-w-xs"
                onClick={() => {
                  if (setIsModalOpen && setQrValue && setCurrentTicket) {
                    setCurrentTicket({
                      eventName: ticket.event.eventName,
                      isCheckedIn: isCheckedIn(ticket) ?? false,
                      rafflePrizeWinner: getPrizeWinner(ticket) ?? undefined,
                      rafflePrizeName:
                        getPrizeNameByRafflePrizeId(
                          getPrizeWinner(ticket)?.rafflePrizeId
                        )?.name || "",
                    });

                    console.log("setting current ticket ->", {
                      eventName: ticket.event.eventName,
                      isCheckedIn: isCheckedIn(ticket) ?? false,
                      rafflePrizeWinner: getPrizeWinner(ticket) ?? undefined,
                      rafflePrizeName:
                        getPrizeNameByRafflePrizeId(
                          getPrizeWinner(ticket)?.rafflePrizeId
                        )?.name || "",
                    });
                    setQrValue(getQrString());
                    setIsModalOpen(true);
                  }
                }}
              >
                {!isCheckedIn(ticket)
                  ? "Generate QR Code"
                  : "View Digital Badge"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
