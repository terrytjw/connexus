import React, { useState } from "react";

import { FaChevronLeft } from "react-icons/fa";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Layout from "../../../components/Layout";
import Button from "../../../components/Button";
import AttendeesTable from "../../../components/EventPages/AttendeesTable";
import Modal from "../../../components/Modal";
import {
  viewAttendeeList,
  exportCSV,
  exportPDF,
  checkIn,
} from "../../../lib/api-helpers/event-api";
import useSWR from "swr";
import { useRouter } from "next/router";
import Loading from "../../../components/Loading";
import QrScanner from "../../../components/EventPages/QrScanner";

const AttendeesPage = () => {
  const [isQrModalOpenOpen, setIsQrModalOpen] = useState(false);
  const router = useRouter();
  const { id: eventId } = router.query;
  const [isCheckingIn, setIsCheckingIn] = useState<boolean>(false);

  const {
    data: attendeees,
    error,
    isLoading,
    mutate: mutate,
  } = useSWR(eventId, async () => await viewAttendeeList(Number(eventId)));
  console.log("attendees", attendeees);

  if (isLoading) return <Loading />;

  const onNewScanResult = async (scanResult: string) => {
    console.log("scan result ->", scanResult);
    setIsCheckingIn(true);
    const idList = scanResult.split(",");
    const [eventId, ticketId, userId] = idList;
    await checkIn(Number(eventId), Number(ticketId), Number(userId));
    setIsCheckingIn(false);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <main className="py-12 px-4 sm:px-12">
          {/* QR Modal */}
          <Modal
            isOpen={isQrModalOpenOpen}
            setIsOpen={setIsQrModalOpen}
            className="min-w-fit"
          >
            <h1>Scan a QR code</h1>
            <div className="mt-4">
              {!isCheckingIn ? (
                <QrScanner
                  fps={10}
                  qrbox={250}
                  disableFlip={false}
                  rememberLastUsedCamera={true} // auto start video feed if permission was granted
                  qrCodeSuccessCallback={onNewScanResult}
                />
              ) : (
                <Loading className="!h-full bg-transparent" />
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                className="border-0"
                variant="outlined"
                size="md"
                onClick={() => setIsQrModalOpen(false)}
              >
                Done
              </Button>
            </div>
          </Modal>

          {/* Header */}
          <div className="mb-8 flex justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                className="border-0"
                variant="outlined"
                size="md"
                onClick={() => history.back()}
              >
                <FaChevronLeft />
              </Button>
              <h1 className="text-3xl font-bold">Attendees</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* TODO: refactor buttons into dropdown  */}
              <Button
                variant="solid"
                size="md"
                className="max-w-xs"
                onClick={() => {
                  history.pushState({}, "", exportPDF(Number(eventId)));
                  history.back();
                }}
              >
                Export PDF
              </Button>
              <Button
                href={exportCSV(Number(eventId))} // redirect users to the url
                variant="solid"
                size="md"
                className="max-w-xs "
              >
                Export CSV
              </Button>
              <Button
                variant="outlined"
                size="md"
                className="max-w-xs"
                onClick={() => setIsQrModalOpen(true)}
              >
                Scan QR Code
              </Button>
            </div>
          </div>

          <section>
            <div className="pt-6">
              <AttendeesTable
                data={attendeees}
                columns={["Name", "Email Address", "Check-in Status"]}
                mutateAttendees={mutate}
              />
            </div>
          </section>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default AttendeesPage;
