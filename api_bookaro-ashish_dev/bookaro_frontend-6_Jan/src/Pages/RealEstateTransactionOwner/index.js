import { useEffect, useMemo, useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import LeadCards from "./LeadCards";
import ManageVisitSlot from "./ManageVisitSlot";
import PropLeadSidebar from "./PropLeadSidebar";
import datepipeModel from "../../models/datepipemodel";
import socket from "../../config/ChatSocket/socket";
import AiAvatarButton from "../../components/common/AiAvatarButton";
import AiChatWindow from "../../components/common/AiChatWindow";

const RealEstateTransactionOwner = () => {
  const { user } = useSelector((state) => state);
  const activePlan = useSelector((state) => state.activePlan);
  const navigate = useNavigate();
  const ownerPlan = true
  //  user?.planId && user?.planType == "paid" ? true : false;
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [cards, setCards] = useState([]);
  const [totalCard, setTotalCard] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [offerStatus, setOfferStatus] = useState(false);
  const [applicationAccepted, setApplicationAccepted] = useState(false);
  // AI chat state
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiUnreadCount, setAiUnreadCount] = useState(0);

  // Poll for AI unread messages
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await ApiClient.get("ai-agent/unread-count");
        if (res?.success) setAiUnreadCount(res.data?.count || 0);
      } catch {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);
  const handleClickProperty = (item) => {
    if (!ownerPlan) return;
    let propertyId = item?._id;
    if (propertyId !== selectedProperty?._id) {
      setSelectedProperty(item);
    }
    socket.emit("activityIndicatorCount", { propertyId: propertyId });
    const newArr = filteredData?.map((obj) => {
      if (obj._id === propertyId) {
        obj.activityIndicatorCount = 0;
      }
      return obj;
    });
    if (newArr?.length > 0) {
      setFilteredData([...newArr])
    }
  };

  const getCards = (propertyId = selectedProperty?._id, f = {}) => {
    if (!propertyId) return;
    const filter = { propertyId, ...f, sortBy: "updatedAt desc" };
    loader(true);

    let url = "interests/list";
    if (selectedProperty.isTransferred) {
      url = "interests/expiredInterests";
    }

    ApiClient.get(url, filter).then((res) => {
      if (res?.data) {
        let data = res.data.map((itm) => {
          itm.isTransferred = selectedProperty.isTransferred;
          return itm;
        });
        let instersLength = activePlan?.[0]?.numberOfInterest || 0;
        let new_data = data;
        // .slice(0, instersLength);
        setCards(new_data);
        setTotalCard(new_data?.length);
        setOfferStatus(res?.offerStatus || false);
        setApplicationAccepted(res?.applicationAccepted || false);
      }
      loader(false);
    });
  };

  const [filters, setFilters] = useState({
    page: 1,
    count: 10,
    interestUpdatedTime: true,
    userId: user?._id,
  });
  const [type, setType] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState("");

  const getData = (f = {}, updatePayload) => {

    if (updatePayload) {
      setData(prev => {
        const index = prev.findIndex(item => item._id == updatePayload.id);
        if (index >= 0) {
          prev[index] = {
            ...prev[index],
            ...updatePayload
          }
        }
        return prev
      })

      return
    }

    const filter = {
      ...filters,
      ...f,
    };
    if (type) {
      filter.propertyType = type == true ? "" : type;
      filter.offMarket = type == true ? true : false
    }

    let url = "property/myProperties";
    if (filter.propertyType == "transferred") {
      filter.propertyType = "";
      url = "interests/transferHistory";
    }

    loader(true);
    ApiClient.get(url, filter).then((res) => {
      if (res.success) {
        let data = res?.data || res?.Data || [];
        data = data.map((itm) => {
          itm._id = itm.propertyId?._id || itm._id;
          itm.propertyTitle =
            itm.propertyId?.propertyTitle || itm.propertyTitle;
          itm.address = itm.propertyId?.address || itm.address;
          itm.images = itm.propertyId?.images || itm.images;
          itm.totalLeads = itm.OldOwnerData?.totalLeads || itm.totalLeads;
          itm.userImages =
            itm.OldOwnerData?.leadsImages || itm.userImages || [];
          itm.isTransferred = url == "interests/transferHistory" ? true : false;
          return itm;
        });
        setData(data);
        setFilteredData(data);
        setTotal(res?.total || data?.length);

        if (data.length) {
          handleClickProperty(data[0]);
        }
      } else {
        setData([]);
        setFilteredData([]);
        setTotal(0);
      }
      loader(false);
    });
  };
  useEffect(() => {
    getData();
  }, [type]);

  useEffect(() => {
    if (selectedProperty) {
      getCards(selectedProperty?._id);
    }
  }, [selectedProperty]);

  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1;
    setFilters((prev) => ({ ...prev, page: newPage }));
    getData({ page: newPage });
  };
  const textChange = (key, val) => {
    setName(val);
    if (key === "name") {
      const filterr = data?.filter((item) =>
        item?.propertyTitle?.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredData(filterr);
    }
  };

  const visitSlots = useMemo(() => {
    const today = datepipeModel.datetostring(new Date().toISOString()); // Get today's date in YYYY-MM-DD format
    const upcomingSlots = selectedProperty?.visitSlots?.filter(
      (slot) => slot.date >= today
    );
    return upcomingSlots;
  }, [selectedProperty]);

  const informApplicant = () => { };

  return (
    <PageLayout>
      <div className="  pt-14 lg:pt-16 pb-[100px]  bg-[#f2ecf8] relative">
        <div className="container   px-8 mx-auto xl:px-5 h-full ">
          <div className="lg:max-w-[1200px] mx-auto max-w-[100%] w-[100%]">
            <ul className="flex items-center pb-[50px] md:text-[16px] text-[14px]">
              <li
                onClick={() => navigate("/project")}
                className="text-[#47525E] cursor-pointer after"
              >
                My Project<span className="mx-[4px]">|</span>
              </li>
              <li className="text-[#47525E] cursor-pointer capitalize font-[600]">
                Owner transaction management
              </li>
            </ul>
            <h2 className="text-black max-w-lg mx-auto font-bold text-2xl text-center ">
              Monitor your real-estate transactions
            </h2>

            <div className="grid grid-cols-12 gap-5 mt-10 mb-16">
              <div className="lg:col-span-6 col-span-full">
                <div className="bg-[#976dd03b] p-4 rounded-[12px] flex md:items-center items-start md:flex-row flex-col md:gap-8 gap-4">
                  <div>
                    <h4 className="text-black font-[600] mb-1">
                      Close external real-estate transaction here
                    </h4>
                    <p className="text-[#525252] text-[14px] xl:h-[100%] lg:h-[105px] h-[100%]">
                      You found a buyer somewhere else than in Bookaroo add your
                      property profile here to secure or close your deal thanks
                      to our guided funnel.
                    </p>
                  </div>
                  <div>
                    <Link
                      to={`/property1`}
                      className="inline-flex justify-center text-white bg-[#976DD0] rounded-[35px] px-2 py-2 w-[140px] text-[14px]"
                    >
                      Import property
                    </Link>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 col-span-full">
                <div className="bg-[#976dd03b] p-4 rounded-[12px] flex md:items-center items-start md:flex-row flex-col md:gap-8 gap-4">
                  <div>
                    <h4 className="text-black font-[600] mb-1">
                      Sell alone with real estate profesional services
                    </h4>
                    <p className="text-[#525252] text-[14px] xl:h-[100%] lg:h-[105px] h-[100%]">
                      Selling your property without a real estate agency does
                      not mean you have to do it alone. Our partner can provide
                      you same services than a real estate agency but at a
                      reasonable price.
                    </p>
                  </div>
                  <div>
                    <button className="text-white bg-[#976DD0] rounded-[35px] px-2 py-2 w-[140px] text-[14px]">
                      See services
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-10 md:gap-8">
              <PropLeadSidebar
                handleClickProperty={handleClickProperty}
                selectedProperty={selectedProperty}
                filters={filters}
                type={type}
                setType={setType}
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                name={name}
                setName={setName}
                total={total}
                data={data}
                textChange={textChange}
                handlePageChange={handlePageChange}
              />

              {ownerPlan ? (
                <div className="lg:col-span-8 md:col-span-6 col-span-12 md:mt-0 mt-8">
                  {offerStatus || applicationAccepted ? (
                    <>
                      <div className="col-span-full py-6">
                        <div className="text-center mb-3 font-[600] text-[18px]">
                          Congratulatulations! You found a{" "}
                          {selectedProperty?.propertyType == "rent"
                            ? "Renter"
                            : "Buyer"}
                          !
                        </div>
                        {/* <div className="text-center">
                    <button type="button" className="bg-[#976DD0] text-[14px] rounded-[50px] py-[6px] px-[14px] text-white font-bold" onClick={()=>informApplicant()}>Inform All applicants</button>
                  </div> */}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {selectedProperty?.isTransferred ? (
                    <></>
                  ) : (
                    <>
                      <ManageVisitSlot
                        selectedProperty={selectedProperty}
                        visitSlots={visitSlots}
                        setSelectedProperty={setSelectedProperty}
                        getCards={getCards}
                        offerStatus={offerStatus}
                        applicationAccepted={applicationAccepted}
                        getData={getData}
                      />
                    </>
                  )}

                  <LeadCards
                    cards={cards}
                    setCards={setCards}
                    offerStatus={offerStatus}
                    applicationAccepted={applicationAccepted}
                    setOfferStatus={setOfferStatus}
                    setApplicationAccepted={setApplicationAccepted}
                    selectedProperty={selectedProperty}
                    getCards={getCards}
                    totalCard={totalCard}
                    getData={getData}
                    setSelectedProperty={setSelectedProperty}
                  />
                </div>
              ) : (
                <div className="lg:col-span-8 md:col-span-6 col-span-12 md:mt-0 mt-8">
                  <div>
                    <img
                      src="assets/img/transaction/real-estate.png"
                      alt=""
                      className="w-[250px] rounded-[5px] mx-auto"
                    />
                  </div>
                  <p className="text-black font-[600] text-[20px] text-center my-5">
                    Unlock real-estate transaction monitoring tool{" "}
                  </p>
                  <div className="mx-auto w-[170px] mb-10">
                    <button
                      onClick={() => navigate("/plan")}
                      className="text-white bg-[#976DD0] rounded-[50px] px-5 py-2 mx-auto"
                    >
                      Choose your plan
                    </button>
                  </div>
                  <div className="flex flex-col justify-center mx-auto w-[60%]">
                    <h5 className="text-[#47525E] font-[600] mb-5">
                      Key native features of our monitoring tool
                    </h5>
                    <ul>
                      <li className="flex items-start my-2">
                        <div className="bg-[#73339B] text-white w-[20px] h-[20px]  rounded-full me-2 shrink-0">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          Educational content to help you sell on your own
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-[#73339B] text-white w-[20px] h-[20px]  rounded-full me-2 shrink-0">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          Filter candidates according to your criterion
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-[#73339B] text-white w-[20px] h-[20px]  rounded-full me-2 shrink-0">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          Financial background check and rating of candidates
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-[#73339B] text-white w-[20px] h-[20px]  rounded-full me-2 shrink-0">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          Automatic invite of good candidates
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-[#73339B] text-white w-[20px] h-[20px]  rounded-full me-2 shrink-0">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          Manage your visits calendar
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-[#73339B] text-white w-[20px] h-[20px]  rounded-full me-2 shrink-0">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          Automatic sending of property file
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-[#73339B] text-white w-[20px] h-[20px]  rounded-full me-2 shrink-0">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          Reception of candidates files
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-[#73339B] text-white w-[20px] h-[20px]  rounded-full me-2 shrink-0">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          Reception of purchase offer
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col justify-center mx-auto w-[60%]">
                    <h5 className="text-[#47525E] font-[600] my-8">
                      Game changing services offered by our partners
                    </h5>
                    <ul>
                      <li className="flex items-start my-2">
                        <div className="bg-black text-white w-[20px] h-[20px]  rounded-full me-2">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          Writting of your property profile
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-black text-white w-[20px] h-[20px]  rounded-full me-2">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          Profesional pictures of your property
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-black text-white w-[20px] h-[20px]  rounded-full me-2">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          Financial background check of potential buyer or
                          renter
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-black text-white w-[20px] h-[20px]  rounded-full me-2">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          Hosting the visits of your property for potential
                          candidates
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-black text-white w-[20px] h-[20px]  rounded-full me-2 shrink-0">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          Undertake legal administrative tasks for selling your
                          property (legal document collection...)
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ── AI Assistant (floating button + chat window) ───────────────── */}
      <AiAvatarButton
        onClick={() => { setAiChatOpen((o) => !o); setAiUnreadCount(0); }}
        unreadCount={aiUnreadCount}
        isOpen={aiChatOpen}
      />
      <AiChatWindow
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
        propertyId={selectedProperty?._id}
        propertyTitle={selectedProperty?.propertyTitle}
      />
    </PageLayout>
  );
};

export default RealEstateTransactionOwner;
