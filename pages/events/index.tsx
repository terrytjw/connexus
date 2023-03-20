import React, { useEffect, useState } from "react";
import axios from "axios";
import { GetServerSideProps } from "next";
import CreatorEventsPage from "../../components/EventPages/Creator/CreatorEventsPage";
import FanEventsPage from "../../components/EventPages/Fan/FanEventsPage";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";

import { Event, PrivacyType, User, VisibilityType } from "@prisma/client";
import { EventWithAllDetails } from "../../utils/types";
import { useUserRole } from "../../utils/hooks";

type EventsPageProps = {
  events: EventWithAllDetails[];
};

const EventsPage = ({ events }: EventsPageProps) => {
  const [isFan, setIsFan] = useUserRole();
  console.log("is fan ->", isFan);

  useEffect(() => console.log(isFan), [isFan]);

  console.log(events);

  // temporary filter to see only public events TODO: filter on server side or make it into an api call
  const filterEvents = (
    events: EventWithAllDetails[]
  ): EventWithAllDetails[] => {
    if (isFan) {
      // see only public and published events
      return events?.filter(
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
        {!isFan ? (
          <CreatorEventsPage events={filterEvents(events)} />
        ) : (
          <FanEventsPage events={filterEvents(events)} />
        )}
      </Layout>
    </ProtectedRoute>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { data } = await axios.get("http://localhost:3000/api/events");

  const events = await Promise.all(
    data.map(async (event: Partial<Event>) => {
      const { data: address } = await axios.get(
        `http://localhost:3000/api/addresses/${event?.addressId}`
      );

      return { ...event, address };
    })
  );

  return {
    props: {
      events,
    },
  };
};

export default EventsPage;
