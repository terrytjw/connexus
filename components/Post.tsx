import {
  FaEllipsisH,
  FaRegComment,
  FaRegHeart,
  FaRegShareSquare,
} from "react-icons/fa";
import Button from "./Button";
import Carousel from "./Carousel";
import Comment from "./Comment";
import CustomLink from "./CustomLink";
import { Post, Comment as CommentType } from "../utils/dummyData";

type PostProps = {
  post: Post;
};

const Post = ({ post }: PostProps) => {
  return (
    <div className="card border-2 border-gray-200 bg-white">
      <div className="card-body gap-4">
        <div className="flex w-full flex-wrap items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              className="h-12 w-12 rounded-full"
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
          <img
            className="h-12 w-12 rounded-full"
            src={post.creator.profilePic}
            alt="Current user profile pic"
          />
          <input
            type="text"
            onChange={() => {}}
            placeholder="Add a comment"
            className="input-bordered input h-12 w-full"
          />
        </div>

        <div id={`${post.postId}-comments`} className="hidden">
          {post.comments?.map((comment) => {
            return (
              <div key={comment.commentId} className="-mx-8 hover:bg-gray-100">
                <Comment comment={comment} />
                <div className="pl-16">
                  {comment.replies.map((reply: CommentType) => {
                    return <Comment key={reply.commentId} comment={reply} />;
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
