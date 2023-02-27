import TicketCard from "../../components/EventPages/TicketCard";
import { useRouter } from "next/router";
import React from "react";
import {
  FaCalendar,
  FaFacebook,
  FaFacebookMessenger,
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
import { GetStaticPaths, GetStaticProps } from "next";
import { isValid, format } from "date-fns";
import { Ticket } from "@prisma/client";
import { EventWithTicketsandAddress } from "../../utils/types";

type EventPageProps = {
  event: EventWithTicketsandAddress;
};

const EventPage = ({ event }: EventPageProps) => {
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

  console.log(event);
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
                <Link href={`/events/register/${eventId}`}>
                  <Button variant="solid" size="md" className="max-w-xs">
                    Register for event
                  </Button>
                </Link>
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
                      {`${
                        isValid(startDate)
                          ? format(startDate, "PPPPpppp")
                          : format(new Date(startDate), "PPPPpppp")
                      } -
                          ${
                            isValid(endDate)
                              ? format(endDate, "PPPPpppp")
                              : format(new Date(endDate), "PPPPpppp")
                          }`}
                    </p>
                  </span>
                </div>

                <div className="flex w-1/2">
                  <FaMapPin className="text-md" />
                  <span className="sm:text-md ml-2 flex-col text-sm">
                    <p className="font-bold">Location</p>
                    <p>
                      Marina Bay Sands 10 Bayfront Avenue Street, Singapore
                      018956
                    </p>
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
                  <TicketCard key={ticket.ticketId} ticket={ticket} />
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
                <FaFacebook />
                <FaTwitter />
                <FaInstagram />
                <FaFacebookMessenger />
                <FaTelegram />
              </div>
            </section>
          </div>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default EventPage;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: "1" } }, { params: { id: "2" } }],
    fallback: true, // Set to true if there are more dynamic routes to be added later
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // use axios GET method to fetch data
  const { data: event } = await axios.get(
    `http://localhost:3000/api/events/${params?.id}`
  );

  return {
    props: {
      event,
    },
  };
};
