import React, { useEffect, useState } from "react";
import Button from "../../Button";
import TabGroupBordered from "../../TabGroupBordered";
import { BiFilter } from "react-icons/bi";
import { FaSearch, FaTimes } from "react-icons/fa";
import Badge from "../../Badge";
import Modal from "../../Modal";
import EventsGrid from "../EventsGrid";
import { EventWithTicketsandAddress } from "../../../utils/types";
import Link from "next/link";
import { CategoryType, Event } from "@prisma/client";
import axios from "axios";

const DELAY_TIME = 400;

type FanEventsPageProps = {
  events: EventWithTicketsandAddress[];
};

const FanEventsPage = ({ events }: FanEventsPageProps) => {
  const [selectedTopics, setSelectedTopics] = useState<
    string[] | CategoryType[]
  >([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchAndFilterResults, setSearchAndFilterResults] = useState<
    EventWithTicketsandAddress[]
  >([]);
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
      const eventsWithAddresses: EventWithTicketsandAddress[] =
        await Promise.all(
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
      // using this state to display events on initial page load
      // console.log("search api NOT called ");
      setSearchAndFilterResults(events);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchString, selectedTopics]);

  const ListedTabContent = () => {
    // temp client filter to separate list and expired events
    const listedEvents = searchAndFilterResults.filter(
      (event: EventWithTicketsandAddress) =>
        new Date(event.endDate) >= new Date()
    );

    // console.log("upcoming -> ", filterListedEvents());
    return (
      <>
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedTopics.map((label) => {
            return (
              <Button
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
        <EventsGrid data={listedEvents} />
      </>
    );
  };

  const ExpiredTabContent = () => {
    // temp client filter to separate list and expired events
    const expiredEvents = events.filter(
      (event: EventWithTicketsandAddress) =>
        new Date(event.endDate) < new Date()
    );
    return (
      <div>
        <EventsGrid data={expiredEvents} />
      </div>
    );
  };

  return (
    <div>
      <main className="py-12 px-4 sm:px-12">
        <Modal
          isOpen={isFilterModalOpen}
          setIsOpen={setIsFilterModalOpen}
          className="min-w-fit"
        >
          <div className="flex items-center justify-between">
            <h3 className="ml-2 text-xl font-semibold">Filter Topics</h3>
            <Button
              variant="outlined"
              size="sm"
              className="border-0"
              onClick={() => setIsFilterModalOpen(false)}
            >
              Done
            </Button>
          </div>

          <div className="mt-8 mb-4 grid grid-cols-1 justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.values(CategoryType).map((label, index) => {
              return (
                <Badge
                  key={index}
                  label={label}
                  size="lg"
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
                  className="h-8 w-full sm:w-48"
                />
              );
            })}
          </div>
          <Button
            variant="outlined"
            size="sm"
            className="mt-8 w-full text-red-500"
            onClick={() => {
              setSelectedTopics([]);
            }}
          >
            Clear selected topics
          </Button>
        </Modal>
        <h1 className="text-4xl font-bold">Events</h1>
        <h3 className="mt-4">Register for a new event </h3>

        <div className="mt-6 mb-3 flex flex-wrap justify-between">
          <h2 className="mt-2 text-xl font-bold">Events in Singapore</h2>
          <Link href="/events/tickets">
            <Button variant="solid" size="md" className="max-w-xs">
              View Tickets
            </Button>
          </Link>
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

        <div className="relative">
          <TabGroupBordered
            tabs={["Listed", "Expired"]}
            activeTab={activeTab}
            setActiveTab={(index: number) => {
              setActiveTab(index);
            }}
          >
            {activeTab == 0 && <ListedTabContent />}
            {/* {activeTab == 1 && <VisitedTabContent />} */}
            {activeTab == 1 && <ExpiredTabContent />}
          </TabGroupBordered>

          {/* desktop */}
          <div className="absolute right-0 top-8 hidden items-center gap-x-4 lg:flex">
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
            <Button
              variant="solid"
              size="md"
              className="max-w-sm !bg-white !text-gray-700"
              onClick={() => setIsFilterModalOpen(true)}
            >
              Filter by Category
              <BiFilter className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FanEventsPage;
