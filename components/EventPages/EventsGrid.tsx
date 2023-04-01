import Image from "next/image";
import React from "react";
import Button from "../Button";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { formatDate } from "../../utils/date-util";
import {
  likeEvent,
  registerEventClick,
  unlikeEvent,
} from "../../lib/api-helpers/event-api";
import { EventWithAllDetails } from "../../utils/types";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { truncateString } from "../../utils/text-truncate";

type CollectionGridItemProps = {
  isListed?: boolean;
  item: EventWithAllDetails;
  mutateTrendingEvents?: any;
  setSearchAndFilterResults?: any;
};
const CollectionGridItem = ({
  isListed,
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
      mutateTrendingEvents((data: EventWithAllDetails[]) => {
        data
          .find((event) => event.eventId == res.event)
          ?.userLikes.push({ userId: Number(userId) } as User);
        return data;
      });
    } else if (setSearchAndFilterResults) {
      setSearchAndFilterResults((prev: EventWithAllDetails[]) =>
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
      mutateTrendingEvents((data: EventWithAllDetails[]) => {
        data
          .find((event) => event.eventId === res.eventId)
          ?.userLikes.filter((like: User) => like.userId !== Number(userId));

        return data;
      });
    } else if (setSearchAndFilterResults) {
      setSearchAndFilterResults((prev: EventWithAllDetails[]) =>
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
    <div className="group rounded-lg p-2 text-sm hover:bg-gray-200 hover:shadow-md">
      <Link
        href={`/events/${item.eventId}`}
        className="group text-sm"
        onClick={async () => {
          await registerEventClick(item.eventId);
        }}
      >
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            fill
            sizes="100vw, (min-width: 640px) 50vw, (min-width: 1024px) 33vw, (min-width: 1536px) 25vw"
            className="object-cover object-center"
            src={item.eventPic || "/images/bear.jpg"}
            alt={item.eventName}
          />
          <div className="absolute inset-x-0 top-0 flex h-full items-end justify-between overflow-hidden rounded-lg p-4">
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black" />
            {/* TODO: Replace boolean with like check*/}
            {isListed && (
              <div className="relative ml-auto">
                {item.userLikes &&
                item.userLikes.find(
                  (user: User) => user.userId === Number(userId)
                ) ? (
                  <Button
                    size="md"
                    variant="solid"
                    className="!btn-circle relative rounded-full border-0 !bg-neutral-100 text-lg font-semibold !text-blue-600 hover:!bg-opacity-30"
                    onClick={async (e) => await handleUnlike(e)}
                  >
                    <FaHeart size={24} />
                  </Button>
                ) : (
                  <Button
                    size="md"
                    variant="outlined"
                    className=" !btn-circle relative rounded-full border-0 !bg-neutral-100 text-lg font-semibold text-blue-600 hover:!bg-opacity-30 "
                    onClick={async (e) => await handleLike(e)}
                  >
                    <FaRegHeart size={24} />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <h3 className="mt-4 text-xl font-bold text-gray-900">
          {truncateString(item.eventName, 20)}
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
      </Link>
    </div>
  );
};

type EventsGridProps = {
  isListed?: boolean;
  data: any[]; // todo: remove any type and set a proper type
  mutateTrendingEvents?: any;
  setSearchAndFilterResults?: any;
};
const EventsGrid = ({
  isListed,
  data,
  mutateTrendingEvents,
  setSearchAndFilterResults,
}: EventsGridProps) => {
  if (data.length === 0)
    return (
      <div className=" flex h-80 items-center justify-center p-4 text-sm tracking-widest text-gray-400">
        No events to show.
      </div>
    );
  return (
    <div className="grid grid-cols-1 gap-y-16 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
      {data.map((item) => (
        <CollectionGridItem
          isListed={isListed}
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
