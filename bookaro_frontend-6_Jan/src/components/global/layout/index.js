// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";
// import { logout } from "../../../actions/user";
// import { messageListener } from "../../../config/Firebase/FirebaseAuth";
// import permissionModel from "../../../models/permisstion.model";
// import "./style.scss";
// import loader from "../../../methods/loader";
// import ApiClient from "../../../methods/api/apiClient";
// import LoginModal from "../../common/LoginModal/LoginModal";
// import { removePropData } from "../../../models/string.model";

// const Layout = ({ children }) => {
//   const user = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const pathname = location.pathname;

//   function classNames(...classes) {
//     return classes.filter(Boolean).join(" ");
//   }
//   useEffect(() => {
//     if (user.loggedIn) {
//       messageListener(navigate);
//     }
//   }, [navigate]);

//   useEffect(() => {
//     if (!user.loggedIn) {
//     } else {
//       let permissions = user.roleDetail?.permissions?.[0];
//       if (!permissionModel.urlAllow(permissions)) {
//         // navigate("/profile")
//       }
//       let browseload = localStorage.getItem("browseload");
//       if (!browseload) {
//         // ApiClient.get("api/user/detail", { id: user._id }).then(async (res) => {
//         //   if (res.success) {
//         //     let data = { ...user, ...res.data };
//         //     dispatch(login_success(data));
//         //   }
//         // });
//       }
//     }
//   }, []);

//   // useEffect(() => {
//   //   if (!localStorage.getItem("token")) {
//   //     navigate("/login");
//   //   }
//   // }, []);

//   const menus = [
//     // {
//     //   name: "The concept",
//     //   image: (
//     //     <img src="/assets/img/header/bulb.png" className="w-[20px]" alt="" />
//     //   ),
//     //   url: "/concept",
//     // },
//     {
//       name: "Real Estate pros",
//       image: (
//         <img src="/assets/img/header/home.png" className="w-[20px]" alt="" />
//       ),
//       url: "/real-estate-pros",
//     },
//     {
//       name: "Past transactions",
//       image: (
//         <img src="/assets/img/header/hands.png" className="w-[20px]" alt="" />
//       ),
//       url: "/past-transactions",
//     },
//     {
//       name: "Building permit",
//       image: (
//         <img src="/assets/img/header/building.png" className="w-[18px] mb-[2px]" alt="" />
//       ),
//       url: "/building-permit",
//     },
//     {
//       name: "My project",
//       image: (
//         <img src="/assets/img/header/home.png" className="w-[20px]" alt="" />
//       ),
//       url: "/project",
//     },
//     // {
//     //   name: "Account",
//     //   image:  <img src ="assets/img/header/hands.png" className="w-[20px]" alt=""/>,
//     //   url: "/dashboard",
//     // },
//   ];

//   const Logout = () => {
//     dispatch(logout());
//     localStorage.removeItem("token");
//     navigate("/login");
//   };
//   const [loginModal, setloginModal] = useState(false);
//   const [notLength, setnotLength] = useState(0);
//   const getNotifications = () => {
//     const dto = {
//       sendToId: user?._id
//     }
//     loader(true)
//     ApiClient.get("notification/list", dto).then((res) => {
//       if (res.success) {
//         let unreadLen = res?.data?.filter(ee => ee.status != "read")?.length || "";
//         setnotLength(unreadLen);
//       }
//       loader(false)
//     });
//   }
//   useEffect(() => {
//     if (user?.loggedIn) getNotifications();
//   }, [])

//   return (
//     <>
//       <LoginModal loginModal={loginModal} setloginModal={setloginModal} />
//       <div component="page-layout">
//         <header className="sticky top-0 z-[8] border-b">
//           <nav className="bg-white border-gray-200 px-6 lg:px-10 py-2.5 dark:bg-gray-800">
//             <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xxl">
//               <div className="flex items-center">
//                 <Link to="/" className="flex items-center">
//                   <img
//                     src="/assets/img/logo.png"
//                     className="mr-3  xl:w-[140px] lg:w-[100px] w-[120px]"
//                     alt="Logo"
//                   />
//                 </Link>
//                 <button
//                   onClick={() => {
//                     if (user.loggedIn) {
//                       removePropData();
//                       return navigate("/property1");
//                     }
//                     else setloginModal(true)
//                   }}
//                   className="bg-[#976DD0] text-[14px] rounded-[50px] py-[6px] px-[14px] text-white font-bold "
//                 >
//                   List a property
//                 </button>
//               </div>

