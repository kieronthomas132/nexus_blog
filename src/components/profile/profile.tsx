import { useParams } from "react-router";
import { useGetProfileById } from "../../lib/react-query/queries&Mutations.tsx";
import Sidebar from "../homepage/sidebar.tsx";
import Search from "../homepage/search.tsx";
import PostCard from "../postCard/postCard.tsx";
import { Models } from "appwrite";
import { CircularProgress, useDisclosure } from "@nextui-org/react";
import UpdateBioModal from "./updateBioModal.tsx";
import ProfileHeader from "./profileHeader.tsx";
import ProfileBio from "./profileBio.tsx";
import UpdateNameModal from "./updateNameModal.tsx";
import UpdateUsernameModal from "./updateUsernameModal.tsx";
const Profile = () => {
  const { profileId } = useParams();

  const {
    isOpen: isBioOpen,
    onOpen: onBioOpen,
    onOpenChange: onOpenBioChange,
  } = useDisclosure();

  const {
    isOpen: isNameOpen,
    onOpen: onNameOpen,
    onOpenChange: onOpenNameChange,
  } = useDisclosure();

  const {
    isOpen: isUsernameOpen,
    onOpen: onUsernameOpen,
    onOpenChange: onOpenUsernameChange,
  } = useDisclosure();

  const { data: profile, isFetching: isProfileFetching } = useGetProfileById(
    profileId ?? "",
  );

  const sortPostsByDate = (
    posts: Models.Document[] | undefined,
  ): Models.Document[] => {
    if (!posts) return [];

    return posts.slice().sort((a: Models.Document, b: Models.Document) => {
      const dateA = new Date(a.$createdAt || "");
      const dateB = new Date(b.$createdAt || "");
      return dateB.getTime() - dateA.getTime();
    });
  };

  const sortedPosts = sortPostsByDate(profile?.posts);

  return (
    <section className="flex h-[100vh]">
      {isProfileFetching ? (
        <div className="absolute top-[50%] left-[50%]">
          <CircularProgress
            size="lg"
            classNames={{
              svg: "drop-shadow-md",
              indicator: "stroke-[#FC356D]",
              track: "stroke-white/10",
            }}
          />
        </div>
      ) : (
        <>
          <Sidebar />
          <div
            className="p-4 pt-[70px] pb-[70px] md:pb-0 w-full lg:w-[80%] border-r border-[#303033] overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 20px)" }}
          >
            <ProfileHeader
              profile={profile}
              profileId={profileId}
              onNameOpen={onNameOpen}
              onUsernameOpen={onUsernameOpen}
            />
            <ProfileBio
              profile={profile}
              profileId={profileId}
              onOpen={onBioOpen}
            />
            <div className="w-full mt-4 flex flex-col items-center justify-center">
              {profile &&
                sortedPosts.map((post: Models.Document) => (
                  <PostCard
                    key={post.id}
                    id={post.$id}
                    title={post.title}
                    username={profile.username}
                    postImage={post.imageURL}
                    content={post.content}
                    postImageId={post.imageId}
                    creatorId={profile.$id}
                    createdAt={post.$createdAt}
                    post={post}
                  />
                ))}
            </div>
            <UpdateBioModal
              isOpen={isBioOpen}
              onOpenChange={onOpenBioChange}
              profileId={profileId}
            />
            <UpdateNameModal
              isOpen={isNameOpen}
              onOpenChange={onOpenNameChange}
              profileId={profileId}
            />
            <UpdateUsernameModal
              isOpen={isUsernameOpen}
              onOpenChange={onOpenUsernameChange}
              profileId={profileId}
            />
          </div>
          <div className="w-[20%] hidden lg:flex">
            <Search />
          </div>
        </>
      )}
    </section>
  );
};

export default Profile;
