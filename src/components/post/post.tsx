import Sidebar from "../homepage/sidebar.tsx";
import { useGetPostById } from "../../lib/react-query/queries&Mutations.tsx";
import { useParams } from "react-router";
import PostCard from "../postCard/postCard.tsx";
import Comments from "./comments.tsx";
import { CircularProgress } from "@nextui-org/react";
import Search from "../homepage/search.tsx";

const Post = () => {
  const { postId } = useParams();
  const {
    data: post,
    isFetching: isPostFetching,
    isError: isFetchingPostError,
  } = useGetPostById(postId || "");


  if (isFetchingPostError) {
    return "Post not available";
  }

  return (
    <div className="flex pt-[80px] sm:pb-[] md:pt-0 relative overflow-y-auto">
      {isPostFetching && !isFetchingPostError ? (
        <div className='absolute h-[100vh] top-[50%] left-[50%]'>
          <CircularProgress
            size="lg"
            classNames={{
              svg: "drop-shadow-md",
              indicator: "stroke-[#FC356D]",
              track: "stroke-white/10",
            }}
            className="absolute top-[50%] left-[47%]"
          />
        </div>
      ) : (
        <>
          <Sidebar />
          <div className="lg:w-[70%] w-full border-r border-[#303033] overflow-y-auto">
            {post ? (
              <div
                className="w-full">
                <div className=" h-full lg:pt-[40px] w-[90%] mx-auto gap-4 flex flex-col">
                  <PostCard
                    id={post?.$id}
                    title={post?.title}
                    username={post.creator?.username}
                    postImage={post?.imageURL}
                    content={post?.content}
                    postImageId={post?.imageId}
                    creatorId={post.creator?.$id}
                    createdAt={post?.$createdAt}
                    post={post}
                    profilePic={post.creator.profilePic}
                  />
                  <Comments postId={post?.$id} />
                </div>
              </div>
            ) : (
              <h1>Post is not available</h1>
            )}
          </div>
          <div className="w-[20%] hidden lg:flex">
            <Search />
          </div>
        </>
      )}
    </div>
  );
};

export default Post;
