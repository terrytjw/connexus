import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";
import ChannelTab from "../components/AnalyticsTabs/Channel";
import CommunityTab from "../components/AnalyticsTabs/Community";
import EventTab from "../components/AnalyticsTabs/Event";
import MerchandiseTab from "../components/AnalyticsTabs/Merchandise";
import OverviewTab from "../components/AnalyticsTabs/Overview";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import {
  getChannelAnalyticsByCreatorAPI,
  getCollectionAnalyticsByCreatorAPI,
  getCommunityAnalyticsByCreatorAPI,
  getEventAnalyticsByCreatorAPI,
} from "../lib/api-helpers/analytics-api";

export type SelectOption = {
  id: number;
  name: string;
  tooltip: string;
};

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
  const options = [
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
  const [optionSelected, setOptionSelected] = useState(options[0]);

  return (
    <ProtectedRoute>
      <Layout>
        <main className="py-12 px-4 sm:px-12">
          <h1 className="text-4xl font-bold">Analytics</h1>
          <h3 className="mt-4">
            Have an in-depth look at all the metrics of your fans' engagement
          </h3>

          <div className="mt-8 w-full">
            {optionSelected.id == 0 && (
              <OverviewTab
                channelAnalyticsData={channelAnalyticsData}
                communityAnalyticsData={communityAnalyticsData}
                collectionAnalyticsData={collectionAnalyticsData}
                eventAnalyticsData={eventAnalyticsData}
                options={options}
                optionSelected={optionSelected}
                setOptionSelected={setOptionSelected}
              />
            )}
            {optionSelected.id == 1 && (
              <MerchandiseTab
                options={options}
                optionSelected={optionSelected}
                setOptionSelected={setOptionSelected}
                collections={[]}
              />
            )}
            {optionSelected.id == 2 && (
              <EventTab
                options={options}
                optionSelected={optionSelected}
                setOptionSelected={setOptionSelected}
                events={[]}
              />
            )}
            {optionSelected.id == 3 && (
              <CommunityTab
                options={options}
                optionSelected={optionSelected}
                setOptionSelected={setOptionSelected}
                community={null}
              />
            )}
            {optionSelected.id == 4 && (
              <ChannelTab
                options={options}
                optionSelected={optionSelected}
                setOptionSelected={setOptionSelected}
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
