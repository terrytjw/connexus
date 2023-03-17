import React, { useState } from "react";
import TicketCard from "../../components/EventPages/TicketCard";

import { Ticket } from "@prisma/client";
import { FaChevronLeft } from "react-icons/fa";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { Event } from "@prisma/client";
import Modal from "../../components/Modal";
import { getTicketsOwned } from "../../lib/api-helpers/ticket-api";
import QRCode from "react-qr-code";
import Button from "../../components/Button";
import SpinWheel from "../../components/EventPages/SpinWheel";
import { getSession } from "next-auth/react";
import { getEventInfo } from "../../lib/api-helpers/event-api";
import { truncateString } from "../../utils/text-truncate";

type TicketsPageProps = {
  tickets: (Ticket & Partial<Event>)[];
};

const TicketsPage = ({ tickets }: TicketsPageProps) => {
  console.log("tickets ->", tickets);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [qrValue, setQrValue] = useState<string>("");
  const [isPrizeModalOpen, setIsPrizeModalOpen] = useState<boolean>(false);
  const prizes = [
    "better luck next time",
    "won 70",
    "won 10",
    "better luck next time",
    "won 2",
    "won uber pass",
    "better luck next time",
    "won a voucher",
  ];

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
            {tickets.map((ticket: Ticket & Partial<Event>) => (
              <div key={ticket.ticketId} className="mt-10">
                <Link href={`/events/${ticket.eventId}`}>
                  <h3 className="mb-4 text-xl font-bold text-blue-600">
                    {ticket.eventName}
                  </h3>
                </Link>
                <TicketCard
                  key={ticket.ticketId}
                  ticket={ticket}
                  isOwnedTicket={true} // render buttons
                  setIsModalOpen={setIsModalOpen}
                  setQrValue={setQrValue}
                  setIsPrizeModalOpen={setIsPrizeModalOpen}
                />
              </div>
            ))}
          </section>

          {/* QR Modal */}
          <Modal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            className="flex flex-col items-center"
          >
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-2xl font-bold sm:text-2xl">QR Code for</h2>
              <p className="text-xl">
                {truncateString(tickets[0].eventName, 40)}
              </p>
            </div>
            {/* <QRCodeCanvas value="https://reactjs.org/" /> */}
            <QRCode
              className="mt-4 flex items-center"
              size={128}
              value={qrValue}
            />
            <div className="mt-4 flex justify-end">
              <Button
                className="border-0"
                variant="outlined"
                size="md"
                onClick={() => setIsModalOpen(false)}
              >
                Done
              </Button>
            </div>
          </Modal>

          {/* Prize Modal */}
          <Modal
            isOpen={isPrizeModalOpen}
            setIsOpen={setIsPrizeModalOpen}
            className="flex min-w-fit flex-col items-center"
          >
            <h2 className="text-2xl font-bold sm:text-2xl">Spin the Wheel!</h2>

            <div className="flex justify-center align-middle">
              <SpinWheel prizes={prizes} />
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                className="border-0"
                variant="outlined"
                size="md"
                onClick={() => setIsPrizeModalOpen(false)}
              >
                Done
              </Button>
            </div>
          </Modal>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default TicketsPage;

// use axios GET method to fetch data
export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);
  const userId = session?.user?.userId;
  // build a ticket type with event name in it
  const ownedTickets = await getTicketsOwned(userId);

  // fetch events using eventIds
  const ownedTicketsWithEventName: Event[] = await Promise.all(
    ownedTickets.map(async (ticket: Ticket) => {
      const event = await getEventInfo(ticket.eventId);
      return { ...ticket, eventName: event.eventName };
    })
  );

  return {
    props: {
      tickets: ownedTicketsWithEventName,
    },
  };
};
