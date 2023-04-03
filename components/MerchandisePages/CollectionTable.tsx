import { Merchandise } from "@prisma/client";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { FaEdit, FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import Badge from "../Badge";
import {
  CollectionWithMerchAndPremiumChannel,
  pauseCollectionMint,
  startCollectionMint,
} from "../../lib/api-helpers/collection-api";

type CollectionTableProps = {
  data: CollectionWithMerchAndPremiumChannel[];
  columns: string[];
  onEdit?: (index: number) => void;
  mutateOnSaleCollections?: any;
  mutatePausedCollections?: any;
};

const CollectionTable = ({
  data,
  columns,
  onEdit,
  mutateOnSaleCollections,
  mutatePausedCollections,
}: CollectionTableProps) => {
  const router = useRouter();
  const textColour = onEdit ? "text-gray-700" : "text-gray-300";

  if (data.length === 0)
    return (
      <div className=" flex h-80 flex-col items-center justify-center gap-4 p-4 text-sm tracking-widest text-gray-400">
        No collections to show.
      </div>
    );

  return (
    <div className="relative w-full overflow-x-auto">
      <table className="table w-full">
        {/* <!-- head --> */}
        <thead>
          <tr>
            {columns.map((headerTitle, index) => (
              <th
                className="bg-blue-gray-200 !relative text-gray-700"
                key={index}
              >
                {" "}
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
              <td className={textColour}>{item.collectionId}</td>
              <td className={textColour}>{item.collectionName}</td>
              <td className={textColour}>{item.description}</td>
              <td className={textColour}>
                {
                  onEdit
                    ? item.merchandise.reduce(
                        (total: number, m: Merchandise) =>
                          total + m.totalMerchSupply - m.currMerchSupply,
                        0
                      ) // returns quantity left
                    : item.merchandise.reduce(
                        (total: number, m: Merchandise) =>
                          total + m.totalMerchSupply,
                        0
                      ) // returns total quantity
                }
              </td>
              <td className={textColour}>${item.fixedPrice}</td>
              <td className={textColour}>
                {item.premiumChannel ? (
                  <Badge size="sm" label={item.premiumChannel.name} />
                ) : (
                  <span>-</span>
                )}
              </td>

              {onEdit ? (
                <th className={textColour}>
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
                          toast.dismiss();
                          e.stopPropagation();
                          await startCollectionMint(item.collectionId);

                          mutateOnSaleCollections();
                          mutatePausedCollections();
                          toast.success(
                            `Sale of ${item.collectionName} has been unpaused. The collection can be viewed in the ‘On Sale’ tab.`
                          );
                        }}
                      >
                        <FaPlayCircle className="text-lg text-blue-600" />
                      </button>
                    ) : (
                      <button
                        className="btn-ghost btn-xs btn"
                        onClick={async (e) => {
                          toast.dismiss();
                          e.stopPropagation();
                          await pauseCollectionMint(item.collectionId);

                          mutateOnSaleCollections();
                          mutatePausedCollections();
                          toast.success(
                            `Sale of ${item.collectionName} has been paused. The collection can be viewed in the ‘Paused’ tab.`
                          );
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
