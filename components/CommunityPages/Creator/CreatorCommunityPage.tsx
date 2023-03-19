import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { FaShareSquare, FaUserFriends } from "react-icons/fa";
import copy from "copy-to-clipboard";
import ChannelTab from "../CommunityTabs/Channel";
import Avatar from "../../Avatar";
import Badge from "../../Badge";
import Banner from "../../Banner";
import Button from "../../Button";
import TabGroupBordered from "../../TabGroupBordered";
import { CommunityWithCreatorAndChannelsAndMembers } from "../../../utils/types";

type CommunityPagePageProps = {
  community: CommunityWithCreatorAndChannelsAndMembers;
  setCommunity: (community: CommunityWithCreatorAndChannelsAndMembers) => void;
};

const CreatorCommunityPage = ({ community }: CommunityPagePageProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <main>
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

            <div className="mt-6 flex gap-2">
              <Button
                variant="solid"
                size="sm"
                href={`/communities/edit/${community.communityId}`}
              >
                Edit <span className="hidden sm:contents">Community</span>
              </Button>

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
