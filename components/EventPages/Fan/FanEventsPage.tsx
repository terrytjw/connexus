import React, { useEffect, useState } from "react";
import Button from "../../Button";
import TabGroupBordered from "../../TabGroupBordered";
import { BiFilter } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import Badge from "../../Badge";
import Modal from "../../Modal";
import EventsGrid from "../EventsGrid";
import { EventWithTicketsandAddress } from "../../../utils/types";
import Link from "next/link";
import { CategoryType, Event } from "@prisma/client";
import axios from "axios";

const DELAY_TIME = 500;

type FanEventsPageProps = {
  events: EventWithTicketsandAddress[];
};

const FanEventsPage = ({ events }: FanEventsPageProps) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<
    EventWithTicketsandAddress[]
  >([]);
  const [searchResults, setSearchResults] = useState<
    EventWithTicketsandAddress[]
  >([]);
  // Initialize a variable to hold the timeout ID
  let timeoutId: ReturnType<typeof setTimeout>;

  function debounceSearchApiCall(searchTerm: string) {
    // Clear any existing timeout
    clearTimeout(timeoutId);

    // Set a new timeout to execute the search API call after the delay time has elapsed
    timeoutId = setTimeout(() => {
      // Make the search API call with the given search term
      searchEvents(searchTerm);
    }, DELAY_TIME);
  }
  async function searchEvents(searchTerm: string) {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/events?keyword=${searchTerm}`
      );

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
      setSearchResults(eventsWithAddresses);
    } catch (error) {
      console.error(error);
    }
  }

  async function filterEvents(filterTerm: string) {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/events?filter=${filterTerm}`
      );
      setFilteredEvents(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    debounceSearchApiCall(searchString);

    // Filter
    if (selectedTopics.length !== 0) {
      filterEvents(selectedTopics[0]);
    } else {
      setFilteredEvents([]);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchString, selectedTopics]);

  console.log("search results events", searchResults);
  console.log("filter events", filteredEvents);

  // if (isLoading) return <Loading />;

  const ListedTabContent = () => {
    const filterEvents = () => {
      if (searchString || selectedTopics.length !== 0) {
        const upcomingAndOngoingEvents = searchResults.filter(
          (event: EventWithTicketsandAddress) =>
            new Date(event.endDate) >= new Date()
        );
        return upcomingAndOngoingEvents;
      } else {
        const upcomingAndOngoingEvents = events.filter(
          (event: EventWithTicketsandAddress) =>
            new Date(event.endDate) >= new Date()
        );
        return upcomingAndOngoingEvents;
      }
    };

    console.log("upcoming -> ", filterEvents());
    return (
      <div>
        <EventsGrid data={filterEvents()} />
      </div>
    );
  };

  const ExpiredTabContent = () => {
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
        <Modal isOpen={isFilterModalOpen} setIsOpen={setIsFilterModalOpen}>
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

          <div className="mt-8 mb-4 grid grid-cols-1 justify-center gap-4 sm:grid-cols-2">
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
              <FaSearch />
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
                <FaSearch />
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
