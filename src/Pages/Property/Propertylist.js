import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { CommonCreteria } from "./commonCreteria/commonCreteria";
import PropertyCard from "./PropertyCard";

const PropertiesList = ({
  data,
  isLiked,
  total,
  filters,
  handlePageChange,
  handleAccountTypeChange,
  accountType,
  disLiked,
  allfilters,
  isFollow,
  navigateToDetail,
  handleSortBy,
  toggleDropdown,
  dropdownIndex,
  editItem,
  deleteItem,
  dropdownRefs,
  favourites,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="">
        <div className="bg-[#f9f9f9] py-10">
          <div className=" items-center  mx-auto container lg:px-10 px-6 ">
            {favourites && (
              <ul className="flex items-center pb-[30px]">
                <li onClick={() => navigate("/project")} className="text-[#47525E] cursor-pointer after">
                  My Project
                  <span className="mx-[4px]">|</span></li>

                <li className="text-[#47525E] cursor-pointer capitalize font-[600]">
                  Interacted Properties</li>
              </ul>
            )}
            <div className="grid grid-cols-12 gap-8">
              <CommonCreteria
                total={total}
                accountType={accountType}
                handleAccountTypeChange={handleAccountTypeChange}
                allfilters={allfilters}
                handleSortBy={handleSortBy}
              />
              <div className="col-span-12 lg:mb-0 mb-4">
                <div className="grid grid-cols-12 bg-[#f9f9f9] gap-4">
                  {data?.length > 0 ? data.map((item, index) => {
                    let price = parseInt(item?.price || 0);
                    let sur = parseInt(item?.surface || 0);
                    let perSqr;
                    if (sur > 0) {
                      perSqr = price / sur;
                    }
                    return (
                      <div key={index} className="relative my-10 xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12  lg:mb-0 mb-4 ">
                        <PropertyCard
                          item={item}
                          navigateToDetail={navigateToDetail}
                          toggleDropdown={toggleDropdown}
                          editItem={editItem}
                          deleteItem={deleteItem}
                          price={price}
                          perSqr={perSqr}
                          isFollow={isFollow}
                          disLiked={disLiked}
                          isLiked={isLiked}
                          dropdownRefs={dropdownRefs}
                          index={index}
                          dropdownIndex={dropdownIndex}
                        />
                      </div>
                    )
                  }) :   <div className="text-center col-span-12 my-8">
                  <img src="assets/img/no-data.svg" className="w-[400px] mx-auto "/>
                  No Records Found
                </div>}
                </div>
                <div className={`paginationWrapper flex md:flex-row flex-col ${total > filters?.count ? '' : 'd-none'}`}>
                  <span className="md:mb-0 mb-2">Show {data?.length} from {total} Properties</span>
                  <ReactPaginate
                    previousLabel="< "
                    nextLabel=" >"
                    breakLabel="..."
                    pageRangeDisplayed={1}
                    marginPagesDisplayed={1}
                    pageCount={Math.ceil(total / filters?.count)}
                    onPageChange={handlePageChange}
                    forcePage={filters?.page - 1}
                    containerClassName={"pagination flex"}
                    pageClassName={"pagination-item"}
                    activeClassName={"pagination-item-active"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertiesList;
