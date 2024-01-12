import { useState } from "react";
import {
  useCreateComment,
  useGetComments,
} from "../../lib/react-query/queries&Mutations.tsx";
import { useAuthContext } from "../../context/AuthContext.tsx";
import { CircularProgress } from "@nextui-org/react";
import Comment from "./comment.tsx";
import Replies from "./replies.tsx";

const Comments = ({ postId }: { postId: string }) => {
  const { user } = useAuthContext();
  const [commentValue, setCommentValue] = useState("");

  const { mutateAsync: createComment } =
    useCreateComment();
  const { data: comments, isFetching: isCommentsFetching } = useGetComments();
  const createNewComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const comment = await createComment({
      postId,
      comment: commentValue,
      commenter: user.id,
    });

    if (!comment) {
      throw new Error();
    }

    setCommentValue("");
    return comment;
  };




  const filteredComments = comments?.filter(
    (comment) => comment.post.$id === postId,
  );
  const [seeAllComments, setSeeAllComments] = useState(false);

  return (
    <div className="w-[100%] md:pb-0 pb-[100px]  pt-4">
      <h1 className="text-[20px]">Comments</h1>
      <div className="flex flex-col mt-3">
        Post Comment
        <form className="mt-3 w-full " onSubmit={createNewComment}>
          <input
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            className=" text-sm focus:outline-none indent-2 pb-10  h-[70px] w-full bg-transparent resize-none border mt-1 rounded-md border-[#303033]"
          />
          <div className="w-full text-end">
            <button
              type="submit"
              className=" my-3 p-1.5 w-[100px] justify-end items-end text-sm hover:bg-transparent border border-[#FC356D]  rounded-full bg-[#FC356D]"
            >
              {isCommentsFetching ? "Posting" : "Post"}
            </button>
          </div>
        </form>
      </div>
      <div>
        {isCommentsFetching ? (
          <div className="flex items-center justify-center">
            <CircularProgress
                size='lg'
              classNames={{
                svg: "drop-shadow-md",
                indicator: "stroke-[#FC356D]",
                track: "stroke-white/10",
              }}
            />
          </div>
        ) : (
          <div>
            {filteredComments &&
            filteredComments.length > 0 &&
            !seeAllComments ? (
              filteredComments.slice(0, 5).map((comment) => (
                <div key={comment.$id} className="border-b border-[#303033]">
                  <Comment comment={comment} />
                  <Replies comment={comment} />
                </div>
              ))
            ) : (
              <div>
                {filteredComments &&
                  filteredComments.length > 0 &&
                  seeAllComments &&
                  filteredComments.map((comment) => (
                    <div
                      key={comment.$id}
                      className="border-b border-[#303033]"
                    >
                      <Comment comment={comment} />
                      <Replies comment={comment} />
                    </div>
                  ))}
              </div>
            )}
            <span>
              {filteredComments && filteredComments?.length > 5 && (
                <button
                  className="text-neutral-500 hover:text-white text-sm"
                  onClick={() => setSeeAllComments(!seeAllComments)}
                >
                  {seeAllComments ? "see less" : "see more"}
                </button>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
