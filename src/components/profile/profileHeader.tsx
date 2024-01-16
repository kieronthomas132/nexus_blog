import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { useAuthContext } from "../../context/AuthContext.tsx";
import {useUpdateProfilePic} from "../../lib/react-query/queries&Mutations.tsx";
import { Models } from "appwrite";
import {CircularProgress} from "@nextui-org/react";


const ProfileHeader = ({
  profile,
  profileId,
  onNameOpen,
  onUsernameOpen,
}: {
  profile: Models.Document | undefined;
  profileId: string | undefined;
  onNameOpen: () => void;
  onUsernameOpen: () => void;
}) => {
  const { user } = useAuthContext();
  const [hoveredUsername, setHoveredUsername] = useState(false);
  const [hoveredName, setHoveredName] = useState(false);

  const { mutateAsync: updateProfilePic, isPending: isUpdatingProfilePic } =
    useUpdateProfilePic();
  const handleProfilePic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null = e.target.files ? e.target.files[0] : null;

    return await updateProfilePic({
      profileId,
      profilePicFile: file,
    });
  };

  return (
      <div className="lg:w-[80%] ml-[130px] w-full justify-center gap-3 mx-auto flex items-center relative">
        {profileId === user.id ? (
            <label
                htmlFor="profileImageInput"
                className="cursor-pointer relative lg:w-[120px] w-[120px] h-[100px] lg:h-[100px]"
            >
          <img
            src={profile?.profilePic}
            className="rounded-full object-cover w-[90%] cursor-pointer"
            alt={profile?.username}
          />
          <input
            id="profileImageInput"
            type="file"
            accept="image/*"
            onChange={handleProfilePic}
            style={{ display: "none" }}
          />
          {isUpdatingProfilePic && (
            <CircularProgress
              className="absolute"
              size="lg"
              classNames={{
                svg: "drop-shadow-md",
                indicator: "stroke-[#FC356D]",
                track: "stroke-white/10",
              }}
            />
          )}
        </label>
      ) : (
        <div className="lg:w-[120px] md:w-[100%]  w-[120px] h-[100px] lg:h-[100px]">
          <img
            src={profile?.profilePic}
            className="rounded-full object-cover w-[80%] h-[100%] "
            alt={profile?.username}
          />
        </div>
      )}
      <div className='flex justify-between items-center w-full'>
        <div>
          <span className='flex items-center gap-2' onMouseEnter={() => setHoveredName(true)} onMouseLeave={() => setHoveredName(false)}>
               <h1 className='font-[600] text-[25px] md:text-[35px]'>{profile?.name}</h1>
            <button onClick={onNameOpen} className="text-neutral-500 text-[20px] hover:text-white" style={{visibility: profileId === user.id && hoveredName ? "visible" : "hidden"}} ><CiEdit/></button>
          </span>
          <span className='flex items-center gap-2' onMouseEnter={() => setHoveredUsername(true)} onMouseLeave={() => setHoveredUsername(false)}>
               <h1 className='text-neutral-500 font-[300] text-[20px]'>@{profile?.username}</h1>
            <button onClick={onUsernameOpen} className="text-neutral-500 text-[20px] hover:text-white" style={{visibility: profileId === user.id && hoveredUsername ? "visible" : "hidden"}} ><CiEdit/></button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
