import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCurrentAccount } from "../lib/api.tsx";
import {useNavigate} from "react-router";

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  profilePic: string;
  bio: string;
};

export interface IContext {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<SetStateAction<boolean>>;
  checkAuth: () => Promise<boolean>;
}

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  profilePic: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuth: async () => false as boolean,
};

const AuthContext = createContext<IContext>(INITIAL_STATE);

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error();
  }

  return context;
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate()

  const checkAuth = async () => {
    try {
      const currentAccount = await getCurrentAccount();
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          profilePic: currentAccount.profilePic,
          bio: currentAccount.bio,
        });
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (err) {
      console.log(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    const cookieFallback = localStorage.getItem('cookieFallback');
    if(cookieFallback === "[]" && location.pathname === "/home") {
      navigate('/')
    }
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
