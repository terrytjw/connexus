import React, { useState } from "react";
import Button from "../../Button";
import EventsTable from "../EventsTable";

import { EventWithTicketsandAddress } from "../../../utils/types";
import Modal from "../../Modal";
import { BiFilter } from "react-icons/bi";

type CreatorEventsPageProps = {
  events: EventWithTicketsandAddress[];
};

const CreatorEventsPage = ({ events }: CreatorEventsPageProps) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  console.log(events);
  return (
    <div>
      <main className="py-12 px-4 sm:px-12">
        {/* Fitler modal */}
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
        </Modal>

        {/* Rest of page */}
        <h1 className="text-2xl font-bold sm:text-4xl">Events</h1>
        <h3 className="text-md mt-4 sm:text-lg">Set up a new event </h3>

        <div className="mt-6 flex flex-wrap justify-between">
          <h2 className="text-md mt-2 font-bold sm:text-xl">Created Events</h2>
        </div>
        <div className="mt-6 flex flex-wrap justify-between">
          <Button
            variant="solid"
            size="md"
            className="max-w-sm !bg-white !text-gray-700"
            onClick={() => setIsFilterModalOpen(true)}
          >
            Filter by Category
            <BiFilter className="h-8 w-8" />
          </Button>
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
          <EventsTable
            data={events}
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
