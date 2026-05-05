import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { LuTrash } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { capLetter, formatCurrency } from "../../models/string.model";
import AddNewCard from "./AddNewCard";
import { toast } from "react-toastify";
import { Button, Dialog } from "@headlessui/react";
import { active_plan_success } from "../../actions/activePlan";
import environment from "../../environment";

const stripePromise = environment?.stripe_public_key
  ? loadStripe(environment.stripe_public_key)
  : null;
// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CardDetail = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramId = searchParams.get("id");
  const isMonthly = searchParams.get("isMonthly") == "true";
  const isUpgrade = searchParams.get("upgrade");
  const [planData, setPlanData] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allCards, setAllCards] = useState([]);
  const primaryCard = allCards?.filter((itm) => itm?.isPrimary === true);

  const getCards = async () => {
    try {
      const res = await ApiClient.get("cards/list", {
        userId: user?._id,
      });
      if (res?.success) {
        setAllCards(res?.data);
      }
    } catch (err) {
      console.log("err", err);
    } finally {
    }
  };
  useEffect(() => {
    if (user?._id) getCards();
  }, [user?._id]);

  const deleteCard = async (cardId) => {
    loader(true);
    try {
      const res = await ApiClient.delete(
        "cards/deleteCard",
        {},
        {
          userId: user?._id,
          cardId,
        }
      );
      if (res?.success) {
        getCards();
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      loader(false);
    }
  };

  const handleCardSelect = async (cardId) => {
    // const selected = allCards.find((card) => card.cardId === cardId);
    // setSelectedCard(selected);
    try {
      const res = await ApiClient.post(
        "cards/status",
        // {},
        {
          userId: user?._id,
          id: cardId,
        }
      );
      if (res?.success) {
        getCards();
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const getPlanData = () => {
    loader(true);
    ApiClient.get("plan/detail", { id: paramId })
      .then((res) => {
        if (res.success) {
          setPlanData(res?.data);
        }
      })
      .catch((er) => { })
      .finally(() => loader(false));
  };
  useEffect(() => {
    getPlanData();
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);

  const submit = () => {
    if (!primaryCard)
      return toast.error("Please select a primary card to make payment");
    const payload = {
      userId: user?.id || user?._id,
      amount: planData?.pricing[isMonthly ? 0 : 1]?.unit_amount,
      currency: "eur",
      planId: planData?._id,
      planType: planData?.planType,
      interval: isMonthly ? "month" : "year",
    };
    let url = "payment/stripePay"
    let method = "post"
    if (isUpgrade == "yes") {
      url = "payment/plan-update"
      method = "put"
    }
    loader(true);
    ApiClient.allApi(url, payload, method)
      .then((res) => {
        // console.log("res", res)
        if (res.success) {
          toast.success(res?.message);
          open();
          setTimeout(() => {
            ApiClient.get(
              "user/activeplan",
              { userId: user._id || user.id },
              "",
              true
            ).then((res) => {
              if (res.success) {
                dispatch(active_plan_success(res.data));
              }
            }).catch((error) => {
              dispatch(active_plan_success(""));
            });
          }, 100);
        } else {
          console.error("Payment failed:", res?.message);
        }
      })
      .catch((err) => {
        console.error("Payment error:", err);
      })
      ?.finally(() => loader(false));
  };

  return (
    <PageLayout>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative">
            {stripePromise ? (
              <Elements stripe={stripePromise}>
                <AddNewCard
                  onClose={() => setIsModalOpen(false)}
                  getCards={getCards}
                />
              </Elements>
            ) : (
              <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded">
                Stripe is not configured. Set <code>REACT_APP_STRIPE_PUBLIC_KEY</code> in <code>.env</code>.
              </div>
            )}
          </div>
        </div>
      )}

      {/* <Button
        onClick={open}
        className="rounded-md bg-blue-500 py-2 px-4 text-sm font-medium text-white focus:outline-none hover:bg-blue-600"
      >
        Purchase Plan
      </Button> */}

      {/* Modal Dialog */}
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10"
        onClose={() => {
          navigate("/plan");
        }}
      >
        <div
          className={`fixed inset-0 bg-black/30 z-20 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
            }`}
        ></div>

        <div className="fixed inset-0 z-30 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel
              transition
              className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out transform transition-all"
            >
              <div className=" mb-4 rounded-md overflow-hidden">
                <img
                  src="assets/img/plan-purchase.svg" // Replace with an actual exciting success image
                  alt="Plan Purchase Success"
                  className="w-[80px] mx-auto block"
                />
              </div>

              <Dialog.Title
                as="h3"
                className="text-xl font-semibold text-black text-center"
              >
                Plan Purchased Successfully!
              </Dialog.Title>

              <div className="mt-4 text-center text-sm text-black/75">
                <p>
                  Congratulations! Your plan has been successfully purchased.
                  You are all set to enjoy all the benefits of your new plan.
                  We’re excited to have you on board!
                </p>

                <div className="text-center mt-3">
                  <button
                    onClick={() => navigate("/plan")}
                    className="bg-[#976DD0] text-[14px] rounded-[50px] py-[6px] px-[14px] text-white font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
      <div className="bg-[#976dd021]">
        <div className="container mx-auto py-14 px-8">
          <div className="lg:max-w-[1200px] mx-auto max-w-[100%] w-[100%]">
            <ul className="flex items-center pb-[50px] md:text-[16px] text-[14px]">
              <li
                onClick={() => navigate("/plan")}
                className="text-[#47525E] cursor-pointer after"
              >
                My Plan<span className="mx-[4px]">|</span>
              </li>
              <li className="text-[#47525E] cursor-pointer capitalize font-[600]">
                Purchase Plan
              </li>
            </ul>
            <h2 className="text-black max-w-lg mx-auto font-bold text-2xl text-center ">
              Fill Card details and make a payment
            </h2>
            <div className="bg-white p-5 rounded-[8px] mt-10">
              <div class="">
                <div class="bg-white md:p-8  p-4">
                  <div>
                    <h2 class="text-[18px] font-semibold  text-gray-700 mb-4 mt-5 tracking-[1.23px]">
                      Your Plan Details
                    </h2>
                    <div className="border rounded-[8px] grid grid-cols-12">
                      <div className=" col-span-full">
                        <div className="bg-white  rounded-[12px]  ">
                          <div className="p-5 bg-[#976dd021]">
                            <div className="flex justify-between items-center md:flex-row flex-col">
                              <div className="flex items-center sm:flex-row flex-col">
                                <div className="flex items-center">
                                  <div className="bg-[#976DD0]  rounded-full w-[40px]">
                                    <img
                                      alt=""
                                      src="/assets/img/transaction/magic-w.png"
                                      className="w-[40px] p-2 shrink-0"
                                    />
                                  </div>
                                  <h4 className="text-[#5A6978] text-[18px] font-[600] ms-3">
                                    {capLetter(planData?.name, "")}
                                  </h4>
                                </div>
                                <p className="bg-white text-[#5A6978] rounded-[7px] text-[14px] px-3 py-1 sm:ms-4 ms-0 sm:mt-0 mt-2">
                                  {isMonthly ? "Monthly" : "Yearly"}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-[#5A6978] font-[600] text-[20px]">
                                  {formatCurrency(
                                    planData?.pricing?.[isMonthly ? 0 : 1]
                                      ?.unit_amount
                                  ) || 0}{" "}
                                  €{" "}
                                  <span className="font-[400] text-[13px]">
                                    {` / ${isMonthly ? "Month" : "Year"}`}
                                  </span>
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between sm:items-center mb-4 mt-10 sm:flex-row flex-col items-start">
                    <h2 class="text-[18px] font-semibold  text-gray-700  tracking-[1.23px]">
                      Card Details
                    </h2>
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        // setSelectedCard(null)
                        // setCard({ id: 0, number: "", name: "", date: "", cvv: "", })
                      }}
                      className="py-2  bg-[#976DD0] text-white rounded-md font-semibold hover:bg-transparent hover:text-[#976DD0] hover:border-[#976DD0] border border-transparent px-6  flex items-center sm:mt-0 mt-3"
                    >
                      <FaPlus className="me-2" />
                      Add New Card
                    </button>
                  </div>
                  <div className="grid grid-cols-12 gap-5">
                    <div className=" col-span-full">
                      <div className="rounded-[12px] border p-3">
                        <div className="grid grid-cols-12 gap-4 ">
                          {allCards?.length > 0 ? (
                            allCards?.map((cardData) => (
                              <div className="lg:col-span-4 col-span-full group relative hover:bg-gray-200  border border-[#B8B9BB] bg-white  p-3 rounded-[8px] cursor-pointer">
                                <div
                                  key={cardData.cardId}
                                  className={` flex justify-between items-center ${selectedCard?.id === cardData.id
                                    ? ""
                                    : "bg-blue-100"
                                    }`}
                                  onClick={() => handleCardSelect(cardData._id)}
                                >
                                  <div className="flex items-center">
                                    <div className="me-4">
                                      <img
                                        alt=""
                                        src="/assets/img/visa.png"
                                        className="w-[35px] p-1 rounded-[5px] border border-[#AAADB1]"
                                      />
                                    </div>
                                    <div>
                                      <h4 className="text-[#5A6978] font-[600] text-[13px]">{`Card ends with ${cardData.last4}`}</h4>
                                      <p className="text-[#5A6978] font-[400] text-[13px]">
                                        Expiring in{" "}
                                        {`${cardData.exp_month}/${cardData.exp_year}`}
                                      </p>
                                    </div>
                                  </div>
                                  <input
                                    type="radio"
                                    checked={cardData?.isPrimary}
                                    onChange={() =>
                                      handleCardSelect(cardData.cardId)
                                    }
                                    className="cursor-pointer"
                                  />
                                </div>
                                {!cardData?.isPrimary && (
                                  <div
                                    onClick={() => deleteCard(cardData.cardId)}
                                    className="group-hover:absolute group-hover:top-1/2 group-hover:left-1/2 hidden group-hover:flex group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 bg-[#976DD0] text-white rounded-full p-2  cursor-pointer"
                                  >
                                    <LuTrash />
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="col-span-full flex justify-center items-center flex-col py-6">
                              <img
                                src="assets/img/no-card.svg"
                                alt=""
                                className="w-[70px]"
                              />
                              <p className="text-[#5A6978] my-2">
                                No card added
                              </p>
                              {/* <p onClick={() => {
                                  setIsModalOpen(true);
                                }} className="text-[#976DD0] underline text-[14px] cursor-pointer">Add New card</p> */}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/*
                    <div className="lg:col-span-8 col-span-full">
                      <div className="grid grid-cols-12 gap-5 border p-5 rounded-[8px]">
                        <div className="lg:col-span-6 col-span-full">
                          <label htmlFor="cardNumber" className="block text-[15px] tracking-[.45px] mb-2 text-gray-600 font-[600]">
                            Card Number
                          </label>
                          <input
                            value={card.number}
                            onChange={(e) => handleChange("number", e.target.value, 16)}
                            maxLength={16}
                            type="number"
                            placeholder="0000 0000 0000 0000"
                            className="block w-full h-11 px-3 py-2.5 mb-3 rounded-md placeholder-gray-400 text-[#6c6c6c] w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                          {errors.number && <p className="text-red-500 text-xs">{errors.number}</p>}
                        </div>

                        <div className="lg:col-span-6 col-span-full">
                          <label htmlFor="cardName" className="block text-[15px] tracking-[.45px] mb-2 text-gray-600 font-[600]">
                            Cardholder Name
                          </label>
                          <input
                            value={card.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            type="text"
                            placeholder="John Doe"
                            className="block w-full h-11 px-3 py-2.5 mb-3 rounded-md placeholder-gray-400 text-[#6c6c6c] w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                        </div>

                        <div className="lg:col-span-6 col-span-full">
                          <label htmlFor="expiryDate" className="block text-[15px] tracking-[.45px] mb-2 text-gray-600 font-[600]">
                            Expiry Date
                          </label>
                          <input
                            value={card.date}
                            onChange={(e) => handleChange("date", e.target.value)}
                            type="month"
                            placeholder="ttt"
                            className="block w-full h-11 px-3 py-2.5 mb-3 rounded-md placeholder-gray-400 text-[#6c6c6c] w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                          {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
                        </div>

                        <div className="lg:col-span-6 col-span-full">
                          <label htmlFor="cvv" className="block text-[15px] tracking-[.45px] mb-2 text-gray-600 font-[600]">
                            CVV
                          </label>
                          <input
                            value={card.cvv}
                            onChange={(e) => handleChange("cvv", e.target.value, 3)}
                            type="number"
                            placeholder="123"
                            className="block w-full h-11 px-3 py-2.5 mb-3 rounded-md placeholder-gray-400 text-[#6c6c6c] w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                          {errors.cvv && <p className="text-red-500 text-xs">{errors.cvv}</p>}
                        </div>
                      </div>
                    </div> */}

                    <div className="col-span-full">
                      <button
                        onClick={submit}
                        className="py-2 bg-[#976DD0] text-white rounded-md font-semibold hover:bg-transparent hover:text-[#976DD0] hover:border-[#976DD0] border border-transparent px-6 ms-auto block"
                      >
                        Pay now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CardDetail;
