import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { BiFilter } from "react-icons/bi";
import { FaSearch, FaTimes } from "react-icons/fa";
import CollectedTab from "./CollectedTab";
import MarketplaceTab from "./MarketplaceTab";
import Badge from "../../Badge";
import Button from "../../Button";
import Modal from "../../Modal";
import TabGroupBordered from "../../TabGroupBordered";
import { MerchandisePriceType } from "../../../pages/api/merch";
import {
  CollectionWithMerchAndPremiumChannel,
  searchAllCollections,
} from "../../../lib/api-helpers/collection-api";
import { searchCollectedMerchandise } from "../../../lib/api-helpers/merchandise-api";
import { MerchandiseWithCollectionName } from "../../../utils/types";

type FanCollectionsPageProps = {
  merchandiseData: MerchandiseWithCollectionName[];
  collectionsData: CollectionWithMerchAndPremiumChannel[];
};

const FanCollectionsPage = ({
  merchandiseData,
  collectionsData,
}: FanCollectionsPageProps) => {
  const { data: session } = useSession();
  const userId = Number(session?.user.userId);

  const [activeTab, setActiveTab] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [merchandise, setMerchandise] = useState(merchandiseData);
  const [collections, setCollections] = useState(collectionsData);

  const [collectedTabfilterSelected, setCollectedTabfilterSelected] =
    useState("");
  const [marketplaceTabfilterSelected, setMarketplaceTabfilterSelected] =
    useState("");

  const searchCollected = async () => {
    if (collectedTabfilterSelected === "Free-of-Charge") {
      const res = await searchCollectedMerchandise(
        userId,
        searchString,
        0,
        MerchandisePriceType.FREE
      );
      setMerchandise(res);
    } else if (collectedTabfilterSelected === "Purchased") {
      const res = await searchCollectedMerchandise(
        userId,
        searchString,
        0,
        MerchandisePriceType.PAID
      );
      setMerchandise(res);
    } else {
      const res = await searchCollectedMerchandise(userId, searchString, 0);
      setMerchandise(res);
    }
  };

  const searchCollections = async () => {
    if (marketplaceTabfilterSelected === "Linked to Premium Channel") {
      const res = await searchAllCollections(0, searchString, true);
      setCollections(res);
    } else if (marketplaceTabfilterSelected === "Not Linked") {
      const res = await searchAllCollections(0, searchString, false);
      setCollections(res);
    } else {
      const res = await searchAllCollections(0, searchString);
      setCollections(res);
    }
  };

  useEffect(() => {
    searchCollected();
  }, [searchString, collectedTabfilterSelected]);

  useEffect(() => {
    searchCollections();
  }, [searchString, marketplaceTabfilterSelected]);

  return (
    <main className="py-12 px-4 sm:px-12">
      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        className="min-w-fit"
      >
        <div className="flex items-center justify-between">
          <h3 className="ml-2 text-xl font-semibold">
            {activeTab == 0
              ? "Filter Collected Merchandise"
              : "Filter Collections"}
          </h3>
          <Button
            variant="outlined"
            size="sm"
            className="border-0 text-red-500"
            onClick={() => {
              activeTab == 0
                ? setCollectedTabfilterSelected("")
                : setMarketplaceTabfilterSelected("");
            }}
          >
            Clear
          </Button>
        </div>

        <div className="mt-8 mb-4 flex flex-wrap gap-4">
          {activeTab == 0 ? (
            <>
              <Badge
                label="Free-of-Charge"
                size="lg"
                selected={collectedTabfilterSelected === "Free-of-Charge"}
                onClick={() => setCollectedTabfilterSelected("Free-of-Charge")}
                className="h-8 w-full min-w-fit rounded-lg sm:w-fit"
              />
              <Badge
                label="Purchased"
                size="lg"
                selected={collectedTabfilterSelected === "Purchased"}
                onClick={() => setCollectedTabfilterSelected("Purchased")}
                className="h-8 w-full min-w-fit rounded-lg sm:w-fit"
              />
            </>
          ) : (
            <>
              <Badge
                label="Linked to Premium Channel"
                size="lg"
                selected={
                  marketplaceTabfilterSelected === "Linked to Premium Channel"
                }
                onClick={() =>
                  setMarketplaceTabfilterSelected("Linked to Premium Channel")
                }
                className="h-8 w-full min-w-fit rounded-lg sm:w-fit"
              />
              <Badge
                label="Not Linked"
                size="lg"
                selected={marketplaceTabfilterSelected === "Not Linked"}
                onClick={() => setMarketplaceTabfilterSelected("Not Linked")}
                className="h-8 w-full min-w-fit rounded-lg sm:w-fit"
              />
            </>
          )}
        </div>
        <Button
          variant="solid"
          size="sm"
          className="mt-8 w-full"
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          Done
        </Button>
      </Modal>

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
            <FaSearch className="text-gray-500" />
          </div>
          <input
            className="input-outlined input input-md block w-full rounded-md pl-10"
            type="text"
            value={searchString}
            placeholder={
              activeTab == 0 ? "Search Collected" : "Search Collections"
            }
            onChange={(e) => setSearchString(e.target.value)}
          />
        </div>
        <BiFilter className="h-12 w-10" onClick={() => setIsModalOpen(true)} />
      </div>

      <div className="relative">
        <TabGroupBordered
          tabs={["Collected", "Marketplace"]}
          activeTab={activeTab}
          setActiveTab={(index: number) => {
            setActiveTab(index);
            setSearchString("");
          }}
        >
          {activeTab == 0 && (
            <>
              {collectedTabfilterSelected ? (
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={(e) => e.preventDefault()}
                  className="mb-4 font-normal"
                >
                  {collectedTabfilterSelected}
                  <FaTimes
                    onClick={() => {
                      setCollectedTabfilterSelected("");
                    }}
                  />
                </Button>
              ) : null}
              <CollectedTab collectedMerchandise={merchandise} />
            </>
          )}
          {activeTab == 1 && (
            <>
              {marketplaceTabfilterSelected ? (
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={(e) => e.preventDefault()}
                  className="mb-4 font-normal"
                >
                  {marketplaceTabfilterSelected}
                  <FaTimes
                    onClick={() => {
                      setMarketplaceTabfilterSelected("");
                    }}
                  />
                </Button>
              ) : null}
              <MarketplaceTab collections={collections} />
            </>
          )}
        </TabGroupBordered>

        {/* desktop */}
        <div className="absolute right-0 top-8 hidden items-center gap-x-4 lg:flex">
          <div className="relative w-full items-center justify-center rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="text-gray-500" />
            </div>
            <input
              className="input-outlined input input-md block w-48 rounded-md pl-10"
              type="text"
              value={searchString}
              placeholder={
                activeTab == 0 ? "Search Collected" : "Search Collections"
              }
              onChange={(e) => setSearchString(e.target.value)}
            />
          </div>
          <Button
            variant="solid"
            size="md"
            className="max-w-sm !bg-white !text-gray-700"
            onClick={() => setIsModalOpen(true)}
          >
            Filter by
            <BiFilter className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </main>
  );
};

export default FanCollectionsPage;
