import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaShareSquare } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import copy from "copy-to-clipboard";
import ChannelTab from "../CommunityTabs/Channel";
import Avatar from "../../Avatar";
import Badge from "../../Badge";
import Banner from "../../Banner";
import Button from "../../Button";
import TabGroupBordered from "../../TabGroupBordered";
import { communities, products } from "../../../utils/dummyData";
import UnlockPremiumChannelTab from "../CommunityTabs/UnlockPremiumChannel";

const FanCommunityPage = () => {
  const [community, setCommunity] = useState(communities[0]);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <main>
      <div className="relative">
        <Banner coverImageUrl={community?.bannerPic || ""} />
        <div className="absolute top-0 right-0 flex gap-2 p-4">
          {community?.tags.map((label, index) => {
            return <Badge key={index} size="lg" label={label} />;
          })}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-12 sm:-mt-16">
          <Avatar imageUrl={community?.profilePic || ""} />
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex w-full flex-col justify-between gap-4 sm:flex-row">
          <div>
            <h1 className="truncate text-4xl font-bold text-gray-900">
              {community?.name}
            </h1>
            <p className="mt-1 text-gray-500">{community?.description}</p>

            <div className="mt-6 flex gap-2">
              <Button variant="solid" size="sm">
                Leave
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
                variant="solid"
                size="sm"
                className="!bg-orange-300 hover:!bg-orange-400"
              >
                Submit Chat Request
              </Button>
            </div>
          </div>
          <Link
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
          </Link>
        </div>

        <TabGroupBordered
          tabs={community.channels
            .map((channel) => {
              return channel.name;
            })
            .concat(["+ Unlock Premium Channels"])}
          activeTab={activeTab}
          setActiveTab={(index: number) => {
            setActiveTab(index);
          }}
        >
          {activeTab != community.channels.length && (
            <ChannelTab
              channel={community.channels[activeTab]}
              isCreator={false}
            />
          )}
          {activeTab == community.channels.length && (
            <UnlockPremiumChannelTab products={products} />
          )}
        </TabGroupBordered>
      </div>
    </main>
  );
};

export default FanCommunityPage;
