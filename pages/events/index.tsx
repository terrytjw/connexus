import React, { useState } from "react";
import axios from "axios";
import { GetServerSideProps, GetStaticProps } from "next";
import Toggle from "../../components/Toggle";
import CreatorEventsPage from "../../components/EventPages/Creator/CreatorEventsPage";
import FanEventsPage from "../../components/EventPages/Fan/FanEventsPage";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";

import {
  Event,
  Ticket,
  PrivacyType,
  Promotion,
  VisibilityType,
  CategoryType,
} from "@prisma/client";
import { EventWithTicketsandAddress } from "../../utils/types";
import { events } from "../../utils/dummyData";

const EventsPage = ({ events }) => {
  const [isCreator, setIsCreator] = useState<boolean>(false);

  // async function fetchEvents(url: string) {
  //   const response = await axios.get(url);
  //   const data = response.data as EventWithTicketsandAddress[];
  //   return data;
  // }

  console.log(events);

  // temporary filter
  const filterEvents = (
    events: EventWithTicketsandAddress[]
  ): EventWithTicketsandAddress[] => {
    if (!isCreator) {
      // see only public and published events
      return events.filter(
        (event) =>
          event?.privacyType === PrivacyType.PUBLIC &&
          event?.visibilityType === VisibilityType.PUBLISHED
      );
    }
    return events;
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex justify-start p-8">
          {isCreator ? "Creator" : "Fan"}
          <Toggle isChecked={isCreator} setIsChecked={setIsCreator} />
        </div>
        {isCreator ? (
          <CreatorEventsPage events={filterEvents(events)} />
        ) : (
          <FanEventsPage events={filterEvents(events)} />
        )}
      </Layout>
    </ProtectedRoute>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // use axios GET method to fetch data
  const { data: events } = await axios.get("http://localhost:3000/api/events");

  return {
    props: {
      events,
    },
  };
};

export default EventsPage;
