import {
  Checkbox,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { formatCurrency, generateDynamicString } from "../../../models/string.model";

export const CommonCreteria = ({
  total,
  accountType,
  handleAccountTypeChange,
  allfilters,
  handleSortBy,
}) => {
  const sortByArray = [
    {
      name: "Price",
      value: "price",
      options: [
        { label: "High to low", value: "asc" },
        { label: "Low to high", value: "des" },
      ],
    },
    {
      name: "Revenue",
      value: "revenues",
      options: [
        { label: "High to low", value: "asc" },
        { label: "Low to high", value: "des" },
      ],
    },
    {
      name: "Rating",
      value: "rating",
      options: [
        { label: "High to low", value: "asc" },
        { label: "Low to high", value: "des" },
      ],
    },
  ];

  const getMenuButtonLabel = () => {
    if (!allfilters.sortBy) return "Sort By";
    const [sortKey, sortOrder] = allfilters.sortBy.split(" ");
    const selectedSort = sortByArray.find((item) => item.value === sortKey);
    const selectedOption = selectedSort?.options.find(
      (opt) => opt.value === sortOrder
    );
    return selectedSort && selectedOption
      ? `${selectedSort.name} - ${selectedOption.label}`
      : "Sort By";
  };

  return (
    <div className="col-span-12">
      <div className="flex items-center justify-between">
        <p className="text-[#47525E]">
          <span className="text-[#47525E] font-bold text-[20px]">
            {formatCurrency(total) || 0}
            {`${allfilters?.accountType === "pro"
                ? " Professional"
                : allfilters?.accountType === "individual"
                  ? " Individual"
                  : ""
              } Propert${total > 1 ? "ies" : "y"
              } 
              ${generateDynamicString(allfilters) ?
                `for ${generateDynamicString(allfilters)}` : ""}`
            }
          </span>
        </p>
      </div>

      <div className="mt-5 flex md:items-center md:flex-row flex-col items-start">
        <div>
          <h4 className="text-[#47525E] text-[18px] font-[600] mb-4">
            Filter property profiles
          </h4>
          <div className="flex md:items-center md:flex-row flex-col items-start">
            <div className="flex items-center">
              <Checkbox
                checked={accountType === ""}
                onChange={() => handleAccountTypeChange("")}
                className="group block size-6 rounded-full border bg-white border-[#73339B] data-[checked]:bg-[#73339B]"
              >
                <svg
                  className="stroke-white opacity-0 group-data-[checked]:opacity-100 p-1 w-[22px]"
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
              <p className="text-[#47525E] ms-2 text-[18px] mr-4">
                All{" "}
                {/* {allfilters?.accountType == "individual" ? `(${total})` : ""} */}
              </p>
            </div>
            <div className="flex items-center md:my-0 my-2">
              <Checkbox
                checked={accountType === "individual"}
                onChange={() => handleAccountTypeChange("individual")}
                className="group block size-6 rounded-full border bg-white border-[#73339B] data-[checked]:bg-[#73339B]"
              >
                <svg
                  className="stroke-white opacity-0 group-data-[checked]:opacity-100 p-1"
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
              <p className="text-[#47525E] ms-2 text-[18px]">
                Individuals{" "}
                {/* {allfilters?.accountType == "individual" ? `(${total})` : ""} */}
              </p>
            </div>
            <div className="flex items-center md:ms-4 ms-0">
              <Checkbox
                checked={accountType === "pro"}
                onChange={() => handleAccountTypeChange("pro")}
                className="group block size-6 rounded-full border border-[#73339B] bg-white data-[checked]:bg-[#73339B]"
              >
                <svg
                  className="stroke-white opacity-0 group-data-[checked]:opacity-100 p-1"
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
              <p className="text-[#47525E] ms-2 text-[18px]">
                Professional{" "}
                {/* {allfilters?.accountType == "pro" ? `(${total})` : ""} */}
              </p>
            </div>
          </div>
        </div>
        <div className=" md:ms-20 ms-0 md:mt-0 mt-4 md:pb-0 pb-4">
          <h4 className="text-[#47525E] text-[18px] font-[600] mb-4 w-[200px]">
            Sorting results
          </h4>
          <div className="">
            <Menu>
              <MenuButton className=" inline-flex items-center gap-2 rounded-md  py-1.5 px-3 text-sm/6 font-semibold text-[#736f6f] border border-[#736f6f] ">
                {getMenuButtonLabel()}
                <ChevronDownIcon className="size-4 fill-black/60" />
              </MenuButton>
              <MenuItems anchor="bottom start" className="z-[9999]">
                <MenuItem>
                  <div className="w-52 origin-top-right rounded-xl border bg-white px-3 py-2 shadow-md border text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0">
                    {sortByArray?.map((itm) => (
                      <>
                        <div className="mb-2">
                          <p className="block data-[focus]:bg-blue-100 font-[600] text-[#404040]">
                            {itm.name} {}
                          </p>
                          <ul>
                            {itm.options.map((option) => (
                              <li
                                onClick={() =>
                                  handleSortBy(itm.value, option.value)
                                }
                                className="text-[#736f6f] cursor-pointer"
                              >
                                {option?.label}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ))}
                  </div>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};
