import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BsPinFill } from "react-icons/bs";
import {
  FaEllipsisH,
  FaHeart,
  FaRegComment,
  FaRegHeart,
  FaTimes,
} from "react-icons/fa";
import Button from "../Button";
import Carousel from "../Carousel";
import Comment from "./Comment";
import CommentInput from "./CommentInput";
import CustomLink from "../CustomLink";
import Modal from "../Modal";
import PostInput from "./PostInput";
import useSWR from "swr";
import {
  CommentWithCommenterAndLikes,
  PostWithCreatorAndLikes,
} from "../../utils/types";
import {
  likePostAPI,
  unlikePostAPI,
  deletePostAPI,
  updatePostAPI,
} from "../../lib/api-helpers/post-api";
import {
  getAllCommentsOnPostAPI,
  createCommentAPI,
} from "../../lib/api-helpers/comment-api";
import { getUserInfo } from "../../lib/api-helpers/user-api";

type PostProps = {
  post: PostWithCreatorAndLikes;
  mutatePosts: any;
};

const Post = ({ post, mutatePosts }: PostProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [activeComment, setActiveComment] =
    useState<CommentWithCommenterAndLikes>(
      null as unknown as CommentWithCommenterAndLikes
    );

  const {
    data: comments,
    error,
    isLoading,
    mutate,
  } = useSWR({ postId: post.postId }, getAllCommentsOnPostAPI);

  const { data: session } = useSession();
  const userId = session?.user.userId;

  const { data: userData } = useSWR(userId, getUserInfo);

  const likePost = async () => {
    const res = await likePostAPI(post.postId, Number(userId));
    mutatePosts((data: PostWithCreatorAndLikes[]) => {
      data
        .find((post) => post.postId == res.postId)
        ?.likes.push({ userId: Number(userId) });

      return data;
    });
  };

  const unlikePost = async () => {
    const res = await unlikePostAPI(post.postId, Number(userId));
    mutatePosts((data: PostWithCreatorAndLikes[]) => {
      data
        .find((post) => post.postId == res.postId)
        ?.likes.filter((like) => like.userId != Number(userId));

      return data;
    });
  };

  const pinPost = async () => {
    const res = await updatePostAPI(
      post.postId,
      post.content,
      post.media,
      true
    );
    mutatePosts((data: PostWithCreatorAndLikes[]) => {
      data.unshift(res);
      return data;
    });
  };

  const unpinPost = async () => {
    const res = await updatePostAPI(
      post.postId,
      post.content,
      post.media,
      false
    );
    mutatePosts((data: PostWithCreatorAndLikes[]) => {
      data.unshift(res);
      return data;
    });
  };

  const deletePost = async () => {
    const res = await deletePostAPI(post.postId);
    mutatePosts((data: PostWithCreatorAndLikes[]) => {
      return data.filter((post) => post.postId != res.postId);
    });
    toast.success("Post deleted!");
  };

  const createComment = async () => {
    const res = await createCommentAPI(newComment, post.postId, Number(userId));

    const temp = res[0];
    mutate((data: CommentWithCommenterAndLikes[]) => {
      data.unshift(temp);
      return data;
    });

    setNewComment("");
  };

  return (
    <div
      className={`card border-2 border-gray-200 bg-white ${
        post.isPinned ? "shadow-md" : ""
      }`}
    >
      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        className="!max-w-3xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Edit Post</h3>
          <Button
            variant="outlined"
            size="sm"
            className="border-0"
            onClick={() => setIsModalOpen(false)}
          >
            <FaTimes />
          </Button>
        </div>
        <PostInput
          mutatePosts={mutatePosts}
          post={post}
          afterEdit={() => {
            setIsModalOpen(false);
          }}
        />
      </Modal>

      <div className="card-body gap-4 p-4 sm:p-8">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex w-3/4 items-center gap-4">
            <Image
              height={48}
              width={48}
              className="aspect-square rounded-full object-cover object-center"
              src={post.creator.profilePic ?? ""}
              alt="Creator profile pic"
            />
            <CustomLink
              href={`/user/profile/${post.creator.userId}`}
              className="!inline-block truncate font-semibold text-gray-700"
            >
              {post.creator.username}
            </CustomLink>

            <span className="whitespace-nowrap text-gray-500">
              {new Date(post.date).toLocaleString("en-gb", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {post.isPinned ? <BsPinFill className="text-blue-600" /> : null}
            {post.creator.userId == Number(userId) ? (
              <div className="dropdown-btm dropdown-end dropdown">
                <label tabIndex={0}>
                  <Button variant="outlined" size="sm" className="border-0">
                    <FaEllipsisH />
                  </Button>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 text-gray-900 shadow"
                >
                  <li>
                    {post.isPinned ? (
                      <Button
                        size="md"
                        variant="solid"
                        className="justify-start !bg-white !text-gray-900 hover:!bg-gray-200"
                        onClick={() => unpinPost()}
                      >
                        Unpin Post
                      </Button>
                    ) : (
                      <Button
                        size="md"
                        variant="solid"
                        className="justify-start !bg-white !text-gray-900 hover:!bg-gray-200"
                        onClick={() => pinPost()}
                      >
                        Pin Post
                      </Button>
                    )}
                  </li>
                  <li>
                    <Button
                      size="md"
                      variant="solid"
                      className="justify-start !bg-white !text-gray-900 hover:!bg-gray-200"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Edit Post
                    </Button>
                  </li>
                  <li>
                    <Button
                      size="md"
                      variant="solid"
                      className="justify-start !bg-white !text-gray-900 hover:!bg-gray-200"
                      onClick={() => deletePost()}
                    >
                      Delete Post
                    </Button>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <Carousel images={post.media} />

        <p className="break-words text-gray-900">{post.content}</p>

        <div className="flex w-full flex-row-reverse flex-wrap items-center justify-between gap-4">
          <div className="flex w-full items-center gap-x-4 border-y-2 py-2 sm:border-0">
            <div className="flex items-center gap-x-2 text-gray-700">
              {post.likes.find(
                (like: { userId: number }) => like.userId == Number(userId)
              ) ? (
                <Button
                  size="sm"
                  variant="outlined"
                  className="!btn-circle self-center border-0"
                  onClick={() => unlikePost()}
                >
                  <FaHeart size={24} />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outlined"
                  className="!btn-circle self-center border-0"
                  onClick={() => likePost()}
                >
                  <FaRegHeart size={24} />
                </Button>
              )}
              {post.likes.length}
            </div>

            <div className="flex items-center gap-x-2 text-gray-700">
              <Button
                size="md"
                variant="outlined"
                className="!btn-circle border-0"
                onClick={() => {
                  document
                    .getElementById(`${post.postId}-comments`)
                    ?.classList.toggle("hidden");
                }}
              >
                <FaRegComment size={24} />
              </Button>
              {comments?.length}
            </div>
          </div>
        </div>

        <div className="flex w-full items-center gap-4">
          <Image
            height={48}
            width={48}
            className="aspect-square rounded-full object-cover object-center"
            src={userData.profilePic ?? ""}
            alt="User profile pic"
          />
          <CommentInput
            value={newComment}
            placeholder={activeComment ? "" : "Add a comment"}
            onChange={(e) => {
              setNewComment(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.code == "Backspace") {
                if (newComment == "") {
                  setActiveComment(
                    null as unknown as CommentWithCommenterAndLikes
                  );
                }
              }

              if (e.code === "Enter" && newComment != "") {
                createComment();
              }
            }}
          >
            {activeComment ? "@" + activeComment?.commenter.username : null}
          </CommentInput>
        </div>

        <div id={`${post.postId}-comments`} className="hidden">
          {comments?.map((comment: CommentWithCommenterAndLikes) => {
            return (
              <div key={comment.commentId} className="-mx-8 hover:bg-gray-100">
                <Comment
                  comment={comment}
                  replyTo={() => {
                    setActiveComment(comment);
                  }}
                  mutateComments={mutate}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Post;
