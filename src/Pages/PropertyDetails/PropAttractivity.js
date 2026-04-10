import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

const PropAttractivity = ({ detail,data, dropdownOptions, handleAccordionChange, acrArr }) => {
    return (
        <Accordion
            expanded={acrArr?.includes(1)}
            onChange={() => handleAccordionChange(1)}
            className="mb-5 border border-[#eaeaea] shadow-none "
        >
            <AccordionSummary
                expandIcon={<MdOutlineKeyboardArrowDown />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="p-3"
            >
                <Typography>
                <span className="py-0 text-[#976DD0] font-[600] text-[17px] p-4 w-full text-left flex items-center justify-between">
                        Property attractivity
                    </span>
                </Typography>
            </AccordionSummary>
            <AccordionDetails className="text-gray-500 p-4">
                <div>
                    <h4 className="text-[#47525E] font-[600] text-[20px] border-b border-[#D5D5D5] pb-2">
                        {" "}
                        Online visibility
                    </h4>
                    <div className="">
                        <ul className="flex  flex-wrap">
                            {detail?.likeCount && (
                                <li className="flex items-start w-1/3 my-5">
                                    <img
                                        src="assets/img/icons/heart.png"
                                        className="w-[20px] me-2 mt-[1px]"
                                        alt="heart"
                                    />
                                    <div>
                                        <h4 className="text-[#976DD0] font-[600] text-[21px] leading-[24px]">
                                            {detail?.likeCount}
                                        </h4>
                                        <p className="text-[#47525E]">Likes</p>
                                    </div>
                                </li>)}
                            {detail?.followerCount && (
                                <li className="flex items-start w-1/3 my-5">
                                    <img
                                        src="assets/img/icons/home-plus.png"
                                        className="w-[22px] me-2"
                                        alt="home-plus"
                                    />
                                    <div>
                                        <h4 className="text-[#976DD0] font-[600] text-[21px] leading-[24px]">
                                            {detail?.followerCount}
                                        </h4>
                                        <p className="text-[#47525E]">Followers</p>
                                    </div>
                                </li>)}
                            <li className="flex items-start w-1/3 my-5">
                                <img
                                    src="assets/img/icons/eye-b.png"
                                    className="w-[20px] me-2 mt-[1px]"
                                    alt="eye"
                                />
                                <div>
                                    <h4 className="text-[#976DD0] font-[600] text-[21px] leading-[24px]">
                                        {detail?.propertyDetail?.propertyViewerCount || 0}
                                    </h4>
                                    <p className="text-[#47525E]">Views</p>
                                </div>
                            </li>
                            <li className="flex items-start w-1/3 my-5">
                                <img
                                    src="assets/img/icons/share-b.png"
                                    className="w-[20px] me-2 mt-[1px]"
                                    alt="share-b"
                                />
                                <div>
                                    <h4 className="text-[#976DD0] font-[600] text-[21px] leading-[24px]">
                                       {data?.propertyDetail?.shareCount || 0}
                                    </h4>
                                    <p className="text-[#47525E]">Shares</p>
                                </div>
                            </li>
                            <li className="flex items-start w-1/3 my-5">
                                <img
                                    src="assets/img/icons/share-b.png"
                                    className="w-[20px] me-2 mt-[1px]"
                                    alt="share-b"
                                />
                                <div>
                                    <h4 className="text-[#976DD0] font-[600] text-[21px] leading-[24px]">
                                        {data?.totalInquries || 0}
                                    </h4>
                                    <p className="text-[#47525E]">Enquiries</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-7">
                    <h4 className="text-[#47525E] font-[600] text-[20px] border-b border-[#D5D5D5] pb-2">
                        {" "}
                        Property rating on social platforms
                    </h4>
                    <div className="">
                        <ul className="flex  flex-wrap">
                            {detail?.rating?.map((rat, i) => (
                                <li className="flex items-start w-1/3 my-5">
                                    <img
                                        src="assets/img/icons/star.png"
                                        className="w-[20px] me-2 mt-[1px]"
                                        alt="star"
                                    />
                                    <div>
                                        <h4 className="text-[#976DD0] font-[600] text-[21px] leading-[24px]">
                                            {rat?.rating_value}
                                        </h4>
                                        <p className="text-[#47525E]">
                                            {dropdownOptions?.find(dd => dd._id === rat?.type)?.name}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </AccordionDetails>
        </Accordion>
    )
}

export default PropAttractivity
