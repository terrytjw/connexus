import React, { useState } from "react";
import { UserWithAllInfo } from "../../pages/api/users/[userId]";
import CollectibleGrid from "../CollectibleGrid";
import WordToggle from "../Toggle/WordToggle";

type CollectionsTabProps = {
  userData: UserWithAllInfo;
};
const CollectionsTab = ({ userData }: CollectionsTabProps) => {
  const [isFree, setIsFree] = useState(false);

  // filter by price
  const freeMerch = userData.merchandise.filter((item) => item.price === 0);
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
        <CollectibleGrid
          data={isFree ? freeMerch : paidMerch}
          collectedTab={true}
        />
      </div>
    </main>
  );
};

export default CollectionsTab;
