import Head from "next/head";
import React, { useState } from "react";
import Layout from "../../../components/Layout";
import ProtectedRoute from "../../../components/ProtectedRoute";
import TabGroupBordered from "../../../components/TabGroupBordered";
import PreferenceSettings from "../../../components/UserSettingsTabs/Preference";
import ProfileSettings from "../../../components/UserSettingsTabs/Profile";
import useSWR from "swr";
import Loading from "../../../components/Loading";
import { useSession } from "next-auth/react";
import { getUserInfo } from "../../../lib/api-helpers/user-api";

const UserSettingsPage = () => {
  const { data: session, status } = useSession();
  const userId = session?.user.userId;

  const { data: userData, error, isLoading } = useSWR(userId, getUserInfo);

  const [activeTab, setActiveTab] = useState(0);

  if (isLoading) return <Loading />;

  return (
    <ProtectedRoute>
      <Layout>
        <Head>
          <title>Settings | Connexus</title>
        </Head>

        <main className="py-12 px-4 sm:px-12">
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
          <TabGroupBordered
            tabs={["Profile", "Preferences"]}
            activeTab={activeTab}
            setActiveTab={(index: number) => {
              setActiveTab(index);
            }}
          >
            {activeTab == 0 && <ProfileSettings userData={userData} />}
            {activeTab == 1 && <PreferenceSettings userData={userData} />}
          </TabGroupBordered>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default UserSettingsPage;
