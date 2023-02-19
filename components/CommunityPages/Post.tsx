import Image from "next/image";
import { useState } from "react";
import { FaEllipsisH, FaRegComment, FaRegHeart, FaTimes } from "react-icons/fa";
import Button from "../Button";
import Carousel from "../Carousel";
import Comment from "./Comment";
import CommentInput from "./CommentInput";
import CustomLink from "../CustomLink";
import Modal from "../Modal";
import PostInput from "./PostInput";
import { Post, Comment as CommentType } from "../../utils/types";

type PostProps = {
  post: Post;
};

const Post = ({ post }: PostProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [activeComment, setActiveComment] = useState<CommentType>();

  return (
    <div className="card border-2 border-gray-200 bg-white">
      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        className="!max-w-3xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Edit Post</h3>
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
          onSubmit={(data: any) => {
            console.log("Editing post", data);
            setIsModalOpen(false);
          }}
          post={post}
        />
      </Modal>

      <div className="card-body gap-4 p-4 sm:p-8">
        <div className="flex w-full flex-wrap items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              height={48}
              width={48}
              className="aspect-square rounded-full object-cover object-center"
              src={post.creator.profilePic}
              alt="Creator profile pic"
            />
            <CustomLink
              href={`/user/profile/${post.creator.userId}`}
              className="text-gray-700"
            >
              {post.creator.displayName}
            </CustomLink>{" "}
          </div>

          <div className="dropdown-btm dropdown-end dropdown">
            <label tabIndex={0}>
              <Button variant="outlined" size="sm" className="border-0">
                <FaEllipsisH />
              </Button>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
            >
              <li>
                <Button
                  size="md"
                  variant="solid"
                  className="justify-start !bg-white !text-gray-900 hover:!bg-gray-200"
                >
                  Pin Post
                </Button>
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
                >
                  Delete Post
                </Button>
              </li>
            </ul>
          </div>
        </div>

        <Carousel images={post.media} />

        <p>{post.content}</p>

        <div className="flex w-full flex-row-reverse flex-wrap items-center justify-between gap-4">
          <span>
            {post.date.toLocaleString("en-gb", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <div className="flex w-full items-center gap-x-4 border-y-2 py-2 sm:border-0">
            <div className="flex items-center gap-x-2">
              <Button
                size="md"
                variant="outlined"
                className="!btn-circle border-0"
              >
                <FaRegHeart size={24} />
              </Button>
              {post.likes}
            </div>

            <div className="flex items-center gap-x-2">
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
              {post.comments?.length}
            </div>
          </div>
        </div>

        <div className="flex w-full items-center gap-4">
          <Image
            height={48}
            width={48}
            className="aspect-square rounded-full object-cover object-center"
            src={post.creator.profilePic}
            alt="Creator profile pic"
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
                  setActiveComment(null as unknown as CommentType);
                }
              }

              if (e.code === "Enter") {
                console.log(newComment);
              }
            }}
          >
            {activeComment ? "@" + activeComment?.commentor.displayName : null}
          </CommentInput>
        </div>

        <div id={`${post.postId}-comments`} className="hidden">
          {post.comments?.map((comment) => {
            return (
              <div key={comment.commentId} className="-mx-8 hover:bg-gray-100">
                <Comment
                  comment={comment}
                  replyTo={() => {
                    setActiveComment(comment);
                  }}
                />
                <div className="pl-16">
                  {comment.replies.map((reply: CommentType) => {
                    return (
                      <Comment
                        key={reply.commentId}
                        comment={reply}
                        replyTo={() => {
                          setActiveComment(reply);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Post;
