import React, { useState } from "react";
import { AttendeeListType } from "../../utils/types";
import Button from "../Button";
import { checkIn } from "../../lib/api-helpers/event-api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Loading from "../Loading";
import { KeyedMutator } from "swr";
import { FaCheckCircle } from "react-icons/fa";

type AttendeesTableProps = {
  data: AttendeeListType[]; // replace this with prisma attendee user type
  columns: string[];
  mutateAttendees: any;
};

const AttendeesTable = ({
  data,
  columns,
  mutateAttendees,
}: AttendeesTableProps) => {
  const router = useRouter();
  const { id: eventId } = router.query;

  const { data: session, status } = useSession();
  const userId = Number(session?.user.userId);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className="w-full overflow-x-auto">
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
            <tr key={index} className="hover: cursor-pointer">
              <td className="text-gray-700">{data?.displayName}</td>
              <td className="text-gray-700">{data?.email}</td>

              <th className="text-gray-700">
                {/* replace boolean with the field data?.checkIn */}
                {data.checkIn ? (
                  <FaCheckCircle className="text-2xl text-green-500" />
                ) : (
                  <Button
                    variant="outlined"
                    size="sm"
                    className="max-w-xs border-0"
                    onClick={async () => {
                      setIsLoading(true);
                      const res = await checkIn(
                        Number(eventId),
                        data.ticket.ticketId, // only 1 ticket per user so just check in that one
                        data.userId
                      );
                      console.log(res);

                      mutateAttendees((data: AttendeeListType[]) => {
                        data.map((attendee) =>
                          attendee.userId == res.userId
                            ? { ...attendee, checkIn: true }
                            : attendee
                        );

                        return data;
                      });
                      setIsLoading(false);
                    }}
                    disabled={isLoading}
                  >
                    {!isLoading ? "Check In" : "Checking In ..."}
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
