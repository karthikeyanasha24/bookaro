import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import moment from "moment";
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
import { downloadFile, imagePath } from "../../models/string.model";

const DirectMsgModal = ({
  directMsg,
  setdirectMsg,
  detail,
  defaultMsg,
  setDefaultMsg,
  chat_with='',
  property_id=''
}) => {
  const { user } = useSelector((state) => state);
  const [roomId, setroomId] = useState("");
  const [msg, setMsg] = useState("");
  const msgRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const attachRef = useRef(null);
  const buttonRef = useRef(null);

  const scrollBottom = () => {
    setTimeout(() => {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };
  const joinGroup = async () => {
    let payload = {
      chat_by: user?._id,
      chat_with:chat_with||detail?.addedBy?._id||detail?.addedBy,
      property_id:property_id||detail?._id || detail?.id,
      subject: "direct message",
    };
    try {
      const res = await ApiClient.post("chat/join-group", payload);
      if (res.success) {
        setroomId(res?.data?.room_id);
        socket.emit("join-room", {
          room_id: res?.data?.room_id,
          user_id: user?._id,
        });
      }
    } catch (err) {
      console.error("Error joining group:", err);
    }
  };
  useEffect(() => {
    if (directMsg && (detail?.addedBy||chat_with)) joinGroup();
    if (defaultMsg) setMsg(defaultMsg);
  }, [directMsg]);
  useEffect(() => {
    socket.on("receive-message", (res) => {
      // console.log("receive-message",res)
      const msg = res?.data;
      setMessages((prev) => [...prev, msg]);
      scrollBottom();
    });
    socket.on("delete-message", (res) => {
      // console.log("delete-message",res)
      if (res?.status === 200) {
        const msg = res?.data;
        const deleteId = msg?.message_id;
        if (msg?.type === "delete_for_everyone") {
          return setMessages((prev) =>
            prev?.filter((message) => message._id !== deleteId)
          );
        } else if (msg?.type === "delete_for_me") {
          if (msg?.user_id === user?._id) {
            setMessages((prev) =>
              prev?.filter((message) => message._id !== deleteId)
            );
          }
        }
      }
    });
    socket.on("edit-message", (res) => {
      // console.log("edit-message",res)
      if (res?.status === 200) {
        const msg = res?.data;
        const editId = msg?.message_id;
        setMessages((prev) =>
          prev.map((message) =>
            message._id === editId
              ? { ...message, content: msg.content }
              : message
          )
        );
      }
    });
    return () => {
      socket.off("receive-message");
      socket.off("delete-message");
      socket.off("edit-message");
    };
  }, []);

  const sendMessage = () => {
    if (!msg.trim() || !roomId) return;
    const payload = {
      room_id: roomId,
      propertyId:property_id || detail?.id || detail?._id,
      user_id: user?._id,
      content: msg.trim() ,
      type: "TEXT",
    };
    socket.emit("send-message", payload);
    socket.emit("notify-message", payload); //for notification
    setMsg("");
    msgRef.current?.focus();
  };
  const deleteMsg = async (msg, key) => {
    try {
      socket.emit("delete-message", {
        room_id: msg.room_id,
        type: key,
        message_id: msg._id,
        user_id: msg.sender,
      });
      setMessages((prev) => prev?.filter((message) => message._id !== msg._id));
    } catch (error) {
      console.error("Error deleting msg:", error);
    }
  };
  const [editMode, setEditMode] = useState(false);
  const [editItem, setEditItem] = useState({});
  const handleEdit = (itm) => {
    setEditMode(true);
    setEditItem(itm);
    setMsg(itm.content);
    msgRef?.current?.focus();
    scrollBottom();
  };
  const handleUpdateMsg = () => {
    if (!editItem?._id || !msg) return;
    try {
      socket.emit("edit-message", {
        message_id: editItem?._id,
        content: msg,
      });
      setMessages((prev) =>
        prev?.map((message) =>
          message._id === editItem._id ? { ...message, content: msg } : message
        )
      );
      setEditMode(false);
      setEditItem({});
      setMsg("");
    } catch (error) {
      console.error("Error deleting msg:", error);
    }
  };
  const Type = {
    TEXT: "TEXT",
    VIDEO: "VIDEO",
    IMAGE: "IMAGE",
    DOCUMENT: "DOCUMENT",
  };
  const sendFiles = (sman) => {
    if (!sman || !roomId) return;
    const payload = {
      room_id: roomId,
      property_id: property_id||detail?.id || detail?._id,
      user_id: user?._id,
      ...sman,
    };
    setIsOpen(false);
    socket.emit("send-message", payload);
    socket.emit("notify-message", payload); //for notification
    setMsg("");
    msgRef.current?.focus();
    setIsOpen(false);
  };
  const [form, setForm] = useState({
    media: [],
    type: "",
  });
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
        }
      })
      .catch((er) => console.log("err in file upload", er))
      .finally(() => {
        loader(false);
        e.target.value = "";
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        attachRef.current &&
        !attachRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false); // Close dropdown if clicked outside
      }
    };

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    // Cleanup listener on unmount or when dropdown closes
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (

      <Dialog
        open={directMsg}
        onClose={() => {
          setDefaultMsg("");
          setMsg("");
          setdirectMsg(false);
        }}
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30 z-[9]" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 z-[10]">
          <DialogPanel className=" max-w-lg w-full space-y-4 border bg-white p-5">
            <DialogTitle className="font-bold">Send Direct Message</DialogTitle>
            <div>
              <div
                ref={chatContainerRef}
                className="min-h-[300px] max-h-[300px] overflow-y-auto p-5 mb-2 border rounded-[5px]"
              >
                {messages?.length > 0 ? (
                  messages.map((msg, i) => (
                    <>
                      <div key={i} style={{ marginBottom: "10px" }}>
                        <div className="">
                          <div
                            className={`${
                              user?._id == msg?.sender ? "ml" : "me"
                            }-auto w-[50%] mb-5 `}
                          >
                            <div
                              className={`flex items-start relative ${
                                user?._id == msg?.sender ? "justify-end" : ""
                              }`}
                            >
                              {msg?.type === Type.TEXT ? (
                                <p
                                  className={`${
                                    user?._id == msg?.sender
                                      ? "bg-[#E9E9E9]"
                                      : "bg-[#8F3EAD] text-white"
                                  } rounded-[10px] p-3 flex w-full`}
                                >
                                  {msg.content}
                                </p>
                              ) : msg?.type === Type.IMAGE ? (
                                <div className="relative w-[100px] h-[100px] object-cover bg-[#efefef] p-1 rounded-[5px] border">
                                  <img
                                    alt=""
                                    src={imagePath(
                                      msg?.media?.[0]?.fileName,
                                      "/assets/img/business.png"
                                    )}
                                    className="w-full h-full object-cover mx-auto "
                                  />
                                  {/* Hover Overlay */}
                                  <div className="absolute inset-0 flex items-center justify-center bg-[#976DD0] bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[5px]">
                                    <p
                                      onClick={() =>
                                        downloadFile(msg?.media?.[0]?.fileName)
                                      }
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
                                      onClick={() =>
                                        downloadFile(msg?.media?.[0]?.fileName)
                                      }
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
                              {user?._id == msg?.sender && (
                                <div className="absolute -right-4 top-0 overflow-hidden">
                                  <Menu>
                                    <MenuButton>
                                      <HiDotsVertical
                                        className={`${
                                          user?._id == msg?.sender
                                            ? ""
                                            : "text-white"
                                        } mt-[2px]`}
                                      />
                                    </MenuButton>
                                    <MenuItems
                                      anchor="bottom"
                                      className="bg-white p-2 px-4 rounded-[10px]  shadow-md z-[999]"
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
                                            onClick={() =>
                                              downloadFile(
                                                msg?.media?.[0]?.fileName
                                              )
                                            }
                                            className="flex items-center mb-2 cursor-pointer"
                                          >
                                            {msg?.type === Type.DOCUMENT ? (
                                              <FiDownload className="me-2 text-[15px]" />
                                            ) : (
                                              <FiEye className="me-2 text-[15px]" />
                                            )}
                                            <span className="text-[14px] text-[#333]">
                                              {msg?.type === Type.DOCUMENT
                                                ? "Download"
                                                : "View"}
                                            </span>
                                          </p>
                                        </MenuItem>
                                      )}
                                      <MenuItem>
                                        <p
                                          onClick={() =>
                                            deleteMsg(msg, "delete_for_me")
                                          }
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
                                            deleteMsg(
                                              msg,
                                              "delete_for_everyone"
                                            )
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
                            <p className="text-[#47525E] text-end text-[12px]">
                              {moment(msg?.createdAt).local().format("h:mm A")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ))
                ) : (
                  <div className="min-h-[250px] max-h-[250px] h-full flex items-center justify-center flex-col">
                    <img
                      src="/assets/img/message.svg"
                      className="w-[100px] mx-auto "
                    />
                    <p className="text-center">No chats</p>
                  </div>
                )}
              </div>
              <div>
                <div className=" pt-3 px-2 bg-[#f6f0f8]">
                  <div className="flex border border-[#8492A6] bg-white rounded-[10px] ">
                    <div className="flex items-center justify-center ps-4 relative">
                      <div className="relative">
                        <button
                          ref={buttonRef} // Button ref
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent click from propagating to document
                            setIsOpen(!isOpen); // Toggle dropdown visibility
                          }}
                        >
                          <LuPaperclip />
                        </button>

                        {isOpen && (
                          <div
                            ref={attachRef} // Dropdown content ref
                            className="absolute top-full left-0 bg-white p-2 px-4 rounded-[10px] shadow-md border border-[#efefef] mt-2"
                          >
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
                      // style={{ resize: 'none', overflowY: 'auto', maxHeight: 'calc(4 * 1.5em)' }}
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
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

  );
};

export default DirectMsgModal;
