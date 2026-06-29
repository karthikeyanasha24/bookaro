import moment from "moment";
import { useEffect, useRef, useState } from "react";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { imagePath, stringSeprator } from "../../models/string.model";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";

const BlogDetail = () => {
  const params = new URLSearchParams(window.location.search);
  const categoryId = params.get("categoryId");
  const history = useNavigate()
  const [category, setcategory] = useState([]);
  const [catId, setcatId] = useState([]);
  const [subcategory, setsubcategory] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isCategory, setisCategory] = useState(false);
  const [filters, setFilter] = useState({ page: 1, search: "" });


  const getRecent = (p = {}) => {
    loader(true);
    let payload = { ...filters, ...p }
    ApiClient.get("blogs/listing", payload).then((res) => {
      if (res.success) {
        let data = res?.data
        // ?.filter((itm) => (itm._id || itm.id) != id)
        // ?.slice(0, 3);
        setBlogs(data);
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

  const getSubCategory = (id) => {
    loader(true);
    ApiClient.get("blogCategories/subCategory/list", { page: 1, categoryId: id }).then((res) => {
      if (res.success) {
        let data = res?.data
        setsubcategory(data);
      }
      loader(false);
    });
  };


  useEffect(() => {
    // getBlogs();
    getCategory()
    getRecent({ categoryId: categoryId })
    scrollToTop();
    setisCategory(false)
  }, []);

  useEffect(() => {
    if (categoryId) {
      getSubCategory(categoryId)
      getRecent({ categoryId: categoryId })
      setisCategory(true)
    }
  }, [categoryId]);


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const sliderRef = useRef(null);
  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const urlNavigation = () => {
    if (blogs[0]?.categoryId == "68ec8f9804dfdf28d518678b") {
      history("/peertopeer")
    }
    if (blogs[0]?.categoryId == "68ec8f7504dfdf28d5186761") {
      history("/hunter-form?categoryId=68ec8f7504dfdf28d5186761")
    }
    if (blogs[0]?.categoryId == "68ec8f8c04dfdf28d518677d") {
      history("/")
    }
    if (blogs[0]?.categoryId == "68ec8f8404dfdf28d518676f") {
      history("/interest-form?categoryId=68ec8f8404dfdf28d518676f")
    }
    if (blogs[0]?.categoryId == "68ec8f6e04dfdf28d5186753") {
      history("/selling-form?categoryId=68ec8f6e04dfdf28d5186753")
    }
  }
  const BannerImage = () => {
    if (blogs[0]?.categoryId == "68ec8f9804dfdf28d518678b") {
      return "/assets/img/blog-owning.webp"
    }
    if (blogs[0]?.categoryId == "68ec8f8c04dfdf28d518677d") {
      return "/assets/img/blog-renting.webp"
    }
    if (blogs[0]?.categoryId == "68ec8f8404dfdf28d518676f") {
      return "/assets/img/blog-financing.webp"
    }
    if (blogs[0]?.categoryId == "68ec8f7504dfdf28d5186761") {
      return "/assets/img/blog-buying.webp"
    }
    if (blogs[0]?.categoryId == "68ec8f6e04dfdf28d5186753") {
      return "/assets/img/blog-selling.webp"
    }
  }

  return (
    <PageLayout>
      <section className="pb-12 bg-[#EBEBEB]/30">
        <div className="bg-[#fff]">
          <div className="container mx-auto p-5 mb-5">
            <div className="flex justify-between item-center gap-4 flex-wrap">
              <div className="flex items-center flex-wrap gap-4">
                <h3 className="text-[#47525E] text-[16px] font-semibold border-r border-gray-100 pe-5 cursor-pointer" onClick={() => {
                  setisCategory()
                  // getSubCategory()
                  getRecent()
                }
                }>Real estate like a pro center</h3>
                <ul className={`flex items-center gap-8 flex-wrap`}>
                  {category?.map((cat) => (
                    <li
                      key={cat?.id || cat?._id}
                      onClick={() => {
                        setisCategory(true)
                        getSubCategory(cat?.id || cat?._id)
                        getRecent({ categoryId: cat?.id || cat?._id })
                        setcatId(cat?.id || cat?._id)
                      }
                      }
                    >
                      <Link className={`${(catId == cat?._id || cat?._id == categoryId) && isCategory ? "text-[#976DD0] font-bold" : "text-[#000]  font-[400]"}`}>{cat?.CategoryName}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* <div className="relative">
                <input type='text'
                  className='!border-0 !bg-[#F0F0F0] !ps-9 px-2 py-2 rounded-lg !placeholder-[#7C62A1]'
                  placeholder='Search pro tips '
                  value={filters.search}
                  onChange={(e) => setFilter({ ...filters, search: e.target.value })}
                />
                <IoSearchSharp className="absolute top-1/2 transform-all -translate-y-1/2 left-3" />
              </div> */}
              <form className="flex items-center max-w-sm gap-2" onSubmit={(e) => { e.preventDefault(); filter(); history(`/blog-owning?search=${filters?.search}`)}}>
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
        <div className="container mx-auto px-5 relative blog-slider">
          <Slider ref={sliderRef} {...settings}>
            {blogs?.length === 0 ? (
              <>
                <h2 className="text-xl md:text-2xl font-semibold text-[#47525E] mb-6 leading-tight">
                  Resources to help you in your real estate journey
                </h2>
                <div className="text-center">No Data</div></>

            ) : (
              blogs.map((item) => (
                <div key={item?.id || item?._id}>

                  <h2 className="text-xl md:text-2xl font-semibold text-[#47525E] mb-6 leading-tight">
                    {isCategory ? `${item?.categoryData?.CategoryName} Resources` : " Resources to help you in your real estate journey"}<br></br>

                  </h2>

                  <div className="grid lg:grid-cols-9 items-center  gap-5">
                    <div className="col-span-full lg:col-span-5 ">
                      <img
                        src={imagePath(item?.images?.[0])}
                        alt="Blog"
                        className="w-full h-[400px] object-cover  rounded-[14px] border"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/assets/img/placeholder.png";
                        }}
                      />
                    </div>
                    <div className="col-span-full lg:col-span-4">
                      <div className="lg:p-6">
                        <div className="flex items-center gap-3">
                          <button className="bg-[#976DD0]/30 rounded-full py-1 px-4 text-sm text-[#624786]"
                            onClick={(e) => history(`/blog-owning?id=${item?.categoryId}`)}
                          >
                            {item?.category}
                          </button>
                          <button className="bg-[#343F4B] rounded-full py-1 px-4 text-sm text-[#fff]">
                            {item?.duration || 0}
                          </button>
                        </div>
                        <h1 className="font-semibold capitalize text-[24px] md:text-[28px] leading-[1.1] my-3 md:w-[80%]">
                          {item?.title}
                        </h1>
                        <p
                          className="text-[15px] leading-[1.3] line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: item?.description }}
                        ></p>
                        <button className="bg-[#976DD0] hover:opacity-90 rounded-full py-1 px-4  text-[#fff] mt-6"
                          onClick={(e) => history(`/blog-own-detail?id=${item?.categoryId}&blogId=${item?.id || item?._id}`)}
                        >
                          Read traning content
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </Slider>
          {blogs?.length > 0 && <div className="flex justify-end gap-2 mt-6">
            <div>
              <button
                className="bg-[#000] rounded-full text-[#fff] p-1"
                onClick={() => sliderRef.current.slickPrev()}
              >
                <FaChevronLeft size={20} />
              </button>
            </div>
            <div>
              <button
                className="bg-[#000] rounded-full text-[#fff] p-1"
                onClick={() => sliderRef.current.slickNext()}
              >
                <FaChevronRight size={20} />
              </button>
            </div>
          </div>}

        </div>
      </section>
      {isCategory ? <>
        {subcategory?.map((cat, index) => {
          const subcategoryBlogs = blogs?.filter(
            (item) => item?.subCategoryId === cat?.id || item?.subCategoryId === cat?._id
          );
          return (
            <>
              <section key={cat?.id || cat?._id} className="pt-12 bg-[#fff]">
                <div className="container mx-auto px-5">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#47525E] leading-tight">
                      {cat?.SubCategoryName}
                    </h2>
                    <p className="text-[16px] font-semibold text-[#976DD0] cursor-pointer">
                      See all
                    </p>
                  </div>

                  {subcategoryBlogs?.length === 0 ? (
                    <div className="text-center">No Data</div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-5 mb-6">
                      {subcategoryBlogs?.length > 0 && subcategoryBlogs.slice(0, 4).map((item) => (
                        <div
                          key={item?.id || item?._id}
                        >
                          <div
                            className="rounded-[24px] px-4 flex items-center justify-center min-h-[220px] relative bg-cover bg-center"
                            style={{
                              backgroundImage: `url("${imagePath(item?.images?.[0])}")`,
                            }}
                            onClick={(e) => history(`/blog-own-detail?id=${item?.categoryId}&blogId=${item?.id || item?._id}`)}
                          >
                            <div className=" relative md:absolute md:top-1/2 md:transform-all md:-translate-y-1/2 md:right-4 md:w-1/2 bg-[#fff] rounded-[20px] px-4 py-8"
                            >
                              {/* <button className="bg-[#976DD0]/30 rounded-full py-1 px-4 text-sm text-[#624786]"
                                onClick={(e) => history(`/blog-owning?id=${item?.categoryId}`)}
                              >
                                {item?.category}
                              </button> */}
                              <button className="bg-[#343F4B] mb-2 rounded-full py-2 px-4 text-xs text-[#fff]">
                                {item?.duration || 0}
                              </button>
                              <h5 className="text-[16px] capitalize leading-tight">
                                {item?.title}
                              </h5>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
              {(subcategory?.length > 1 ? index == 1 : index == 0) &&
                blogs?.length > 0 &&
                <section className="bg-[#fff] my-10">
                  <div className="container mx-auto px-5">
                    <div className="bg-[#976DD0]/10 p-8 md:p-12 rounded-[14px]">
                      <div className="grid md:grid-cols-2 gap-4 ">
                        <div>
                          <h2 className="text-[24px] font-semibold mb-1">
                            {(blogs[0]?.categoryId == "68ec8f8404dfdf28d518676f") && "Get the best interest rate thanks to our partners"}
                            {(blogs[0]?.categoryId == "68ec8f9804dfdf28d518678b") && "How much is your home worth as-is?"}
                            {(blogs[0]?.categoryId == "68ec8f8c04dfdf28d518677d") && "Find your next home in Bookaroo"}
                            {(blogs[0]?.categoryId == "68ec8f6e04dfdf28d5186753") && "Ready to sell your home? Do it the right way, easy!"}
                            {(blogs[0]?.categoryId == "68ec8f7504dfdf28d5186761") && "A local property hunter can help you find your dream home and save money."}
                          </h2>
                          <p className="mb-8">
                            {(blogs[0]?.categoryId == "68ec8f8404dfdf28d518676f") && "Go from dreaming to owning with low down payment options, competitive rates and no hidden fees. A dedicated loan officer will guide you until you have your keys in hand."}
                            {(blogs[0]?.categoryId == "68ec8f9804dfdf28d518678b") && "Find out that our tips to increase your property value ober the time."}
                            {(blogs[0]?.categoryId == "68ec8f8c04dfdf28d518677d") && "With hundreds of thousand properties listed it's easy to find a rental property matching your criterion."}
                            {(blogs[0]?.categoryId == "68ec8f6e04dfdf28d5186753") && "We will help you better define your project and make sure your sell is successfull."}
                            {(blogs[0]?.categoryId == "68ec8f7504dfdf28d5186761") && "They will help you find the right house and negociate the price to save money."}
                          </p>
                          <button className="text-[#fff] bg-[#976DD0] rounded-full px-4 py-1 text-sm"
                            onClick={(e) =>
                              urlNavigation()
                            }
                          >
                            {(blogs[0]?.categoryId == "68ec8f8404dfdf28d518676f") && "Find best interest rate"}
                            {(blogs[0]?.categoryId == "68ec8f9804dfdf28d518678b") && "P2P Estimate it!"}
                            {(blogs[0]?.categoryId == "68ec8f8c04dfdf28d518677d") && "Browse Rentals"}
                            {(blogs[0]?.categoryId == "68ec8f6e04dfdf28d5186753") && "Talk with local agency"}
                            {(blogs[0]?.categoryId == "68ec8f7504dfdf28d5186761") && "Talk with a local hunter"}
                          </button>
                        </div>
                        <div className="h-[300px]">
                          <img
                            src={BannerImage()}
                            alt="img"
                            className="w-full h-full object-cover rounded-[16px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>}
            </>
          );
        })}</> : <>
        {category?.slice(0, 4).map((cat, index) => {
          const categoryBlogs = blogs?.filter(
            (item) => item?.categoryId === cat?.id || item?.categoryId === cat?._id
          );
          return (
            <>
              {categoryBlogs?.length > 0 && <section key={cat?.id || cat?._id} className="py-12 bg-[#fff]">
                <div className="container mx-auto px-5">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#47525E] leading-tight">
                      {cat?.CategoryName}
                    </h2>
                    <p className="text-[16px] font-semibold text-[#976DD0] cursor-pointer"
                      onClick={(e) => history(`/blog-owning?id=${cat?.id || cat?._id}`)}
                    >
                      See all
                    </p>
                  </div>

                  {categoryBlogs?.length === 0 ? (
                    <div className="text-center">No Data</div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-5">
                      {categoryBlogs?.slice(0, 4).map((item, i) => (
                        <div key={item?.id || item?._id}>
                          <div
                            className="rounded-[24px] px-4 flex items-center justify-center min-h-[220px] relative bg-cover bg-center"
                            style={{
                              backgroundImage: `url("${imagePath(item?.images?.[0])}")`,
                            }}
                            onClick={(e) => history(`/blog-own-detail?id=${item?.categoryId}&blogId=${item?.id || item?._id}`)}
                          >
                            <div className="border relative md:absolute md:top-1/2 md:transform-all md:-translate-y-1/2 md:right-4 w-1/2 bg-[#fff] rounded-[20px] px-4 py-8">
                              <div className="flex gap-2 mb-1 items-center"
                              >
                                {/* <button className="bg-[#976DD0]/30 rounded-full py-2 px-4 text-sm text-[#624786]"
                                  onClick={(e) => history(`/blog-owning?id=${item?.categoryId}`)}
                                >
                                  {item?.category}
                                </button> */}
                                <button className="bg-[#343F4B] rounded-full py-2 px-4 text-xs text-[#fff]">
                                  {item?.duration || 0}
                                </button>
                              </div>
                              <h5 className="text-[16px] capitalize leading-tight">
                                {item?.title}
                              </h5>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </section>}

              {(category?.length > 1 ? index == 1 : index == 0) && category?.length > 0 &&
                <section className="bg-[#fff] my-10">
                  <div className="container mx-auto px-5">
                    <div className="bg-[#976DD0]/10 p-8 md:p-12 rounded-[14px]">
                      <div className="grid md:grid-cols-2 gap-4 ">
                        <div>
                          <h2 className="text-[24px] font-semibold mb-1">
                            Download the Bookaroo App
                          </h2>
                          <p className="mb-8">
                            This is the article that should hold in 2 lines maximum
                          </p>
                          <button className="text-[#fff] bg-[#976DD0] rounded-full px-4 py-1 text-sm">
                            Download the free App
                          </button>
                        </div>
                        <div className="h-[300px]">
                          <img
                            src={"/assets/img/blog-banner.jpg"}
                            alt="img"
                            className="w-full h-full object-cover rounded-[16px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>}
            </>
          );
        })}</>}


    </PageLayout>
  );
};

export default BlogDetail;
