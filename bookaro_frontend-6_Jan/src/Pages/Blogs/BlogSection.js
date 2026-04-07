import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import environment from '../../environment'
import ApiClient from '../../methods/api/apiClient'
import { stringSeprator } from '../../models/string.model'

const BlogSection = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([])

    const getBlogs = () => {
        ApiClient.get("blogs/listing", { page: 1, count: 4 }).then((res) => {
            if (res.success) {
                setBlogs(res?.data);
            }
        });
    };
    useEffect(() => {
        getBlogs();
    }, [])

    const navigateToDetail = (itm) => {
        navigate(`/blog-detail?id=${itm?._id || itm?.id}`)
    }

    return (
        <>
            {blogs?.length > 0 &&
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
                                    {blogs?.map((itm, i) => (
                                        <div
                                            onClick={() => navigateToDetail(itm)}
                                            className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 bg-white h-[420px] rounded-[10px]">
                                            <img
                                                src={`${environment.api}img/${itm?.images[0]}`}
                                                alt=""
                                                className="rounded-tl-[10px] rounded-tr-[10px] h-[240px] w-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/assets/img/placeholder.png";
                                                }}
                                            />
                                            <p className="p-7 py-4 text-[#47525E] lg:text-[17px] text-[14px]"
                                                dangerouslySetInnerHTML={{
                                                    __html: stringSeprator(itm?.description, 150)
                                                }}>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-span-12 flex items-center justify-center">
                                <Link
                                    to="/blogs"
                                    className="text-[ #47525E] border border-[#976DD0] rounded-[50px] py-[8px] font-bold px-[45px]  text-center mt-10 mx-auto inline-block hover:bg-[#976DD0] hover:text-white transition delay duration-300 ease-in-out"
                                >
                                    See all blog posts
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            }
        </>
    )
}

export default BlogSection
