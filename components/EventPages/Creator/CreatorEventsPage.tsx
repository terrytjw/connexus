import React, { useState } from "react";
import Button from "../../Button";
import EventsTable from "../EventsTable";

const events = [
  {
    eventId: 0,
    title: "string",
    category: "AUTO_BOAT_AIR",
    location: "string",
    eventDurationType: "SINGLE",
    startDate: "string",
    endDate: "string",
    images: ["/images/bear.jpg"],
    summary: "string",
    description: "string",
    visibilityType: "DRAFT",
    privacyType: "PUBLIC",
    tickets: [
      {
        ticketId: 0,
        name: "string",
        quantity: 0,
        price: 0,
        startDate: "string",
        endDate: "string",
        description: "string",
        event: "string",
        promotion: [
          {
            promotionId: 0,
            name: "string",
            promotionType: "LIMITED",
            promotionValue: 0,
            quantity: 0,
            startDate: "string",
            endDate: "string",
            ticket: "string",
          },
        ],
      },
    ],
  },
];

const CreatorEventsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <main className="py-12 px-4 sm:px-12">
        <h1 className="text-2xl font-bold sm:text-4xl">Events</h1>
        <h3 className="text-md mt-4 sm:text-lg">Set up a new event </h3>

        <div className="mt-6 flex flex-wrap justify-between">
          <h2 className="text-md mt-2 font-bold sm:text-xl">Created Events</h2>
        </div>
        <div className="mt-6 flex flex-wrap justify-between">
          <select
            className="max-w-x select right-8 top-0 bg-white"
            value={activeTab}
            onChange={(e) => {
              setActiveTab(Number(e.target.value));
            }}
          >
            <option disabled selected value={0}>
              Filters
            </option>
          </select>
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
              "Registration No.",
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
