import { Models } from "appwrite";
import { useAuthContext } from "../../context/AuthContext.tsx";
import { useNavigate } from "react-router";
import { formatDistanceToNow } from "date-fns";
import PostStats from "../homepage/postStats.tsx";

interface IPostCard {
  id: string;
  title: string;
  username: string;
  postImage: string;
  content: string;
  postImageId: string;
  creatorId: string;
  createdAt: string;
  post: Models.Document;
  profilePic: string
}
const PostCard = ({
  id,
  title,
  username,
  postImage,
  content,
  postImageId,
  creatorId,
  createdAt,
  post,
    profilePic
}: IPostCard) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col cursor-pointer border-b border-[#303033] w-[100%] items-center">
      <div className="w-full" onClick={() => navigate(`/post/${id}`)}>
        <div className="w-[100%] my-2 p-4 rounded-lg hover:bg-[#262628]">
          <div className="lg:flex lg:flex-row flex flex-col justify-between">
            <div className=" flex flex-col lg:items-start items-center  w-full">
              <h1 className="text-[25px] font-[500]">{title}</h1>
              <h2 className={`mt-[20px] font-[400] w-[90%] ${location.pathname.includes("/home") || location.pathname.includes("/profile") ? "line-clamp-5" : ""} `}>{content}</h2>
            </div>
            <div className="lg:w-[30%] flex mt-[20px] lg:mt-0 items-center justify-center text-center">
              <img
                src={postImage}
                className="lg:w-[200px] object-cover rounded-md"
                alt={postImageId}
              />
            </div>
          </div>
          <div className="flex mt-[20px] text-neutral-400 text-sm font-[400]">
            <div className="mt-auto md:flex lg:flex gap-2 items-center">
              Posted by:
              <a href={`/profile/${creatorId}`}>
                <div className="flex items-center gap-2 ">
                  <img src={profilePic} className='w-[25px] rounded-full' alt={username}/>
                  <p className="hover:text-white text-sm hover:underline">
                    {" "}
                    @{username}
                  </p>{" "}
                </div>
              </a>
              <span className="hidden lg:flex">•</span>
              <p className="text-sm">
                {formatDistanceToNow(new Date(createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <PostStats creatorId={creatorId} post={post} userId={user.id} />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
