import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { formatCurrency } from "../../models/string.model";

const PropGoodToKnow = ({ detail, gtk, acrArr, handleAccordionChange }) => {
    const { t } = useTranslation();

    let PropertyCount = Math.round(gtk.PropertyCount);
    let gardenPercent = Math.round(gtk.gardenPercent);
    let terracePercent = Math.round(gtk.terracePercent);
    let UsersInArea = Math.round(gtk.UsersInArea);
    let averageRooms = Math.round(gtk.averageRooms);
    let averageGarden = Math.round(gtk.averageGarden);
    let averageTerrace = Math.round(gtk.averageTerrace);
    let averageMonthlyCharges = Math.round(+gtk.averageMonthlyCharges / +detail?.surface);
    let averageSalePrice = Math.round(+gtk.averageSalePrice / +detail?.surface);

    return (
        <Accordion
            expanded={acrArr?.includes(7)}
            onChange={() => handleAccordionChange(7)}
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
                        {t("propertyTimeline.tabs.goodToKnow")}
                    </span>
                </Typography>
            </AccordionSummary>
            <AccordionDetails className="text-gray-500 p-4">
                <div>
                    <ul className="">
                        <li className="flex items-center justify-between my-3">
                            <p className="text-[#47525E] text-[17px] w-[80%]">
                                {t("propertyDetails.averagePricePerSqmNeighborhood")}
                            </p>
                            <h6 className="bg-[#B9A2D8] p-1 rounded-[4px]">
                                <p className="bg-[#976DD0] p-1 text-center rounded-[4px] text-white w-[100px] font-[600] font-[16px] ">
                                    {`${formatCurrency(averageSalePrice) || 0} €`}
                                </p>
                            </h6>
                        </li>
                        <li className="flex items-center justify-between my-3">
                            <p className="text-[#47525E] text-[17px] w-[80%]">
                                {t("propertyDetails.averageRentPerSqmNeighborhood")}
                            </p>
                            <h6 className="bg-[#B9A2D8] p-1 rounded-[4px]">
                                <p className="bg-[#976DD0] p-1 text-center rounded-[4px] text-white w-[100px] font-[600] font-[16px] ">
                                    {`${formatCurrency(averageMonthlyCharges) || 0} €`}
                                </p>
                            </h6>
                        </li>
                        <li className="flex items-center justify-between my-3">
                            <p className="text-[#47525E] text-[17px] w-[80%]">
                                {t("propertyDetails.usersLookingInArea")}
                            </p>
                            <h6 className="bg-[#B9A2D8] p-1 rounded-[4px]">
                                <p className="bg-[#976DD0] p-1 text-center rounded-[4px] text-white w-[100px] font-[600] font-[16px] ">
                                    {formatCurrency(UsersInArea) || 0}
                                </p>
                            </h6>
                        </li>
                        <li className="flex items-center justify-between my-3">
                            <p className="text-[#47525E] text-[17px] w-[80%]">
                                {t("propertyDetails.usersLookingSameType")}
                            </p>
                            <h6 className="bg-[#B9A2D8] p-1 rounded-[4px]">
                                <p className="bg-[#976DD0] p-1 text-center rounded-[4px] text-white w-[100px] font-[600] font-[16px] ">
                                    {formatCurrency(PropertyCount) || 0}
                                </p>
                            </h6>
                        </li>
                        <li className="flex items-center justify-between my-3">
                            <p className="text-[#47525E] text-[17px] w-[80%]">
                                {t("propertyDetails.propertiesWithTerrace", { percent: terracePercent })}
                            </p>
                            <h6 className="bg-[#B9A2D8] p-1 rounded-[4px]">
                                <p className="bg-[#976DD0] p-1 text-center rounded-[4px] text-white w-[100px] font-[600] font-[16px] ">
                                    {formatCurrency(averageTerrace) || 0}
                                </p>
                            </h6>
                        </li>
                        <li className="flex items-center justify-between my-3">
                            <p className="text-[#47525E] text-[17px] w-[80%]">
                                {t("propertyDetails.propertiesWithGarden", { percent: gardenPercent })}
                            </p>
                            <h6 className="bg-[#B9A2D8] p-1 rounded-[4px]">
                                <p className="bg-[#976DD0] p-1 text-center rounded-[4px] text-white w-[100px] font-[600] font-[16px] ">
                                    {formatCurrency(averageGarden) || 0}
                                </p>
                            </h6>
                        </li>
                        <li className="flex items-center justify-between my-3">
                            <p className="text-[#47525E] text-[17px] w-[80%]">
                                {t("propertyDetails.roomsInNeighborhood", { rooms: formatCurrency(averageRooms) || 0 })}
                            </p>
                            <h6 className="bg-[#B9A2D8] p-1 rounded-[4px]">
                                <p className="bg-[#976DD0] p-1 text-center rounded-[4px] text-white w-[100px] font-[600] font-[16px] ">
                                    {formatCurrency(averageRooms) || 0}
                                </p>
                            </h6>
                        </li>
                    </ul>
                </div>
            </AccordionDetails>
        </Accordion>
    )
}

export default PropGoodToKnow
