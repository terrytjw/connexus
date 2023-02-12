import React from "react";
import {
  FaEdit,
  FaRegEdit,
  FaTrash,
  FaTrashAlt,
  FaUserEdit,
} from "react-icons/fa";
import Badge from "./Badge";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type EventsTableProps = {
  data: any[]; // TODO: change type any to data type
  columns: string[];
};

const EventsTable = ({ data, columns }: EventsTableProps) => {
  return (
    <div className="w-full overflow-x-auto ">
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
            <tr key={index}>
              <td className="bg-white text-gray-700">Reg no.</td>
              <td className="bg-white text-gray-700">Event Name</td>

              <td className="bg-white text-gray-700">{data?.startDate}</td>
              <td className="bg-white text-gray-700">no. of attendees</td>
              <td className="bg-white text-gray-700">{data?.location}</td>
              <td className="bg-white text-gray-700">
                <Badge size="sm" label="NFT" />
              </td>
              <td className="bg-white text-sm font-bold text-red-400">
                {data?.visibilityType}
              </td>
              <th className="bg-white text-gray-700">
                {/* note: these buttons display depending on tab a user is on */}
                <div className="flex flex-row">
                  <button className="btn-ghost btn-xs btn">
                    <FaEdit className="text-lg text-blue-600" />
                  </button>

                  <button className="btn-ghost btn-xs btn">
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
