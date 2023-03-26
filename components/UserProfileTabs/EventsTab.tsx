import React, { useEffect, useState } from "react";
import { searchEvents } from "../../lib/api-helpers/user-api";
import { UserWithAllInfo } from "../../pages/api/users/[userId]";
import EventsGrid from "../EventPages/EventsGrid";
import WordToggle from "../Toggle/WordToggle";

type EventsTabProps = {
  userData: UserWithAllInfo;
};
const EventsTab = ({ userData }: EventsTabProps) => {
  const [isCreated, setIsCreated] = useState(false);
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await searchEvents(userData.userId, isCreated);
      setEventData(events);
    };

    fetchEvents();
  }, [isCreated]);

  return (
    <div>
      <WordToggle
        leftWord="Registered"
        rightWord="Created"
        isChecked={isCreated}
        setIsChecked={setIsCreated}
      />
      <div className="mt-12">
        <EventsGrid data={eventData} />
      </div>
    </div>
  );
};

export default EventsTab;
