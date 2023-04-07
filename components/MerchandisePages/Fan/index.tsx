import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { BiFilter } from "react-icons/bi";
import { FaSearch, FaTimes } from "react-icons/fa";
import useSWR from "swr";
import CollectedTab from "./CollectedTab";
import MarketplaceTab from "./MarketplaceTab";
import Badge from "../../Badge";
import Button from "../../Button";
import Loading from "../../Loading";
import Modal from "../../Modal";
import TabGroupBordered from "../../TabGroupBordered";
import { MerchandisePriceType } from "../../../pages/api/merch";
import {
  CollectionWithMerchAndPremiumChannel,
  searchAllCollections,
} from "../../../lib/api-helpers/collection-api";
import { searchCollectedMerchandise } from "../../../lib/api-helpers/merchandise-api";
import { MerchandiseWithCollectionName } from "../../../utils/types";
import { getTopNSellingCollectionsAPI } from "../../../lib/api-helpers/analytics-api";

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

  const [trendingCollections, setTrendingCollections] = useState(
    [] as CollectionWithMerchAndPremiumChannel[]
  );

  const [collectedTabfilterSelected, setCollectedTabfilterSelected] =
    useState("");
  const [marketplaceTabfilterSelected, setMarketplaceTabfilterSelected] =
    useState("");

  const {
    data: collectedMerchandise,
    isLoading: isCollectedMerchandiseLoading,
    mutate: mutateCollectedMerchandise,
  } = useSWR(
    "searchCollectedMerchandise",
    async () =>
      await searchCollectedMerchandise(
        userId,
        searchString,
        0,
        collectedTabfilterSelected === "Free-of-Charge"
          ? MerchandisePriceType.FREE
          : collectedTabfilterSelected === "Purchased"
          ? MerchandisePriceType.PAID
          : undefined
      )
  );

  const {
    data: allCollections,
    isLoading: isAllCollectionsLoading,
    mutate: mutateAllCollections,
  } = useSWR(
    "searchAllCollections",
    async () =>
      await searchAllCollections(
        0,
        searchString,
        marketplaceTabfilterSelected === "Linked to Premium Channel"
          ? true
          : marketplaceTabfilterSelected === "Not Linked"
          ? false
          : undefined
      )
  );

  const {
    data: trendingCollectionIds,
    isLoading: isTrendingCollectionsLoading,
  } = useSWR(
    "getTrendingCollections",
    async () => await getTopNSellingCollectionsAPI(),
    {
      onSuccess: () =>
        setTrendingCollections(
          collectionsData.filter(
            (collection: CollectionWithMerchAndPremiumChannel) => {
              return trendingCollectionIds.some((trendingcollection: any) => {
                return (
                  collection.collectionId == trendingcollection.collectionId
                );
              });
            }
          )
        ),
    }
  );

  useEffect(() => {
    mutateCollectedMerchandise();
  }, [searchString, collectedTabfilterSelected]);

  useEffect(() => {
    mutateAllCollections();
  }, [searchString, marketplaceTabfilterSelected]);

  if (
    isCollectedMerchandiseLoading ||
    isAllCollectionsLoading ||
    isTrendingCollectionsLoading
  ) {
    return <Loading />;
  }

  return (
    <main className="py-12 px-4 sm:px-12">
      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        className="min-w-fit"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            {activeTab == 0
              ? "Filter Collections"
              : "Filter Collected Merchandise"}
          </h3>
          <Button
            variant="outlined"
            size="sm"
            className="border-0 text-red-500"
            onClick={() => {
              activeTab == 0
                ? setMarketplaceTabfilterSelected("")
                : setCollectedTabfilterSelected("");
            }}
          >
            Clear
          </Button>
        </div>

        <h3 className="mt-8 text-sm font-medium text-gray-500">
          {activeTab == 0 ? "LINK TO PREMIUM CHANNEL" : "PRICE"}
        </h3>
        <div className="mt-2 mb-4 flex flex-wrap gap-4">
          {activeTab == 0 ? (
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
                className="h-8 min-w-fit rounded-lg"
              />
              <Badge
                label="Not Linked"
                size="lg"
                selected={marketplaceTabfilterSelected === "Not Linked"}
                onClick={() => setMarketplaceTabfilterSelected("Not Linked")}
                className="h-8 min-w-fit rounded-lg"
              />
            </>
          ) : (
            <>
              <Badge
                label="Free-of-Charge"
                size="lg"
                selected={collectedTabfilterSelected === "Free-of-Charge"}
                onClick={() => setCollectedTabfilterSelected("Free-of-Charge")}
                className="h-8 min-w-fit rounded-lg"
              />
              <Badge
                label="Purchased"
                size="lg"
                selected={collectedTabfilterSelected === "Purchased"}
                onClick={() => setCollectedTabfilterSelected("Purchased")}
                className="h-8 min-w-fit rounded-lg"
              />
            </>
          )}
        </div>
        <Button
          variant="solid"
          size="md"
          className="mt-8"
          onClick={() => setIsModalOpen(false)}
        >
          Submit
        </Button>
      </Modal>

      <h1 className="text-4xl font-bold text-gray-900">
        {activeTab === 0
          ? "Browse Digital Merchandise Collections"
          : "Your Digital Merchandise Collection"}
      </h1>
      <h3 className="mt-4 text-gray-500">
        {activeTab === 0
          ? "Take a look at all these collections by other creators!"
          : "View all your collected digital merchandise"}
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
              activeTab == 0 ? "Search Collections" : "Search Collected"
            }
            onChange={(e) => setSearchString(e.target.value)}
          />
        </div>
        <BiFilter className="h-12 w-10" onClick={() => setIsModalOpen(true)} />
      </div>

      <div className="relative">
        <TabGroupBordered
          tabs={["Marketplace", "Collected"]}
          activeTab={activeTab}
          setActiveTab={(index: number) => {
            setActiveTab(index);
            setSearchString("");
          }}
        >
          {activeTab == 0 && (
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
              ) : (
                <div className="mb-4" />
              )}
              <MarketplaceTab
                collections={allCollections}
                trendingCollections={trendingCollections}
              />
            </>
          )}
          {activeTab == 1 && (
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
              ) : (
                <div className="mb-4" />
              )}
              <CollectedTab collectedMerchandise={collectedMerchandise} />
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
              className="input-outlined input input-md block w-full rounded-md pl-10"
              type="text"
              value={searchString}
              placeholder={
                activeTab == 0 ? "Search Collections" : "Search Collected"
              }
              onChange={(e) => setSearchString(e.target.value)}
            />
          </div>
          <Button
            variant="solid"
            size="md"
            className="max-w-sm !bg-white !text-gray-700 shadow-sm"
            onClick={() => setIsModalOpen(true)}
          >
            Filter
            <BiFilter className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </main>
  );
};

export default FanCollectionsPage;
