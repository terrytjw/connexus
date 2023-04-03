import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  FaSearch,
  FaTelegramPlane,
  FaTimes,
  FaUserFriends,
} from "react-icons/fa";
import Button from "../../Button";
import InputGroup from "../../InputGroup";
import Loading from "../../Loading";
import Modal from "../../Modal";
import Post from "../Post";
import PostInput from "../PostInput";
import Question from "../Question";
import useSWR from "swr";
import {
  ChannelWithMembers,
  PostWithCreatorAndLikes,
  QuestionWithUser,
} from "../../../utils/types";
import { getAllPostsInChannelAPI } from "../../../lib/api-helpers/post-api";
import {
  createQuestionAPI,
  getAllQuestionsInChannelAPI,
} from "../../../lib/api-helpers/question-api";

type ChannelTabProps = {
  channel: ChannelWithMembers;
  isCreator: boolean;
};

const ChannelTab = ({ channel, isCreator }: ChannelTabProps) => {
  const { data: session } = useSession();
  const userId = Number(session?.user.userId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [members, setMembers] = useState(channel.members ?? []);
  const [displayFeed, setDisplayFeed] = useState(true);
  const [question, setQuestion] = useState("");

  const {
    data: posts,
    isLoading: isPostsDataLoading,
    mutate: mutatePosts,
  } = useSWR(
    { key: "posts", channelId: channel.channelId },
    getAllPostsInChannelAPI
  );

  const {
    data: questions,
    isLoading: isQuestionsDataLoading,
    mutate: mutateQuestions,
  } = useSWR(
    { key: "questions", channelId: channel.channelId },
    getAllQuestionsInChannelAPI
  );

  const createQuestion = async () => {
    const res = await createQuestionAPI(question, channel.channelId, userId);

    mutateQuestions((data: QuestionWithUser[]) => {
      data.unshift(res[0]);
      return data;
    });

    setQuestion("");
  };

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

  if (isPostsDataLoading || isQuestionsDataLoading) return <Loading />;

  return (
    <div>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Member List</h3>
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
        <Button
          variant="outlined"
          size="sm"
          onClick={() => {
            setDisplayFeed(!displayFeed);
          }}
        >
          {displayFeed ? "Q&A" : "Feed"}
        </Button>
        <Button variant="solid" size="sm" onClick={() => setIsModalOpen(true)}>
          <FaUserFriends />
        </Button>
      </div>

      {displayFeed ? (
        <div id="feed" className="flex flex-col gap-4">
          {isCreator ? (
            <PostInput
              mutatePosts={mutatePosts}
              channelId={channel.channelId}
            />
          ) : null}

          {posts.map((post: PostWithCreatorAndLikes) => {
            return (
              <Post key={post.postId} post={post} mutatePosts={mutatePosts} />
            );
          })}
        </div>
      ) : (
        <div id="q&a" className="flex flex-col gap-4">
          {!isCreator ? (
            <div className="card border-2 border-gray-200 bg-white">
              <div className="card-body p-2 sm:p-4">
                <div className="relative mt-1 flex w-full items-center rounded-md">
                  <textarea
                    className="textarea block w-full items-center overflow-hidden rounded-md pr-12 focus:outline-none"
                    placeholder="Send your question over here!"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                  <Button
                    className="absolute bottom-4 right-2 flex items-center border-0"
                    variant="outlined"
                    size="sm"
                    type="button"
                    onClick={() => {
                      createQuestion();
                    }}
                  >
                    <FaTelegramPlane />
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {questions.map((question: QuestionWithUser) => {
            return (
              <Question
                key={question.questionId}
                question={question}
                mutateQuestions={mutateQuestions}
                isCommunityCreator={isCreator}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChannelTab;
