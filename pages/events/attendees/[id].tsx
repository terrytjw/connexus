import React, { useState } from "react";

import { FaCheckCircle, FaChevronLeft } from "react-icons/fa";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Layout from "../../../components/Layout";
import Button from "../../../components/Button";
import AttendeesTable from "../../../components/EventPages/AttendeesTable";
import Modal from "../../../components/Modal";
import {
  viewAttendeeList,
  exportCSV,
  checkIn,
} from "../../../lib/api-helpers/event-api";
import useSWR from "swr";
import { useRouter } from "next/router";
import Loading from "../../../components/Loading";
import QrScanner from "../../../components/EventPages/QrScanner";

enum CheckInStatus {
  INITIAL,
  LOADING,
  SUCCESS,
  ERROR,
}

const AttendeesPage = () => {
  const [isQrModalOpenOpen, setIsQrModalOpen] = useState(false);
  const router = useRouter();
  const { id: eventId } = router.query;
  const [checkInStatus, setCheckInStatus] = useState<CheckInStatus>(
    CheckInStatus.INITIAL
  );

  const {
    data: attendeees,
    isLoading,
    mutate: mutate,
  } = useSWR(eventId, async () => await viewAttendeeList(Number(eventId)));

  if (isLoading) return <Loading />;

  const onNewScanResult = async (scanResult: string) => {
    setCheckInStatus(CheckInStatus.LOADING);
    if (isValidQr()) {
      console.log("scan result ->", scanResult);
      const idList = scanResult.split(",");
      const [eventId, ticketId, userId] = idList;
      await checkIn(Number(eventId), Number(ticketId), Number(userId));
      setCheckInStatus(CheckInStatus.SUCCESS);
    } else {
      setCheckInStatus(CheckInStatus.ERROR);
    }
  };

  const isValidQr = () => {
    return true;
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
            <h2 className="text-2xl font-bold sm:text-2xl">
              {checkInStatus !== CheckInStatus.LOADING
                ? "Scan a QR code"
                : "Scanning..."}
            </h2>
            <div className="mt-16">
              {checkInStatus === CheckInStatus.LOADING && (
                <Loading className="!h-full bg-transparent" />
              )}
              {(checkInStatus === CheckInStatus.ERROR ||
                checkInStatus === CheckInStatus.INITIAL) && (
                <QrScanner
                  fps={10}
                  qrbox={250}
                  disableFlip={false}
                  rememberLastUsedCamera={true} // auto start video feed if permission was granted
                  qrCodeSuccessCallback={onNewScanResult}
                />
              )}
              {checkInStatus === CheckInStatus.SUCCESS && (
                <div className="flex flex-col items-center">
                  <FaCheckCircle className="text-5xl text-green-500" />
                  <h3 className="mt-4 flex justify-center font-semibold text-red-500">
                    Check-in Success!
                  </h3>
                </div>
              )}
              {checkInStatus === CheckInStatus.ERROR && (
                <h3 className="mt-4 flex justify-center font-semibold text-red-500">
                  Invalid QR Code!
                </h3>
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
              {/* <Button
                variant="solid"
                size="md"
                className="max-w-xs"
                onClick={() => {
                  history.pushState({}, "", exportPDF(Number(eventId)));
                  history.back();
                }}
              >
                Export PDF
              </Button> */}
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
