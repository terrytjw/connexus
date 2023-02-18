import Image from "next/image";
import { FaRegHeart, FaTrashAlt } from "react-icons/fa";
import Button from "./Button";
import CustomLink from "./CustomLink";
import { Comment } from "../utils/dummyData";

type CommentProps = {
  comment: Comment;
  replyTo: Function;
};

const Comment = ({ comment, replyTo }: CommentProps) => {
  return (
    <div className="flex gap-4 px-8 py-4">
      <Image
        height={48}
        width={48}
        className="h-12 w-12 rounded-full"
        src={comment.commentor.profilePic}
        alt="Current user profile pic"
      />
      <div className="flex-grow">
        <div className="flex w-full flex-col gap-1">
          <CustomLink
            href={`/user/profile/${comment.commentor.userId}`}
            className="text-gray-700"
          >
            {comment.commentor.displayName}
          </CustomLink>
          <p className="break-all text-sm">{comment.content}</p>
        </div>

        <div className="mt-2 flex items-center gap-4">
          {comment.likes > 0 ? (
            <span className="text-sm">
              {comment.likes} like{comment.likes != 1 ? "s" : null}
            </span>
          ) : null}
          <button className="text-sm hover:underline" onClick={() => replyTo()}>
            Reply
          </button>
          <span className="text-sm text-gray-500">
            {comment.date.toLocaleString("en-gb", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
      <Button
        size="sm"
        variant="outlined"
        className="!btn-circle self-center border-0"
      >
        <FaRegHeart />
      </Button>
      <Button
        size="sm"
        variant="outlined"
        className="!btn-circle self-center border-0"
      >
        <FaTrashAlt />
      </Button>
    </div>
  );
};

export default Comment;
