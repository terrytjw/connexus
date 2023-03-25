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
import { GetServerSideProps } from "next";
import { Ticket, User, Address } from "@prisma/client";
import { EventWithAllDetails } from "../../utils/types";
import { formatDate } from "../../utils/date-util";
import { getSession } from "next-auth/react";
import { UserRoleContext } from "../../contexts/UserRoleProvider";

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

          <div className="z-30 mx-auto px-16">
            <div className="relative z-30 -mt-12 sm:-mt-16">
              <Avatar imageUrl={eventPic || "/images/bear.jpg"} />
            </div>
          </div>

          <div className="py-8 px-4 sm:px-12">
            <section>
              <div className="mt-4 flex flex-wrap justify-between">
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold sm:text-4xl">
                    {eventName || "event name"}
                  </h1>
                  <h3 className="mt-4">{description || "description"}</h3>
                </div>
                {/* not registered and not sold out */}
                {!isFan ? (
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
                      Register for event
                    </Button>
                  </Link>
                ) : isRegistered() ? (
                  // Registered (show this even if sold out)
                  <Button
                    disabled
                    variant="solid"
                    size="md"
                    className="max-w-xs"
                  >
                    Registered
                  </Button>
                ) : (
                  // Sold Out
                  <Button
                    disabled
                    variant="solid"
                    size="md"
                    className="max-w-xs"
                  >
                    Tickets Sold Out
                  </Button>
                )}
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
                      {formatDate(startDate)} - {formatDate(endDate)}
                    </p>
                  </span>
                </div>

                <div className="flex w-1/2">
                  <FaMapPin className="text-md" />
                  <span className="sm:text-md ml-2 flex-col text-sm">
                    <p className="font-bold">Location</p>
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
              <h1 className="mt-12 text-xl font-semibold sm:text-2xl ">
                Ticket Options (Types)
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
              <h1 className="mt-12 text-xl font-semibold sm:text-2xl">
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
              <h1 className="mt-12 text-xl font-semibold sm:text-2xl">
                Share through Social Media
              </h1>
              <div className="flex flex-wrap gap-4 py-4">
                <Link
                  href={getFacebookShareLink(event.eventPic)}
                  target="_blank"
                  className="hover:text-blue-500"
                >
                  <FaFacebook />
                </Link>
                <Link
                  href={getTwitterShareLink(event.eventPic)}
                  target="_blank"
                  className="hover:text-blue-500"
                >
                  <FaTwitter />
                </Link>
                <Link
                  href={getInstagramShareLink(event.eventPic)}
                  target="_blank"
                  className="hover:text-blue-500"
                >
                  <FaInstagram />
                </Link>
                <Link
                  href={getTelegramShareLink(event.eventPic)}
                  target="_blank"
                  className="hover:text-blue-500"
                >
                  <FaTelegram />
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

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);
  const userId = session?.user.userId;

  const { data: event } = await axios.get(
    `http://localhost:3000/api/events/${context.params?.id}`
  );

  const { data: userData } = await axios.get(
    `http://localhost:3000/api/users/${userId}`
  );

  return {
    props: {
      event,
      userData,
    },
  };
};
