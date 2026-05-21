import { useEffect, useMemo, useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import { useTranslation } from "react-i18next";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { isGuestMode } from "../../methods/guestMode";
import LeadCards from "./LeadCards";
import ManageVisitSlot from "./ManageVisitSlot";
import PropLeadSidebar from "./PropLeadSidebar";
import datepipeModel from "../../models/datepipemodel";
import socket from "../../config/ChatSocket/socket";

const RealEstateTransactionOwner = () => {
  const { t } = useTranslation();
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
  const [showMockBadge, setShowMockBadge] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const [applicationAccepted, setApplicationAccepted] = useState(false);
  const handleClickProperty = (item) => {
    if (!ownerPlan) return;
    const propertyId = item?._id;
    if (!propertyId) return;

    setSelectedProperty(item);
    getCards(propertyId, item);

    socket.emit("activityIndicatorCount", { propertyId });
    const newArr = filteredData?.map((obj) => {
      if (obj._id === propertyId) {
        obj.activityIndicatorCount = 0;
      }
      return obj;
    });
    if (newArr?.length > 0) {
      setFilteredData([...newArr]);
    }
  };

  const getCards = (propertyId = selectedProperty?._id, property = selectedProperty, f = {}) => {
    const resolvedPropertyId = propertyId || property?.propertyId?._id || property?._id;
    if (!resolvedPropertyId) return;
    const filter = { propertyId: resolvedPropertyId, ...f, sortBy: "updatedAt desc" };
    loader(true);

    let url = "interests/list";
    if (property?.isTransferred) {
      url = "interests/expiredInterests";
    }

    ApiClient.get(url, filter).then((res) => {
      setDebugInfo((prev) => ({
        ...prev,
        response: res,
        stage: "getCardsResponse",
        url,
        filter,
      }));
      const responseData = res?.data || res?.Data || [];
      if (Array.isArray(responseData)) {
        let data = responseData.map((itm) => {
          itm.isTransferred = property?.isTransferred;
          return itm;
        });
        setCards(data);
        setTotalCard(data.length);
        setOfferStatus(res?.offerStatus || false);
        setApplicationAccepted(res?.applicationAccepted || false);
        setShowMockBadge((prev) => prev || !!res?.mockData || !!res?.isMock);
      }
      loader(false);
    });
  };

  const [filters, setFilters] = useState({
    page: 1,
    count: 10,
    interestUpdatedTime: true,
  });
  const [type, setType] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState("");

  const getData = (f = {}, updatePayload) => {
    if (updatePayload) {
      setData((prev) => {
        const index = prev.findIndex((item) => item._id == updatePayload.id);
        if (index >= 0) {
          prev[index] = {
            ...prev[index],
            ...updatePayload,
          };
        }
        return prev;
      });

      return;
    }

    const filter = {
      ...filters,
      userId: user?._id,
      ...f,
    };
    if (type) {
      filter.propertyType = type == true ? "" : type;
      filter.offMarket = type == true ? true : false;
    }

    let url = "property/myProperties";
    if (filter.propertyType == "transferred") {
      filter.propertyType = "";
      url = "interests/transferHistory";
    }

    setDebugInfo({
      stage: "getDataRequest",
      url,
      filter,
      isGuestMode: isGuestMode(),
      selectedPropertyId: selectedProperty?._id,
    });
    loader(true);
    ApiClient.get(url, filter).then((res) => {
      setDebugInfo((prev) => ({
        ...prev,
        stage: "getDataResponse",
        response: res,
        url,
        filter,
      }));
      const responseData = res?.data || res?.Data || [];
      const success = res?.success !== false;
      if (Array.isArray(responseData) && responseData.length > 0 && success) {
        const mappedData = responseData.map((itm) => {
          const property = itm.propertyId || itm.property || {};
          itm._id = property._id || itm._id;
          itm.propertyTitle = property.propertyTitle || itm.propertyTitle;
          itm.address = property.address || itm.address;
          itm.images = property.images || itm.images;
          itm.surface = itm.surface ?? property.surface;
          itm.rooms = itm.rooms ?? property.rooms;
          itm.bedrooms = itm.bedrooms ?? property.bedrooms;
          itm.price = itm.price ?? property.price;
          itm.propertyMonthlyCharges =
            itm.propertyMonthlyCharges ?? property.propertyMonthlyCharges;
          itm.propertyType = itm.propertyType ?? property.propertyType;
          itm.totalLeads = itm.OldOwnerData?.totalLeads || itm.totalLeads;
          itm.userImages =
            itm.OldOwnerData?.leadsImages ||
            itm.userImages ||
            itm.userLeads?.map((lead) => lead?.profileImage).filter(Boolean) ||
            [];
          itm.isTransferred = url == "interests/transferHistory";
          return itm;
        });
        let finalData = mappedData;
        if (type && type !== "" && type !== "transferred") {
          if (type === true) {
            finalData = mappedData.filter((item) => item.propertyType === "offmarket");
          } else {
            finalData = mappedData.filter((item) => item.propertyType === type);
          }
        }
        setData(mappedData);
        setFilteredData(finalData);
        setTotal(finalData.length);
        setShowMockBadge((prev) => prev || !!res?.mockData || !!res?.isMock);

        if (finalData.length > 0) {
          handleClickProperty(finalData[0]);
        }
      } else if (success && Array.isArray(responseData)) {
        setData(responseData);
        setFilteredData(responseData);
        setTotal(responseData.length);
      } else {
        setData([]);
        setFilteredData([]);
        setTotal(0);
      }
      loader(false);
    });
  };
  useEffect(() => {
    setShowMockBadge(isGuestMode());
  }, []);

  const handleTypeChange = (value) => {
    setType(value);
    setName("");
    setFilters((prev) => ({ ...prev, page: 1 }));
    setFilteredData([]);
    setData([]);
    setTotal(0);
    setSelectedProperty(null);
    setCards([]);
    setTotalCard(0);
    setOfferStatus(false);
    setApplicationAccepted(false);
  };

  useEffect(() => {
    getData({ page: 1 });
  }, [user?._id]);

  useEffect(() => {
    getData({ page: 1 });
  }, [type]);

  useEffect(() => {
    if (selectedProperty) {
      getCards(selectedProperty?._id, selectedProperty);
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
                {t("project.myProject")}<span className="mx-[4px]">|</span>
              </li>
              <li className="text-[#47525E] cursor-pointer capitalize font-[600]">
                {t("transactionOwner.ownerTransactionManagement")}
              </li>
            </ul>
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-black max-w-lg mx-auto font-bold text-2xl text-center ">
                {t("transactionOwner.monitorTransactions")}
              </h2>
              {showMockBadge && (
                <span className="inline-flex items-center rounded-full bg-[#F4E6FF] text-[#5B21B6] px-3 py-1 text-[13px] font-semibold">
                  Données fictives
                </span>
              )}
            </div>
            {process.env.NODE_ENV !== 'production' && debugInfo ? (
              <div className="mt-4 p-3 rounded-lg bg-[#f9f9f9] border border-[#ddd] text-sm text-[#333]">
                <div className="font-semibold mb-2">Debug</div>
                <pre className="whitespace-pre-wrap break-words text-xs">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            ) : null}

            <div className="grid grid-cols-12 gap-5 mt-10 mb-16">
              <div className="lg:col-span-6 col-span-full">
                <div className="bg-[#976dd03b] p-4 rounded-[12px] flex md:items-center items-start md:flex-row flex-col md:gap-8 gap-4">
                  <div>
                    <h4 className="text-black font-[600] mb-1">
                      {t("transactionOwner.closeExternalTitle")}
                    </h4>
                    <p className="text-[#525252] text-[14px] xl:h-[100%] lg:h-[105px] h-[100%]">
                      {t("transactionOwner.closeExternalDescription")}
                    </p>
                  </div>
                  <div>
                    <Link
                      to={`/property1`}
                      className="inline-flex justify-center text-white bg-[#976DD0] rounded-[35px] px-2 py-2 w-[140px] text-[14px]"
                    >
                      {t("transactionOwner.importProperty")}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 col-span-full">
                <div className="bg-[#976dd03b] p-4 rounded-[12px] flex md:items-center items-start md:flex-row flex-col md:gap-8 gap-4">
                  <div>
                    <h4 className="text-black font-[600] mb-1">
                      {t("transactionOwner.sellAloneTitle")}
                    </h4>
                    <p className="text-[#525252] text-[14px] xl:h-[100%] lg:h-[105px] h-[100%]">
                      {t("transactionOwner.sellAloneDescription")}
                    </p>
                  </div>
                  <div>
                    <button className="text-white bg-[#976DD0] rounded-[35px] px-2 py-2 w-[140px] text-[14px]">
                      {t("transactionOwner.seeServices")}
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
                setType={handleTypeChange}
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                name={name}
                setName={setName}
                total={total}
                data={data}
                textChange={textChange}
                handlePageChange={handlePageChange}
                isGuest={isGuestMode()}
              />

              {ownerPlan ? (
                <div className="lg:col-span-8 md:col-span-6 col-span-12 md:mt-0 mt-8">
                  {offerStatus || applicationAccepted ? (
                    <>
                      <div className="col-span-full py-6">
                        <div className="text-center mb-3 font-[600] text-[18px]">
                            {t("transactionOwner.congratulations")}{" "}
                          {selectedProperty?.propertyType == "rent"
                              ? t("transactionOwner.renter")
                              : t("transactionOwner.buyer")}
                            {"!"}
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
                    {t("transactionOwner.unlockTool")}
                  </p>
                  <div className="mx-auto w-[170px] mb-10">
                    <button
                      onClick={() => navigate("/plan")}
                      className="text-white bg-[#976DD0] rounded-[50px] px-5 py-2 mx-auto"
                    >
                      {t("transactionOwner.choosePlan")}
                    </button>
                  </div>
                  <div className="flex flex-col justify-center mx-auto w-[60%]">
                    <h5 className="text-[#47525E] font-[600] mb-5">
                      {t("transactionOwner.nativeFeaturesTitle")}
                    </h5>
                    <ul>
                      <li className="flex items-start my-2">
                        <div className="bg-[#73339B] text-white w-[20px] h-[20px]  rounded-full me-2 shrink-0">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          {t("transactionOwner.nativeFeatures.educationalContent")}
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-[#73339B] text-white w-[20px] h-[20px]  rounded-full me-2 shrink-0">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          {t("transactionOwner.nativeFeatures.filterCandidates")}
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-[#73339B] text-white w-[20px] h-[20px]  rounded-full me-2 shrink-0">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          {t("transactionOwner.nativeFeatures.financialBackground")}
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-[#73339B] text-white w-[20px] h-[20px]  rounded-full me-2 shrink-0">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          {t("transactionOwner.nativeFeatures.autoInvite")}
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-[#73339B] text-white w-[20px] h-[20px]  rounded-full me-2 shrink-0">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          {t("transactionOwner.nativeFeatures.manageVisits")}
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-[#73339B] text-white w-[20px] h-[20px]  rounded-full me-2 shrink-0">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          {t("transactionOwner.nativeFeatures.autoSendPropertyFile")}
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-[#73339B] text-white w-[20px] h-[20px]  rounded-full me-2 shrink-0">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          {t("transactionOwner.nativeFeatures.receiveCandidatesFiles")}
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-[#73339B] text-white w-[20px] h-[20px]  rounded-full me-2 shrink-0">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          {t("transactionOwner.nativeFeatures.receivePurchaseOffer")}
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col justify-center mx-auto w-[60%]">
                    <h5 className="text-[#47525E] font-[600] my-8">
                      {t("transactionOwner.partnerServicesTitle")}
                    </h5>
                    <ul>
                      <li className="flex items-start my-2">
                        <div className="bg-black text-white w-[20px] h-[20px]  rounded-full me-2">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          {t("transactionOwner.partnerServices.writingProfile")}
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-black text-white w-[20px] h-[20px]  rounded-full me-2">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          {t("transactionOwner.partnerServices.professionalPictures")}
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-black text-white w-[20px] h-[20px]  rounded-full me-2">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          {t("transactionOwner.partnerServices.financialCheck")}
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-black text-white w-[20px] h-[20px]  rounded-full me-2">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          {t("transactionOwner.partnerServices.hostVisits")}
                        </p>
                      </li>
                      <li className="flex items-start my-2">
                        <div className="bg-black text-white w-[20px] h-[20px]  rounded-full me-2 shrink-0">
                          <IoMdCheckmark className=" w-full h-full p-[2px] font-[600] " />
                        </div>

                        <p className="text-[#47525E] text-[15px]">
                          {t("transactionOwner.partnerServices.legalTasks")}
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
    </PageLayout>
  );
};

export default RealEstateTransactionOwner;
