import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    page: 1,
    count: 10,
    sendToId: user?._id,
  });

  const getNotifications = (f = {}) => {
    const dto = { ...filters, ...f };
    loader(true);
    ApiClient.get("notification/list", dto).then((res) => {
      if (res.success) {
        setData(res?.data);
        setTotal(res?.total);
      }
      loader(false);
    });
  };
  useEffect(() => {
    if (user?.loggedIn) getNotifications();
  }, []);

  const navigateToDetail = (itm) => {
    if (itm?.type === "Property") {
      navigate(`/property-details?id=${itm?.propertyDetails?._id}`, {
        state: { paramId: itm?.propertyDetails?._id },
      });
    }
  };

  const changeStatus = (itm) => {
    if (itm?.status === "read") return navigateToDetail(itm);
    const dto = { status: "read", id: itm?._id || itm?.id };
    loader(true);
    ApiClient.put("notification/change-status", dto).then((res) => {
      if (res.success) {
        navigateToDetail(itm);
      }
      loader(false);
    });
  };
  const changeStatusMulti = (ids = []) => {
    // let unRead = data?.filter(ee => ee.status != "read")?.map(itm => itm?._id || itm?.id)
    // console.log("unRead", unRead)
    // if (unRead?.length === 0) return
    const dto = { status: "read", ids: ids };
    loader(true);
    ApiClient.put("notification/change-status-multiple", dto).then((res) => {
      if (res.success) {
      }
      loader(false);
    });
  };

  useEffect(() => {
    let unRead = data
      ?.filter((ee) => ee.status != "read")
      ?.map((itm) => itm?._id || itm?.id);
    if (unRead?.length > 0) {
      changeStatusMulti(unRead);
    }
  }, [data]);
  const deleteNotification = (itm) => {
    const dto = { id: itm?._id || itm?.id };
    loader(true);
    ApiClient.delete("notification/delete", dto).then((res) => {
      if (res.success) {
        getNotifications();
      }
      loader(false);
    });
  };
  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1;
    setFilters((prev) => ({ ...prev, page: newPage }));
    getNotifications({ ...filters, page: newPage });
  };

  return (
    <PageLayout>
      <section className="py-14 lg:py-16 bg-[#ebebeb4d] ">
        <div className="container px-8 mx-auto xl:px-10">
          <div className="lg:grid grid-cols-2 lg:gap-10 gap-0 flex flex-col-reverse">
            <div className="">
              <div className="bg-white rounded-[18px] lg:p-10 lg:py-4 p-5 border border-[#DCDDDF]">
                <h2 className="text-[#47525E] font-[600] text-[24px]  pb-5 text-center border-b border-[#DCDCDC]">
                  Notifications
                </h2>
                {data?.length > 0 ? (
                  <>
                    <ul className="">
                      {data?.map((itm, i) => {
                        let status = itm?.status;
                        let prop = itm?.propertyDetails;
                        let type = itm.type;
                        let title = itm?.title;
                        let msg = itm?.message;
                        let createdAt = itm?.createdAt;

                        // Format date & time (using built-in JS)
                        let formattedDate = createdAt
                          ? new Date(createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : "";

                        return (
                          <li
                            key={i}
                            className={`flex items-center border-b border-[#DCDCDC] pt-5 pb-5 justify-between cursor-pointer relative
                           ${status === "read" ? "" : "bg-[#F1EDF6]"}`}
                            >
                            <div className="flex items-center md:me-8 md:ms-4 me-0 ms-0 md:mb-0 mb-6">
                              <div className="me-3">
                                <img
                                  src={
                                    prop?.images?.[0]?.file
                                      ? `${process.env.REACT_APP_API_URL}img/${prop?.images?.[0]?.file}`
                                      : "assets/img/prop-three.jpg"
                                  }
                                  alt="property"
                                  className=" min-w-[65px] w-[65px] h-[65px] rounded-[5px] cover shrink-0"
                                />
                              </div>
                              <div onClick={() => changeStatus(itm)}>
                                <span className="text-[#A7A7A7] capitalize">
                                  {msg}
                                </span>
                                <p className="text-[#6B6B6B] capitalize">
                                  {prop?.propertyTitle}
                                </p>
                                <p className="text-[#343F4B] capitalize">
                                  {type == "paymentNofication"
                                    ? "Subscription reminder notification"
                                    : type == "message" ||
                                      type == "interestStatus"
                                      ? title
                                      : `${prop?.surface}sqm, ${prop?.address}`}
                                </p>

                                {/* show date & time */}
                                <p className="text-[#A7A7A7] text-sm">
                                  {formattedDate}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteNotification(itm)}
                              className="bg-[#976DD0] p-2 rounded-[50px] md:me-4 me-0 md:relative absolute bottom-2 right-0"
                            >
                              <AiOutlineDelete className="text-white " />
                            </button>
                          </li>
                        );
                      })}
                    </ul>

                    <div
                      className={`paginationWrapper flex flex-col md:flex-row ${total > filters?.count ? "" : "d-none"
                        }`}
                    >
                      <span className="md:mb-0 mb-2">
                        Show {data?.length} from {total} Properties
                      </span>
                      <ReactPaginate
                        previousLabel="< Pre"
                        nextLabel="Next >"
                        breakLabel="..."
                        pageRangeDisplayed={2}
                        marginPagesDisplayed={1}
                        pageCount={Math.ceil(total / filters.count)}
                        onPageChange={handlePageChange}
                        forcePage={filters.page - 1}
                        containerClassName={"pagination flex"}
                        pageClassName={"pagination-item"}
                        activeClassName={"pagination-item-active"}
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-center my-10">
                    <img
                      src="/assets/img/no-data.png"
                      className="w-[100px] mx-auto"
                    />
                    No data found
                  </p>
                )}
              </div>
            </div>
            <div className=" lg:mb-0 mb-5">
              <div className="bg-[#F1EDF6] rounded-[18px] lg:p-10 lg:py-4 p-5">
                <h2
                  onClick={() => navigate("/profile/manage-notifications")}
                  className="cursor-pointer text-[#47525E] font-[600] lg:text-[24px] underline text-center text-[20px]"
                >
                  Manage your notification
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Notifications;
