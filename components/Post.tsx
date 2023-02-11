import {
  FaEllipsisH,
  FaRegComment,
  FaRegHeart,
  FaRegShareSquare,
} from "react-icons/fa";
import Button from "./Button";
import CustomLink from "./CustomLink";
import Comment from "./Comment";
import { Post, Comment as CommentType } from "../utils/dummyData";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type PostProps = {
  post: Post;
};

const Post = ({ post }: PostProps) => {
  return (
    <div className="card border-2 border-gray-200 bg-white">
      <div className="card-body gap-6">
        <div className="flex w-full flex-wrap items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              className="h-12 w-12 rounded-full"
              src={post.creator.profilePic}
              alt="Creator profile pic"
            />
            <CustomLink
              href={`/users/profile/${post.creator.userId}`}
              className="px-0 text-gray-700"
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
                <button
                  className="hover:bg-gray-200 focus:bg-gray-300"
                  onClick={() => {
                    // api call
                  }}
                >
                  Pin Post
                </button>
              </li>
              <li>
                <button className="hover:bg-gray-200 focus:bg-gray-300">
                  Edit Post
                </button>
              </li>
              <li>
                <button
                  className="hover:bg-gray-200 focus:bg-gray-300"
                  onClick={() => {
                    // api call
                  }}
                >
                  Delete Post
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="carousel rounded-box h-60 w-full md:h-96">
          {post.media?.map((media, index) => {
            return (
              <div
                id={`${post.postId}-${index}`}
                className="carousel-item relative w-full"
              >
                <img
                  src={media}
                  className="w-full object-cover object-center"
                />
                <div className="absolute left-3 right-3 top-1/2 flex -translate-y-1/2 transform justify-between md:left-5 md:right-5">
                  <a
                    href={`#${post.postId}-${index - 1}`}
                    className={classNames(
                      "btn-xs btn-circle btn md:btn-md",
                      index === 0 ? "pointer-events-none opacity-0" : ""
                    )}
                  >
                    ❮
                  </a>
                  <a
                    href={`#${post.postId}-${index + 1}`}
                    className={classNames(
                      "btn-xs btn-circle btn md:btn-md",
                      index === post.media.length - 1
                        ? "pointer-events-none opacity-0"
                        : ""
                    )}
                  >
                    ❯
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <p>{post.content}</p>

        <div className="flex w-full flex-row-reverse flex-wrap items-center justify-between gap-4">
          <span>
            {post.date.toLocaleString("en-gb", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <div className="flex w-full items-center justify-between gap-x-4 border-y-2 py-2 sm:w-auto sm:border-0">
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

            <Button
              size="md"
              variant="outlined"
              className="!btn-circle border-0"
            >
              <FaRegShareSquare size={24} />
            </Button>
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
              <div className="-mx-8 hover:bg-gray-100">
                <Comment comment={comment} />
                <div className="pl-16">
                  {comment.replies.map((reply: CommentType) => {
                    return <Comment comment={reply} />;
                  })}
                </div>
              </div>
            );
            // return (
            //   <div className="-mx-8 flex flex-col px-8 py-4 hover:bg-gray-100">
            //     <div className="flex w-full gap-4">
            //       <img
            //         className="h-12 w-12 rounded-full"
            //         src={comment.commentor.profilePic}
            //         alt="Current user profile pic"
            //       />
            //       <CustomLink
            //         href={`/users/profile/${comment.commentor.userId}`}
            //         className="px-0 text-gray-700"
            //       >
            //         {comment.commentor.displayName}
            //       </CustomLink>{" "}
            //     </div>

            //     <div className="pl-16">
            //       <p className=" text-sm">{comment.content}</p>

            //       <div className="mt-4 flex items-center gap-4">
            //         <button className="text-sm">Like</button>
            //         <button className="text-sm">Reply</button>
            //         <span className="text-sm text-gray-500">
            //           {comment.date.toLocaleString("en-gb", {
            //             day: "numeric",
            //             month: "short",
            //             year: "numeric",
            //           })}
            //         </span>
            //       </div>
            //     </div>
            //   </div>
            // );
          })}
        </div>
      </div>
    </div>
  );
};

export default Post;
