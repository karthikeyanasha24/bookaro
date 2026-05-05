import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useLocation, useNavigate } from "react-router-dom";
import LoginModal from "../../components/common/Modal/LoginModal";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import CustomMap from "../Property/CustomMap";
import BuildingPermitGrid from "./BuildingPermitGrid";
import CommonFilter from "./CommonFilter";
import { useSelector } from "react-redux";

const BuildingPermitlist = () => {

  const navigate = useNavigate();
  const { user } = useSelector((state) => state);
  const [filters, setFilters] = useState({
    page: 1,
    count: 10,
  });
  const calculateNo = (page, count) => (page - 1) * count + 1;
  const [showReset, setShowReset] = useState(false);
  const locationn = useLocation();
  const params = new URLSearchParams(locationn.search);
  const type = params.get("type");
  const search = params.get("search");
  const latitude = params.get("latitude");
  const longitude = params.get("longitude");
  const [selectedType, setSelectedType] = useState(type ? [type] : []);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [hoveredLocation, setHoveredLocation] = useState(null);
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
    type: type || "",
    latitude: latitude || "",
    longitude: longitude || "",
    search: "",
  });
  const activePlan = useSelector((state) => state.activePlan);
  const [indFilter, setIndFilter] = useState({
    city: search || "",
    type: type || "",
    latitude: latitude || "",
    longitude: longitude || "",
    search: "",
    status: "",
  })
  const [upcomingCount, setUpcomingCount] = useState(0)
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [mapLocs, setMapLocs] = useState([]);
  const [error, setError] = useState({ status: "", location: "", type: "", })

  const getData = (f = {}) => {

    if (activePlan?.[0]?.otherDetails?.browseBuildingPermits?.key == "") {
      return
    }

    let filter = {
      ...allfilters,
      ...filters,
      ...f,
    };

    if(user?._id){
      filter = {
      ...allfilters,
      ...filters,
      ...f,
      loggedInUser:user?._id
    };
    }

    let dto = filter;
    delete filter.city
    delete filter.maxDistance
    loader(true);
    ApiClient.get("buildingPermits/listing", dto).then((res) => {
      if (res.success) {
        // setData(res?.data)
        if (user?.loggedIn) {
          setData(res?.data)
        } else {
          setData(res?.data.slice(0, 3))
        }
        setTotal(res?.total);
        setUpcomingCount(res?.total);
        let map = [];
        res?.data?.map((item) => {
          if (item?.latitude || item?.longitude) {
            map.push({
              lat: Number(item?.longitude),
              lng: Number(item?.latitude),
              info: item?.propertyTitle,
              city: item?.city,
              exactLocation: true,
              icon: "/assets/img/prop/placeholder.png",
            });
          }
        });

        setMapLocs(map);
      }
      loader(false);
    });
  };


  useEffect(() => {
    getData(allfilters);
    const filter = Object.values(allfilters).some(
      (value) =>
        value !== null && value !== "" && value !== 0 && value !== undefined && value != false
    );
    setShowReset(filter);
  }, [allfilters]);

  const getFilterResult = () => {
    let dto = { ...filters, ...indFilter }
    if (user?._id) {
      dto = {
        ...filters, ...indFilter,
        loggedInUser: user?._id
      };
    }
    ApiClient.get("buildingPermits/listing", dto).then((res) => {
      if (res.success) {
        setUpcomingCount(res?.total);
      }
    });
  }
  useEffect(() => {
    getFilterResult()
  }, [indFilter])

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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const findType = (itm) => {
    if (itm == "demolitionPermit") {
      return "Demolition Permit"
    } else if (itm == "nonResdential") {
      return "Non Resdential"
    } else {
      return "Resdential"
    }
  }
  const resetData = () => {
    setFilters({
      page: 1,
      count: 10,
    });
    setIndFilter({
      city: "",
      type: "",
      search: "",
      status: "",
      offMarket: false,
    })
    setSelectedType([]);
    setSelectedStatus([]);
    setLocation([]);
    setCurrentLocation("");
    setAllFilters({
      city: "",
      type: "",
      search: "",
      offMarket: false,
    });
    setShowReset(false);
    if (search || type) navigate("/building-permit-list");
  };
  // const [services, setServices] = useState([]);

  // const getServices = () => {
  //   loader(true);
  //   ApiClient.get("service/list", { status: "active" }).then((res) => {
  //     if (res.success) {
  //       let data = res.data?.filter(dd => dd?.status === "active")
  //         ?.map((itm) => {
  //           itm.id = itm._id;
  //           return itm;
  //         })
  //       setServices(data);
  //     }
  //     loader(false);
  //   });
  // };
  // useEffect(() => {
  //   getServices();
  // }, [])

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
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          resetData={resetData}
          showReset={showReset}
          indFilter={indFilter}
          setIndFilter={setIndFilter}
          error={error}
          setError={setError}
          upcomingCount={upcomingCount}
          // services={services}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
        {view === "map" && (
          <div className="bg-[#f9f9f9] py-10">
            <div className=" items-center  mx-auto container lg:px-10 px-6">
              <div className="grid grid-cols-12 md:gap-8 gap-0">
                <div className="col-span-12">    <p className="text-[#47525E]">
                  <span className="text-[#47525E] font-bold text-[20px]">
                    {total} results </span>
                  for building permits
                </p></div>
                <div className="  lg:col-span-7 md:col-span-6  col-span-12 lg:mb-0 mb-4 h-[700px] overflow-auto pe-3 md:mt-0 mt-5">
                  <div className="grid grid-cols-12  gap-4">
                    {data?.length > 0 ? (
                      data.map((itm, i) => {
                        return (
                          <div className="lg:col-span-6 col-span-12 border border-[#D2D2D2] bg-white p-5 rounded-xl cursor-pointer"
                            onMouseEnter={() => setHoveredLocation({
                              lng: parseFloat(itm?.location?.coordinates[1] || itm?.location?.coordinates[1]),
                              lat: parseFloat(itm?.location?.coordinates[0] || itm?.location?.coordinates[0]),
                            })}
                            onMouseLeave={() => setHoveredLocation(null)}
                          >
                            <h4 className="text-[#47525E] font-[600] mb-3 text-[18px]">
                              {findType(itm?.type)} building
                            </h4>
                            <ul className="">
                              <li className="mb-1">
                                <p className="text-[#47525E] flex items-center">
                                  <span className="bg-[#46A49B] w-[8px] h-[8px] rounded-full inline-block me-2 shrink-0"></span>
                                  Request date: {itm?.authorizationDate || "--"}
                                </p>
                              </li>
                              <li className="mb-1">
                                <p className="text-[#47525E] flex items-center">
                                  <span className="bg-[#46A49B] w-[8px] h-[8px] rounded-full inline-block me-2 shrink-0"></span>
                                  Request Status: {itm?.statusLabel || "--"}
                                </p>
                              </li>
                              <li className="mb-1">
                                <p className="text-[#47525E] flex items-center">
                                  <span className="bg-[#46A49B] w-[8px] h-[8px] rounded-full inline-block me-2 shrink-0"></span>
                                  Start Date: {itm?.worksStartDate || "--"}
                                </p>
                              </li>
                              <li className="mb-1">
                                <p className="text-[#47525E] flex items-center">
                                  <span className="bg-[#46A49B] w-[8px] h-[8px] rounded-full inline-block me-2 shrink-0"></span>
                                  Requester Name: {itm?.requesterName || "--"}
                                </p>
                              </li>
                              <li className="mb-1">
                                <p className="text-[#47525E] flex items-center">
                                  <span className="bg-[#46A49B] w-[8px] h-[8px] rounded-full inline-block me-2 shrink-0"></span>
                                  Address: {itm?.address || "--"}
                                </p>
                              </li>

                              {/* <li className="mb-1">
                                <p className="text-[#47525E] flex items-center">
                                  <span className="bg-[#46A49B] w-[8px] h-[8px] rounded-full inline-block me-2 shrink-0"></span>
                                  Building Type: {itm?.type || "--"}
                                </p>
                              </li> */}


                            </ul>
                            {/* <div className="flex justify-end">
                              <p className="bg-[#73319A] w-[35px] h-[35px] rounded-[50px] p-1 text-white flex items-center justify-center font-[600]">
                                {calculateNo(filters.page, filters.count) + i}
                              </p>
                            </div> */}
                          </div>
                        )
                      })) : (
                      <div className="text-center col-span-12 my-8">
                        <img src="assets/img/no-data.svg" className="w-[400px] mx-auto " />
                        No Records Found
                      </div>
                    )}
                    {!user?.loggedIn && <p className="text-center col-span-12 my-8">
                      {/* <img src="/assets/img/no-data.png" className="w-[100px] mx-auto" /> */}
                      Want to see more building permit? <spna onClick={(e) => navigate("/login")} className="text-bold text-[#976DD0] cursor-pointer">Just log in first!</spna>
                    </p>}
                  </div>
                  <div className={`paginationWrapper md:flex-row flex-col ${total > filters?.count ? "" : "d-none"}`}                    >
                    <span className="md:mb-0 mb-2">
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
                <div className=" lg:col-span-5 md:col-span-6 col-span-12 border border-[#D2D2D2] rounded-[12px] lg:mb-0 mb-4 custom-map">
                  <CustomMap locations={mapLocs} hoveredLocation={hoveredLocation} />
                </div>
              </div>
            </div>
          </div>
        )}
        {view === "grid" && (
          <BuildingPermitGrid
            data={data}
            total={total}
            filters={filters}
            handlePageChange={handlePageChange}
            allfilters={allfilters}
            calculateNo={calculateNo}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default BuildingPermitlist;
