import Image from "next/image";
import React from "react";
import Button from "../Button";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaHeart } from "react-icons/fa";
import { formatDate } from "../../lib/date-util";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type CollectionGridItemProps = {
  item: any; // todo: remove any type and set a proper type
};
const CollectionGridItem = ({ item }: CollectionGridItemProps) => {
  if (!item) return <Skeleton height={350} />;

  return (
    <Link href={`/events/${item.eventId}`} className="group text-sm">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
        <Image
          src={item.eventPic || "/images/bear.jpg"}
          alt={item.eventName}
          className="w-full object-cover object-center"
          width={100}
          height={100}
        />
        <div className="absolute inset-x-0 top-0 flex h-full items-end justify-between overflow-hidden rounded-lg p-4">
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50" />
          <Button
            variant="solid"
            size="sm"
            className="relative ml-auto rounded-full text-lg font-semibold text-white"
          >
            <FaHeart />
          </Button>
        </div>
      </div>

      <h3 className="mt-4 text-xl font-bold text-gray-900">{item.eventName}</h3>
      <p className="mt-2 text-base font-semibold text-gray-500">
        {formatDate(item.startDate)} - {formatDate(item.endDate)}
      </p>
      <div className="mt-2 text-sm font-normal">
        <span>{item?.address?.locationName}</span>
      </div>

      <p className="text-s mt-2 font-semibold text-blue-600">
        {item.maxAttendee} attendees
      </p>
    </Link>
  );
};

type EventsGridProps = {
  data: any[]; // todo: remove any type and set a proper type
};
const EventsGrid = ({ data }: EventsGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-y-16 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
      {data.map((item) => (
        <CollectionGridItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default EventsGrid;
