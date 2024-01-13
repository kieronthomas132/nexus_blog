import { useEffect } from "react";
import { useNavigate } from "react-router";
import sideImage from "../../assets/side-img.svg";
import {useAuthContext} from "../../context/AuthContext.tsx";
const WelcomePage = () => {
  const navigate = useNavigate();
  const {checkAuth} = useAuthContext()


  // useEffect(() => {
  //   if (
  //     localStorage.getItem("cookieFallback") === "[]" ||
  //     localStorage.getItem("cookieFallback") === null
  //   ) {
  //     navigate("/");
  //   }
  // }, []);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const isLoggedIn = await checkAuth();

      if(isLoggedIn) {
        navigate("/home")
      }
      if(!isLoggedIn && location.pathname === "/home") {
        navigate("/")
      }
    }
    checkLoggedIn()
  }, []);


  return (
    <div className="text-gray-200 h-[100vh] overflow-y-hidden overflow-x-hidden flex flex-col items-center justify-center">
      <div className=" lg:grid lg:grid-cols-2">
        <div className="flex flex-col justify-center items-center text-center">
          <h1 className="lg:text-[80px] md:text-[60px] text-[40px] md:my-0 my-6 ">
            Welcome To Nexus
          </h1>
          <div className="flex gap-4">
            <div>
              <a href="/sign-in">
                <button className="w-[150px] bg-[#E33E6C] hover:bg-transparent border-2 transition-all ease-in-out duration-300 border-[#E33E6C] p-2 text-white rounded-full">
                  Sign in
                </button>
              </a>
            </div>
            <div>
              <a href="/sign-up">
                <button className="w-[150px] bg-[#E33E6C] hover:bg-transparent border-2 transition-all ease-in-out duration-300 border-[#E33E6C] p-2 text-white rounded-full">
                  Sign up
                </button>
              </a>
            </div>
          </div>
        </div>
        <div className="w-full items-center hidden lg:flex">
          <img src={sideImage} className="w-[100%] ml-20 h-[100%] rotate-12" alt='side-image' />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
