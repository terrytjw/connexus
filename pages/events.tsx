import {
  Event,
  DurationType,
  PrivacyType,
  VisibilityType,
  Prisma,
  CategoryType,
} from "@prisma/client";

import React, { useEffect, useState } from "react";

const EventsPage = (props: any) => {
  const [eventsArray, setEventArray] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      console.log(props);
      const temp: Event[] = props.events.map((event: any) => {
        return JSON.parse(JSON.stringify(event)) as Event;
      });
      setEventArray(temp);
    };

    fetchEvents();
  }, []);

  async function createEvent() {
    const event: Event = {
      eventId: 1,
      title: "This is a new event",
      category: CategoryType.AUTO_BOAT_AIR,
      location: "Singapore Expo",
      eventDurationType: DurationType.SINGLE,
      startDate: new Date(),
      endDate: new Date(),
      images: [],
      summary: "This is just a summary",
      description: "This is just a description",
      visibilityType: VisibilityType.DRAFT,
      privacyType: PrivacyType.PRIVATE,
    };

    const response = await fetch("http://localhost:3000/api/events", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    console.log(await response.json());
  }

  async function updateEvent() {
    const response = await fetch("http://localhost:3000/api/events/1", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventsArray[0]),
    });

    console.log(await response.json());
  }

  async function deleteEvent() {
    const response = await fetch("http://localhost:3000/api/events/3", {
      method: "DELETE",
    });

    console.log(await response.json());
  }

  return (
    <div>
      EventsPage
      <br />
      <button onClick={updateEvent}>Click me to update</button>;
      <br />
      <button onClick={createEvent}>Click me to create</button>;
      <br />
      <button onClick={deleteEvent}>Click me to delete</button>;
    </div>
  );
};

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const response = await fetch(`http://localhost:3000/api/events`);
  const data = await response.json();

  // // Pass data to the page via props
  return {
    props: {
      events: data,
    },
  };
}

export default EventsPage;
