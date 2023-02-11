import CustomLink from "./CustomLink";
import { Comment } from "../utils/dummyData";

type CommentProps = {
  comment: Comment;
};

const Comment = ({ comment }: CommentProps) => {
  return (
    <div className="flex flex-col px-8 py-4">
      <div className="flex w-full gap-4">
        <img
          className="h-12 w-12 rounded-full"
          src={comment.commentor.profilePic}
          alt="Current user profile pic"
        />
        <CustomLink
          href={`/users/profile/${comment.commentor.userId}`}
          className="px-0 text-gray-700"
        >
          {comment.commentor.displayName}
        </CustomLink>
      </div>

      <div className="pl-16">
        <p className=" text-sm">{comment.content}</p>

        <div className="mt-4 flex items-center gap-4">
          <button className="text-sm">Like</button>
          <button className="text-sm">Reply</button>
          <span className="text-sm text-gray-500">
            {comment.date.toLocaleString("en-gb", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Comment;
