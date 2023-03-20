import React from "react";
import { AttendeeListType } from "../../utils/types";
import Button from "../Button";
import { BiGift } from "react-icons/bi";
import {
  CheckInStatus,
  prizeSelection,
} from "../../pages/events/attendees/[id]";

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

  return (
    <div className="w-full overflow-x-auto">
      <table className="table w-full ">
        {/* <!-- head --> */}
        <thead>
          <tr>
            {columns.map((headerTitle, index) => (
              <th className="bg-blue-gray-200 text-gray-700" key={index}>
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
                      className="tooltip z-10"
                      data-tip={
                        !isPrizeClaimed(data)
                          ? "Click here to verify prize claim!"
                          : "Prize claimed"
                      }
                    >
                      <Button
                        className="tooltip  border-0"
                        variant="outlined"
                        size="sm"
                        onClick={() => {
                          const winner = getPrizeWinner(data);
                          console.log("winner ->", winner);
                          // find prize won

                          setCurrentPrizeSelection({
                            prizeName: getPrizeWon(data, winner.rafflePrizeId)
                              ?.name,
                            rafflePrizeUserData: {
                              rafflePrizeUserId: winner.rafflePrizeUserId,
                              rafflePrizeId: winner.rafflePrizeId,
                              isClaimed: true,
                              userId: winner.userId,
                            },
                          });
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
                    disabled={checkInStatus === CheckInStatus.LOADING}
                  >
                    Scan QR code
                  </Button>
                )}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendeesTable;
