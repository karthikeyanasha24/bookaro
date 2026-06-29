import React, { useEffect, useState, Fragment } from "react";
import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import permissionModel from "../../../models/permisstion.model";
import ApiClient from "../../../methods/api/apiClient";
import { Menu, Transition } from "@headlessui/react";
import methodModel from "../../../methods/methods";
import { FaFacebookF } from "react-icons/fa";
import { SlSocialTwitter } from "react-icons/sl";
import { FaGithub } from "react-icons/fa6";
import { FaDribbble } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { login_success, logout } from "../../../actions/user";
import { globalLogout, removeLocal } from "../../../models/string.models";

const PageLayout = ({ children }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useNavigate();
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {
    if (!user.loggedIn) {
    } else {
      let permissions = user.roleDetail?.permissions?.[0];
      if (!permissionModel.urlAllow(permissions)) {
        // history("/profile")
      }
      let browseload = localStorage.getItem("browseload");
      if (!browseload) {
        ApiClient.get("api/user/detail", { id: user._id }).then(async (res) => {
          if (res.success) {
            let data = { ...user, ...res.data };
            dispatch(login_success(data));
          }
        });
      }
    }
  }, []);

  const menus = [
    { name: "Home", url: "/" },
    { name: "Projects", url: "/" },
    { name: "Market", url: "/" },
    { name: "About", url: "/" },
  ];

  const Logout = () => {
    dispatch(logout());
    globalLogout();
    history("/login");
  };

  return (
    <>
      <div component="page-layout">
        <header>
          <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xxl">
              <Link to="/" className="flex items-center">
                <img
                  src="/assets/img/logo.png"
                  className="mr-3 h-10 lg:h-16 sm:h-10"
                  alt="Flowbite Logo"
                />
                {/* <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span> */}
              </Link>
              <div className="flex items-center lg:order-2">
                {user?.loggedIn ? (
                  <>
                    <Menu as="div" className="relative  ml-auto">
                      <div>
                        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-1 mb-0 text-sm font-semibold text-gray-900 ">
                          <div className="flex items-center">
                            <div className="flex items-center">
                              <img
                                alt="image"
                                src={methodModel.userImg(user.image)}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                              <div className="ml-2 text-left hidden md:block">
                                <b>{user.fullName}</b>
                                <p className="grayCls mb-0 text-capitalize">
                                  {user.customerRole?.name}
                                </p>
                              </div>
                            </div>
                            <i
                              className="fa fa-angle-down top-1 relative h-5 w-5 text-gray-400 hidden md:block"
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
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "block px-4 py-2 text-sm"
                                  )}
                                >
                                  <i className="far fa-user mr-2" /> Profile
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/dashboard"
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "block px-4 py-2 text-sm flex align-center"
                                  )}
                                >
                                  <span class="material-symbols-outlined text-base middle mr-2">
                                    dashboard
                                  </span>{" "}
                                  Dashboard
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/profile/change-password"
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "block px-4 py-2 text-sm"
                                  )}
                                >
                                  <i
                                    className="fa fa-cog mr-2"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  Change Password
                                </Link>
                              )}
                            </Menu.Item>

                            <Menu.Item className="divide-y-1 divide-gray-800 pt-1  mt-2">
                              <p className="border-t"></p>
                            </Menu.Item>

                            <Menu.Item className="">
                              {({ active }) => (
                                <a
                                  type="submit"
                                  onClick={() => Logout()}
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "block w-full px-4 py-2 text-left text-sm ancortag"
                                  )}
                                >
                                  <i className="fas fa-sign-out-alt mr-2" />{" "}
                                  Logout
                                </a>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2. dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                    >
                      Log in
                    </Link>
                  </>
                )}

                <button
                  data-collapse-toggle="mobile-menu-2"
                  type="button"
                  className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  aria-controls="mobile-menu-2"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <svg
                    className="hidden w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
              <div
                className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                id="mobile-menu-2"
              >
                <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                  {menus.map((itm) => {
                    return (
                      <li key={itm.name}>
                        <Link
                          to={itm.url}
                          className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                        >
                          {itm.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </nav>
        </header>

        <main className="pageContent">{children}</main>

        <footer className="bg-black	xl:py-20 xl:px-20 px-8 py-6">
          <div className="container items-center mx-auto">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-4">
                <div>
                  <img
                    className="w-full  object-cover max-w-28"
                    src="assets/img/skill/footer-logo.png"
                    alt=""
                  />
                  <p className="text-gray-300 my-8 w-1/2 text-sm">
                    In the fast-paced world of modern technology, many
                    leadership executives and organizations understand that
                    building.
                  </p>
                  <ul className="flex items-center">
                    <li className="border border-gray-300 p-2 rounded-3xl w-9	 h-9 text-center cursor-pointer hover:bg-blue-500 group">
                      <FaFacebookF className="text-white" />
                    </li>
                    <li className="border border-gray-300 p-2 rounded-3xl w-9	 h-9 text-center cursor-pointer hover:bg-blue-500 group ms-3">
                      <FaDribbble className="text-white" />
                    </li>
                    <li className="border border-gray-300 p-2 rounded-3xl w-9	 h-9 text-center cursor-pointer hover:bg-blue-500 group ms-3">
                      <FaGithub className="text-white" />
                    </li>
                    <li className="border border-gray-300 p-2 rounded-3xl w-9	 h-9 text-center cursor-pointer hover:bg-blue-500 group ms-3">
                      <SlSocialTwitter className="text-white" />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-8  md:mt-6 sm:mt-6  ">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-12 lg:col-span-4">
                    <h2 className="text-white font-bold text-lg mb-8">
                      Quick Links
                    </h2>
                    <ul>
                      <li className=" text-gray-300 group">
                        <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2">
                          Career
                        </p>
                      </li>
                      <li className=" text-gray-300 group">
                        <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2">
                          About Us
                        </p>
                      </li>
                      <li className=" text-gray-300 group">
                        <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2">
                          Contact
                        </p>
                      </li>
                      <li className=" text-gray-300 group">
                        <p className="text-gray-300 group-hover:text-white cursor-pointer">
                          Privacy Poilcy
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <h2 className="text-white font-bold text-lg mb-8">
                      Community
                    </h2>
                    <ul>
                      <li className=" text-gray-300 group">
                        <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2">
                          Learners
                        </p>
                      </li>
                      <li className=" text-gray-300 group">
                        <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2">
                          Leadership
                        </p>
                      </li>
                      <li className=" text-gray-300 group">
                        <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2">
                          Partners
                        </p>
                      </li>
                      <li className=" text-gray-300 group">
                        <p className="text-gray-300 group-hover:text-white cursor-pointer">
                          Developers
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <h2 className="text-white font-bold text-lg mb-8">
                      Newsletter
                    </h2>
                    <ul>
                      <li className=" text-gray-300 ">
                        <p className="text-gray-300 ">
                          Sign up and receive the latest tips via email.
                        </p>
                      </li>
                    </ul>
                    <div className="text-white relative">
                      <img
                        className="absolute top-1/2 transform left-4	"
                        src="assets/img/skill/mail.svg "
                        alt=""
                      />
                      <input
                        type="email"
                        // placeholder="Enter Your Mail"
                        className="bg-white opacity-100 placeholder:text-white py-3 px-2 mt-4 rounded pl-12 text-white w-full"
                      />
                    </div>
                    <div className=" w-full ">
                      <button className="bg-[#976DD0] text-white	py-3 px-8 text-base	 w-full text-sm rounded flex items-center	mt-8">
                        Subscribe Now{" "}
                        <img
                          className="ms-4	"
                          src="assets/img/skill/plane.svg "
                          alt=""
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};
export default PageLayout;
