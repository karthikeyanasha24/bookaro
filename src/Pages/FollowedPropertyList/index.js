import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginModal from "../../components/common/Modal/LoginModal";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import CustomMap from "../Property/CustomMap";
import PropertyCard from "../Property/PropertyCard";
import PropertiesGrid from "./Propertygrid";
import FlwModal from "../../components/common/Modal/FlwModal";

const FollowedPropertyList = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state);
  const params = new URLSearchParams(window.location.search);
  const paramId = params.get('id');
  const [detail, setDetail] = useState([]);
  const [data, setData] = useState([]);
  const [view, setView] = useState("map");
  const [loginModal, setloginModal] = useState(false);
  const [locations, setLocations] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [filter, setfilter] = useState({
    id: paramId,
    propertyType: "",
  });

  const getData = (f = {}) => {
    let dto = { ...filter, ...f };
    loader(true);
    ApiClient.get("folder/details", dto).then((res) => {
      if (res.success) {
        setDetail(res?.data);
        setData(res?.data?.properties);
        let locations = [];
        res?.data?.properties?.map((item) => {
          if (item?.location?.lat || item?.location?.lng) {
            const isExact = item?.exactLocation;
            locations.push({
              lat: isExact ? parseFloat(item?.location?.lat) : parseFloat(item?.randomLocation?.lat || item?.location?.lat),
              lng: isExact ? parseFloat(item?.location?.lng) : parseFloat(item?.randomLocation?.lng || item?.location?.lng),
              info: item?.city || item?.propertyTitle,
              exactLocation: true,
              icon: "/assets/img/prop/placeholder.png",
            });
          }
        });
        setLocations(locations);
      }
      loader(false);
    });
  };
  useEffect(() => {
    getData();
  }, []);

  const navigateToDetail = (id) => {
    navigate(`/property-details?id=${id}`);
  };
  const isLiked = (itm) => {
    if (!user?.loggedIn) return setloginModal(true);
    let method = "put";
    let url = `favorites/edit`;
    let value = {
      user_id: user?._id,
      property_id: itm?._id || itm?.id,
      like: true,
    };
    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        getData();
      } else toast.error(res.message);
      loader(false);
    });
  };
  const isFollow = (itm) => {
    if (!user?.loggedIn) return setloginModal(true);
    if (!itm?.followunfollows_details) {
      setflwItem(itm)
      return setflwModal(true);
    }
    const isliked = itm?.follow ? false : true;
    let method = "put";
    let url = `followUnfollow/update`;
    let value = {
      user_id: user?._id,
      property_id: itm?._id || itm?.id,
      follow_unfollow: isliked,
    };
    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        getData();
      } else toast.error(res.message);
      loader(false);
    });
  };
  const disLiked = (itm) => {
    let method = "put";
    let url = `favorites/edit`;
    let value = {
      user_id: user?._id,
      property_id: itm?._id || itm?.id,
      like: false,
    };
    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        getData();
      } else toast.error(res.message);
      loader(false);
    });
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setfilter({ ...filter, propertyType: tab });
    getData({ propertyType: tab });
  };

  const propTypes = [
    { name: "All", value: "" },
    { name: "For sale", value: "sale" },
    { name: "For rent", value: "rent" },
    { name: "Off-Market", value: "offmarket" },
    { name: "Directory", value: "directory" },
  ]
  const [flwModal, setflwModal] = useState(false);
  const [flwItem, setflwItem] = useState(null);
  return (
    <PageLayout>
      <div className="">
        <LoginModal
          loginModal={loginModal}
          setloginModal={setloginModal}
        />
        <FlwModal
          flwModal={flwModal}
          setflwModal={setflwModal}
          flwItem={flwItem}
          refetch={getData}
          existData={false}
        />
        <div className="bg-white border-t">
          <div className=" items-center  mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-12 py-4 ">
              <div className="col-span-12 flex items-center justify-between">
                <ul className="flex items-center ">
                  {
                    propTypes?.map((itm, i) => (
                      <li key={i}>
                        <p
                          onClick={() => handleTabClick(itm?.value)}
                          className={`cursor-pointer text-[16px] pe-4 ${activeTab === itm?.value
                            ? "text-[#339B91] font-bold"
                            : "text-[#343F4B]"
                            }`}
                        >
                          {itm.name}
                        </p>
                      </li>
                    ))
                  }
                </ul>
                <div>
                  <ul className="flex items-center">
                    <li onClick={() => setView("map")}>
                      <p
                        className={`${view === "map" ? "font-[600]" : ""
                          } cursor-pointer text-[#47525E] text-[14px] px-3`}
                      >
                        Map
                      </p>
                    </li>
                    {/* <li onClick={() => setView("list")}>
                      <p
                        className={`${view === "list" ? "font-[600]" : ""
                          } cursor-pointer text-[#47525E] text-[14px] px-3`}
                      >
                        List
                      </p>
                    </li> */}
                    <li onClick={() => setView("grid")}>
                      <p
                        className={`${view === "grid" ? "font-[600]" : ""
                          } cursor-pointer text-[#47525E] text-[14px] px-3`}
                      >
                        Grid
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
        {view === "map" && (
          <div className="bg-[#f9f9f9] py-10">
            <div className=" items-center  mx-auto container lg:px-10 px-6">
              <ul className="flex items-center pb-[30px]">
                <li onClick={() => navigate("/project")} className="text-[#47525E] cursor-pointer after">
                  My Project
                  <span className="mx-[4px]">|</span></li>
                <li onClick={() => navigate("/followed-properties")} className="text-[#47525E] cursor-pointer capitalize">
                  Followed properties
                  <span className="mx-[4px]">|</span></li>
                <li className="text-[#47525E] cursor-pointer capitalize font-[600]">
                  {detail?.folder?.name}</li>
              </ul>
              <div className="grid grid-cols-12 md:gap-8 gap-0">
                <div className="col-span-12">
                  <p className="text-[#47525E]">
                    <span className="text-[#47525E] font-bold text-[20px]">
                      {data?.length}
                      {` Propert${data?.length > 1 ? "ies" : "y"}`}
                    </span>
                    {` followed for ${detail?.folder?.name || ""} search`}
                  </p>
                </div>
                <div className="xl:col-span-8 lg:col-span-8 md:col-span-6  col-span-12 lg:mb-0 mb-4 h-[700px] overflow-auto pe-3 md:mt-0 mt-5 ">
                  <div className="grid grid-cols-12 bg-[#f9f9f9] gap-4">
                    {data?.length > 0 ? (
                      data.map((item, index) => {
                        let price = parseInt(item?.price || 0);
                        let sur = parseInt(item?.surface || 0);
                        let perSqr;
                        if (sur > 0) {
                          perSqr = price / sur;
                        }
                        return (
                          <div
                            key={index}
                            className="xl:col-span-4 lg:col-span-6 md:col-span-12 col-span-12 relative my-10 "
                          >
                            <PropertyCard
                              item={item}
                              navigateToDetail={navigateToDetail}
                              price={price}
                              perSqr={perSqr}
                              isFollow={isFollow}
                              disLiked={disLiked}
                              isLiked={isLiked}
                              index={index}
                            // toggleDropdown={toggleDropdown}
                            // editItem={editItem}
                            // deleteItem={deleteItem}
                            // dropdownRefs={dropdownRefs}
                            // dropdownIndex={dropdownIndex}
                            />
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center col-span-12 my-8">
                        <img src="assets/img/no-data.svg" className="w-[400px] mx-auto " />
                        No Records Found
                      </div>
                    )}
                  </div>

                  {/* <div className={`paginationWrapper ${total > filters?.count ? '' : 'd-none'}`}>
                                        <span>Show {data?.length} from {total} Properties</span>
                                        <ReactPaginate
                                            previousLabel="<Pre"
                                            nextLabel="Next>"
                                            breakLabel="..."
                                            pageRangeDisplayed={2}
                                            marginPagesDisplayed={1}
                                            pageCount={Math.ceil(total / filters.count)}
                                            onPageChange={handlePageChange}
                                            forcePage={filters.page - 1}
                                            containerClassName={"pagination flex"}
                                            pageClassName={"pagination-item"}
                                            activeClassName={"pagination-item-active"}
                                        />
                                    </div> */}
                </div>
                <div className="xl:col-span-4  lg:col-span-4 md:col-span-6 col-span-12 border border-[#D2D2D2] rounded-[12px] lg:mb-0 mb-4 custom-map">
                  <CustomMap locations={locations} />
                </div>
              </div>
            </div>
          </div>
        )}
        {view === "grid" && (
          <PropertiesGrid
            data={data}
            detail={detail}
            isLiked={isLiked}
            disLiked={disLiked}
            isFollow={isFollow}
            navigateToDetail={navigateToDetail}
          />
        )}
        {/* {view === "list" && (
          <PropertiesList
            data={data}
            detail={detail}
            isLiked={isLiked}
            disLiked={disLiked}
            isFollow={isFollow}
            navigateToDetail={navigateToDetail}
          />
        )} */}
      </div>
    </PageLayout>
  );
};

export default FollowedPropertyList;
