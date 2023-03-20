import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { BiFilter } from "react-icons/bi";
import ChannelTab from "../components/AnalyticsTabs/Channel";
import CommunityTab from "../components/AnalyticsTabs/Community";
import EventTab from "../components/AnalyticsTabs/Event";
import MerchandiseTab from "../components/AnalyticsTabs/Merchandise";
import OverviewTab from "../components/AnalyticsTabs/Overview";
import Button from "../components/Button";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import Select from "../components/Select";
import {
  getChannelAnalyticsByCreatorAPI,
  getCollectionAnalyticsByCreatorAPI,
  getCommunityAnalyticsByCreatorAPI,
  getEventAnalyticsByCreatorAPI,
} from "../lib/api-helpers/analytics-api";

type AnalyticsPageProps = {
  channelAnalyticsData: any[];
  communityAnalyticsData: any[];
  collectionAnalyticsData: any[];
  eventAnalyticsData: any[];
};

const AnalyticsPage = ({
  channelAnalyticsData,
  communityAnalyticsData,
  collectionAnalyticsData,
  eventAnalyticsData,
}: AnalyticsPageProps) => {
  console.log("channelAnalyticsData", channelAnalyticsData);
  console.log("communityAnalyticsData", communityAnalyticsData);
  console.log("collectionAnalyticsData", collectionAnalyticsData);
  console.log("eventAnalyticsData", eventAnalyticsData);

  const filters = [
    {
      id: 0,
      name: "Overview",
      tooltip: "Overview analytics for the past week",
    },
    {
      id: 1,
      name: "Merchandise",
      tooltip: "Merchandise analytics for your collections",
    },
    {
      id: 2,
      name: "Event",
      tooltip: "Event analytics for your events and tickets",
    },
    {
      id: 3,
      name: "Community",
      tooltip: "Community analytics for your one and only community",
    },
    {
      id: 4,
      name: "Channel",
      tooltip: "Channel analytics for all channels in your community",
    },
  ];
  const [filterSelected, setFilterSelected] = useState(filters[0]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  return (
    <ProtectedRoute>
      <Layout>
        <main className="py-12 px-4 sm:px-12">
          <h1 className="text-4xl font-bold">Analytics</h1>
          <h3 className="mt-4">
            Have an in-depth look at all the metrics of your fans' engagement
          </h3>

          <div className="mt-8 flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Select
                data={filters}
                selected={filterSelected}
                setSelected={setFilterSelected}
                className="w-40 flex-grow-0 sm:w-64"
              />
              <div className="tooltip" data-tip={filterSelected.tooltip}>
                <Button
                  variant="solid"
                  size="sm"
                  className="!bg-blue-100 !text-blue-500"
                >
                  i
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="dropdown-end dropdown">
                <label tabIndex={0}>
                  <Button variant="solid" size="md">
                    Export <span className="hidden sm:contents">Data</span>
                  </Button>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box w-64 bg-base-100 p-2 shadow"
                >
                  <li>
                    <Button
                      size="md"
                      variant="solid"
                      className="justify-start !bg-white !text-gray-900 hover:!bg-gray-200"
                    >
                      Export and download as PDF
                    </Button>
                  </li>
                  <li>
                    <Button
                      size="md"
                      variant="solid"
                      className="justify-start !bg-white !text-gray-900 hover:!bg-gray-200"
                    >
                      Export and download as CSV
                    </Button>
                  </li>
                </ul>
              </div>
              {filterSelected.id !== 0 ? (
                <>
                  <Button
                    variant="solid"
                    size="md"
                    className="hidden max-w-sm !bg-white !text-gray-700 sm:flex"
                    onClick={() => setIsFilterModalOpen(true)}
                  >
                    Filter
                    <BiFilter className="h-8 w-8" />
                  </Button>
                  <BiFilter
                    className="h-12 w-10 sm:hidden"
                    onClick={() => setIsFilterModalOpen(true)}
                  />
                </>
              ) : null}
            </div>
          </div>

          <div className="mt-8 w-full">
            {filterSelected.id == 0 && (
              <OverviewTab
                channelAnalyticsData={channelAnalyticsData}
                communityAnalyticsData={communityAnalyticsData}
                collectionAnalyticsData={collectionAnalyticsData}
                eventAnalyticsData={eventAnalyticsData}
              />
            )}
            {filterSelected.id == 1 && (
              <MerchandiseTab
                isModalOpen={isFilterModalOpen}
                setIsModalOpen={setIsFilterModalOpen}
                collections={[]}
              />
            )}
            {filterSelected.id == 2 && (
              <EventTab
                isModalOpen={isFilterModalOpen}
                setIsModalOpen={setIsFilterModalOpen}
                events={[]}
              />
            )}
            {filterSelected.id == 3 && (
              <CommunityTab
                isModalOpen={isFilterModalOpen}
                setIsModalOpen={setIsFilterModalOpen}
                community={null}
              />
            )}
            {filterSelected.id == 4 && (
              <ChannelTab
                isModalOpen={isFilterModalOpen}
                setIsModalOpen={setIsFilterModalOpen}
                channels={[]}
              />
            )}
          </div>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default AnalyticsPage;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);
  const userId = Number(session?.user.userId);

  // call user api to retrieve created collections, events and community (with channels)

  const channelAnalyticsData = await getChannelAnalyticsByCreatorAPI(userId);
  const communityAnalyticsData = await getCommunityAnalyticsByCreatorAPI(
    userId
  );
  const collectionAnalyticsData = await getCollectionAnalyticsByCreatorAPI(
    userId
  );
  const eventAnalyticsData = await getEventAnalyticsByCreatorAPI(userId);

  return {
    props: {
      channelAnalyticsData,
      communityAnalyticsData: communityAnalyticsData.map((data: any) => {
        return {
          ...data,
          _sum: {
            ...data._sum,
            nonPremiumMembers: data._sum.members - data._sum.premiumMembers,
          },
        };
      }),
      collectionAnalyticsData,
      eventAnalyticsData,
    },
  };
};
