import Layout from "../../components/global/layout";
import { Tooltip } from "antd";
import Table from "../../components/Table";
import SelectDropdown from "../../components/common/SelectDropdown";
import { PiEyeLight } from "react-icons/pi";
import { GoDotFill, GoPlusCircle } from "react-icons/go";
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { LiaEdit, LiaTrashAlt } from "react-icons/lia";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

const Html = ({
  sorting,
  filter,
  setratingpopup,
  view,
  add,
  edit,
  ratingpopup,
  pageChange,
  count,
  clear,
  filters,
  submited,
  setFilter,
  loaging,
  data,
  handleSubmit,
  total = { total },
  sortClass,
  deleteItem,
  setdocument,
  document,
  statusChange,
}) => {
  const columns = [
    {
      key: "title",
      name: "Video Title",
      // sort: true,
      render: (row) => {
        return <span className="capitalize">{row?.title || "--"}</span>;
      },
    },
    {
      key: "funnelStatus",
      name: "Funnel Status",
      // sort: true,
      render: (row) => {
        return <span className="capitalize">{row?.funnelStatus || "--"}</span>;
      },
    },
      {
      key: "topic",
      name: "Traning Topic",
      // sort: true,
      render: (row) => {
        return <span className="capitalize">{row?.topic || "--"}</span>;
      },
    },
    {
      key: "youtubeUrl",
      name: "Url",
      // sort: true,
      render: (row) => {
        return <span className="block max-w-xs truncate">{row?.youtubeUrl || "--"}</span>;
      },
    },
    {
      key: "status",
      name: "Status",
      render: (row) => {
        return (
          <>
            <div className="w-32" onClick={() => statusChange(row)}>
              <span className={`bg-[#976DD0] cursor-pointer text-sm !px-3 h-[30px] w-[100px] flex items-center justify-center border border-[#EBEBEB] text-[#3C3E49A3] !rounded capitalize ${row.status == "deactive" ? " bg-gray-200 text-black" : "bg-[#976DD0] text-white"}`}>
                {row.status === "deactive" ? "inactive" : "active"}
              </span>
            </div>
          </>
        );
      },
    },

    {
      key: "action",
      name: "Action",
      render: (itm) => {
        return (
          <>
            <div className="flex items-center justify-start gap-1.5">
              <Tooltip placement="top" title="View">
                <a
                  onClick={(e) => view(itm.id || itm?._id)}
                  className="border cursor-pointer  hover:opacity-70 rounded-[35px] bg-[#00988e1c] w-10 h-10 !text-primary flex items-center justify-center text-lg text-[#222]"
                >
                  <PiEyeLight />
                </a>
              </Tooltip>
              <Tooltip placement="top" title="Edit">
                <a
                  onClick={(e) => edit(itm.id || itm?._id)}
                  className="border cursor-pointer  hover:opacity-70 rounded-[35px] bg-[#00988e1c] w-10 h-10 !text-primary flex items-center justify-center text-lg text-[#222]"
                >
                  <LiaEdit />
                </a>
              </Tooltip>{" "}
              <Tooltip placement="top" title="Delete">
                <span
                  onClick={() => deleteItem(itm.id || itm?._id)}
                  className="border cursor-pointer  hover:opacity-70 rounded-[35px] bg-[#00988e1c] w-10 h-10 !text-primary flex items-center justify-center text-lg text-[#222]"
                >
                  <LiaTrashAlt />
                </span>
              </Tooltip>
            </div>
          </>
        );
      },
    },
  ];

  const RatingValue = [
    { id: "A", name: "A" },
    { id: "B", name: "B" },
    { id: "C", name: "C" },
    { id: "D", name: "D" },
    { id: "E", name: "E" },
  ];

  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center gap-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-[#111827]">
            Funnel Videos
          </h3>
        </div>
        <div className="flex">
          <Link
            className="bg-primary leading-10 mr-3 h-10 flex items-center shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg gap-2"
            to={`/funnelvideo/add`}
          >
            <FiPlus className="text-xl text-white" /> Add Funnel Video
          </Link>
        </div>
      </div>
      <div className="p-4  shadow-box w-full bg-white rounded-lg mt-6">
        <div className="flex items-center flex-wrap gap-2 mb-4">
          <form
            className="flex items-center max-w-sm gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              filter();
            }}
          >
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <input
                type="text"
                id="simple-search"
                value={filters.search}
                onChange={(e) =>
                  setFilter({ ...filters, search: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-[#976DD0] block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 pr-10"
                placeholder="Search"
              />
              {filters?.search && (
                <i
                  className="fa fa-times absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                  aria-hidden="true"
                  onClick={(e) => clear()}
                ></i>
              )}
            </div>
            <button
              type="submit"
              className="p-3 text-sm font-medium text-white bg-blue-700 rounded-lg border border-[#976DD0] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </form>

          <Dialog
            open={ratingpopup}
            onClose={() => {
              setratingpopup(false);
            }}
            className="relative z-[9999]"
          >
            <DialogBackdrop className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex w-screen items-center justify-center">
              <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
                <DialogTitle className="p-6 relative">
                  <span
                    className="absolute top-4 right-4 cursor-pointer"
                    onClick={() => setratingpopup(false)}
                  >
                    <IoClose size={24} />
                  </span>
                  <div className="flex gap-0.5 justify-center">
                    <MdOutlineStarPurple500 color="ffc300" />
                    <MdOutlineStarPurple500 color="ffc300" />
                    <MdOutlineStarPurple500 color="ffc300" />
                    <MdOutlineStarPurple500 color="ffc300" />
                    <MdOutlineStarPurple500 color="ffc300" />
                  </div>
                  <form
                    onSubmit={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    <p className="border-b text-[#389D93] text-[18px] text-center pb-4 mt-1">
                      Rating for documents
                    </p>

                    <h5 className="text-[18px] mb-3 mt-4 flex gap-2 items-baseline">
                      <GoDotFill size={14} className="min-w-[10px]" /> Verify
                      User documents:
                    </h5>
                    <ul className="mb-8 ps-5">
                      <li>
                        <div className="flex gap-2 items-center mb-2">
                          <input
                            type="checkbox"
                            className="accent-[#976DD0] w-4 h-4"
                            checked={document?.isDocumentVerified}
                            value={document?.isDocumentVerified}
                            onChange={(e) =>
                              setdocument({
                                ...document,
                                isDocumentVerified: e.target.checked,
                              })
                            }
                          />
                          <p className="text-[15px]">
                            Verify document based background.
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="flex gap-2 items-center mb-2">
                          <input
                            type="checkbox"
                            className="accent-[#976DD0] w-4 h-4"
                            checked={document?.isDeclDocumentVerified}
                            value={document?.isDeclDocumentVerified}
                            onChange={(e) =>
                              setdocument({
                                ...document,
                                isDeclDocumentVerified: e.target.checked,
                              })
                            }
                          />
                          <p className="text-[15px]">
                            Verify declarative based background.
                          </p>
                        </div>
                      </li>
                    </ul>
                    <h5 className="text-[18px] mb-3 mt-4 flex gap-2 items-baseline">
                      <GoDotFill size={14} className="min-w-[10px]" /> Rate User
                      Documents:
                    </h5>
                    <ul className="mb-5 ps-5">
                      {RatingValue?.map((item) => {
                        return (
                          <li>
                            <div className="flex gap-2 items-center mb-2">
                              <input
                                type="checkbox"
                                className="accent-[#976DD0] w-4 h-4"
                                checked={document.documentGrade == item?.id}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setdocument({
                                      ...document,
                                      documentGrade: item?.id,
                                    });
                                  }
                                }}
                              />
                              <p className="text-[15px]">{item?.name}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    {submited && !document.documentGrade && (
                      <span className="text-[#ff0000]">Rating is required</span>
                    )}
                    <div className="text-center">
                      <button
                        type="submit"
                        className="bg-primary leading-10 h-10 inline-block shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </DialogTitle>
              </DialogPanel>
            </div>
          </Dialog>
        </div>
        {!loaging ? (
          <>
            <Table
              className="mb-3"
              firstColumnClass="width_row"
              data={data}
              columns={columns}
              page={filters.page}
              count={filters.count}
              filters={filters}
              total={total}
              result={(e) => {
                if (e.event == "page") pageChange(e.value);
                if (e.event == "sort") {
                  sorting(e.value);
                  sortClass(e.value);
                }
                if (e.event == "count") count(e.value);
              }}
            />
          </>
        ) : (
          <></>
        )}
        {loaging ? (
          <div className="text-center py-4">
            <img src="/assets/img/loader.gif" className="pageLoader" />
          </div>
        ) : (
          <></>
        )}
      </div>
    </Layout>
  );
};

export default Html;
