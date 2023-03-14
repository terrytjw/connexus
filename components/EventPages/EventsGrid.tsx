import Image from "next/image";
import React from "react";
import Button from "../Button";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { formatDate } from "../../utils/date-util";
import { likeEvent, unlikeEvent } from "../../lib/api-helpers/event-api";
import { EventWithTicketsandAddress } from "../../utils/types";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";

type CollectionGridItemProps = {
  item: EventWithTicketsandAddress;
  mutateTrendingEvents?: any;
  setSearchAndFilterResults?: any;
};
const CollectionGridItem = ({
  item,
  mutateTrendingEvents,
  setSearchAndFilterResults,
}: CollectionGridItemProps) => {
  const { data: session } = useSession();
  const userId = session?.user.userId;

  if (!item) return <Skeleton height={350} />;

  const handleLike = async (e: any) => {
    // prevent parent link navigation on click
    e.preventDefault();
    const res = await likeEvent(item.eventId, Number(userId));

    // mutate
    console.log("liking event -> ", res);
    if (mutateTrendingEvents) {
      mutateTrendingEvents((data: EventWithTicketsandAddress[]) => {
        data
          .find((event) => event.eventId == res.event)
          ?.userLikes.push({ userId: Number(userId) } as User);
        return data;
      });
    } else if (setSearchAndFilterResults) {
      setSearchAndFilterResults((prev: EventWithTicketsandAddress[]) =>
        prev.map((event) =>
          event.eventId === item.eventId
            ? {
                ...event,
                userLikes: [
                  ...event.userLikes,
                  {
                    userId: Number(userId),
                  },
                ],
              }
            : event
        )
      );
    }
  };

  const handleUnlike = async (e: any) => {
    // prevent parent link navigation on click
    e.preventDefault();
    const res = await unlikeEvent(item.eventId, Number(userId));
    // mutate events
    console.log("UNliking event");
    if (mutateTrendingEvents) {
      mutateTrendingEvents((data: EventWithTicketsandAddress[]) => {
        data
          .find((event) => event.eventId === res.eventId)
          ?.userLikes.filter((like: User) => like.userId !== Number(userId));

        return data;
      });
    } else if (setSearchAndFilterResults) {
      setSearchAndFilterResults((prev: EventWithTicketsandAddress[]) =>
        prev.map((event) =>
          event.eventId === item.eventId
            ? {
                ...event,
                userLikes: event.userLikes.filter(
                  (like: User) => like.userId !== Number(userId)
                ),
              }
            : event
        )
      );
    }
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
            {item.userLikes &&
            item.userLikes.find(
              (user: User) => user.userId === Number(userId)
            ) ? (
              <Button
                size="md"
                variant="solid"
                className="!btn-circle relative ml-auto rounded-full border-0 !bg-neutral-100 text-lg font-semibold !text-blue-600 hover:!bg-opacity-30"
                onClick={async (e) => await handleUnlike(e)}
              >
                <FaHeart size={24} />
              </Button>
            ) : (
              <Button
                size="md"
                variant="outlined"
                className=" !btn-circle relative ml-auto rounded-full border-0 !bg-neutral-100 text-lg font-semibold text-blue-600 hover:!bg-opacity-30 "
                onClick={async (e) => await handleLike(e)}
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
  mutateTrendingEvents?: any;
  setSearchAndFilterResults?: any;
};
const EventsGrid = ({
  data,
  mutateTrendingEvents,
  setSearchAndFilterResults,
}: EventsGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-y-16 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
      {data.map((item) => (
        <CollectionGridItem
          key={item.eventId}
          item={item}
          mutateTrendingEvents={mutateTrendingEvents}
          setSearchAndFilterResults={setSearchAndFilterResults}
        />
      ))}
    </div>
  );
};

export default EventsGrid;
