import React, { useEffect, useState } from "react";

import { FaChevronLeft } from "react-icons/fa";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Layout from "../../../components/Layout";
import Button from "../../../components/Button";
import AttendeesTable from "../../../components/EventPages/AttendeesTable";
import Modal from "../../../components/Modal";
import {
  viewAttendeeList,
  exportCSV,
  checkIn,
  filterAttendeeList,
  exportPDF,
  updateRaffle,
} from "../../../lib/api-helpers/event-api";
import useSWR from "swr";
import { useRouter } from "next/router";
import Loading from "../../../components/Loading";
import QrScanner from "../../../components/EventPages/QrScanner";
import { toast, Toaster } from "react-hot-toast";
import { AttendeeListType } from "../../../utils/types";
import { BiGift } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { updateRafflePrize } from "../../../lib/api-helpers/user-api";

export enum CheckInStatus {
  INITIAL,
  LOADING,
  SUCCESS,
  ERROR,
}

const AttendeesPage = () => {
  const router = useRouter();
  const { id: eventId } = router.query;
  const [checkInStatus, setCheckInStatus] = useState<CheckInStatus>(
    CheckInStatus.INITIAL
  );
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPrizeModalOpen, setIsPrizeModalOpen] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [attendees, setAttendees] = useState<AttendeeListType[]>([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const {
    data: fetchedAttendees,
    isLoading,
    mutate: mutate,
  } = useSWR(eventId, async () => await viewAttendeeList(Number(eventId)));

  console.log("fetchAttendees ->", fetchedAttendees);

  const searchAndFilterAttendees = async () => {
    const res = await filterAttendeeList(Number(eventId), 0, searchString);
    setAttendees(res);
  };

  // listen to fetcher changes
  useEffect(() => {
    if (fetchedAttendees) {
      setAttendees(fetchedAttendees);
    }
  }, [fetchedAttendees]);

  // listen to search string changes
  useEffect(() => {
    if (eventId) {
      searchAndFilterAttendees();
    }
  }, [searchString]);

  if (isLoading) return <Loading />;

  // custom function to show toast max once every X time period
  let lastToastTime: number | null = null;

  const showToastWithLimit = (
    message: string,
    options: { duration: number },
    timeLimit: number
  ) => {
    const currentTime = Date.now();

    if (!lastToastTime || currentTime - lastToastTime >= timeLimit) {
      lastToastTime = currentTime;
      toast.error(message, options);
    }
  };

  // validation function
  const isValidQr = (str: string) => {
    const numCommas = (str.match(/,/g) || []).length;

    if (numCommas !== 2) {
      return false;
    }
    const numbers = str.split(",");

    for (const numStr of numbers) {
      const num = parseInt(numStr, 10);
      if (isNaN(num) || num.toString() !== numStr) {
        return false;
      }
    }
    return true;
  };

  const onNewScanResult = async (scanResult: string) => {
    setCheckInStatus(CheckInStatus.LOADING);
    if (isValidQr(scanResult)) {
      console.log("scan result ->", scanResult);
      const idList = scanResult.split(",");
      const [eventId, ticketId, userId] = idList;
      const res = await checkIn(
        Number(eventId),
        Number(ticketId),
        Number(userId)
      );
      setIsValid(true);
      toast.success("Check-in Success!", { duration: 1000 });
      setTimeout(() => {
        mutate((data: AttendeeListType[]) => {
          data.map((attendee) =>
            attendee.userId == res.userId
              ? { ...attendee, checkIn: true }
              : attendee
          );
        });

        setCheckInStatus(CheckInStatus.INITIAL);
      }, 2000);
    } else {
      setIsValid(false);
      showToastWithLimit("Invalid QR Code!", { duration: 3000 }, 5000);
      setCheckInStatus(CheckInStatus.INITIAL);
    }
  };

  const handleChange = (event: any) => {
    setSelectedOption(event.target.value);
    if (event.target.value === "csv") {
      const url = exportCSV(Number(eventId));
      router.push(url);
      setTimeout(() => router.reload(), 3000); // bring users back after 0.3 sec
    } else {
      const url = exportPDF(Number(eventId));
      router.push(url);
      setTimeout(() => router.reload(), 3000);
    }
  };

  const handleActivateRaffle = async () => {
    const raffles = fetchedAttendees[0].ticket.event.raffles; // raffle object from db
    // event has a raffle and raffle is enabled
    if (raffles.length !== 0 && raffles[0].isEnabled) {
      const updatedRaffle = { ...raffles[0], isActivated: true };
      console.log("posting raffle object -> ", updatedRaffle);
      const res = await updateRaffle(raffles[0].raffleId, updatedRaffle);

      // TODO: MUTATE attendees to change active raffle button state
      console.log("res ->", res);
      toast.success("Activated Raffle!");
    } else {
      toast.error("Failed to activate Raffle");
    }
  };

  const handleVerify = () => {
    if (true) {
      toast.success("Verified!");
    } else {
      toast.error("Failed to verify prize claim");
    }
    setIsPrizeModalOpen(false);
  };

  const isRaffleActivated = () => {
    if (attendees.length !== 0) {
      return attendees[0].ticket.event.raffles[0].isActivated;
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <main className="py-12 px-4 sm:px-12">
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#FFFFFF",
                color: "#34383F",
                textAlign: "center",
              },
            }}
          />
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
          </div>

          <div className="flex justify-between">
            <div className="flex gap-4">
              <Button
                variant="outlined"
                size="md"
                className="max-w-xs"
                onClick={handleActivateRaffle}
                disabled={isRaffleActivated()}
              >
                {!isRaffleActivated()
                  ? "Activate Digital Raffle"
                  : "Raffle Activated"}
              </Button>
            </div>
            <div className="flex gap-4">
              <div className="relative w-full items-center justify-center rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaSearch className="text-gray-500" />
                </div>
                <input
                  className="input-outlined input input-md block w-full rounded-md pl-10"
                  type="text"
                  value={searchString}
                  placeholder="Search Attendees"
                  onChange={(e) => {
                    setSearchString(e.target.value);
                  }}
                />
              </div>
              <select
                value={selectedOption ?? ""}
                onChange={handleChange}
                className="btn-md btn flex gap-x-2 rounded-md border-white/0 bg-blue-600 normal-case text-white hover:border-white/0 hover:bg-blue-900"
              >
                <option value="" hidden>
                  Export Table
                </option>
                <option value="csv">Export as CSV</option>
                <option value="pdf">Export as PDF</option>
              </select>
            </div>
          </div>

          <section>
            <div className="pt-6">
              <AttendeesTable
                data={attendees}
                columns={["Name", "Email Address", "Check-in Status"]}
                setIsQrModalOpen={setIsQrModalOpen}
                checkInStatus={checkInStatus}
                setIsPrizeModalOpen={setIsPrizeModalOpen}
              />
            </div>
          </section>

          {/* Prize Modal */}
          <Modal
            isOpen={isPrizeModalOpen}
            setIsOpen={setIsPrizeModalOpen}
            className="inline-block text-center"
          >
            <h2 className="font-bold sm:text-2xl">Prize Name</h2>
            <p className="font-normal">description</p>
            <div className="mt-4 flex justify-center">
              <BiGift className="text-blue-600" size={40} />
            </div>
            <div className="mt-4 justify-end">
              <Button
                className="w-full border-0 bg-teal-500 hover:bg-teal-600"
                variant="solid"
                size="md"
                onClick={handleVerify}
              >
                Verify
              </Button>
            </div>
          </Modal>

          {/* QR Modal */}
          <Modal
            isOpen={isQrModalOpen}
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

            {/* Success Toast OR Error Toast in Modal*/}
            {isValid ? (
              <Toaster
                position="bottom-center"
                toastOptions={{
                  style: {
                    background: "#67BD8B",
                    color: "#fff",
                    textAlign: "center",
                  },
                }}
              />
            ) : (
              <Toaster
                position="bottom-center"
                toastOptions={{
                  style: {
                    background: "#FF5B57",
                    color: "#fff",
                    textAlign: "center",
                  },
                }}
              />
            )}
          </Modal>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default AttendeesPage;
