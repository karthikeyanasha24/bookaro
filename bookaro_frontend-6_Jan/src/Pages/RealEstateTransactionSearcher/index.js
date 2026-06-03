import { useEffect, useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { MdFolderOpen } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import { useTranslation } from "react-i18next";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import LeadCards from "./LeadCards";
import BuyerDocumentsModal from "./BuyerDocumentsModal";
import RenterDocumentsModal from "./RenterDocumentsModal";
import { isGuestMode } from "../../methods/guestMode";
import "../Dashboard/dashboard.css";

const RealEstateTransactionSearcher = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    buyerId: user?._id,
    interestUpdatedTime:true,
  });
  const [cards, setCards] = useState([]);
  const [totalCard, setTotalCard] = useState(0);
  const [buyerModalOpen, setBuyerModalOpen] = useState(false);
  const [renterModalOpen, setRenterModalOpen] = useState(false);

  const countDocs = (filesObj) => {
    if (!filesObj || typeof filesObj !== "object") return 0;
    return Object.values(filesObj).reduce(
      (acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0),
      0
    );
  };
  const buyerDocsCount = countDocs(user?.buyerFiles);
  const renterDocsCount = countDocs(user?.renterFiles);

  const tabs = [
    { name: t("buttons.all"), value: "" },
    { name: t("transactionSearcher.purchase"), value: "sale" },
    { name: t("transactionSearcher.rental"), value: "rent" },
  ];
  const [type, setType] = useState("");

  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1;
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const getCards = (f = {}) => {
    const dto = { ...filters, ...f };
    if (type) dto.propertyType = type;
    loader(true);
    ApiClient.get("interests/detail", dto).then((res) => {
      if (res.success) {
        setCards(res?.data);
        setTotalCard(res?.data?.length)
      } else {
        setCards([]);
      }
      loader(false);
    });
  };

  useEffect(() => {
    getCards();
  }, [type]);

  const manageLeads = [
    {
      head: t("transactionSearcher.manageBuyerFile"),
      subHead: t("transactionSearcher.documentsAdded", { count: buyerDocsCount }),
      icon: (<MdFolderOpen className="text-white" />),
      toggle: false,
      onClick: () => setBuyerModalOpen(true),
    },
    {
      head: "Dossier locataire",
      subHead: t("transactionSearcher.documentsAdded", { count: renterDocsCount }),
      icon: (<MdFolderOpen className="text-white" />),
      toggle: false,
      onClick: () => setRenterModalOpen(true),
    },
  ]

  return (
    <PageLayout>
    <div className="  pt-14 lg:pt-16 pb-[100px]  bg-[#f3f5f9] relative">
      <div className="container   px-8 mx-auto xl:px-5 h-full ">
        <div className="lg:max-w-[1200px] mx-auto max-w-[100%] w-[100%]">
          <div className="text-center mx-auto max-w-lg">
            <h2 className="text-black font-bold text-2xl">
              {t("transactionSearcher.monitorTransactions")}
            </h2>
            {isGuestMode() && (
              <div className="flex justify-center mt-4">
                <span className="dashboard-section-mock-badge inline-flex items-center justify-center px-3 py-1 rounded-full text-[12px] font-semibold text-[#7c4b00] bg-[#fff4dd] shadow-[0_4px_12px_rgba(249,179,71,0.18)] border border-[rgba(249,179,71,0.35)]">
                  Données fictives
                </span>
              </div>
            )}
          </div>

          {/* <div className="grid grid-cols-12 gap-5 mt-10 mb-16">
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
                  <button className="text-white bg-[#976DD0] rounded-[35px] px-2 py-2 w-[140px] text-[14px]">
                    Import property
                  </button>
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
          </div> */}

          <div className="grid grid-cols-12 mt-10 md:gap-8">
            <div className="col-span-12 md:mt-0 mt-8">
              <div className="grid grid-cols-12 md:gap-8 gap-0 mb-16 mx-auto max-w-[600px]">
                {manageLeads?.map((itm, i) => (
                  <div
                    key={i}
                    onClick={itm.onClick}
                    role={itm.onClick ? "button" : undefined}
                    tabIndex={itm.onClick ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (itm.onClick && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        itm.onClick();
                      }
                    }}
                    className="md:col-span-6 col-span-full relative cursor-pointer flex md:mb-0 mb-3 "
                  >
                    <div className=" w-full bg-white p-3 rounded-[12px] flex items-center">
                      <div className="bg-[#000000] w-[30px] h-[30px] rounded-full p-1 flex items-center justify-center md:-ms-7 ms-1 shrink-0">
                        {itm.icon}
                      </div>
                      <div className="ms-2">
                        <h5 className="text-[#47525E] text-sm font-semibold">
                          {itm.head}
                        </h5>
                        <p className="text-[12px] text-[#47525E]">
                          {itm.subHead}
                        </p>
                      </div>
                    </div>
                    <label className={`absolute md:-top-2 md:-right-1 right-3 top-1/2 md:translate-y-0 -translate-y-1/2 w-[20px] h-[20px]  rounded-full border-2 cursor-pointer flex items-center justify-center
                      ${itm?.toggle
                        ? "bg-[#73339B] border-[#73339B] p-[10px] "
                        : "bg-white border-gray-300 p-[10px]"
                      }`}
                    // onClick={(e) => {
                    // e.stopPropagation();
                    // setChecked(!checked);
                    // }}
                    >
                      {itm?.toggle && (
                        <span className="text-white text-lg">
                          <IoMdCheckmark />
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
              <LeadCards
                cards={cards}
                getCards={getCards}
                totalCard={totalCard}
                handlePageChange={handlePageChange}
                filters={filters}
                tabs={tabs}
                type={type}
                setType={setType}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
    <BuyerDocumentsModal open={buyerModalOpen} onClose={() => setBuyerModalOpen(false)} />
    <RenterDocumentsModal open={renterModalOpen} onClose={() => setRenterModalOpen(false)} />
  </PageLayout>
  );
};

export default RealEstateTransactionSearcher;
