import { CategoryType } from "@prisma/client";
import { has } from "lodash";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiFilter, BiInfoCircle } from "react-icons/bi";
import { FaSearch, FaTimes } from "react-icons/fa";
import useSWR from "swr";
import {
  filterEvent,
  retrieveVisitedEvents,
  viewExpiredEvent,
  viewTrendingEvents,
} from "../../../lib/api-helpers/event-api";
import { EventWithAllDetails } from "../../../utils/types";
import Badge from "../../Badge";
import Button from "../../Button";
import Loading from "../../Loading";
import Modal from "../../Modal";
import TabGroupBordered from "../../TabGroupBordered";
import EventsGrid from "../EventsGrid";
// @ts-ignore
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DELAY_TIME = 400;

type FanEventsPageProps = {
  events: EventWithAllDetails[];
};

const FanEventsPage = ({ events }: FanEventsPageProps) => {
  const [selectedTopics, setSelectedTopics] = useState<CategoryType[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [dateRange, setDateRange] = useState([
    {
      startDate: undefined,
      endDate: new Date(""),
      key: "selection",
    },
  ]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchAndFilterResults, setSearchAndFilterResults] = useState<
    EventWithAllDetails[]
  >([]);

  // fetch userId if from session
  const { data: session, status } = useSession();
  const userId = session?.user.userId;

  const hasFilters = (): boolean => {
    return Boolean(dateRange[0].startDate || selectedTopics.length > 0);
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
  };

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

  // this function retrieves the latest events with the given filters and search term
  const searchAndFilterEvents = async (searchTerm: string) => {
    try {
      // console.log("passing in filters ->", {
      //   searchTerm,
      //   selectedTopics,
      //   fromDate: fromDateFilter,
      //   toDate: toDateFilter,
      //   visibilityType: undefined,
      // });
      const data = await filterEvent(
        searchTerm,
        selectedTopics,
        dateRange[0].startDate,
        dateRange[0].startDate ? dateRange[0].endDate : undefined,
        undefined // this is used for creator events page
      );

      // console.log("filtered data ->", data);
      setSearchAndFilterResults(data);
    } catch (error) {
      console.error(error);
    }
  };

  // listen to filter and search changes
  useEffect(() => {
    // dont debounce on first page load
    if (searchString !== "" || hasFilters()) {
      debounceSearchApiCall(searchString);
    } else {
      // using this state to display events on initial page load
      setSearchAndFilterResults(events);
    }
  }, [searchString, selectedTopics, dateRange]);

  const handleFilterSubmit = () => {
    searchAndFilterEvents(searchString);
    setIsFilterModalOpen(false);
  };

  // Listed Tab
  const ListedTabContent = () => {
    // client filter for listed events
    const listedEvents = searchAndFilterResults.filter(
      (event: EventWithAllDetails) => new Date(event.endDate) >= new Date()
    );

    const {
      data: trendingEvents,
      isLoading: isTrendingEventsLoading,
      mutate: mutateTrendingEvents,
    } = useSWR("trendingEvents", viewTrendingEvents);

    if (isTrendingEventsLoading) return <Loading />;

    return (
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

        {/* Trending Events  */}
        <div>
          <div className="flex gap-4">
            <h2 className="mb-6 text-2xl font-semibold tracking-wide text-slate-600">
              Trending Events in SG
            </h2>
            <div className="tooltip" data-tip="Most Liked Events">
              <Button
                variant="solid"
                size="sm"
                className="!bg-blue-100 !text-blue-500"
              >
                i
              </Button>
            </div>
          </div>

          <EventsGrid
            data={trendingEvents}
            mutateTrendingEvents={mutateTrendingEvents}
            isListed={true}
          />
        </div>
        <div>
          <h2 className="mt-12 mb-6 text-2xl font-semibold tracking-wide text-slate-600">
            Events in Singapore
          </h2>
          <EventsGrid
            data={listedEvents}
            setSearchAndFilterResults={setSearchAndFilterResults}
            isListed={true}
          />
        </div>
      </>
    );
  };

  // Visited Tab
  const VisitedTabContent = () => {
    const {
      data: visitedEvents,
      error,
      isLoading,
    } = useSWR(
      "visitedEvents",
      async () => await retrieveVisitedEvents(Number(userId))
    );

    if (isLoading) return <Loading />;

    return (
      <div>
        {/* info alert */}
        <div className="mb-4 rounded-lg border border-gray-400 bg-neutral-50 px-2 py-3 shadow-md">
          <div className="flex items-center gap-2">
            <BiInfoCircle className="text-blue-600" size={24} />
            <span className="sm:text-md text-sm text-gray-500">
              Events that you have{" "}
              <span className="font-medium">registered for</span> and{" "}
              <span className="font-medium">attended</span>.
            </span>
          </div>
        </div>
        <EventsGrid data={visitedEvents} />
      </div>
    );
  };

  // Expired Tab
  const ExpiredTabContent = () => {
    const {
      data: expiredEvents,
      error,
      isLoading,
    } = useSWR(
      "expiredEvents",
      async () => await viewExpiredEvent(Number(userId))
    );

    if (isLoading) return <Loading />;

    return (
      <div>
        {/* info alert */}
        <div className="mb-4 rounded-lg border border-gray-400 bg-neutral-50 px-2 py-3 shadow-md">
          <div className="flex items-center gap-2">
            <BiInfoCircle className="text-blue-600" size={24} />
            <span className="sm:text-md text-sm text-gray-500">
              Events that you have{" "}
              <span className="font-medium">registered for</span> and{" "}
              <span className="font-medium">did not attend</span>.
            </span>
          </div>
        </div>
        <EventsGrid data={expiredEvents} />
      </div>
    );
  };

  return (
    <div>
      <main className="py-12 px-4 sm:px-12">
        {/* Fitler modal */}
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
          <DateRange
            showSelectionPreview={false}
            showDateDisplay={false}
            onChange={(item: any) => setDateRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            className="w-full min-w-fit [&_div]:w-full"
          />

          <Button
            variant="solid"
            size="md"
            className="mt-8"
            onClick={handleFilterSubmit}
          >
            Submit
          </Button>
        </Modal>
        <h1 className="text-4xl font-bold">Browse Events</h1>
        <h3 className="mt-4 ">
          Take a look at all these events by other creators and register for a
          new event!
        </h3>

        <div className="mt-10 hidden items-center justify-between gap-x-4 lg:flex">
          <Link href="/events/tickets">
            <Button variant="solid" size="md" className="max-w-xs">
              View Tickets
            </Button>
          </Link>
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
              className="max-w-sm !bg-white !text-gray-700"
              onClick={() => setIsFilterModalOpen(true)}
            >
              Filter
              <BiFilter className="h-8 w-8" />
            </Button>
          </div>
        </div>

        {/* mobile */}
        <div className="mt-8 flex w-full gap-2 lg:hidden">
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
            className="h-12 w-10"
            onClick={() => setIsFilterModalOpen(true)}
          />
        </div>

        <div className="relative">
          <TabGroupBordered
            tabs={["Listed", "Visited", "Expired"]}
            activeTab={activeTab}
            setActiveTab={(index: number) => {
              setActiveTab(index);
            }}
          >
            {activeTab == 0 && <ListedTabContent />}
            {activeTab == 1 && <VisitedTabContent />}
            {activeTab == 2 && <ExpiredTabContent />}
          </TabGroupBordered>
        </div>
      </main>
    </div>
  );
};

export default FanEventsPage;
