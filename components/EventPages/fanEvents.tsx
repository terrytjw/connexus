import React, { useState } from "react";
import {
  FaTimes,
  FaSearch,
  FaShareSquare,
  FaUserFriends,
} from "react-icons/fa";
import Avatar from "../Avatar";
import Badge from "../Badge";
import Banner from "../Banner";
import Button from "../Button";
import CustomLink from "../CustomLink";
import EventsCollectionGrid from "../EventsCollectionGrid";
import InputGroup from "../InputGroup";
import Modal from "../Modal";
import TabGroupBordered from "../TabGroupBordered";
import { events } from "../../utils/dummyData";

const FanEventsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const ListedTabContent = () => {
    return (
      <div>
        <EventsCollectionGrid data={events} />
      </div>
    );
  };

  const VisitedTabContent = () => {
    return (
      <div>
        <EventsCollectionGrid data={events} />
      </div>
    );
  };

  const ExpiredTabContent = () => {
    return (
      <div>
        <EventsCollectionGrid data={events} />
      </div>
    );
  };

  return (
    <main className="py-12 px-4 sm:px-12">
      <h1 className="text-4xl font-bold">Events</h1>
      <h3 className="mt-4">Register for a new event </h3>

      <div className="mt-6 mb-3 flex flex-wrap justify-between">
        <h2 className="mt-2 text-xl font-bold">Events in Singapore</h2>
        <Button variant="solid" size="md" className="max-w-xs">
          View Tickets
        </Button>
      </div>
      <div className="relative -mx-6 sm:-mx-8">
        <TabGroupBordered
          tabs={["Listed", "Visited", "Expired"]}
          activeTab={activeTab}
          setActiveTab={(index: number) => {
            setActiveTab(index);
          }}
        >
          {activeTab == 0 && <ListedTabContent />}
          {activeTab == 1 && <VisitedTabContent />}
          {activeTab == 2 && <ExpiredTabContent />}
        </TabGroupBordered>

        <select
          className="bg-whi select absolute right-8 top-0 max-w-xs bg-white"
          value={activeTab}
          onChange={(e) => {
            setActiveTab(Number(e.target.value));
          }}
        >
          <option disabled selected value={0}>
            Filters
          </option>
        </select>
      </div>
    </main>
  );
};

export default FanEventsPage;
