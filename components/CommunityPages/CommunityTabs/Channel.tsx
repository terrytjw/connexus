import Image from "next/image";
import { useState } from "react";
import { FaSearch, FaTimes, FaUserFriends } from "react-icons/fa";
import { Channel } from "../../../utils/types";
import Button from "../../Button";
import CustomLink from "../../CustomLink";
import InputGroup from "../../InputGroup";
import Modal from "../../Modal";
import Post from "../Post";
import PostInput from "../PostInput";

type ChannelTabProps = {
  channel: Channel;
  isCreator: boolean;
};

const ChannelTab = ({ channel, isCreator }: ChannelTabProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchString, setSearchString] = useState("");

  const createPost = (data: any) => {
    console.log("Creating post", data);
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
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          placeholder="Search Members"
          size="md"
          variant="bordered"
          className="max-w-none"
        >
          <FaSearch />
        </InputGroup>

        <div className="mt-2 flex flex-col items-center gap-2">
          <Image
            height={80}
            width={80}
            className="aspect-square rounded-lg object-cover object-center"
            src="/images/bear.jpg"
            alt="No member found image"
          />
          <p className="text-sm text-gray-500">No member found!</p>
        </div>

        <div className="flex w-full gap-4 rounded-lg p-2 hover:bg-gray-200">
          <Image
            height={48}
            width={48}
            className="aspect-square rounded-full object-cover object-center"
            src="/images/bear.jpg"
            alt="Member profile pic"
          />
          <CustomLink href={`/user/profile/1`} className="text-gray-700">
            Member name
          </CustomLink>
        </div>
      </Modal>
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

        <Button variant="solid" size="sm" onClick={() => setIsModalOpen(true)}>
          <FaUserFriends />
        </Button>
      </div>

      <div id="feed" className="flex flex-col gap-4">
        {isCreator ? <PostInput onSubmit={createPost} /> : null}

        {channel.posts.map((post) => {
          return <Post key={post.postId} post={post} />;
        })}
      </div>
    </div>
  );
};

export default ChannelTab;
