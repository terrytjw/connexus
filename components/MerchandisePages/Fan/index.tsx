import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import CollectedTab from "./CollectedTab";
import MarketplaceTab from "./MarketplaceTab";
import Select from "../../Select";
import TabGroupBordered from "../../TabGroupBordered";
import { collectibles, collections } from "../../../utils/dummyData";
import {
  filterByMerchandisePurchaseType,
  MerchandisePriceType,
} from "../../../pages/api/merch";

const FanCollectionsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchString, setSearchString] = useState("");

  const collectedTabfilters = [
    { id: 1, name: "Filter By" },
    { id: 2, name: "Free-of-Charge" },
    { id: 3, name: "Purchased" },
  ];
  const marketplaceTabfilters = [
    { id: 4, name: "Filter By" },
    { id: 5, name: "Linked to Premium Channel" },
    { id: 6, name: "Not Linked" },
  ];

  const [collectedTabfilterSelected, setCollectedTabfilterSelected] = useState(
    activeTab === 0 ? collectedTabfilters[0] : marketplaceTabfilters[0]
  );
  const [marketplaceTabfilterSelected, setMarketplaceTabfilterSelected] =
    useState(
      activeTab === 0 ? collectedTabfilters[0] : marketplaceTabfilters[0]
    );

  useEffect(() => {
    console.log(
      "collectedTabfilterSelected -> ",
      collectedTabfilterSelected.name.toLowerCase()
    );

    if (collectedTabfilterSelected.name.toLowerCase() === "free-of-charge") {
      // call some endpoint
      filterByMerchandisePurchaseType(1, 1, MerchandisePriceType.FREE);
    }

    if (collectedTabfilterSelected.name.toLowerCase() === "purchased") {
      // call some endpoint
      // filterByMerchandisePurchaseType(1, 1, MerchandisePriceType.PAID);
    }
  }, [collectedTabfilterSelected.name]);

  return (
    <main className="py-12 px-4 sm:px-12">
      <h1 className="text-4xl font-bold">
        {activeTab === 0
          ? "Your Digital Merchandise Collection"
          : "Browse Digital Merchandise Collections"}
      </h1>
      <h3 className="mt-4">
        {activeTab === 0
          ? "View all your collected digital merchandise"
          : "Take a look at all these collections by other creators!"}
      </h3>

      {/* mobile */}
      <div className="mt-8 flex w-full gap-2 lg:hidden">
        <div className="relative w-full items-center justify-center rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch />
          </div>
          <input
            className="input-outlined input input-md block w-full rounded-md pl-10"
            type="text"
            value={searchString}
            placeholder="Search Collection"
            onChange={(e) => {
              setSearchString(e.target.value);
            }}
          />
        </div>
        <Select
          data={activeTab === 0 ? collectedTabfilters : marketplaceTabfilters}
          selected={
            activeTab === 0
              ? collectedTabfilterSelected
              : marketplaceTabfilterSelected
          }
          setSelected={
            activeTab === 0
              ? setCollectedTabfilterSelected
              : setMarketplaceTabfilterSelected
          }
        />
      </div>

      <div className="relative">
        <TabGroupBordered
          tabs={["Collected", "Marketplace"]}
          activeTab={activeTab}
          setActiveTab={(index: number) => {
            setActiveTab(index);
          }}
        >
          {activeTab == 0 && <CollectedTab products={collectibles} />}
          {activeTab == 1 && <MarketplaceTab products={collections} />}
        </TabGroupBordered>

        {/* desktop */}
        <div className="absolute right-0 top-8 hidden items-center gap-x-4 lg:flex">
          <div className="relative w-full items-center justify-center rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch />
            </div>
            <input
              className="input-outlined input input-md block w-48 rounded-md pl-10"
              type="text"
              value={searchString}
              placeholder="Search Collection"
              onChange={(e) => {
                setSearchString(e.target.value);
                // call some endpoint
                // console.log("val -> ", e.target.value);
                // filterByMerchandisePurchaseType(e.target.value)
              }}
            />
          </div>
          <Select
            data={activeTab === 0 ? collectedTabfilters : marketplaceTabfilters}
            selected={
              activeTab === 0
                ? collectedTabfilterSelected
                : marketplaceTabfilterSelected
            }
            setSelected={
              activeTab === 0
                ? setCollectedTabfilterSelected
                : setMarketplaceTabfilterSelected
            }
            className="w-64"
          />
        </div>
      </div>
    </main>
  );
};

export default FanCollectionsPage;
