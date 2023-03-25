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
import { CommunityWithCreatorAndChannelsAndMembers } from "../../../utils/types";
import {
  joinCommunityAPI,
  leaveCommunityAPI,
} from "../../../lib/api-helpers/community-api";
import {
  CollectionWithMerchAndPremiumChannel,
  registerCollectionClick,
} from "../../../lib/api-helpers/collection-api";

type CommunityPagePageProps = {
  community: CommunityWithCreatorAndChannelsAndMembers;
  setCommunity: (community: CommunityWithCreatorAndChannelsAndMembers) => void;
  linkedCollections: CollectionWithMerchAndPremiumChannel[];
};

const FanCommunityPage = ({
  community,
  setCommunity,
  linkedCollections,
}: CommunityPagePageProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const { data: session } = useSession();
  const userId = Number(session?.user.userId);

  const joinedChannels = community.channels.filter(
    (channel) =>
      channel.members.findIndex((member) => member.userId == userId) != -1
  );

  const joinCommunity = async () => {
    const res = await joinCommunityAPI(community.communityId, userId);
    setCommunity(res);
  };

  const leaveCommunity = async () => {
    const res = await leaveCommunityAPI(community.communityId, userId);
    setCommunity(res);
  };

  return (
    <main>
      <Toaster />
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
                  className="bg-blue-900"
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
            </div>
          </div>
          {linkedCollections.length > 0 ? (
            <Link
              href={`/merchandise/${linkedCollections[0].collectionId}`}
              className="relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 bg-white p-2 text-sm"
              onClick={async () => {
                await registerCollectionClick(
                  linkedCollections[0].collectionId
                );
              }}
            >
              Highlighted Collection
              <Image
                height={144}
                width={144}
                className="aspect-square rounded-lg object-cover object-center"
                src={linkedCollections[0].merchandise[0].image}
                alt="Highlight Collection Image"
              />
              <div
                aria-hidden="true"
                className="text-md absolute bottom-0 mx-3 my-2 flex h-36 w-36 flex-col justify-end rounded-lg bg-gradient-to-t from-black p-2 font-semibold text-white opacity-75"
              >
                {linkedCollections[0].collectionName}
              </div>
            </Link>
          ) : null}
        </div>

        {community.members.find((member) => member.userId == userId) ? (
          <TabGroupBordered
            tabs={joinedChannels
              .map((channel) => channel.name)
              .concat(["+ Unlock Premium Channels"])}
            activeTab={activeTab}
            setActiveTab={(index: number) => {
              setActiveTab(index);
            }}
          >
            {activeTab != joinedChannels.length && (
              <ChannelTab
                key={community.channels[activeTab].channelId}
                channel={community.channels[activeTab]}
                isCreator={false}
              />
            )}
            {activeTab == joinedChannels.length && (
              <UnlockPremiumChannelTab linkedCollections={linkedCollections} />
            )}
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
