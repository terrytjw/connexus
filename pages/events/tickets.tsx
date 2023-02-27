import React from "react";
import TicketCard from "../../components/EventPages/TicketCard";

import { getSession } from "next-auth/react";
import { Ticket } from "@prisma/client";
import { FaChevronLeft } from "react-icons/fa";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import Link from "next/link";
import { GetServerSideProps } from "next";
import axios from "axios";
import { Event } from "@prisma/client";

type TicketsPageProps = {
  tickets: Ticket[] & Partial<Event>;
};

const TicketsPage = ({ tickets }: TicketsPageProps) => {
  console.log("tickets ->", tickets);
  return (
    <ProtectedRoute>
      <Layout>
        <main className="py-12 px-4 sm:px-12">
          {/* Header */}
          <nav className="flex items-center gap-6">
            <Link href="/events">
              <FaChevronLeft className="text-lg text-blue-600 hover:cursor-pointer sm:text-xl" />
            </Link>
            <h2 className="text-2xl font-bold sm:text-4xl">My Tickets</h2>
          </nav>
          <section>
            <div className="pt-6">
              {tickets.map((ticket: Ticket & Partial<Event>) => (
                <div key={ticket.ticketId}>
                  <h3 className="mb-4 text-xl font-bold text-gray-800">
                    {ticket.eventName}
                  </h3>
                  <TicketCard key={ticket.ticketId} ticket={ticket} />
                </div>
              ))}
            </div>
          </section>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default TicketsPage;

// use axios GET method to fetch data
export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);
  const userId = session?.user.userId;

  // use axios GET method to fetch data
  const { data: userData } = await axios.get(
    `http://localhost:3000/api/users/${userId}`
  );

  const getEventFromTicket = async (eventId: string) => {
    const { data: event } = await axios.get(
      `http://localhost:3000/api/events/${eventId}`
    );
    return event;
  };

  // build a ticket type with event name in it
  const parsedTickets = await Promise.all(
    userData.tickets.map(async (ticket: Ticket) => {
      const eventData = await getEventFromTicket(ticket.eventId.toString());
      return { ...ticket, eventName: eventData?.eventName };
    })
  );

  return {
    props: {
      tickets: parsedTickets,
    },
  };
};
