import React from "react";
import Button from "./Button";
import { FaCalendar, FaHeart, FaMapPin, FaPersonBooth } from "react-icons/fa";
import Image from "next/image";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type CollectionGridProps = {
  data: any[];
  children?: React.ReactNode;
  // todo: remove any type and set a proper type
};

const EventsCollectionGrid = ({ data, children }: CollectionGridProps) => {
  return (
    <div className="mx-auto max-w-7xl overflow-hidden py-0 px-0 sm:py-0 sm:px-0 lg:px-2">
      <div className="gap-y-15 grid grid-cols-1 gap-x-6 sm:grid-cols-4">
        {data.map((data) => (
          <a
            key={data.id}
            href={`/events/${data.eventId}`}
            className="group mb-8 text-sm"
          >
            <div className="saspect-w-1 aspect-h-1 relative w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
              <Image
                src={data.images[0]}
                alt={data.imageAlt}
                className="h-full w-full object-cover object-center"
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
            <h3 className="mt-4 font-medium text-gray-900">{data.name}</h3>

            <span className="flex">
              <FaCalendar />
              <p className="ml-2 text-gray-500">{data.startDate}</p>
            </span>
            <span className="flex align-middle">
              <FaMapPin />
              <p className="ml-2 text-sm text-gray-500">{data.location}</p>
            </span>
            <span className="flex">
              <FaPersonBooth />
              <p className="ml-2 text-sm text-gray-500">
                Attendees long long long
              </p>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default EventsCollectionGrid;
