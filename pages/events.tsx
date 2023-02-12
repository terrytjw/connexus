import {
  Event,
  DurationType,
  PrivacyType,
  VisibilityType,
  Prisma,
  CategoryType,
} from "@prisma/client";
import useSWR from "swr";
import axios from "axios";

import React from "react";

type EventWithTickets = Prisma.EventGetPayload<{ include: { tickets: true } }>;

const EventsPage = (props: any) => {
  async function fetchEvents(url: string) {
    const response = await axios.get(url);
    const data = response.data as EventWithTickets[];
    return data;
  }

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

    let response = await axios.post("http://localhost:3000/api/events", event);
    let data = response.data;
    console.log(data);
  }

  async function updateEvent() {
    const event: Event = {
      eventId: 1,
      title: "This is a new updated event",
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

    let response = await axios.post(
      "http://localhost:3000/api/events/1",
      event
    );
    let data = response.data;
    console.log(data);
  }

  async function deleteEvent() {
    let response = await axios.delete("http://localhost:3000/api/events/3");
    let data = response.data;
    console.log(data);
  }

  const { data, error, isLoading } = useSWR(
    "http://localhost:3000/api/events",
    fetchEvents
  );

  console.log(data);

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

export default EventsPage;
