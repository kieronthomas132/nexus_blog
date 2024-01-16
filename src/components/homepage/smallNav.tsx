import {RiMenu3Fill} from "react-icons/ri";
import {useState} from "react";
import {AiOutlineHome} from "react-icons/ai";
import {FaRegUser} from "react-icons/fa";
import {useAuthContext} from "../../context/AuthContext.tsx";
import {Tooltip} from "@nextui-org/react";
import {useActiveLinkContext} from "../../context/activeLinkContext.tsx";

const SmallNav = () => {
    const {user} = useAuthContext()
    const [navOpen, setNavOpen] = useState(false)

    const { activeLink, setActiveLink } = useActiveLinkContext();

    const handleLinkClick = (link: string) => {
        if (link) {
            setActiveLink(link);
        }
    };

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
    return (
        <div className='p-3 md:hidden '>
            <div className='text-[25px]'>
                <button className='p-2' onClick={() => setNavOpen(!navOpen)}><RiMenu3Fill className='text-[#FC356D]'/></button>
            </div>
            {navOpen && <ul className="absolute top-[80px] p-3 rounded-lg bg-[#262628] right-0">
                {sidebarLinks &&
                    sidebarLinks.map((link, index) => (
                        <li key={index} onClick={() => handleLinkClick(link.content)}>
                            <Tooltip
                                content={link.content}
                                className="bg-[#FC356D] text-white gap-"
                            >
                                <a href={link.link}>
                                    <button
                                        className={`text-[25px] p-2  my-4 rounded-md ${
                                            activeLink === link.content ? "bg-[#FC356D] " : ""
                                        }`}
                                    >
                                        {link.icon}
                                    </button>
                                </a>
                            </Tooltip>
                        </li>
                    ))}
            </ul>}
        </div>
    );
}

export default SmallNav;