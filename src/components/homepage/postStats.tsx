import { useState } from "react";
import { Models } from "appwrite";
import {
  useDeletePost,
  useLikePost,
} from "../../lib/react-query/queries&Mutations.tsx";
import {CircularProgress, Tooltip} from "@nextui-org/react";
import {CgTrashEmpty} from "react-icons/cg";
import {FaHeart, FaRegComment, FaRegHeart} from "react-icons/fa";
import {useNavigate} from "react-router";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
  creatorId:string
};
const PostStats = ({ post, userId, creatorId }: PostStatsProps) => {
  const likesList = post?.likes?.map((user: Models.Document) => user.$id);
  const [likes, setLikes] = useState<string[]>(likesList)

  const navigate = useNavigate()


  const { mutateAsync: deletePost, isPending: isDeletingPost } =
    useDeletePost();

  const { mutate: likePost } = useLikePost();

  const checkIsLiked = (likesList: string[], userId: string) => {
    return likesList.includes(userId);
  };

  const handleLikePost = (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    let newLikes = [...likes];

    const hasLiked = newLikes.includes(userId);

    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }

    setLikes(newLikes);
    likePost({ postId, likesArray: newLikes });
  };

  const handleDeletePost = async (e:React.MouseEvent, postId:string) => {
      e.stopPropagation()
      e.preventDefault()
    const deletedPost = await deletePost(postId);

      navigate('/home')
    if (!deletedPost) {
      throw new Error();
    }

    return deletedPost;
  };

  return (
    <div className="flex text-[17px] items-center gap-4 mt-[20px]">
      <div className="flex gap-2 items-center">
        <Tooltip className="bg-[#FC356D] text-white" content="like post">
          <button onClick={(e) => handleLikePost(e, post.$id)}>
            {checkIsLiked(likes, userId) ? (
              <FaHeart className="text-[#FC356D]" />
            ) : (
              <FaRegHeart className="text-neutral-500 hover:text-white" />
            )}
          </button>
        </Tooltip>
        <p className="text-sm text-neutral-500">{likes?.length}</p>
        <span className="text-sm text-neutral-500 flex items-center gap-2">
          <FaRegComment />
          <p>{post?.comments?.length}</p>
        </span>
        {!isDeletingPost ? (
          <div className="flex items-center">
            {creatorId === userId && (
              <Tooltip
                content="Delete Post"
                className="bg-[#FC356D] text-white"
              >
                <button
                  onClick={(e) => handleDeletePost(e, post.$id)}
                  className="text-[17px] text-neutral-500 hover:text-white"
                >
                  <CgTrashEmpty />
                </button>
              </Tooltip>
            )}
          </div>
        ) : (
          <CircularProgress
            classNames={{
              svg: "drop-shadow-md",
              indicator: "stroke-[#FC356D]",
              track: "stroke-white/10",
            }}
            size="sm"
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
