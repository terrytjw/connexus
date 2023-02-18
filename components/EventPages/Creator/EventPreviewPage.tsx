import { Ticket } from "@prisma/client";
import { format } from "date-fns";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction } from "react";
import { Control, UseFormWatch, useWatch } from "react-hook-form";
import {
  FaCalendar,
  FaChevronLeft,
  FaFacebook,
  FaFacebookMessenger,
  FaInstagram,
  FaMapPin,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa";
import Avatar from "../../../components/Avatar";
import Badge from "../../../components/Badge";
import Banner from "../../../components/Banner";
import Button from "../../../components/Button";
import { Event } from "../../../pages/events/create";

type EventPreviewPageProps = {
  formValues: Event;
  setIsPreview: Dispatch<SetStateAction<boolean>>;
};

const EventPreviewPage = ({
  formValues,
  setIsPreview,
}: EventPreviewPageProps) => {
  const router = useRouter();
  const { eid } = router.query;
  const {
    name,
    description,
    profilePic,
    bannerPic,
    tickets,
    startDateTime,
    endDateTime,
    venue,
    tags,
  } = formValues;

  return (
    <div>
      <main>
        {/* TODO: abstract out to Alert Component */}
        <div className="alert alert-info mb-8 shadow-lg">
          <div>
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
          <Banner
            coverImageUrl={bannerPic ? URL.createObjectURL(bannerPic) : ""}
          />
        </div>

        <div className="z-30 mx-auto px-16">
          <div className="relative z-30 -mt-12 sm:-mt-16">
            <Avatar
              imageUrl={profilePic ? URL.createObjectURL(profilePic) : ""}
            />
          </div>
        </div>

        <div className="py-8 px-4 sm:px-12">
          <section>
            <div className="mt-4 flex flex-wrap justify-between">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold sm:text-4xl">{name}</h1>
                <h3 className="mt-4">{description}</h3>
              </div>
              <Button variant="solid" size="md" className="max-w-xs">
                Register for event
              </Button>
            </div>
          </section>

          <section>
            <h1 className="mt-12 text-xl font-semibold sm:text-2xl">
              When and Where
            </h1>
            <div className="mt-8 flex justify-between">
              <div className="flex w-1/2">
                <FaCalendar className="text-md" />
                <span className="sm:text-md ml-2 flex-col text-sm">
                  <p className="font-bold">Date and Time</p>
                  <p>
                    {format(new Date(startDateTime), "PPPPpppp")} -
                    {format(new Date(endDateTime), "PPPPpppp")}
                  </p>
                </span>
              </div>

              <div className="flex w-1/2">
                <FaMapPin className="text-md" />
                <span className="sm:text-md ml-2 flex-col text-sm">
                  <p className="font-bold">Location</p>
                  {/* TODO: format address from address components */}
                  <p>{venue.venueName}</p>
                </span>
              </div>
            </div>
          </section>

          <section>
            {tickets.map((ticket, index) => (
              <TicketCard key={ticket.ticketId} ticket={ticket} />
            ))}
          </section>

          <section>
            <h1 className="mt-12 text-xl font-semibold sm:text-2xl">Topics</h1>
            <div className="flex flex-wrap gap-6 py-4">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  className="text-white"
                  label={tag}
                  size="lg"
                  selected={false}
                />
              ))}
            </div>
          </section>

          <section>
            <h1 className="mt-12 text-xl font-semibold sm:text-2xl">
              Share through Social Media
            </h1>
            <div className="flex flex-wrap gap-4 py-4">
              <FaFacebook />
              <FaTwitter />
              <FaInstagram />
              <FaFacebookMessenger />
              <FaTelegram />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default EventPreviewPage;

type TicketCardProps = {
  ticket: Ticket;
};

const TicketCard = ({ ticket }: TicketCardProps) => {
  return (
    <div>
      <h1 className="mt-12 text-xl font-semibold sm:text-2xl ">
        Ticket Options (Types)
      </h1>
      <div className="py-4 sm:py-8">
        <div className="center card flex items-center justify-between gap-6 border-2 border-gray-200 bg-white p-6 lg:card-side">
          <div className="flex flex-col gap-y-4">
            <h1 className="text-xl font-bold text-gray-700">{ticket.name}</h1>
            <span>
              <p className="text-md font-semibold text-blue-600">Ticket Type</p>
              <p className="text-sn text-gray-700">Premium</p>
            </span>
            <span>
              <p className="text-md font-semibold text-blue-600">Price</p>
              <p className="text-sn text-gray-700">${ticket.price}</p>
            </span>
            <span className="flex flex-col gap-4">
              <p className="text-md font-semibold text-gray-700">
                Sale Duration
              </p>
              <p className="text-sn text-gray-700">
                {format(new Date(ticket.startDate), "PPPPpppp")} -{" "}
                {format(new Date(ticket.endDate), "PPPPpppp")}
              </p>
            </span>

            <span className="mt-6 flex flex-col gap-4">
              <p className="text-md text-blue-600">
                Perks of owning this ticket:
              </p>
              <p className="text-sn text-gray-700">{ticket.description}</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
