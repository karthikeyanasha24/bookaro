import { Dialog } from "@headlessui/react";
import moment from "moment";
import { Fragment, useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineYoutube } from "react-icons/ai";
import { GoLightBulb } from "react-icons/go";
import { IoMdCheckmark } from "react-icons/io";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { capLetter, dateFormate } from "../../models/string.model";
import ImageSlider from "../../components/common/ImageSlider";
import { useSelector } from "react-redux";
import RenterCard from "./RenterCard";
import VisitSlotModal from "./VisitSlotModal";
import socket from "../../config/ChatSocket/socket";
import { buyerCurrentStatus } from "../../utils/shared.utils";
import BuyerCard from "./BuyerCard";
import datepipeModel from "../../models/datepipemodel";

const LeadCards = ({
  setOfferStatus = () => { },
  setApplicationAccepted = () => { },
  offerStatus = false,
  applicationAccepted = false,
  cards,
  setCards,
  selectedProperty,
  getCards,
  getData,
  setSelectedProperty,
  totalCard,
}) => {
  const { user } = useSelector((state) => state);
  const [isSlot, setIsSlot] = useState();
  const activePlan = useSelector((state) => state.activePlan);
  const visitSlots = useMemo(() => {
    const today = datepipeModel.datetostring(new Date().toISOString()); // Get today's date in YYYY-MM-DD format
    const upcomingSlots = selectedProperty?.visitSlots?.filter(
      (slot) => slot.date >= today
    );
    return upcomingSlots;
  }, [selectedProperty]);

  const [isOpencancel, setIsOpencancel] = useState(false);
  const [isOpenBook, setIsOpenBook] = useState(false);
  const [bookSlot, setBookSlot] = useState(null);
  const [offer, setOffer] = useState("");
  const [preSlot, setPreSlot] = useState(null);
  const [saleSlot, setSaleSlot] = useState(null);

  const [openTransfer, setOpenTransfer] = useState(false);
  const [transfer, setTransfer] = useState();

  const handleChange = (card, status, key, value) => {
    const filter = {
      interestId: card?._id,
      interestUpdatedTime: new Date(),
    };
    if (status) filter.funnelStatus = status;

    if (status == "visit accept by owner") {
      filter.ownerVisitDate = card.userVisitDate;
      filter.finalVisitDate = card.userVisitDate;
    } else if (status == "offer accept by owner") {
      filter.ownerPrice = card?.buyerPrice?.amount;
      filter.finalPrice = card?.buyerPrice?.amount;
      filter.offerStatus = true;
    } else if (status == "offer submit by owner") {
      filter.ownerPrice = offer;
    } else if (status == "preslot booked by owner") {
      const formattedDate = moment(preSlot, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      filter.ownerPresale = formattedDate;
    } else if (status == "preslot accept by owner") {
      filter.finalPresale = card.userPresale;
    } else if (status == "contract signed by owner") {
      filter.ownerSigned = true;
      filter.contractSigned = true;
    } else if (status == "saleslot booked by owner") {
      const formattedDate = moment(saleSlot, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      filter.ownerSale = formattedDate;
    } else if (status == "confirmation by owner") {
      filter.ownerConfirmation = true;
      filter.icon7 = true;
    }

    if (key === "ownerVisitDate") {
      const formattedDate = moment(value, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      filter[key] = formattedDate;
    }
    if (key === "documents") {
      filter[key] = value;
    }

    if (key && key?.startsWith("icon")) {
      filter[key] = true;
    }
    loader(true);
    ApiClient.put("interests/statusChange", filter).then((res) => {
      if (res.success) {
        getCards();
        setOpenAnsSlotModal(false);
        setIsOpenBook(false);
        setIsOpencancel(false);
        if (filter.offerStatus) setOfferStatus(true);
        if (
          filter.funnelStatus == "offer accept by owner" ||
          filter.funnelStatus == "offer refused by owner"
        ) {
          socket.emit("informUsers", {
            funnelStatus: filter.funnelStatus,
            interestId: filter.interestId,
          });
          ApiClient.post("interests/informUsers", {
            funnelStatus: filter.funnelStatus,
            interestId: filter.interestId,
            message: currentStatus(filter.funnelStatus, card),
          }).then((res) => { });
        }
      }
      loader(false);
    });
  };

  const currentStatus = (status, card) => {
    return buyerCurrentStatus(status, card);
  };

  const [openAnsSlotModal, setOpenAnsSlotModal] = useState(false);

  const saveSlots = async (visitS = [], toggle = false, card = null) => {
    let key = isSlot?.slotType || "visitSlots";
    const dto = {
      id: selectedProperty?._id,
      [key]: visitS || [],
    };
    loader(true);
    try {
      const res = await ApiClient.allApi("property/editProperty", dto, "put");
      if (res.success) {
        setIsSlot();
        setSelectedProperty((prev) => ({
          ...prev,
          [key]: dto?.[key],
        }));
        if (card) {
          let status = "owner changed the slot";
          if (key == "signingSlots")
            status = "owner changed the pre-signing slot";
          if (key == "homeInventorySlots")
            status = "owner changed the home inventory slot";
          if (isSlot?.type == "finalslot")
            status = "owner changed the final signing slot";

          handleChange(card, status);
        } else {
          getCards();
        }
      } else {
        console.error("Error saving slots:", res);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      loader(false);
    }
  };

  return (
    <div>
      <Dialog
        open={openTransfer}
        as="div"
        className="relative z-10"
        onClose={() => setOpenTransfer(false)}
      >
        <div
          className={`fixed inset-0 bg-black/10 z-20 transition-opacity duration-300 ${openTransfer ? "opacity-100" : "opacity-0"
            }`}
        ></div>
        <div className="fixed inset-0 z-30 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel
              transition
              className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out transform transition-all"
            >
              <div className="property_list">
                <ImageSlider images={transfer?.propertyImages} />
              </div>
              {/* <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                                <img
                                    src="assets/img/prop-one.jpg"
                                    alt="Property"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div> */}

              <Dialog.Title
                as="h3"
                className="text-lg font-medium text-black mt-3"
              >
                {capLetter(transfer?.propertyTitle || "property Title")}
              </Dialog.Title>
              <div className="mt-4 text-sm text-black/75">
                <div className="flex justify-between">
                  <span className="font-semibold">Transferred To:</span>
                  <span>
                    {" "}
                    {capLetter(
                      transfer?.findInterest?.buyerId?.fullName || "User"
                    )}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-semibold">Transferred By:</span>
                  <span>{capLetter(user?.fullName)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-semibold">Date of Transfer:</span>
                  <span>
                    {dateFormate(
                      transfer?.transferDate || new Date(),
                      "MMMM D, YYYY"
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <p className="font-semibold text-black">Review:</p>
                <p className="mt-2 text-sm text-black/50">
                  {transfer?.review ||
                    "This property is amazing! The location is perfect, and the amenities are top-notch. I couldn't be happier with the purchase."}
                </p>
              </div>

              {/* <div className="mt-6">
                                <Button
                                    className="bg-[#976DD0] text-[14px] rounded-[50px] py-[6px] px-[14px] text-white font-bold ml-auto flex justify-end"
                                // onClick={close}
                                >
                                    Submit
                                </Button>
                            </div> */}
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
      {cards && cards?.length > 0 ? (
        <div className="grid grid-cols-12 lg:gap-10 gap-0">
          {cards?.map((card, i) => {
            return (
              <Fragment key={card._id}>
                {card.propertyType == "rent" ? (
                  <RenterCard
                    card={card}
                    i={i}
                    totalCard={totalCard}
                    blurCardPlan={activePlan?.[0]?.numberOfInterest <= i}
                    applicationAccepted={applicationAccepted}
                    selectedProperty={selectedProperty}
                    propertyId={selectedProperty?.id || selectedProperty?._id}
                    setApplicationAccepted={setApplicationAccepted}
                    visitSlots={visitSlots}
                    result={(e) => {
                      if (e.event == "submitted") {
                        getCards();
                      }
                      if (e.value?.contractSigned) {
                        setSelectedProperty((prev) => ({
                          ...prev,
                          contractSigned: true,
                        }));
                      }
                      if (e.event == "renterTransfer") {
                        setSelectedProperty(null);
                        setCards([]);
                        getData();
                      }
                    }}
                    setIsSlot={setIsSlot}
                  />
                ) : (
                  <BuyerCard
                    card={card}
                    i={i}
                    blurCardPlan={activePlan?.[0]?.numberOfInterest <= i}
                    totalCard={totalCard}
                    selectedProperty={selectedProperty}
                    propertyId={selectedProperty?.id || selectedProperty?._id}
                    visitSlots={visitSlots}
                    offerStatus={offerStatus}
                    setOfferStatus={setOfferStatus}
                    result={(e) => {
                      if (e.event == "submitted") {
                        getCards();
                      }
                      if (e.value?.contractSigned) {
                        setSelectedProperty((prev) => ({
                          ...prev,
                          contractSigned: true,
                        }));
                      }
                      if (e.event == "transfered") {
                        setSelectedProperty(null);
                        setCards([]);
                        getData();
                      }
                    }}
                    setIsSlot={setIsSlot}
                  />
                )}
              </Fragment>
            );
          })}
        </div>
      ) : (
        <div>
          <div>
            <img
              src="assets/img/transaction/transaction2.png"
              alt=""
              className="w-[250px] rounded-[5px] mx-auto"
            />
          </div>
          <p className="text-black font-[600] text-[20px] text-center my-5 max-w-xs mx-auto">
            No lead to show for the moment, but be patient they won't be long !
          </p>
          <div className="mt-10">
            <p className="bg-white w-full h-[2px] max-w-md mx-auto"></p>
          </div>
          <div className="flex items-center justify-center mt-10">
            <GoLightBulb className="text-[24px] me-3" />
            <h3 className="text-[#343F4B] font-[700] text-[20px]">
              Selling alone training
            </h3>
          </div>
          <div className="p-3  border-[2px] border-[#976DD0] rounded-[12px] bg-white md:max-w-sm max-w-full mx-auto flex justify-between  my-6">
            <p className="text-[#47525E] md:text-[18px] md:w-[60%] text-[16px] w-[50%]">
              What to check before signing a sale contract?
            </p>
            <div className="flex items-center">
              <AiOutlineYoutube className="text-[30px] text-[#8492A6]" />
              <label
                className={` w-[25px] h-[25px]  ms-3 rounded-full border-2 cursor-pointer flex items-center justify-center
                                    ${true
                    ? "bg-[#73339B] border-[#73339B] p-[10px] "
                    : "bg-white border-gray-300 p-[10px]"
                  }`}
              >
                {true && (
                  <span className="text-white text-lg">
                    <IoMdCheckmark />
                  </span>
                )}
              </label>
            </div>
          </div>
          <div className="p-3  border-[2px] border-[#976DD0] rounded-[12px] bg-white md:max-w-sm max-w-full mx-auto flex justify-between">
            <p className="text-[#47525E] md:text-[18px] md:w-[60%] text-[16px] w-[50%]">
              How should this signature happen?
            </p>
            <div className="flex items-center">
              <AiOutlineYoutube className="text-[30px] text-[#8492A6]" />
              <label
                className={` w-[25px] h-[25px]  ms-3 rounded-full border-2 cursor-pointer flex items-center justify-center
                                    ${false
                    ? "bg-[#73339B] border-[#73339B] p-[10px] "
                    : "bg-white border-gray-300 p-[10px]"
                  }`}
              >
                {false && (
                  <span className="text-white text-lg">
                    <IoMdCheckmark />
                  </span>
                )}
              </label>
            </div>
          </div>
        </div>
      )}

      {isSlot ? (
        <>
          <VisitSlotModal
            closeModal={() => setIsSlot()}
            title={isSlot.title || "Manage Visit Slots"}
            visitSlot={isSlot?.visitSlots || visitSlots}
            propertyId={selectedProperty?.id || selectedProperty?._id}
            saveSlots={saveSlots}
            duration={isSlot?.duration}
            card={isSlot}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default LeadCards;
