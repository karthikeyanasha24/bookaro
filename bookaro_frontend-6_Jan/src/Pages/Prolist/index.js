import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useLocation, useNavigate } from "react-router-dom";
import LoginModal from "../../components/common/Modal/LoginModal";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { imagePath } from "../../models/string.model";
import CustomMap from "../Property/CustomMap";
import CommonCreteria from "./CommonCreteria";
import CommonFilter from "./CommonFilter";
import ProListGrid from "./ProListGrid";
import { FaStar } from "react-icons/fa6";
import { useSelector } from "react-redux";

const Prolist = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state);
  const [filters, setFilters] = useState({
    page: 1,
    count: 12,
    accountType: "pro",
  });
  const [showReset, setShowReset] = useState(false);
  const locationn = useLocation();
  const params = new URLSearchParams(locationn.search);
  const role = params.get("role");
  const search = params.get("search");
  const [selectedRoles, setSelectedRoles] = useState(role ? [role] : []);
  const [selectedServices, setSelectedServices] = useState([]);
  const [location, setLocation] = useState(
    search ? [{ name: search, added: true }] : []
  );
  const [currentLocation, setCurrentLocation] = useState("");
  const [view, setView] = useState("map");
  const [loginModal, setloginModal] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [allfilters, setAllFilters] = useState({
    city: search || "",
    role: role || "",
    search: "",
  });
  const [indFilter, setIndFilter] = useState({
    city: search || "",
    role: role || "",
    search: "",
    service: "",
  });
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [mapLocs, setMapLocs] = useState([]);
  const [error, setError] = useState({ service: "", location: "", role: "" });
  const [hoveredLocation, setHoveredLocation] = useState(null);

  const getData = (f = {}) => {
    const filter = {
      ...allfilters,
      ...filters,
      ...f,
      profileInPro:true
    };
    let dto = filter;
    loader(true);
    ApiClient.get("user/pro/listing", dto)
      .then((res) => {
        if (res.success) {
          // setData(res?.data);
          if (user?.loggedIn) {
            setData(res?.data)
          } else {
            setData(res?.data.slice(0, 3))
          }
          setTotal(res?.total);
          let map = [];
          res?.data?.map((item) => {
            if (item?.location?.lat || item?.location?.lng) {
              map.push({
                lat: parseFloat(item?.location?.lat),
                lng: parseFloat(item?.location?.lng),
                info: item?.city,
                exactLocation: true,
                icon: "/assets/img/prop/placeholder.png",
              });
            }
          });
          setMapLocs(map);
        }
      })
      .catch((err) => { })
      .finally(() => loader(false));
  };

  useEffect(() => {
    getData(allfilters);
    const filter = Object.values(allfilters).some(
      (value) =>
        value !== null && value !== "" && value !== 0 && value !== undefined
    );
    setShowReset(filter);
  }, [allfilters]);

  const getFilterResult = () => {
    let dto = { ...filters, ...indFilter,profileInPro:true };
    ApiClient.get("user/pro/listing", dto).then((res) => {
      if (res.success) {
        setUpcomingCount(res?.total);
      }
    });
  };
  useEffect(() => {
    getFilterResult();
  }, [indFilter]);

  const removeParams = (type) => {
    const params = new URLSearchParams(window.location.search);
    if (params.has([type])) {
      params.delete([type]);
    }
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""
      }`;
    window.history.pushState({}, "", newUrl);
  };

  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1;
    setFilters((prev) => ({ ...prev, ...allfilters, page: newPage }));
    getData({ page: newPage });

    // Scroll to top of page (or specific element)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resetData = () => {
    setFilters({
      page: 1,
      count: 10,
      accountType: "pro",
    });
    setIndFilter({
      city: "",
      role: "",
      search: "",
      service: "",
      offMarket: false,
    });
    setSelectedRoles([]);
    setSelectedServices([]);
    setLocation([]);
    setCurrentLocation("");
    setAllFilters({
      city: "",
      role: "",
      search: "",
      offMarket: false,
    });
    setShowReset(false);
    if (search || role) navigate("/prolist");
  };
  const [services, setServices] = useState([]);

  const getServices = () => {
    loader(true);
    ApiClient.get("service/list", { status: "active" }).then((res) => {
      if (res.success) {
        let data = res.data
          ?.filter((dd) => dd?.status === "active")
          ?.map((itm) => {
            itm.id = itm._id;
            return itm;
          });
        setServices(data);
      }
      loader(false);
    });
  };
  useEffect(() => {
    getServices();
  }, []);
  const navigateToDetail = (itm) => {
    navigate(`/company-details?id=${itm?._id}`);
  };

  return (
    <PageLayout>
      <div className="">
        <LoginModal loginModal={loginModal} setloginModal={setloginModal} />
        <CommonFilter
          isOpen1={isOpen1}
          setIsOpen1={setIsOpen1}
          isOpen2={isOpen2}
          setIsOpen2={setIsOpen2}
          isOpen3={isOpen3}
          setIsOpen3={setIsOpen3}
          removeParams={removeParams}
          view={view}
          setView={setView}
          allfilters={allfilters}
          setAllFilters={setAllFilters}
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          location={location}
          setLocation={setLocation}
          selectedRoles={selectedRoles}
          setSelectedRoles={setSelectedRoles}
          resetData={resetData}
          showReset={showReset}
          indFilter={indFilter}
          setIndFilter={setIndFilter}
          error={error}
          setError={setError}
          upcomingCount={upcomingCount}
          services={services}
          selectedServices={selectedServices}
          setSelectedServices={setSelectedServices}
        />
        {view === "map" && (
          <div className="bg-[#f9f9f9] py-10">
            <div className=" items-center container  mx-auto px-6 lg:px-10">
              <div className="grid grid-cols-12 md:gap-8 gap-0">
                <CommonCreteria allfilters={allfilters} total={total} />
                <div className="xl:col-span-8 lg:col-span-8  md:col-span-6 col-span-12 lg:mb-0 mb-4 h-[700px] overflow-auto pe-3 md:mt-0 mt-5">
                  <div className="grid grid-cols-12 bg-[#f9f9f9] gap-4">
                    {data?.length > 0 ? (
                      data.map((item, i) => {
                        return (
                          // <div
                          // className="xl:col-span-4 lg:col-span-6 col-span-12 border border-[#D2D2D2] rounded-[20px]"
                          //   key={i}
                          //   onClick={() => navigateToDetail(item)}
                          //   onMouseEnter={() =>
                          //     setHoveredLocation({
                          //       lat: parseFloat(item?.location?.lat),
                          //       lng: parseFloat(item?.location?.lng),
                          //     })
                          //   }
                          //   onMouseLeave={() => setHoveredLocation(null)}
                          // >
                          //   <div className="">
                          //     <div>
                          //       <img alt=""
                          //         src={item?.coverImage ? imagePath(item.coverImage) : "assets/img/blog-one.jpg"}
                          //         className="rounded-[12px] h-[170px] object-cover w-full"
                          //       />
                          //       <img
                          //         src={item?.companyLogo ? imagePath(item.companyLogo) : "assets/img/pro-logo.png"}
                          //         className="w-[70px] h-[70px] rounded-[12px] border border-[#8492A6] -mt-10 ms-5 object-cover"
                          //       />
                          //     </div>
                          //     <div className="p-5">
                          //       <div className="flex justify-between items-start">
                          //         <div>
                          //           <span className="capitalize text-[#AAAAAA] text-[12px] font-[600]">
                          //             {item?.role}
                          //           </span>
                          //           <h2 className="text-[#47525E] font-[600] text-[17px]">
                          //             {item?.companyName}
                          //           </h2>
                          //           <p className="text-[#47525E] text-[12px]">
                          //             {`${item?.city}${item?.pinCode ? ` (${item?.pinCode})` : ""}`}
                          //           </p>
                          //         </div>
                          //         <div className="flex items-center mt-1 font-[600]">
                          //           <FaStar className="text-[#1AB1A4] me-1 " />
                          //           4,4/5
                          //         </div>
                          //       </div>
                          //       <h2 className="text-[14px] mt-4 font-semibold underline">Properties for/in</h2>
                          //       <ul className=" flex  flex-wrap  sm:mt-0 mt-4  justify-between">
                          //         <li className="flex sm:flex-col flex-row items-center my-2 w-[22%]">
                          //           <p className="text-[#1AB1A4] font-[600] text-center text-[16px] sm:me-0 me-4">
                          //             {item?.rentCount || 0}
                          //           </p>
                          //           <span className="text-[#47525E] text-center  block text-[12px]">
                          //             Rent
                          //           </span>
                          //         </li>
                          //         <li className="flex sm:flex-col flex-row items-center my-2 w-[22%]">
                          //           <p className="text-[#1AB1A4] font-[600] text-center text-[16px] sm:me-0 me-4">
                          //             {item?.saleCount || 0}
                          //           </p>
                          //           <span className="text-[#47525E] text-center block text-[12px]">
                          //             Sale
                          //           </span>
                          //         </li>
                          //         <li className="flex sm:flex-col flex-row items-center my-2 w-[28%]">
                          //           <p className="text-[#1AB1A4] font-[600] text-center text-[16px] sm:me-0 me-4">
                          //             {item?.offMarketCount || 0}
                          //           </p>
                          //           <span className="text-[#47525E] text-center  block text-[12px]">
                          //             Off-Market
                          //           </span>
                          //         </li>
                          //         <li className="flex sm:flex-col flex-row items-center my-2 w-[24%]">
                          //           <p className="text-[#1AB1A4] font-[600] text-center text-[16px] sm:me-0 me-4">
                          //             {item?.directoryCount || 0}
                          //           </p>
                          //           <span className="text-[#47525E] text-center  block text-[12px]">
                          //             Directory
                          //           </span>
                          //         </li>
                          //       </ul>
                          //       {/* <ul className=" flex  flex-wrap  sm:mt-0 mt-4 ">
                          //         <li className="flex sm:flex-col flex-row items-center my-2 w-[46%] ">
                          //           <p className="text-[#1AB1A4] font-[600] text-center text-[16px] sm:me-0 me-4">
                          //             {item?.rentCount}
                          //           </p>
                          //           <span className="text-[#47525E] text-center  block text-[12px]">
                          //             Properties for <br></br> rent
                          //           </span>
                          //         </li>
                          //         <li className="flex sm:flex-col flex-row items-center my-2 w-[46%] ">
                          //           <p className="text-[#1AB1A4] font-[600] text-center text-[16px] sm:me-0 me-4">
                          //             {item?.saleCount}
                          //           </p>
                          //           <span className="text-[#47525E] text-center block text-[12px]">
                          //             Properties for <br></br> sale
                          //           </span>
                          //         </li>
                          //         <li className="flex sm:flex-col flex-row items-center my-2 w-[46%] ">
                          //           <p className="text-[#1AB1A4] font-[600] text-center text-[16px] sm:me-0 me-4">
                          //             {item?.offMarketCount}
                          //           </p>
                          //           <span className="text-[#47525E] text-center  block text-[12px]">
                          //             Properties in <br></br> Off-Market
                          //           </span>
                          //         </li>
                          //         <li className="flex sm:flex-col flex-row items-center my-2 w-[46%] ">
                          //           <p className="text-[#1AB1A4] font-[600] text-center text-[16px] sm:me-0 me-4">
                          //             {item?.offMarketCount}
                          //           </p>
                          //           <span className="text-[#47525E] text-center  block text-[12px]">
                          //             Properties in <br></br> Directory
                          //           </span>
                          //         </li>
                          //       </ul> */}
                          //     </div>
                          //   </div>

                          //   {/* <div className="flex justify-between items-start">
                          //     <div>
                          //       <span className="capitalize text-[#AAAAAA] text-[14px] font-[600]">
                          //         {item?.role}
                          //       </span>
                          //       <h2 className="text-[#47525E] font-[600] text-[17px]">
                          //         {item?.companyName}

                          //       </h2>
                          //       <p className="text-[#47525E]">
                          //         {item?.city}, {item?.pinCode}

                          //       </p>
                          //     </div>
                          //     <div className="flex items-center mt-1 font-[600]">
                          //       <FaStar className="text-[#1AB1A4] me-1 " />
                          //       4,4/5
                          //     </div>
                          //   </div>
                          //   <div className="flex mt-7 sm:flex-row flex-col sm:items-center items-start">
                          //     <img
                          //       src={
                          //         item?.companyLogo
                          //           ? imagePath(item?.companyLogo)
                          //           : "assets/img/pro-logo.png"
                          //       }
                          //       alt=""
                          //       className="w-[80px] h-[80px] rounded-[5px] brder border-[#8492A6]"
                          //     />
                          //     <ul className="sm:ms-3 ms-0 flex sm:flex-row flex-col  gap-4 sm:mt-0 mt-4">
                          //       <li className="flex sm:flex-col flex-row items-center">
                          //         <p className="text-[#1AB1A4] font-[600] text-center text-[20px] sm:me-0 me-4">
                          //           {item?.rentCount}
                          //         </p>
                          //         <span className="text-[#47525E] text-center  block">
                          //           Properties for rent
                          //         </span>
                          //       </li>
                          //       <li className="flex sm:flex-col flex-row items-center">
                          //         <p className="text-[#1AB1A4] font-[600] text-center text-[20px] sm:me-0 me-4">
                          //           {item?.saleCount}
                          //         </p>
                          //         <span className="text-[#47525E] text-center block">
                          //           Properties for sale
                          //         </span>
                          //       </li>
                          //       <li className="flex sm:flex-col flex-row items-center">
                          //         <p className="text-[#1AB1A4] font-[600] text-center text-[20px] sm:me-0 me-4">
                          //           {item?.offMarketCount}
                          //         </p>
                          //         <span className="text-[#47525E] text-center  block">
                          //           Properties Off-Market
                          //         </span>
                          //       </li>
                          //     </ul>
                          //   </div> */}
                          // </div>

                          <div
                            key={i}
                            onClick={() => navigateToDetail(item)}
                            onMouseEnter={() =>
                              setHoveredLocation({
                                lat: parseFloat(item?.location?.lat),
                                lng: parseFloat(item?.location?.lng),
                              })
                            }
                            onMouseLeave={() => setHoveredLocation(null)}
                            className="col-span-12"
                          >
                            <div className="bg-[#EBEBEB] p-4 rounded-[12px] flex  flex-col mb-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="capitalize text-[#AAAAAA] text-[14px] font-[600]">
                                    {item?.role}
                                  </span>
                                  <h2 className="text-[#47525E] font-[600] text-[17px]">
                                    {item?.companyName}
                                    {/* 123WEBIMMO.COM ANGERS */}
                                  </h2>
                                  <p className="text-[#47525E]">
                                    {`${item?.city}${item?.pinCode ? ` (${item?.pinCode})` : ""}`}
                                  </p>
                                </div>
                                <div className="flex items-center mt-1 font-[600]">
                                  <FaStar className="text-[#1AB1A4] me-1 " />
                                  4,4/5
                                </div>
                              </div>
                              <div className="flex mt-7 sm:flex-row flex-col sm:items-center items-start">
                                <img
                                  src="assets/img/pro-logo.png"
                                  alt=""
                                  className="w-[80px] h-[80px] rounded-[5px] brder border-[#8492A6]"
                                />
                                <ul className="sm:ms-3 ms-0 flex flex-wrap lg:flex-nowrap sm:flex-row flex-col  gap-3 sm:mt-0 mt-4">
                                  <li className="flex sm:flex-col flex-row items-center">
                                    <p className="text-[#1AB1A4] font-[600] text-center text-[20px] sm:me-0 me-4">
                                      {item?.rentCount || 0}
                                    </p>
                                    <span className="text-[#47525E] text-center  block">
                                      Properties for rent
                                    </span>
                                  </li>
                                  <li className="flex sm:flex-col flex-row items-center">
                                    <p className="text-[#1AB1A4] font-[600] text-center text-[20px] sm:me-0 me-4">
                                      {item?.saleCount || 0}
                                    </p>
                                    <span className="text-[#47525E] text-center block">
                                      Properties for sale
                                    </span>
                                  </li>
                                  <li className="flex sm:flex-col flex-row items-center">
                                    <p className="text-[#1AB1A4] font-[600] text-center text-[20px] sm:me-0 me-4">
                                      {item?.offMarketCount || 0}
                                    </p>
                                    <span className="text-[#47525E] text-center  block">
                                      Properties Off-Market
                                    </span>
                                  </li>
                                  <li className="flex sm:flex-col flex-row items-center">
                                    <p className="text-[#1AB1A4] font-[600] text-center text-[20px] sm:me-0 me-4">
                                      {item?.directoryCount || 0}
                                    </p>
                                    <span className="text-[#47525E] text-center  block">
                                      Properties Directory
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center col-span-12 my-8">
                        <img
                          src="assets/img/no-data.svg"
                          className="w-[400px] mx-auto "
                        />
                        No Records Found
                      </div>
                    )}
                    {!user?.loggedIn && <p className="text-center col-span-12 my-8">
                      {/* <img src="/assets/img/no-data.png" className="w-[100px] mx-auto" /> */}
                      Want to see more pro list? <spna onClick={(e) => navigate("/login")} className="text-bold text-[#976DD0] cursor-pointer">Just log in first!</spna>
                    </p>}
                  </div>
                  <div
                    className={`paginationWrapper ${total > filters?.count ? "" : "d-none"
                      }`}
                  >
                    <span>
                      Show {data?.length} from {total} Properties
                    </span>
                    {user?.loggedIn && <ReactPaginate
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
                    />}

                  </div>
                </div>
                <div className="xl:col-span-4  lg:col-span-4 md:col-span-6 col-span-12 border border-[#D2D2D2] rounded-[12px] lg:mb-0 mb-4">
                  <CustomMap
                    locations={mapLocs}
                    hoveredLocation={hoveredLocation}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {view === "grid" && (
          <ProListGrid
            data={data}
            total={total}
            filters={filters}
            handlePageChange={handlePageChange}
            allfilters={allfilters}
            navigateToDetail={navigateToDetail}
          />
        )}
      </div>

      <>
        {/* <div className="lg:col-span-4 col-span-12 border border-[#D2D2D2] rounded-[20px]">
          <div className="bg-[#FEF7EF] h-[160px] rounded-tl-[20px] rounded-tr-[20px]">
            <img src="assets/img/house.png" className="h-[120px] rounded-tl-[20px] rounded-tr-[20px] mx-auto" />
            <p className="text-center text-[#2D3336] uppercase text-[12px] font-[600]">
              House
            </p>
          </div>
          <ul className="p-3">
            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Transaction price:</h5>
              <p className="text-[13px]">2 500 000</p>
            </li>
            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Surface: </h5>
              <p className="text-[13px]">370 sqm</p>
            </li>
            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Price per Sqm: </h5>
              <p className="text-[13px]">6 756 €</p>
            </li>
            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Number of rooms: </h5>
              <p className="text-[13px]">6</p>
            </li>

            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Transaction date:</h5>
              <p className="text-[13px]">09/08/2018</p>
            </li>
            <li className="flex items-start mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px] shrink-0">Location:</h5>
              <p className="text-[13px] "> 16 rue poulet, 76200 Dieppe</p>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-4 col-span-12 border border-[#D2D2D2] rounded-[20px]">
          <div className="bg-[#FFD4DE] h-[160px] rounded-tl-[20px] rounded-tr-[20px]">
            <img src="assets/img/apartment.png" className="h-[120px] rounded-tl-[20px] rounded-tr-[20px] mx-auto" />
            <p className="text-center text-[#2D3336] uppercase text-[12px] font-[600]">
              Apartment
            </p>
          </div>
          <ul className="p-3">
            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Transaction price:</h5>
              <p className="text-[13px]">2 500 000</p>
            </li>
            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Surface: </h5>
              <p className="text-[13px]">370 sqm</p>
            </li>
            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Price per Sqm: </h5>
              <p className="text-[13px]">6 756 €</p>
            </li>
            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Number of rooms: </h5>
              <p className="text-[13px]">6</p>
            </li>

            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Transaction date:</h5>
              <p className="text-[13px]">09/08/2018</p>
            </li>
            <li className="flex items-start mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px] shrink-0">Location:</h5>
              <p className="text-[13px]"> 16 rue poulet, 76200 Dieppe</p>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-4 col-span-12 border border-[#D2D2D2] rounded-[20px]">
          <div className="bg-[#EBCD94] h-[160px] rounded-tl-[20px] rounded-tr-[20px]">
            <img src="assets/img/business.png" className="h-[120px] rounded-tl-[20px] rounded-tr-[20px] mx-auto" />
            <p className="text-center text-[#2D3336] uppercase text-[12px] font-[600]">
              Business
            </p>
          </div>
          <ul className="p-3">
            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Transaction price:</h5>
              <p className="text-[13px]">2 500 000</p>
            </li>
            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Surface: </h5>
              <p className="text-[13px]">370 sqm</p>
            </li>
            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Price per Sqm: </h5>
              <p className="text-[13px]">6 756 €</p>
            </li>
            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Number of rooms: </h5>
              <p className="text-[13px]">6</p>
            </li>

            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Transaction date:</h5>
              <p className="text-[13px]">09/08/2018</p>
            </li>
            <li className="flex items-start mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px] shrink-0">Location:</h5>
              <p className="text-[13px]"> 16 rue poulet, 76200 Dieppe</p>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-4 col-span-12 border border-[#D2D2D2] rounded-[20px]">
          <div className="bg-[#EEEFF3] h-[160px] rounded-tl-[20px] rounded-tr-[20px]">
            <img src="assets/img/outbuilding.png" className="h-[120px] rounded-tl-[20px] rounded-tr-[20px] mx-auto" />
            <p className="text-center text-[#2D3336] uppercase text-[12px] font-[600]">
              Outbuilding
            </p>
          </div>
          <ul className="p-3">
            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Transaction price:</h5>
              <p className="text-[13px]">2 500 000</p>
            </li>
            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Surface: </h5>
              <p className="text-[13px]">370 sqm</p>
            </li>
            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Price per Sqm: </h5>
              <p className="text-[13px]">6 756 €</p>
            </li>
            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Number of rooms: </h5>
              <p className="text-[13px]">6</p>
            </li>

            <li className="flex items-center mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Transaction date:</h5>
              <p className="text-[13px]">09/08/2018</p>
            </li>
            <li className="flex items-start mb-1">
              <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px] shrink-0">Location:</h5>
              <p className="text-[13px]"> 16 rue poulet, 76200 Dieppe</p>
            </li>
          </ul>
        </div> */}
      </>
    </PageLayout>
  );
};

export default Prolist;
