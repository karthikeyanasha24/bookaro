import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useLocation, useNavigate } from "react-router-dom";
import LoginModal from "../../components/common/Modal/LoginModal";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { capLetter, dateFormate, formatCurrency } from "../../models/string.model";
import CustomMap from "../Property/CustomMap";
import CommonCreteria from "./CommonCreteria";
import CommonFilter from "./CommonFilter";
import PastTransectionGrid from "./ProListGrid";
import { useSelector } from "react-redux";

const PastTransectionList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    page: 1,
    count: 12,
  });
  const history = useNavigate()
  const calculateNo = (page, count) => (page - 1) * count + 1;
  const user = useSelector((state) => state.user)
  const [showReset, setShowReset] = useState(false);
  const locationn = useLocation();
  const params = new URLSearchParams(locationn.search);
  const search = params.get("search");
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  const minSurface = params.get("minSurface");
  const maxSurface = params.get("maxSurface");
  const number_of_main_pieces = params.get("rooms");
  const [location, setLocation] = useState(search ? [{ name: search, added: true }] : []);
  const [priceRange, setPriceRange] = useState({ min: minPrice || "", max: maxPrice || "" })
  const [surface, setSurface] = useState({ min: minSurface || "", max: maxSurface || "" })
  const [selectedRooms, setSelectedRooms] = useState(number_of_main_pieces ? [parseInt(number_of_main_pieces)] : []);
  const [currentLocation, setCurrentLocation] = useState("");
  const [view, setView] = useState("map");
  const [loginModal, setloginModal] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isOpen4, setIsOpen4] = useState(false);
  const [isOpen5, setIsOpen5] = useState(false);
  const [isOpen6, setIsOpen6] = useState(false);
  const [allfilters, setAllFilters] = useState({
    search: search || "",
    minPrice: minPrice || "",
    maxPrice: maxPrice || "",
    minSurface: minSurface || "",
    maxSurface: maxSurface || "",
    number_of_main_pieces: number_of_main_pieces || "",
  });
  const [indFilter, setIndFilter] = useState({
    search: search || "",
    minPrice: minPrice || "",
    maxPrice: maxPrice || "",
    minSurface: minSurface || "",
    maxSurface: maxSurface || "",
    number_of_main_pieces: number_of_main_pieces || "",
  });
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [mapLocs, setMapLocs] = useState([]);
  const [error, setError] = useState({ location: "", price: "", surface: "" });
  const [hoveredLocation, setHoveredLocation] = useState(null);


  const getData = (f = {}) => {
    const filter = {
      ...filters,
      ...allfilters,
      ...f,
    };
    let dto = filter;
    if (user?._id) {
      dto = { ...filter, loggedInUser: user?._id }
    }

    loader(true);
    ApiClient.get("transaction/list", dto).then((res) => {
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
          if (item?.longitude || item?.latitude) {
            map.push({
              lat: parseInt(item?.latitude),
              lng: parseInt(item?.longitude),
              info: item?.address_channel_name,
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
        value !== null && value !== "" && value !== 0 && value !== undefined && value !== false
    );
    setShowReset(filter);
  }, [allfilters]);

  const getFilterResult = () => {
    let dto = { ...filters, ...indFilter };
    if (user?._id) {
      dto = { ...filters, ...indFilter, loggedInUser: user?._id }
    }
    ApiClient.get("transaction/list", dto).then((res) => {
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resetData = () => {
    setFilters({
      page: 1,
      count: 10,
    });
    setIndFilter({
      search: "",
      minPrice: "",
      maxPrice: "",
      minSurface: "",
      maxSurface: "",
      number_of_main_pieces: "",
      offMarket: false,
    });
    setAllFilters({
      search: "",
      minPrice: "",
      maxPrice: "",
      minSurface: "",
      maxSurface: "",
      number_of_main_pieces: "",
      offMarket: false,
    });
    setCurrentLocation("");
    setLocation([]);
    setPriceRange({ min: "", max: "" });
    setSurface({ min: "", max: "" });
    setSelectedRooms([])
    setShowReset(false);
    if (search || minPrice || maxPrice || minSurface || maxSurface || number_of_main_pieces) navigate("/past-transation-list");
  };

  const handleSortBy = (one, two) => {
    setAllFilters({
      ...allfilters,
      sortBy: `${one} ${two}`,
    });
  };

  const getType = (type) => {
    switch (type?.toLowerCase()) {
      case 'house':
        return {
          class: 'bg-[#FEF7EF]',
          img: 'assets/img/house.png',
        };
      case 'apartment':
        return {
          class: 'bg-[#FFD4DE]',
          img: 'assets/img/apartment.png',
        };
      case 'commercial premise':
        return {
          class: 'bg-[#EBCD94]',
          img: 'assets/img/business.png',
        };
      case 'outbuilding':
        return {
          class: 'bg-[#EEEFF3]',
          img: 'assets/img/outbuilding.png',
        };
      default:
        return {
          class: 'bg-[#FEF7EF]',
          img: 'assets/img/house.png',
        };
    }
  };
  const toggleRoomSelection = (key, value) => {
    setSelectedRooms((prev) => {
      if (prev.includes(value)) {
        return prev?.filter((room) => room !== value);
      } else {
        return [...prev, value];
      }
    });
  };
  const applyRoomsFilters = () => {
    setIsOpen5(false);
    let data = { ...allfilters };
    data = {
      ...data,
      number_of_main_pieces: selectedRooms.join(),
    };
    setAllFilters(data);
  };
  const resetIndividual = (attr, key1, key2, key3) => {
    attr(false);
    setAllFilters({
      ...allfilters,
      [key1]: "",
      ...(key2 && { [key2]: "" }),
      ...(key3 && { [key3]: "" }),
    });
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
          isOpen4={isOpen4}
          setIsOpen4={setIsOpen4}
          isOpen5={isOpen5}
          setIsOpen5={setIsOpen5}
          isOpen6={isOpen6}
          setIsOpen6={setIsOpen6}
          removeParams={removeParams}
          view={view}
          setView={setView}
          allfilters={allfilters}
          setAllFilters={setAllFilters}
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          location={location}
          setLocation={setLocation}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          surface={surface}
          setSurface={setSurface}
          resetData={resetData}
          showReset={showReset}
          indFilter={indFilter}
          setIndFilter={setIndFilter}
          error={error}
          setError={setError}
          upcomingCount={upcomingCount}
          selectedRooms={selectedRooms}
          setSelectedRooms={setSelectedRooms}
          toggleRoomSelection={toggleRoomSelection}
          applyRoomsFilters={applyRoomsFilters}
          resetIndividual={resetIndividual}
        />
        {view === "map" && (
          <div className="bg-[#f9f9f9] py-10">
            <div className=" items-center  mx-auto container lg:px-10 px-6">
              <div className="grid grid-cols-12 md:gap-8 gap-0">
                <CommonCreteria allfilters={allfilters} total={total} handleSortBy={handleSortBy} />
                <div className="xl:col-span-8 lg:col-span-6 md:col-span-6  col-span-12 lg:mb-0 mb-4 h-[700px] overflow-auto pe-3 md:mt-0 mt-5">
                  <div className="grid grid-cols-12 md:gap-4 gap-0">
                    {data?.length > 0 &&
                      data?.map((itm, i) => {
                        let price = Math.floor(itm?.land_value);
                        let sur = Math.floor(itm?.lot1_surface_carrez);
                        let perSqr = Math.floor(price / sur);
                        let type = itm.local_type?.toLowerCase();
                        return (
                          <>
                            <div className="lg:col-span-4 col-span-12 border border-[#D2D2D2] rounded-[20px]">
                              <div className={`${getType(type).class} h-[160px] rounded-tl-[20px] rounded-tr-[20px]`}>
                                <img src={`${getType(type).img}`} className="h-[120px] rounded-tl-[20px] rounded-tr-[20px] mx-auto" alt="" />
                                <p className="text-center text-[#2D3336] uppercase text-[12px] font-[600]">
                                  {itm.local_type}
                                </p>
                              </div>
                              <ul className="p-3">
                                {+price > 0 && <li className="flex items-center mb-1">
                                  <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Transaction price:</h5>
                                  <p className="text-[13px]">{formatCurrency(price)} €</p>
                                </li>}
                                {+sur > 0 && <li className="flex items-center mb-1">
                                  <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Surface: </h5>
                                  <p className="text-[13px]">{formatCurrency(sur)} sqm</p>
                                </li>}
                                {+perSqr > 0 && <li className="flex items-center mb-1">
                                  <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Price per Sqm: </h5>
                                  <p className="text-[13px]">{formatCurrency(perSqr)} €</p>
                                </li>}
                                {+itm?.number_of_main_pieces > 0 && <li className="flex items-center mb-1">
                                  <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Number of rooms: </h5>
                                  <p className="text-[13px]">{itm?.number_of_main_pieces}</p>
                                </li>}
                                {itm?.mutation_date && <li className="flex items-center mb-1">
                                  <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">Transaction date:</h5>
                                  <p className="text-[13px]">{dateFormate(itm?.mutation_date)}</p>
                                </li>}
                                {itm?.address_channel_name && <li className="flex items-start mb-1">
                                  <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px] shrink-0">Location:</h5>
                                  <p className="text-[13px]">
                                    {`${capLetter(itm?.address_channel_name)}${itm?.community_name
                                      ? `, ${itm.community_name?.toLowerCase()}` : ""}${itm?.postal_code ? ` (${itm.postal_code})` : ""}`}
                                  </p>
                                </li>}
                              </ul>
                            </div>
                          </>
                        )
                      })}
                    {!user?.loggedIn && <p className="text-center col-span-12 my-8">
                      {/* <img src="/assets/img/no-data.png" className="w-[100px] mx-auto" /> */}
                      Want to see more past transaction list? <spna onClick={(e) => history("/login")} className="text-bold text-[#976DD0] cursor-pointer">Just log in first!</spna>
                    </p>}
                  </div>
                  <div className={`paginationWrapper ${total > filters?.count ? "" : "d-none"}`} >
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
                <div className="xl:col-span-4  lg:col-span-6 md:col-span-6 col-span-12 border border-[#D2D2D2] rounded-[12px] lg:mb-0 mb-4 custom-map">
                  <CustomMap locations={mapLocs} hoveredLocation={hoveredLocation} />
                </div>
              </div>
            </div>
          </div>
        )}
        {view === "grid" && (
          <PastTransectionGrid
            data={data}
            total={total}
            filters={filters}
            handlePageChange={handlePageChange}
            allfilters={allfilters}
            calculateNo={calculateNo}
            handleSortBy={handleSortBy}
            getType={getType}
          />
        )}
      </div>
    </PageLayout >
  );
};

export default PastTransectionList;