//               <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
//                 id="mobile-menu-2">
//                 {user?.loggedIn &&
//                   <div>
//                     <ul className="flex items-center">
//                       <li className="xl:px-5 lg:px-2 px-2">
//                         <Link to="/chat">
//                           <img alt=""
//                             src="/assets/img/header/message.svg"
//                             className="w-[25px] text-[#976DD0]"
//                           />
//                         </Link>
//                       </li>
//                       <li className="xl:px-5 px-3 ">
//                         <Link to="/notifications" className="relative">
//                           <img alt=""
//                             src="/assets/img/header/bell.svg"
//                             className="w-[20px] text-[#976DD0]"
//                           />
//                           {notLength > 0 && <div>
//                             <p className="bg-[#ccd6ff] w-[16px] h-[16px] flex items-center justify-center border border-white shadow_c rounded-[50px] absolute -top-2 -right-1 text-[9px] p-1 font-[600]">
//                               {notLength > 9 ? "9" : notLength}
//                               {notLength > 9 && <sup className="font-[600]">+</sup>}
//                             </p>
//                           </div>}
//                         </Link>
//                       </li>
//                     </ul>
//                   </div>}
//                 <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
//                   {menus.map((itm) => {
//                     if (!user?.loggedIn && itm?.name === "My project") return;
//                     return (
//                       <li key={itm.name}>
//                         <Link
//                           to={itm.url}
//                           className={`block text-center justify-center flex flex-col items-center xl:text-[14px] lg:text-[12px] border-r border-[#C9C9C9] text-[#47525E] xl:px-5 lg:px-2 px-2
//                              ${pathname === itm.url ? "text-[#976DD0] font-semibold" : ""}`}
//                         >
//                           {itm.image}
//                           {itm.name}
//                         </Link>
//                       </li>
//                     );
//                   })}
//                   {user?.loggedIn ? (
//                     <li key={"Account"}>
//                       <Link
//                         to={"/profile/Account"}
//                         className={`block text-center justify-center flex flex-col items-center xl:text-[14px] lg:text-[12px] text-[#47525E] xl:ps-5 lg:ps-2 ps-2
//                           ${pathname === "/profile/Account" ? "text-[#976DD0] font-semibold" : ""}`}
//                       >

//                         <img
//                           src="/assets/img/header/account.png"
//                           className="w-[18px]"
//                           alt=""
//                         />
//                         Account
//                       </Link>
//                     </li>
//                   ) : (
//                     <li
//                       key={"Account"}
//                       className="flex items-center justify-center"
//                     >
//                       <Link
//                         to="/login"
//                         className="bg-[#976DD0] text-[14px] rounded-[50px] py-[6px] px-[14px] text-white font-bold ms-2 inline-block"
//                       >
//                         Login
//                       </Link>

//                       <Link
//                         to="/Signup"
//                         className="bg-white border border-[#976DD0] text-[14px] rounded-[50px] py-[6px] px-[14px] text-[#47525E] font-bold ms-2 inline-block"
//                       >
//                         Sign Up
//                       </Link>
//                     </li>
//                   )}
//                 </ul>
//               </div>
//             </div>
//           </nav>
//         </header>

//         <main className="pageContent">{children}</main>

//         <footer className="bg-black	xl:py-12 xl:px-20 px-8 py-6">
//           <div className="container items-center mx-auto">
//             <div className="grid grid-cols-12 gap-4">
//               <div className="col-span-12 text-center flex items-center justify-center flex-col">
//                 <h4 className="text-white font-[600] mb-5 text-[18px]">
//                   Find us on:
//                 </h4>
//                 <ul className="flex items-center mb-5">
//                   <li className=" text-center cursor-pointer px-7">
//                     <a href="#" className=""><img src="/assets/img/footer/ins.png" alt="" className="text-white w-[25px]" /></a>
//                   </li>
//                   <li className="  text-center cursor-pointer px-7">
//                     <a href="#"><img src="/assets/img/footer/fb.png" alt="" className="text-white w-[25px]" /></a>
//                   </li>
//                   <li className="  text-center cursor-pointer px-7">
//                     <a href="#"><img src="/assets/img/footer/twitter.png" alt="" className="text-white w-[20px]" /></a>
//                   </li>
//                   <li className="  text-center cursor-pointer px-7">
//                     <a href="#"><img src="/assets/img/footer/linkedin.png" alt="" className="text-white w-[25px]" /></a>
//                   </li>
//                   <li className="  text-center cursor-pointer px-7">
//                     <a href="#"><img src="/assets/img/footer/youtube.png" alt="" className="text-white w-[25px]" /></a>
//                   </li>
//                 </ul>
//                 <p className="h-[1px] bg-white w-full block mt-5"></p>
//               </div>



