import React from "react";
import { AttendeeListType } from "../../utils/types";
import Button from "../Button";
import { BiGift } from "react-icons/bi";
import {
  CheckInStatus,
  prizeSelection,
} from "../../pages/events/attendees/[id]";
import { RafflePrize, RafflePrizeUser } from "@prisma/client";

type AttendeesTableProps = {
  data: AttendeeListType[]; // replace this with prisma attendee user type
  columns: string[];
  setIsQrModalOpen: (value: boolean) => void;
  checkInStatus: CheckInStatus;
  isRaffleActivated: () => boolean | undefined;
  setIsPrizeModalOpen: (value: boolean) => void;
  setCurrentPrizeSelection: (value: prizeSelection) => void;
};

const AttendeesTable = ({
  data,
  columns,
  setIsQrModalOpen,
  checkInStatus,
  isRaffleActivated,
  setIsPrizeModalOpen,
  setCurrentPrizeSelection,
}: AttendeesTableProps) => {
  const getPrizeWinner = (attendee: any): any => {
    if (!attendee) return;
    return attendee.ticket.event.raffles[0]?.rafflePrizes.find((prize: any) =>
      prize.rafflePrizeUser.find(
        (rafflePrizeUser: any) => rafflePrizeUser.userId === attendee.userId
      )
    );
  };

  const getRafflePrizeUserFromRafflePrize = (
    rafflePrize: RafflePrize & { rafflePrizeUser: RafflePrizeUser[] },
    attendee: any
  ): RafflePrizeUser | undefined => {
    if (!rafflePrize) return;
    return rafflePrize.rafflePrizeUser.find(
      (rafflePrizeUser: RafflePrizeUser) =>
        rafflePrizeUser.userId === attendee.userId
    );
  };

  const getPrizeWon = (attendee: any, rafflePrizeId: number): any => {
    if (!attendee) return;
    return attendee.ticket.event.raffles[0]?.rafflePrizes.find(
      (prize: any) => prize.rafflePrizeId === rafflePrizeId
    );
  };

  const isPrizeClaimed = (attendee: any): boolean | undefined => {
    if (!attendee) return;
    return attendee.ticket.event.raffles[0]?.rafflePrizes.find(
      (prize: any) =>
        prize.rafflePrizeUser.find(
          (rafflePrizeUser: any) => rafflePrizeUser.userId === attendee.userId
        )?.isClaimed
    );
  };

  const hasEventStarted = (attendee: any): boolean | undefined => {
    if (!attendee) return;
    return attendee.ticket.event.raffles[0]?.isActivated;
  };

  return (
    <div className="w-full overflow-x-auto">
      {data.length === 0 ? (
        <div className=" flex h-80 flex-col items-center justify-center gap-4 p-4 text-sm tracking-widest text-gray-400">
          <span> No attendees to show. </span>
        </div>
      ) : (
        <table className="table w-full ">
          {/* <!-- head --> */}
          <thead>
            <tr>
              {columns.map((headerTitle, index) => (
                <th
                  className="bg-blue-gray-200 !relative text-gray-700"
                  key={index}
                >
                  {headerTitle}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* <!-- row 1 --> */}
            {data.map((data, index) => (
              <tr key={index}>
                <td className="text-gray-700">
                  <p className="flex items-center gap-x-2">
                    {data?.displayName}
                    {isRaffleActivated() && getPrizeWinner(data) && (
                      <div
                        className="tooltip tooltip-primary z-10"
                        data-tip={
                          !isPrizeClaimed(data)
                            ? "Verify prize claim!"
                            : "Prize claimed"
                        }
                      >
                        <Button
                          className="tooltip tooltip-primary border-0"
                          variant="outlined"
                          size="sm"
                          onClick={() => {
                            const winner = getPrizeWinner(data);
                            // find prize won
                            const rafflePrizeUser =
                              getRafflePrizeUserFromRafflePrize(winner, data);

                            if (
                              rafflePrizeUser?.rafflePrizeId &&
                              rafflePrizeUser?.rafflePrizeUserId &&
                              rafflePrizeUser?.userId
                            ) {
                              setCurrentPrizeSelection({
                                prizeName: getPrizeWon(
                                  data,
                                  winner.rafflePrizeId
                                )?.name,
                                rafflePrizeUserData: {
                                  rafflePrizeUserId:
                                    rafflePrizeUser?.rafflePrizeUserId,
                                  rafflePrizeId: rafflePrizeUser?.rafflePrizeId,
                                  isClaimed: true,
                                  userId: rafflePrizeUser?.userId,
                                },
                              });
                            }

                            setIsPrizeModalOpen(true);
                          }}
                          disabled={isPrizeClaimed(data)}
                        >
                          <BiGift
                            className={`${
                              !isPrizeClaimed(data)
                                ? "text-blue-600"
                                : "text-gray-500"
                            }`}
                            size={20}
                          />
                        </Button>
                      </div>
                    )}
                  </p>
                </td>
                <td className="text-gray-700">{data?.email}</td>

                <th className="text-gray-700">
                  {/* replace boolean with the field data?.checkIn */}
                  {data.checkIn ? (
                    <p className="ml-3 text-sm text-teal-500">Success</p>
                  ) : (
                    <Button
                      variant="outlined"
                      size="sm"
                      className="max-w-xs border-0"
                      onClick={async () => {
                        setIsQrModalOpen(true);
                      }}
                      disabled={
                        checkInStatus === CheckInStatus.LOADING ||
                        !hasEventStarted(data)
                      }
                    >
                      Scan QR code
                    </Button>
                  )}
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendeesTable;
