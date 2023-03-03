import { useRouter } from "next/router";
import React from "react";
import { FaEdit, FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import {
  pauseCollectionMint,
  startCollectionMint,
} from "../../lib/merchandise-helpers";
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
          {data?.map((item, index) => (
            <tr
              key={index}
              onClick={() =>
                onEdit ? router.push(`/merchandise/${item.collectionId}`) : null
              }
              className="cursor-pointer"
            >
              <td className="text-gray-700">{item.collectionId}</td>
              <td className="text-gray-700">{item.collectionName}</td>
              <td className="text-gray-700">{item.description}</td>
              <td className="text-gray-700">
                {item.merchandise.reduce(
                  (total: number, m: any) => total + m.totalMerchSupply,
                  0
                )}
              </td>
              <td className="text-gray-700">{item.merchandise[0].price}</td>
              <td className="text-gray-700">
                {item.premiumChannel ? (
                  <Badge size="sm" label={item.premiumChannel.name} />
                ) : (
                  <span className="ml-12">-</span>
                )}
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

                    {item.collectionState === "PAUSED" ? (
                      <button
                        className="btn-ghost btn-xs btn"
                        onClick={async (e) => {
                          e.stopPropagation();

                          await startCollectionMint(item.collectionId);
                        }}
                      >
                        <FaPlayCircle className="text-lg text-blue-600" />
                      </button>
                    ) : (
                      <button
                        className="btn-ghost btn-xs btn"
                        onClick={async (e) => {
                          e.stopPropagation();

                          await pauseCollectionMint(item.collectionId);
                        }}
                      >
                        <FaPauseCircle className="text-lg text-blue-600" />
                      </button>
                    )}
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
