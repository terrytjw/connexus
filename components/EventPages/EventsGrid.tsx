import Image from "next/image";
import React from "react";
import Button from "../Button";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaAddressCard, FaHeart, FaRegHeart } from "react-icons/fa";
import { formatDate } from "../../utils/date-util";
import { likeEvent, unlikeEvent } from "../../lib/api-helpers/event-api";
import { EventWithTicketsandAddress } from "../../utils/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

type CollectionGridItemProps = {
  item: EventWithTicketsandAddress;
};
const CollectionGridItem = ({ item }: CollectionGridItemProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user.userId;

  if (!item) return <Skeleton height={350} />;

  const isEventLiked = (): boolean => {
    return item?.userLikes.find((event: any) => {});
  };

  return (
    <Link href={`/events/${item.eventId}`} className="group text-sm">
      <div>
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
            {/* TODO: Replace boolean with like check*/}
            {false ? (
              <Button
                size="sm"
                variant="solid"
                className="!btn-circle relative ml-auto rounded-full border-0 !bg-transparent text-lg font-semibold !text-blue-600"
                onClick={async (e) => {
                  // prevent parent link navigation on click
                  e.preventDefault();
                  await unlikeEvent(item.eventId, Number(userId));
                  // mutate events
                }}
              >
                <FaHeart size={24} />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outlined"
                className="!btn-circle relative ml-auto rounded-full border-0 text-lg font-semibold text-white hover:bg-blue-600 hover:bg-opacity-30 hover:text-blue-500"
                onClick={async (e) => {
                  // prevent parent link navigation on click
                  e.preventDefault();
                  await likeEvent(item.eventId, Number(userId));

                  // mutate
                  console.log("liking event");
                }}
              >
                <FaRegHeart size={24} />
              </Button>
            )}
          </div>
        </div>

        <h3 className="mt-4 text-xl font-bold text-gray-900">
          {item.eventName}
        </h3>
        <p className="mt-2 text-base font-semibold text-gray-500">
          {formatDate(item.startDate)} - {formatDate(item.endDate)}
        </p>
        <div className="mt-2 flex flex-col text-sm font-normal">
          <span>{item?.address?.locationName}</span>
          <span>{item?.address?.address1}</span>
          {/* {item?.address?.address1} */}
          {/* <span>{item?.address?.postalCode}</span> */}
        </div>

        <p className="text-s mt-2 font-semibold text-blue-600">
          {item.maxAttendee} attendees
        </p>
        {/* </Link> */}
      </div>
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
        <CollectionGridItem key={item.eventId} item={item} />
      ))}
    </div>
  );
};

export default EventsGrid;
