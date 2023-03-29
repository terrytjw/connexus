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

  // filter by price
  const userTicketData =
    userData.userTicket as unknown as UserWithTicketsAndEvent[];
  const paidMerch = userData.merchandise.filter((item) => item.price !== 0);

  return (
    <main className="h-96">
      <WordToggle
        leftWord="Paid"
        rightWord="Free"
        isChecked={isFree}
        setIsChecked={setIsFree}
      />
      <div className="mt-12">
        {isFree ? (
          <DigitalBadgeGrid data={userTicketData} collectedTab={true} />
        ) : (
          <CollectibleGrid data={paidMerch} collectedTab={true} />
        )}
      </div>
    </main>
  );
};

export default CollectionsTab;
