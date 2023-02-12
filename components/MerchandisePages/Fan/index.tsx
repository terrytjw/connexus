import React, { useState } from "react";
import TabGroupBordered from "../../TabGroupBordered";
import CollectedTab from "./CollectedTab";
import MarketplaceTab from "./MarketplaceTab";
import { profile, products } from "../../../utils/dummyData";

const FanMerchandisePage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="py-2">
      <TabGroupBordered
        tabs={["Collected", "Marketplace"]}
        activeTab={activeTab}
        setActiveTab={(index: number) => {
          setActiveTab(index);
        }}
      >
        <h1 className="p-2 font-bold italic text-red-500">
          TODO: switch to a different collection grid
        </h1>
        {activeTab == 0 && <CollectedTab products={products} />}
        {activeTab == 1 && <MarketplaceTab products={products} />}
      </TabGroupBordered>
    </div>
  );
};

export default FanMerchandisePage;
