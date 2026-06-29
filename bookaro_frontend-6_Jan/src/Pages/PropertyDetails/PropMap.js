import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { MdOutlineKeyboardArrowDown, MdOutlineLocationOn } from 'react-icons/md';
import CustomMap from "../Property/CustomMap";
import { useSelector } from "react-redux";

const PropMap = ({ locations, detail, handleAskLoc, acrArr, handleAccordionChange }) => {
    const user = useSelector((state) => state.user);
    const locationInfo = `${detail?.address || "Location not specified"}`;

    return (
        <Accordion
            expanded={acrArr?.includes(6)}
            onChange={() => handleAccordionChange(6)}
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
                        Property location
                    </span>
                </Typography>
            </AccordionSummary>
            <AccordionDetails className="text-gray-500 p-4">
                {detail?.exactLocation &&
                    <div className="flex items-start mb-8">
                        <MdOutlineLocationOn className="text-[18px] mt-1 me-1" />
                        <div className="">
                            <h4 className="text-[#000] font-[600] text-[17px]">Location</h4>
                            <p className="text-[#616161] text-[14px] capitalize">{locationInfo}</p>
                        </div>
                    </div>
                }
                <div>
                    <CustomMap
                        locations={locations}
                        radius={120}
                    />
                </div>
                {(!detail?.exactLocation && (user?._id !== detail?.addedBy)) &&
                    <div className="flex justify-center items-center">
                        <button className="text-[#47525E] border border-[#976DD0] rounded-[50px] py-2 px-10 mt-8 font-[600]"
                            onClick={() => handleAskLoc()}
                        >Request exact location</button>
                    </div>}
            </AccordionDetails>
        </Accordion>
    )
}

export default PropMap
