import React, { useEffect, useState } from "react";
import TicketCard from "../../components/EventPages/TicketCard";

import { FaChevronLeft } from "react-icons/fa";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import Link from "next/link";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Modal from "../../components/Modal";
import { getTicketsOwned } from "../../lib/api-helpers/ticket-api";
import QRCode from "react-qr-code";
import Button from "../../components/Button";
import SpinWheel from "../../components/EventPages/SpinWheel";
import { getSession } from "next-auth/react";
import { truncateString } from "../../utils/text-truncate";
import { toast, Toaster } from "react-hot-toast";
import { TicketWithEvent } from "../../utils/types";
import Confetti from "react-confetti";
import { Ticket } from "@prisma/client";
import { BiGift } from "react-icons/bi";
import DigitalBadge from "../../components/EventPages/DigitalBadge";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

type TicketsPageProps = {
  tickets: TicketWithEvent[];
};

export type CurrentTicket = Partial<Ticket> & {
  eventName: string;
  rafflePrizeWinner: any;
  rafflePrizeName: string;
  isCheckedIn: boolean;
};

const TicketsPage = ({ tickets }: TicketsPageProps) => {
  console.log("tickets ->", tickets);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [qrValue, setQrValue] = useState<string>("");
  const [isPrizeModalOpen, setIsPrizeModalOpen] = useState<boolean>(false);
  const [rafflePrizes, setRafflePrizes] = useState<any[]>([]);
  const [currentTicket, setCurrentTicket] = useState<CurrentTicket>({
    eventName: "",
    rafflePrizeWinner: undefined,
    rafflePrizeName: "",
    isCheckedIn: false,
  });

  useEffect(() => {
    if (currentTicket.rafflePrizeWinner)
      toast.success("Congrats, you won something!!!");
  }, [currentTicket.rafflePrizeWinner]);

  function isEmpty(obj: any) {
    return Object.keys(obj).length === 0;
  }

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

          {tickets.length === 0 ? (
            <div className="-mt-48 flex h-screen flex-col items-center justify-center gap-4 p-4 text-sm tracking-widest text-gray-400">
              <span> No tickets to show. </span>{" "}
              <span> Start by registering for an event!</span>
              <Button
                href="/events"
                variant="solid"
                size="md"
                className="max-w-xs !tracking-normal shadow-md"
              >
                Browse events
              </Button>
            </div>
          ) : (
            <section>
              {tickets.map((ticket: TicketWithEvent) => (
                <div key={ticket.ticketId} className="mt-10">
                  <Link href={`/events/${ticket.eventId}`}>
                    <h3 className="mb-4 text-xl font-semibold text-gray-500">
                      {ticket.event.eventName}
                    </h3>
                  </Link>
                  <TicketCard
                    key={ticket.ticketId}
                    ticket={ticket}
                    isOwnedTicket={true} // render buttons
                    setIsModalOpen={setIsModalOpen}
                    setQrValue={setQrValue}
                    setIsPrizeModalOpen={setIsPrizeModalOpen}
                    setRafflePrizes={setRafflePrizes}
                    setCurrentTicket={setCurrentTicket}
                  />
                </div>
              ))}
            </section>
          )}
          {/* Tickets */}

          {/* QR and Digital Badge Modal */}
          <Modal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            className="flex flex-col items-center"
          >
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-2xl font-bold sm:text-2xl">
                {!currentTicket.isCheckedIn ? "QR Code" : "Digital Badge"} for
              </h2>
              <p className="text-xl">
                {truncateString(currentTicket?.eventName ?? "", 40)}
              </p>
            </div>
            {!currentTicket.isCheckedIn ? (
              <QRCode
                className="mt-4 flex items-center"
                size={128}
                value={qrValue}
              />
            ) : (
              <div className="mt-4 flex w-full justify-center rounded-lg bg-sky-100 p-8">
                <DigitalBadge imageUrl={"/images/digital-badge.png"} />
              </div>
            )}

            <div className="mt-2 flex justify-end">
              <Button
                className="border-0"
                variant="outlined"
                size="md"
                onClick={() => setIsModalOpen(false)}
              >
                Done
              </Button>
            </div>
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  background: "#FFFFFF",
                  color: "#34383F",
                  textAlign: "center",
                },
              }}
            />
          </Modal>
          {/* Prize Modal */}
          <Modal
            isOpen={isPrizeModalOpen}
            setIsOpen={setIsPrizeModalOpen}
            className="flex flex-col items-center sm:min-w-fit"
          >
            <h2 className="text-2xl font-bold sm:text-2xl">
              {!isEmpty(currentTicket.rafflePrizeWinner ?? {})
                ? "You Won"
                : "Spin the Wheel!"}
            </h2>
            {!isEmpty(currentTicket.rafflePrizeWinner ?? {}) && (
              <p className="text-xl">{currentTicket.rafflePrizeName}</p>
            )}
            {currentTicket.rafflePrizeWinner && <Confetti />}
            <div className="flex justify-center align-middle">
              {/* check if rafflePrizeWinner is an empty object */}
              {!isEmpty(currentTicket.rafflePrizeWinner ?? {}) ? (
                <BiGift className="mt-12 text-blue-600" size={120} />
              ) : (
                <SpinWheel
                  prizes={rafflePrizes}
                  size={200}
                  setCurrentTicket={setCurrentTicket}
                />
              )}
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
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  background: "#FFFFFF",
                  color: "#34383F",
                  textAlign: "center",
                },
              }}
            />
          </Modal>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default TicketsPage;

// use axios GET method to fetch data
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const userId = session?.user?.userId;
  // build a ticket type with event name in it
  const ownedTickets = await getTicketsOwned(parseInt(userId ?? "0"));

  return {
    props: {
      tickets: ownedTickets,
    },
  };
};
