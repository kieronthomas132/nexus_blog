import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext.tsx";
import { Models } from "appwrite";
import { useDeleteComment } from "../../lib/react-query/queries&Mutations.tsx";
import { CircularProgress, Tooltip } from "@nextui-org/react";
import { CgTrashEmpty } from "react-icons/cg";
import { formatDistanceToNow } from "date-fns";

const Comment = ({ comment }: { comment: Models.Document }) => {
  const { user } = useAuthContext();
  const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null);
  const [deletedComment, setDeletedComment] = useState<string | null>(null);

  const { mutateAsync: deleteComment, isPending: isDeletingComment } =
    useDeleteComment();
  const handleDeleteComment = async () => {
    setDeletedComment(comment.$id)
    const deletedComment = await deleteComment(comment.$id);
    if (!deletedComment) {
      throw new Error();
    }

    return deletedComment;
  };

  return (
    <div
      className="mt-[10px] text-sm flex justify-between "
      key={comment.$id}
      onMouseEnter={() => setHoveredCommentId(comment.$id)}
      onMouseLeave={() => setHoveredCommentId(null)}
    >
      <div className=" my-3 w-full flex-col flex gap-2">
        <div className="flex items-center gap-2">
          <a href={`/profile/${comment?.commenter?.$id}`}>
            <img
              className="w-[30px] rounded-full"
              src={comment?.commenter?.profilePic}
              alt={comment?.commenter?.name}
            />
          </a>
          <span>
            <a href={`/profile/${comment.commenter?.$id}`}>
              <h4 className="font-[600] text-[15px] hover:underline ml-1">
                {comment.commenter?.name}
              </h4>
            </a>
            <a href={`/profile/${comment.commenter?.$id}`}>
              <h4 className="text-neutral-500 hover:underline text-sm">
                @{comment?.commenter?.username}
              </h4>
            </a>
          </span>
          {user?.id === comment.commenter?.$id &&
            hoveredCommentId === comment?.$id && (
              <div className="text-neutral-500 text-[20px] mr-3">
                {!isDeletingComment && deletedComment !== comment?.$id ? (
                  <Tooltip content="Delete" className="bg-[#FC356D] text-white">
                    <button onClick={handleDeleteComment}>
                      <CgTrashEmpty className="hover:text-white text-[14px]" />
                    </button>
                  </Tooltip>
                ) : deletedComment === comment?.$id ? (
                  <span>
                    <CircularProgress
                      size="sm"
                      classNames={{
                        svg: "drop-shadow-md",
                        indicator: "stroke-[#FC356D]",
                        track: "stroke-white/10",
                      }}
                    />
                  </span>
                ) : null}
              </div>
            )}
        </div>
        <h2>{comment.comment}</h2>
        <span className="flex items-center gap-2 text-sm text-neutral-500">
          <h4>Comment posted:</h4>
          {formatDistanceToNow(new Date(comment.$createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
    </div>
  );
};

export default Comment;
