import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export interface IActiveLinkContext {
  activeLink: string;
  setActiveLink: Dispatch<SetStateAction<string>>;
}

export const ActiveLinkContext = createContext<IActiveLinkContext | null>(null);

export const useActiveLinkContext = () => {
  const context = useContext(ActiveLinkContext);

  if (!context) {
    throw new Error(
      "ActiveLinkContext must be used in a ActiveLinkContextProvider",
    );
  }

  return context;
};

export const ActiveLinkContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [activeLink, setActiveLink] = useState(() => {
    const storedLink = sessionStorage.getItem("activeLink");
    return storedLink || "Home"
  });


  useEffect(() => {
    if(location.pathname.includes("/home")) {
      setActiveLink("Home")
    }
    if(location.pathname.includes("/profile")) {
      setActiveLink("Profile")
    }
    sessionStorage.setItem("activeLink", activeLink);
  }, [activeLink]);
  return (
    <ActiveLinkContext.Provider value={{ activeLink, setActiveLink }}>
      {children}
    </ActiveLinkContext.Provider>
  );
};
