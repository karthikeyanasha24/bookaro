import PageLayout from "../../components/global/PageLayout";
import loader from "../../methods/loader";
import ApiClient from "../../methods/api/apiClient";
import { useState, useEffect } from "react";
import { imagePath } from "../../models/string.model";
import { Link, useNavigate } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";

const BlogOwning = () => {

  const [blogs, setBlogs] = useState([]);
  const history = useNavigate()
  const [category, setcategory] = useState([]);
  const [filters, setFilter] = useState({ page: 1, search: "" });
  const params = new URLSearchParams(window.location.search);
  const paramId = params.get("id");
  const Searchparam = params.get("search");
  const getRecent = (p = {}) => {
    loader(true);
    let payload = { ...filters}
    if(Searchparam)
    {
      payload={
        ...payload,
        search:Searchparam
      }
    }
   payload = { ...filters, ...p, categoryId: paramId }
    ApiClient.get("blogs/listing", payload).then((res) => {
      if (res.success) {
        let data = res?.data 
        setBlogs(data);
      }
      loader(false);
    });
  };

  const getCategory = (id) => {
    loader(true);
    ApiClient.get("blogCategories/list", { page: 1 }).then((res) => {
      if (res.success) {
        let data = res?.data
        setcategory(data);
      }
      loader(false);
    });
  };

  const clear = (search) => {
    let f = {}
    if (search) {
      f = {
        search: "",
        page: 1,
      }
    }
    setFilter({ ...filters, search: "" })
    getRecent({ ...f }); 
  };

  const filter = (p = {}) => {
    let f = { page: 1, ...p }
    setFilter({ ...filters, ...f });
    getRecent({ ...f });
  };

  useEffect(() => {
    getRecent()
    scrollToTop();
    getCategory()
  }, []);


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <PageLayout>
      <section className="bg-[#f9f9f9] pb-10 min-h-[calc(100vh-350px)]">
        <div className="bg-[#fff]">
          <div className="container mx-auto p-5 mb-5">
            <div className="flex justify-between item-center gap-4 flex-wrap">
              <div className="flex items-center flex-wrap gap-4">
                <h3 className="text-[#47525E] text-[16px] font-semibold border-r border-gray-100 pe-5 cursor-pointer" onClick={() => {
                  history("/blog-detail")
                }
                }>Real estate like a pro center</h3>
                <ul className="flex items-center gap-8 flex-wrap text-[#976DD0]">
                  {category?.map((cat) => (
                    <li
                      key={cat?.id || cat?._id}
                      onClick={() => {
                        history(`/blog-detail?categoryId=${cat?.id || cat?._id}`)
                      }
                      }
                    >
                      <Link className={`${(paramId == cat?._id) ? "font-bold text-[#976DD0]" : "text-[#000] font-[400]"}`}>{cat?.CategoryName}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <form className="flex items-center max-w-sm gap-2" onSubmit={(e) => { e.preventDefault(); filter(); }}>
                  <label htmlFor="simple-search" className="sr-only">Search pro tips</label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      id="simple-search"
                      value={filters.search}
                      onChange={(e) => setFilter({ ...filters, search: e.target.value })}
                      className="!border-0 !bg-[#F0F0F0] !ps-9 px-2 py-2 rounded-lg !placeholder-[#7C62A1]"
                      placeholder="Search pro tips"
                    />
                    <IoSearchSharp className="absolute top-1/2 transform-all -translate-y-1/2 left-3" />
                    {filters?.search && (
                      <i className="fa fa-times absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" aria-hidden="true" onClick={(e) => clear("search")}></i>
                    )}
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="container items-center  px-8 mx-auto xl:px-5">
          <h1 className="font-semibold text-[36px] text-[#47525E] leading-tight capitalize">
            {(paramId && filters?.search == "") ? blogs[0]?.categoryData?.CategoryName : "Result of your search"}
          </h1>
          <h5 className="text-[#343F4B] text-[16px] font-semibold leading-tight mb-1">
            {blogs?.length} traning contents
          </h5>
          <p className="text-[#343F4B] text-sm">
            Guides to improving, maintaining and managing your home
          </p>
          <div className="grid lg:grid-cols-3 gap-5 mt-6">
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-6">
                {blogs?.length > 0 ?
                  blogs?.map((item, i) => {
                    return <div
                      // src={imagePath(blogs?.images?.[0])}
                      className="rounded-[24px] py-4 px-8 flex items-end justify-center min-h-[350px] border relative bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${imagePath(item?.images[0])})`,
                      }}
                      onClick={(e) => history(`/blog-own-detail?id=${item?.categoryId}&blogId=${item?.id || item?._id}`)}
                    >
                      <div className=" relative bg-[#fff] rounded-[20px] px-6 py-6">
                        <div className="flex gap-2 flex-wrap">
                          <button className="bg-[#F95F62]/25 mb-2 font-semibold rounded-full py-2 px-4 text-xs text-[#625519]">
                            {item?.categoryData?.CategoryName}
                          </button>
                          <button className="bg-[#343F4B] mb-2 rounded-full py-2 px-4 text-xs text-[#fff]">
                            {item?.duration || 0}
                          </button>
                        </div>
                        <h5 className="text-[16px] leading-tight">
                          {item?.title}
                        </h5>
                      </div>
                    </div>

                  }) : <div className="text-center">No Data</div>}
              </div>
            </div>
            <div className="">
              <div className="rounded-[24px] p-8 bg-[#976DD0]/35">
                <h2 className="text-[34px] font-semibold leading-[1.1]">
                  How much is your home worth as-is?
                </h2>
                <p className="leading-tight my-6">
                  Find out that our tips to increase your property value over
                  the time.
                </p>
                <div className="text-center mt-8">
                  <button className="bg-[#976DD0] hover:opacity-80 text-[#fff] py-1 px-8 rounded-full"
                    onClick={(e) => history("/peertopeer")}
                  >
                    P2P Estimate it !
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </PageLayout>
  );
};
export default BlogOwning;
