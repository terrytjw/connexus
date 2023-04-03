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
  getEventInfo,
  updateEventInfo,
} from "../../../lib/api-helpers/event-api";
import useSWR from "swr";
import { useRouter } from "next/router";
import Loading from "../../../components/Loading";
import QrScanner from "../../../components/EventPages/QrScanner";
import { toast, Toaster } from "react-hot-toast";
import { AttendeeListType } from "../../../utils/types";
import { BiGift } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import {
  getUserInfo,
  updateRafflePrize,
} from "../../../lib/api-helpers/user-api";
import { truncateString } from "../../../utils/text-truncate";
import {
  deployDigitalBadge,
  mintDigitalBadge,
} from "../../../lib/api-helpers/digital-badge-api";
import {
  getTicketInfo,
  getUserTicketInfo,
  updateUserTicket,
} from "../../../lib/api-helpers/ticket-api";

export enum CheckInStatus {
  INITIAL,
  LOADING,
  SUCCESS,
  ERROR,
}

export type prizeSelection = {
  prizeName: string;
  rafflePrizeUserData: {
    rafflePrizeUserId: number;
    rafflePrizeId: number;
    isClaimed: boolean;
    userId: number;
  };
};

const AttendeesPage = () => {
  const router = useRouter();
  const { id: eventId } = router.query;
  const [checkInStatus, setCheckInStatus] = useState<CheckInStatus>(
    CheckInStatus.INITIAL
  );
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPrizeModalOpen, setIsPrizeModalOpen] = useState(false);
  const [currentPrizeSelection, setCurrentPrizeSelection] =
    useState<prizeSelection | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [attendees, setAttendees] = useState<AttendeeListType[]>([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    data: fetchedAttendees,
    isLoading,
    mutate: mutate,
  } = useSWR(eventId, async () => await viewAttendeeList(Number(eventId)));

  console.log("fetchAttendees ->", fetchedAttendees);
  console.log("filteredAttendees ->", attendees);

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

      // update userTicket check in status in db
      const res = await checkIn(
        Number(eventId),
        Number(ticketId),
        Number(userId)
      );
      setIsValid(true);

      // mint badge to user
      await mintBadge(Number(eventId), Number(ticketId), Number(userId));

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

  const mintBadge = async (
    eventId: number,
    ticketId: number,
    userId: number
  ) => {
    const { userLikes, tickets, address, ...eventInfo } = await getEventInfo(
      eventId
    );
    const ticketInfo = await getTicketInfo(ticketId);
    const ticketCategory = ticketInfo.name;
    console.log("ticketInfo ..", ticketInfo);
    const userInfo = await getUserInfo(userId);
    const userWallet = userInfo.walletAddress;
    console.log("userWallet ->", userWallet);
    const digitalBadgeUri = await mintDigitalBadge(
      eventInfo,
      ticketCategory,
      userWallet
    );
    console.log("minted digital badge uri ->", digitalBadgeUri);

    const userTicketInfo = await getUserTicketInfo(
      ticketInfo.ticketId,
      userInfo.userId
    );

    console.log("user ticket info ->", userTicketInfo);

    const updatedUserTicketInfo = {
      ...userTicketInfo,
      badgeUrl: digitalBadgeUri,
    };

    const updatedUserTicketResponse = await updateUserTicket(
      ticketInfo.ticketId,
      userInfo.userId,
      updatedUserTicketInfo
    );

    console.log("updated user ticket response ->", updatedUserTicketResponse);
  };

  const deployDigitalBadgeContract = async () => {
    const { userLikes, tickets, address, ...eventInfo } = await getEventInfo(
      Number(eventId)
    );
    const categories: any[] = [];
    console.log(eventInfo);

    tickets.map((event: any) => {
      categories.push(event.name);
    });
    console.log("categories ->", categories);

    const contractAddress = await deployDigitalBadge(
      categories,
      eventInfo.eventName,
      eventInfo.eventName
    );

    const updatedEventInfo = {
      ...eventInfo,
      digitalBadgeScAddress: contractAddress,
    };

    const updatedEventResponse = await updateEventInfo(
      Number(eventId),
      updatedEventInfo
    );
    console.log("updated event response ->", updatedEventResponse);
  };

  const handleActivateRaffle = async () => {
    const raffles = fetchedAttendees[0].ticket.event.raffles; // raffle object from db

    // show different error messages
    if (!isRaffleEnabled()) {
      toast.error("Please enable raffle first");
      return;
    }
    // event has a raffle and raffle is enabled
    if (raffles.length !== 0 && raffles[0].isEnabled) {
      setLoading(true);
      const updatedRaffle = { ...raffles[0], isActivated: true };
      await toast.promise(updateRaffle(raffles[0].raffleId, updatedRaffle), {
        loading: "Activating Raffle...",
        success: "Raffle Activated!",
        error: "Error Activating Raffle",
      });
      // deploy digital badge contract
      await toast.promise(deployDigitalBadgeContract(), {
        loading: "Deploying Digital Badge Contract...",
        success: "Digital Badge Contract Deployed!",
        error: "Error Deploying Digital Badge Contract",
      });

      mutate((data: AttendeeListType[]) =>
        data.map(
          (attendee: any, index) =>
            index === 0 && attendee.ticket.event.raffles[0]?.isActivated
        )
      );
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (currentPrizeSelection?.rafflePrizeUserData) {
      // console.log("passing this obj -> ", {
      //   rafflePrizeUserId:
      //     currentPrizeSelection?.rafflePrizeUserData?.rafflePrizeUserId,
      //   rafflePrizeId:
      //     currentPrizeSelection?.rafflePrizeUserData?.rafflePrizeId,
      //   isClaimed: true,
      //   userId: currentPrizeSelection?.rafflePrizeUserData?.userId,
      // });

      const res = await toast.promise(
        updateRafflePrize(
          currentPrizeSelection?.rafflePrizeUserData?.rafflePrizeUserId,
          {
            rafflePrizeUserId:
              currentPrizeSelection?.rafflePrizeUserData?.rafflePrizeUserId,
            rafflePrizeId:
              currentPrizeSelection?.rafflePrizeUserData?.rafflePrizeId,
            isClaimed: true,
            userId: currentPrizeSelection?.rafflePrizeUserData?.userId,
          }
        ),
        {
          loading: "Verifying Prize Claim...",
          success: "Prize Claim Verified!",
          error: "Error Verifying Prize Claim",
        }
      );

      console.log("res ->", res);
      mutate((data: AttendeeListType[]) => {
        data.map((attendee) =>
          attendee.userId == res.userId
            ? { ...attendee, checkIn: true }
            : attendee
        );
      });
      setIsPrizeModalOpen(false);
    }
  };

  const isRaffleActivated = (): boolean | undefined => {
    if (attendees.length !== 0) {
      return attendees[0]?.ticket?.event?.raffles[0]?.isActivated;
    }
  };

  const isRaffleEnabled = (): boolean | undefined => {
    if (attendees.length !== 0) {
      return attendees[0]?.ticket?.event?.raffles[0]?.isEnabled;
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <main className="py-12 px-4 sm:px-12">
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
              <h1 className="text-3xl font-bold text-gray-900">
                Attendees for{" "}
                {truncateString(
                  attendees[0]?.ticket?.event?.eventName ?? "",
                  30
                )}
              </h1>
            </div>
          </div>
          {attendees.length === 0 ? (
            <div className=" flex h-80 flex-col items-center justify-center gap-4 p-4 text-sm tracking-widest text-gray-400">
              <span> No attendees for this event yet. </span>
            </div>
          ) : (
            <>
              <div className="flex justify-between">
                <div className="flex gap-4">
                  <Button
                    variant="solid"
                    size="md"
                    className={`max-w-xs ${isRaffleActivated() && "border-0"}`}
                    onClick={handleActivateRaffle}
                    disabled={
                      isRaffleActivated() || loading || attendees.length === 0
                    }
                  >
                    {!isRaffleActivated() ? "Start Event" : "Event Started"}
                  </Button>
                </div>
                <div className="flex gap-4">
                  <div className="relative hidden w-full items-center justify-center rounded-md shadow-sm lg:flex">
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
                    className="btn-outline btn flex gap-x-2 rounded-md normal-case text-blue-600 hover:border-blue-600 hover:bg-blue-100 hover:text-blue-600"
                  >
                    <option value="" hidden>
                      Export Table
                    </option>
                    <option value="csv">Export as CSV</option>
                    <option value="pdf">Export as PDF</option>
                  </select>
                </div>
              </div>
              {/* mobile search */}
              <div className="mt-4 flex w-full gap-2 lg:hidden">
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
              </div>
              <section>
                <div className="pt-6">
                  <AttendeesTable
                    data={attendees}
                    columns={["Name", "Email Address", "Check-in Status"]}
                    setIsQrModalOpen={setIsQrModalOpen}
                    checkInStatus={checkInStatus}
                    isRaffleActivated={isRaffleActivated}
                    setIsPrizeModalOpen={setIsPrizeModalOpen}
                    setCurrentPrizeSelection={setCurrentPrizeSelection}
                  />
                </div>
              </section>
            </>
          )}

          {/* Prize Modal */}
          <Modal
            isOpen={isPrizeModalOpen}
            setIsOpen={setIsPrizeModalOpen}
            className="inline-block text-center"
          >
            <h2 className="font-bold text-gray-900 sm:text-2xl">
              {currentPrizeSelection?.prizeName}
            </h2>
            <div className="mt-4 flex justify-center">
              <BiGift className="text-blue-600" size={120} />
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
            <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-2xl">
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
