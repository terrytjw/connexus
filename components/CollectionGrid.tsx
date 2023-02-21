import Image from "next/image";
import React from "react";
import Button from "./Button";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type CollectionGridItemProps = {
  item: any; // todo: remove any type and set a proper type
};
const CollectionGridItem = ({ item }: CollectionGridItemProps) => {
  if (!item) return <Skeleton height={350} />;

  return (
    <Link href={`/merchandise/${item.collectionId}`} className="group text-sm">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 transition-all group-hover:opacity-75">
        <Image
          fill
          sizes="100vw, (min-width: 640px) 50vw, (min-width: 1024px) 33vw, (min-width: 1536px) 25vw"
          className="object-cover object-center"
          src={item.collectibles[0].image}
          alt="Collection image"
        />
        <div className="absolute inset-x-0 top-0 flex h-full items-end justify-between overflow-hidden rounded-lg p-4">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
          />
          <p className="relative text-lg font-semibold text-white">
            {item.price}
          </p>
          <Button
            variant="solid"
            size="sm"
            className="relative rounded-full text-lg font-semibold text-white"
          >
            Buy
          </Button>
        </div>
      </div>
      <h3 className="mt-4 font-medium text-gray-900">{item.name}</h3>
      <p className="mt-2 text-sm text-gray-500">{item.description}</p>
      {item.premiumChannel ? (
        <div className="mt-2 text-sm font-semibold text-blue-600">
          Linked to{" "}
          <span className="underline">{item.premiumChannel.name}</span>
        </div>
      ) : (
        <div className="mt-2 text-sm font-semibold text-red-500">
          Not Linked
        </div>
      )}
    </Link>
  );
};

type CollectionGridProps = {
  data: any[]; // todo: remove any type and set a proper type
};
const CollectionGrid = ({ data }: CollectionGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-y-16 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
      {data.map((item) => (
        <CollectionGridItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default CollectionGrid;
