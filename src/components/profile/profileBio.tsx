import {Tooltip} from "@nextui-org/react";
import {CiEdit} from "react-icons/ci";
import {Models} from "appwrite";
import {useAuthContext} from "../../context/AuthContext.tsx";

const ProfileBio = ({
  profile,
  profileId,
  onOpen,
}: {
  profile: Models.Document | undefined;
  profileId: string | undefined;
  onOpen: () => void;
}) => {
  const { user } = useAuthContext();
  return (
    <div>
      {profile?.bio ? (
        <div className="w-[80%] mt-10  flex  items-center justify-between  mx-auto  p-2.5 rounded-lg border border-[#303033]">
          <p>{profile.bio}</p>
          {user.id === profileId && (
            <Tooltip content="Update Bio" className="bg-[#FC356D] text-white">
              <button onClick={onOpen} className="focus:outline-none">
                <CiEdit className="text-neutral-500 hover:text-white text-[17px]" />
              </button>
            </Tooltip>
          )}
        </div>
      ) : user.id === profileId ? (
        <div>
          <div
            onClick={onOpen}
            className="w-[80%] cursor-pointer text-neutral-500 mx-auto mt-4 p-2.5 rounded-lg border border-[#303033]"
          >
            add bio
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileBio;