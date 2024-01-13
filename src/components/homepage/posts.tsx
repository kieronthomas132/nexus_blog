import { useGetPosts } from "../../lib/react-query/queries&Mutations.tsx";
import { CircularProgress } from "@nextui-org/react";
import PostCard from "../postCard/postCard.tsx";

const Posts = () => {
  const { data: posts, isFetching: isFetchingPosts } = useGetPosts();

  if (isFetchingPosts) {
    return (
      <div className="absolute top-[50%] left-[48%]">
        <CircularProgress
          size="lg"
          classNames={{
            svg: "drop-shadow-md",
            indicator: "stroke-[#FC356D]",
            track: "stroke-white/10",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="py-10 md:py-4 flex flex-col h-[100%] w-full overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 20px)" }}
    >
      <div className="flex flex-col">
        <span className=" mx-auto w-[90%]">
          <h1 className="bg-[#262628] md:w-[100px] p-2 items-start justify-start text-center mt-3 md:mt-0 rounded-full hover:bg-[#313133]">
            Recent
          </h1>
        </span>
        <div className=" lg:w-[100%] flex flex-col items-center ">
          {posts &&
            posts.map((post) => (
              <div
                key={post.$id}
                className="flex flex-col cursor-pointer w-[95%] items-center md:border-b md:border-[#262628]"
              >
                <PostCard
                  title={post?.title}
                  createdAt={post?.$createdAt}
                  username={post?.creator?.username}
                  postImage={post?.imageURL}
                  postImageId={post?.imageId}
                  content={post?.content}
                  id={post?.$id}
                  creatorId={post?.creator?.$id}
                  post={post}
                  profilePic={post.creator.profilePic}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Posts;
