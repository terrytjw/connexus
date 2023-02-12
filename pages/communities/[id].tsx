import { useState } from "react";
import {
  FaPaperclip,
  FaRegSmile,
  FaSearch,
  FaShareSquare,
  FaTelegramPlane,
  FaTimes,
  FaUserFriends,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import copy from "copy-to-clipboard";
import Avatar from "../../components/Avatar";
import Badge from "../../components/Badge";
import Banner from "../../components/Banner";
import Button from "../../components/Button";
import CustomLink from "../../components/CustomLink";
import InputGroup from "../../components/InputGroup";
import Modal from "../../components/Modal";
import Post from "../../components/Post";
import PostInput from "../../components/PostInput";
import TabGroupBordered from "../../components/TabGroupBordered";
import { community, posts } from "../../utils/dummyData";

const CommunityPage = () => {
  const [isCreator, setIsCreator] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communityDetails, setCommunityDetails] = useState(community);
  const [activeTab, setActiveTab] = useState(0);

  const createPost = (data: any) => {
    // api call
    console.log(data);
  };

  const TabContent = () => {
    return (
      <div>
        <div className="mb-4 flex w-full justify-end gap-4">
          {/* <Button
            variant="outlined"
            size="sm"
            onClick={() => {
              document.getElementById("feed")?.classList.toggle("hidden");
              document.getElementById("chatroom")?.classList.toggle("hidden");
            }}
          >
            Chat Room
          </Button> */}

          <Button
            variant="solid"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            <FaUserFriends />
          </Button>
        </div>

        <div id="feed" className="flex flex-col gap-4">
          {isCreator ? <PostInput createPost={createPost} /> : null}

          {posts.map((post) => {
            return <Post key={post.postId} post={post} />;
          })}
        </div>

        <div
          id="chatroom"
          className="card hidden border-2 border-gray-200 bg-white"
        >
          <p className="p-6 text-center">Sunday, 27 January 2023</p>
          <div className="flex w-full gap-4 p-6 hover:bg-gray-200">
            <img
              className="h-12 w-12 rounded-full"
              src="/images/bear.jpg"
              alt="Current user profile pic"
            />
            <div>
              <CustomLink href={`/users/profile/1`} className="text-gray-700">
                User
              </CustomLink>
              <p>Message Content</p>
            </div>
          </div>
          <div className="divider px-6"></div>
          <p className="p-6 text-center">Sunday, 28 January 2023</p>
          <div className="flex w-full gap-4 p-6 hover:bg-gray-200">
            <img
              className="h-12 w-12 rounded-full"
              src="/images/bear.jpg"
              alt="Current user profile pic"
            />
            <div>
              <CustomLink href={`/users/profile/1`} className="text-gray-700">
                User
              </CustomLink>
              <p>Hellooooo</p>
            </div>
          </div>
          <div className="divider px-6"></div>
          <div className="flex w-full items-center gap-4 px-6 pb-6">
            <img
              className="h-12 w-12 rounded-full"
              src="/images/bear.jpg"
              alt="Current user profile pic"
            />
            <div className="form-control w-full">
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  type="text"
                  onChange={() => {}}
                  placeholder="Enter your message"
                  className="input-bordered input h-12 w-full"
                />
                <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-3">
                  <Button variant="outlined" size="sm" className="border-0">
                    <FaPaperclip />
                  </Button>
                  <Button variant="outlined" size="sm" className="border-0">
                    <FaRegSmile />
                  </Button>
                  <Button variant="solid" size="sm">
                    <FaTelegramPlane />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Member List</h3>
          <Button
            variant="outlined"
            size="sm"
            className="border-0"
            onClick={() => setIsModalOpen(false)}
          >
            <FaTimes />
          </Button>
        </div>

        <InputGroup
          type="text"
          label=""
          value=""
          onChange={() => {}}
          placeholder="Search Members"
          size="md"
          variant="bordered"
          className="max-w-none"
        >
          <FaSearch />
        </InputGroup>
        <div className="mt-2 flex flex-col items-center gap-2">
          <img src="/images/bear.jpg" className="h-20 w-20 rounded-lg" />
          <p className="text-sm text-gray-500">No member found!</p>
        </div>

        <div className="flex w-full gap-4 rounded-lg p-2 hover:bg-gray-200">
          <img
            className="h-12 w-12 rounded-full"
            src="/images/bear.jpg"
            alt="Member profile pic"
          />
          <CustomLink href={`/users/profile/1`} className="text-gray-700">
            Member name
          </CustomLink>
        </div>
      </Modal>

      <main>
        <div className="relative">
          <Banner coverImageUrl={communityDetails?.bannerPic || ""} />
          <div className="absolute top-0 right-0 flex gap-2 p-4">
            {communityDetails?.tags.map((label, index) => {
              return <Badge key={index} size="lg" label={label} />;
            })}
          </div>
        </div>

        <div className="z-30 mx-auto px-16">
          <div className="relative z-30 -mt-12 sm:-mt-16">
            <Avatar imageUrl={communityDetails?.profilePic || ""} />
          </div>
        </div>

        <div className="mx-auto px-4 sm:px-12">
          <div className="flex w-full flex-col justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="mt-4 text-4xl font-bold">
                {communityDetails?.name}
              </h2>
              <h3 className="mt-4">{communityDetails?.description}</h3>

              <div className="mt-4 flex gap-2">
                {isCreator ? (
                  <Button variant="solid" size="sm">
                    Edit <span className="hidden sm:contents">Community</span>
                  </Button>
                ) : (
                  <Button variant="solid" size="sm">
                    Joined
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

                {isCreator ? (
                  <Button
                    variant="outlined"
                    size="sm"
                    className="max-w-xs border-0 !text-red-500 hover:bg-gray-300"
                    onClick={() => {}}
                  >
                    + <span className="hidden md:contents">Create New</span>{" "}
                    Premium Channel
                  </Button>
                ) : (
                  <Button
                    variant="solid"
                    size="sm"
                    className="!bg-orange-300 hover:!bg-orange-400"
                  >
                    Submit Chat Request
                  </Button>
                )}
              </div>
            </div>
            <div className="relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 bg-white p-2 text-sm">
              Highlighted Collection
              <img src="/images/bear.jpg" className="h-36 w-36 rounded-lg" />
              <div
                aria-hidden="true"
                className="text-md absolute bottom-0 mx-3 my-2 flex h-36 w-36 flex-col justify-between rounded-lg bg-gradient-to-t from-black p-2 font-semibold text-white opacity-75"
              >
                <span className="self-end">x100</span>
                Collection #1
              </div>
            </div>
          </div>

          <TabGroupBordered
            tabs={
              isCreator
                ? communityDetails.channels.map((channel) => {
                    return channel.name;
                  })
                : communityDetails.channels
                    .map((channel) => {
                      return channel.name;
                    })
                    .concat(["+ Unlock Premium Channels"])
            }
            activeTab={activeTab}
            setActiveTab={(index: number) => {
              setActiveTab(index);
            }}
          >
            {activeTab == 0 && <TabContent />}
          </TabGroupBordered>
        </div>
      </main>
    </div>
  );
};

export default CommunityPage;
