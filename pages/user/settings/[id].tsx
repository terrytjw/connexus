import Head from "next/head";
import React, { useState } from "react";
import Layout from "../../../components/Layout";
import ProtectedRoute from "../../../components/ProtectedRoute";
import TabGroupBordered from "../../../components/TabGroupBordered";
import EmailPreferenceSettings from "../../../components/UserSettingsTabs/EmailPreference";
import ProfileSettings from "../../../components/UserSettingsTabs/Profile";
import SMSPreferenceSettings from "../../../components/UserSettingsTabs/SMSPreference";
import useSWR from "swr";
import Loading from "../../../components/Loading";
import { swrFetcher } from "../../../server-lib/swrFetcher";
import { useSession } from "next-auth/react";

const UserSettingsPage = () => {
  const { data: session, status } = useSession();
  // const userId = session?.user.userId;
  const userId = 4;

  const {
    data: userData,
    error,
    isLoading,
  } = useSWR(`http://localhost:3000/api/users/${userId}`, swrFetcher);

  const [activeTab, setActiveTab] = useState(0);

  if (isLoading) return <Loading />;

  return (
    <ProtectedRoute>
      <Layout>
        <Head>
          <title>Settings | Connexus</title>
        </Head>

        <main className="p-10">
          <h1 className="text-2xl font-bold">Settings</h1>
          <TabGroupBordered
            tabs={["Profile", "SMS Preferences", "Email Preferences"]}
            activeTab={activeTab}
            setActiveTab={(index: number) => {
              setActiveTab(index);
            }}
          >
            {activeTab == 0 && <ProfileSettings userData={userData} />}
            {activeTab == 1 && <SMSPreferenceSettings />}
            {activeTab == 2 && <EmailPreferenceSettings />}
          </TabGroupBordered>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default UserSettingsPage;
