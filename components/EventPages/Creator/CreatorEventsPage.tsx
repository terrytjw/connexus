import React, { useEffect, useState } from "react";
import Button from "../../Button";
import EventsTable from "../EventsTable";

import { EventWithAllDetails } from "../../../utils/types";
import Modal from "../../Modal";
import { BiFilter } from "react-icons/bi";
import { CategoryType, VisibilityType } from "@prisma/client";
import axios from "axios";
import Badge from "../../Badge";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Event } from "@prisma/client";
import { FiCalendar } from "react-icons/fi";
import EventWordToggle from "../EventWordToggle";
import { useRouter } from "next/router";
import Input from "../../Input";
import { Toaster } from "react-hot-toast";
import { filterEvent } from "../../../lib/api-helpers/event-api";
import { useSession } from "next-auth/react";

const DELAY_TIME = 400;

type CreatorEventsPageProps = {
  events: EventWithAllDetails[];
};

const CreatorEventsPage = ({ events }: CreatorEventsPageProps) => {
  const router = useRouter();
  const [isCreated, setIsCreated] = useState<boolean>(false);
  const [selectedTopics, setSelectedTopics] = useState<
    string[] | CategoryType[]
  >([]);
  const [searchString, setSearchString] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchAndFilterResults, setSearchAndFilterResults] = useState<
    EventWithAllDetails[]
  >([]);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState<boolean>(false);
  const [eventIdToDelete, setEventIdToDelete] = useState<number | undefined>();
  console.log(events);

  // fetch userId if from session
  const { data: session, status } = useSession();
  const userId = session?.user.userId;

  useEffect(() => {
    console.log("in use effect");
    // ended events
    if (!isCreated) {
      console.log("in !created");
      setSearchAndFilterResults(
        events.filter(
          (event: EventWithAllDetails) => new Date(event.endDate) > new Date()
        )
      );
    } else {
      // created events
      console.log("in created");
      setSearchAndFilterResults(
        events.filter(
          (event: EventWithAllDetails) => new Date(event.endDate) <= new Date()
        )
      );
    }
  }, [isCreated]);

  // Initialize a variable to hold the timeout ID
  let timeoutId: ReturnType<typeof setTimeout>;

  const appendFilterParamsToURL = (
    url: string,
    filterParams: CategoryType[] | string[]
  ) => {
    if (!filterParams || filterParams.length === 0) {
      return url;
    }

    const filterString = filterParams
      .map((filter: CategoryType | string) => "filter=" + filter)
      .join("&");
    const separator = url.includes("?") ? "&" : "?";
    const newURL = `${url}${separator}${filterString}`;

    return newURL;
  };

  // delay api call until the last action
  const debounceSearchApiCall = (searchTerm: string) => {
    // Clear any existing timeout
    clearTimeout(timeoutId);

    // Set a new timeout to execute the search API call after the delay time has elapsed
    timeoutId = setTimeout(() => {
      // Make the search API call with the given search term
      searchEvents(searchTerm);
    }, DELAY_TIME);
  };

  const searchEvents = async (searchTerm: string) => {
    try {
      const searchUrl = `http://localhost:3000/api/events?keyword=${searchTerm}`;
      const url = appendFilterParamsToURL(searchUrl, selectedTopics);
      const { data } = await axios.get(url);

      // fetch addresses using address ID
      const eventsWithAddresses: EventWithAllDetails[] = await Promise.all(
        data.map(async (event: Partial<Event>) => {
          const { data: address } = await axios.get(
            `http://localhost:3000/api/addresses/${event?.addressId}`
          );

          return { ...event, address };
        })
      );
      setSearchAndFilterResults(eventsWithAddresses);
    } catch (error) {
      console.error(error);
    }
  };

  // listen to filter and search changes
  useEffect(() => {
    // dont debounce on first page load
    if (searchString !== "" || selectedTopics.length > 0) {
      // console.log("search api called");
      debounceSearchApiCall(searchString);
    } else {
      // using this to display events on initial page load
      setSearchAndFilterResults(
        events.filter(
          (event: EventWithAllDetails) => new Date(event.endDate) > new Date()
        )
      );
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchString, selectedTopics]);

  return (
    <div>
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
        {/* Rest of page */}
        <h1 className="text-2xl font-bold sm:text-4xl">Events</h1>

        <div className="mt-6 flex flex-wrap justify-between">
          <h2 className="text-md mt-2 font-bold sm:text-xl">Created Events</h2>
        </div>

        {/* dekstop filter and search */}
        <div className="invisible mt-6 flex flex-wrap justify-between sm:visible">
          <div className="flex gap-4">
            <EventWordToggle
              leftWord="Created"
              rightWord="Ended"
              isChecked={isCreated}
              setIsChecked={setIsCreated}
            />
            <Button
              variant="solid"
              size="md"
              className="max-w-xs shadow-md"
              onClick={async () => {
                const data = await filterEvent(
                  "",
                  [],
                  new Date("2023-02-20T00:00:00.000Z"),
                  new Date("2023-05-26T00:00:00.000Z"),
                  false,
                  Number(userId),
                  VisibilityType.DRAFT
                );

                console.log("filtered events-> ", data);
              }}
            >
              <FiCalendar className="text-lg text-neutral-50" />
              fitler
            </Button>
            <Button variant="solid" size="md" className="max-w-xs shadow-md">
              <FiCalendar className="text-lg text-neutral-50" />
            </Button>
          </div>
          <div className="flex basis-1/3 gap-4">
            <div className="relative w-full items-center justify-center rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="text-gray-500" />
              </div>
              <input
                className="input-outlined input input-md block w-full rounded-md pl-10"
                type="text"
                value={searchString}
                placeholder="Search Events by Name"
                onChange={(e) => {
                  setSearchString(e.target.value);
                }}
              />
            </div>
            <Button
              variant="solid"
              size="md"
              className="max-w-sm !bg-white !text-gray-700"
              onClick={() => setIsFilterModalOpen(true)}
            >
              Filter
              <BiFilter className="h-8 w-8" />
            </Button>
          </div>
        </div>
        {/* mobile search and filter */}
        <div className="mt-8 flex w-full gap-2 sm:hidden">
          <div className="relative w-full items-center justify-center rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="text-gray-500" />
            </div>
            <input
              className="input-outlined input input-md block w-full rounded-md pl-10"
              type="text"
              value={searchString}
              placeholder="Search Communities"
              onChange={(e) => {
                setSearchString(e.target.value);
              }}
            />
          </div>
          <BiFilter
            className="h-12 w-10"
            onClick={() => setIsFilterModalOpen(true)}
          />
          <Button
            href="/events/create"
            variant="solid"
            size="md"
            className="max-w-xs"
          >
            Create Event
          </Button>
        </div>

        <section className="mt-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedTopics.map((label) => {
              return (
                <Button
                  key={label}
                  size="sm"
                  variant="outlined"
                  onClick={(e) => e.preventDefault()}
                  className="font-normal"
                >
                  {label}
                  <FaTimes
                    onClick={() => {
                      setSelectedTopics(
                        selectedTopics.filter((topic) => {
                          return topic != label;
                        })
                      );
                    }}
                  />
                </Button>
              );
            })}
          </div>
          <EventsTable
            data={searchAndFilterResults}
            columns={[
              "Event Name",
              "Date",
              "Location",
              "Max Attendees",
              "Tickets Sold",
              "Revenue",
              "Tags",
              "Status",
            ]}
            setDeleteConfirmationModalOpen={setDeleteConfirmationModalOpen}
            setEventIdToDelete={setEventIdToDelete}
          />
        </section>

        {/* Abstract Fitler modal */}
        <Modal
          isOpen={isFilterModalOpen}
          setIsOpen={setIsFilterModalOpen}
          className="min-w-fit"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Filter Events</h3>
            <Button
              variant="outlined"
              size="sm"
              className="border-0 text-red-500"
              onClick={() => {
                setSelectedTopics([]);
              }}
            >
              Clear
            </Button>
          </div>

          {/* Categories */}
          <h3 className="mt-8 text-sm font-medium text-gray-500">CATEGORIES</h3>
          <div className="mt-2 mb-4 grid grid-cols-1 justify-center gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Object.values(CategoryType).map((label, index) => {
              return (
                <Badge
                  key={index}
                  label={label}
                  size="md"
                  selected={
                    selectedTopics.length > 0 &&
                    selectedTopics.indexOf(label) != -1
                  }
                  onClick={() => {
                    if (selectedTopics.indexOf(label) == -1) {
                      setSelectedTopics([...selectedTopics, label]);
                      return;
                    }
                    setSelectedTopics(
                      selectedTopics.filter((topic) => {
                        return topic != label;
                      })
                    );
                  }}
                  className="h-8 w-full rounded-lg sm:w-32"
                />
              );
            })}
          </div>
          <div className="divider"></div>
          {/* Date Range */}
          <h3 className="text-sm font-medium text-gray-500">DATE RANGE</h3>
          <div className="mt-2 flex justify-between gap-8">
            <Input
              type="datetime-local"
              label="From"
              value={""}
              onChange={() => {}}
              placeholder="From Date and Time"
              size="xs"
              variant="bordered"
              className="max-w-3xl align-middle text-gray-500"
            />
            <Input
              type="datetime-local"
              label="To"
              value={""}
              onChange={() => {}}
              placeholder="From Date and Time"
              size="xs"
              variant="bordered"
              className="max-w-3xl align-middle text-gray-500"
            />
          </div>

          <div className="divider"></div>
          {/* Liked */}
          <h3 className="text-sm font-medium text-gray-500">PUBLISH STATUS</h3>
          <div className="flex gap-2">
            <Badge
              label="Draft"
              size="lg"
              selected={false}
              onClick={() => {}}
              className="mt-2 h-8 min-w-fit rounded-lg"
            />
            <Badge
              label="Published"
              size="lg"
              selected={false}
              onClick={() => {}}
              className="mt-2 h-8 min-w-fit rounded-lg"
            />
          </div>

          <Button
            variant="solid"
            size="md"
            className="mt-8"
            onClick={() => setIsFilterModalOpen(false)}
          >
            Submit
          </Button>
        </Modal>

        {/* Confirm Delete Modal */}
        <Modal
          isOpen={deleteConfirmationModalOpen}
          setIsOpen={setDeleteConfirmationModalOpen}
        >
          <div className="flex flex-col gap-6 py-4">
            <h3 className="text-xl font-semibold">Confirm Delete Event?</h3>
            <h3 className="text-md font-normal text-gray-500">
              Warning - This action is permanent
            </h3>
            <div className="flex justify-end gap-6">
              <Button
                variant="outlined"
                size="md"
                className="border-0 text-gray-500"
                onClick={async () => {
                  setDeleteConfirmationModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                size="md"
                className="bg-red-600 hover:bg-red-500"
                onClick={async () => {
                  await axios.delete(
                    `http://localhost:3000/api/events/${eventIdToDelete}`
                  );
                  router.reload();
                  setDeleteConfirmationModalOpen(false);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default CreatorEventsPage;
