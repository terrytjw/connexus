import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaSearch, FaTimes, FaUserFriends } from "react-icons/fa";
import Button from "../../Button";
import InputGroup from "../../InputGroup";
import Loading from "../../Loading";
import Modal from "../../Modal";
import Post from "../Post";
import PostInput from "../PostInput";
import useSWR from "swr";
import { swrFetcher } from "../../../lib/swrFetcher";
import {
  ChannelWithMembers,
  PostWithCreatorAndLikes,
} from "../../../utils/types";

type ChannelTabProps = {
  channel: ChannelWithMembers;
  isCreator: boolean;
};

const ChannelTab = ({ channel, isCreator }: ChannelTabProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [members, setMembers] = useState(channel.members ?? []);

  const {
    data: posts,
    error,
    isLoading,
    mutate,
  } = useSWR(
    `http://localhost:3000/api/post?channelId=${channel.channelId}`,
    swrFetcher
  );

  const searchMembers = async () => {
    const res = await axios.get(
      `http://localhost:3000/api/channel/${channel.channelId}/users?keyword=${searchString}`
    );
    const temp = res.data;
    setMembers(temp);
  };

  useEffect(() => {
    searchMembers();
  }, [searchString]);

  if (isLoading) return <Loading />;

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
          <FaSearch className="text-gray-500" />
        </InputGroup>

        {members.length > 0 ? (
          members.map(
            (member: {
              userId: number;
              username: string;
              profilePic: string | null;
            }) => {
              return (
                <Link
                  key={member.userId}
                  href={`/user/profile/${member.userId}`}
                  className="flex w-full items-center gap-4 rounded-lg p-2 hover:bg-gray-200"
                >
                  <Image
                    height={48}
                    width={48}
                    className="aspect-square rounded-full object-cover object-center"
                    src={member.profilePic ?? ""}
                    alt="Member profile pic"
                  />
                  <p className="text-gray-700">{member.username}</p>
                </Link>
              );
            }
          )
        ) : (
          <div className="mt-2 flex flex-col items-center gap-2">
            <Image
              height={80}
              width={80}
              className="aspect-square rounded-lg object-cover object-center"
              src="/images/bear.jpg"
              alt="No member found image"
            />
            <p className="text-sm text-gray-500">No members found!</p>
          </div>
        )}
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
        {isCreator ? (
          <PostInput mutatePosts={mutate} channelId={channel.channelId} />
        ) : null}

        {posts.map((post: PostWithCreatorAndLikes) => {
          return <Post key={post.postId} post={post} mutatePosts={mutate} />;
        })}
      </div>
    </div>
  );
};

export default ChannelTab;
