import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { TbClipboardText } from "react-icons/tb";
import Badge from "../Badge";
import axios from "axios";
import Link from "next/link";
import { formatDate } from "../../utils/date-util";
import { truncateString } from "../../utils/text-truncate";
import router from "next/router";
import { CategoryType, Ticket, User } from "@prisma/client";
import { EventWithTicketsandAddress } from "../../utils/types";
import Button from "../Button";
import { checkIn } from "../../lib/api-helpers/event-api";
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type AttendeesTableProps = {
  data: User[]; // replace this with prisma attendee user type
  columns: string[];
};

const AttendeesTable = ({ data, columns }: AttendeesTableProps) => {
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
            <th className="bg-blue-gray-200 text-gray-700"></th>
          </tr>
        </thead>
        <tbody>
          {/* <!-- row 1 --> */}
          {data.map((data, index) => (
            <tr key={index} className="hover: cursor-pointer">
              <td className="text-gray-700">{data.userId}</td>

              <td className="text-gray-700">{data?.displayName}</td>
              <td className="text-gray-700">{data?.email}</td>

              <th className=" text-gray-700">
                {data?.checkIn ? (
                  "Checked In"
                ) : (
                  <Button
                    variant="outlined"
                    size="md"
                    className="max-w-xs"
                    onClick={async () => {
                      const res = await checkIn(1, 1, 4);
                      console.log(res);
                    }}
                  >
                    Check In
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
