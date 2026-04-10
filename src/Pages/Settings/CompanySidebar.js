import { Checkbox } from '@headlessui/react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import methodModel from '../../methods/methods';
import { removeHTMLTags, stringSeprator } from '../../models/string.model';

const CompanySidebar = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const getFirstActiveDayWorkingHours = () => {
        const activeDay = user?.openingHours?.find(hour => !hour.isDayOff);
        if (activeDay) {
            const { startTime, endTime, day } = activeDay;
            if (startTime && endTime) return `${day}: ${startTime} - ${endTime}`;
            else return `${day}`;
        }
        return "";
    };

    let sLen = user?.servicesYouOffer?.length;
    const linksArr = [
        {
            main: "Company details", sub: user?.role === "agency"
                ? user?.companyName : `Real estate ${user?.role}`,
            link: "/profile/company-details"
        },
        { main: "Contact details", sub: user?.companyEmail, link: "/profile/contact-details" },
        { main: "About company", sub: stringSeprator(removeHTMLTags(user?.about), 20), link: "/profile/about" },
        {
            main: "Team", sub: user?.team?.length > 0
                ? `${user?.team?.length}  member${user?.team?.length > 1 ? "s" : ""}` : "", link: "/profile/team"
        },
        {
            main: "Services", sub: sLen > 0
                ? `${sLen}  service${sLen > 1 ? "s" : ""}` : "", link: "/profile/services"
        },
        { main: "Opening hours", sub: getFirstActiveDayWorkingHours(), link: "/settings/work-hour" },
    ]
    const checkSection = (thing) => {
        if (!thing || (Array.isArray(thing) && thing.length === 0)) return false
        else return true
    }

    return (
      <div className="xl:col-span-4 lg:col-span-5 col-span-12 ">
        <ul className="lg:mt-16 mt-0 mb-0 md:mb-0">
          <li
            className="border border-[#BEBEBE] p-3 rounded-[5px] bg-white mb-4 hover:bg-[#986dcd] hover:border-white cursor-pointer hover:text-white group transition flex justify-between  flex-col relative"
            onClick={() => navigate("/profile/company-logo")}
          >
            <img
              alt=""
              src={methodModel.noImg(user?.companyLogo)}
              className="rounded-[5px] w-full object-cover h-[200px]"
            />
            <div className="flex items-center justify-between py-3 ">
              <h4 className="text-[#47525E] font-bold lg:text-[18px] text-[16px] mb-1 group-hover:text-white">
                Logo and cover image
              </h4>
              <div className="pe-5">
                <FaArrowRightLong className="w-[20px] group-hover:text-white" />
              </div>
              {user?.companyLogo && user?.coverImage && (
                <div className="absolute -top-2 -right-4">
                  <Checkbox
                    checked={true}
                    className="group shrink-0 block size-6 me-2 rounded-[50px] border-[1px] border-[#976DD0] data-[checked]:bg-[#986dcd] p-1"
                  >
                    <svg
                      className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M3 8L6 11L11 3.5"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Checkbox>
                </div>
              )}
            </div>
          </li>
          {linksArr.map((itm, i) => {
            return (
              <li
                className="border border-[#BEBEBE] p-3 rounded-[5px] bg-white mb-4 hover:bg-[#986dcd] hover:border-white cursor-pointer hover:text-white group transition flex justify-between items-center relative"
                onClick={() => navigate(itm.link)}
              >
                <div>
                  <h4 className="text-[#47525E] font-bold lg:text-[18px] text-[16px] mb-1 group-hover:text-white">
                    {itm.main}
                  </h4>
                  <p className="text-[#47525E] lg:text-[18px] text-[16px] font-medium mb-2 group-hover:text-white truncate-text">
                    {itm.sub}
                  </p>
                </div>

                <div className="pe-5">
                  <FaArrowRightLong className="w-[20px] group-hover:text-white" />
                </div>
                {checkSection(itm.sub) && (
                  <div className="absolute -top-2 -right-4">
                    <Checkbox
                      checked={checkSection(itm.sub)}
                      className="group shrink-0 block size-6 me-2 rounded-[50px] border-[1px] border-[#976DD0] data-[checked]:bg-[#986dcd] p-1"
                    >
                      <svg
                        className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Checkbox>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
}

export default CompanySidebar
