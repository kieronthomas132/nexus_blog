import { useNavigate } from "react-router";
import { useState } from "react";
import { useAuthContext } from "../../../context/AuthContext.tsx";
import {
  useCreateNewAccount,
  useGetProfiles,
  useSignInAccount,
} from "../../../lib/react-query/queries&Mutations.tsx";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { CircularProgress } from "@nextui-org/react";

const SignUpForm = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    mutateAsync: createNewAccount,
    isPending: isCreatingNewAccount,
    isSuccess: isCreatingNewAccountSuccessful,
  } = useCreateNewAccount();
  const { mutateAsync: signInAccount } = useSignInAccount();
  const { data: profiles } = useGetProfiles();
  const [isVisible, setIsVisible] = useState(false);
  const { checkAuth } = useAuthContext();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password || !name || !username) {
      setError("Please enter all fields");
    }

    const existsUsername = profiles?.find((user) => user.username === username);
    const existsEmail = profiles?.find((user) => user.email === email);

    if (existsUsername) {
      setError("Username already in use");
    } else if (existsEmail) {
      setError("Email already in use");
    } else {
      const newAccount = await createNewAccount({
        email,
        password,
        name,
        username,
      });

      if (!newAccount) {
        throw new Error();
      }

      const session = await signInAccount({ email: email, password: password });

      if (!session) {
        setError("There was an error, please try again");
        throw new Error();
      }
      setError(null);

      const isLoggedIn = await checkAuth();

      if (isLoggedIn) {
        navigate("/home");
      }

      return session;
    }
  };

  return (
    <div className="text-white h-[100vh] w-full justify-center items-center flex flex-col">
      <div>
        {isCreatingNewAccount ? (
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-[60px]">Signing up</h1>
            <CircularProgress
              classNames={{
                svg: "drop-shadow-md",
                indicator: "stroke-[#FC356D]",
                track: "stroke-white/10",
              }}
            />
          </div>
        ) : isCreatingNewAccountSuccessful ? (
          <h2 className="text-[60px]">Success</h2>
        ) : (
          <h2 className="text-[60px]">Sign up</h2>
        )}
        <p className="flex items-center text-red-700 font-[600] justify-center">{error}</p>
      </div>
      <div className="mt-[20px] w-full items-center flex flex-col gap-[20px]">
        <form
          onSubmit={handleSignUp}
          className="flex flex-col gap-[20px] w-full justify-center items-center"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name"
            className="text-sm lg:w-[500px] w-[80%] p-3 rounded-full bg-transparent border border-[#E33E6C] focus:outline-none"
          />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            className="text-sm lg:w-[500px] w-[80%] p-3 rounded-full bg-transparent border border-[#E33E6C] focus:outline-none"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
            className="text-sm lg:w-[500px] w-[80%] p-3 rounded-full bg-transparent border border-[#E33E6C] focus:outline-none"
          />
          <div className="relative justify-center items-center flex lg:w-auto w-[80%]">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={isVisible ? "text" : "password"}
              placeholder="Password"
              className="text-sm lg:w-[500px] w-[100%] p-3 rounded-full bg-transparent border border-[#E33E6C] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className="absolute right-5 bottom-2.5 text-[25px]"
            >
              {isVisible ? <IoMdEye /> : <IoMdEyeOff />}
            </button>
          </div>
          <div className="flex mt-[10px] gap-4 w-full flex-col justify-center items-center">
            <button
              type="submit"
              className="bg-[#E33E6C] p-2 w-[80%] rounded-full border border-transparent hover:bg-transparent hover:border hover:border-[#E33E6C] lg:w-[35%]"
            >
              Sign up
            </button>
            <a href="/" className="w-full flex  justify-center">
              <button
                type="button"
                className="bg-[#E33E6C] p-2 w-[80%] rounded-full border border-transparent hover:bg-transparent hover:border hover:border-[#E33E6C] lg:w-[35%]"
              >
                Back to Homepage
              </button>
            </a>
            <h3>Already have an account? </h3>
            <a href="/sign-in" className="w-full flex  justify-center">
              <button
                type="button"
                className="bg-[#E33E6C] p-2 w-[80%] rounded-full border border-transparent hover:bg-transparent hover:border hover:border-[#E33E6C] lg:w-[35%]"
              >
                Login
              </button>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
