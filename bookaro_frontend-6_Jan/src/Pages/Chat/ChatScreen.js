import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { FiDownload, FiEdit, FiEye } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import { LuPaperclip } from "react-icons/lu";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { TiDocument } from "react-icons/ti";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import socket from "../../config/ChatSocket/socket";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { dateFormate, downloadFile, imagePath } from "../../models/string.model";

const ChatScreen = ({
  messages,
  totalMsg,
  showLoading,
  chatContainerRef,
  activeUser,
  handleEdit,
  deleteMsg,
  msgRef,
  msg,
  setMsg,
  editMode,
  handleUpdateMsg,
  sendMessage,
  sendFiles,
}) => {
  const { user } = useSelector((state) => state);
  const [isOpen, setIsOpen] = useState(false);
  const attachRef = useRef(null);
  const buttonRef = useRef(null);
  const Type = {
    TEXT: "TEXT",
    VIDEO: "VIDEO",
    IMAGE: "IMAGE",
    DOCUMENT: "DOCUMENT",
  };
  const markMessageAsRead = (message) => {
    socket.emit("read-message", {
      ...message,
      isRead: true,
      user_id: user?.id || user?._id,
      message_id: message._id,
    });
  };
  // useEffect(() => {
  //   socket.on('read-message', (data) => {
  //     // console.log("read-message true", data)
  //     // const updatedMessages = messages.map((msg) =>
  //     //   msg._id === data.messageId ? { ...msg, isRead: true } : msg
  //     // );
  //     // setMessages(updatedMessages);
  //   });

  //   return () => {
  //     socket.off('read-message'); // Clean up the event listener
  //   };
  // }, [messages]);

  // Emit "read-message" event when a message is displayed
  useEffect(() => {
    if (messages.length > 0 && activeUser.room_id) {
      messages.forEach((msg) => {
        if (!msg.isRead && msg.sender !== user._id) {
          markMessageAsRead(msg);
        }
      });
    }
  }, [messages, activeUser.room_id, user._id]);

  // ["TEXT", "VIDEO", "IMAGE", "DOCUMENT"]
  const [form, setForm] = useState({
    media: [],
    type: "",
  });

  // console.log("IMAGE -> ", form)
  const uploadFile = (e, type, maxLimit = 3, maxSize = 10) => {
    let files = Array.from(e.target.files);
    // // Validate max limit files
    // if (files.length + form?.media?.length > maxLimit) {
    //   toast.error(`Maximum ${maxLimit} files allowed to add`);
    //   return e.target.value = ""; // Clear file input
    // }
    // Validate max size (10MB)
    const maxSizeInBytes = maxSize * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter((file) => file.size > maxSizeInBytes);
    if (oversizedFiles.length > 0) {
      toast.error(`Each file must be smaller than ${maxSize}MB`);
      return (e.target.value = "");
    }
    // validate extentions
    const acceptedTypes =
      type === "IMAGE"
        ? ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"]
        : [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
    let invalidFiles = files.filter(
      (file) => !acceptedTypes.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      if (type === "IMAGE")
        toast.error("Only JPG, PNG, GIF, and WebP images are allowed.");
      else toast.error("Only PDF, DOC, and DOCX files are allowed.");
      return (e.target.value = "");
    }

    loader(true);
    ApiClient.multiImageUpload(
      "upload/multiple-images",
      files, // filteredFiles,
      {},
      "files"
    )
      .then((res) => {
        if (res.success) {
          const data = res?.files?.map((item) => {
            return {
              fileName: item?.fileName,
              originalname: item?.originalname,
            };
          });
          // // Check if after adding new files, we exceed the max limit
          // if (data?.length + (form?.media?.length || 0) > maxLimit) {
          //   toast.error(`Maximum ${maxLimit} files allowed to add`);
          //   return;
          // }
          // setForm((prev) => ({
          //   ...prev,
          //   media: [...data],
          //   // media: [...prev.media, ...data],
          //   type,
          // }));
          let sman = { ...form };
          sman = {
            ...sman,
            media: [...data],
            type,
          };
          setForm(sman);
          sendFiles(sman);
          setIsOpen(false);
        }
      })
      .catch((er) => console.log("err in file upload", er))
      .finally(() => {
        loader(false);
        e.target.value = "";
      });
  };

  // Handle click outside to close the section
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (attachRef.current && !attachRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
        setIsOpen(false); // Close the section if clicked outside
      }
    };
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div className="bg-white rounded-tl-[12px] rounded-tr-[12px] p-5 h-[456px]">
        {/* loader */}
        {messages.length < totalMsg && <div>{showLoading && "Loading..."}</div>}

        <div ref={chatContainerRef} className="overflow-auto h-full pe-2">
          {messages?.length > 0 && activeUser.room_id ? (
            messages.map((msg, i) => (
              <div
                className={`${user?._id == msg?.sender ? "ml" : "me"
                  }-auto w-[50%] mb-5`}
              >
                <div
                  className={`flex items-start relative ${user?._id == msg?.sender ? "justify-end" : ""
                    }`}
                >
                  {msg?.type === Type.TEXT ? (
                    <p
                      className={`${user?._id == msg?.sender
                        ? "bg-[#E9E9E9]"
                        : "bg-[#8F3EAD] text-white"
                        } rounded-[6px] p-2 text-[14px] flex w-fit`}
                    >
                      {msg.content}
                    </p>
                  ) : msg?.type === Type.IMAGE ? (
                    <div className="relative w-[200px] h-[200px] object-cover bg-[#efefef] p-1 rounded-[5px] border">
                      <img alt=""
                        src={imagePath(msg?.media?.[0]?.fileName, "/assets/img/business.png")}
                        className="w-full h-full object-cover mx-auto "
                      />
                       {/* Hover Overlay */}
                       <div className="absolute inset-0 flex items-center justify-center bg-[#976DD0] bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[5px]">
                        <p
                          onClick={() => downloadFile(msg?.media?.[0]?.fileName)}
                          className="p-1 bg-[#976DD0] rounded-[5px]"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="white"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="white"
                            className="w-5 h-5 p-[1px]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
                            />
                          </svg>
                        </p>
                      </div>
                    </div>
                  ) : msg?.type === Type.DOCUMENT ? (
                    <div className="relative w-[45px] h-[45px] bg-[#efefef] p-1 rounded-[5px] border group">
                      <img
                        src="/assets/img/dummy_doc.png"
                        alt=""
                        className="w-full h-full object-cover mx-auto p-1"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-[#976DD0] bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[5px]">
                        <p
                          onClick={() => downloadFile(msg?.media?.[0]?.fileName)}
                          className="p-1 bg-[#976DD0] rounded-[5px]"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="white"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="white"
                            className="w-5 h-5 p-[1px]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
                            />
                          </svg>
                        </p>
                      </div>
                    </div>
                  ) : (
                    "msg type not defined yet"
                  )}
                  {user?._id === msg?.sender && (
                    <div className="">
                      <Menu>
                        <MenuButton>
                          <HiDotsVertical
                            className={`${user?._id == msg?.sender ? "" : "text-white"
                              } mt-[2px] text-[14px]`}
                          />
                        </MenuButton>
                        <MenuItems
                          anchor="bottom"
                          className="bg-white p-2 px-4 rounded-[10px]  shadow-md"
                        >
                          {msg?.type === Type.TEXT && (
                            <MenuItem>
                              <p
                                onClick={() => handleEdit(msg)}
                                className="flex items-center mb-2 cursor-pointer"
                              >
                                <FiEdit className="me-2 text-[15px]" />
                                <span className="text-[14px] text-[#333]">
                                  Edit
                                </span>
                              </p>
                            </MenuItem>
                          )}
                          {(msg?.type === Type.DOCUMENT ||
                            msg?.type === Type.IMAGE) && (
                              <MenuItem>
                                <p
                                  onClick={() => downloadFile(msg?.media?.[0]?.fileName)}
                                  className="flex items-center mb-2 cursor-pointer"
                                >
                                  {msg?.type === Type.DOCUMENT
                                    ? <FiDownload className="me-2 text-[15px]" />
                                    : <FiEye className="me-2 text-[15px]" />}
                                  <span className="text-[14px] text-[#333]">
                                    {msg?.type === Type.DOCUMENT
                                      ? "Download"
                                      : "View"}
                                  </span>
                                </p>
                              </MenuItem>
                            )}
                          <MenuItem>
                            <p onClick={() => deleteMsg(msg, "delete_for_me")}
                              className="flex items-center mb-2 cursor-pointer"
                            >
                              <AiOutlineDelete className="me-2" />
                              <span className="text-[14px] text-[#333]">
                                Delete For Me
                              </span>
                            </p>
                          </MenuItem>
                          <MenuItem>
                            <p
                              onClick={() =>
                                deleteMsg(msg, "delete_for_everyone")
                              }
                              className="flex items-center cursor-pointer"
                            >
                              <AiOutlineDelete className="me-2" />
                              <span className="text-[14px] text-[#333]">
                                Delete For Everyone
                              </span>
                            </p>
                          </MenuItem>
                        </MenuItems>
                      </Menu>
                    </div>
                  )}
                </div>
                <p
                  className={`${user?._id == msg?.sender ? "text-end" : ""
                    } text-[#47525E] text-[12px]`}
                >
                  {/* {dateFormate(msg?.createdAt, "MM/DD/YYYY - h:mm A")} */}
                  {dateFormate(msg?.createdAt, "h:mm A")}
                </p>
              </div>
            ))
          ) : (
            <div className=" h-full flex items-center justify-center flex-col">
              <img src="/assets/img/chat.gif" className="w-[100px] mx-auto " />
              <p className="text-center text-[#976DD0] uppercase tracking-[.80px] mt-2 ">
                No chats
              </p>
            </div>
          )}
        </div>
      </div>

      <div className=" py-3 px-5 bg-[#f6f0f8]">
        <div className="flex border border-[#8492A6] bg-white rounded-[10px] ">
          <div className="flex items-center justify-center ps-4 relative">
            <div className="relative">
              <button ref={buttonRef} onClick={() => {
                if (activeUser.room_id) {
                  setIsOpen(true)
                } else setIsOpen(false)
              }}>
                <LuPaperclip />
              </button>

              {isOpen && (
                <div ref={attachRef} className="absolute top-full left-0 bg-white p-2 px-4 rounded-[10px] shadow-md border border-[#efefef] mt-2 ">
                  <label className="flex items-center mb-2 cursor-pointer hover:text-[#976DD0] group">
                    <MdOutlinePhotoSizeSelectActual className="mr-2 text-[15px]" />
                    <span className="text-[14px] text-[#333] group-hover:text-[#976DD0]">
                      Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => uploadFile(e, "IMAGE", 3)}
                      />
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer hover:text-[#976DD0] group">
                    <TiDocument className="mr-2 text-[17px]" />
                    <span className="text-[14px] text-[#333] group-hover:text-[#976DD0]">
                      Document
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => uploadFile(e, "DOCUMENT", 3)}
                      />
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>
          <input
            className="w-full h-[55px] ps-[30px] "
            type="text"
            ref={msgRef}
            value={msg}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 2500) {
                setMsg(value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (editMode) {
                  handleUpdateMsg();
                } else {
                  sendMessage();
                }
              }
            }}
            placeholder="Type your message..."
          ></input>
          <div className="flex items-center justify-center pe-4">
            {editMode ? (
              <FaCheckCircle
                onClick={() => handleUpdateMsg()}
                className="text-[#33BAA7] text-[24px]"
              />
            ) : (
              <IoSend
                onClick={() => sendMessage()}
                className="text-[#33BAA7] text-[24px]"
              />
            )}
          </div>
        </div>
        <p className="text-end text-[#47525E] text-[14px] mb-0">
          {msg?.length}/2500
        </p>
      </div>
    </>
  );
};

export default ChatScreen;
