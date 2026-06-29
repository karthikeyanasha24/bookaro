import { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import { removePropData } from "../../models/string.model";
import UpgradePlan from "../../components/common/Modal/UpgradePlan";

const ProjectPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state);
  const [profile, setProfile] = useState({});
  const activePlan = useSelector((state) => state.activePlan);
  const [propertyTotal, setpropertyTotal] = useState(0);
  const [propertyLoader, setpropertyLoader] = useState(false);
  const [planModal, setplanModal] = useState(false);
  const sercherSpace = [
    {
      head: "Search Alert",
      subhead: `${profile.total_alerts || 0} Search${profile.total_alerts > 1 ? "es" : ""
        }`,
      route: "/serach-alert",
    },
    {
      head: "Properties Followed",
      subhead: `${profile.folderCount || 0} Propert${profile.folderCount > 1 ? "ies" : "y"
        }`,
      route: "/followed-properties",
    },
    {
      head: "Interacted Properties",
      subhead: `${profile.total_likes || 0} Propert${profile.total_likes > 1 ? "ies" : "y"
        }`,
      route: "/properties?favourites=true",
    },
    {
      head: "Renter application file",
      subhead: `${profile.renterFilesCount || 0} document${profile.renterFilesCount > 1 ? "s" : ""
        }`,
      route: "/renter-file",
    },
    {
      head: "Buyer file",
      subhead: `${profile.buyerFilesCount || 0} document${profile.buyerFilesCount > 1 ? "s" : ""
        }`,
      route: "/buyer-file",
    },
    {
      head: "Manage real estate transaction",
      subhead: `${profile.totalInterests || 0} propert${profile.totalInterests > 1 ? "ies" : "y"
        } in funnel`,
      route: "/real-estate-transaction-searcher",
    },
    {
      head: "P2P estimation",
      subhead: `${profile.total_property || 0} propert${profile.total_property > 1 ? "ies" : "y"
        }`,
      route: "/estimation",
    },
  ];
  const ownerSpace = [
    {
      head: "My Property",
      subhead: `${profile.total_property || 0} propert${profile.total_property > 1 ? "ies" : "y"
        }`,
      route: "/my-properties",
    },
    //  {
    //   head: "List a property",
    //     subhead: `${profile.total_property || 0} propert${
    //     profile.total_property > 1 ? "ies" : "y"
    //   }`,
    //   route: "/property1",
    // },
    {
      head: "Seller file",
      subhead: `${profile.sellerFilesCount || 0} Document${profile.sellerFilesCount > 1 ? "s" : ""
        }`,
      route: "/seller-file",
    },
    {
      head: "Manage real estate transaction",
      subhead: `${profile.total_property || 0} propert${profile.total_property > 1 ? "ies" : "y"
        }`,
      route: "/real-estate-transaction-owner",
    },
    {
      head: "Manage P2P estimation",
      subhead: `${profile.total_property || 0} propert${profile.total_property > 1 ? "ies" : "y"
        }`,
      route: "/social-estimation",
    },
  ];
  const getProfile = () => {
    ApiClient.get(`user/detail`, { id: user?._id }).then((res) => {
      if (res.success) {
        setProfile(res?.data);
      }
    });
  };
  useEffect(() => {
    getProfile();
    removePropData();
  }, []);

  const getAllProperty = () => {
    setpropertyLoader(true);
    ApiClient.get(
      `property/listing?page=1&count=1000&status=active&addedBy=${user?.id || user?._id
      }&maxDistance=&userLat=&userLng=&propertyType=&userId=${user?.id || user?._id
      }`
    ).then((res) => {
      if (res.success) {
        setpropertyTotal(res.total);
      }
      setpropertyLoader(false);
    });
  };

  useEffect(() => {
    if (user.loggedIn) {
      getAllProperty();
    } else {
    }
  }, []);

  const handleProperty = () => {
    if (user.loggedIn) {
      if (propertyTotal >= activePlan?.[0]?.numberOfProperty) {
        setplanModal(true);
        return;
      }
      removePropData();
      return navigate("/property1");
    } else {
    }
  };

  const service = [
    { name: "hire a real estate hunter", url: "/hunter-form" },
    { name: "Find the best intrest rate", url: "/interest-form" },
    { name: "Find a real estate professional", url: "/real-estate-pros" },
    { name: "Get help to move", url: "/getmove-form" },
  ]
  const serviceOwner = [
    { name: "Get help selling", url: "/selling-form" },
    { name: "Get quote", url: "/getquote-form" },
    { name: "Get help to move", url: "/getmove-form" },
  ]

  return (
    <PageLayout>
      <UpgradePlan planModal={planModal} setplanModal={setplanModal} />
      <section className="py-14 lg:py-16 bg-[#f2ecf8]">
        <div className="container items-center  px-8 mx-auto xl:px-5">
          <div className="grid grid-cols-12 mx-auto">
            <div className="col-span-12  md:mb-[80px] mb-[40px] ">
              <h2 className="text-center text-[#47525E] text-[26px] font-bold">
                Real estate is a once-in-a-lifetime project!
              </h2>
              <p className="text-center text-[#47525E] lg:text-[18px] text-[16px] font-medium">
                Plan it at your pace here
              </p>
            </div>
          </div>
          <div className="lg:max-w-[1200px] mx-auto max-w-[100%]">
            <div className="grid grid-cols-12 lg:gap-12 gap-0">
              <div className="xl:col-span-6 lg:col-span-6 col-span-12 border border-[#976DD0] rounded-[10px] mt-10 lg:mt-0 relative">
                <p className="text-[#47525E] absolute -top-[20px] left-1/2  -translate-x-1/2 md:text-[24px] text-[18px] font-[600] bg-[#f2ecf8] md:px-7 px-4 w-max ">
                  Searcher space
                </p>
                <div className="p-10 md:px-14 px-8">
                  <ul>
                    {sercherSpace.map((item) => (
                      <li className="border border-[#BEBEBE] p-5 rounded-[5px] bg-white mb-4 hover:bg-[#986dcd] hover:border-white cursor-pointer hover:text-white group transition">
                        <Link
                          to={item.route}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <h4 className="text-[#47525E] font-bold lg:text-[18px] text-[16px] mb-1 group-hover:text-white">
                              {item.head}
                            </h4>

                            <p className="text-[#47525E] lg:text-[18px] text-[16px] font-medium  mb-2 flex items-center justify-between group-hover:text-white">
                              {item.subhead}
                            </p>
                          </div>
                          <FaArrowRightLong className="w-[20px] group-hover:text-white" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <h4 className="border-b-[1px] [border-color:#976DD0] text-[#47525E] font-bold lg:text-[18px] text-[16px] mb-3 pb-2">
                      Services
                    </h4>
                    {service.map((item) => (
                      <p className="text-[#47525E] lg:text-[18px] text-[16px] font-medium  mb-2 flex items-center justify-between capitalize cursor-pointer"
                        onClick={(e) => navigate(`${item?.url}?categoryId=My Project(Home Seeker)`)}
                      >
                        {item?.name}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="xl:col-span-6 lg:col-span-6 col-span-12 border border-[#976DD0] rounded-[10px] mt-10 lg:mt-0 relative">
                <p className="text-[#47525E] absolute -top-[20px] left-1/2  -translate-x-1/2 md:text-[24px] text-[18px] font-[600] bg-[#f2ecf8] md:px-7 px-4 w-max ">
                  Owner space
                </p>
                <div className="p-10 md:px-14 px-8">
                  <ul>
                    {ownerSpace?.map((item, i) => (
                      <li className="border border-[#BEBEBE] p-5 rounded-[5px] bg-white mb-4 hover:bg-[#986dcd] hover:border-white cursor-pointer hover:text-white group transition">
                        <Link
                          to={item?.route}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <h4 className="text-[#47525E] font-bold lg:text-[18px] text-[16px] mb-1 group-hover:text-white">
                              {item.head}
                            </h4>
                            <p className="text-[#47525E] lg:text-[18px] text-[16px] font-medium  mb-2 flex items-center justify-between group-hover:text-white">
                              {item.subhead}
                            </p>
                          </div>
                          <FaArrowRightLong className="w-[20px] group-hover:text-white" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 mx-auto flex items-center justify-center">
                    <button
                      disabled={propertyLoader}
                      onClick={() => handleProperty()}
                      className="py-1 px-4  rounded-[100px] border border-[#976DD0] text-[#31373E]"
                    >
                      {propertyLoader ? "Loading..." : "List a property"}
                    </button>
                  </div>
                  <div className="mt-8">
                    <h4 className="border-b-[1px] [border-color:#976DD0] text-[#47525E] font-bold lg:text-[18px] text-[16px] mb-3 pb-2">
                      Services
                    </h4>
                    {serviceOwner.map((item) => (
                      <p className="text-[#47525E] lg:text-[18px] text-[16px] font-medium  mb-2 flex items-center justify-between capitalize cursor-pointer"
                        onClick={(e) => navigate(`${item?.url}?categoryId=My Project(Owner Space)`)}
                      >
                        {item?.name}
                      </p>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ProjectPage;
