import React, { useState } from "react";
import TabGroupBordered from "../../TabGroupBordered";
import CollectedTab from "../Fan/CollectedTab";
import MarketplaceTab from "../Fan/MarketplaceTab";
import { products } from "../../../utils/dummyData";

const CreatorMerchandisePage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="py-2">
      <TabGroupBordered
        tabs={["Featured", "Created", "On Sale", "Sold"]}
        activeTab={activeTab}
        setActiveTab={(index: number) => {
          setActiveTab(index);
        }}
      >
        {activeTab == 0 && <h1>Featured</h1>}
        {activeTab == 1 && <h1>Created</h1>}
        {activeTab == 2 && <h1>On Sale</h1>}
        {activeTab == 3 && <h1>Sold</h1>}
      </TabGroupBordered>
    </div>
  );
};

export default CreatorMerchandisePage;
