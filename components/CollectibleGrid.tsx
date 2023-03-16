import { Merchandise } from "@prisma/client";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Button from "./Button";
import { MerchandiseWithCollectionName } from "../utils/types";

type CollectibleGridItemProps = {
  item: MerchandiseWithCollectionName | Merchandise;
  collectedTab: boolean;
};

const CollectibleGridItem = ({
  item,
  collectedTab,
}: CollectibleGridItemProps) => {
  if (!item) return <Skeleton height={350} />;

  return (
    <div className="group rounded-lg p-2 text-sm hover:bg-gray-200">
      {!collectedTab ? (
        <div className="mb-2 flex w-full gap-3 text-gray-900">
          <progress
            className="progress h-4"
            value={item.totalMerchSupply - item.currMerchSupply}
            max={item.totalMerchSupply}
          />
          <span className="min-w-fit">
            {item.totalMerchSupply - item.currMerchSupply}/
            {item.totalMerchSupply} pieces left
          </span>
        </div>
      ) : null}

      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 transition-all">
        <Image
          fill
          sizes="100vw, (min-width: 640px) 50vw, (min-width: 1024px) 33vw, (min-width: 1536px) 25vw"
          className="object-cover object-center"
          src={item.image}
          alt="Collectible image"
        />

        <div className="absolute inset-x-0 top-0 flex h-full items-end justify-end overflow-hidden rounded-lg p-4">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
          />
          {collectedTab ? (
            <Button
              variant="solid"
              size="sm"
              className="relative rounded-full text-lg font-semibold text-white"
            >
              Collected
            </Button>
          ) : null}
        </div>
      </div>
      <h3 className="mt-4 font-medium text-gray-900">{item.name}</h3>
      {collectedTab ? (
        <p className="mt-2 text-sm text-gray-500">
          From{" "}
          {(item as MerchandiseWithCollectionName).collection.collectionName}
        </p>
      ) : null}
    </div>
  );
};

type CollectibleGridProps = {
  data: MerchandiseWithCollectionName[] | Merchandise[];
  collectedTab: boolean;
};
const CollectibleGrid = ({ data, collectedTab }: CollectibleGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-y-16 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 2xl:grid-cols-4">
      {data.map((item) => (
        <CollectibleGridItem
          key={item.merchId}
          item={item}
          collectedTab={collectedTab}
        />
      ))}
    </div>
  );
};

export default CollectibleGrid;
