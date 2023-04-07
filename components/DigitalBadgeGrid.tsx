import { Event, Merchandise, UserTicket } from "@prisma/client";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Button from "./Button";
import {
  MerchandiseWithCollectionName,
  TicketWithEvent,
  UserWithTicketsAndEvent,
} from "../utils/types";
import { truncateString } from "../utils/text-truncate";

type DigitalBadgeGridItemProps = {
  item: UserWithTicketsAndEvent;
  collectedTab: boolean;
};

const DigitalBadgeGridItem = ({
  item,
  collectedTab,
}: DigitalBadgeGridItemProps) => {
  if (!item) return <Skeleton height={350} />;

  const eventName = item.ticket.event.eventName;
  const eventDescription = item.ticket.event.description;

  return (
    <div className="group rounded-lg p-2 text-sm hover:bg-gray-200 hover:shadow-md">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 transition-all">
        <Image
          fill
          sizes="100vw, (min-width: 640px) 50vw, (min-width: 1024px) 33vw, (min-width: 1536px) 25vw"
          className="object-cover object-center"
          src={"/images/digital-badge.png"}
          alt="Digital Badge image"
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
      <h3 className="mt-4 text-xl font-bold text-gray-900">
        {truncateString(eventName, 20)}
      </h3>
      {/* {collectedTab && "collection" in item ? (
        <p className="mt-2 text-sm text-gray-500">
          From{" "}
          {(item as MerchandiseWithCollectionName).collection.collectionName}
        </p>
      ) : null} */}
      <p className="mt-2 text-sm text-gray-500">{eventDescription}</p>
    </div>
  );
};

type DigitalBadgeGridProps = {
  data: UserWithTicketsAndEvent[];
  collectedTab: boolean;
};
const DigitalBadgeGrid = ({ data, collectedTab }: DigitalBadgeGridProps) => {
  if (data.length === 0)
    return (
      <div className=" flex h-80 flex-col items-center justify-center gap-4 p-4 text-sm tracking-widest text-gray-400">
        No digital badges to show.
      </div>
    );

  return (
    <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
      {data.map((item) => (
        <DigitalBadgeGridItem
          key={item.userTicketId} // todo: replace with digital badge id
          item={item}
          collectedTab={collectedTab}
        />
      ))}
    </div>
  );
};

export default DigitalBadgeGrid;
