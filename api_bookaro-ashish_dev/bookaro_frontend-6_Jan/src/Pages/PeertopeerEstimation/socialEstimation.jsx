import { useEffect, useMemo, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import socket from "../../config/ChatSocket/socket";
import PropSidebar from "./propsidebar";
import { FaPlus, FaUserCircle } from "react-icons/fa";
import { BsCircleFill } from "react-icons/bs";
import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";
import { LuArrowLeftRight, LuTrash } from "react-icons/lu";
import { CiCalendarDate } from "react-icons/ci";
import { Elements } from "@stripe/react-stripe-js";
import environment from "../../environment";
import {
  AiFillStar,
  AiOutlineDown,
  AiOutlineHeart,
  AiOutlineHome,
  AiOutlineStar,
  AiOutlineUser,
} from "react-icons/ai";
import * as echarts from "echarts";
import chart from "../../assets/chart";
import { toast } from "react-toastify";
import { FaRegStar, FaUser } from "react-icons/fa6";
import { GoDot, GoDotFill } from "react-icons/go";
import moment from "moment";
import AddNewCard from "../CardDetail/AddNewCard";
import { IoMdClose } from "react-icons/io";
import { login_success } from "../../actions/user";

const SocialEstimation = () => {
  const stripePromise = environment?.stripe_public_key
    ? loadStripe(environment.stripe_public_key)
    : null;
  const chartRef = useRef(null);
  const camppaginchartRef = useRef(null);
  const params = new URLSearchParams(window.location.search);
  const IsApp = params.get("isApp");
  const UserId = params.get("userId");
  const { user } = useSelector((state) => state);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allCards, setAllCards] = useState([]);
  // const activePlan = useSelector((state) => state.activePlan);
  const navigate = useNavigate();
  const ownerPlan = true;
  const [isOpen, setIsOpen] = useState(true);
  const [isOpen2, setIsOpen2] = useState(false);
  //  user?.planId && user?.planType == "paid" ? true : false;
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showCampaign, setShowCampaign] = useState(false);
  const [campaginId, setCampaginId] = useState("");
  const [cards, setCards] = useState([]);
  const [avarageePrice, setavaragePrice] = useState(0);
  const [rangeprice, setrangeprice] = useState();
  const [campagindata, setcampagindata] = useState([]);
  const [particularcampagindata, setparticularcampagindata] = useState([]);
  const [campagin, setcampagin] = useState({});
  const [campaginType, setcampaginType] = useState();
  const [campainavarageePrice, setcampainavarageePrice] = useState(0);
  const [campaginrangeprice, setcampaginrangeprice] = useState();
  const [segments, setsegments] = useState([]);
  const [bubbles, setbubbles] = useState([]);
  const [comapginsegments, setcomapginsegments] = useState([]);
  const [comapaginbubbles, setcomapaginbubbles] = useState([]);
  const [piecharts, setchart] = useState([]);
  const [comapaginpiecharts, setcomapaginpiecharts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPuchaseModule, setShowPuchaseModule] = useState(false);
  const [showRefrenceer, setShowRefrenceer] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  // console.log(selectedCard,"selectedCard")
  const dispatch = useDispatch();
  const [alertModal, setAlertModal] = useState(false)
  useEffect(() => {
    if (alertModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [alertModal]);
  const handleClickProperty = (item) => {
    if (!ownerPlan) return;
    let propertyId = item?._id;
    if (propertyId !== selectedProperty?._id) {
      setSelectedProperty(item);
    }

    const primaryCard = allCards?.filter((itm) => itm?.isPrimary === true);
    // socket.emit("activityIndicatorCount", { propertyId: propertyId });
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

  useEffect(() => {
    if (IsApp && UserId !== "") {
      const payload = {
        user_id: UserId
      };
      ApiClient.post("user/auto/loginbyid", payload).then((res) => {
        if (res.success) {
          localStorage.setItem("token", res?.data.access_token);
          dispatch(login_success(res?.data));
        }
        loader(false);
      });
    }
  }, [IsApp, UserId]);



  const getPaymentCards = async () => {
    try {
      const res = await ApiClient.get("cards/list", {
        userId: user?._id,
      });
      if (res?.success) {
        setAllCards(res?.data);
        const Primarycard = res?.data?.find((item) => item?.isPrimary)
        setSelectedCard(Primarycard?.id || Primarycard?._id)
      }
    } catch (err) {
      console.log("err", err);
    } finally {
    }
  };
  useEffect(() => {
    if (user?._id) getPaymentCards();
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
        getPaymentCards();
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      loader(false);
    }
  };

  const getCards = (propertyId = selectedProperty?._id, f = {}) => {
    if (!propertyId) return;
    const payload = {
      propertyId: propertyId,
      userId: user?.id || user?._id,
    };
    socket.emit("owner-total-campaign-results", payload);

    ApiClient.get(`peerCampaign/userCampaigns`, payload).then((res) => {
      if (res.success) {
        setcampagindata(res?.data);
      }
      loader(false);
    });
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
        getPaymentCards()
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    const newpayload = {
      propertyId: selectedProperty?._id,
      userReasonablePrice: avarageePrice,
    };
    socket.emit("lifetime-price-estimation", newpayload);
  }, [avarageePrice]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getpricesqm = (refprice) => {
    let price = parseInt(refprice || 0);
    let sur = parseInt(selectedProperty?.surface || 0);
    let perSqr = 0;
    if (sur > 0) {
      perSqr = price / sur;
    }
    return Number(perSqr.toFixed(2)) || 0;
  };

  const [filters, setFilters] = useState({
    page: 1,
    count: 10,
    interestUpdatedTime: true,
    userId: user?._id || UserId,
  });
  const [type, setType] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState("");
  const [form, setForm] = useState("");
  const formatNumberWithSpaces = (num) => {
    if (num === null || num === undefined || isNaN(num)) return "0";

    let str = parseInt(num, 10).toString();

    // First, take out last 3 digits
    let lastThree = str.slice(-3);
    let otherNumbers = str.slice(0, -3);

    if (otherNumbers !== "") {
      lastThree = " " + lastThree;
    }
    // Add spaces after every 2 digits in the remaining part
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, " ") + lastThree;
  };

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
    if (user?.loggedIn) {
      getData();
      scrollToTop();
    }
  }, [type, user?.loggedIn]);

  useEffect(() => {
    if (selectedProperty) {
      getCards(selectedProperty?._id);
      socket.on("owner-total-campaign-results", (res) => {
        const msg = res?.data;
        setCards(msg);
        setavaragePrice(msg?.estimationStats?.priceStats?.[0]?.avgPrice || 0);
        setchart([
          {
            value:
              res?.data?.estimationStats?.priceStats?.[0]
                ?.appropriateProperties || 0,
            name: "Appropriate",
          },
          {
            value:
              res?.data?.estimationStats?.priceStats?.[0]
                ?.expensiveProperties || 0,
            name: "Over Estimate",
          },
          {
            value:
              res?.data?.estimationStats?.priceStats?.[0]
                ?.underEstimatedProperties || 0,
            name: "Under Estimate",
          },
        ]);
        setsegments([
          {
            height: 300,
            color: "bg-purple-300",
            value1:
              res?.data?.estimationStats?.ratePropertyTitleCount?.find(
                (item) => item?._id == 1
              )?.count || 0,
            value2:
              res?.data?.estimationStats?.ratePropertyPicturesCount?.find(
                (item) => item?._id == 1
              )?.count || 0,
            value3:
              res?.data?.estimationStats?.rateInteriorDesignCount?.find(
                (item) => item?._id == 1
              )?.count || 0,
            value4:
              res?.data?.estimationStats?.rateLocationCount?.find(
                (item) => item?._id == 1
              )?.count || 0,
            value5:
              res?.data?.estimationStats?.rateCouldYouLiveInCount?.find(
                (item) => item?._id == 1
              )?.count || 0,
          },
          {
            height: 300,
            color: "bg-orange-300",
            value1:
              res?.data?.estimationStats?.ratePropertyTitleCount?.find(
                (item) => item?._id == 2
              )?.count || 0,
            value2:
              res?.data?.estimationStats?.ratePropertyPicturesCount?.find(
                (item) => item?._id == 2
              )?.count || 0,
            value3:
              res?.data?.estimationStats?.rateInteriorDesignCount?.find(
                (item) => item?._id == 2
              )?.count || 0,
            value4:
              res?.data?.estimationStats?.rateLocationCount?.find(
                (item) => item?._id == 2
              )?.count || 0,
            value5:
              res?.data?.estimationStats?.rateCouldYouLiveInCount?.find(
                (item) => item?._id == 2
              )?.count || 0,
          },
          {
            height: 300,
            color: "bg-pink-300",
            value1:
              res?.data?.estimationStats?.ratePropertyTitleCount?.find(
                (item) => item?._id == 3
              )?.count || 0,
            value2:
              res?.data?.estimationStats?.ratePropertyPicturesCount?.find(
                (item) => item?._id == 3
              )?.count || 0,
            value3:
              res?.data?.estimationStats?.rateInteriorDesignCount?.find(
                (item) => item?._id == 3
              )?.count || 0,
            value4:
              res?.data?.estimationStats?.rateLocationCount?.find(
                (item) => item?._id == 3
              )?.count || 0,
            value5:
              res?.data?.estimationStats?.rateCouldYouLiveInCount?.find(
                (item) => item?._id == 3
              )?.count || 0,
          },
          {
            height: 300,
            color: "bg-cyan-200",
            value1:
              res?.data?.estimationStats?.ratePropertyTitleCount?.find(
                (item) => item?._id == 4
              )?.count || 0,
            value2:
              res?.data?.estimationStats?.ratePropertyPicturesCount?.find(
                (item) => item?._id == 4
              )?.count || 0,
            value3:
              res?.data?.estimationStats?.rateInteriorDesignCount?.find(
                (item) => item?._id == 4
              )?.count || 0,
            value4:
              res?.data?.estimationStats?.rateLocationCount?.find(
                (item) => item?._id == 4
              )?.count || 0,
            value5:
              res?.data?.estimationStats?.rateCouldYouLiveInCount?.find(
                (item) => item?._id == 4
              )?.count || 0,
          },
          {
            height: 300,
            color: "bg-yellow-200",
            value1:
              res?.data?.estimationStats?.ratePropertyTitleCount?.find(
                (item) => item?._id == 5
              )?.count || 0,
            value2:
              res?.data?.estimationStats?.ratePropertyPicturesCount?.find(
                (item) => item?._id == 5
              )?.count || 0,
            value3:
              res?.data?.estimationStats?.rateInteriorDesignCount?.find(
                (item) => item?._id == 5
              )?.count || 0,
            value4:
              res?.data?.estimationStats?.rateLocationCount?.find(
                (item) => item?._id == 5
              )?.count || 0,
            value5:
              res?.data?.estimationStats?.rateCouldYouLiveInCount?.find(
                (item) => item?._id == 5
              )?.count || 0,
          },
        ]);

        const data = [
          {
            percent: res?.data?.priceDeviationBreakdown?.minus0To5,
            bg: "bg-[#d9c9ee]",
            text: "text-purple-900",
            range: "0 to -5%",
            value: res?.data?.estimationStats?.withinMinus0To5?.[0]?.count || 0,
          },
          {
            percent: res?.data?.priceDeviationBreakdown?.minus5To10,
            bg: "bg-[#ffe4b8]",
            text: "text-yellow-500",
            range: "-5% to -10%",
            value:
              res?.data?.estimationStats?.withinMinus5To10?.[0]?.count || 0,
          },
          {
            percent: res?.data?.priceDeviationBreakdown?.minus10To20,
            bg: "bg-[#ffd0eb]",
            text: "text-pink-500",
            range: "-10% to -20%",
            value:
              res?.data?.estimationStats?.withinMinus10To20?.[0]?.count || 0,
          },
          {
            percent: res?.data?.priceDeviationBreakdown?.lessThanMinus20,
            bg: "bg-cyan-200",
            text: "text-cyan-800",
            range: "Below -20%",
            value: res?.data?.estimationStats?.lessThanMinus20?.[0]?.count || 0,
          },
          {
            percent: res?.data?.priceDeviationBreakdown?.plus10To20,
            bg: "bg-pink-400",
            text: "text-pink-100",
            range: "+10% to +20%",
            value:
              res?.data?.estimationStats?.withinPlus10To10?.[0]?.count || 0,
          },
          {
            percent: res?.data?.priceDeviationBreakdown?.plus0To5,
            bg: "bg-purple-400",
            text: "text-purple-100",
            range: "0 to +5%",
            value: res?.data?.estimationStats?.withinPlus0To5?.[0]?.count || 0,
          },
          {
            percent: res?.data?.priceDeviationBreakdown?.plus5To10,
            bg: "bg-yellow-300",
            text: "text-yellow-600",
            range: "+5% to +10%",
            value: res?.data?.estimationStats?.withinPlus5To10?.[0]?.count || 0,
          },
          {
            percent: res?.data?.priceDeviationBreakdown?.moreThanPlus20,
            bg: "bg-cyan-400",
            text: "text-cyan-800",
            range: "Above +20%",
            value: res?.data?.estimationStats?.moreThanPlus20?.[0]?.count || 0,
          },
        ];

        const minSize = 80;
        const maxSize = 120;

        const sortedBubbles = data
          .map((b) => ({
            ...b,
            computedSize: b.percent
              ? Math.min(maxSize, Math.max(minSize, b.percent * maxSize))
              : minSize,
          }))
          .sort((a, b) => a.computedSize - b.computedSize); // sort small → large

        setbubbles(sortedBubbles);
      });
      socket.on("lifetime-price-estimation", (res) => {
        const msg = res?.lastRecord;
        setrangeprice({ ...msg, totalCount: res?.totalCount });
      });
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

  const globalChart = () => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    const option = {
      color: ["#DC6A84", "#D43567", "#00B3CA"], // colors for each slice
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c}", // show exact value in tooltip
      },
      legend: {
        top: "5%",
        left: "center",
        textStyle: {
          color: "#ffffff", // legend text color
        },
      },
      series: [
        {
          name: "Price Estimation",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "outside",
            formatter: "{b}: {c}", // show exact value instead of percentage
            textStyle: {
              color: "#ffffff", // label text color
            },
          },
          data: piecharts, // your data remains the same
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  };

  useEffect(() => {
    if (isOpen) {
      globalChart();
    }
  }, [isOpen, piecharts, !showCampaign]);

  useEffect(() => {
    if (!camppaginchartRef.current) return;
    const chart = echarts.init(camppaginchartRef.current);
    const option = {
      color: ["#DC6A84", "#D43567", "#00B3CA"], // colors for each slice
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c}", // show exact value in tooltip
      },
      legend: {
        top: "5%",
        left: "center",
        textStyle: {
          color: "#070707ff", // legend text color
        },
      },
      series: [
        {
          name: "Price Estimation",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "outside",
            formatter: "{b}: {c}", // show exact value instead of percentage
            textStyle: {
              color: "#070707ff", // label text color
            },
          },
          data: comapaginpiecharts, // your data remains the same
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [comapaginpiecharts, isOpen2, !showCampaign]);

  useEffect(() => {
    socket.on("owner-per-campaign-results", (res) => {
      const msg = res?.data;
      setcampagin(msg);
      setcampainavarageePrice(
        msg?.estimationStats?.priceStats?.[0]?.avgPrice || 0
      );
      setcomapaginpiecharts([
        {
          value:
            res?.data?.estimationStats?.priceStats?.[0]
              ?.appropriateProperties || 0,
          name: "Appropriate",
        },
        {
          value:
            res?.data?.estimationStats?.priceStats?.[0]?.expensiveProperties ||
            0,
          name: "Over Estimate",
        },
        {
          value:
            res?.data?.estimationStats?.priceStats?.[0]
              ?.underEstimatedProperties || 0,
          name: "Under Estimate",
        },
      ]);
      setcomapginsegments([
        {
          height: 300,
          color: "bg-purple-300",
          value1:
            res?.data?.estimationStats?.ratePropertyTitleCount?.find(
              (item) => item?._id == 1
            )?.count || 0,
          value2:
            res?.data?.estimationStats?.ratePropertyPicturesCount?.find(
              (item) => item?._id == 1
            )?.count || 0,
          value3:
            res?.data?.estimationStats?.rateInteriorDesignCount?.find(
              (item) => item?._id == 1
            )?.count || 0,
          value4:
            res?.data?.estimationStats?.rateLocationCount?.find(
              (item) => item?._id == 1
            )?.count || 0,
          value5:
            res?.data?.estimationStats?.rateCouldYouLiveInCount?.find(
              (item) => item?._id == 1
            )?.count || 0,
        },
        {
          height: 300,
          color: "bg-orange-300",
          value1:
            res?.data?.estimationStats?.ratePropertyTitleCount?.find(
              (item) => item?._id == 2
            )?.count || 0,
          value2:
            res?.data?.estimationStats?.ratePropertyPicturesCount?.find(
              (item) => item?._id == 2
            )?.count || 0,
          value3:
            res?.data?.estimationStats?.rateInteriorDesignCount?.find(
              (item) => item?._id == 2
            )?.count || 0,
          value4:
            res?.data?.estimationStats?.rateLocationCount?.find(
              (item) => item?._id == 2
            )?.count || 0,
          value5:
            res?.data?.estimationStats?.rateCouldYouLiveInCount?.find(
              (item) => item?._id == 2
            )?.count || 0,
        },
        {
          height: 300,
          color: "bg-pink-300",
          value1:
            res?.data?.estimationStats?.ratePropertyTitleCount?.find(
              (item) => item?._id == 3
            )?.count || 0,
          value2:
            res?.data?.estimationStats?.ratePropertyPicturesCount?.find(
              (item) => item?._id == 3
            )?.count || 0,
          value3:
            res?.data?.estimationStats?.rateInteriorDesignCount?.find(
              (item) => item?._id == 3
            )?.count || 0,
          value4:
            res?.data?.estimationStats?.rateLocationCount?.find(
              (item) => item?._id == 3
            )?.count || 0,
          value5:
            res?.data?.estimationStats?.rateCouldYouLiveInCount?.find(
              (item) => item?._id == 3
            )?.count || 0,
        },
        {
          height: 300,
          color: "bg-cyan-200",
          value1:
            res?.data?.estimationStats?.ratePropertyTitleCount?.find(
              (item) => item?._id == 4
            )?.count || 0,
          value2:
            res?.data?.estimationStats?.ratePropertyPicturesCount?.find(
              (item) => item?._id == 4
            )?.count || 0,
          value3:
            res?.data?.estimationStats?.rateInteriorDesignCount?.find(
              (item) => item?._id == 4
            )?.count || 0,
          value4:
            res?.data?.estimationStats?.rateLocationCount?.find(
              (item) => item?._id == 4
            )?.count || 0,
          value5:
            res?.data?.estimationStats?.rateCouldYouLiveInCount?.find(
              (item) => item?._id == 4
            )?.count || 0,
        },
        {
          height: 300,
          color: "bg-yellow-200",
          value1:
            res?.data?.estimationStats?.ratePropertyTitleCount?.find(
              (item) => item?._id == 5
            )?.count || 0,
          value2:
            res?.data?.estimationStats?.ratePropertyPicturesCount?.find(
              (item) => item?._id == 5
            )?.count || 0,
          value3:
            res?.data?.estimationStats?.rateInteriorDesignCount?.find(
              (item) => item?._id == 5
            )?.count || 0,
          value4:
            res?.data?.estimationStats?.rateLocationCount?.find(
              (item) => item?._id == 5
            )?.count || 0,
          value5:
            res?.data?.estimationStats?.rateCouldYouLiveInCount?.find(
              (item) => item?._id == 5
            )?.count || 0,
        },
      ]);

      const data = [
        {
          percent: res?.data?.priceDeviationBreakdown?.minus0To5,
          bg: "bg-[#d9c9ee]",
          text: "text-purple-900",
          range: "0 to -5%",
          value: res?.data?.estimationStats?.withinMinus0To5?.[0]?.count || 0,
        },
        {
          percent: res?.data?.priceDeviationBreakdown?.minus5To10,
          bg: "bg-[#ffe4b8]",
          text: "text-yellow-500",
          range: "-5% to -10%",
          value:
            res?.data?.estimationStats?.withinMinus5To10?.[0]?.count || 0,
        },
        {
          percent: res?.data?.priceDeviationBreakdown?.minus10To20,
          bg: "bg-[#ffd0eb]",
          text: "text-pink-500",
          range: "-10% to -20%",
          value:
            res?.data?.estimationStats?.withinMinus10To20?.[0]?.count || 0,
        },
        {
          percent: res?.data?.priceDeviationBreakdown?.lessThanMinus20,
          bg: "bg-cyan-200",
          text: "text-cyan-800",
          range: "Below -20%",
          value: res?.data?.estimationStats?.lessThanMinus20?.[0]?.count || 0,
        },
        {
          percent: res?.data?.priceDeviationBreakdown?.plus10To20,
          bg: "bg-pink-400",
          text: "text-pink-100",
          range: "+10% to +20%",
          value:
            res?.data?.estimationStats?.withinPlus10To10?.[0]?.count || 0,
        },
        {
          percent: res?.data?.priceDeviationBreakdown?.plus0To5,
          bg: "bg-purple-400",
          text: "text-purple-100",
          range: "0 to +5%",
          value: res?.data?.estimationStats?.withinPlus0To5?.[0]?.count || 0,
        },
        {
          percent: res?.data?.priceDeviationBreakdown?.plus5To10,
          bg: "bg-yellow-300",
          text: "text-yellow-600",
          range: "+5% to +10%",
          value: res?.data?.estimationStats?.withinPlus5To10?.[0]?.count || 0,
        },
        {
          percent: res?.data?.priceDeviationBreakdown?.moreThanPlus20,
          bg: "bg-cyan-400",
          text: "text-cyan-800",
          range: "Above +20%",
          value: res?.data?.estimationStats?.moreThanPlus20?.[0]?.count || 0,
        },
      ];


      const minSize = 80;
      const maxSize = 120;

      const sortedBubbles = data
        .map((b) => ({
          ...b,
          computedSize: b.percent
            ? Math.min(maxSize, Math.max(minSize, b.percent * maxSize))
            : minSize,
        }))
        .sort((a, b) => a.computedSize - b.computedSize); // small → large

      setcomapaginbubbles(sortedBubbles);
    });
    socket.on("lifetime-price-estimation", (res) => {
      const msg = res?.lastRecord;
      setcampaginrangeprice({ ...msg, totalCount: res?.totalCount });
    });
  }, []);

  const startCompagin = (e, Type) => {
    e.preventDefault();
    if (!form?.referencePrice) return;
    const payload = {
      pricePerSqm: getpricesqm(form?.referencePrice),
      propertyId: selectedProperty?._id,
      referencePrice: form?.referencePrice,
      duration: Type,
      // status: "active",
    };
    ApiClient.post("peerCampaign/start/campagin", payload).then((res) => {
      if (res.success) {
        toast.success(res?.message);
        setShowModal(false);
        getCards(selectedProperty?._id)
        setForm({
          campaignName: "",
          referencePrice: "",
        });
      }
      loader(false);
    });
  };

  const purchaseCampagion = (e) => {
    e.preventDefault();
    const payload = {
      campaignType: campaginType,
      propertyId: selectedProperty?._id,
      amount: form?.referencePrice,
      currency: "eur",
      referencePrice: form?.referencePrice,
      pricePerSqm: getpricesqm(form?.referencePrice),
      duration: campaginType,
    };
    ApiClient.post("peerCampaign/purchase/campaign", payload).then((res) => {
      if (res.success) {
        // startCompagin(e);
        getCards(selectedProperty?._id)
        setShowPuchaseModule(false);
      }
      loader(false);
    });
  };

  const legends = [
    {
      colorBox: "bg-[#d9c9ee]",
      textColor: "text-purple-400",
      label: "0 to -5% of RP",
    },
    {
      colorBox: "bg-[#ffe4b8]",
      textColor: "text-yellow-300",
      label: "-5% to -10% of RP",
    },
    {
      colorBox: "bg-[#ffd0eb]",
      textColor: "text-pink-300",
      label: "-10% to -20% of RP",
    },
    {
      colorBox: "bg-cyan-200",
      textColor: "text-cyan-300",
      label: "Below -20% of RP",
    },
    {
      colorBox: "bg-purple-400",
      textColor: "text-purple-700",
      label: "0 to +5% of RP",
    },
    {
      colorBox: "bg-yellow-300",
      textColor: "text-yellow-500",
      label: "+5% to +10% of RP",
    },
    {
      colorBox: "bg-pink-400",
      textColor: "text-pink-500",
      label: "+10% to +20% of RP",
    },
    {
      colorBox: "bg-cyan-400",
      textColor: "text-cyan-500",
      label: "Above +20% of RP",
    },
  ];
  const data1 = [
    { label: "Title" },
    { label: "Picture" },
    { label: "Interior design" },
    { label: "Location" },
    { label: "Could live in" },
  ];

  const getCampagionData = (id) => {
    const payload = {
      campaginId: id,
    };
    socket.emit("owner-per-campaign-results", payload);
    const newpayload = {
      campaginId: id,
    };
    socket.emit("lifetime-price-estimation", newpayload);
  };

  const getcampainDetail = (item) => {
    const payload = {
      id: item?.id || item?._id,
    };
    ApiClient.get("peerCampaign/detail/campaign", payload).then((res) => {
      if (res.success) {
        setparticularcampagindata(res?.data?.peerEstimations);
        scrollToTop();
      }
      loader(false);
    });
  };


  const getAvailableCount = (dayLimit, DailyLimit) => {
    return DailyLimit - dayLimit
  }

  const getAverage = (data, i) => {
    let value = `value${i + 1}`;
    const avg =
      (data[0]?.[value] +
        data[1]?.[value] +
        data[2]?.[value] +
        data[3]?.[value] +
        data[4]?.[value]) /
      5;
    return avg;
  };

  const topBubbles = bubbles.slice(0, 4);
  const bottomBubbles = bubbles.slice(4, 8);

  const campagiontopBubbles = comapaginbubbles.slice(0, 4);
  const campagionbottomBubbles = comapaginbubbles.slice(4, 8);
  const [dynamicCampagion, setdynamicCampagion] = useState([]);

  const getNewCampagionData = () => {
    ApiClient.get("adminSettings/detail").then((res) => {
      if (res.success) {
        setdynamicCampagion(res?.settings)
      }
      loader(false);
    });
  }

  const startCampagion = () => {
    // setShowModal(true)
    if (data?.length > 0) {
      setShowModal(true)
      getNewCampagionData()
    } else {
      setAlertModal(true)
    }
  }

  const downloadCampagion = async (e) => {
    e.preventDefault();
    loader(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${environment?.api}peerCampaign/download/campaign?id=${campaginId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to download zip");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "documents.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading zip file:", error);
    }

    loader(false);
  };


  return (
    <PageLayout>
      <div className="  pt-14 lg:pt-16 pb-[100px]  bg-[#976DD0]/30 relative">
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
                Real-estate social estimation
              </li>
            </ul>
            <h2 className="text-black max-w-lg mx-auto font-bold text-2xl text-center ">
              Peer to Peer estimation
            </h2>
            <h3 className="text-xl text-center">
              Here is what potential buyers think about your property
            </h3>

            <div className="grid grid-cols-12 mt-10 md:gap-8">
              <PropSidebar
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
              <div className="lg:col-span-8 col-span-12 md:mt-0 mt-8">
                {showCampaign ? (
                  <>
                    <div className="flex justify-between items-center gap-3 ">
                      <button
                        className="cursor-pointer border border-[#976DD0] text-[14px] rounded-[50px] py-[6px] px-[14px] text-[#976DD0] font-bold md:block hidden"
                        onClick={(e) => {
                          setShowCampaign(!showCampaign);
                          setCampaginId("")
                          scrollToTop();
                        }}
                      >
                        Back
                      </button>
                      <button
                        className="bg-[#976DD0] text-[14px] rounded-[50px] py-[6px] px-[14px] text-white font-bold md:block hidden "
                        onClick={(e) => downloadCampagion(e)}
                      >Download</button>
                    </div>
                    <div className="bg-purple-50 border rounded-xl px-4 py-2 w-full mt-5">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-700">
                          <thead>
                            <tr className="font-semibold text-gray-800 border-0 h-10 pb-2">
                              <th className="px-2">User</th>
                              <th className="px-2 whitespace-nowrap">
                                Reference price is
                              </th>
                              <th className="px-2 whitespace-nowrap">
                                Reasonable price
                              </th>
                              <th className="px-2 whitespace-nowrap">Title</th>
                              <th className="px-2 whitespace-nowrap">
                                Pictures
                              </th>
                              <th className="px-2 whitespace-nowrap">
                                Interior design
                              </th>
                              <th className="px-2 whitespace-nowrap">
                                Location
                              </th>
                              <th className="px-2 whitespace-nowrap">
                                Live in
                              </th>
                              <th className="px-2 whitespace-nowrap">
                                Advice/Comment
                              </th>
                            </tr>
                          </thead>
                          <tbody className="space-y-2 divide-y divide-transparent">
                            {particularcampagindata?.length > 0 ? (
                              particularcampagindata?.map((item) => {
                                return (
                                  <>
                                    <tr className="h-10 border-0">
                                      <td className="px-2">
                                        {item?.userId?.fullName || "--"}
                                      </td>
                                      <td className="px-2">
                                        {item?.referencePrice || 0}
                                      </td>
                                      <td className="px-2">
                                        {item?.userReasonablePrice || 0}
                                      </td>
                                      <td className="px-2">
                                        {item?.ratePropertyTitle || 0}
                                      </td>
                                      <td className="px-2">
                                        {item?.ratePropertyPictures || 0}
                                      </td>
                                      <td className="px-2">
                                        {item?.rateInteriorDesign || 0}
                                      </td>
                                      <td className="px-2">
                                        {item?.rateLocation || 0}
                                      </td>
                                      <td className="px-2">
                                        {item?.rateCouldYouLiveIn || 0}
                                      </td>
                                      <td className="px-2">
                                        {item?.comment || "--"}
                                      </td>
                                    </tr>
                                  </>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={9}>
                                  <div className="text-center">No Data</div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="bg-[#fff] rounded-xl p-6 flex gap-y-4 justify-between items-center flex-col lg:flex-row gap-y-6 space-x-4">
                      {/* Left Content */}
                      <div className="w-[100%]">
                        <p className="font-semibold mb-3">
                          Campaign launched according to your plan.
                        </p>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-center space-x-2">
                            <BsCircleFill className="text-yellow-400 flex-shrink-0" />
                            <span>Daily campaign (24 hours)</span>
                            <span className="ml-auto font-semibold">
                              {cards?.campaignStats?.DayCampaignLimit || 0}/
                              {user?.planId?.dailyCampaignLimit || 0}
                              {cards?.campaignStats?.extraCampaignsPerDay > 0 ? ` + ${cards?.campaignStats?.extraCampaignsPerDay}` : ""}
                            </span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <BsCircleFill className="text-yellow-400 flex-shrink-0" />
                            <span>Weekly campaign (7 days)</span>
                            <span className="ml-auto font-semibold">
                              {cards?.campaignStats?.WeekCampaignLimit || 0}/
                              {user?.planId?.weeklyCampaignLimit || 0}
                              {cards?.campaignStats?.extraCampaignsPerWeek > 0 ? ` + ${cards?.campaignStats?.extraCampaignsPerWeek}` : ""}
                            </span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <BsCircleFill className="text-yellow-400 flex-shrink-0" />
                            <span>Monthly campaign (30 days)</span>
                            <span className="ml-auto font-semibold">
                              {cards?.campaignStats?.MonthCampaignLimit || 0}/
                              {user?.planId?.monthlyCampaignLimit || 0}
                              {cards?.campaignStats?.extraCampaignsPerMonth > 0 ? ` + ${cards?.campaignStats?.extraCampaignsPerMonth}` : ""}
                            </span>
                          </li>
                        </ul>
                        <p className="mt-3 font-bold">
                          Total campaign run: {cards?.campaignStats?.totalRunningCampaigns || 0}
                        </p>
                      </div>

                      {/* Right Content */}
                      <div className="mt-8 flex relative before:absolute before:top-[-35px] before:left-0 before:bg-[url('/assets/img/peer-bg.png')] before:bg-no-repeat before:bg-contain before:bg-top before:content-[''] before:w-full before:h-[100px] flex-col items-center gap-y-7 lg:w-[80%]">
                        <div className="z-[2] flex space-x-4 items-center relative">
                          <div className="border-[#000] bg-[#fff] border rounded-full w-[40px] h-[40px] flex justify-center items-center">
                            <FiUser className="text-red-300" size={24} />
                          </div>
                          <div>
                            <LuArrowLeftRight size={24} />
                          </div>
                          <div className="border-[#000] bg-[#fff] border rounded-full w-[40px] h-[40px] flex justify-center items-center">
                            <FiUser className="text-blue-300" size={24} />
                          </div>
                          <div>
                            <LuArrowLeftRight size={24} />
                          </div>
                          <div className="border-[#000] bg-[#fff] border rounded-full w-[40px] h-[40px] flex justify-center items-center">
                            <FiUser className="text-green-300" size={24} />
                          </div>
                        </div>
                        <button
                          onClick={() => startCampagion()}
                          className="z-[2] bg-purple-500 text-white px-5 py-2 rounded-full hover:bg-purple-600 transition"
                        >
                          Start new campaign
                        </button>
                      </div>
                    </div>
                    <h4 className="text-[18px] text-center my-8">
                      All campaigns aggregated global Social Estimation Data
                    </h4>
                    <div className="bg-[#fff] rounded-[14px] relative px-8 py-5 text-center">
                      <div className="relative">
                        <h5 className="text-[16px] leading-none">
                          Reference price perception
                        </h5>
                        <p className="text-[14px] text-gray-500">
                          Last reference price: 10 000 € /sqm
                        </p>
                        <button
                          onClick={() => setIsOpen(!isOpen)}
                          className={`absolute top-0.5 right-0 text-gray-500 rounded-full border border-gray-500 w-[28px] h-[28px] flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                            }`}
                        >
                          <AiOutlineDown size={18} />
                        </button>
                        {/* Collapse Panel */}
                        {isOpen && (
                          <div className="mt-4">
                            <div>
                              <div className="mt-4 bg-[#976DD0] rounded-[12px]">
                                <div
                                  ref={chartRef}
                                  style={{
                                    width: "100%",
                                    height: "400px",
                                    marginTop: "20px",
                                  }}
                                />
                              </div>

                              <div className="border rounded-[10px] p-4 mt-6">
                                <h5 className="text-[16px] leading-none mb-8">
                                  Lifetime price estimation
                                </h5>
                                <div className="px-6">
                                  <div className="flex flex-wrap lg:flex-nowrap gap-4 justify-between mb-8 ">
                                    <div className="border w-[100%] lg:w-[30%] rounded-md ps-3 pe-6 py-2 text-start ">
                                      <div className="text-lg font-semibold text-orange-500">
                                        {cards?.estimationStats?.priceStats?.[0]
                                          ?.minPrice || 0}{" "}
                                        €
                                      </div>
                                      <div className="text-xs">
                                        {getpricesqm(
                                          cards?.estimationStats
                                            ?.priceStats?.[0]?.minPrice || 0
                                        )}
                                        €/sqm
                                      </div>
                                      <div className="text-xs flex items-center justify-start space-x-1 mt-2 text-gray-400">
                                        <FiUser size={16} />
                                        <span>
                                          {cards?.estimationStats
                                            ?.minPriceDocCount?.[0]?.count || 0}
                                        </span>
                                      </div>
                                      <div className="text-xs flex items-center justify-center space-x-1 text-gray-400 mt-1">
                                        <CiCalendarDate size={16} />
                                        <span>
                                          {moment(
                                            cards?.estimationStats
                                              ?.maxPriceDocs?.[0]?.createdAt
                                          ).format("M/D/YYYY")}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="border w-[100%] lg:w-[30%] border-purple-600 rounded-md ps-3 pe-6 py-2 text-start">
                                      <div className="text-lg font-semibold text-purple-600">
                                        {avarageePrice.toFixed(2) || 0} €
                                      </div>
                                      <div className="text-xs">
                                        {getpricesqm(avarageePrice) || 0}€/sqm
                                      </div>
                                      <div className="text-xs flex items-center justify-start space-x-1 mt-2 text-gray-400">
                                        <FiUser size={16} />
                                        <span>{rangeprice?.totalCount}</span>
                                      </div>
                                      <div className="text-xs flex items-center justify-center space-x-1 text-gray-400 mt-1">
                                        <CiCalendarDate size={16} />
                                        <span>
                                          {moment(rangeprice?.createdAt).format(
                                            "M/D/YYYY"
                                          )}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="border w-[100%] lg:w-[30%] rounded-md ps-3 pe-6 py-2 text-start">
                                      <div className="text-lg font-semibold  text-gray-500">
                                        {cards?.estimationStats
                                          ?.maxPriceDocCount?.[0]?.count ||
                                          0}{" "}
                                        €
                                      </div>
                                      <div className="text-xs">
                                        {getpricesqm(
                                          cards?.estimationStats
                                            ?.priceStats?.[0]?.maxPrice || 0
                                        )}
                                        €/sqm
                                      </div>
                                      <div className="text-xs flex items-center justify-start space-x-1 mt-2 text-gray-400">
                                        <FiUser size={16} />
                                        <span>
                                          {cards?.estimationStats
                                            ?.priceStats?.[0]?.totalUsers || 0}
                                        </span>
                                      </div>
                                      <div className="text-xs flex items-center justify-center space-x-1 text-gray-400 mt-1">
                                        <CiCalendarDate size={16} />
                                        <span>
                                          {moment(
                                            cards?.estimationStats
                                              ?.minPriceDocs?.[0]?.createdAt
                                          ).format("M/D/YYYY")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Slider */}
                                  <div className="relative mb-2">
                                    {/* <input
                                        type="range"
                                        min={
                                          cards?.estimationStats
                                            ?.priceStats?.[0]?.minPrice || 0
                                        }
                                        max={
                                          cards?.estimationStats
                                            ?.priceStats?.[0]?.maxPrice || 0
                                        }
                                        defaultValue="50"
                                        className="w-full h-2 rounded-full appearance-none bg-purple-500 cursor-pointer"
                                      /> */}
                                    <input
                                      type="range"
                                      min={
                                        parseInt(
                                          cards?.estimationStats
                                            ?.priceStats?.[0]?.minPrice
                                        ) || 0
                                      }
                                      max={
                                        parseInt(
                                          cards?.estimationStats
                                            ?.priceStats?.[0]?.maxPrice
                                        ) || 1000
                                      }
                                      step="100"
                                      value={avarageePrice}
                                      onChange={(e) =>
                                        setavaragePrice(Number(e.target.value))
                                      }
                                      className="w-full h-4 rounded-full cursor-pointer bg-[#9b51e0] appearance-none focus:outline-none accent-[#fff]"
                                    />

                                    {/* Circle thumb mimic */}
                                    {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-purple-500 rounded-full pointer-events-none"></div> */}
                                  </div>

                                  {/* Labels */}
                                  <div className="flex justify-between font-medium text-gray-600 px-1">
                                    <span>Min</span>
                                    <span>Average</span>
                                    <span>Max</span>
                                  </div>
                                </div>
                              </div>
                              <div className="border rounded-[10px] p-4 mt-6">
                                <h5 className="text-[16px] leading-none">
                                  Distribution of price estimates
                                </h5>
                                <p className="text-[14px] text-gray-500 mb-4">
                                  Reference price (RP)
                                </p>
                                <div>
                                  {/* <div className="flex flex-wrap justify-center gap-6 mb-10">
                                    {bubbles.map((b, i) => (
                                      <motion.div
                                        key={i}
                                        className={`relative flex flex-col items-center justify-center rounded-full ${b.bg} shrink-0 cursor-pointer`}
                                        style={{
                                          width: `${b.computedSize}px`,
                                          height: `${b.computedSize}px`,
                                        }}
                                        initial={{ scale: 0 }}
                                        animate={{
                                          scale: 1,
                                          y: [0, -5, 0], 
                                        }}
                                        transition={{
                                          scale: {
                                            duration: 0.4,
                                            delay: i * 0.1,
                                          }, 
                                          y: {
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: "loop",
                                            ease: "easeInOut",
                                            delay: i * 0.1,
                                          },
                                        }}
                                      >
                                        <span
                                          className={`font-bold text-[16px] md:text-xl ${b.text}`}
                                        >
                                          {parseInt(b.percent)}%
                                        </span>
                                        <div className="flex items-center space-x-1 text-gray-600 mt-1 text-xs md:text-sm">
                                          <FaUser />
                                          <span>{b.value}</span>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div> */}
                                  <div className="w-full flex flex-col items-center gap-6 mb-10">
                                    {/* Top Row */}
                                    <div className="flex flex-wrap justify-center gap-6">
                                      {topBubbles.map((b, i) => (
                                        <motion.div
                                          key={`top-${i}`}
                                          className={`relative flex flex-col items-center justify-center rounded-full ${b.bg} shrink-0 cursor-pointer`}
                                          style={{
                                            width: `${b.computedSize}px`,
                                            height: `${b.computedSize}px`,
                                          }}
                                          initial={{ scale: 0 }}
                                          animate={{
                                            scale: 1,
                                            y: [0, -5, 0], // floating effect
                                          }}
                                          transition={{
                                            scale: {
                                              duration: 0.4,
                                              delay: i * 0.1,
                                            },
                                            y: {
                                              duration: 2,
                                              repeat: Infinity,
                                              repeatType: "loop",
                                              ease: "easeInOut",
                                              delay: i * 0.1,
                                            },
                                          }}
                                        >
                                          <span
                                            className={`font-bold text-[16px] md:text-xl ${b.text}`}
                                          >
                                            {parseInt(b.percent)}%
                                          </span>
                                          <div className="flex items-center space-x-1 text-gray-600 mt-1 text-xs md:text-sm">
                                            <FaUser />
                                            <span>{b.value}</span>
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>

                                    {/* Bottom Row */}
                                    <div className="flex flex-wrap justify-center gap-6">
                                      {bottomBubbles.map((b, i) => (
                                        <motion.div
                                          key={`bottom-${i}`}
                                          className={`relative flex flex-col items-center justify-center rounded-full ${b.bg} shrink-0 cursor-pointer`}
                                          style={{
                                            width: `${b.computedSize}px`,
                                            height: `${b.computedSize}px`,
                                          }}
                                          initial={{ scale: 0 }}
                                          animate={{
                                            scale: 1,
                                            y: [0, -5, 0],
                                          }}
                                          transition={{
                                            scale: {
                                              duration: 0.4,
                                              delay: i * 0.1,
                                            },
                                            y: {
                                              duration: 2,
                                              repeat: Infinity,
                                              repeatType: "loop",
                                              ease: "easeInOut",
                                              delay: i * 0.1,
                                            },
                                          }}
                                        >
                                          <span
                                            className={`font-bold text-[16px] md:text-xl ${b.text}`}
                                          >
                                            {parseInt(b.percent)}%
                                          </span>
                                          <div className="flex items-center space-x-1 text-gray-600 mt-1 text-xs md:text-sm">
                                            <FaUser />
                                            <span>{b.value}</span>
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Legend */}
                                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-xs md:text-sm">
                                    {legends.map((l, i) => (
                                      <div
                                        key={i}
                                        className="flex items-center justify-start space-x-2 mb-3 sm:mb-0"
                                      >
                                        <div
                                          className={`w-5 h-5 rounded-full ${l.colorBox}`}
                                        ></div>
                                        <span
                                          className={`${l.textColor} whitespace-nowrap `}
                                        >
                                          {l.label}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="border rounded-[10px] p-4 mt-6">
                                <h5 className="text-[16px] leading-none mb-6">
                                  Property profile qualitative rating metrics
                                </h5>
                                <div>
                                  <div className="flex justify-between max-w-xl mx-auto items-end flex-wrap space-x-4">
                                    {segments?.length > 0 ? (
                                      data1.map((item, i) => (
                                        <div
                                          key={i}
                                          className="flex flex-col items-center"
                                        >
                                          {/* Top label */}
                                          <div className="mb-2 p-1.5 border rounded-full text-xs text-gray-600">
                                            {getAverage(segments, i)}
                                          </div>

                                          {/* Stacked bar */}
                                          <div className="w-12 flex flex-col justify-end rounded overflow-hidden border border-gray-200">
                                            {segments.map((seg, idx) => (
                                              <div
                                                key={idx}
                                                className={`${seg.color}`}
                                                style={{
                                                  height: `${seg.height / 10
                                                    }px`,
                                                }} // scale down to fit better
                                              >
                                                {item.label == "Title" &&
                                                  seg?.value1}
                                                {item.label == "Picture" &&
                                                  seg?.value2}
                                                {item.label ==
                                                  "Interior design" &&
                                                  seg?.value3}
                                                {item.label == "Location" &&
                                                  seg?.value4}
                                                {item.label ==
                                                  "Could live in" &&
                                                  seg?.value5}
                                              </div>
                                            ))}
                                          </div>

                                          {/* Bottom label */}
                                          <div className="mt-2 text-xs text-gray-600">
                                            {item.label}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-center w-full">No Data</div>
                                    )}
                                  </div>
                                  <ul className="flex justify-between items-center gap-4 flex-wrap mt-5">
                                    <li>
                                      <div className="flex items-center ">
                                        <GoDotFill
                                          size={24}
                                          className="text-purple-300"
                                        />
                                        <div>
                                          <FaRegStar className="text-gray-400" />
                                        </div>
                                      </div>
                                    </li>
                                    <li>
                                      <div className="flex items-center ">
                                        <GoDotFill
                                          size={24}
                                          className="text-orange-300"
                                        />
                                        <div className="flex items-center gap-1">
                                          <FaRegStar className="text-gray-400" />
                                          <FaRegStar className="text-gray-400" />
                                        </div>
                                      </div>
                                    </li>
                                    <li>
                                      <div className="flex items-center ">
                                        <GoDotFill
                                          size={24}
                                          className="text-pink-300"
                                        />
                                        <div className="flex items-center gap-1">
                                          <FaRegStar className="text-gray-400" />
                                          <FaRegStar className="text-gray-400" />
                                          <FaRegStar className="text-gray-400" />
                                        </div>
                                      </div>
                                    </li>
                                    <li>
                                      <div className="flex items-center ">
                                        <GoDotFill
                                          size={24}
                                          className="text-cyan-200"
                                        />
                                        <div className="flex items-center gap-1">
                                          <FaRegStar className="text-gray-400" />
                                          <FaRegStar className="text-gray-400" />
                                          <FaRegStar className="text-gray-400" />
                                          <FaRegStar className="text-gray-400" />
                                        </div>
                                      </div>
                                    </li>
                                    <li>
                                      <div className="flex items-center ">
                                        <GoDotFill
                                          size={24}
                                          className="text-yellow-200"
                                        />
                                        <div className="flex items-center gap-1">
                                          <FaRegStar className="text-gray-400" />
                                          <FaRegStar className="text-gray-400" />
                                          <FaRegStar className="text-gray-400" />
                                          <FaRegStar className="text-gray-400" />
                                          <FaRegStar className="text-gray-400" />
                                        </div>
                                      </div>
                                    </li>
                                    <li>
                                      <div className="flex items-center">
                                        <GoDot
                                          size={24}
                                          className="text-gray-400"
                                        />
                                        <p className="text-[14px]">
                                          Global Rate
                                        </p>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className="p-4 border rounded-[10px] mt-6">
                                <h5 className="text-[16px] leading-none mb-4">
                                  Social interactions generated through
                                  campaigns
                                </h5>
                                <div className="flex flex-wrap justify-start lg:justify-between gap-x-4 gap-y-3 items-center text-gray-600 text-sm ">
                                  {/* Property follows */}
                                  <div className="flex gap-2 items-end">
                                    <AiOutlineHome size={24} />
                                    <div>
                                      <span className="text-purple-600 font-semibold">
                                        {cards?.socialEstimation?.[1] || 0}
                                      </span>
                                      <p className="leading-tight">
                                        Property follows
                                      </p>
                                    </div>
                                  </div>

                                  {/* Property likes */}
                                  <div className="flex gap-2 items-end">
                                    <AiOutlineHeart size={24} />
                                    <div>
                                      <span className="text-purple-600 font-semibold">
                                        {cards?.socialEstimation?.[0] || 0}
                                      </span>
                                      <p className="leading-tight">
                                        Property likes
                                      </p>
                                    </div>
                                  </div>

                                  {/* Property shares */}
                                  <div className="flex gap-2 items-end">
                                    <AiOutlineHeart size={24} />
                                    <div>
                                      <span className="text-purple-600 font-semibold">
                                        {/* {cards?.socialEstimation?.[2]} */}2
                                      </span>
                                      <p className="leading-tight">
                                        Property shares
                                      </p>
                                    </div>
                                  </div>

                                  {/* Social estimations */}
                                  <div className="flex gap-2 items-end">
                                    <AiOutlineUser size={24} />
                                    <div>
                                      <span className="text-purple-600 font-semibold">
                                        {cards?.socialEstimation?.[2] || 0}
                                      </span>
                                      <p className="leading-tight">
                                        Social estimations
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <h4 className="text-[18px] text-center my-8">
                      Displaying {campagindata?.length} campaigns
                    </h4>

                    <div className="rounded-lg">
                      {campagindata?.map((item) => {
                        return (
                          <div className="relative">
                            <>
                              {" "}
                              <div className="bg-white rounded-[12px] p-5 relative mb-10">
                                {/* Campaign title */}
                                <div className="font-semibold text-center text-gray-800 mb-2">
                                  {item?.campaignName}
                                </div>
                                {/* Details row */}
                                <div className="text-sm flex flex-wrap gap-3 justify-between items-center text-gray-600">
                                  <div>
                                    Start date:{" "}
                                    <span className="font-medium text-black">
                                      {moment(item?.startDate).format(
                                        "M/D/YYYY"
                                      )}
                                    </span>
                                  </div>
                                  <div>
                                    Duration:{" "}
                                    <span className="font-medium text-black">
                                      {item?.duration}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Average price: {item?.pricePerSqm}€/sqm
                                  </div>
                                  <div className="flex items-center space-x-4 text-sm text-gray-700">
                                    <div className="flex items-center space-x-1">
                                      <AiOutlineUser />
                                      <span className="text-purple-700 font-medium">
                                        1 000
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <AiOutlineHome />
                                      <span className="text-purple-700 font-medium">
                                        50
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <AiOutlineHeart />
                                      <span className="text-purple-700 font-medium">
                                        100
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <AiOutlineHeart />
                                      <span className="text-purple-700 font-medium">
                                        20
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {/* Status badge */}
                                <div
                                  className={`absolute -top-4 left-4 ${item?.status == "active"
                                    ? "bg-[#976DD0]"
                                    : "bg-[#000]"
                                    } text-white text-sm px-4 py-1 rounded-full`}
                                >
                                  {item?.status == "active"
                                    ? "Running"
                                    : "Ended"}
                                </div>

                                {/* Disclosure Button */}
                                <button
                                  onClick={() =>
                                    setIsOpen2(
                                      isOpen2 === item?.id ? null : item?.id
                                    )
                                  }
                                  className={`absolute top-3 right-3 text-gray-500 rounded-full border border-gray-500 w-[28px] h-[28px] flex items-center justify-center transition-transform duration-300 ${isOpen2 === item?.id ? "rotate-180" : ""
                                    }`}
                                >
                                  <div
                                    onClick={(e) =>
                                      getCampagionData(item?.id || item?._id)
                                    }
                                  >
                                    <AiOutlineDown size={18} />
                                  </div>
                                </button>
                                {isOpen2 === item?.id && (
                                  <div className="mt-4">
                                    <div className="bg-[#fff] rounded-[14px] p-8 text-center">
                                      <h5 className="text-[16px] leading-none">
                                        Reference price perception
                                      </h5>
                                      <p className="text-[14px] text-gray-500">
                                        Last reference price: 10 000 € /sqm
                                      </p>
                                      <div className="mt-4">
                                        <div
                                          ref={camppaginchartRef}
                                          style={{
                                            width: "100%",
                                            height: "400px",
                                            marginTop: "20px",
                                          }}
                                        />
                                      </div>
                                      <div className="border rounded-[10px] p-4 mt-6">
                                        <h5 className="text-[16px] leading-none mb-8">
                                          Lifetime price estimation
                                        </h5>
                                        <div className="px-6">
                                          <div className="flex flex-wrap lg:flex-nowrap gap-4 justify-between mb-8 ">
                                            <div className="border w-[100%] lg:w-[30%] rounded-md ps-3 pe-6 py-2 text-start ">
                                              <div className="text-lg font-semibold text-orange-500">
                                                {campagin?.estimationStats
                                                  ?.priceStats?.[0]?.minPrice ||
                                                  0}{" "}
                                                €
                                              </div>
                                              <div className="text-xs">
                                                {getpricesqm(
                                                  campagin?.estimationStats
                                                    ?.priceStats?.[0]
                                                    ?.minPrice || 0
                                                )}
                                                €/sqm
                                              </div>
                                              <div className="text-xs flex items-center justify-start space-x-1 mt-2 text-gray-400">
                                                <FiUser size={16} />
                                                <span>
                                                  {
                                                    campagin?.estimationStats
                                                      ?.priceStats?.[0]
                                                      ?.totalUsers
                                                  }
                                                </span>
                                              </div>
                                              <div className="text-xs flex items-center justify-center space-x-1 text-gray-400 mt-1">
                                                <CiCalendarDate size={16} />
                                                <span>
                                                  {moment(
                                                    campagin?.estimationStats
                                                      ?.minPriceDocs?.[0]
                                                      ?.createdAt
                                                  ).format("M/D/YYYY")}
                                                </span>
                                              </div>
                                            </div>

                                            <div className="border w-[100%] lg:w-[30%] border-purple-600 rounded-md ps-3 pe-6 py-2 text-start">
                                              <div className="text-lg font-semibold text-purple-600">
                                                {campainavarageePrice.toFixed(
                                                  2
                                                ) || 0}{" "}
                                                €
                                              </div>
                                              <div className="text-xs">
                                                {getpricesqm(
                                                  campainavarageePrice
                                                ) || 0}
                                                €/sqm
                                              </div>
                                              <div className="text-xs flex items-center justify-start space-x-1 mt-2 text-gray-400">
                                                <FiUser size={16} />
                                                <span>
                                                  {
                                                    campaginrangeprice?.totalCount
                                                  }
                                                </span>
                                              </div>
                                              <div className="text-xs flex items-center justify-center space-x-1 text-gray-400 mt-1">
                                                <CiCalendarDate size={16} />
                                                <span>
                                                  {moment(
                                                    campaginrangeprice?.createdAt
                                                  ).format("M/D/YYYY")}
                                                </span>
                                              </div>
                                            </div>

                                            <div className="border w-[100%] lg:w-[30%] rounded-md ps-3 pe-6 py-2 text-start">
                                              <div className="text-lg font-semibold  text-gray-500">
                                                {campagin?.estimationStats
                                                  ?.priceStats?.[0]?.maxPrice ||
                                                  0}{" "}
                                                €
                                              </div>
                                              <div className="text-xs">
                                                {getpricesqm(
                                                  campagin?.estimationStats
                                                    ?.priceStats?.[0]
                                                    ?.maxPrice || 0
                                                )}
                                                €/sqm
                                              </div>
                                              <div className="text-xs flex items-center justify-start space-x-1 mt-2 text-gray-400">
                                                <FiUser size={16} />
                                                <span>
                                                  {
                                                    campagin?.estimationStats
                                                      ?.priceStats?.[0]
                                                      ?.totalUsers
                                                  }
                                                </span>
                                              </div>
                                              <div className="text-xs flex items-center justify-center space-x-1 text-gray-400 mt-1">
                                                <CiCalendarDate size={16} />
                                                <span>
                                                  {moment(
                                                    campagin?.estimationStats
                                                      ?.maxPriceDocs?.[0]
                                                      ?.createdAt
                                                  ).format("M/D/YYYY")}
                                                </span>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Slider */}
                                          <div className="relative mb-2">
                                            <input
                                              type="range"
                                              min={
                                                parseInt(
                                                  campagin?.estimationStats
                                                    ?.priceStats?.[0]?.minPrice
                                                ) || 0
                                              }
                                              max={
                                                parseInt(
                                                  campagin?.estimationStats
                                                    ?.priceStats?.[0]?.maxPrice
                                                ) || 1000
                                              }
                                              step="100"
                                              value={campainavarageePrice}
                                              onChange={(e) =>
                                                setcampainavarageePrice(
                                                  Number(e.target.value)
                                                )
                                              }
                                              className="w-full h-4 rounded-full cursor-pointer bg-[#9b51e0] appearance-none focus:outline-none accent-[#fff]"
                                            />

                                            {/* Circle thumb mimic */}
                                            {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-purple-500 rounded-full pointer-events-none"></div> */}
                                          </div>

                                          {/* Labels */}
                                          <div className="flex justify-between font-medium text-gray-600 px-1">
                                            <span>Min</span>
                                            <span>Average</span>
                                            <span>Max</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="border rounded-[10px] p-4 mt-6">
                                        <h5 className="text-[16px] leading-none">
                                          Distribution of price estimates
                                        </h5>
                                        <p className="text-[14px] text-gray-500 mb-4">
                                          Reference price (RP)
                                        </p>
                                        <div>
                                          <div className="w-full flex flex-col items-center gap-6 mb-10">
                                            {/* Top Row */}
                                            <div className="flex flex-wrap justify-center gap-6">
                                              {campagiontopBubbles.map((b, i) => (
                                                <motion.div
                                                  key={`top-${i}`}
                                                  className={`relative flex flex-col items-center justify-center rounded-full ${b.bg} shrink-0 cursor-pointer`}
                                                  style={{
                                                    width: `${b.computedSize}px`,
                                                    height: `${b.computedSize}px`,
                                                  }}
                                                  initial={{ scale: 0 }}
                                                  animate={{
                                                    scale: 1,
                                                    y: [0, -5, 0], // floating effect
                                                  }}
                                                  transition={{
                                                    scale: {
                                                      duration: 0.4,
                                                      delay: i * 0.1,
                                                    },
                                                    y: {
                                                      duration: 2,
                                                      repeat: Infinity,
                                                      repeatType: "loop",
                                                      ease: "easeInOut",
                                                      delay: i * 0.1,
                                                    },
                                                  }}
                                                >
                                                  <span
                                                    className={`font-bold text-[16px] md:text-xl ${b.text}`}
                                                  >
                                                    {parseInt(b.percent)}%
                                                  </span>
                                                  <div className="flex items-center space-x-1 text-gray-600 mt-1 text-xs md:text-sm">
                                                    <FaUser />
                                                    <span>{b.value}</span>
                                                  </div>
                                                </motion.div>
                                              ))}
                                            </div>

                                            {/* Bottom Row */}
                                            <div className="flex flex-wrap justify-center gap-6">
                                              {campagionbottomBubbles.map((b, i) => (
                                                <motion.div
                                                  key={`bottom-${i}`}
                                                  className={`relative flex flex-col items-center justify-center rounded-full ${b.bg} shrink-0 cursor-pointer`}
                                                  style={{
                                                    width: `${b.computedSize}px`,
                                                    height: `${b.computedSize}px`,
                                                  }}
                                                  initial={{ scale: 0 }}
                                                  animate={{
                                                    scale: 1,
                                                    y: [0, -5, 0],
                                                  }}
                                                  transition={{
                                                    scale: {
                                                      duration: 0.4,
                                                      delay: i * 0.1,
                                                    },
                                                    y: {
                                                      duration: 2,
                                                      repeat: Infinity,
                                                      repeatType: "loop",
                                                      ease: "easeInOut",
                                                      delay: i * 0.1,
                                                    },
                                                  }}
                                                >
                                                  <span
                                                    className={`font-bold text-[16px] md:text-xl ${b.text}`}
                                                  >
                                                    {parseInt(b.percent)}%
                                                  </span>
                                                  <div className="flex items-center space-x-1 text-gray-600 mt-1 text-xs md:text-sm">
                                                    <FaUser />
                                                    <span>{b.value}</span>
                                                  </div>
                                                </motion.div>
                                              ))}
                                            </div>
                                          </div>


                                          {/* Legend */}
                                          <div className="flex flex-wrap justify-center gap-4 text-xs md:text-sm">
                                            {legends.map((l, i) => (
                                              <div
                                                key={i}
                                                className="flex items-center space-x-2"
                                              >
                                                <div
                                                  className={`w-5 h-5 rounded-full ${l.colorBox}`}
                                                ></div>
                                                <span
                                                  className={`${l.textColor} whitespace-nowrap`}
                                                >
                                                  {l.label}
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="border rounded-[10px] p-4 mt-6">
                                        <h5 className="text-[16px] leading-none mb-6">
                                          Property profile qualitative rating
                                          metrics
                                        </h5>
                                        <div>
                                          <div className="flex justify-between max-w-xl mx-auto items-end flex-wrap space-x-4">
                                            {comapginsegments?.length > 0 ? (
                                              data1.map((item, i) => (
                                                <div
                                                  key={i}
                                                  className="flex flex-col items-center"
                                                >
                                                  <div className="mb-2 p-1.5 border rounded-full text-xs text-gray-600">
                                                    {getAverage(
                                                      comapginsegments,
                                                      i
                                                    )}
                                                  </div>
                                                  <div className="w-12 flex flex-col justify-end rounded overflow-hidden border border-gray-200">
                                                    {comapginsegments.map(
                                                      (seg, idx) => (
                                                        <div
                                                          key={idx}
                                                          className={`${seg.color}`}
                                                          style={{
                                                            height: `${seg.height / 10
                                                              }px`,
                                                          }} // scale down to fit better
                                                        >
                                                          {item.label ==
                                                            "Title" &&
                                                            seg?.value1}
                                                          {item.label ==
                                                            "Picture" &&
                                                            seg?.value2}
                                                          {item.label ==
                                                            "Interior design" &&
                                                            seg?.value3}
                                                          {item.label ==
                                                            "Location" &&
                                                            seg?.value4}
                                                          {item.label ==
                                                            "Could live in" &&
                                                            seg?.value5}
                                                        </div>
                                                      )
                                                    )}
                                                  </div>

                                                  {/* Bottom label */}
                                                  <div className="mt-2 text-xs text-gray-600">
                                                    {item.label}
                                                  </div>
                                                </div>
                                              ))
                                            ) : (
                                              <div className="text-center w-full">
                                                No Data
                                              </div>
                                            )}
                                          </div>
                                          <ul className="flex justify-between items-center gap-4 flex-wrap mt-5">
                                            <li>
                                              <div className="flex items-center ">
                                                <GoDotFill
                                                  size={24}
                                                  className="text-purple-300"
                                                />
                                                <div>
                                                  <FaRegStar className="text-gray-400" />
                                                </div>
                                              </div>
                                            </li>
                                            <li>
                                              <div className="flex items-center ">
                                                <GoDotFill
                                                  size={24}
                                                  className="text-orange-300"
                                                />
                                                <div className="flex items-center gap-1">
                                                  <FaRegStar className="text-gray-400" />
                                                  <FaRegStar className="text-gray-400" />
                                                </div>
                                              </div>
                                            </li>
                                            <li>
                                              <div className="flex items-center ">
                                                <GoDotFill
                                                  size={24}
                                                  className="text-pink-300"
                                                />
                                                <div className="flex items-center gap-1">
                                                  <FaRegStar className="text-gray-400" />
                                                  <FaRegStar className="text-gray-400" />
                                                  <FaRegStar className="text-gray-400" />
                                                </div>
                                              </div>
                                            </li>
                                            <li>
                                              <div className="flex items-center ">
                                                <GoDotFill
                                                  size={24}
                                                  className="text-cyan-200"
                                                />
                                                <div className="flex items-center gap-1">
                                                  <FaRegStar className="text-gray-400" />
                                                  <FaRegStar className="text-gray-400" />
                                                  <FaRegStar className="text-gray-400" />
                                                  <FaRegStar className="text-gray-400" />
                                                </div>
                                              </div>
                                            </li>
                                            <li>
                                              <div className="flex items-center ">
                                                <GoDotFill
                                                  size={24}
                                                  className="text-yellow-200"
                                                />
                                                <div className="flex items-center gap-1">
                                                  <FaRegStar className="text-gray-400" />
                                                  <FaRegStar className="text-gray-400" />
                                                  <FaRegStar className="text-gray-400" />
                                                  <FaRegStar className="text-gray-400" />
                                                  <FaRegStar className="text-gray-400" />
                                                </div>
                                              </div>
                                            </li>
                                            <li>
                                              <div className="flex items-center">
                                                <GoDot
                                                  size={24}
                                                  className="text-gray-400"
                                                />
                                                <p className="text-[14px]">
                                                  Global Rate
                                                </p>
                                              </div>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>

                                      <div className="p-4 border rounded-[10px] mt-6">
                                        <h5 className="text-[16px] leading-none mb-4">
                                          Social interactions generated through
                                          campaigns
                                        </h5>
                                        <div className="flex flex-wrap justify-start lg:justify-between gap-x-4 gap-y-3 items-center text-gray-600 text-sm ">
                                          {/* Property follows */}
                                          <div className="flex gap-2 items-end">
                                            <AiOutlineHome size={24} />
                                            <div>
                                              <span className="text-purple-600 font-semibold">
                                                {campagin
                                                  ?.socialEstimation?.[1] || 0}
                                              </span>
                                              <p className="leading-tight">
                                                Property follows
                                              </p>
                                            </div>
                                          </div>

                                          {/* Property likes */}
                                          <div className="flex gap-2 items-end">
                                            <AiOutlineHeart size={24} />
                                            <div>
                                              <span className="text-purple-600 font-semibold">
                                                {campagin
                                                  ?.socialEstimation?.[0] || 0}
                                              </span>
                                              <p className="leading-tight">
                                                Property likes
                                              </p>
                                            </div>
                                          </div>

                                          {/* Property shares */}
                                          <div className="flex gap-2 items-end">
                                            <AiOutlineHeart size={24} />
                                            <div>
                                              <span className="text-purple-600 font-semibold">
                                                {/* {campagin?.socialEstimation?.[1]}2 */}
                                                2
                                              </span>
                                              <p className="leading-tight">
                                                Property shares
                                              </p>
                                            </div>
                                          </div>

                                          {/* Social estimations */}
                                          <div className="flex gap-2 items-end">
                                            <AiOutlineUser size={24} />
                                            <div>
                                              <span className="text-purple-600 font-semibold">
                                                {campagin
                                                  ?.socialEstimation?.[2] || 0}
                                              </span>
                                              <p className="leading-tight">
                                                Social estimations
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <p
                                        className="text-center text-[#976DD0] cursor-pointer text-[16px] mt-5"
                                        onClick={(e) => {
                                          setShowCampaign(!showCampaign);
                                          setCampaginId(item?.id || item?._id)
                                          getcampainDetail(item);
                                        }}
                                      >
                                        See all campaigns detailed estimations
                                        data
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#976DD0] bg-opacity-70 z-50 p-5 !pt-[80px]">
          <div className="bg-white max-w-3xl rounded-xl shadow-lg py-6 relative z-50 h-[90%] md:h-[72%] overflow-y-auto">
            <div className="">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl z-51"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>

              {/* Modal Header */}
              <h2 className="text-2xl font-semibold text-center mb-6">
                Start a new campaign
              </h2>
              <form>
                {/* Reference Price */}
                <div className="border-b pb-4 mb-4 px-6">
                  <div className="flex flex-col sm:flex-row items-end gap-3">
                    <div className="w-full">
                      <label className="block text-lg font-semibold text-[#000] mb-2">
                        Set your reference price:
                      </label>
                      <div className="flex items-center space-x-3 ">
                        <div className="relative w-full">
                          <input
                            type="number"
                            className="border border-gray-300 px-10 py-2 rounded-md w-full"
                            value={form?.referencePrice ?? ""}
                            onChange={(e) => {
                              setForm({
                                ...form,
                                referencePrice: e.target.valueAsNumber,
                              });
                            }}
                            required
                          />
                          <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                            €
                          </span>
                        </div>

                        <span className="text-gray-600 w-full">
                          {formatNumberWithSpaces(
                            getpricesqm(form?.referencePrice ?? 0)
                          )}{" "}
                          €/sqm
                        </span>
                      </div>
                      {showRefrenceer && !form?.referencePrice && (
                        <p className="text-red-500">
                          Please enter your reference price
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    The community will let you know what they think about this
                    reference price and how much they would pay for your
                    property.
                  </p>
                </div>

                {/* Campaign Duration */}
                <div className="px-6">
                  <label className="block text-lg font-semibold text-[#000] ">
                    Select campaign duration
                  </label>
                  <p className="text-sm text-gray-500 mb-4">
                    The more your campaign lasts the more answers you get.
                  </p>

                  {/* Duration Options */}
                  <div className="space-y-4">
                    {/* One day */}
                    <div className="flex justify-between items-center">
                      <span>One day</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {getAvailableCount(cards?.campaignStats?.DayCampaignLimit || 0,
                            user?.planId?.dailyCampaignLimit || 0)} available
                        </span>
                        {cards?.campaignStats?.DayCampaignLimit <
                          user?.planId?.dailyCampaignLimit ? (
                          <button
                            className="bg-purple-600 text-white px-4 py-1 rounded-md"
                            type="submit"
                            onClick={(e) => {
                              if (!form?.referencePrice) {
                                setShowRefrenceer(true);
                                return;
                              }
                              startCompagin(e, "1Day");
                              setcampaginType("1Day");
                            }}
                          >
                            Start campaign
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setcampaginType("1Day");
                              if (!form?.referencePrice) {
                                setShowRefrenceer(true);
                              } else {
                                setShowPuchaseModule(true);
                              }
                            }}
                            className="bg-gray-800 text-white min-w-[136px] px-3 py-1 rounded-md"
                          >
                            {dynamicCampagion?.oneDayCampaignPrice || 0} € Purchase
                          </button>
                        )}
                      </div>
                    </div>

                    {/* One week */}
                    <div className="flex justify-between items-center">
                      <span>One week</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {getAvailableCount(cards?.campaignStats?.WeekCampaignLimit || 0,
                            user?.planId?.weeklyCampaignLimit || 0)} available
                        </span>
                        {cards?.campaignStats?.WeekCampaignLimit <
                          user?.planId?.weeklyCampaignLimit ? (
                          <button
                            className="bg-purple-600 text-white px-4 py-1 rounded-md"
                            type="submit"
                            onClick={(e) => {
                              if (!form?.referencePrice) {
                                setShowRefrenceer(true);
                                return;
                              }
                              startCompagin(e, "1Week");
                              setcampaginType("1Week");
                            }}
                          >
                            Start campaign
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setcampaginType("1Week");
                              if (!form?.referencePrice) {
                                setShowRefrenceer(true);
                              } else {
                                setShowPuchaseModule(true);
                              }
                            }}
                            className="bg-gray-800 text-white px-3 min-w-[136px] py-1 rounded-md"
                          >
                            {dynamicCampagion?.oneWeekCampaignPrice || 0} € Purchase
                          </button>
                        )}
                      </div>
                    </div>

                    {/* One month */}
                    <div className="flex justify-between items-center">
                      <span>One month</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {getAvailableCount(cards?.campaignStats?.MonthCampaignLimit || 0,
                            user?.planId?.monthlyCampaignLimit || 0)} available
                        </span>
                        {cards?.campaignStats?.MonthCampaignLimit <
                          user?.planId?.monthlyCampaignLimit ? (
                          <button
                            className="bg-purple-600 text-white px-4 py-1 rounded-md"
                            type="submit"
                            onClick={(e) => {
                              if (!form?.referencePrice) {
                                setShowRefrenceer(true);
                                return;
                              }
                              startCompagin(e, "1Month");
                              setcampaginType("1Month");
                            }}
                          >
                            Start campaign
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setcampaginType("1Month");
                              if (!form?.referencePrice) {
                                setShowRefrenceer(true);
                              } else {
                                setShowPuchaseModule(true);
                              }
                            }}
                            className="bg-gray-800 text-white px-3 min-w-[136px] py-1 rounded-md"
                          >
                            {dynamicCampagion?.oneMonthCampaignPrice || 0} € Purchase
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

      )}
      {alertModal &&
        <div className="fixed inset-0 flex items-start justify-center bg-[#000] bg-opacity-50 z-[99]">
          <div className="bg-white md:w-[450px] rounded-xl shadow-lg pb-6 px-6 pt-4 relative">
            <div className="max-h-[80vh] overflow-y-auto">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
                onClick={() => setAlertModal(false)}
              >
                <IoMdClose />
              </button>
              <h3 className="text-center text-xl font-semibold mb-3">Alert</h3>
              <h5 className="text-center">Please list a property to start a campaigion</h5>
              <div className="flex justify-center gap-2 items-center mt-4">
                <button className="bg-[#976DD0] hover:opacity-70 rounded-full px-4 py-1.5 text-[#fff] font-semibold text-sm" onClick={() => navigate('/property1')}>List Property</button>
                <button className="border border-[#976DD0] bg-[#fff] hover:bg-[#976DD0] hover:text-[#fff] text-sm text-[#976DD0] rounded-full px-4 py-1.5 font-semibold" onClick={() => setAlertModal(false)}>Ok</button>
              </div>
            </div>
          </div>
        </div>
      }

      {showPuchaseModule && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#976DD0] bg-opacity-70 z-50 p-5 !pt-[80px]">
          <div className="bg-white max-w-3xl rounded-xl shadow-lg py-6 relative z-50 h-[90%] md:h-[72%] overflow-y-auto">
            <div className="">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
                onClick={(e) => setShowPuchaseModule(false)}
              >
                <IoMdClose />
              </button>

              {/* Modal Header */}
              <h2 className="text-2xl font-semibold text-center mb-3">
                Purchase campaign
              </h2>
              <form>
                {/* Reference Price */}
                <div className="border-b pb-4 mb-4 px-6">
                  <div className="">
                    <div className=" flex justify-between sm:items-center mb-4 mt-6 sm:flex-row flex-col items-start">
                      <h2 class="text-[18px] font-semibold  text-gray-700  tracking-[1.23px]">
                        Card Details
                      </h2>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsModalOpen(true);
                          // setSelectedCard(null)
                          // setCard({ id: 0, number: "", name: "", date: "", cvv: "", })
                        }}
                        className="py-2 text-[14px]  bg-[#976DD0] text-white rounded-md font-semibold hover:bg-transparent hover:text-[#976DD0] hover:border-[#976DD0] border border-transparent px-6  flex items-center sm:mt-0 "
                      >
                        <FaPlus className="me-2" />
                        Add New Card
                      </button>
                    </div>
                    <div className=" mb-4">
                      <div className="rounded-[12px] border p-3">
                        <div className="grid md:grid-cols-2 gap-4 ">
                          {allCards?.length > 0 ? (
                            allCards?.map((cardData) => (
                              <div className="relative h-[180px] rounded-2xl p-5 pt-2 text-white overflow-hidden bg-primary shadow-lg group cursor-pointer">
                                {/* Card content */}
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                  {/* Top row */}
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-2">
                                        {/* Radio Button */}
                                        {/* <input
                                          type="radio"
                                          name="selectedCard"
                                          checked={
                                            selectedCard?.id === cardData.id
                                          }
                                          onChange={() => {
                                            handleCardSelect(cardData.cardId)
                                          }

                                          }
                                          className="cursor-pointer accent-purple-200"
                                        /> */}
                                        <input
                                          type="radio"
                                          name="selectedCard"
                                          checked={selectedCard === cardData.id}
                                          onChange={() => {
                                            setSelectedCard(cardData.id || cardData?._id)
                                            handleCardSelect(cardData.id || cardData?._id);
                                          }}
                                          className="cursor-pointer accent-purple-200"
                                        />

                                      </div>
                                      {cardData.isPrimary && (
                                        <span className="text-xs bg-gray-300 text-black px-2 py-1 rounded shadow">
                                          Primary
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex gap-2 items-center">
                                      {/* Visa Logo */}
                                      <img
                                        src="/assets/img/visa.png"
                                        alt="Visa"
                                        className="w-[50px] h-auto"
                                      />
                                      {/* Delete Icon */}
                                      {!cardData.isPrimary && (
                                        <div
                                          onClick={() => deleteCard(cardData.cardId)}
                                          className="flex bg-red-500 text-[#fff] rounded-full p-2 hover:bg-red-400 transition-all duration-200"
                                        >
                                          <LuTrash />
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Card Number */}
                                  <div className="tracking-widest font-mono mt-2">
                                    {`************${cardData?.last4}` ||
                                      "4111 1111 1111 1111"}
                                  </div>

                                  {/* Bottom row */}
                                  <div className="flex justify-between text-sm font-light">
                                    <div>{cardData.cardHolder || "------"}</div>
                                    <div className="flex gap-4">
                                      <span>{`${cardData.exp_month}/${cardData.exp_year}`}</span>
                                      <span>{cardData.cvv || "•••"}</span>
                                    </div>
                                  </div>
                                </div>


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
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="">
                      <button
                        onClick={(e) => purchaseCampagion(e)}
                        className="py-2 bg-[#976DD0] text-white rounded-md font-semibold hover:bg-transparent hover:text-[#976DD0] hover:border-[#976DD0] border border-transparent px-6 ms-auto block"
                      >
                        Pay now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Campaign Duration */}
                <div className="px-6"></div>
              </form>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative">
            {stripePromise ? (
              <Elements stripe={stripePromise}>
                <AddNewCard
                  onClose={() => setIsModalOpen(false)}
                  getCards={getPaymentCards}
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
    </PageLayout>
  );
};

export default SocialEstimation;
