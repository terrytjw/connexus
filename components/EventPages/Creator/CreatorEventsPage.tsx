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
import { FiCalendar } from "react-icons/fi";
import EventWordToggle from "../EventWordToggle";
import { useRouter } from "next/router";
import Input from "../../Input";
import { filterEvent } from "../../../lib/api-helpers/event-api";
import { useSession } from "next-auth/react";
import { formatDateWithLocalTime } from "../../../utils/date-util";
import { API_URL } from "../../../lib/constant";

const DELAY_TIME = 400;

type CreatorEventsPageProps = {
  events: EventWithAllDetails[];
};

const CreatorEventsPage = ({ events }: CreatorEventsPageProps) => {
  const router = useRouter();
  const [isCreated, setIsCreated] = useState<boolean>(false); // rendering using this  state is abit janky but it works
  const [selectedTopics, setSelectedTopics] = useState<CategoryType[]>([]);
  const [searchString, setSearchString] = useState("");
  const [fromDateFilter, setFromDateFilter] = useState<Date | undefined>(
    undefined
  );
  const [toDateFilter, setToDateFilter] = useState<Date | undefined>(undefined);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchAndFilterResults, setSearchAndFilterResults] = useState<
    EventWithAllDetails[]
  >([]);
  const [visibilityType, setVisibilityType] = useState<
    VisibilityType | undefined
  >(undefined);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState<boolean>(false);
  const [eventIdToDelete, setEventIdToDelete] = useState<number | undefined>();

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
      // console.log("passing in filters ->", {
      //   searchTerm,
      //   selectedTopics,
      //   fromDate: fromDateFilter,
      //   toDate: toDateFilter,
      //   visibilityType: visibilityType,
      // });
      const data = await filterEvent(
        searchTerm,
        selectedTopics,
        fromDateFilter,
        toDateFilter,
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
      fromDateFilter ||
        toDateFilter ||
        visibilityType ||
        selectedTopics.length > 0
    );
  };

  const clearFilters = (): void => {
    setSelectedTopics([]);
    setFromDateFilter(undefined);
    setToDateFilter(undefined);
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
    const initialEventData = await filterEvent(
      undefined,
      [],
      undefined,
      undefined,
      userId,
      undefined
    );
    // using this state to display events on initial page load
    setSearchAndFilterResults(filterCreatedEvents(initialEventData));
  };

  // listens to created and ended events toggle
  useEffect(() => {
    if (!isCreated) {
      clearFilters();
      // setSearchAndFilterResults(filterCreatedEvents(events));
      setInitialFilterResults();
    } else {
      // created events
      clearFilters();
      // setSearchAndFilterResults(filterCreatedEvents(events));
      setInitialFilterResults();
    }
    // ended events
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
  }, [
    searchString,
    selectedTopics,
    fromDateFilter,
    toDateFilter,
    visibilityType,
  ]);

  return (
    <div>
      <main className="py-12 px-4 sm:px-12">
        <h1 className="text-2xl font-bold sm:text-4xl">Events</h1>

        <div className="mt-4 flex flex-wrap justify-between sm:mt-6">
          <h2 className="text-md mt-2 font-bold sm:text-xl">Created Events</h2>
        </div>

        {/* dekstop filter and search */}
        <div className="mt-6 hidden flex-wrap justify-between sm:flex">
          <div className="flex gap-4">
            <EventWordToggle
              leftWord="Created"
              rightWord="Ended"
              isChecked={isCreated}
              setIsChecked={setIsCreated}
            />
            <Button
              href="/events/create"
              variant="solid"
              size="md"
              className="max-w-xs shadow-md"
            >
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
        <div className="mt-6 flex-col gap-2 sm:hidden ">
          <div className="flex gap-4">
            <Button
              href="/events/create"
              variant="solid"
              size="md"
              className="max-w-xs shadow-md"
            >
              <FiCalendar className="text-lg text-neutral-50" />
            </Button>
          </div>
          <div className="mt-4 flex w-full gap-2 ">
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
          </div>
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
          <div className="mt-2 flex-col justify-between gap-8">
            <Input
              type="datetime-local"
              label="From"
              value={formatDateWithLocalTime(fromDateFilter)}
              onChange={(e) => setFromDateFilter(new Date(e.target.value))}
              placeholder="From Date and Time"
              size="xs"
              variant="bordered"
              className="max-w-3xl align-middle text-gray-500"
            />
            <Input
              type="datetime-local"
              label="To"
              value={formatDateWithLocalTime(toDateFilter)}
              onChange={(e) => setToDateFilter(new Date(e.target.value))}
              placeholder="From Date and Time"
              size="xs"
              variant="bordered"
              className="max-w-3xl align-middle text-gray-500"
            />
          </div>

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
                    `${API_URL}/events/${eventIdToDelete}`
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
