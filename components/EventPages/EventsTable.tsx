import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { TbClipboardText } from "react-icons/tb";
import Badge from "../Badge";
import Link from "next/link";
import { formatDate } from "../../utils/date-util";
import { truncateString } from "../../utils/text-truncate";
import router from "next/router";
import { CategoryType, Ticket } from "@prisma/client";
import { EventWithAllDetails } from "../../utils/types";
import { toast } from "react-hot-toast";
import Button from "../Button";

type EventsTableProps = {
  data: EventWithAllDetails[]; // TODO: change type any to data type
  columns: string[];
  setDeleteConfirmationModalOpen: (value: boolean) => void;
  setEventIdToDelete: (value: number) => void;
};

const EventsTable = ({
  data,
  columns,
  setDeleteConfirmationModalOpen,
  setEventIdToDelete,
}: EventsTableProps) => {
  const getTicketsSold = (tickets: Ticket[]) => {
    const currentTicketsSold = tickets.reduce((accumulator, ticket) => {
      return accumulator + ticket.currentTicketSupply;
    }, 0); // find cumulative sum of current ticket supply

    return currentTicketsSold;
  };

  const getTicketsRevenue = (tickets: Ticket[]) => {
    const ticketsRevenue = tickets.reduce((accumulator, ticket) => {
      return accumulator + ticket.currentTicketSupply * ticket.price;
    }, 0); // find cumulative sum of current ticket supply

    return ticketsRevenue;
  };

  const eventEnded = (event: EventWithAllDetails): boolean => {
    return new Date(event.endDate) < new Date();
  };

  if (data.length === 0)
    return (
      <div className=" flex h-80 flex-col items-center justify-center gap-4 p-4 text-sm tracking-widest text-gray-400">
        <span> No events to show. </span>{" "}
        <span> Start by creating an event!</span>
        <Button
          href="/events/create"
          variant="solid"
          size="md"
          className="max-w-xs !tracking-normal shadow-md"
        >
          Create Event
        </Button>
      </div>
    );

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
                // console.log("Row clicked");
                router.push(`/events/${data.eventId}`);
              }}
            >
              <td className="text-gray-700">
                {truncateString(data?.eventName, 20)}
              </td>

              <td className="text-gray-700">
                {`${formatDate(data.startDate)} - ${formatDate(data.endDate)}`}
              </td>
              <td className="text-gray-700">{data?.address?.locationName}</td>
              <td className="text-gray-700">{data?.maxAttendee}</td>
              <td className="text-gray-700">
                {getTicketsSold(data.tickets ?? [])}
              </td>
              <td className="text-gray-700">
                ${getTicketsRevenue(data.tickets ?? [])?.toFixed(2)}
              </td>

              <td className="text-gray-700">
                {data?.category.length === 0 && (
                  <p className="text-gray-500">No Tags Selected</p>
                )}
                {data?.category.map((label: CategoryType, index: number) => (
                  <Badge
                    key={index}
                    className="text-white"
                    label={label}
                    size="lg"
                    selected={false}
                  />
                ))}
              </td>
              <td className=" text-sm font-bold text-red-400">
                {data?.visibilityType}
              </td>
              <th className=" text-gray-700">
                {/* note: these buttons display depending on tab a user is on */}
                {!eventEnded(data) && (
                  <div className="flex flex-row">
                    <Link
                      href={`/events/attendees/${data.eventId}`}
                      onClick={async (e) => {
                        // prevent row on click
                        e.stopPropagation();
                      }}
                    >
                      <button className="btn-ghost btn-xs btn">
                        <TbClipboardText className="text-lg text-orange-300" />
                      </button>
                    </Link>

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
                        if (data.ticketURIs.length !== 0) {
                          toast.error(
                            "Cannot delete - event has at least 1 Attendee."
                          );
                          return;
                        }

                        setEventIdToDelete(data.eventId);
                        setDeleteConfirmationModalOpen(true);
                      }}
                    >
                      <FaTrashAlt className="text-lg text-red-400" />
                    </button>
                  </div>
                )}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;
