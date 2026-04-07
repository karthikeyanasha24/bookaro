import { useEffect, useState } from "react";
import { IoCheckmarkSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { capLetter, formatCurrency } from "../../models/string.model";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../components/common/Modal/LoginModal";
import { active_plan_success } from "../../actions/activePlan";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

const Plan = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log(user,"user.////")
  const activePlan = useSelector((state) => state.activePlan);
  const [loginModal, setloginModal] = useState(false);
  const [freeTrail, setfreeTrail] = useState(false);
  const [planId, setplanId] = useState("");
  const [isMonthly, setIsMonthly] = useState(true);
  const [active, setActive] = useState(0);
  const [plans, setPlans] = useState([]);

  const currPlan = activePlan?.[0]?._id || "67b5c88c2376e1165d775914";
  const handleGetStarted = (plan, text) => {
    if (user.loggedIn) {
      setplanId(plan?._id)
      if (((user?.trialUserForPlan == null || user?.trialUserForPlan == "" || !user?.trialUserForPlan) && plan?.planType != "free")) {
        setfreeTrail(true)
      } else {
        setplanId("")
        return navigate(`/card-detail?id=${plan?._id}&isMonthly=${isMonthly}&upgrade=${text == "Upgrade Plan" ? "yes" : "no"}`);
      }
    } else {
      setloginModal(true);
    }

    return;
    const payload = {
      userId: user?.id,
      amount: plan?.pricing[isMonthly ? 0 : 1]?.unit_amount,
      currency: "eur",
      planId: plan?._id,
      planType: "paid",
      interval: isMonthly ? "month" : "year",
    };
    loader(true);
    ApiClient.post("payment/stripePay", payload)
      .then((res) => {
        if (res.success) {
          if (res?.checkoutUrl) {
            window.open(res.checkoutUrl, "_blank");
            loader(false);
          }
        } else {
          console.error("Payment failed:", res?.message);
        }
      })
      .catch((err) => {
        console.error("Payment error:", err);
      });
  };

  const freeTrailFunc = () => {
    loader(true);
    const payload = {
      userId: user?.id || user?._id,
      planId: planId
    }
    ApiClient.post("payment/trial/purchase", payload).then((res) => {
      if (res.success) {
        getData()
        setplanId("")
        setfreeTrail(false)
      }
      loader(false);
    });
  }

  const getData = (p = {}) => {
    loader(true);
    ApiClient.get("plan/listing").then((res) => {
      if (res.success) {
        const sortedPlans = res.data.sort(
          (a, b) => a.pricing[0].unit_amount - b.pricing[0].unit_amount
        );
        const images = [
          {
            active: "/assets/img/transaction/half-star.png",
            inactive: "/assets/img/transaction/half-star-w.png",
          },
          {
            active: "/assets/img/transaction/magic.png",
            inactive: "/assets/img/transaction/magic-w.png",
          },
          {
            active: "/assets/img/transaction/verification.png",
            inactive: "/assets/img/transaction/verification-w.png",
          },
          {
            active: "/assets/img/transaction/tie.png",
            inactive: "/assets/img/transaction/tie-w.png",
          },
          {
            active: "/assets/img/transaction/office.png",
            inactive: "/assets/img/transaction/office-w.png",
          },
        ];
        const data = sortedPlans.map((dat, index) => {
          return {
            ...dat,
            image: images[index] || "",
          };
        });

        setPlans(data);
      }
      loader(false);
    });
  };
  useEffect(() => {
    getData();
  }, []);

  const planClick = (plan, text = "") => {
    if (text == "Upgrade Plan" || text == "Get Started") handleGetStarted(plan, text);
  };

  const ActivePlan = (itm) => {
    let result = false;
    let type = isMonthly ? "month" : "year";
    if (activePlan?.[0]?._id === itm?._id && type == activePlan?.[0]?.interval) {
      result = true;
    } else {
      result = false;
    }
    return result;
  };

  const cancelPlan = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to cancel this plan`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1E5DBC",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true);
        ApiClient.delete(
          `subscription/delete?userId=${user?._id || user?.id}`
        ).then((res) => {
          if (res.success) {
            toast.success(res.message);
            getData();
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
          }
          loader(false);
        });
      }
    });
  };

  return (
    <PageLayout>
      <LoginModal loginModal={loginModal} setloginModal={setloginModal} />
      <div className="bg-[#976dd021]">
        <div className="container mx-auto py-14 px-8 h-full">
          <h2 className="text-black max-w-lg mx-auto font-bold text-2xl text-center">
            Choose the plan that will turn your real estate project into a
            stress-free journey
          </h2>
          <div className="flex items-center space-x-3 justify-center mt-16 mb-1">
            <span
              className={`text-sm text-[#5A6978] ${isMonthly ? "font-bold" : "font-normal"
                }`}
            >
              Monthly
            </span>
            <div
              className={`w-10 h-5 flex items-center  rounded-full p-1 cursor-pointer transition-all duration-300 ${isMonthly ? "bg-black" : "bg-gray-400"
                }`}
              onClick={() => setIsMonthly(!isMonthly)}
            >
              <div
                className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-all duration-300 ${isMonthly ? "translate-x-0" : "translate-x-5"
                  }`}
              ></div>
            </div>
            <span
              className={`text-sm text-[#5A6978] ${!isMonthly ? "font-bold" : "font-normal"
                }`}
            >
              Annually
            </span>
          </div>
          <p className="text-[#5A6978] text-center mb-8">
            Save 20% with annual plan paid in one go.
          </p>
          <div className="p-[20px] bg-[#976dd091] rounded-[40px]">
            <div className="grid grid-cols-12 plan-sect ">
              {plans
                ?.filter((itm) => itm?.name?.toLowerCase() != "enterprice")
                ?.slice(0, 4)
                ?.map((pln, i, arr) => {
                  // if (i === 1) console.log("i=", pln);

                  let cls = ["", "", "", ""];
                  if (active === 0) {
                    cls[1] =
                      "rounded-tl-[30px] lg:rounded-bl-[30px] lg:rounded-tr-[0px]  rounded-tr-[30px]";
                    cls[2] =
                      "lg:rounded-tl-[0px] lg:rounded-bl-[0px] md:rounded-tl-[30px] md:rounded-bl-[30px] rounded-tl-[0px] rounded-bl-[0px";
                    cls[3] =
                      "lg:rounded-tr-[30px] rounded-br-[30px] md:rounded-tr-[0px] md:rounded-bl-[0px] rounded-bl-[30px]";
                  } else if (active === 1) {
                    cls[0] =
                      "lg:rounded-[30px] md:rounded-bl-[0px] md:rounded-br-[0px] md:rounded-tl-[30px] md:rounded-tr-[30px] rounded-[30px]";
                    cls[2] =
                      "lg:rounded-tl-[30px] md:rounded-bl-[30px] rounded-bl-[0px] md:rounded-tl-[0px] rounded-tl-[30px] md:rounded-tr-[0px] rounded-tr-[30px]";
                    cls[3] =
                      "md:rounded-tr-[30px] rounded-br-[30px] rounded-tr-[0px] md:rounded-bl-[0px] rounded-bl-[30px]";
                  } else if (active === 2) {
                    cls[0] =
                      "rounded-tl-[30px] md:rounded-bl-[30px]  rounded-bl-[0px] rounded-tr-[30px] md:rounded-tr-[0px]";
                    cls[1] =
                      "md:rounded-tr-[30px] rounded-tr-[0px] lg:rounded-br-[30px] md:rounded-br-[0px] rounded-br-[30px] md:rounded-bl-[0px] rounded-bl-[30px]";
                    cls[3] =
                      "lg:rounded-[30px] md:rounded-tl-[0px] md:rounded-tr-[0px] md:rounded-bl-[30px] md:rounded-br-[30px] rounded-[30px]";
                  } else if (active === 3) {
                    cls[0] =
                      "rounded-tl-[30px] lg:rounded-bl-[30px] md:rounded-bl-[0px] md:rounded-tr-[0px] rounded-tr-[30px]";
                    cls[1] =
                      "lg:rounded-tr-[0px] lg:rounded-br-[0px] md:rounded-tr-[30px] md:rounded-br-[30px] rounded-tr-[0px] rounded-br-[0px]";
                    cls[2] =
                      "lg:rounded-tr-[30px] md:rounded-tr-[0px] lg:rounded-bl-[0px] rounded-bl-[30px]  rounded-tr-[0px] rounded-br-[30px]";
                  }
                  let featureTypes = [
                    ...new Set(pln?.feature?.map((item) => item.featureType)),
                  ];
                  const currentIndex = arr?.findIndex(
                    (item) => item._id === currPlan
                  );
                  let buttonText = (!user?.trialUserForPlan && user?.freeTrialStatus === "pending") ? "3 Days Free Trail" : "Get started";
                  if (currentIndex === i) {
                    buttonText = (!user?.trialUserForPlan && user?.freeTrialStatus === "pending") ? "3 Days Free Trail" :"Current plan";
                  } else if (i < currentIndex || currentIndex == -1) {
                    buttonText = (!user?.trialUserForPlan && user?.freeTrialStatus === "pending") ? "3 Days Free Trail" :"Get Started"; // Downgrade
                  } else if (i > currentIndex) {
                    buttonText = (!user?.trialUserForPlan && user?.freeTrialStatus === "pending") ? "3 Days Free Trail" :"Upgrade Plan";
                  }

                  return (
                    <div
                      onClick={() => setActive(i)}
                      className={`${active === i ? "active" : "inactive"} 
                      ${cls[i]
                        } flex flex-col lg:col-span-3 md:col-span-6 col-span-full bg-white p-5 `}
                    >
                      <div className="flex items-center">
                        <div className="bg-white p-2 rounded-full w-[40px] h-[40px] black-icon">
                          <img
                            alt=""
                            src={
                              active === i
                                ? pln?.image?.active
                                : pln?.image?.inactive
                            }
                            className="w-[25px] "
                          />
                        </div>
                        <div className="bg-[#976DD0] p-2 rounded-full w-[40px] h-[40px] white-icon">
                          <img
                            alt=""
                            src={
                              active === i
                                ? pln?.image?.active
                                : pln?.image?.inactive
                            }
                            className="w-[25px] "
                          />
                        </div>
                        <h2 className="ms-3 text-[#5A6978] text-[16px] font-[600]">
                          {capLetter(pln?.name)}
                        </h2>
                      </div>
                      <div className=" ">
                        <h4 className="text-[#5A6978] font-[600] text-[24px] my-4">
                          {formatCurrency(
                            pln?.pricing?.[isMonthly ? 0 : 1]?.unit_amount
                          ) || 0}{" "}
                          €{" "}
                          <span className="text-[12px]">{` / ${isMonthly ? "Month" : "Year"
                            }`}</span>
                        </h4>
                        <p className="text-[#5A6978] text-[14px]">
                          {pln?.description}
                        </p>
                        {featureTypes?.map((featureType) => {
                          let name = "";
                          if (featureType === "home")
                            name = "Home seeker innovative features";
                          else if (featureType === "owner")
                            name = "Owner unique features";
                          else if (featureType === "sales-mandats")
                            name = "Sales mandats acquisition";
                          else if (featureType === "real-estate")
                            name = "Real-estate services";
                          return (
                            <>
                              <h5 className="text-[#5A6978] text-[14px] font-[600] my-2">
                                {name}
                              </h5>
                              <ul className="2xl:h-[130px] xl:h-[160px] lg:h-[240px]">
                                {pln?.feature
                                  ?.filter(
                                    (feat) => feat.featureType === featureType
                                  )
                                  ?.map((feat) => (
                                    <li className="flex items-start mb-[2px]">
                                      <img
                                        alt=""
                                        src="assets/img/transaction/dot.png"
                                        className="w-[10px] shrink-0 h-[10px] me-2 mt-[5px]"
                                      />
                                      <p className="text-[#5A6978] text-[14px]">
                                        {feat.name}
                                      </p>
                                    </li>
                                  ))}
                              </ul>
                            </>
                          );
                        })}
                      </div>
                      <div className="mt-auto">
                        <p className="text-[#000] text-[14px] text-center">
                          {currentIndex === i && "Your current plan"}
                        </p>
                        <div className="mx-auto max-w-[150px] my-2">
                          <button
                            // disabled={ActivePlan(pln)}
                            onClick={() => {

                              ActivePlan(pln)
                                ? cancelPlan(pln.id || pln._id)
                                : handleGetStarted(pln, buttonText);

                            }}
                            className={`mx-auto w-full bg-[#976DD0] p-2 rounded-[50px] text-white text-[14px] px-5`}
                          >
                            {pln?.planType == "free"
                              ? ActivePlan(pln) ? "Cancel Plan" : "Register for free"
                              : ActivePlan(pln)
                                ? "Cancel Plan"
                                : buttonText}
                          </button>
                        </div>
                        <p className="text-[#5A6978] text-[14px] text-center">
                          {pln?.planType == "free"
                            ? "No credit card required"
                            : "Cancel anytime"}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <h2 className="text-black max-w-xs mx-auto font-bold text-2xl text-center my-14">
            Here is in detail what you get with each plan.
          </h2>
          <div className="bg-white rounded-[15px] p-5  overflow-x-auto">
            <div className="xl:w-[100%] max-xl:w-[1000px] overflow-auto ">
              <ul className="flex  ">
                <li className="w-[30%]">
                  <ul>
                    <li className="text-[#343F4B] font-[600]  border-b-[2px] pb-[3px]  border-[#C6C9CC] h-[168px] flex  items-end pe-5 ">
                      Property seeker innovative features:
                    </li>
                    <li className="py-3 border-b border-[#DEDEDE] min-h-[103px] pe-5">
                      <h3 className="text-[#343F4B] text-[14px]">
                        Send message to owners of properties listed in Directory
                      </h3>
                      <p className="text-[#93969B] text-[12px]">
                        Create unique opportunities with properties that are not
                        for sale or rent.
                      </p>
                    </li>

                    <li className="py-3 border-b border-[#DEDEDE] min-h-[103px] flex items-center  pe-5">
                      <h3 className="text-[#343F4B] text-[14px] ">
                        Send message to owner of property listed for sale or
                        rent
                      </h3>
                    </li>
                    <li className="py-3 border-b border-[#DEDEDE] min-h-[103px]">
                      <h3 className="text-[#343F4B] text-[14px]">
                        Access to Off-Market properties
                      </h3>
                      <p className="text-[#93969B] text-[12px]">
                        Create unique opportunities with properties that are not
                        for sale or rent.
                      </p>
                    </li>
                    <li className="py-3 border-b border-[#DEDEDE] min-h-[103px]">
                      <h3 className="text-[#343F4B] text-[14px]">
                        Browse past transaction database
                      </h3>
                      <p className="text-[#93969B] text-[12px]">
                        Better understand real estate market price evolution.
                      </p>
                    </li>
                    <li className="py-3 border-b border-[#DEDEDE] min-h-[103px]">
                      <h3 className="text-[#343F4B] text-[14px]">
                        Browse buiding permits
                      </h3>
                      <p className="text-[#93969B] text-[12px]">
                        Be informed of construction works before buying a
                        property.
                      </p>
                    </li>
                    <li className="py-3  min-h-[103px]">
                      <h3 className="text-[#343F4B] text-[14px]">
                        Training on buying a property
                      </h3>
                      <p className="text-[#93969B] text-[12px]">
                        Secure your real estate project by getting prepared to
                        avoid pitfalls.
                      </p>
                      <span className="text-[#329A90] font-[600] text-[12px]">
                        Learn more about this feature
                      </span>
                    </li>
                  </ul>
                </li>
                {plans?.map((pln, i, arr) => {
                  const currentIndex = arr?.findIndex(
                    (item) => item._id === currPlan
                  );
                   let buttonText = (!user?.trialUserForPlan && user?.freeTrialStatus === "pending") ? "3 Days Free Trail" : "Get started";
                  if (currentIndex === i) {
                    buttonText = (!user?.trialUserForPlan && user?.freeTrialStatus === "pending") ? "3 Days Free Trail" :"Current plan";
                  } else if (i < currentIndex || currentIndex == -1) {
                    buttonText = (!user?.trialUserForPlan && user?.freeTrialStatus === "pending") ? "3 Days Free Trail" :"Get Started"; // Downgrade
                  } else if (i > currentIndex) {
                    buttonText = (!user?.trialUserForPlan && user?.freeTrialStatus === "pending") ? "3 Days Free Trail" :"Upgrade Plan";
                  }
                  return (
                    <li className="w-[14%]">
                      <ul>
                        <li className="border-b-[2px]  border-[#C6C9CC] pb-3">
                          <div className="bg-[#976DD0] p-2 rounded-full w-[40px] h-[40px] mx-auto block">
                            {pln.image?.inactive && (
                              <img
                                src={pln.image?.inactive}
                                className="w-[25px]"
                                alt="plan icon"
                              />
                            )}
                          </div>
                          <h4 className="text-[#5A6978] font-[600] mt-2 text-center">
                            {capLetter(pln?.name)}
                          </h4>
                          <p className="my-3  text-center text-[14px] font-[300] text-[#5A6978]">
                            <span className="font-medium">
                              {formatCurrency(
                                pln?.pricing?.[isMonthly ? 0 : 1]?.unit_amount
                              ) || 0}{" "}
                              €
                            </span>
                            {` /${isMonthly ? "Month" : "Year"}`}
                          </p>
                          {/* <div className="flex items-center justify-center">
                            <button className="bg-[#976DD0] text-white rounded-[50px] px-5 py-2 text-[14px] mx-auto">
                              {buttonText}
                            </button>
                          </div> */}
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => {
                                ActivePlan(pln)
                                  ? cancelPlan(pln.id || pln._id)
                                  : planClick(pln, buttonText);
                              }}
                              // disabled={ActivePlan(pln)}
                              className={`text-white rounded-[50px] px-5 py-2 text-[14px] mx-auto ${buttonText === "Current plan"
                                ? "bg-[#969faa8a]"
                                : buttonText === "Downgrade"
                                  ? "bg-[#5c5c5b]"
                                  : "bg-[#976DD0]"
                                }`}
                            >
                              {ActivePlan(pln) ? "Cancel Plan" : buttonText}
                            </button>
                          </div>
                        </li>
                        <li className="border-b border-[#DEDEDE] min-h-[103px] flex items-center justify-center text-[#343F4B] text-[14px]">
                          {pln?.otherDetails?.msgToDirectory?.key ===
                            "unlimited"
                            ? "Unlimited*"
                            : `${pln?.otherDetails?.msgToDirectory?.value || "0"
                            }/month`}
                        </li>
                        <li className="border-b border-[#DEDEDE] min-h-[103px] flex items-center justify-center text-[#343F4B] text-[14px]">
                          {pln?.otherDetails?.msgToSaleRent?.key === "unlimited"
                            ? "Unlimited**"
                            : `${pln?.otherDetails?.msgToSaleRent?.value || "0"
                            }/month`}
                        </li>
                        <li className="border-b border-[#DEDEDE] min-h-[103px] flex items-center justify-center text-[#343F4B] text-[14px]">
                          {pln?.otherDetails?.accessToOffMarketProps?.key ===
                            "unlimited" ? (
                            <IoCheckmarkSharp className="text-[#976DD0] text-[25px]" />
                          ) : (
                            `${pln?.otherDetails?.accessToOffMarketProps
                              ?.value || "0"
                            }/
                          ${pln?.role == "monthly" ? "Month" : "Year"}`
                          )}
                        </li>
                        <li className="border-b border-[#DEDEDE] min-h-[103px] flex items-center justify-center text-[#343F4B] text-[14px]">
                          {pln?.otherDetails?.browsePastTrans?.key ===
                            "unlimited" ? (
                            <IoCheckmarkSharp className="text-[#976DD0] text-[25px]" />
                          ) : (
                            `${pln?.otherDetails?.browsePastTrans?.value || "0"
                            } searches`
                          )}
                        </li>
                        <li className="border-b border-[#DEDEDE] min-h-[103px] flex items-center justify-center text-[#343F4B] text-[14px]">
                          {pln?.otherDetails?.browseBuildingPermits?.key ===
                            "unlimited" ? (
                            <IoCheckmarkSharp className="text-[#976DD0] text-[25px]" />
                          ) : null}
                        </li>
                        <li className=" border-[#DEDEDE] min-h-[103px] flex items-center justify-center text-[#343F4B] text-[14px]">
                          {pln?.otherDetails?.trainingOnBuying?.key ===
                            "unlimited" ? (
                            <IoCheckmarkSharp className="text-[#976DD0] text-[25px]" />
                          ) : null}
                        </li>
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-20 xl:w-[100%] w-[900px]">
              <h4 className="text-[#343F4B] font-[600]  border-b-[2px] pb-[3px]  border-[#C6C9CC] flex  items-end pe-5">
                Property seller innovative features:
              </h4>
              <ul className="flex ">
                <li className="w-[30%]">
                  <ul>
                    <li className="py-3 border-b border-[#DEDEDE] min-h-[103px] pe-5">
                      <h3 className="text-[#343F4B] text-[14px]">
                        Create property profiles under Sale, rental or Directory
                      </h3>
                      <p className="text-[#93969B] text-[12px]">
                        Property profiles are best way for advertizing, selling
                        or renting a property.
                      </p>
                    </li>

                    <li className="py-3 border-b border-[#DEDEDE] min-h-[103px]   pe-5">
                      <h3 className="text-[#343F4B] text-[14px] ">
                        List properties under Off-Market section
                      </h3>
                      <p className="text-[#93969B] text-[12px]">
                        Off-Market let you sell your property without committing
                        on the price.
                      </p>
                    </li>
                    <li className="py-3 border-b border-[#DEDEDE] min-h-[103px]">
                      <h3 className="text-[#343F4B] text-[14px]">
                        Message box
                      </h3>
                      <p className="text-[#93969B] text-[12px]">
                        Our internal message box letyou handle easily discussion
                        with leads.
                      </p>
                    </li>
                    <li className="py-3 border-b border-[#DEDEDE] xl:h-[88px] h-[100px]">
                      <h3 className="text-[#343F4B] text-[14px]">
                        Lead filtering
                      </h3>
                      <p className="text-[#93969B] text-[12px]">
                        Based on their financiability score limit access to your
                        property to specific leads.
                      </p>
                      <span className="text-[12px] text-[#329A90] font-[600]">
                        Learn more about this feature
                      </span>
                    </li>
                    <li className="py-3 border-b border-[#DEDEDE] xl:h-[88px] h-[100px]">
                      <h3 className="text-[#343F4B] text-[14px]">
                        Real-estate transaction monitoring tool
                      </h3>
                      <p className="text-[#93969B] text-[12px]">
                        Guide you at each step of your real-estate transaction
                      </p>
                      <span className="text-[12px] text-[#329A90] font-[600]">
                        Learn more about this feature
                      </span>
                    </li>
                    <li className="py-3 border-b border-[#DEDEDE] xl:h-[88px] h-[100px]">
                      <h3 className="text-[#343F4B] text-[14px]">
                        Training on selling your property
                      </h3>
                      <p className="text-[#93969B] text-[12px]">
                        Get prepared for each step of your selling process
                      </p>
                      <span className="text-[#329A90] font-[600] text-[12px]">
                        Learn more about this feature
                      </span>
                    </li>
                    <li className="py-3 border-b border-[#DEDEDE] xl:h-[88px] h-[100px]">
                      <h3 className="text-[#343F4B] text-[14px]">
                        Profile section
                      </h3>
                      <p className="text-[#93969B] text-[12px]">
                        Allow you to showcase your company and attract new leads
                      </p>
                      <span className="text-[#329A90] font-[600] text-[12px]">
                        Learn more about this feature
                      </span>
                    </li>
                    <li className="py-3 border-b border-[#DEDEDE] xl:h-[88px] h-[100px]">
                      <h3 className="text-[#343F4B] text-[14px]">
                        Leads level of financiability check
                      </h3>
                      <p className="text-[#93969B] text-[12px]">
                        Save time and move forward only with the right leads.
                      </p>
                      <span className="text-[#329A90] font-[600] text-[12px]">
                        Learn more about this feature
                      </span>
                    </li>
                  </ul>
                </li>
                {plans?.map((pln, i) => {
                  return (
                    <li className="w-[14%]">
                      <ul>
                        <li className="border-b border-[#DEDEDE] min-h-[103px] flex items-center justify-center text-[#343F4B] text-[14px]">
                          {pln?.otherDetails?.createPropProfileSaleRentDirectory
                            ?.key === "unlimited"
                            ? "Unlimited*"
                            : `${pln?.otherDetails
                              ?.createPropProfileSaleRentDirectory?.value ||
                            "0"
                            }`}
                        </li>
                        <li className="border-b border-[#DEDEDE] min-h-[103px] flex items-center justify-center text-[#343F4B] text-[14px]">
                          {pln?.otherDetails?.listPropAsOffMarket?.key ===
                            "unlimited" && (
                              <IoCheckmarkSharp className="text-[#976DD0] text-[25px]" />
                            )}
                        </li>
                        <li className="border-b border-[#DEDEDE] min-h-[103px] flex items-center justify-center text-[#343F4B] text-[14px]">
                          {pln?.otherDetails?.msgBox?.key === "unlimited" && (
                            <IoCheckmarkSharp className="text-[#976DD0] text-[25px]" />
                          )}
                        </li>
                        <li className="border-b border-[#DEDEDE] xl:h-[88px] h-[100px] flex items-center justify-center text-[#343F4B] text-[14px]">
                          {pln?.otherDetails?.leadFilter?.key ===
                            "unlimited" && (
                              <IoCheckmarkSharp className="text-[#976DD0] text-[25px]" />
                            )}
                        </li>
                        <li className="border-b border-[#DEDEDE] xl:h-[88px] h-[100px] flex items-center justify-center text-[#343F4B] text-[14px]">
                          {pln?.otherDetails?.realEstateMinitoring?.key ===
                            "unlimited" && (
                              <IoCheckmarkSharp className="text-[#976DD0] text-[25px]" />
                            )}
                        </li>
                        <li className="border-b border-[#DEDEDE] xl:h-[88px] h-[100px] flex items-center justify-center text-[#343F4B] text-[14px]">
                          {pln?.otherDetails?.trainingOnSelling?.key ===
                            "unlimited" && (
                              <IoCheckmarkSharp className="text-[#976DD0] text-[25px]" />
                            )}
                        </li>
                        <li className="border-b border-[#DEDEDE] xl:h-[88px] h-[100px] flex items-center justify-center text-[#343F4B] text-[14px]">
                          {pln?.otherDetails?.profileSection?.key ===
                            "unlimited" && (
                              <IoCheckmarkSharp className="text-[#976DD0] text-[25px]" />
                            )}
                        </li>
                        <li className="border-b border-[#DEDEDE] xl:h-[88px] h-[100px] flex items-center justify-center text-[#343F4B] text-[14px]">
                          {/* {pln?.otherDetails?.leadsLevel || ""} */}
                          {pln?.otherDetails?.leadsLevel?.key === "unlimited"
                            ? "Unlimited*"
                            : `${pln?.otherDetails?.leadsLevel?.value || "0"}`}
                        </li>
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="mt-20 xl:w-[100%] w-[900px]">
              <h4 className="text-[#343F4B] font-[600]  border-b-[2px] pb-[3px]  border-[#C6C9CC] flex  items-end pe-5">
                Sale your property with real-estate professional services suport
                but without the commision
              </h4>
              <ul className="flex ">
                <li className="w-[30%]">
                  <ul>
                    <li className="py-3 border-b border-[#DEDEDE] min-h-[103px] pe-5">
                      <h3 className="text-[#343F4B] text-[14px]">
                        Professional pictures
                      </h3>
                      <p className="text-[#93969B] text-[12px]">
                        Nice pictures increase the attractivity of your property
                        and thys its value
                      </p>
                    </li>

                    <li className="py-3 border-b border-[#DEDEDE] min-h-[103px]   pe-5">
                      <h3 className="text-[#343F4B] text-[14px] ">
                        Property profile design
                      </h3>
                      <p className="text-[#93969B] text-[12px]">
                        An appealing and well documented property profile
                        increase the value of your property
                      </p>
                    </li>
                    <li className="py-3 border-b border-[#DEDEDE] min-h-[103px]">
                      <h3 className="text-[#343F4B] text-[14px]">
                        Visits hosting
                      </h3>
                      <p className="text-[#93969B] text-[12px]">
                        Let our partners host your property visits and relax
                      </p>
                    </li>
                    <li className="py-3 border-b border-[#DEDEDE] xl:h-[88px] h-[100px]">
                      <h3 className="text-[#343F4B] text-[14px]">
                        Administrative files
                      </h3>
                      <p className="text-[#93969B] text-[12px]">
                        Let our partner gater all legal documents you need to
                        provide for the sale
                      </p>
                      <span className="text-[12px] text-[#329A90] font-[600]">
                        Learn more about this feature
                      </span>
                    </li>
                    <li className="py-3 border-b border-[#DEDEDE] xl:h-[88px] h-[100px]">
                      <h3 className="text-[#343F4B] text-[14px]">
                        Administrative support until final signing
                      </h3>
                      <p className="text-[#93969B] text-[12px]">
                        Relax and rendez-vous chez le notary for sale signing
                        our parner take care of the rest.
                      </p>
                      <span className="text-[12px] text-[#329A90] font-[600]">
                        Learn more about this feature
                      </span>
                    </li>
                  </ul>
                </li>
                <li className="w-[70%]">
                  <ul>
                    <li className="border-b border-[#DEDEDE] min-h-[103px] flex items-center justify-center font-[600] text-[#343F4B] text-[15px]">
                      Coming soon
                    </li>
                    <li className="border-b border-[#DEDEDE] min-h-[103px] flex items-center justify-center font-[600] text-[#343F4B] text-[15px]">
                      Coming soon
                    </li>
                    <li className="border-b border-[#DEDEDE] min-h-[103px] flex items-center justify-center font-[600] text-[#343F4B] text-[15px]">
                      Coming soon
                    </li>
                    <li className="border-b border-[#DEDEDE] xl:h-[88px] h-[100px] flex items-center justify-center font-[600] text-[#343F4B] text-[15px]">
                      Coming soon
                    </li>
                    <li className="border-b border-[#DEDEDE] xl:h-[88px] h-[100px] flex items-center justify-center font-[600] text-[#343F4B] text-[15px]">
                      Coming soon
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={freeTrail}
        onClose={() => setfreeTrail(false)}
        className="relative z-[9999]"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <DialogPanel className="max-w-md w-full bg-white rounded-[20px] mx-5">
            <DialogTitle className="p-6">
              <img src="assets/img/question.png" alt="" className="w-[100px] mx-auto" />
              <p className="border-b text-[#389D93] text-[18px] text-center pb-5 mt-5">
                This free offer is only valid for 3 days. After that, you need to purchase a plan.
              </p>
              <div className="pt-8  flex items-center justify-center">
                <Button onClick={() => freeTrailFunc()} className="btn btn-primary">
                  Ok
                </Button>
              </div>
            </DialogTitle>
          </DialogPanel>
        </div>
      </Dialog>
    </PageLayout>
  );
};

export default Plan;
