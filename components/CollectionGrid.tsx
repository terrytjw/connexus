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
    <Link href={item.href} className="group text-sm">
      <div className="relative w-full overflow-hidden rounded-lg bg-gray-100 transition-all group-hover:opacity-75">
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          width={500}
          height={500}
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
      <p className="italic text-gray-500">{item.availability}</p>
      <p className="mt-2 text-sm text-gray-500">{item.description}</p>
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
