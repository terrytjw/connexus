import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import React, { useState } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaTelegram,
  FaExternalLinkAlt,
} from "react-icons/fa";
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
import { toast } from "react-hot-toast";
import { UserWithAllInfo } from "../../api/users/[userId]";
import { getUserInfo } from "../../../lib/api-helpers/user-api";
import Link from "next/link";
import { useRouter } from "next/router";
import CommunitiesTab from "../../../components/UserProfileTabs/CommunitiesTab";
import EventsTab from "../../../components/UserProfileTabs/EventsTab";
import CollectionsTab from "../../../components/UserProfileTabs/CollectionsTab";
import CreationsTab from "../../../components/UserProfileTabs/CreationsTab";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";

type UserProfilePageProps = {
  userData: UserWithAllInfo;
};
const UserProfilePage = ({ userData }: UserProfilePageProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();
  const profileLink = "connexus.com" + router.asPath; // dummy URL

  function getFacebookShareLink(url: string | null) {
    // const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    return shareUrl;
  }

  function getTwitterShareLink(url: string | null) {
    // const url = encodeURIComponent(window.location.href);
    const message = encodeURIComponent("Check out my profile on Connexus!");
    const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${message}`;
    return shareUrl;
  }

  function getTelegramShareLink(url: string | null) {
    // const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://t.me/share/url?url=${url}`;
    return shareUrl;
  }

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
                  <p className="mt-4 text-gray-500 sm:hidden">
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
              <p className="mt-4 text-gray-500">
                {/* I'm fly, drippin' with dem peaches high ·{" "} */}
                {userData.bio ? userData.bio : "No bio"}
                <br />
                {/* <span className="italic underline">Joined 2 Sep 1969</span> */}
              </p>
            </div>

            {/* button group */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button
                href={`/user/settings/${userData.userId}`}
                variant="solid"
                size="md"
              >
                <FiSettings aria-hidden="true" />
                <span className="hidden sm:inline-block">Settings</span>
              </Button>

              <div className="flex items-center gap-4 py-4">
                <Link
                  href={getFacebookShareLink(profileLink)}
                  target="_blank"
                  className="text-gray-500 transition-all hover:text-blue-600"
                >
                  <FaFacebook className="h-6 w-6" />
                </Link>
                <Link
                  href={getTwitterShareLink(profileLink)}
                  target="_blank"
                  className="text-gray-500 transition-all hover:text-blue-600"
                >
                  <FaTwitter className="h-6 w-6" />
                </Link>
                <Link
                  href={getTelegramShareLink(profileLink)}
                  target="_blank"
                  className="text-gray-500 transition-all hover:text-blue-600"
                >
                  <FaTelegram className="h-6 w-6" />
                </Link>
              </div>
              <Link
                href={`https://mumbai.polygonscan.com/address/${userData.walletAddress}`}
                target="_blank"
                className="tooltip tooltip-primary flex items-center gap-x-2 text-blue-600 transition-all hover:text-blue-900 hover:underline"
                data-tip="For Web3 native users to view the smart contract transactions in Polygon"
              >
                <FaExternalLinkAlt className="h-4 w-4" />
                <span className="font-medium">On-chain Analysis</span>
              </Link>
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
              {activeTab == 0 && <CreationsTab userData={userData} />}
              {activeTab == 1 && <CollectionsTab userData={userData} />}
              {activeTab == 2 && <CommunitiesTab userData={userData} />}
              {activeTab == 3 && <EventsTab userData={userData} />}
            </TabGroupBordered>
          </div>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default UserProfilePage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
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