//               <div className="col-span-12 mt-3   ">
//                 <div className="grid grid-cols-12 gap-2">
//                   <div className="col-span-12 lg:col-span-3">
//                     <h2 className="text-white font-bold text-lg mb-2">
//                       COMPANY
//                     </h2>
//                     <ul>
//                       <li className=" text-gray-300 group">
//                         <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2 xl:text-[16px] text-[14px]">
//                           Who are we?
//                         </p>
//                       </li>
//                       <li className=" text-gray-300 group">
//                         <p onClick={() => window.open("/contact-us", "_blank", "noopener,noreferrer")}
//                           className="text-gray-300 group-hover:text-white cursor-pointer mb-2 xl:text-[16px] text-[14px]">
//                           Contact us
//                         </p>
//                       </li>
//                       <li className=" text-gray-300 group">
//                         <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2 xl:text-[16px] text-[14px]">
//                           We are hiring
//                         </p>
//                       </li>
//                       <li className=" text-gray-300 group">
//                         <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2 xl:text-[16px] text-[14px]">
//                           Press
//                         </p>
//                       </li>
//                     </ul>
//                   </div>
//                   <div className="col-span-12 lg:col-span-3">
//                     <h2 className="text-white font-bold text-lg mb-2">
//                       OUR APPS
//                     </h2>
//                     <ul>
//                       <li className=" text-gray-300 group">
//                         <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2 xl:text-[16px] text-[14px]">
//                           Discover our apps
//                         </p>
//                       </li>
//                       <li className="flex items-center">
//                         <a href="#"><img src="/assets/img/footer/apple.png" alt="" className="text-white w-[25px]" /></a>
//                         <a href="#" className="ms-5"><img src="/assets/img/footer/android.png" alt="" className="text-white w-[24px]" /></a>
//                       </li>
//                     </ul>
//                   </div>
//                   <div className="col-span-12 lg:col-span-3">
//                     <h2 className="text-white font-bold text-lg mb-2">
//                       PRO SERVICES
//                     </h2>
//                     <ul>
//                       <li className=" text-gray-300 group">
//                         <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2 xl:text-[16px] text-[14px]">
//                           Services for pros
//                         </p>
//                       </li>
//                       <li className=" text-gray-300 group">
//                         <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2 xl:text-[16px] text-[14px]">
//                           Client access
//                         </p>
//                       </li>
//                     </ul>
//                   </div>
//                   <div className="col-span-12 lg:col-span-3">
//                     <h2 className="text-white font-bold text-lg mb-2">
//                       MORE SERVICES
//                     </h2>
//                     <ul>
//                       <li className=" text-gray-300 group">
//                         <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2 xl:text-[16px] text-[14px]">
//                           Real estate pro repository
//                         </p>
//                       </li>
//                       <li className=" text-gray-300 group">
//                         <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2 xl:text-[16px] text-[14px]">
//                           Past transaction repository
//                         </p>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-span-12 ">
//                 <p className="h-[1px] bg-white w-full block mt-5"></p>
//                 <h5 className="text-white font-normal text-center w-full block font-bold  mt-10">Bookaroo SAS - 2024</h5>
//                 <p className="text-gray-300 font-normal text-center w-full block xl:text-[16px] text-[14px] my-2">Cookies setting</p>
//                 <p className="text-gray-300 font-normal text-center w-full block xl:text-[16px] text-[14px] my-2">Terms and conditions of use</p>
//                 <p className="text-gray-300 font-normal text-center w-full block xl:text-[16px] text-[14px] my-2">General Data Protection Policy</p>
//                 <p className="text-gray-300 font-normal text-center w-full block xl:text-[16px] text-[14px] my-2">How our site works</p>
//               </div>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </>
//   );
// };
// export default Layout;
