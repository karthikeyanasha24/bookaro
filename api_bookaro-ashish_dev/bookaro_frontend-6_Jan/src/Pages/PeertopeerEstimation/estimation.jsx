import PageLayout from "../../components/global/PageLayout";
import { FaHeart, FaLocationDot, FaRegHeart } from "react-icons/fa6";
import { IoBedOutline, IoEyeOffOutline } from "react-icons/io5";
import { GiCrane } from "react-icons/gi";
import { GoGift, GoHistory, GoHome } from "react-icons/go";
import { LuLayers } from "react-icons/lu";
import { LiaBathSolid } from "react-icons/lia";
import { RiHome2Fill, RiHome2Line } from "react-icons/ri";
import ReactStars from "react-rating-stars-component";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaShareAlt } from "react-icons/fa";
import socket from "../../config/ChatSocket/socket";
import "swiper/css";
import "swiper/css/navigation";
import "./styles.css";
import ApiClient from "../../methods/api/apiClient";
import { toast } from "react-toastify";
import loader from "../../methods/loader";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import NewImageSlider from "./NewImageSlider";
import GooglePlaceAutoComplete from "../../components/common/GooglePlaceAutoComplete";
import addressModel from "../../models/address.model";
import { useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import FlwModal from "../../components/common/Modal/FlwModal";
import LoginModal from "../../components/common/Modal/LoginModal";
import { useNavigate } from "react-router-dom";

const Estimation = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    referencePrice: "underestimated",
    userReasonablePrice: 0,
  });
  const history = useNavigate()
  const { user } = useSelector((state) => state);
  const [inputKey, setInputKey] = useState(0);
  const [currentLocation, setCurrentLocation] = useState("");
  const [location, setLocation] = useState([]);
  const [activeImg, setActiveImg] = useState(1);
  const [page, setPage] = useState(1);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
  const [flwModal, setflwModal] = useState(false);
  const [flwItem, setflwItem] = useState(null);
  const [loginModal, setloginModal] = useState(false);
  const [keyData, setkeydata] = useState(false);


  // Function to check location permission and handle location
  const isFollow = (itm, key) => {
    if (!user?.loggedIn) return setloginModal(true);
    if (!itm?.followunfollows_details) {
      setflwItem(itm)
      setkeydata(key)
      return setflwModal(true);
    }
    // const isliked = itm?.follow ? false : true;
    let method = "put";
    let url = `followUnfollow/update`;
    let value = {
      user_id: user?._id,
      property_id: itm?._id || itm?.id,
      follow_unfollow: key == "follow" ? true : false,
      p2pFollow: key == "follow" ? true : "",
    };
    if (key == "unfollow") {
      delete value.p2pFollow;
    }
    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        const updatedData = data.map((d) =>
          d._id === itm._id || d.id === itm.id
            ? { ...d, isFollowed: key == "follow" ? true : false }
            : d
        );
        setData(updatedData);
      } else toast.error(res.message);
      loader(false);
    });
  };

  useEffect(() => {
    if (user?.loggedIn) {
      const checkLocationPermission = () => {
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
          if (result.state === "granted") {
            // Permission already granted, fetch location
            getCurrentLocation();
          } else if (result.state === "prompt") {
            // Request permission
            navigator.geolocation.getCurrentPosition(
              () => getCurrentLocation(),
              () => {
                // Permission denied or error, open modal
                setIsOpen(true);
              }
            );
          } else if (result.state === "denied") {
            // Permission denied, open modal
            setIsOpen(true);
          }
        });
      };

      const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              // Use reverse geocoding to get address from coordinates
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAKfggcT7n5Am8itXpW4quDGO3pqCzsfwM`
              );
              const data = await response.json();
              if (data.results && data.results.length > 0) {
                const address = data.results[0].address_components;
                const cityObj = address.find((item) =>
                  item.types.includes("locality") || item.types.includes("administrative_area_level_3")
                );
                const zipObj = address.find((item) =>
                  item.types.includes("postal_code")
                );
                let newAdress = `${cityObj?.long_name || ""}, ${zipObj?.long_name || ""}`;
                const newLocation = {
                  name: newAdress, // Now this is a string
                  zipcode: zipObj?.short_name || "",
                };
                setLocation([newLocation]);
                setCurrentLocation(newAdress);
                setInputKey((prevKey) => prevKey + 1);
                setIsOpen(true); // Open modal to show location
              }
            } catch (error) {
              console.error("Error fetching address:", error);
              setIsOpen(true); // Open modal on error
            }
          },
          () => {
            // Error getting location, open modal
            setIsOpen(true);
          }
        );
      };

      checkLocationPermission();
    } else {
      history("/login")
    }

  }, []);

  const formatNumberWithSpaces = (num) => {
    if (num === null || num === undefined || isNaN(num)) return "0";

    const number = Math.abs(parseInt(num, 10));
    const isNegative = num < 0;

    let str = number.toString();

    if (str.length <= 3) {
      return isNegative ? `-${str}` : str;
    }

    let formatted = str.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    return isNegative ? `-${formatted}` : formatted;
  };

  const openShareModal = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setShareEmail("");
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setSelectedPropertyId(null);
  };

  const handleShare = () => {
    if (!shareEmail || !selectedPropertyId) {
      toast.error("Please enter a valid email");
      return;
    }
    const payload = {
      email: shareEmail,
      propertyId: selectedPropertyId,
      userId: user?._id || user?.id,
    };
    loader(true);
    ApiClient.post("property/shareProperty", payload).then((res) => {
      if (res.success) {
        toast.success("Property shared successfully");
        closeShareModal();
      } else {
        toast.error(res.message);
      }
      loader(false);
    });
  };

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    // setData([])
  }

  const handleImageClick = (item, index) => {
    setSelectedProperty(item);
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedProperty(null);
  };

  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.destroy();
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    fetchData();

    socket.on("est-prop-list", (res) => {
      setData(res?.data || []);
      setIsLoading(false);
    });

    return () => {
      socket.off("est-prop-list");
    };
  }, []);

  const fetchData = (p) => {
    const payload = {
      ...p,
      count: 6,
      loggedInUser: user?.id || user?._id,
    };
    socket.emit("est-prop-list", payload);
  };

  const calculateRenovation = (arr = []) => {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    return arr.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      return sum + price;
    }, 0);
  };

  const calculateRevenue = (arr = []) => {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    const total = arr.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      return sum + price;
    }, 0);
    return total / arr.length;
  };

  const getpricesqm = (refprice) => {
    let price = parseInt(refprice?.referencePrice || 8000000);
    let sur = parseInt(refprice?.surface || 0);
    let perSqr;
    if (sur > 0) {
      perSqr = price / sur;
    }
    return perSqr;
  };

  const getrangePrice = (sqmPrice, item) => {
    let price = sqmPrice;
    let sur = item?.surface || 0;
    let perSqr = 0;
    if (sur > 0) {
      perSqr = price * sur;
    }
    return parseInt(perSqr);
  };

  const handleEstimate = (item, index) => {
    const payload = {
      ...form,
      propertyId: item?._id || item?.id,
      currentPropReferencePrice: item?.referencePrice || 8000000,
      currentPricePerSqm: parseInt(getpricesqm(item)),
      userReasonablePrice:
        form?.userReasonablePrice == 0 || form?.userReasonablePrice == null
          ? item?.referencePrice || 8000000
          : form?.userReasonablePrice,
      referencePrice:
        form?.referencePrice == "" ? "underestimated" : form?.referencePrice,
    };
    loader(true);
    ApiClient.post("peerCampaign/submit/estimation", payload).then((res) => {
      if (res.success) {
        toast.success(res?.message);
        setForm({
          referencePrice: "",
          userReasonablePrice: 0,
          ratePropertyTitle: 0,
          ratePropertyPictures: 0,
          rateInteriorDesign: 0,
          rateLocation: 0,
          rateCouldYouLiveIn: 0,
        });
        handleSkip(); // Use the skip handler after successful submission
      }
      loader(false);
    });
  };

  const handleSkip = () => {
    if (!swiperInstance) return;

    // Reset form
    setForm({
      referencePrice: "underestimated",
      userReasonablePrice: 0,
      ratePropertyTitle: 0,
      ratePropertyPictures: 0,
      rateInteriorDesign: 0,
      rateLocation: 0,
      rateCouldYouLiveIn: 0,
      comment: ""
    });

    const currentIndex = swiperInstance.activeIndex;
    const totalSlides = data.length;

    if (currentIndex >= totalSlides - 1) {
      setIsLoading(true);
      const nextPage = page + 1;
      setPage(nextPage);

      const payload = {
        page: nextPage,
        count: 6,
        loggedInUser: user?.id || user?._id,
        // zipcode: location.map((item) => item.zipcode),
      };

      socket.emit("est-prop-list", payload);

      setTimeout(() => {
        if (swiperInstance) {
          swiperInstance.slideTo(0);
        }
      }, 500);
    } else {
      swiperInstance.slideNext();
      setCurrentPropertyIndex(prev => prev + 1);
    }
  };

  const getLocation = (location) => {
    const loactions = [];
    if (location?.lat || location?.lng) {
      loactions.push({
        lat: parseFloat(location?.lat),
        lng: parseFloat(location?.lng),
        exactLocation: true,
        icon: "/assets/img/prop/placeholder.png",
      });
    }
    return loactions;
  };

  const addressResult = async (e) => {
    let address = {};
    if (e.place) {
      address = await addressModel.getAddress(e.place);
    }
    const name = `${e.value}`;
    const newLocation = {
      name: name,
      zipcode: address?.zipcode,
    };
    setLocation([...location, newLocation]);
    setCurrentLocation("");
    setInputKey((prevKey) => prevKey + 1);
  };

  const getData = () => {
    let result = {
      zipcode: location.map((item) => item.zipcode),
    };
    fetchData(result);
    close();
  };

  const isLiked = (itm, key = "like") => {
    let method = "put";
    let url = `favorites/edit`;
    let value = {
      user_id: user?._id,
      property_id: itm?._id || itm?.id,
      like: key == "like" ? true : false,
      p2pLike: key == "like" ? true : "",
    };
    if (key == "unlike") {
      delete value.p2pLike;
    }
    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        const updatedData = data.map((d) =>
          d._id === itm._id || d.id === itm.id
            ? { ...d, isLiked: key == "like" ? true : false }
            : d
        );
        setData(updatedData);
      } else toast.error(res.message);
      loader(false);
    });
  };

  const getAvrgRating = (rating) => {
    const average = rating.reduce((sum, r) => sum + Number(r.rating_value), 0) / rating.length;
    return average
  }

  // const isFollow = (itm, key) => {
  //   let method = "put";
  //   let url = `followUnfollow/update`;
  //   let value = {
  //     user_id: user?._id,
  //     property_id: itm?._id || itm?.id,
  //     follow_unfollow: key == "follow" ? true : false,
  //     p2pFollow: key == "follow" ? true : "",
  //   };
  //   if (key == "unfollow") {
  //     delete value.p2pFollow;
  //   }
  //   loader(true);
  //   ApiClient.allApi(url, value, method).then((res) => {
  //     if (res.success) {
  //       const updatedData = data.map((d) =>
  //         d._id === itm._id || d.id === itm.id
  //           ? { ...d, isFollowed: key == "follow" ? true : false }
  //           : d
  //       );
  //       setData(updatedData);
  //     } else toast.error(res.message);
  //     loader(false);
  //   });
  // };

  return (
    <PageLayout>
      <section className="bg-[#F7F3FC] pb-10 min-h-[calc(100vh-200px)]">
        <Swiper
          onSwiper={(swiper) => {
            setSwiperInstance(swiper);
          }}
          className="mySwiper"
          loop={false}
          allowTouchMove={false}
          slidesPerView={1}
          spaceBetween={20}
          onSlideChange={(swiper) => {
            setCurrentPropertyIndex(swiper.activeIndex);
          }}
        // onReachEnd={() => {
        //   console.log("Reached end of slides, fetching more data...");
        //   if (!isLoading) {
        //     handleSkip();
        //   }
        // }}
        >
          {data?.length > 0 ? (
            data.map((item, index) => (
              <SwiperSlide key={`${item._id || item.id}-${index}`}>
                <div className="container mx-auto px-5 pt-4 md:pt-7">
                  <div className="relative mb-5 flex flex-wrap gap-y-2 justify-between items-center sm:block">
                    <h5 className="text-[34px] leading-[38px] font-[700] text-[#2D1B4E] sm:text-center">
                      Peer To Peer Estimation
                    </h5>
                    <button
                      className="sm:absolute right-0 top-2 bg-[#976DD0] hover:opacity-80 flex items-center gap-1 rounded-[8px] px-4 py-2 text-[#fff] text-[13px] font-[600]"
                      onClick={(e) => open()}
                    >
                      Edit Location <FaLocationDot />
                    </button>
                  </div>
                  <div className="md:flex items-start gap-4 ">
                    <div className="md:w-[70%] mb-5 md:mb-0">
                      <div className="bg-[#fff] md:flex md:h-[526px] rounded-[18px] border border-[#ECE7F4] shadow-sm">
                        <div className="w-[100%] rounded-[20px] overflow-hidden lg:w-[50%] xl:w-[65%] h-[450px] md:h-[100%] relative estimation-slider property_list">
                          <NewImageSlider
                            images={item?.images}
                            setActiveImg={setActiveImg}
                            location={getLocation(item?.location)}
                            slideClick={(index) =>
                              handleImageClick(item, index)
                            }
                            onLastSlide={() =>
                              console.log("Reached the last image!")
                            }
                          />
                        </div>

                        <div className="flex flex-col justify-between">
                          <div className="p-4 md:pt-14">
                            <h4 className="text-[#5A5A5A] text-[18px]">
                              {item?.propertyTitle}
                            </h4>
                            <p className="text-[#B7B7B7] text-[14px]">
                              {item?.address}
                            </p>
                            <p className="text-[#000] font-[600] text-[14px] capitalize">
                              {item?.propertyType}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-3">
                              <p className="text-[16px] text-gray-500 flex gap-1 items-center">
                                <GoHome size={20} className="text-[#000]" />{" "}
                                {item?.surface}m2
                              </p>
                              <p className="text-[16px] text-gray-500 flex gap-1 items-center">
                                <LuLayers
                                  size={20}
                                  className="text-[#000]"
                                />{" "}
                                {item?.propertyFloor}/
                                {item?.totalFloorBuilding} floors
                              </p>
                              <p className="text-[16px] text-gray-500 flex gap-1 items-center">
                                <IoBedOutline
                                  size={20}
                                  className="text-[#000]"
                                />{" "}
                                {item?.bedrooms}
                              </p>
                              <p className="text-[16px] text-gray-500 flex gap-1 items-center">
                                <LiaBathSolid
                                  size={20}
                                  className="text-[#000]"
                                />{" "}
                                {item?.bathroom}
                              </p>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1 mt-2">
                              <div className="flex justify-between">
                                <span>Reference price:</span>{" "}
                                <span className="font-semibold">
                                  {formatNumberWithSpaces(
                                    item?.referencePrice || 8000000
                                  )}{" "}
                                  €
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Price/sqm:</span>{" "}
                                <span className="font-semibold">
                                  {formatNumberWithSpaces(
                                    parseInt(getpricesqm(item))
                                  )}{" "}
                                  €
                                </span>
                              </div>
                              <div className="flex justify-between mt-2">
                                <span>Avg yearly revenue:</span>{" "}
                                <span className="font-semibold">
                                  {formatNumberWithSpaces(
                                    calculateRevenue(item?.revenue_detail)
                                  )}{" "}
                                  €
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Renovation performed:</span>{" "}
                                <span className="font-semibold">
                                  {formatNumberWithSpaces(
                                    calculateRenovation(
                                      item?.renovation_work
                                    )
                                  )}{" "}
                                  €
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Online attractivity:</span>{" "}
                                <span>4.5</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Social rating:</span>
                                <span>{item?.rating?.length > 0 ? getAvrgRating(item?.rating) : 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>DPE:</span>{" "}
                                <span className="font-semibold">B</span>
                              </div>
                            </div>
                          </div>
                          <div className="border-t p-4 flex justify-center gap-6 items-center">
                            {item?.isFollowed ? (
                              <button>
                                <RiHome2Fill
                                  className="text-[#976DD0]"
                                  size={20}
                                  onClick={(e) =>
                                    isFollow(item, "unfollow")
                                  }
                                />
                              </button>
                            ) : (
                              <button>
                                <RiHome2Line
                                  size={20}
                                  onClick={(e) => isFollow(item, "follow")}
                                />
                              </button>
                            )}

                            {item?.isLiked ? (
                              <button
                                onClick={(e) => isLiked(item, "unlike")}
                              >
                                <FaHeart
                                  className="text-[#976DD0]"
                                  size={18}
                                />
                              </button>
                            ) : (
                              <button
                                onClick={(e) => isLiked(item, "like")}
                              >
                                <FaRegHeart size={18} />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                openShareModal(item?._id || item?.id)
                              }
                            >
                              <FaShareAlt
                                size={18}
                                className="text-[#976DD0]"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-[30%]">
                      <div className="h-full bg-[#fff] rounded-[18px] ml-auto p-4 border border-[#ECE7F4] shadow-sm">
                        <h4 className="text-center text-[18px] font-[600] leading-tight text-[#5A5A5A]">
                          What do you think about this property?
                        </h4>
                        <h5 className="text-[16px] text-[#47525E] mb-2 text-center">
                          You think reference price is:
                        </h5>
                        <div className="flex flex-wrap lg:flex-nowrap justify-center items-center gap-2 mb-3">
                          {[
                            "underestimated",
                            "appropriate",
                            "expensive",
                          ].map((type) => (
                            <button
                              key={type}
                              className={`${form?.referencePrice === type
                                ? "bg-[#976DD0] text-[#fff]"
                                : "bg-[#E6E6E6] text-[#000]"
                                } rounded-[6px] px-3 py-1 text-[12px] `}
                              onClick={() =>
                                setForm({ ...form, referencePrice: type })
                              }
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                          ))}
                        </div>

                        <h5 className="text-[15px] text-[#47525E] text-center">
                          What would be a reasonable price?
                        </h5>
                        <h5 className="text-[15px] text-[#47525E] mb-0 text-center font-[600]">
                          {formatNumberWithSpaces(
                            form?.userReasonablePrice == 0
                              ? getrangePrice(getpricesqm(item), item)
                              : getrangePrice(
                                form?.userReasonablePrice,
                                item
                              )
                          )}{" "}
                          €
                        </h5>

                        <div className="w-full max-w-md mx-auto mb-2">
                          <div className="flex justify-between items-center px-2 mb-2 text-gray-600 font-bold select-none">
                            <button
                              onClick={() => {
                                const basePrice = getpricesqm(item) || 0;
                                const currentPrice =
                                  form?.userReasonablePrice || basePrice;
                                const minPrice = parseInt(basePrice * 0.7);
                                setForm({
                                  ...form,
                                  userReasonablePrice: Math.max(
                                    currentPrice - 100,
                                    minPrice
                                  ),
                                });
                              }}
                              aria-label="Decrease"
                              className="cursor-pointer border rounded-full flex justify-center items-center w-[25px] h-[25px] text-gray-400"
                            >
                              −
                            </button>
                            <div className="text-center mt-2 text-gray-600 font-medium">
                              {formatNumberWithSpaces(
                                form?.userReasonablePrice ||
                                getpricesqm(item)
                              )}{" "}
                              €
                            </div>
                            <button
                              onClick={() => {
                                const basePrice = getpricesqm(item) || 0;
                                const currentPrice =
                                  form?.userReasonablePrice || basePrice;
                                const maxPrice = parseInt(basePrice * 1.3);
                                setForm({
                                  ...form,
                                  userReasonablePrice: Math.min(
                                    currentPrice + 100,
                                    maxPrice
                                  ),
                                });
                              }}
                              aria-label="Increase"
                              className="cursor-pointer border rounded-full flex justify-center items-center w-[25px] h-[25px] text-gray-400"
                            >
                              +
                            </button>
                          </div>
                          <input
                            type="range"
                            min={parseInt(getpricesqm(item) * 0.7)}
                            max={parseInt(getpricesqm(item) * 1.3)}
                            step="100"
                            value={
                              form?.userReasonablePrice ||
                              parseInt(getpricesqm(item))
                            }
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              const basePrice = getpricesqm(item) || 0;
                              const minPrice = parseInt(basePrice * 0.7);
                              const maxPrice = parseInt(basePrice * 1.3);
                              setForm({
                                ...form,
                                userReasonablePrice: Math.min(
                                  Math.max(value, minPrice),
                                  maxPrice
                                ),
                              });
                            }}
                            className="w-full h-4 rounded-full cursor-pointer bg-[#9b51e0] appearance-none focus:outline-none accent-[#fff]"
                          />
                        </div>

                        <h5 className="text-[16px] text-[#47525E]">
                          How would you rate:
                        </h5>
                        <div className="rating-section">
                          {[
                            {
                              name: "Property title",
                              key: "ratePropertyTitle",
                            },
                            {
                              name: "Property pictures",
                              key: "ratePropertyPictures",
                            },
                            {
                              name: "Property interior design",
                              key: "rateInteriorDesign",
                            },
                            {
                              name: "Property location",
                              key: "rateLocation",
                            },
                            {
                              name: "Could you live in?",
                              key: "rateCouldYouLiveIn",
                            },
                          ].map((itm, i) => (
                            <div
                              key={i}
                              className="flex justify-between gap-4 items-center flex-row"
                            >
                              <div className="flex items-center w-[100%]">
                                <label className="block text-[14px] text-[#47525E] font-[600]">
                                  {itm.name}
                                </label>
                              </div>
                              <div className="relative  w-[100%]">
                                <ReactStars
                                  count={5}
                                  size={19}
                                  value={form[itm.key] || 0}
                                  isHalf={true}
                                  emptyIcon={
                                    <i className="far fa-star"></i>
                                  }
                                  halfIcon={
                                    <i className="fa fa-star-half-alt"></i>
                                  }
                                  className='leading-none'
                                  fullIcon={<i className="fa fa-star"></i>}
                                  activeColor="#976DD0"
                                  onChange={(newRating) =>
                                    setForm((prev) => ({
                                      ...prev,
                                      [itm.key]: newRating,
                                    }))
                                  }
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="">
                          <textarea
                            className="bg-white rounded-[7px] border-gray-300 border-[1px] outline-none focus:border-[#976DD0] p-2 px-3  md:w-[500px] w-full mb-2 mt-1 text-[#5A5A5A]"
                            placeholder="Advice/Comment for owner"
                            rows={2}
                            type="text"
                            value={form.comment}
                            onChange={(e) => {
                              setForm({
                                ...form,
                                comment: e.target.value,
                              });
                            }}
                          ></textarea>
                        </div>

                        <div className="flex flex-wrap justify-center items-center gap-2 ">
                          <button
                            className="bg-[#976DD0] rounded-full hover:opacity-80 px-6 py-1 text-[14px] text-[#fff]"
                            onClick={() => handleEstimate(item, index)}
                          >
                            Submit
                          </button>
                          <button
                            className="text-gray-500 font-[500] text-[16px] hover:underline"
                            onClick={() => handleSkip()}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Loading...' : 'Skip'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <>
              <div className="relative mb-6 sm:mt-10 flex flex-wrap gap-y-2 justify-between items-center sm:block">
                <h5 className="text-[34px] leading-[38px] font-[700] text-[#2D1B4E] sm:text-center">
                  Peer To Peer Estimation
                </h5>
                <button
                  className="sm:absolute right-0 top-2 bg-[#976DD0] hover:opacity-80 flex items-center gap-1 rounded-[8px] px-4 py-2 text-[#fff] text-[13px] font-[600]"
                  onClick={(e) => open()}
                >
                  Edit Location <FaLocationDot />
                </button>
              </div>
              <div className="md:flex items-start gap-4 min-h-[calc(100vh-260px)]">
                <div className="md:w-[70%] mb-5 md:mb-0">
                  <div className="bg-[#fff] md:flex md:h-[526px] rounded-[18px] border border-[#ECE7F4] shadow-sm overflow-hidden">
                    <div className="w-[100%] lg:w-[50%] xl:w-[65%] h-[260px] md:h-full bg-gradient-to-br from-[#B79AD9] to-[#8E6DC7] flex items-center justify-center text-white text-[14px] font-[600]">
                      Property image preview
                    </div>
                    <div className="flex-1 p-5">
                      <h4 className="text-[#5A5A5A] text-[20px] font-[600]">No property available yet</h4>
                      <p className="text-[#8B93A1] text-[14px] mt-1">
                        Local database has no peer-to-peer estimation records right now.
                      </p>
                      <div className="mt-4 space-y-2 text-[14px] text-[#6B7280]">
                        <p><span className="font-[600] text-[#47525E]">Reference price:</span> -</p>
                        <p><span className="font-[600] text-[#47525E]">Price/sqm:</span> -</p>
                        <p><span className="font-[600] text-[#47525E]">Avg yearly revenue:</span> -</p>
                        <p><span className="font-[600] text-[#47525E]">Social rating:</span> -</p>
                      </div>
                      <div className="mt-6 text-[13px] text-[#976DD0] font-[600]">
                        {isLoading ? "Loading properties..." : "Waiting for local property data"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-[30%]">
                  <div className="h-full bg-[#fff] rounded-[18px] ml-auto p-4 border border-[#ECE7F4] shadow-sm">
                    <h4 className="text-center text-[18px] font-[600] text-[#5A5A5A]">
                      What do you think about this property?
                    </h4>
                    <p className="text-center text-[13px] text-[#8B93A1] mt-2">
                      Estimation controls will appear once property data is available.
                    </p>
                    <div className="mt-4 bg-[#F7F3FC] rounded-[12px] p-3">
                      <p className="text-[12px] text-[#6B7280]">Tip</p>
                      <p className="text-[13px] text-[#47525E] mt-1">
                        Use populated API/local DB data to get the full interactive estimation panel.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Swiper>

        <Button
          onClick={open}
          className="rounded-md hidden bg-black/20 px-4 py-2 text-sm font-medium text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-black/30"
        >
          Open dialog
        </Button>

        <Dialog
          open={isOpen}
          as="div"
          className="relative z-10 focus:outline-none"
          onClose={close}
        >
          <div className="fixed bg-[#976DD0] bg-opacity-70 inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel
                transition
                className="relative w-full max-w-md rounded-xl bg-white border py-10 px-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
              >
                <button
                  className="outline-none text-[#000] absolute top-5 right-5"
                  onClick={close}
                >
                  <IoMdClose />
                </button>

                <DialogTitle as="h3" className="text-center font-[700] mb-4">
                  <h4 className="text-[18px] font-medium mb-1">Real estate markets you know</h4>
                  <p className="text-gray-500 text-xs leading-tight font-medium">
                    Select cities you are aware of real estate market to provide
                    with relevant peer-to-peer estimations
                  </p>
                </DialogTitle>
                <div className="px-8">
                  <div className=" border-[1px] border-[#976DD0] rounded-[12px] flex items-center google_address mt-7 estimation-google">
                    <GooglePlaceAutoComplete
                      key={inputKey}
                      value={currentLocation}
                      result={addressResult}
                      placeholder="Enter location you want to search..."
                      id="address"
                    />
                  </div>
                  <div className="flex items-center mt-2 flex-wrap">
                    {location.map((loc, index) => (
                      <div
                        key={index}
                        className={`flex pointer items-center py-1 px-2 me-2 mb-2 rounded-[4px] text-white
                                  ${loc?.added ? "bg-[#73339B]" : "bg-[#976DD0]"
                          }`}
                      >
                        <p
                          className="text-white text-[14px] me-2 cursor-pointer"
                          onClick={() => {
                            let data = [...location];
                            data[index] = { ...loc, added: !loc.added };
                            setLocation(data);
                          }}
                        >
                          {loc?.name}
                        </p>
                        <button
                          onClick={() => {
                            let locs = [...location];
                            let data = locs.filter((_, i) => i !== index);
                            setLocation(data);
                          }}
                          className=" text-white"
                        >
                          <i className="fa fa-times text-[12px] "></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-gray-400 text-xs leading-tight mb-3">
                    You can always update this setting later
                  </p>
                  <Button
                    className="inline-flex items-center gap-2 rounded-full bg-primary hover:opacity-80 px-5 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                    onClick={(e) => getData()}
                  >
                    Apply
                  </Button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
        <Dialog
          open={isImageModalOpen}
          as="div"
          className="relative z-20 focus:outline-none"
          onClose={closeImageModal}
        >
          <div className="fixed top-14 bg-black bg-opacity-70 inset-0 z-20 w-screen overflow-y-auto">
            <div className="flex h-[598px] items-center justify-center p-4">
              <DialogPanel
                transition
                className="relative w-full h-full max-w-4xl rounded-xl  border duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
              >
                <button
                  className="outline-none bg-[#fff] text-[#000] absolute top-5 right-5 z-[999]"
                  onClick={closeImageModal}
                >
                  <IoMdClose size={24} />
                </button>
                {selectedProperty && (
                  <>
                    <NewImageSlider
                      images={selectedProperty?.images}
                      setActiveImg={setActiveImg}
                      location={getLocation(selectedProperty?.location)}
                      slideClick={(index) =>
                        handleImageClick(selectedProperty, index)
                      }
                      onLastSlide={() => console.log("Reached the last image!")}
                    />
                  </>
                )}
              </DialogPanel>
            </div>
          </div>
        </Dialog>
        <Dialog
          open={isShareModalOpen}
          as="div"
          className="relative z-30 focus:outline-none"
          onClose={closeShareModal}
        >
          <div className="fixed bg-black bg-opacity-70 inset-0 z-30 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel
                transition
                className="relative w-full max-w-md rounded-xl bg-white border p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
              >
                <button
                  className="outline-none text-[#000] absolute top-5 right-5"
                  onClick={closeShareModal}
                >
                  <IoMdClose size={24} />
                </button>
                <DialogTitle as="h3" className="text-center font-[700] mb-4">
                  <h4 className="text-[18px]">Share Property</h4>
                  <p className="text-gray-400 text-sm leading-tight">
                    Enter an email address to share this property
                  </p>
                </DialogTitle>
                <div className="mt-3">
                  <input
                    type="email"
                    className="w-full border-[1px] border-gray-300 rounded-[4px] p-2 outline-none focus:border-[#976DD0]"
                    placeholder="Enter email address"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                </div>
                <div className="mt-6 text-center">
                  <Button
                    className="inline-flex items-center gap-2 rounded-full bg-[#976DD0] hover:opacity-80 px-5 py-1.5 text-sm/6 font-semibold text-white"
                    onClick={handleShare}
                  >
                    Share
                  </Button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </section>
      <FlwModal
        flwModal={flwModal}
        setflwModal={setflwModal}
        flwItem={flwItem}
        refetch={isFollow}
        existData={true}
        keyData={keyData}
        data={data}
        setData={setData}
      />
      <LoginModal
        loginModal={loginModal}
        setloginModal={setloginModal}
      />
    </PageLayout>
  );
};

export default Estimation;