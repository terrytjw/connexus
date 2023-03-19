import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import React, { useState } from "react";
import { FaShareSquare, FaPen } from "react-icons/fa";
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
import { User } from "@prisma/client";
import { profile, collections, collectibles } from "../../../utils/dummyData";
import copy from "copy-to-clipboard";
import { toast, Toaster } from "react-hot-toast";
import { UserWithAllInfo } from "../../api/users/[userId]";
import { getUserInfo } from "../../../lib/api-helpers/user-api";

type UserProfilePageProps = {
  userData: UserWithAllInfo;
};
const UserProfilePage = ({ userData }: UserProfilePageProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ProtectedRoute>
      <Layout>
        <Head>
          <title>Profile | Connexus</title>
        </Head>
        <main>
          {userData.bannerPic ? (
            <Banner coverImageUrl={userData.bannerPic} />
          ) : (
            <Banner coverImageUrl={"/images/default-banner.jpg"} />
          )}

          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
              <Avatar imageUrl={userData.profilePic ?? ""} />
              <div className="">
                {/* mobile view profile name*/}
                <div className="mt-6 min-w-0 flex-1 sm:hidden">
                  <h1 className="truncate text-2xl font-bold text-gray-900">
                    {userData.displayName}
                  </h1>
                  <p className="mt-1 text-gray-500 sm:hidden">
                    {/* I'm fly, drippin' with dem peaches high ·{" "} */}
                    {userData.bio ? userData.bio : "No bio"}
                    <br />
                    {/* <span className="italic">Joined 2 Sep 1969</span> */}
                  </p>
                </div>
              </div>
            </div>
            {/* desktop view profile name*/}
            <div className="mt-6 hidden min-w-0 flex-1 sm:block">
              <h1 className="truncate text-2xl font-bold text-gray-900">
                {userData.displayName}
              </h1>
              <p className="mt-1 text-gray-500">
                {/* I'm fly, drippin' with dem peaches high ·{" "} */}
                {userData.bio ? userData.bio : "No bio"}
                <br />
                {/* <span className="italic underline">Joined 2 Sep 1969</span> */}
              </p>
            </div>

            {/* button group */}
            <div className="mt-6 flex gap-2">
              <Button
                href={`/user/settings/${userData.userId}`}
                variant="solid"
                size="md"
              >
                <FiSettings aria-hidden="true" />
                <span className="hidden sm:inline-block">Settings</span>
              </Button>
              <Button
                variant="solid"
                size="md"
                onClick={() => {
                  copy(location.href);
                  toast("Community link copied successfully!");
                }}
              >
                <FaShareSquare aria-hidden="true" />
                <span className="hidden sm:inline-block">Share</span>
              </Button>
              {/* <Button
                variant="solid"
                size="md"
              >
                <FiSettings aria-hidden="true" />
                <span className="hidden sm:inline-block">Settings</span>
              </Button> */}
            </div>

            <TabGroupBordered
              tabs={[
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
              {activeTab == 0 && <h1>Coming soon...</h1>}
              {activeTab == 1 && <h1>Coming soon...</h1>}
              {activeTab == 2 && <h1>Coming soon...</h1>}
              {activeTab == 3 && <h1>Coming soon...</h1>}
            </TabGroupBordered>
          </div>
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: "#1A7DFF",
                color: "#fff",
                textAlign: "center",
              },
            }}
          />
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default UserProfilePage;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);
  const userId = session?.user.userId;

  if (!userId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const userData = await getUserInfo(parseInt(userId));

  return {
    props: {
      userData,
    },
  };
};
