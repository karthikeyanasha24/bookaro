import styles from "./index.module.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button, Tooltip } from "antd";
import { logout } from "../../../actions/user";
import { useDispatch } from "react-redux";
import methodModel from "../../../methods/methods";
import { LuLogOut } from "react-icons/lu";
import { globalLogout } from "../../../models/string.models";

const Html = ({
  ListItemLink,
  tabclass,
  isAllow,
  route,
  isOpen,
  user,
  menus,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useNavigate();

  const activecls = (tab) => {
    const url = window.location.href;
    let value = false;
    tab?.forEach((itm) => {
      if (url.includes(itm)) {
        value = true;
      }
    });
    return value;
  };

  const Logout = () => {
    dispatch(logout());
    globalLogout()
    history("/login");
  };

  return (
    <>
      <div
        className={` mt-5 h-full flex justify-between flex-col   ${isOpen && styles.sm_sidebar
          }`}
        component="siderbar"
      >
        <div id="logoutBtn" onClick={() => Logout()}></div>
        <div className="h-[80%] px-[6px] overflow-auto">
          <div className="">
            {" "}
            <p className="text-white text-[10px] text-center mb-5 ">Main Menu</p>
          </div>
          <ul className="space-y-2 ">
            {menus.map((itm, index) => {
              if (!isAllow(itm.key)) return null;
              return (
                <span key={index} className="mx-auto">
                  {itm.icon ? (
                    <>
                      <li
                        className={
                          location.pathname.includes(itm.url)
                            ? "mb-4 flex items-center justify-center w-[30px] h-[30px] mx-auto rounded-full bg-white text-[#20988e]"
                            : "mb-4 flex items-center justify-center w-[30px] h-[30px] mx-auto rounded-full text-[#20988e] "
                        }
                      >
                        <>
                          {isAllow(itm.key) ? (
                            <>
                              <Tooltip
                                placement="right"
                                color="#976DD0"
                                title={itm.name}
                              >
                                <NavLink
                                  to={itm.url}
                                  className={(isActive) =>
                                    " w-[30px] h-[30px] flex items-center justify-center " +
                                    (location?.pathname.includes(itm.url) &&
                                      " !text-[#20988e]  !font-medium w-[30px] h-[30px] mx-auto active-span")
                                  }
                                >
                                  <span className="">{itm.icon}</span>
                                </NavLink>
                              </Tooltip>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <h6
                          className={`${isOpen ? "py-[12px] " : "p-[12px]  text-md"
                            } text-xs font-medium text-[#7E8B99] mt-[12px]`}
                        >
                          <span className=" sidebar_text text-center heading_block">
                            {" "}
                            {itm.name}{" "}
                          </span>
                        </h6>
                      </li>
                    </>
                  )}
                </span>
              );
            })}
          </ul>
        </div>


        <div className="flex  justify-center h-[14%] px-[6px] pb-7 flex-col items-center">
          <button onClick={() => Logout()}
          >
            <LuLogOut className="text-white mb-3" />
          </button>
          <NavLink
            to={"/profile"}
          // className={location.pathname != tab.url ? "flex items-center py-2 px-3 block text-[#413e3e] text-[14px] text-left rounded-md" : "bg-[#7bbeb82e] flex items-center py-2 px-3 block text-[#413e3e] text-[14px] text-left rounded-md"}
          >
            <img
              alt="image"
              src={methodModel.userImg(user.image)}
              className="h-8 w-8 rounded-full object-cover"
            />
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Html;
