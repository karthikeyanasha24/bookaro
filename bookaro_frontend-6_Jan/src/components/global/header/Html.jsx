import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Sidebar from "../sidebar";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Html = ({
  isOpen,
  toggle,
  searchHandle,
  search,
  user,
  isOpen1,
  searchChange,
  clear,
  Logout,
  particularData,
}) => {
  const location = useLocation()
  const logos = () => {
    let value = "/assets/img/logo.png";
    return value;
  };
  return (
    <nav
      component="header"
      className={`${
       location.pathname == "/dashboard" ? "min-sidebar w-[calc(100%-50px)]" :  isOpen ?  "min-sidebar w-[calc(100%-50px)]" : "w-[calc(100%-280px)] sidebar-h"
      } shadow-btn py-1.5 bg-[#f8f9fa] border-b  fixed transition-[width] duration-300 ml-auto right-0 z-10 flex items-center h-[71px] !px-5
      `}
    >  
    {/* <h4 className="ms-2 text-[22px] font-medium">{particularData?.[0]?.name}</h4> */}
    {isOpen && <img src={logos()} className="w-[160px]" />}
    {location.pathname == "/dashboard"  && <img src={logos()} className="w-[160px]" />}
      {location.pathname != "/dashboard" && <button
        onClick={toggle}
        className=" shrink-0  "
      >
        {!isOpen ? (
         <div className="absolute -left-[18px] h-7 w-7 p-1 rounded-lg  !text-primary shadow-btn hover:shadow-none top-[23px]">
          <p className="bg-[#996dca1f] w-[22px] h-[22px] absolute -z-[2] rounded-full left-[14px] top-[3px]"></p>
     
          <FaLongArrowAltLeft className="w-full h-full text-[10px] text-[#976DD0]"/>
         </div>
          // <FiMenu className="w-full h-full" />
        ) : (
          <div className="absolute -left-[8px] h-7 w-7 p-1 rounded-lg  !text-primary shadow-btn hover:shadow-none top-[23px]">
          <p className="bg-[#996dca1f] w-[22px] h-[22px] absolute -z-[2] rounded-full left-[12px] top-[3px]"></p>
     
          <FaLongArrowAltRight  className="w-full h-full text-[10px] text-[#976DD0]"/>
         </div>
          
        )}
      </button>}

      {/* <div className="flex items-center gap-4 ml-auto">
        <Menu as="div" className="relative">
          <div>
            <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-1 text-sm font-semibold text-gray-900 ">
              <div className="flex items-center">
                <div className="flex items-center">
                  <img
                    alt="image"
                    src={methodModel.userImg(user.image)}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-2 text-left">
                    <b className="capitalize">{user.fullName}</b>
                    <p className="grayCls mb-0 text-capitalize">
                      {user.customerRole?.name}
                    </p>
                  </div>
                </div>
                <i
                  className="fa fa-angle-down top-1 relative h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/profile"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm flex items-center gap-2"
                      )}
                    >
                      <LuUser /> Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/profile/change-password"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm flex items-center gap-2"
                      )}
                    >
                      <GoLock />

                      Change Password
                    </Link>
                  )}
                </Menu.Item>

                <Menu.Item className="divide-y-1 divide-gray-800 pt-1  mt-2">
                  <p className="border-t"></p>
                </Menu.Item>

                <Menu.Item className="">
                  {({ active }) => (
                    <span
                      id="logoutBtn"
                      onClick={() => Logout()}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block w-full px-4 py-2 text-left text-sm ancortag flex items-center gap-2 cursor-pointer"
                      )}
                    >
                      <LuLogOut /> Logout
                    </span>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div> */}
      {isOpen1 ? (
        <div className="w-100 mobi-dropdown">
          <Sidebar />
        </div>
      ) : (
        <></>
      )}
    </nav>
  );
};

export default Html;
