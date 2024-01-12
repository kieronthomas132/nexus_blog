import {Route, Routes} from "react-router";
import Posts from "./posts.tsx";
import Search from "./search.tsx";

const Main = () => {
    return (
        <div className="w-full flex">
            <div className="lg:w-[80%] flex w-full pb-[40px]  pt-[40px] md:border-r md:border-[#303033] gap-4">
                <Routes>
                    <Route path='/' element={<Posts/>}/>
                </Routes>
            </div>
            <div className='w-[20%]  hidden lg:flex'>
                <Search/>
            </div>
        </div>
    );
}

export default Main;