import React from "react";
import { AttendeeListType } from "../../utils/types";
import Button from "../Button";
import { BiGift } from "react-icons/bi";
import { CheckInStatus } from "../../pages/events/attendees/[id]";

type AttendeesTableProps = {
  data: AttendeeListType[]; // replace this with prisma attendee user type
  columns: string[];
  setIsQrModalOpen: (value: boolean) => void;
  checkInStatus: CheckInStatus;
  setIsPrizeModalOpen: (value: boolean) => void;
};

const AttendeesTable = ({
  data,
  columns,
  setIsQrModalOpen,
  checkInStatus,
  setIsPrizeModalOpen,
}: AttendeesTableProps) => {
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
            <tr key={index} className="hover: cursor-pointer">
              <td className="text-gray-700">
                <p className="flex items-center gap-x-1">
                  {data?.displayName}
                  <div
                    className="tooltip"
                    data-tip="Click here to verify prize claim!"
                  >
                    <Button
                      className="tooltip border-0"
                      variant="outlined"
                      size="sm"
                      onClick={() => setIsPrizeModalOpen(true)}
                    >
                      <BiGift className="text-blue-600" size={20} />
                    </Button>
                  </div>
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
