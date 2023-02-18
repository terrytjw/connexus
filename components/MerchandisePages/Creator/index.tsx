import React, { useState } from "react";
import TabGroupBordered from "../../TabGroupBordered";
import Button from "../../Button";
import { useRouter } from "next/router";

const CreatorMerchandisePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="relative py-2">
      <Button
        variant="solid"
        size="md"
        className=" mt-4 lg:absolute lg:right-0 lg:top-6"
        onClick={() => router.push("/merchandise/create")}
      >
        Create new merchandise
      </Button>
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
