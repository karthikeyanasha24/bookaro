import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { generateDynamicString } from "../../models/string.model";

const CommonCreteria = ({
    allfilters,
    total,
    handleSortBy,
}) => {
    const sortByArray = [
        { name: "Price", value: "land_value", options: [{ label: "High to low", value: "asc" }, { label: "Low to high", value: "des" },] },
        { name: "Surface", value: "lot1_surface_carrez", options: [{ label: "High to low", value: "asc" }, { label: "Low to high", value: "des" },] },
        // { name: "Rating", value: "rating", options: [{ label: "High to low", value: "asc" }, { label: "Low to high", value: "des" },] },
    ]
    const getMenuButtonLabel = () => {
        if (!allfilters.sortBy) return "Sort By";
        const [sortKey, sortOrder] = allfilters.sortBy.split(" ");
        const selectedSort = sortByArray.find((item) => item.value === sortKey);
        const selectedOption = selectedSort?.options.find((opt) => opt.value === sortOrder);
        return selectedSort && selectedOption
            ? `${selectedSort.name} - ${selectedOption.label}`
            : "Sort By";
    };


    return (
        <div className="col-span-12">
            <p className="text-[#47525E]">
                <span className="text-[#47525E] font-bold text-[20px]">
                    {total} results </span>
                {`${generateDynamicString(allfilters) ? 
                    `for ${generateDynamicString(allfilters)} `:``}`}
                in past transactions.
            </p>
            <div className="mt-5 flex items-center md:mb-0 mb-5">
                <div className=" ">
                    <h4 className="text-[#47525E] text-[18px] font-[600] mb-4 w-[200px]">
                        Sorting results
                    </h4>
                    <div className="">
                        <Menu>
                            <MenuButton className=" inline-flex items-center gap-2 rounded-md  py-1.5 px-3 text-sm/6 font-semibold text-[#736f6f] border border-[#736f6f] ">
                                {getMenuButtonLabel()}<ChevronDownIcon className="size-4 fill-black/60" /></MenuButton>
                            <MenuItems anchor="bottom start" className="z-[9999]">
                                <MenuItem>
                                    <div className="w-52 origin-top-right rounded-xl border bg-white px-3 py-2 shadow-md border text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0">
                                        {sortByArray?.map(itm => (
                                            <>
                                                <div className="mb-2">
                                                    <p className="block data-[focus]:bg-blue-100 font-[600] text-[#404040]">
                                                        {itm.name}
                                                    </p>
                                                    <ul>
                                                        {itm.options.map(option => (
                                                            <li
                                                                onClick={() => handleSortBy(itm.value, option.value,)} 
                                                                className="text-[#736f6f] cursor-pointer">{option?.label}</li>
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
    )
}

export default CommonCreteria
