import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import environment from "../../environment";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { stringSeprator } from "../../models/string.model";

const Blogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([])
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState({ page: 1, count: 10 })

  const getBlogs = (f = {}) => {
    const dto = { ...filters, ...f }
    loader(true)
    ApiClient.get("blogs/listing", dto).then((res) => {
      if (res.success) {
        setBlogs(res?.data);
        setTotal(res?.total)
      }
      loader(false)
    });
  };
  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1;
    setFilters((prev) => ({ ...prev, page: newPage }));
    getBlogs({ ...filters, page: newPage });
  };

  useEffect(() => {
    getBlogs();
    scrollToTop()
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToDetail = (itm) => {
    navigate(`/blog-detail?id=${itm?._id || itm?.id}`)
  }

  return (
    <PageLayout>
      <section className="py-14 lg:py-16 bg-[#f9f9f9]">
        <div className="container items-center  px-8 mx-auto xl:px-5">
          <div className="grid grid-cols-12 ">
            <div className="col-span-12  mb-[40px]">
              <h2 className="text-[#47525E] lg:text-[25px] text-[20px] font-[600] ">
                Real estate news
                <span className="bg-[#976DD0] w-[35px] h-[6px] rounded-[10px] block"></span>
              </h2>
            </div>
            <div className="col-span-12  ">
              <div className="grid grid-cols-12 gap-4">
                {blogs?.length > 0 ?
                  blogs?.map((itm, i) => (
                    <div
                      onClick={() => navigateToDetail(itm)}
                      className="lg:col-span-3 md:col-span-6 col-span-12 bg-white h-[380px] rounded-[10px] cursor-pointer">
                      <img
                        src={`${environment.api}img/${itm?.images[0]}`}
                        alt=""
                        className="rounded-tl-[10px] rounded-tr-[10px] h-[240px] w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/assets/img/placeholder.png";
                        }}
                      />
                      <p className="px-7 py-4 text-[#47525E] lg:text-[17px] text-[14px] ellipses_four"
                        dangerouslySetInnerHTML={{
                          __html: stringSeprator(itm?.description, 150)
                        }}>
                      </p>
                    </div>
                  )) : (
                    <div className="text-center col-span-12  text-[#47525E] tracking-[.95px]">
                      <img src="assets/img/no-data.png" alt="no-data" className="w-[130px] mx-auto mb-3" />
                      No Blogs Found
                    </div>
                  )}
              </div>
            </div>
            <div className="col-span-12 flex items-center justify-center mt-5">
              <div className={`paginationWrapper flex justify-between w-full ${total > filters?.count ? '' : 'd-none'}`}>
                <span>Show {blogs?.length} from {total} Blogs</span>
                <ReactPaginate
                  previousLabel="<<"
                  nextLabel=">>"
                  breakLabel="..."
                  pageRangeDisplayed={2}
                  marginPagesDisplayed={1}
                  pageCount={Math.ceil(total / filters?.count)}
                  onPageChange={handlePageChange}
                  forcePage={filters.page - 1}
                  containerClassName={"pagination flex"}
                  pageClassName={"pagination-item"}
                  activeClassName={"pagination-item-active"}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Blogs;
