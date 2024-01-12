import logo from "../../assets/nexus_logo.svg";
import { useAuthContext } from "../../context/AuthContext.tsx";
import { AiOutlineHome } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { Tooltip, useDisclosure } from "@nextui-org/react";
import { IoCreateOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import CreatePostModal from "./createPostModal.tsx";

import { useLogoutUser } from "../../lib/react-query/queries&Mutations.tsx";
import { useActiveLinkContext } from "../../context/activeLinkContext.tsx";

const Sidebar = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { user } = useAuthContext();
  const { mutateAsync: logoutUser } = useLogoutUser();
  const { activeLink, setActiveLink } = useActiveLinkContext();

  const navigate = useNavigate();

  const sidebarLinks = [
    {
      icon: <AiOutlineHome />,
      link: "/home",
      content: "Home",
    },
    {
      icon: <FaRegUser />,
      link: `/profile/${user.id}`,
      content: "Profile",
    },
  ];

  const handleLinkClick = (link: string) => {
    if (link) {
      setActiveLink(link);
    }
  };

  const handleLogout = async () => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if(cookieFallback) {
    const loggedOut = await logoutUser();
    localStorage.removeItem("cookieFallback")
    navigate("/");
      return loggedOut;
    }


  };

  return (
    <div className="w-[150px] hidden md:flex  flex-col items-center pt-[20px]  h-[100vh] border-r border-[#303033]">
      <div>
        <a href="/home">
          <img src={logo} className="w-[40px]" alt="logo" />
        </a>
      </div>
      <div className="h-full">
        <ul className="h-[80%] gap-8 flex flex-col justify-center">
          {sidebarLinks &&
            sidebarLinks.map((link, index) => (
              <li key={index} onClick={() => handleLinkClick(link.content)}>
                <Tooltip
                  content={link.content}
                  className="bg-[#FC356D] text-white"
                >
                  <a href={link.link}>
                    <button
                      className={`text-[25px] p-2 rounded-md ${
                        activeLink === link.content ? "bg-[#FC356D] " : ""
                      }`}
                    >
                      {link.icon}
                    </button>
                  </a>
                </Tooltip>
              </li>
            ))}
        </ul>
        <div className="text-[25px] text-white flex items-center justify-center">
          <Tooltip
            content="Create new post"
            className="bg-[#FC356D] text-white"
          >
            <button
              onClick={onOpen}
              className="focus:outline-none hover:bg-[#FC356D] p-2 rounded-md"
            >
              <IoCreateOutline />
            </button>
          </Tooltip>
        </div>
      </div>
      <CreatePostModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="bg-[#FC356D] p-2 rounded-lg text-sm border border-[#FC356D] hover:bg-transparent"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
