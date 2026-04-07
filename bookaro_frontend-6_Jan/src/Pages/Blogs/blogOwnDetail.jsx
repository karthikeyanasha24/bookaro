import { CiClock2 } from "react-icons/ci";
import PageLayout from "../../components/global/PageLayout";
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import loader from "../../methods/loader";
import ApiClient from "../../methods/api/apiClient";
import { useState, useEffect } from "react";
import { imagePath } from "../../models/string.model";
import { Link, useNavigate } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import moment from "moment";
import { useSelector } from "react-redux";
import LoginModal from "../../components/common/Modal/LoginModal";
import { toast } from "react-toastify";

const BlogOwnDetail = () => {
  const [blogs, setBlogs] = useState([]);
  const { user } = useSelector((state) => state);
  const [detailBlog, setdetailBlog] = useState([]);
  const history = useNavigate()
  const [subcategory, setsubcategory] = useState([]);
  const [loginModal, setloginModal] = useState(false);
  const [category, setcategory] = useState([]);
  const [like, setlike] = useState(false);
  const [dislike, setdislike] = useState(false);
  const [filters, setFilter] = useState({ page: 1, search: "" });
  const params = new URLSearchParams(window.location.search);
  const paramId = params.get("id");
  const BlogId = params.get("blogId");

  const getRecent = (p = {}) => {
    loader(true);
    let payload = { ...filters, ...p, categoryId: paramId }
    if (user?.loggedIn) {
      payload = {
        ...payload,
        loggedinUser: user?.id || user?._id
      }
    }
    ApiClient.get("blogs/listing", payload).then((res) => {
      if (res.success) {
        let data = res?.data
        setBlogs(data);
        let newBlog = res?.data?.find((item) => item?._id == BlogId)
        setdetailBlog(newBlog)
        getSubCategory(paramId)
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
    getRecent()
    scrollToTop();
    getCategory()
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const findCategoryColor = () => {
    const findColor = tags?.find((item) => detailBlog?.categoryId == item?.id)
    if (findColor) {
      return findColor?.bg
    } else {
      return "bg-[#00A6FF]/25"
    }

  }

  const tags = [
    {
      bg: "bg-[#F95F62]/25",
      text: "text-[#625519]",
      title: "Owning",
      id: "68ec8f9804dfdf28d518678b"
    },
    {
      bg: "bg-[#FFE500]/25",
      text: "text-[#625519]",
      title: "Financing",
      id: "68ec8f8404dfdf28d518676f"
    },
    {
      bg: "bg-[#339A90]/45",
      text: "text-[#46742D]",
      title: "Buying",
      id: "68ec8f7504dfdf28d5186761"
    },
    {
      bg: "bg-[#00A6FF]/25",
      text: "text-[#1C4154]",
      title: "Renting",
      id: "68ec8f8c04dfdf28d518677d"
    },
    {
      bg: "bg-[#976DD0]/30",
      text: "text-[#624786]",
      title: "Selling",
      id: "68ec8f6e04dfdf28d5186753"
    },
    // {
    //   bg: "bg-[#6C9866]/25",
    //   text: "text-[#625519]",
    //   title: "Subcategory 1",
    // },
    // {
    //   bg: "bg-[#5D88ED]/25",
    //   text: "text-[#625519]",
    //   title: "Subcategory 2",
    // },
    // {
    //   bg: "bg-[#9A3353]/45",
    //   text: "text-[#F5F5F5]",
    //   title: "Subcategory 3",
    // },
    // {
    //   bg: "bg-[#FF8100]/25",
    //   text: "text-[#1C4154]",
    //   title: "Subcategory 4",
    // },
  ];

  const likeDislike = (likeDislike="like") => {
    let payload = {
      id: detailBlog?.id || detailBlog?._id,
      loggedinUser: user?.id || user?._id
    }
    if(likeDislike == "like")
    {
      payload={
        ...payload,
        contentLike:!like
      }
    }else
    {
         payload={
        ...payload,
        contentDislike:!dislike
      }
    }
    ApiClient.put("blogs/edit", payload).then((res) => {
      if (res.success) {
        getRecent()
        toast.success("Thank you for your feedback!")
      }
      loader(false);
    });
  }

  return (
    <PageLayout>
      <LoginModal loginModal={loginModal} setloginModal={setloginModal} />
      <section className=" bg-[#f9f9f9] min-h-[calc(100vh-350px)] pb-10">
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
                      <Link className={` ${(paramId == cat?._id) ? "font-bold text-[#976DD0]" : "text-[#000] font-[400]"}`}>{cat?.CategoryName}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <form className="flex items-center max-w-sm gap-2" onSubmit={(e) => { e.preventDefault(); filter(); history(`/blog-owning?search=${filters?.search}`) }}>
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
        {blogs?.length > 0 ? <div className="container items-center  px-8 mx-auto xl:px-5">
          <div className="lg:w-[70%]">
            <ul className="flex items-center flex-wrap gap-x-5 gap-y-2">
              <li
                className={`cursor-pointer capitalize ${findCategoryColor()} inline-block rounded-full text-sm font-semibold px-4 py-1`}
                onClick={(e) => history(`/blog-owning?id=${paramId}`)}
              >
                {detailBlog?.categoryData?.CategoryName}
              </li>
              {subcategory.map((item, i) => (
                <li
                  key={i}
                  className={`cursor-pointer capitalize bg-[#00A6FF]/25 inline-block rounded-full text-sm font-semibold px-4 py-1`}
                  onClick={(e) => history(`/blog-owning?id=${paramId}`)}
                >
                  {item.SubCategoryName}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid lg:grid-cols-3 gap-5 mt-3">
            <div className="lg:col-span-2">
              <div className="lg:pe-8">
                <p className="text-[#000] text-sm flex items-center gap-1 mb-2">
                  <CiClock2 size={20} /> {detailBlog?.duration || 0}
                </p>
                <h1 className="font-semibold text-[24px] md:text-[32px] lg:text-[36px] text-[#47525E] leading-[1.1] lg:leading-tight ">
                  {detailBlog?.title}
                </h1>

                <p className="text-[#000]">
                  {detailBlog?.metaTitle}
                </p>
                <div className="h-[300px] rounded-[20px] my-4">
                  <img
                    src={imagePath(detailBlog?.images?.[0])}
                    className="w-full h-full object-cover rounded-[20px]"
                    alt="img"
                  />
                </div>
                <div className="mb-5">
                  <p className="text-sm border-gray-300 border-r inline-block pe-3">
                    Written by{" "}
                    <span className="text-[#976DD0] font-semibold">
                      {detailBlog?.blogOwnerData?.fullName}
                    </span>
                  </p>
                  <p className="text-sm inline-block ps-3">{moment(detailBlog?.createdAt).format("MMM D, YYYY")}</p>
                </div>

                <div className="space-y-4">

                  <p className="text-sm" dangerouslySetInnerHTML={{
                    __html: detailBlog?.description
                  }}>

                  </p>

                </div>
                <div className="flex justify-center items-center gap-4 mt-4">
                  <p className="font-semibold">Was this content usefull?</p>
                  <button onClick={() => {
                    if (user?.loggedIn) {
                      likeDislike("like");
                      setlike(!like)
                    }
                    else {
                      setloginModal(true);
                    }
                  }}>
                    {!detailBlog?.isLikedByUser ? <AiOutlineLike size={26} /> : <AiFillLike size={26} />}
                  </button>
                  <button onClick={() => {
                    if (user?.loggedIn) {
                      likeDislike("dislike");
                      setdislike(!dislike)
                    }
                    else {
                      setloginModal(true);
                    }
                  }}>
                    {!detailBlog?.isDislikedByUser ? <AiOutlineDislike size={26} /> : <AiFillDislike size={26} />}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div className="rounded-[24px] p-8 bg-[#976DD0]/35">
                <h2 className="text-[24px] md:text-[28px] lg:text-[34px] font-semibold leading-[1.1]">
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
          <div className="bg-[#976DD0] rounded-[20px] p-8 mt-8 ">
            <h2 className="text-[#fff] font-semibold text-[28px] leading-tight mb-5">
              Related training content
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {blogs?.slice(0, 4)?.map((item, i) => {
                return item?._id != BlogId &&
                  <div
                    // src={imagePath(blogs?.images?.[0])}
                    className="rounded-[18px] cursor-pointer py-4 px-8 flex items-end justify-center min-h-[350px] border relative bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${imagePath(item?.images?.[0])})`,
                    }}
                    onClick={(e) => history(`/blog-owning?id=${paramId}`)}
                  >
                    <div className="border relative bg-[#fff] rounded-[20px] px-6 py-6">
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

              })}
            </div>


          </div>
          <div className="bg-[#976DD0]/10 p-8 md:p-12 rounded-[14px] mt-10">
            <div className="grid md:grid-cols-2 gap-4 ">
              <div className="md:w-[70%]">
                <h2 className="text-[28px] leading-[1.1] font-semibold text-[#7925E9] mb-4">
                  Stay on track with Real Estate project management Hub
                </h2>
                <p className="mb-8">
                  Save your favorite rentals, message landlords, track your
                  application status, create a free renter profile and more -
                  all in your real estate project management Hub
                </p>
                <button className="text-[#fff] bg-[#976DD0] rounded-full px-8 py-1 text-sm">
                  Visit hub
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
        </div> : <div className="text-center">No Data</div>}

      </section>
    </PageLayout>
  );
};
export default BlogOwnDetail;
