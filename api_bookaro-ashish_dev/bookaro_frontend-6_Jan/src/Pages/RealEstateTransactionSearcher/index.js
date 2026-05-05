import { useEffect, useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { MdFolderOpen } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import LeadCards from "./LeadCards";

const RealEstateTransactionSearcher = () => {
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

  const tabs = [
    { name: "All", value: "" },
    { name: "Purchase", value: "sale" },
    { name: "Rental", value: "rent" },
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
      head: "Manage buyer file",
      subHead: "10 documents added",
      icon: (<MdFolderOpen className="text-white" />),
      toggle: false,
    },
    {
      head: "Seller files",
      subHead: "10 documents added",
      icon: (<MdFolderOpen className="text-white" />),
      toggle: false,
    },
  ]

  return (
    <PageLayout>
    <div className="  pt-14 lg:pt-16 pb-[100px]  bg-[#f2ecf8] relative">
      <div className="container   px-8 mx-auto xl:px-5 h-full ">
        <div className="lg:max-w-[1200px] mx-auto max-w-[100%] w-[100%]">
          <ul className="flex items-center pb-[50px] md:text-[16px] sm:text-[14px] text-[13px]">
            <li
              onClick={() => navigate("/project")}
              className="text-[#47525E] cursor-pointer after"
            >
              My Project<span className="mx-[4px]">|</span>
            </li>
            <li className="text-[#47525E] cursor-pointer capitalize font-[600]">
              Home-seeker transaction management
            </li>
          </ul>
          <h2 className="text-black max-w-lg mx-auto font-bold text-2xl text-center ">
            Monitor your real-estate transactions
          </h2>

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
                  <div className="md:col-span-6 col-span-full relative cursor-pointer flex md:mb-0 mb-3 " >
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
  </PageLayout>
  );
};

export default RealEstateTransactionSearcher;
