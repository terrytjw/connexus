import Image from "next/image";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Button from "./Button";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type CollectibleGridItemProps = {
  item: any; // todo: remove any type and set a proper type
  collectedTab: boolean;
};

const CollectibleGridItem = ({
  item,
  collectedTab,
}: CollectibleGridItemProps) => {
  if (!item) return <Skeleton height={350} />;

  return (
    <div className="group text-sm">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 transition-all">
        <Image
          fill
          sizes="100vw, (min-width: 640px) 50vw, (min-width: 1024px) 33vw, (min-width: 1536px) 25vw"
          className="object-cover object-center"
          src={item.image}
          alt="Collectible image"
        />

        {!collectedTab ? (
          <div className="absolute flex w-full gap-3 p-3 text-gray-900">
            <progress className="progress h-4" value="80" max="100" />
            <span className="min-w-fit">80/100 pieces left</span>
          </div>
        ) : null}

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
        <p className="mt-2 text-sm text-gray-500">From {item.collectionName}</p>
      ) : null}
    </div>
  );
};

type CollectibleGridProps = {
  data: any[]; // todo: remove any type and set a proper type
  collectedTab: boolean;
};
const CollectibleGrid = ({ data, collectedTab }: CollectibleGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-y-16 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
      {data.map((item) => (
        <CollectibleGridItem
          key={item.collectibleId}
          item={item}
          collectedTab={collectedTab}
        />
      ))}
    </div>
  );
};

export default CollectibleGrid;
