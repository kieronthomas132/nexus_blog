import {
  useDeleteReply,
  useGetReplies,
} from "../../lib/react-query/queries&Mutations.tsx";
import { Models } from "appwrite";
import { CircularProgress, Tooltip, useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { FaRegComment } from "react-icons/fa";
import ReplyModal from "./replyModal.tsx";
import { formatDistanceToNow } from "date-fns";
import { CgTrashEmpty } from "react-icons/cg";
import { useAuthContext } from "../../context/AuthContext.tsx";

const Replies = ({ comment }: { comment: Models.Document }) => {
  const { user } = useAuthContext();
  const {
    isOpen: isReplyModalOpen,
    onOpen: onReplyModalOpen,
    onOpenChange: onReplyModalOpenChange,
  } = useDisclosure();

  const { data: replies } = useGetReplies();
  const { mutateAsync: deleteReply, isPending: isDeletingReply } =
    useDeleteReply();

  const [hoveredReply, setHoveredReply] = useState("");

  const filteredReplies = replies?.filter(
    (reply) => reply.commentId === comment.$id,
  );

  const handleDeleteReply = async (e: React.MouseEvent, replyId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const deletedReply = await deleteReply(replyId);

    if (!deletedReply) {
      throw new Error();
    }

    return deletedReply;
  };


  return (
    <div className="mt-1 text-sm">
      <button
        onClick={onReplyModalOpen}
        className="flex focus:outline-none  items-center text-neutral-500 gap-1 hover:text-white"
      >
        <FaRegComment className="text-sm hover:text-white" />
        <p className=" text-sm">{filteredReplies && filteredReplies.length}</p>
      </button>
      <ReplyModal
        comment={comment}
        isOpen={isReplyModalOpen}
        onOpenChange={onReplyModalOpenChange}
      />
      <div className="p-4">
        {filteredReplies?.map((reply) => (
          <>
            <div
              onMouseEnter={() => setHoveredReply(reply.$id)}
              onMouseLeave={() => setHoveredReply("")}
              key={reply.$id}
              className="flex items-center gap-2"
            >
              <img
                className="w-[30px] rounded-full"
                src={reply.replier.profilePic}
                alt={reply.replier.username}
              />
              <span>
                <h1 className="text-[15px] font-[600]">{reply.replier.name}</h1>
                <h2 className="text-neutral-500">@{reply.replier.username}</h2>
              </span>
              {reply.replier.$id === user.id && hoveredReply === reply.$id && (
                <div>
                  {isDeletingReply ? (
                      <CircularProgress
                          size="sm"
                          classNames={{
                              svg: "drop-shadow-md",
                              indicator: "stroke-[#FC356D]",
                              track: "stroke-white/10",
                          }}
                      />
                  ) : (
                    <Tooltip
                      content="Delete Post"
                      className="bg-[#FC356D] text-white"
                    >
                      <button
                        onClick={(e) => handleDeleteReply(e, reply.$id)}
                        className="text-[14px] text-neutral-500 hover:text-white"
                      >
                        <CgTrashEmpty />
                      </button>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>
            <div className="mt-4 mx-auto">{reply.reply}</div>
            <p className="text-sm text-neutral-500 mt-2">
              Posted:{" "}
              {formatDistanceToNow(new Date(reply.$createdAt), {
                addSuffix: true,
              })}
            </p>
          </>
        ))}
      </div>
    </div>
  );
};

export default Replies;
