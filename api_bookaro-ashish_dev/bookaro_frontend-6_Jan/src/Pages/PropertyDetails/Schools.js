import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { GoDotFill } from "react-icons/go";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const School = ({ detail, gtk, acrArr, handleAccordionChange }) => {
  return (
    <Accordion
      expanded={acrArr?.includes(5)}
      onChange={() => handleAccordionChange(5)}
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
            Schools
          </span>
        </Typography>
      </AccordionSummary>
      <AccordionDetails className="text-gray-500 p-4 pt-0">
        <div>
          <ul className="">
            {detail && detail?.linkedSchools?.length > 0 ? (
              detail?.linkedSchools?.map((item) => {
                return (
                  <li className="flex items-center justify-between mb-3">
                    <h6 className="rounded-[4px] flex gap-1.5 items-center ps-2">
                      <GoDotFill size={14} />{item?.EstablishmentName}
                    </h6>
                  </li>
                );
              })
            ) : (
              <div className="text-center">No data</div>
            )}
          </ul>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default School;
