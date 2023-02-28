import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Badge from "../Badge";
import axios from "axios";
import Link from "next/link";
import { formatDate } from "../../lib/date-util";
import { truncateString } from "../../lib/text-truncate";
import router from "next/router";
import { CategoryType } from "@prisma/client";
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type EventsTableProps = {
  data: any[]; // TODO: change type any to data type
  columns: string[];
};

const EventsTable = ({ data, columns }: EventsTableProps) => {
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
            <tr
              key={index}
              className="hover: cursor-pointer"
              onClick={(e) => {
                // prevent on click conflict between button and row
                const clickedElement = e.target as Element;
                if (clickedElement.tagName !== "BUTTON") {
                  // Handle row click event
                  // console.log("Row clicked");
                  router.push(`/events/${data.eventId}`);
                }
              }}
            >
              <td className="text-gray-700">
                {truncateString(data?.eventName, 20)}
              </td>

              <td className="text-gray-700">
                {`${formatDate(data.startDate)} - ${formatDate(data.endDate)}`}
              </td>
              <td className="text-gray-700">{data?.maxAttendee}</td>
              {/* TODO: replace when schema is updated */}
              <td className="text-gray-700">{data?.address?.locationName}</td>

              <td className="text-gray-700">
                {data?.category.length === 0 && (
                  <p className="text-gray-500">No Topics Selected</p>
                )}
                {data?.category.map((label: CategoryType, index: number) => (
                  // <div className="tooltip" data-tip={label}>
                  <Badge
                    key={index}
                    className="text-white"
                    label={label}
                    size="lg"
                    selected={false}
                  />
                  // </div>
                ))}{" "}
                ...
              </td>
              <td className=" text-sm font-bold text-red-400">
                {data?.visibilityType}
              </td>
              <th className=" text-gray-700">
                {/* note: these buttons display depending on tab a user is on */}
                <div className="flex flex-row">
                  <Link
                    href={`/events/edit/${data.eventId}`}
                    onClick={async (e) => {
                      // prevent row on click
                      e.stopPropagation();
                    }}
                  >
                    <button className="btn-ghost btn-xs btn">
                      <FaEdit className="text-lg text-blue-600" />
                    </button>
                  </Link>

                  <button
                    className="btn-ghost btn-xs btn"
                    onClick={async (e) => {
                      // prevent row on click
                      e.stopPropagation();
                      await axios.delete(
                        `http://localhost:3000/api/events/${data.eventId}`
                      );
                      // console.log("Event Deleted");
                      router.reload();
                    }}
                  >
                    <FaTrashAlt className="text-lg text-red-400" />
                  </button>
                </div>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;
