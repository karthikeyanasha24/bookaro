import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Layout from "../../components/global/layout";
import methodModel from "../../methods/methods";
import "./profile.scss";

const Profile = () => {
  const user = useSelector((state: any) => state.user);

  return (
    <Layout>
      <div className="wrapper_section">
        <div className="flex items-center  justify-between">
          <h3 className=" text-lg lg:text-2xl font-semibold text-[#111827]">
            Profile Information
          </h3>
        </div>

        <div className="inner_part sm:mt-3 md:mt-8 ">
          <div className="grid  grid-cols-12 gap-4 mb-5 ">
            <div className="col-span-12  xl:col-span-3 lg:col-span-4">
              <div className="shadow-box  rounded-lg bg-[#f1e9fb]  p-5   border-white border-[3px]">
                <div>
                  <img
                    src={methodModel.userImg(user && user.image)}
                    className="h-32 w-32 rounded-full object-cover mx-auto"
                  />
                  <Link
                    to="/profile/edit"
                    className="px-2 lg:!px-4 text-sm font-normal bg-[#976DD0]  text-white h-10 flex items-center justify-center gap-2 !bg-primary rounded-lg shadow-btn hover:opacity-80 transition-all focus:ring-2 ring-[#EDEBFC] disabled:bg-[#D0CAF6] disabled:cursor-not-allowed mt-5 max-w-[200px] mx-auto "
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                    </svg>
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-span-12  xl:col-span-9 lg:col-span-8 rounded-lg bg-white shadow-box">
              <div className="flex flex-col gap-y-4 p-5">
                <div>
                  <label className="text-gray-500 text-[14px] ">Name</label>
                  <p className="text-[16px] flex items-center gap-2  capitalize">
                    {user && user?.fullName}
                  </p>
                </div>
                <div>
                  <label className="text-gray-500 text-[14px]">Email</label>
                  <p className="text-[16px] flex items-center gap-2 ">
                    {user && user?.email}
                  </p>
                </div>
                <div>
                  <label className="text-gray-500 text-[14px]">Mobile Number</label>
                  <p className="text-[16px] flex items-center gap-2 ">
                    <div >
                    {user?.mobileNo}
                    </div>
                  </p>
                </div>
                <div>
                  <label className="text-gray-500 text-[14px]">Average price KWH (including Tax)</label>
                  <p className="text-[16px] flex items-center gap-2 ">
                    <div >
                    {user?.kwh}
                    </div>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
