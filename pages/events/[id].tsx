import TicketCard from "../../components/EventPages/TicketCard";
import React, { useContext } from "react";
import {
  FaCalendar,
  FaFacebook,
  FaInstagram,
  FaMapPin,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa";
import Avatar from "../../components/Avatar";
import Badge from "../../components/Badge";
import Banner from "../../components/Banner";
import Button from "../../components/Button";
import Link from "next/link";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import axios from "axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Ticket, User, Address } from "@prisma/client";
import { EventWithAllDetails } from "../../utils/types";
import { formatDate } from "../../utils/date-util";
import { getSession } from "next-auth/react";
import { UserRoleContext } from "../../contexts/UserRoleProvider";
import { API_URL } from "../../lib/constant";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

type EventPageProps = {
  event: EventWithAllDetails;
  userData: User & { tickets: Ticket[] };
};

const EventPage = ({ event, userData }: EventPageProps) => {
  console.log("event ->", event);
  const {
    eventId,
    eventName,
    description,
    bannerPic,
    eventPic,
    startDate,
    endDate,
    tickets,
    category,
  } = event;
  const { isFan } = useContext(UserRoleContext);

  const isEventCreator = (): boolean => {
    return userData.userId === event.creatorId;
  };

  const isRegistered = (): boolean => {
    console.log("user tickets ->", userData?.tickets);
    return !!userData.tickets?.find(
      (ticket: Ticket) => ticket.eventId === event.eventId
    );
  };

  const allTicketsSoldOut = (): boolean => {
    return event.tickets.every(
      (ticket) => ticket.currentTicketSupply === ticket.totalTicketSupply
    );
  };

  // will replace urls once its not localhost..
  function getFacebookShareLink(eventImageUrl: string | null) {
    // const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${eventImageUrl}`;
    return shareUrl;
  }

  function getTwitterShareLink(eventImageUrl: string | null) {
    // const url = encodeURIComponent(window.location.href);
    const message = encodeURIComponent("Check out this awesome page!");
    const shareUrl = `https://twitter.com/intent/tweet?url=${eventImageUrl}&text=${message}`;
    return shareUrl;
  }

  function getInstagramShareLink(eventImageUrl: string | null) {
    // const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.instagram.com/share?url=${eventImageUrl}`;
    return shareUrl;
  }

  function getTelegramShareLink(eventImageUrl: string | null) {
    // const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://t.me/share/url?url=${eventImageUrl}`;
    return shareUrl;
  }

  return (
    <ProtectedRoute>
      <Layout>
        <main>
          <div className="relative">
            <Banner coverImageUrl={bannerPic || "/images/bear.jpg"} />
          </div>

          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative z-30 -mt-12 sm:-mt-16">
              <Avatar imageUrl={eventPic || "/images/bear.jpg"} />
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
            <section>
              <div className="mt-4 flex flex-wrap justify-between">
                <div className="flex w-3/4 flex-grow-0 flex-col">
                  <h1 className="truncate text-4xl font-bold text-gray-900">
                    {eventName || "event name"}
                  </h1>
                  <h3 className="mt-4 flex-grow-0 text-gray-500">
                    {description || "description"}
                  </h3>
                </div>
                {/* not registered and not sold out */}
                {!isFan && isEventCreator() ? (
                  <Link
                    href={`/events/edit/${eventId}`}
                    className="mt-8 sm:mt-0"
                  >
                    <Button variant="solid" size="md" className="max-w-xs">
                      Edit Event
                    </Button>
                  </Link>
                ) : !isRegistered() && !allTicketsSoldOut() ? (
                  <Link
                    href={`/events/register/${eventId}`}
                    className="mt-8 sm:mt-0"
                  >
                    <Button variant="solid" size="md" className="max-w-xs">
                      Register for Event
                    </Button>
                  </Link>
                ) : isRegistered() ? (
                  // Registered (show this even if sold out)
                  <Button
                    disabled
                    variant="solid"
                    size="md"
                    className="mt-8 max-w-xs sm:mt-0"
                  >
                    Registered
                  </Button>
                ) : (
                  // Sold Out
                  <Button
                    disabled
                    variant="solid"
                    size="md"
                    className="mt-8 max-w-xs sm:mt-0"
                  >
                    Tickets Sold Out
                  </Button>
                )}
              </div>
            </section>

            <section>
              <h1 className="mt-12 text-xl font-semibold text-gray-900 sm:text-2xl">
                When and Where
              </h1>
              <div className="mt-8 flex justify-between">
                <div className="flex w-1/2 gap-2">
                  <FaCalendar className="h-6 w-6 text-blue-600" />
                  <span className="sm:text-md ml-2 flex-col text-sm text-gray-900">
                    <p className="text-lg font-bold">Date and Time</p>
                    <p>
                      {formatDate(startDate)} - {formatDate(endDate)}
                    </p>
                  </span>
                </div>

                <div className="flex w-1/2 gap-2">
                  <FaMapPin className="h-6 w-6 text-blue-600" />
                  <span className="sm:text-md ml-2 flex-col text-sm text-gray-900">
                    <p className="text-lg font-bold">Location</p>
                    <p>{event.address.locationName}</p>
                    <p>
                      {event.address.address2} {event.address.address1}
                    </p>
                    <p>{event.address.postalCode}</p>
                  </span>
                </div>
              </div>
            </section>

            <section>
              <h1 className="mt-12 text-xl font-semibold text-gray-900 sm:text-2xl">
                Ticket Options
              </h1>
              <div className="pt-6">
                {tickets.map((ticket: Ticket) => (
                  <TicketCard
                    key={ticket.ticketId}
                    ticket={ticket}
                    setIsModalOpen={() => {}}
                  />
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
              <div className="flex flex-wrap gap-4 py-4">
                <Link
                  href={getFacebookShareLink(event.eventPic)}
                  target="_blank"
                  className="text-gray-500 transition-all hover:text-blue-500"
                >
                  <FaFacebook className="h-6 w-6" />
                </Link>
                <Link
                  href={getTwitterShareLink(event.eventPic)}
                  target="_blank"
                  className="text-gray-500 transition-all hover:text-blue-500"
                >
                  <FaTwitter className="h-6 w-6" />
                </Link>
                {/* <Link
                  href={getInstagramShareLink(event.eventPic)}
                  target="_blank"
                  className="text-gray-500 transition-all hover:text-blue-500"
                >
                  <FaInstagram className="h-6 w-6" />
                </Link> */}
                <Link
                  href={getTelegramShareLink(event.eventPic)}
                  target="_blank"
                  className="text-gray-500 transition-all hover:text-blue-500"
                >
                  <FaTelegram className="h-6 w-6" />
                </Link>
              </div>
            </section>
          </div>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default EventPage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const userId = session?.user.userId;

  const { data: event } = await axios.get(
    `${API_URL}/events/${context.params?.id}`
  );

  const { data: userData } = await axios.get(`${API_URL}/users/${userId}`);

  return {
    props: {
      event,
      userData,
    },
  };
};
