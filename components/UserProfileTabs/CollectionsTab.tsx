import React, { useState } from "react";
import { UserWithAllInfo } from "../../pages/api/users/[userId]";
import {
  MerchandiseWithCollectionName,
  UserWithTicketsAndEvent,
} from "../../utils/types";
import CollectibleGrid from "../CollectibleGrid";
import DigitalBadgeGrid from "../DigitalBadgeGrid";
import WordToggle from "../Toggle/WordToggle";

type CollectionsTabProps = {
  userData: UserWithAllInfo;
};
const CollectionsTab = ({ userData }: CollectionsTabProps) => {
  const [isFree, setIsFree] = useState(false);

  const userTicketData =
    userData.userTicket as unknown as UserWithTicketsAndEvent[];

  return (
    <main className="">
      <WordToggle
        leftWord="Merchandise"
        rightWord="Badge"
        isChecked={isFree}
        setIsChecked={setIsFree}
      />
      <div className="mt-12">
        {isFree ? (
          <DigitalBadgeGrid data={userTicketData} collectedTab={true} />
        ) : (
          <CollectibleGrid data={userData.merchandise} collectedTab={true} />
        )}
      </div>
    </main>
  );
};

export default CollectionsTab;
