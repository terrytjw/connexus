import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaShareSquare } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import Avatar from "../../../components/Avatar";
import Banner from "../../../components/Banner";
import Button from "../../../components/Button";
import Layout from "../../../components/Layout";
import ProtectedRoute from "../../../components/ProtectedRoute";
import TabGroupBordered from "../../../components/TabGroupBordered";
import UserProfileCollections from "../../../components/UserProfileTabs/Collections";
import UserProfileCreations from "../../../components/UserProfileTabs/Creations";
import UserProfileFeatured from "../../../components/UserProfileTabs/Featured";
import { profile, products } from "../../../utils/dummyData";

const UserProfilePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ProtectedRoute>
      <Layout>
        <Head>
          <title>Profile | Connexus</title>
        </Head>
        <main>
          <Banner coverImageUrl={profile.coverImageUrl} />

          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
              <Avatar imageUrl={profile.imageUrl} />
              <div className="">
                {/* mobile view profile name*/}
                <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                  <h1 className="truncate text-2xl font-bold text-gray-900">
                    {profile.name} - mobile
                  </h1>
                  <p className="mt-1 text-gray-500 sm:hidden">
                    I'm fly, drippin' with dem peaches high ·{" "}
                    <span className="italic">Joined 2 Sep 1969</span>
                  </p>
                </div>
              </div>
            </div>
            {/* desktop view profile name*/}
            <div className="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
              <h1 className="truncate text-2xl font-bold text-gray-900">
                {profile.name} - desktop
              </h1>
              <p className="mt-1 text-gray-500">
                I'm fly, drippin' with dem peaches high ·{" "}
                <span className="italic underline">Joined 2 Sep 1969</span>
              </p>
            </div>

            {/* button group */}
            <div className="mt-6 flex gap-2">
              <Button variant="solid" size="md">
                <span>Edit Profile</span>
              </Button>
              <Button variant="solid" size="md">
                <FaShareSquare aria-hidden="true" />
                <span className="hidden sm:inline-block">Share</span>
              </Button>
              <Button
                variant="solid"
                size="md"
                onClick={() => router.push("/user/settings/1")}
              >
                <FiSettings aria-hidden="true" />
                <span className="hidden sm:inline-block">Settings</span>
              </Button>
            </div>

            <TabGroupBordered
              tabs={[
                "Featured",
                "Creations",
                "Collections",
                "Joined Communities",
                "Events",
              ]}
              activeTab={activeTab}
              setActiveTab={(index: number) => {
                setActiveTab(index);
              }}
            >
              {activeTab == 0 && <UserProfileFeatured products={products} />}
              {activeTab == 1 && <UserProfileCreations />}
              {activeTab == 2 && <UserProfileCollections products={products} />}
              {activeTab == 3 && <h1>Coming soon...</h1>}
              {activeTab == 4 && <h1>Coming soon...</h1>}
            </TabGroupBordered>
          </div>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default UserProfilePage;
