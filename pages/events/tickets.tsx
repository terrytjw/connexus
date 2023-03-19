import React, { useEffect, useState } from "react";
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
import { toast, Toaster } from "react-hot-toast";
import { TicketWithEvent } from "../../utils/types";
import { saveRafflePrizeUser } from "../../lib/prisma/raffle-prisma";
import { insertRafflePrize } from "../../lib/api-helpers/user-api";

type TicketsPageProps = {
  tickets: TicketWithEvent[];
};

const TicketsPage = ({ tickets }: TicketsPageProps) => {
  console.log("tickets ->", tickets);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [qrValue, setQrValue] = useState<string>("");
  const [isPrizeModalOpen, setIsPrizeModalOpen] = useState<boolean>(false);
  const [checkedIn, setCheckedIn] = useState<boolean>(false);
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

  useEffect(() => {
    if (checkedIn) toast.success("Check in success!");
  }, [checkedIn]);

  return (
    <ProtectedRoute>
      <Layout>
        <main className="py-12 px-4 sm:px-12">
          <Button
            className="border-0"
            variant="outlined"
            size="md"
            onClick={async () => {
              const res = await insertRafflePrize(1, 4);
              console.log("res ->", res);
            }}
          >
            Win Prize
          </Button>
          {/* Header */}
          <nav className="flex items-center gap-6">
            <Link href="/events">
              <FaChevronLeft className="text-lg text-blue-600 hover:cursor-pointer sm:text-xl" />
            </Link>
            <h2 className="text-2xl font-bold sm:text-4xl">My Tickets</h2>
          </nav>
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
                />
              </div>
            ))}
          </section>
          {/* QR and Digital Badge Modal */}
          <Modal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            className="flex flex-col items-center"
          >
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-2xl font-bold sm:text-2xl">
                {!checkedIn ? "QR Code" : "Digital Badge"} for
              </h2>
              <p className="text-xl">
                {/* {truncateString(tickets[0].eventName, 40)} */}
                'event name'
              </p>
            </div>
            {/* <QRCodeCanvas value="https://reactjs.org/" /> */}
            {!checkedIn ? (
              <QRCode
                className="mt-4 flex items-center"
                size={128}
                value={qrValue}
              />
            ) : (
              <div>DIGITAL BADGE</div>
            )}

            <div className="mt-4 flex justify-end">
              <Button
                className="border-0"
                variant="outlined"
                size="md"
                onClick={() => setCheckedIn((prev) => !prev)}
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
            <h2 className="text-2xl font-bold sm:text-2xl">Spin the Wheel!</h2>

            <div className="flex justify-center align-middle">
              <SpinWheel prizes={prizes} size={200} />
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

  return {
    props: {
      tickets: ownedTickets,
    },
  };
};
