import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import {
  FaFacebook,
  FaTelegram,
  FaTwitter,
  FaUserFriends,
} from "react-icons/fa";
import ChannelTab from "../CommunityTabs/Channel";
import Avatar from "../../Avatar";
import Badge from "../../Badge";
import Banner from "../../Banner";
import Button from "../../Button";
import TabGroupBordered from "../../TabGroupBordered";
import { CommunityWithCreatorAndChannelsAndMembers } from "../../../utils/types";
import {
  CollectionWithMerchAndPremiumChannel,
  registerCollectionClick,
} from "../../../lib/api-helpers/collection-api";

type CommunityPagePageProps = {
  community: CommunityWithCreatorAndChannelsAndMembers;
  setCommunity: (community: CommunityWithCreatorAndChannelsAndMembers) => void;
  linkedCollections: CollectionWithMerchAndPremiumChannel[];
};

const CreatorCommunityPage = ({
  community,
  linkedCollections,
}: CommunityPagePageProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const router = useRouter();
  const communityLink = "connexus.com" + router.asPath; // dummy URL

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
    <main>
      <Toaster />
      <div className="relative">
        <Banner coverImageUrl={community.bannerPic ?? ""} />
        <div className="absolute top-0 right-0 flex flex-wrap gap-2 p-4">
          {community.tags.map((label, index) => {
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

            <p className="mt-1 text-gray-500">{community.description}</p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Button
                variant="solid"
                size="sm"
                href={`/communities/edit/${community.communityId}`}
              >
                Edit <span className="hidden sm:contents">Community</span>
              </Button>

              <div className="flex items-center gap-4">
                <Link
                  href={getFacebookShareLink(communityLink)}
                  target="_blank"
                  className="text-gray-500 transition-all hover:text-blue-500"
                >
                  <FaFacebook className="h-6 w-6" />
                </Link>
                <Link
                  href={getTwitterShareLink(communityLink)}
                  target="_blank"
                  className="text-gray-500 transition-all hover:text-blue-500"
                >
                  <FaTwitter className="h-6 w-6" />
                </Link>
                <Link
                  href={getTelegramShareLink(communityLink)}
                  target="_blank"
                  className="text-gray-500 transition-all hover:text-blue-500"
                >
                  <FaTelegram className="h-6 w-6" />
                </Link>
              </div>

              <Button
                variant="outlined"
                size="sm"
                className="max-w-xs border-0 !text-red-500 hover:!bg-gray-300"
                href={`/communities/${community.communityId}/channels/create`}
              >
                + <span className="hidden md:contents">Create New</span> Premium
                Channel
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

        <TabGroupBordered
          tabs={community.channels.map((channel) => {
            return channel.name;
          })}
          activeTab={activeTab}
          setActiveTab={(index: number) => {
            setActiveTab(index);
          }}
        >
          {activeTab != community.channels.length && (
            <ChannelTab
              key={community.channels[activeTab].channelId}
              channel={community.channels[activeTab]}
              isCreator={true}
            />
          )}
        </TabGroupBordered>
      </div>
    </main>
  );
};

export default CreatorCommunityPage;
