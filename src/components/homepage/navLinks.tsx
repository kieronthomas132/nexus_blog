import { useAuthContext } from "../../context/AuthContext.tsx";
import { AiOutlineHome } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";

const NavLinks = () => {
  const { user } = useAuthContext();

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

  return { sidebarLinks };
};

export default NavLinks;
