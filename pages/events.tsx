import React, { useState } from "react";
import Toggle from "../components/Toggle";
import CreatorEventsPage from "../components/EventPages/creatorEvents";
import FanEventsPage from "../components/EventPages/fanEvents";

const EventsPage = () => {
  const [isCreator, setIsCreator] = useState<boolean>(false);
  return (
    <div>
      <div className="flex justify-start p-8">
        {isCreator ? "Creator" : "Fan"}
        <Toggle isChecked={isCreator} setIsChecked={setIsCreator} />
      </div>
      {isCreator ? <CreatorEventsPage /> : <FanEventsPage />}
    </div>
  );
};

export default EventsPage;
