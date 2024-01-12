import { useSearchProfiles } from "../../lib/react-query/queries&Mutations.tsx";
import { useState } from "react";
import { CircularProgress } from "@nextui-org/react";
import { RxCross2 } from "react-icons/rx";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: profiles, isFetching: isProfilesFetching, isPending: isProfilesPending } =
    useSearchProfiles(searchQuery);

  return (
    <div className="p-2.5 text-white mx-auto w-full relative justify-center">
      <input
        type="text"
        placeholder="Search"
        className="bg-transparent text-sm w-full p-2.5 focus:outline-none rounded-full text-white border border-[#FC356D]"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div
        onClick={() => setSearchQuery("")}
        className=" cursor-pointer hover:bg-[#262628] rounded-full p-1 absolute top-[18px] text-neutral-500 hover:white right-8"
      >
        <RxCross2 />
      </div>
      {profiles && profiles.length > 0 && (
        <div className="bg-[#262628] flex flex-col gap-2 p-2 mt-2 rounded-lg">
          {isProfilesFetching&& profiles.length === 0 && isProfilesPending  ? (
            <div className="flex items-center justify-center">
              <CircularProgress
                size="sm"
                classNames={{
                  svg: "drop-shadow-md",
                  indicator: "stroke-[#FC356D]",
                  track: "stroke-white/10",
                }}
              />
            </div>
          ) : (
            <div>
              {profiles?.map((profile) => (
                <div>
                  <ul>
                    <a href={`/profile/${profile.$id}`}>
                      <li className="flex gap-2 items-center hover:bg-[#19191C] p-2 rounded-lg">
                        <img
                          src={profile.profilePic}
                          className="w-[30px] rounded-full"
                          alt={profile.username}
                        />
                        <div className="text-sm">
                          <h3>{profile.name}</h3>
                          <h4 className="text-neutral-500">
                            @{profile.username}
                          </h4>
                        </div>
                      </li>
                    </a>
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
