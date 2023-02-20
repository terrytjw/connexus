import Head from "next/head";
import React, { useState } from "react";
import Layout from "../../../components/Layout";
import ProtectedRoute from "../../../components/ProtectedRoute";
import TabGroupBordered from "../../../components/TabGroupBordered";
import EmailPreferenceSettings from "../../../components/UserSettingsTabs/EmailPreference";
import ProfileSettings from "../../../components/UserSettingsTabs/Profile";
import SMSPreferenceSettings from "../../../components/UserSettingsTabs/SMSPreference";
import { profile, products } from "../../../utils/dummyData";

const UserSettingsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

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
            {activeTab == 0 && <ProfileSettings profile={profile} />}
            {activeTab == 1 && <SMSPreferenceSettings />}
            {activeTab == 2 && <EmailPreferenceSettings />}
          </TabGroupBordered>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default UserSettingsPage;
