import Sidebar from "./sidebar.tsx";
import Main from "./main.tsx";

const Homepage = () => {
    return (
        <div className='flex h-[100vh]  text-white'>
            <Sidebar/>
            <Main/>
        </div>
    );
}

export default Homepage;