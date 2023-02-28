import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { FaLock, FaShareSquare, FaUserFriends } from "react-icons/fa";
import copy from "copy-to-clipboard";
import ChannelTab from "../CommunityTabs/Channel";
import UnlockPremiumChannelTab from "../CommunityTabs/UnlockPremiumChannel";
import Avatar from "../../Avatar";
import Badge from "../../Badge";
import Banner from "../../Banner";
import Button from "../../Button";
import TabGroupBordered from "../../TabGroupBordered";
import { collections } from "../../../utils/dummyData";
import { CommunityWithCreatorAndChannelsAndMembers } from "../../../utils/types";

type CommunityPagePageProps = {
  community: CommunityWithCreatorAndChannelsAndMembers;
  setCommunity: (community: CommunityWithCreatorAndChannelsAndMembers) => void;
};

const FanCommunityPage = ({
  community,
  setCommunity,
}: CommunityPagePageProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const { data: session } = useSession();
  const userId = Number(session?.user.userId);

  const joinCommunity = async () => {
    const res = await axios.post(
      `http://localhost:3000/api/community/${community.communityId}/join?userId=${userId}`
    );
    const temp = res.data;
    setCommunity(temp);
  };

  const leaveCommunity = async () => {
    const res = await axios.post(
      `http://localhost:3000/api/community/${community.communityId}/leave?userId=${userId}`
    );
    const temp = res.data;
    setCommunity(temp);
  };

  return (
    <main>
      <div className="relative">
        <Banner coverImageUrl={community.bannerPic ?? ""} />
        <div className="absolute top-0 right-0 flex flex-wrap gap-2 p-4">
          {community?.tags.map((label, index) => {
            return <Badge key={index} size="lg" label={label} />;
          })}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-12 sm:-mt-16">
          <Avatar imageUrl={community.profilePic ?? ""} />
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex w-full flex-col justify-between gap-4 sm:flex-row">
          <div>
            <div className="flex items-center gap-2 text-lg text-gray-900">
              <h1 className="mr-2 truncate text-4xl font-bold text-gray-900">
                {community.name}
              </h1>
              <FaUserFriends />
              {community.members.length}
            </div>
            <p className="mt-1 text-gray-500">{community?.description}</p>

            <div className="mt-6 flex gap-2">
              {community.members.find((member) => member.userId == userId) ? (
                <Button
                  variant="solid"
                  size="sm"
                  onClick={() => leaveCommunity()}
                >
                  Leave
                </Button>
              ) : (
                <Button
                  variant="solid"
                  size="sm"
                  onClick={() => joinCommunity()}
                >
                  Join
                </Button>
              )}

              <Button
                variant="solid"
                size="sm"
                onClick={() => {
                  copy(location.href);
                  toast("Community link copied successfully!");
                }}
              >
                <FaShareSquare />
              </Button>
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

              <Button
                variant="solid"
                size="sm"
                className="!bg-orange-400 hover:!bg-orange-500"
              >
                Submit Chat Request
              </Button>
            </div>
          </div>
          {/* <Link
            href="/merchandise"
            className="relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 bg-white p-2 text-sm"
          >
            Highlighted Collection
            <Image
              height={144}
              width={144}
              className="aspect-square rounded-lg object-cover object-center"
              src="/images/bear.jpg"
              alt="Member profile pic"
            />
            <div
              aria-hidden="true"
              className="text-md absolute bottom-0 mx-3 my-2 flex h-36 w-36 flex-col justify-between rounded-lg bg-gradient-to-t from-black p-2 font-semibold text-white opacity-75"
            >
              <span className="self-end">x100</span>
              Collection #1
            </div>
          </Link> */}
        </div>

        {community.members.find((member) => member.userId == userId) ? (
          <TabGroupBordered
            tabs={
              community.channels
                .filter(
                  (channel) =>
                    channel.members.findIndex(
                      (member) => member.userId == userId
                    ) != -1
                )
                .map((channel) => channel.name)
              // .concat(["+ Unlock Premium Channels"])
            }
            activeTab={activeTab}
            setActiveTab={(index: number) => {
              setActiveTab(index);
            }}
          >
            {activeTab != community.channels.length && (
              <ChannelTab
                key={community.channels[activeTab].channelId}
                channel={community.channels[activeTab]}
                isCreator={false}
              />
            )}
            {/* {activeTab == community.channels.length && (
              <UnlockPremiumChannelTab products={collections} />
            )} */}
          </TabGroupBordered>
        ) : (
          <div className="mt-8 flex items-center justify-center gap-2 text-xl">
            <FaLock />
            Join to get full access to this community
          </div>
        )}
      </div>
    </main>
  );
};

export default FanCommunityPage;
