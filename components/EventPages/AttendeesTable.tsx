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
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type AttendeesTableProps = {
  data: User[];
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
              <td className="text-gray-700">placeholder status</td>

              <th className=" text-gray-700">
                {/* note: these buttons display depending on tab a user is on */}
                <Button
                  href="/events/create"
                  variant="solid"
                  size="md"
                  className="max-w-xs shadow-md"
                >
                  Send Badge
                </Button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendeesTable;
