import { AiOutlineHome } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext.tsx";
import { useActiveLinkContext } from "../../context/activeLinkContext.tsx";
import { Tooltip, useDisclosure } from "@nextui-org/react";
import { IoCreateOutline } from "react-icons/io5";
import CreatePostModal from "./createPostModal.tsx";

const SmallNav = () => {
  const { user } = useAuthContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { activeLink, setActiveLink } = useActiveLinkContext();

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

  return (
    <div className="fixed z-10 w-full items-center bottom-[20px] text-white md:hidden">
      <div className="flex  w-[90%] justify-evenly items-center backdrop-blur bg-[#1E1F22]/40 mx-auto p-2 bg-[#1E1F22] rounded-lg">
        <ul className="h-[80%] items-center gap-8 flex ">
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
          <button
            onClick={onOpen}
            className="focus:outline-none hover:bg-[#FC356D] text-[30px] p-2 rounded-md"
          >
            <IoCreateOutline />
          </button>
          <CreatePostModal isOpen={isOpen} onOpenChange={onOpenChange} />
        </ul>
      </div>
    </div>
  );
};

export default SmallNav;
