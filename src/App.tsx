import "./index.css";
import {Route, Routes, useNavigate} from "react-router";
import WelcomePage from "./components/welcomepage/WelcomePage.tsx";
import SignUpForm from "./components/auth/forms/signUpForm.tsx";
import SignInForm from "./components/auth/forms/signInForm.tsx";
import Homepage from "./components/homepage/homepage.tsx";
import Post from "./components/post/post.tsx";
import Profile from "./components/profile/profile.tsx";
import SmallNav from "./components/homepage/smallNav.tsx";
import { useAuthContext } from "./context/AuthContext.tsx";
import {useEffect} from "react";
import Search from "./components/homepage/search.tsx";

const App = () => {

    const navigate = useNavigate()
    const cookieFallback = localStorage.getItem("cookieFallback");
    const {checkAuth} = useAuthContext()


    useEffect(() => {
        const checkLoggedIn = async () => {
            const isLoggedIn = await checkAuth()

            if(isLoggedIn && location.pathname === "/") {
                navigate("/home")
            }
        }
        checkLoggedIn()
    }, []);

  return (
      <div className="bg-[#19191C] text-white h-[100vh] relative">
          {cookieFallback === "[]" || cookieFallback === null ? (
              <Routes>
                  <Route path="/" element={<WelcomePage />} />
                  <Route path="sign-up" element={<SignUpForm />} />
                  <Route path="/sign-in" element={<SignInForm />} />
              </Routes>
          ) : (
              <>
                  <div className='md:hidden z-20 w-[100%] mx-auto fixed bg-[#19191C]'>
                  <Search/>
                  </div>
                  <Routes>
                      <Route path="/home" element={<Homepage />} />
                      <Route path="/post/:postId" element={<Post />} />
                      <Route path="/profile/:profileId" element={<Profile />} />
                  </Routes>
               <SmallNav />
              </>
          )}
      </div>
  );
};

export default App;
