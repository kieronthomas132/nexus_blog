import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useAuthContext } from "../../../context/AuthContext.tsx";
import { useNavigate } from "react-router";
import { useSignInAccount } from "../../../lib/react-query/queries&Mutations.tsx";
import { CircularProgress } from "@nextui-org/react";
const SignInForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [isVisible, setIsVisible] = useState(false);

  const {
    mutateAsync: signInAccount,
    isPending: isSigningInAccountPending,
    isSuccess: isSigningInSuccess,
    isError: isSigningInError,
  } = useSignInAccount();

  const { checkAuth } = useAuthContext();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.trim() === "") {
      setError("Please enter a valid password");
    }
    if (email.trim() === "") {
      setError("Please enter a valid email address");
    }
    if (email.trim() === "" && password.trim() === "") {
      setError("Please enter an email and password");
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
  };

  return (
    <div className="text-white h-[100vh] overflow-x-hidden w-full justify-center items-center flex flex-col">
      <div>
        {isSigningInAccountPending ? (
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-[60px]">Signing in</h2>
            <CircularProgress
              classNames={{
                svg: "drop-shadow-md",
                indicator: "stroke-[#FC356D]",
                track: "stroke-white/10",
              }}
            />
          </div>
        ) : isSigningInSuccess && !error ? (
          <h2 className="text-[60px]">Success</h2>
        ) : (
          <h1 className="text-[60px]">Sign in</h1>
        )}
        {isSigningInError ? <h2 className='text-[60px]'>Error</h2> : null}
      </div>
      {error}
      <form className="w-full" onSubmit={handleLogin}>
        <div className="mt-[20px] w-full items-center flex flex-col gap-[20px]">
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
              Sign in
            </button>
            <a href="/" className="w-full flex  justify-center">
              <button
                type="button"
                className="bg-[#E33E6C] p-2 w-[80%] rounded-full border border-transparent hover:bg-transparent hover:border hover:border-[#E33E6C] lg:w-[35%]"
              >
                Back to Homepage
              </button>
            </a>
            <h3>Don't have an account? </h3>
            <a href="/sign-up" className="w-full flex  justify-center">
              <button
                type="button"
                className="bg-[#E33E6C] p-2 w-[80%] rounded-full border border-transparent hover:bg-transparent hover:border hover:border-[#E33E6C] lg:w-[35%]"
              >
                Sign up
              </button>
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
