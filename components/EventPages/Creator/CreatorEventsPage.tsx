import React, { useEffect, useState } from "react";
import Button from "../../Button";
import EventsTable from "../EventsTable";

import { EventWithTicketsandAddress } from "../../../utils/types";
import Modal from "../../Modal";
import { BiFilter } from "react-icons/bi";
import { CategoryType } from "@prisma/client";
import axios from "axios";
import Badge from "../../Badge";
import { FaSearch, FaTimes } from "react-icons/fa";

const DELAY_TIME = 400;

type CreatorEventsPageProps = {
  events: EventWithTicketsandAddress[];
};

const CreatorEventsPage = ({ events }: CreatorEventsPageProps) => {
  const [selectedTopics, setSelectedTopics] = useState<
    string[] | CategoryType[]
  >([]);
  const [searchString, setSearchString] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchAndFilterResults, setSearchAndFilterResults] = useState<
    EventWithTicketsandAddress[]
  >([]);
  console.log(events);

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

  return (
    <div>
      <main className="py-12 px-4 sm:px-12">
        {/* Abstract Fitler modal */}
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

        {/* Rest of page */}
        <h1 className="text-2xl font-bold sm:text-4xl">Events</h1>
        <h3 className="text-md mt-4 sm:text-lg">Set up a new event </h3>

        <div className="mt-6 flex flex-wrap justify-between">
          <h2 className="text-md mt-2 font-bold sm:text-xl">Created Events</h2>
        </div>

        {/* dekstop filter and search */}
        <div className="invisible mt-6 flex flex-wrap justify-between sm:visible">
          <div className="flex gap-4">
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
          <Button
            href="/events/create"
            variant="solid"
            size="md"
            className="max-w-xs"
          >
            Create Event
          </Button>
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
              "Attendees Number",
              "Location",
              "Tags",
              "Status",
            ]}
          />
        </section>
      </main>
    </div>
  );
};

export default CreatorEventsPage;
