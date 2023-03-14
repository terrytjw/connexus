import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaHeart, FaRegHeart, FaTrashAlt } from "react-icons/fa";
import Button from "../Button";
import CustomLink from "../CustomLink";
import { CommentWithCommenterAndLikes } from "../../utils/types";
import { likeCommentAPI, unlikeCommentAPI, deleteCommentAPI } from "../../lib/api-helpers/comment-api";

type CommentProps = {
  comment: CommentWithCommenterAndLikes;
  replyTo: () => void;
  mutateComments: any;
};

const Comment = ({ comment, replyTo, mutateComments }: CommentProps) => {
  const { data: session } = useSession();
  const userId = Number(session?.user.userId);

  const likeComment = async () => {
    const res = await likeCommentAPI(comment.commentId, userId);
    mutateComments((data: CommentWithCommenterAndLikes[]) => {
      data
        .find((comment) => comment.commentId == res.commentId)
        ?.likes.push({ userId: userId });

      return data;
    });
  };

  const unlikeComment = async () => {
    const res = await unlikeCommentAPI(comment.commentId, userId);
    mutateComments((data: CommentWithCommenterAndLikes[]) => {
      data
        .find((comment) => comment.commentId == res.commentId)
        ?.likes.filter((like) => like.userId != userId);

      return data;
    });
  };

  const deleteComment = async () => {
    const res = await deleteCommentAPI(comment.commentId);
    mutateComments((data: CommentWithCommenterAndLikes[]) => {
      return data.filter((comment) => comment.commentId != res.commentId);
    });
  };

  return (
    <div className="flex gap-4 px-8 py-4">
      <div>
        <Image
          height={48}
          width={48}
          className="aspect-square rounded-full object-cover object-center"
          src={comment.commenter.profilePic ?? ""}
          alt="Current user profile pic"
        />
      </div>
      <div className="flex-grow">
        <div className="flex w-full flex-col gap-1">
          <CustomLink
            href={`/user/profile/${comment.commenter.userId}`}
            className="text-gray-700"
          >
            {comment.commenter.username}
          </CustomLink>
          <p className="break-all text-sm">{comment.content}</p>
        </div>

        <div className="mt-2 flex items-center gap-4">
          {comment.likes.length > 0 ? (
            <span className="text-sm">
              {comment.likes.length} like
              {comment.likes.length != 1 ? "s" : null}
            </span>
          ) : null}
          {/* <button className="text-sm hover:underline" onClick={() => replyTo()}>
            Reply
          </button> */}
          <span className="text-sm text-gray-500">
            {new Date(comment.date).toLocaleString("en-gb", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
      {comment.likes.find(
        (like: { userId: number }) => like.userId == userId
      ) ? (
        <Button
          size="sm"
          variant="outlined"
          className="!btn-circle self-center border-0"
          onClick={() => unlikeComment()}
        >
          <FaHeart />
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outlined"
          className="!btn-circle self-center border-0"
          onClick={() => likeComment()}
        >
          <FaRegHeart />
        </Button>
      )}

      {comment.commenter.userId == userId ? (
        <Button
          size="sm"
          variant="outlined"
          className="!btn-circle self-center border-0"
          onClick={() => deleteComment()}
        >
          <FaTrashAlt />
        </Button>
      ) : null}
    </div>
  );
};

export default Comment;
