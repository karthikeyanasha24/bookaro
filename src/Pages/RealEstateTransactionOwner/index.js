import { useEffect, useMemo, useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import { useTranslation } from "react-i18next";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
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
console.log(offerStatus, "offerStatus")
  const [applicationAccepted, setApplicationAccepted] = useState(false);
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
        let instersLength = activePlan?.activePlan?.[0]?.numberOfInterest || 0;
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
                {t("project.myProject")}<span className="mx-[4px]">|</span>
              </li>
              <li className="text-[#47525E] cursor-pointer capitalize font-[600]">
                {t("transactionOwner.ownerTransactionManagement")}
              </li>
            </ul>
            <h2 className="text-black max-w-lg mx-auto font-bold text-2xl text-center ">
              {t("transactionOwner.monitorTransactions")}
            </h2>

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
