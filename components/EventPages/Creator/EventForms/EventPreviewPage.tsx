import React, { Dispatch, SetStateAction, useEffect } from "react";
import {
  FaCalendar,
  FaChevronLeft,
  FaFacebook,
  FaMapPin,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa";
import Avatar from "../../../Avatar";
import Badge from "../../../Badge";
import Banner from "../../../Banner";
import Button from "../../../Button";
import TicketCard from "../../TicketCard";
import { UseFormWatch } from "react-hook-form";
import { EventWithAllDetails } from "../../../../utils/types";
import { formatDate } from "../../../../utils/date-util";

type EventPreviewPageProps = {
  watch: UseFormWatch<EventWithAllDetails>;
  setIsPreview: Dispatch<SetStateAction<boolean>>;
};

const EventPreviewPage = ({ watch, setIsPreview }: EventPreviewPageProps) => {
  const {
    eventName,
    description,
    eventPic,
    bannerPic,
    startDate,
    endDate,
    category,
    tickets,
    address,
  } = watch();
  useEffect(() => {
    // scroll to ticket
    document.getElementById(`preview-alert`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }, []);
  return (
    <div>
      <main>
        {/* TODO: abstract out to Alert Component */}
        <div className="alert alert-info mb-8 text-xs shadow-lg sm:text-base">
          <div id="preview-alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-6 w-6 flex-shrink-0 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>You are viewing a preview page</span>
            <span
              className="link flex items-center gap-1 font-bold text-blue-600"
              onClick={() => setIsPreview(false)}
            >
              <FaChevronLeft /> Go Back
            </span>
          </div>
        </div>
        <div className="relative">
          <Banner coverImageUrl={bannerPic ? bannerPic : ""} />
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="relative z-30 -mt-12 sm:-mt-16">
            <Avatar imageUrl={eventPic ? eventPic : ""} />
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-3xl px-4 pb-12 sm:px-6 lg:px-8">
          <section>
            <div className="mt-4 flex flex-wrap justify-between">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-4xl">
                  {eventName}
                </h1>
                <h3 className="mt-4 text-gray-900">{description}</h3>
              </div>
              <Button variant="solid" size="md" className="max-w-xs" disabled>
                Register for Event
              </Button>
            </div>
          </section>

          <section>
            <h1 className="mt-12 text-xl font-semibold text-gray-900 sm:text-2xl">
              When and Where
            </h1>
            <div className="mt-8 flex justify-between">
              <div className="flex w-1/2">
                <FaCalendar className="h-6 w-6 text-blue-600" />
                <span className="sm:text-md ml-2 flex-col text-sm text-gray-900">
                  <p className="text-lg font-bold">Date and Time</p>
                  <p>
                    {formatDate(startDate)} - {formatDate(endDate)}
                  </p>
                </span>
              </div>

              <div className="flex w-1/2">
                <FaMapPin className="h-6 w-6 text-blue-600" />
                <span className="sm:text-md ml-2 flex-col text-sm text-gray-900">
                  <p className="text-lg font-bold">Location</p>
                  <p>{address?.locationName}</p>
                  <p>
                    {address?.address2} {address?.address1}
                  </p>
                  <p>{address?.postalCode}</p>
                </span>
              </div>
            </div>
          </section>

          <section>
            <h1 className="mt-12 text-xl font-semibold text-gray-900 sm:text-2xl">
              Ticket Options
            </h1>
            <div className="pt-6">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.ticketId} ticket={ticket} />
              ))}
            </div>
          </section>

          <section>
            <h1 className="mt-12 text-xl font-semibold text-gray-900 sm:text-2xl">
              Topics
            </h1>
            <div className="flex flex-wrap gap-6 py-4">
              {category.length === 0 && (
                <p className="text-gray-500">No Topics Selected</p>
              )}
              {category.map((label, index) => (
                <Badge
                  key={index}
                  className="text-white"
                  label={label}
                  size="lg"
                  selected={false}
                />
              ))}
            </div>
          </section>

          <section>
            <h1 className="mt-12 text-xl font-semibold text-gray-900 sm:text-2xl">
              Share through Social Media
            </h1>
            <div className="flex flex-wrap gap-4 py-4 text-gray-500">
              <FaFacebook className="h-6 w-6" />
              <FaTwitter className="h-6 w-6" />
              <FaTelegram className="h-6 w-6" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default EventPreviewPage;
