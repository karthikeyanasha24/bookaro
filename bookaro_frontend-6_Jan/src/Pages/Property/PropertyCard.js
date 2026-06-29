import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import ImageSlider from "../../components/common/ImageSlider";
import {
  capLetter,
  formatCurrency,
  imagePath,
} from "../../models/string.model";
import DirectMsgModal from "../PropertyDetails/DirectMsgModal";
import { useState } from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

const PropertyCard = ({
  item,
  navigateToDetail,
  toggleDropdown,
  editItem,
  deleteItem,
  price,
  perSqr,
  isFollow,
  disLiked,
  isLiked,
  dropdownRefs,
  index,
  dropdownIndex,
}) => {
  const { user } = useSelector((state) => state);
  const [directMsg, setdirectMsg] = useState(false);
  const [detail, setDetail] = useState();
  const [defaultMsg, setDefaultMsg] = useState("");

  const handleChat = (data) => {

    setDetail(data);
    if (user.loggedIn) {
      setDefaultMsg("");
      return setdirectMsg(true);
    } else {
      //   setloginModal(true);
    }
  };
  return (
    <>
      <DirectMsgModal
        directMsg={directMsg}
        setdirectMsg={setdirectMsg}
        detail={detail}
        defaultMsg={defaultMsg}
        setDefaultMsg={setDefaultMsg}
      />
      <div className="absolute -top-10 z-[6] flex items-start left-[10px]">
        <img
          src={
            item?.addedBy_details?.image
              ? imagePath(item?.addedBy_details?.image)
              : "assets/img/prop-logo.png"
          }
          className="  w-[60px] h-[60px] object-cover border border-[#8492A6] rounded-[10px]"
          alt=""
        />
        <p className="text-[#47525E] ms-2 mt-2 text-[14px]">{item?.addedBy_details?.fullName}</p>
      </div>
      <div className="border border-[#D2D2D2] rounded-[12px] lg:mb-0 mb-4 bg-white relative property_list">
        <ImageSlider
          images={item?.images}
          slideClick={(e) => navigateToDetail(item)}
        />
        {item?.propertyType == "directory" && <div className="z-[99] absolute top-[30px] left-0 px-3 py-1 rounded-r-[6px] bg-[#976DD0] text-[#fff] font-semibold sm:text-[14px] text-[12px] ">
          #OpentopProposals
        </div>}

        <div className="p-3 relative cursor-pointer border-b">
          <div onClick={() => navigateToDetail(item)}>
            <div className="flex justify-between relative">
              {item?.propertyTitle && (
                <h2 className="cursor-pointer text-[#47525E] text-[16px] font-bold mt-2 capitalize ellipses mb-1 me-2">
                  {item?.propertyTitle}
                </h2>
              )}
            </div>
            {/* {(item?.city || item?.country) && (
                            <p className="text-[#47525E] text-[14px] ellipses mt-1">
                                {item?.city || item?.country} {item?.zipcode ? "," + item?.zipcode : ""}
                            </p>
                        )} */}
            <p className="text-[#47525E] text-[14px] ellipses mt-1">
              {item?.address}
            </p>
            <ul className="flex items-center mt-3">
              {+item?.surface > 0 && (
                <li className="flex items-center me-5">
                  <img
                    src="assets/img/prop/home.png"
                    alt=""
                    className="w-[17px] h-[17px] me-1"
                  />
                  <p className="text-[#47525E] text-[14px]">
                    {formatCurrency(item?.surface)} m2
                  </p>
                </li>
              )}
              {+item?.rooms > 0 && (
                <li className="flex items-center me-5">
                  <img
                    src="assets/img/prop/bed.png"
                    alt=""
                    className="w-[17px] h-[17px] me-1"
                  />
                  <p className="text-[#47525E] text-[14px]">{item?.rooms}</p>
                </li>
              )}
              {+item?.toilets > 0 && (
                <li className="flex items-center">
                  <img
                    src="assets/img/prop/tub.png"
                    alt=""
                    className="w-[17px] h-[17px] me-1"
                  />
                  <p className="text-[#47525E] text-[14px]">{item?.toilets}</p>
                </li>
              )}
            </ul>
          </div>
          {/* Three-dot menu */}
          {user?._id === item?.addedBy && dropdownRefs && (
            <div
              ref={(el) => (dropdownRefs.current[index] = el)}
              className="absolute top-2 right-2"
            >
              <button
                onClick={() => toggleDropdown(index)}
                className="focus:outline-none"
              >
                <img
                  src="assets/img/dots.png"
                  alt="Options"
                  className="w-[20px] h-[20px]"
                />
              </button>
              {dropdownIndex === index && (
                <div className="absolute bg-white  rounded-[7px] shadow-lg mt-1 -left-[70px]">
                  <ul>
                    <li
                      onClick={() => editItem(item)}
                      className="p-2 px-4 cursor-pointer hover:bg-gray-100 flex items-center"
                    >
                      {" "}
                      <FiEdit className="me-2 text-[15px]" />
                      <span className="text-[14px] text-[#333]">Edit</span>
                    </li>
                    <li
                      onClick={() => deleteItem(item)}
                      className="p-2 px-4 cursor-pointer hover:bg-gray-100 flex items-center"
                    >
                      {" "}
                      <AiOutlineDelete className="me-2" />
                      <span className="text-[14px] text-[#333]">Delete</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-0 p-3">
          {item?.propertyType === "directory" ? (
            <>
              <h5 className="text-[#6D6E6D] text-[17px] font-bold capitalize flex justify-between items-center">
                Directory
              </h5>
              <span className="text-[#47525E] text-[13px] capitalize font-[400]">
                {capLetter(item?.usedAs)}
              </span>
            </>
          ) : item?.propertyType === "offmarket" ? (
            <h5 className="text-[#6D6E6D] text-[17px] font-bold capitalize flex justify-between items-center">
              Off-Market
            </h5>
          ) : item?.propertyType === "rent" ? (
            <>
              <p className="text-[#6D6E6D] text-[12px] font-[600]">Rental</p>
              {item?.propertyMonthlyCharges && (
                <h5 className="text-[#6D6E6D] text-[20px] font-bold">
                  {formatCurrency(item?.propertyMonthlyCharges)} €
                  <span className="text-[#47525E] text-[13px] "> / month</span>
                </h5>
              )}
            </>
          ) : (
            <>
              {+price > 0 ? (
                <>
                  <p className="text-[#6D6E6D] text-[12px] font-[600]">
                    For Sale
                  </p>
                  <h5 className="text-[#6D6E6D] text-[17px] font-bold flex justify-between items-center">
                    {formatCurrency(price)} €
                    {+perSqr > 0 && (
                      <span className="text-[#47525E] text-[13px]  font-[400]">
                        {perSqr?.toFixed(2)} {" €/sqm"}
                      </span>
                    )}
                  </h5>
                </>
              ) : null}
            </>
          )}
        </div>
        {item?.propertyType === "offmarket" && item?.proposal && (
          <div className=" flex items-center mb-3">
            <div className="bg-[#976DD0] mx-auto py-[6px] ps-2 rounded-xl text-[13px] pe-4 text-white  font-[600] relative">
              <p>{`#Opento${item?.proposal === "both" ? "" : `${item?.proposal}`
                }proposals`}</p>
            </div>
          </div>
        )}
        <div className="bg-[#e6e6e675] p-3">
          <ul className="flex items-center justify-center">
            <li className="flex items-center mx-2">
              <img
                src="assets/img/icons/heart-blue.png"
                alt=""
                className="w-[15px] h-[15px] me-[4px]"
              />
              <p className="text-[#343F4B] text-[14px]">
                {item?.likeCount || 0}
              </p>
            </li>
            <li className="flex items-center mx-2">
              <img
                src="assets/img/icons/eye-blue.png"
                alt=""
                className="w-[15px] h-[15px] me-[4px]"
              />
              <p className="text-[#343F4B] text-[14px]">{item?.propertyViewerCount || 0}</p>
            </li>
            <li className="flex items-center mx-2">
              <img
                src="assets/img/icons/share-blue.png"
                alt=""
                className="w-[15px] h-[15px] me-[4px]"
              />
              <p className="text-[#343F4B] text-[14px]"> {item?.shareCount || 0}</p>
            </li>
            <li className="flex items-center mx-2">
              <img
                src="assets/img/icons/user-blue.png"
                alt=""
                className="w-[15px] h-[15px] me-[4px]"
              />
              <p className="text-[#343F4B] text-[14px]">
                {item?.followerCount || 0}
              </p>
            </li>
          </ul>
        </div>
        <div>
          <ul className="flex items-center justify-center p-3">
            {user?._id !== item?.addedBy && (
              <li className="mx-3 cursor-pointer">
                <p onClick={() => isFollow(item)}>
                  <img
                    src={`assets/img/${item?.followunfollows_details
                        ? "fill-house"
                        : "lined-house"
                      }.svg`}
                    alt=""
                    className="w-[25px]"
                  />
                </p>
              </li>
            )}
            <li className="mx-3 cursor-pointer">
              <p
                onClick={() =>
                  item?.favourite_details ? disLiked(item) : isLiked(item)
                }
              >
                <img
                  src={`assets/img/${item?.favourite_details ? "fill-heart" : "lined-heart"
                    }.svg`}
                  alt=""
                  className="w-[25px]"
                />
              </p>
            </li>
            {/* {user?._id !== item?.addedBy && (
              <li className="mx-3 cursor-pointer">
                <p
                  onClick={() => {
                    handleChat(item);
                  }}
                >
                  <IoChatboxEllipsesOutline className="w-[40px] h-[25px]" />
                </p>
              </li>
            )} */}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PropertyCard;
