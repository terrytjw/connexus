import { Event } from "@prisma/client";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
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
import { getUserInfo, searchEvents } from "../lib/api-helpers/user-api";
import { UserWithAllInfo } from "./api/users/[userId]";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export type SelectOption = {
  id: number;
  name: string;
  tooltip: string;
};

type AnalyticsPageProps = {
  userData: UserWithAllInfo;
  createdEvents: Event[];
  channelAnalyticsData: any[];
  communityAnalyticsData: any[];
  collectionAnalyticsData: any[];
  eventAnalyticsData: any[];
};

const AnalyticsPage = ({
  userData,
  createdEvents,
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
                collections={userData.createdCollections}
              />
            )}
            {optionSelected.id == 2 && (
              <EventTab
                options={options}
                optionSelected={optionSelected}
                setOptionSelected={setOptionSelected}
                events={createdEvents}
              />
            )}
            {optionSelected.id == 3 && (
              <CommunityTab
                options={options}
                optionSelected={optionSelected}
                setOptionSelected={setOptionSelected}
                community={
                  userData.createdCommunities.length > 0
                    ? userData.createdCommunities[0]
                    : null
                }
              />
            )}
            {optionSelected.id == 4 && (
              <ChannelTab
                options={options}
                optionSelected={optionSelected}
                setOptionSelected={setOptionSelected}
                channels={
                  userData.createdCommunities.length > 0
                    ? userData.createdCommunities[0].channels
                    : []
                }
              />
            )}
          </div>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default AnalyticsPage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const userId = Number(session?.user.userId);

  const userData = await getUserInfo(userId);
  const createdEvents = await searchEvents(userId, true);

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
      userData,
      createdEvents,
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
