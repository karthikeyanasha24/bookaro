import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";
import PageLayout from "../../components/global/PageLayout";
import socket from "../../config/ChatSocket/socket";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { imagePath, stringSeprator } from "../../models/string.model";
import ChatScreen from "./ChatScreen";
import Swal from "sweetalert2";

const Chat = () => {
  const { user } = useSelector((state) => state);
  const [myProps, setMyProps] = useState([]);
  const [activeProp, setActiveProp] = useState({});
  const [searchProp, setSearchProp] = useState("");
  const [filteredProps, setFilteredProps] = useState(myProps);
  const [users, setUsers] = useState([])
  const [activeUser, setActiveUser] = useState({});
  const [mySelf, setMySelf] = useState({});
  const [searchUser, setSearchUser] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users)
  const [msg, setMsg] = useState("");
  const msgRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [totalMsg, setTotalMsg] = useState(0);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(10);
  const [showLoading, setShowLoading] = useState(false);
  const [editMode, setEditMode] = useState(false)
  const [editItem, setEditItem] = useState({})

  const scrollBottom = () => {
    setTimeout(() => {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  }

  const resetFilter = () => {
    setPage(1)
    setCount(10)
    setTotalMsg(0)
  }

  const userType = () => {
    if (activeProp?.property_addedby === user?._id) return "owner"
    else return "user"
  }

  const getMyProps = async () => {
    let dto = {
      login_user_id: user?._id || user?._id,
      user_id: user?._id,
      // sortBy: "createdAt desc", //updatedAt desc
    };
    try {
      loader(true);
      const res = await ApiClient.get("chat/property-chats", dto);
      if (res.success) {
        setMyProps(res?.data?.data);
        if (res?.data?.data?.length === 1) setActiveProp(res.data.data[0])
      }
    } catch (er) {
      console.error("Error fetching properties:", er);
    } finally {
      loader(false);
    }
  };

  useEffect(() => {
    if (myProps) setFilteredProps(myProps)
  }, [myProps])

  const handleSearchProp = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchProp(value);
    const filtered = myProps?.filter((item) =>
      item?.propertyTitle?.toLowerCase().includes(value) || item?.property_address.toLowerCase().includes(value)
    );
    setFilteredProps(filtered);
  };

  useEffect(() => {
    getMyProps()
  }, [])

  useEffect(() => {
    if (activeProp?.property_id) getUsers();
    setActiveUser({})
    setMessages([])
    resetFilter()
  }, [activeProp?.property_id])

  const getUsers = async () => {
    let dto = {
      login_user_id: user?._id,
      property_id: activeProp?.property_id || activeProp?._id,
    };
    try {
      loader(true);
      const res = await ApiClient.get("chat/room-members", dto);
      if (res.success) {
        const self = res?.data?.data?.find(itm => itm?._id === user?._id);
        setMySelf(self);
        const exceptMe = res?.data?.data?.filter(itm => itm?._id !== user?._id);
        if (activeProp?.property_addedby === user?._id) {
          setUsers(exceptMe);
          if (exceptMe?.length === 1) setActiveUser(exceptMe[0])
        } else {
          const onlyOwner = exceptMe?.find(el => el?.user_id === activeProp?.property_addedby);
          setUsers(onlyOwner ? [onlyOwner] : []);
          if (onlyOwner) setActiveUser(onlyOwner)
        }
      }
    } catch (er) {
      console.error("Error fetching users:", er);
    } finally {
      loader(false);
    }
  };

  useEffect(() => {
    if (users) setFilteredUsers(users)
  }, [users])

  const handleSearchUser = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchUser(value);
    const filtered = users?.filter((item) =>
      item?.user_details?.fullName?.toLowerCase()?.includes(value) || item?.user_details?.accountType?.toLowerCase()?.includes(value)
    );
    setFilteredUsers(filtered);
  };

  const handleTabChange = (tab) => {
    filterUsers(searchUser, tab);
  };

  const filterUsers = (search, tab) => {
    let filtered = users;
    if (search) {
      filtered = filtered?.filter((item) =>
        item?.user_details?.fullName?.toLowerCase()?.includes(search) || item?.user_details?.accountType?.toLowerCase()?.includes(search)
      );
    }
    if (tab === "individual" || tab === "pro") {
      filtered = filtered.filter((item) => item?.user_details?.accountType === tab);
    }
    //  else if (tab === "pro") {
    //   filtered = filtered.filter((item) => item?.user_details?.accountType === "pro");
    // }
    setFilteredUsers(filtered);
  };

  const sendMessage = () => {
    if (!msg.trim() || !activeUser.room_id) return;
    const payload = {
      room_id: userType() === "owner" ? activeUser?.room_id?.[0] : mySelf?.room_id?.[0],
      propertyId: activeUser.property_id,
      user_id: user?._id,
      content: msg,
      type: "TEXT",
    };
    socket.emit("send-message", payload);
    socket.emit("notify-message", payload); //for notification
    setMsg("");
    msgRef.current?.focus();
  };

  const sendFiles = (sman) => {
    if (!sman || !activeUser.room_id) return;
    const payload = {
      room_id: userType() === "owner" ? activeUser?.room_id?.[0] : mySelf?.room_id?.[0],
      propertyId: activeUser.property_id,
      user_id: user?._id,
      ...sman
    };
    socket.emit("send-message", payload);
    socket.emit("notify-message", payload); //for notification
    setMsg("");
    msgRef.current?.focus();
  };

  useEffect(() => {
    if (activeUser?.room_id?.[0] && user?._id) {
      joinGroup();
    }
    return () => {
      socket.off("receive-message");
      socket.off("join-room");
    };
  }, [activeUser?.room_id?.[0]]);

  const joinGroup = async () => {
    try {
      socket.emit("join-room", {
        room_id: userType() === "owner" ? activeUser?.room_id?.[0] : mySelf?.room_id?.[0],
        user_id: user.id,
      });
      socket.on("receive-message", (res) => {
        const msg = res?.data;
        setMessages((prev) => [...prev, msg]);
        scrollBottom();
      });
      socket.on('error', (res) => {
        const msg = res?.message || "Something went wrong";

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `${msg} Upgrade your plan`,
          confirmButtonText: 'OK'
        });
      });
      socket.on("delete-message", (res) => {
        if (res?.status === 200) {
          const msg = res?.data;
          const deleteId = msg?.message_id;
          if (msg?.type === "delete_for_everyone") {
            return setMessages((prev) => prev?.filter((message) => message._id !== deleteId));
          } else if (msg?.type === "delete_for_me") {
            if (msg?.user_id === user?._id) {
              setMessages((prev) => prev?.filter((message) => message._id !== deleteId));
            }
          }
        }
      });
      socket.on("edit-message", (res) => {
        if (res?.status === 200) {
          const msg = res?.data;
          const editId = msg?.message_id;
          setMessages((prev) =>
            prev.map((message) =>
              message._id === editId ? { ...message, content: msg.content } : message
            )
          );
        }
      });
    } catch (error) {
    }
  };

  const getChat = async (pagenum = 1) => {
    let dto = {
      room_id: userType() === "owner" ? activeUser?.room_id?.[0] : mySelf?.room_id?.[0],
      login_user_id: user?._id,
      sortBy: "createdAt desc",
    };
    if (messages.length >= totalMsg && totalMsg !== 0) {
      // return
      console.log("All messages are loaded. No API call made.");
    }
    const remainingMessages = totalMsg > 0 ? totalMsg - messages.length : count;
    const currentCount = remainingMessages < count ? remainingMessages : count;

    if (page < 1) loader(true)
    else { setShowLoading(true) }

    try {
      const res = await ApiClient.get("chat/messages", {
        count: currentCount,
        page: pagenum, ...dto,
      });
      if (res.success) {
        setTotalMsg(res.data.total);
        const newMsg = res.data.data || [];
        const reverseMsg = newMsg.reverse();
        setMessages((msgs) => [...reverseMsg, ...msgs]);
      }
    } catch (er) {
      console.log(er);
    } finally {
      loader(false);
      setShowLoading(false);
    }
  }

  // load more messages on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      const { scrollTop } = chatContainerRef.current;
      if (scrollTop === 0 && !showLoading && messages.length < totalMsg) {
        const previousScrollHeight = chatContainerRef.current.scrollHeight;
        const nextPage = page + 1;
        setPage(nextPage);
        getChat(nextPage)
          ?.then(() => {
            const currentScrollHeight = chatContainerRef.current.scrollHeight;
            chatContainerRef.current.scrollTop = currentScrollHeight - previousScrollHeight;
          });
      }
    };
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [messages, totalMsg, showLoading, page]);

  useEffect(() => {
    if (activeUser.room_id) getChat();
    setMessages([])
    resetFilter()
  }, [activeUser.room_id])

  const deleteMsg = async (msg, key) => {
    try {
      socket.emit("delete-message", {
        room_id: msg.room_id,
        type: key,
        message_id: msg._id,
        user_id: msg.sender,
      });
    } catch (error) {
      console.error("Error deleting msg:", error);
    }
  }

  const handleEdit = (itm) => {
    setEditMode(true);
    setEditItem(itm);
    setMsg(itm.content)
    msgRef?.current?.focus();
    scrollBottom();
  }

  const handleUpdateMsg = () => {
    if (!editItem?._id || !msg) return;
    try {
      socket.emit("edit-message", {
        message_id: editItem?._id,
        content: msg,
      });
      setEditMode(false);
      setEditItem({});
      setMsg("")
    } catch (error) {
      console.error("Error deleting msg:", error);
    }
  }

  return (
    <PageLayout>
      <div className="bg-[#f9f9f9]">
        <div className=" mx-auto px-6 lg:px-16 ">
          <div className="grid grid-cols-12 py-10 gap-10">
            <div className="xl:col-span-3 lg:col-span-4 col-span-12 ">
              <div className="mb-3">
                <input
                  type="search"
                  className="bg-[#F0F0F0] text-[#47525E] rounded-[7px] p-3 w-full"
                  placeholder="Search property"
                  value={searchProp}
                  onChange={handleSearchProp}
                />
              </div>
              <ul className={`bg-white rounded-[7px] p-2 h-[498px] overflow-auto ${filteredProps?.length > 0 ? "" : "h-[90%]"}`}>
                {filteredProps?.length > 0 ? filteredProps?.map(itm => (
                  <li
                    key={itm?.property_id}
                    onClick={() => { setActiveProp(itm) }}
                    className={`${activeProp?.property_id == itm?.property_id ? "bg-[#F1EDF6]" : ""} flex border-b border-[#DCDCDC] p-2`}>
                    <img alt=""
                      src={imagePath(itm?.property_images?.[0]?.file, "assets/img/prop-one.jpg")}
                      className="xl:w-[40px] xl:h-[40px] w-[30px] h-[30px] rounded-[5px] me-3 cover"
                    />
                    <div className="cursor-pointer w-full">
                      <span className="text-[#343F4B] ellipses h-[20px] leading-[20px] capitalize 2xl:text-[15px] text-[13px]">
                        {stringSeprator(itm?.propertyTitle, 30)}
                      </span>
                      <p className="text-[#6B6B6B] ellipses h-[20px] leading-[20px] 2xl:text-[15px] text-[13px]">
                        {stringSeprator(itm?.property_address, 30)}
                      </p>
                      {+itm?.unread_count > 0 && <h2 className="text-[#6B6B6B]  font-[600] 2xl:text-[15px] text-[13px]">
                        {itm?.unread_count} new message{`${+itm?.unread_count < 2 ? "" : "s"}`}
                      </h2>}
                    </div>
                  </li>
                )) : (
                  <div className=" h-full flex items-center justify-center flex-col  text-[#828282]">
                    <img alt="" src="/assets/img/no-property.svg" className="w-[40px] mx-auto " />
                    <p className="text-center mt-2">No Property Found</p>
                  </div>
                )}
              </ul>
            </div>
            <div className="xl:col-span-9 lg:col-span-8 col-span-12  ">
              <div className="grid grid-cols-12 gap-4">
                <div className=" xl:col-span-4 lg:col-span-5 col-span-12 ">
                  <div className="bg-white rounded-[7px] xl:p-5 p-3 h-full">
                    <div className="relative">
                      <IoSearch className="absolute left-3 top-4" />
                      <input
                        type="search"
                        className="bg-[#F0F0F0] text-[#47525E] rounded-[7px] pe-3 py-3 w-full ps-[40px]"
                        placeholder="Search contact"
                        value={searchUser}
                        onChange={handleSearchUser}
                      />
                    </div>
                    <TabGroup>
                      <TabList className="border-b border-[#D5D5D5] py-4 flex">
                        <Tab onClick={() => handleTabChange("all")}
                          className="text-[#828282] data-[selected]:text-[#2CAAA3] data-[selected]:font-[600] mx-1 lg:text-[14px] text-[12px] ">
                          All
                        </Tab>
                        <Tab onClick={() => handleTabChange("individual")}
                          className="text-[#828282] data-[selected]:text-[#2CAAA3] data-[selected]:font-[600] mx-1 md:text-[14px] text-[13px]">
                          Individual
                        </Tab>
                        <Tab onClick={() => handleTabChange("pro")}
                          className="text-[#828282] data-[selected]:text-[#2CAAA3] data-[selected]:font-[600] mx-1 md:text-[14px] text-[13px]">
                          Professional
                        </Tab>
                      </TabList>
                      <TabPanels>
                        <TabPanels>
                          {[0, 1, 2].map(() => (
                            <TabPanel>
                              <ul className="overflow-auto h-[410px] pe-3">
                                {filteredUsers?.length > 0 ?
                                  filteredUsers?.map(itm => {
                                    return (
                                      <li
                                        onClick={() => {
                                          resetFilter()
                                          setActiveUser(itm)
                                        }}
                                        className={`${itm?.user_id === activeUser?.user_id ? "bg-[#F1EDF6]" : ""} flex border-b border-[#D5D5D5] p-2`}>
                                        <img alt=""
                                          src={imagePath(itm?.user_details?.image, "/assets/img/placeholder.png")}
                                          className="xl:w-[40px] xl:h-[40px] w-[30px] h-[30px] rounded-[50px] me-3 cover"
                                        />
                                        <div className="cursor-pointer w-full">
                                          <span className="text-[#828282]  h-[20px] leading-[20px] font-[600] 2xl:text-[15px] text-[14px] capitalize">
                                            {itm?.user_details?.fullName}
                                          </span>
                                          <p className="text-[#828282]  h-[20px] leading-[20px] text-[14px]">
                                            {itm?.user_details?.accountType}
                                          </p>
                                          <h2 className="text-[#828282] xl:text-[14px] text-[13px]">
                                            {moment(itm?.createdAt).fromNow()}
                                          </h2>
                                        </div>
                                      </li>
                                    )
                                  }) : (
                                    <li className="text-center"><span className="text-[#828282]  leading-[20px] font-[500] text-[15px] text-center">
                                      <div className=" h-full flex items-center justify-center flex-col">
                                        <img src="/assets/img/no-user.svg" className="w-[40px] mx-auto mt-40 " />
                                        <p className="text-center mt-2">No user found</p>
                                      </div>
                                    </span></li>
                                  )}
                              </ul>
                            </TabPanel>
                          ))}
                        </TabPanels>
                      </TabPanels>
                    </TabGroup>
                  </div>
                </div>
                <div className="xl:col-span-8 lg:col-span-7 col-span-12 h-[558px]">
                  <ChatScreen
                    messages={messages}
                    totalMsg={totalMsg}
                    showLoading={showLoading}
                    chatContainerRef={chatContainerRef}
                    activeUser={activeUser}
                    handleEdit={handleEdit}
                    deleteMsg={deleteMsg}
                    msgRef={msgRef}
                    msg={msg}
                    setMsg={setMsg}
                    editMode={editMode}
                    handleUpdateMsg={handleUpdateMsg}
                    sendMessage={sendMessage}
                    sendFiles={sendFiles}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Chat;
