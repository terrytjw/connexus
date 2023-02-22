import { useRouter } from "next/router";
import React from "react";
import { FaEdit, FaPauseCircle } from "react-icons/fa";
import Badge from "../Badge";

type CollectionTableProps = {
  data: any[]; // TODO: change type any to data type
  columns: string[];
  onEdit?: (index: number) => void;
};

const CollectionTable = ({ data, columns, onEdit }: CollectionTableProps) => {
  const router = useRouter();

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
            {onEdit ? (
              <th className="bg-blue-gray-200 text-gray-700"></th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {/* <!-- row 1 --> */}
          {data.map((data, index) => (
            <tr
              key={index}
              onClick={() =>
                onEdit ? router.push(`/merchandise/${data.collectionId}`) : null
              }
              className="cursor-pointer"
            >
              <td className="text-gray-700">{data.collectionId}</td>
              <td className="text-gray-700">{data.name}</td>
              <td className="text-gray-700">{data.description}</td>
              <td className="text-gray-700">{data.quantity}</td>
              <td className="text-gray-700">{data.price}</td>
              <td className="text-gray-700">
                {data.premiumChannel ? (
                  <Badge size="sm" label={data.premiumChannel.name} />
                ) : null}
              </td>

              {onEdit ? (
                <th className=" text-gray-700">
                  {/* note: these buttons display depending on tab a user is on */}
                  <div className="flex flex-row">
                    <button
                      className="btn-ghost btn-xs btn z-30"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(index);
                      }}
                    >
                      <FaEdit className="text-lg text-blue-600" />
                    </button>

                    <button
                      className="btn-ghost btn-xs btn"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <FaPauseCircle className="text-lg text-blue-600" />
                    </button>
                  </div>
                </th>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollectionTable;
