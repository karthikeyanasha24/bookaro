import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../actions/user';
import { FaArrowRightLong } from 'react-icons/fa6';

const AcountSidebar = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const Logout = () => {
        dispatch(logout());
        localStorage.removeItem("persist:admin-app");
        localStorage.removeItem("token");
        navigate("/login");
    };
    const linksArr = [
        {
            main: "Parameters", link: [
                { label: "Personal information", link: "/profile/Account" },
                { label: "Notifications", link: "/profile/manage-notifications" },
            ]
        },
        {
            main: "Company settings", link: [
                { label: "Company profile", link: "/profile" },
            ]
        },
        {
            main: "Connection & securities", link: [
                { label: "Password", link: "/change-password" },
                { label: "Phone number", link: "/phone-number" },
            ]
        },
        {
            main: "Help", link: [
                { label: "Help center", link: "/help" },
            ]
        },
    ]
    
    return (
        <div className="xl:col-span-4 lg:col-span-5 col-span-12">
            <ul className="lg:mt-16 mt-0">
                {!user?._id && (
                    <li className="border border-[#BEBEBE] p-5 rounded-[5px] bg-white mb-4 hover:bg-[#986dcd] hover:border-white cursor-pointer hover:text-white group transition">
                        <h4 className="text-[#976DD0] font-bold lg:text-[18px] text-[16px] mb-1">
                            Create an account
                        </h4>
                        <p className="text-[#47525E] lg:text-[18px] text-[16px] font-medium">
                            Already have an account?{" "}
                            <a
                                className="text-[#976DD0] underline lg:text-[18px] text-[16px] font-bold"
                            >
                                Sign-in
                            </a>
                        </p>
                    </li>
                )}
                {linksArr.map((itm, i) => {
                    if (user?.accountType !== "pro" && itm.main === "Company settings") return
                    return (
                        <li key={i} className="border border-[#BEBEBE] p-5 rounded-[5px] bg-white mb-4 hover:bg-[#986dcd] hover:border-white cursor-pointer hover:text-white group transition">
                            <h4 className="text-[#47525E] font-bold lg:text-[18px] text-[16px] mb-1 group-hover:text-white">
                                {itm.main}
                            </h4>
                            {itm.link.map((link, i) => {
                                return (
                                    <p onClick={() => navigate(link.link)} className="cursor-pointer">
                                        <p className="text-[#47525E] lg:text-[18px] text-[16px] font-medium  mb-2 flex items-center justify-between group-hover:text-white">
                                            <p className="hover:underline">{link.label}</p>
                                            <FaArrowRightLong className="w-[20px] group-hover:text-white" />
                                        </p>
                                    </p>
                                )
                            })}
                        </li>
                    )
                })}
            </ul>
            <div className="mt-8 mx-auto flex items-center justify-center">
                <button
                    onClick={Logout}
                    className="py-1 px-4  rounded-[100px] border border-[#976DD0] text-[#31373E] hover:bg-[#976DD0] hover:text-white transition duration-300 ease-in-out"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default AcountSidebar
