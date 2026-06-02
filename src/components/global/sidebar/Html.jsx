import styles from "./index.module.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button, Tooltip } from "antd";
import { logout } from "../../../actions/user";
import { useDispatch } from "react-redux";
import methodModel from "../../../methods/methods";
import { LuLogOut } from "react-icons/lu";
import { globalLogout } from "../../../models/string.models";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const Html = ({
  ListItemLink,
  tabclass,
  isAllow,
  route,
  isOpen,
  user,
  menus,
  particularData,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useNavigate();
  const isCollapsed = isOpen;
  const activeSection = particularData?.[0];

  const Logout = () => {
    dispatch(logout());
    globalLogout();
    history("/login");
  };

  return (
    <>
      <div
        className={`h-full flex justify-between flex-col ${isCollapsed ? styles.sm_sidebar : ""}`}
        component="siderbar"
      >
        <div id="logoutBtn" onClick={() => Logout()}></div>
        <div className="h-[82%] px-[8px] overflow-auto pt-3">
          {!isCollapsed && activeSection ? (
            <div className="mb-4 rounded-[10px] border border-white/15 bg-white/10 px-3 py-3 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[18px]">{activeSection.icon}</span>
                <span className="text-[15px] font-semibold">{activeSection.name}</span>
              </div>
              <p className="text-[12px] text-white/70 mb-3">Sous-menus</p>
              <div className="space-y-2">
                {activeSection?.menu?.map((tab) => (
                  <NavLink
                    key={tab.url}
                    to={tab.url}
                    className={({ isActive }) =>
                      classNames(
                        "flex items-center gap-2 rounded-[10px] px-3 py-2 text-sm",
                        isActive ? "bg-white text-[#1f2937]" : "text-white/90 hover:bg-white/15"
                      )
                    }
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ) : null}

          <div className={`mb-2 ${isCollapsed ? "" : "px-1"}`}>
            {!isCollapsed && (
              <p className="text-white/85 text-[10px] mb-2 tracking-wide uppercase">Main Menu</p>
            )}
          </div>
          <ul className="space-y-1">
            {menus.map((itm, index) => {
              if (!isAllow(itm.key)) return null;
              const isActive =
                itm.url === "/dashboard"
                  ? location.pathname === "/dashboard"
                  : location.pathname === itm.url || location.pathname.startsWith(`${itm.url}/`);
              return (
                <span key={index} className="block">
                  {itm.icon ? (
                    <>
                      <li
                        className={
                          isActive
                            ? `mb-2 rounded-[10px] ${isCollapsed ? "w-[40px] mx-auto" : "w-full"} bg-white shadow-sm`
                            : `mb-2 rounded-[10px] ${isCollapsed ? "w-[40px] mx-auto" : "w-full"} text-white/90 hover:bg-white/15`
                        }
                      >
                        {isAllow(itm.key) ? (
                          <Tooltip placement="right" color="#976DD0" title={itm.name}>
                            <NavLink
                              to={itm.url}
                              end={itm.url === "/dashboard"}
                              className={`h-[40px] flex items-center ${isCollapsed ? "justify-center w-[40px] mx-auto" : "justify-start px-3 gap-3 w-full"} ${isActive ? "font-medium text-[#20988e]" : "text-white"}`}
                            >
                              <span className={`admin-sidebar__icon-wrap flex shrink-0 items-center justify-center ${isActive ? "text-[#20988e] [&_svg]:text-[#20988e]" : "text-white [&_svg]:text-white"}`}>
                                {itm.icon}
                              </span>
                              {!isCollapsed && (
                                <span className="admin-sidebar__label text-[15px] leading-[20px]">{itm.name}</span>
                              )}
                            </NavLink>
                          </Tooltip>
                        ) : null}
                      </li>
                    </>
                  ) : (
                    <>
                      <li className={isCollapsed ? "hidden" : ""}>
                        <h6 className="p-[12px] text-xs font-medium text-white/70 mt-[12px]">
                          <span className="sidebar_text text-left heading_block">{itm.name}</span>
                        </h6>
                      </li>
                    </>
                  )}
                </span>
              );
            })}
          </ul>
        </div>

        <div className={`flex h-[14%] px-[8px] pb-5 ${isCollapsed ? "flex-col items-center justify-center" : "items-center justify-between gap-2"}`}>
          <button
            onClick={() => Logout()}
            className={`text-white ${isCollapsed ? "" : "px-3 py-2 rounded-[10px] hover:bg-white/15 flex items-center gap-2"}`}
          >
            <LuLogOut className={`text-white ${isCollapsed ? "mb-3" : "mb-0"}`} />
            {!isCollapsed && <span className="text-[14px]">Logout</span>}
          </button>
          <NavLink to="/profile">
            <img
              alt="image"
              src={methodModel.userImg(user.image)}
              className={`rounded-full object-cover ${isCollapsed ? "h-8 w-8" : "h-9 w-9"}`}
            />
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Html;
