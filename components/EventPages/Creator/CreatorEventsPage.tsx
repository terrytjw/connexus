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
import { useRouter } from "next/router";
import { filterEvent } from "../../../lib/api-helpers/event-api";
import { useSession } from "next-auth/react";
import TabGroupBordered from "../../TabGroupBordered";
// @ts-ignore
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { API_URL } from "../../../lib/constant";
import Loading from "../../Loading";

const DELAY_TIME = 400;

const CreatorEventsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [isCreated, setIsCreated] = useState<boolean>(false); // rendering using this  state is abit janky but it works
  const [selectedTopics, setSelectedTopics] = useState<CategoryType[]>([]);
  const [searchString, setSearchString] = useState("");
  const [dateRange, setDateRange] = useState([
    {
      startDate: undefined,
      endDate: new Date(""),
      key: "selection",
    },
  ]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [initialEventsData, setInitialEventsData] = useState<
    EventWithAllDetails[]
  >([]);
  const [searchAndFilterResults, setSearchAndFilterResults] = useState<
    EventWithAllDetails[]
  >([]);
  const [visibilityType, setVisibilityType] = useState<
    VisibilityType | undefined
  >(undefined);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState<boolean>(false);
  const [eventIdToDelete, setEventIdToDelete] = useState<number | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  // fetch userId if from session
  const { data: session, status } = useSession();
  const userId = Number(session?.user.userId);

  // Initialize a variable to hold the timeout ID
  let timeoutId: ReturnType<typeof setTimeout>;

  // delay api call until the last action
  const debounceSearchApiCall = (searchTerm: string) => {
    // Clear any existing timeout
    clearTimeout(timeoutId);

    // Set a new timeout to execute the search API call after the delay time has elapsed
    timeoutId = setTimeout(() => {
      // Make the search API call with the given search term
      searchAndFilterEvents(searchTerm);
    }, DELAY_TIME);
  };

  const searchAndFilterEvents = async (searchTerm: string) => {
    try {
      const data = await filterEvent(
        searchTerm,
        selectedTopics,
        dateRange[0].startDate,
        dateRange[0].startDate ? dateRange[0].endDate : undefined,
        userId,
        visibilityType // this is used for creator events page
      );
      setSearchAndFilterResults(filterCreatedEvents(data));
    } catch (error) {
      console.error(error);
    }
  };

  const hasFilters = (): boolean => {
    return Boolean(
      dateRange[0].startDate || visibilityType || selectedTopics.length > 0
    );
  };

  const clearFilters = (): void => {
    setSelectedTopics([]);
    setDateRange([
      {
        startDate: undefined,
        endDate: new Date(""),
        key: "selection",
      },
    ]);
    setVisibilityType(undefined);
  };

  // checks current toggle state for created and ended and filters events accordingly
  const filterCreatedEvents = (eventsToFilter: EventWithAllDetails[]) => {
    if (!isCreated) {
      return eventsToFilter.filter(
        (event: EventWithAllDetails) => new Date(event.endDate) > new Date()
      );
    } else {
      // created events
      return eventsToFilter.filter(
        (event: EventWithAllDetails) => new Date(event.endDate) <= new Date()
      );
    }
  };

  const setInitialFilterResults = async () => {
    setLoading(true);
    const initialEventData = await filterEvent(
      undefined,
      [],
      undefined,
      undefined,
      userId,
      undefined
    );
    setLoading(false);
    // use this state to store initial event data and subsequently render events using this state
    setInitialEventsData(initialEventData);
    setSearchAndFilterResults(filterCreatedEvents(initialEventData));
  };

  // listens to created and ended events toggle
  useEffect(() => {
    if (!isCreated) {
      clearFilters();
      if (initialEventsData.length === 0) {
        setInitialFilterResults();
      }
      setSearchAndFilterResults(filterCreatedEvents(initialEventsData));
    } else {
      // created events
      clearFilters();
      if (initialEventsData.length === 0) {
        setInitialFilterResults();
      }
      setSearchAndFilterResults(filterCreatedEvents(initialEventsData));
    }
  }, [isCreated]);

  // listen to filter and search changes
  useEffect(() => {
    // dont debounce on first page load
    if (searchString !== "" || hasFilters()) {
      debounceSearchApiCall(searchString);
    } else {
      // using this to display events on initial page load
      setInitialFilterResults();
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchString, selectedTopics, dateRange, visibilityType]);

  return (
    <div>
      <main className="py-12 px-4 sm:px-12">
        {/* Rest of page */}
        <h1 className="text-4xl font-bold text-gray-900">Your Events</h1>
        <h3 className="mt-4 text-gray-500">
          View all your created upcoming and past events
        </h3>

        {/* dekstop filter and search */}
        <div className="mt-10 hidden items-center justify-between gap-x-4 lg:flex">
          <Button
            href="/events/create"
            variant="solid"
            size="md"
            className="w-fit"
          >
            Create a New Event
          </Button>
          <div className="flex gap-x-4">
            <div className="relative items-center justify-center rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="text-gray-500" />
              </div>
              <input
                className="input-outlined input input-md block w-full rounded-md pl-10"
                type="text"
                value={searchString}
                placeholder="Search Events"
                onChange={(e) => {
                  setSearchString(e.target.value);
                }}
              />
            </div>
            <Button
              variant="solid"
              size="md"
              className="max-w-sm !bg-white !text-gray-700 shadow-sm"
              onClick={() => setIsFilterModalOpen(true)}
            >
              Filter
              <BiFilter className="text-gray-500 h-6 w-6" />
            </Button>
          </div>
        </div>
        {/* mobile search and filter */}
        <div className="mt-8 flex w-full flex-col gap-4 lg:hidden">
          <Button
            href="/events/create"
            variant="solid"
            size="md"
            className="w-fit"
          >
            Create a New Event
          </Button>

          <div className="flex gap-x-2">
            <div className="relative w-full items-center justify-center rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="text-gray-500" />
              </div>
              <input
                className="input-outlined input input-md block w-full rounded-md pl-10"
                type="text"
                value={searchString}
                placeholder="Search Events"
                onChange={(e) => {
                  setSearchString(e.target.value);
                }}
              />
            </div>
            <BiFilter
              className="text-gray-500 h-12 w-10"
              onClick={() => setIsFilterModalOpen(true)}
            />
          </div>
        </div>

        <TabGroupBordered
          tabs={["Created", "Ended"]}
          activeTab={activeTab}
          setActiveTab={(index: number) => {
            setIsCreated(!isCreated);
            setActiveTab(index);
            setSearchString("");
          }}
        >
          {loading ? (
            <Loading />
          ) : (
            <>
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
            </>
          )}
        </TabGroupBordered>

        {/* Abstract Fitler modal */}
        <Modal
          isOpen={isFilterModalOpen}
          setIsOpen={setIsFilterModalOpen}
          className="min-w-fit"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Filter Events
            </h3>
            <Button
              variant="outlined"
              size="sm"
              className="border-0 text-red-500"
              onClick={clearFilters}
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
          <DateRange
            showSelectionPreview={false}
            showDateDisplay={false}
            onChange={(item: any) => setDateRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            className="w-full min-w-fit [&_div]:w-full"
          />

          <div className="divider"></div>
          {/* Publish status */}
          <h3 className="text-sm font-medium text-gray-500">PUBLISH STATUS</h3>
          <div className="flex gap-2">
            <Badge
              label="Draft"
              size="lg"
              selected={visibilityType == VisibilityType.DRAFT}
              onClick={() => {
                if (visibilityType === VisibilityType.DRAFT) {
                  setVisibilityType(undefined);
                } else {
                  setVisibilityType(VisibilityType.DRAFT);
                }
              }}
              className="mt-2 h-8 min-w-fit rounded-lg"
            />
            <Badge
              label="Published"
              size="lg"
              selected={visibilityType === VisibilityType.PUBLISHED}
              onClick={() => {
                if (visibilityType === VisibilityType.PUBLISHED) {
                  setVisibilityType(undefined);
                } else {
                  setVisibilityType(VisibilityType.PUBLISHED);
                }
              }}
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
          <div className="flex flex-col gap-6 text-gray-900">
            <h3 className="text-xl font-semibold">Delete Event</h3>

            <p>
              By deleting this event, all existing data will be removed.{" "}
              <span className="font-semibold">
                You cannot undo this action.
              </span>
            </p>

            <div className="flex gap-4">
              <Button
                variant="solid"
                size="md"
                className="bg-red-600 hover:bg-red-500"
                onClick={async () => {
                  await axios.delete(`${API_URL}/events/${eventIdToDelete}`);
                  router.reload();
                  setDeleteConfirmationModalOpen(false);
                }}
              >
                Delete
              </Button>
              <Button
                className="border-0"
                variant="outlined"
                size="md"
                onClick={() => {
                  setDeleteConfirmationModalOpen(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default CreatorEventsPage;
