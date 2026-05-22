import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import PageLayout from "../../components/global/PageLayout";
import socket from "../../config/ChatSocket/socket";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { imagePath, stringSeprator } from "../../models/string.model";
import { enableGuestMode, disableGuestMode, isGuestMode } from "../../methods/guestMode";
import ChatScreen from "./ChatScreen";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const Chat = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);
  const isGuest = isGuestMode() || user?.isGuest || !user?._id;
  const guestQueryParams = (params = {}) => (isGuest ? { ...params, guest: 'true' } : params);

  const guestPropMock = {
    property_id: 'guest-prop-1',
    propertyTitle: 'Maison familiale',
    property_address: 'Paris, 75000',
    property_addedby: 'guest-user-000',
    property_images: [{ file: '/assets/img/dashboard/attractivity/attractivity-1.jpg' }],
    unread_count: 0,
    addedByLabel: 'Propriétaire',
  };

  const guestRoomMembersMock = (room_id = 'guest-room-1') => [
    {
      _id: 'guest-room-member-self',
      user_id: 'guest-user-000',
      user_role: 'owner',
      user_name: 'Propriétaire',
      user_logo: null,
      user_image: null,
      isOnline: false,
      room_id: [room_id],
      subject: 'Discussion au sujet de la Maison familiale',
      user_details: {
        _id: 'guest-user-000',
        fullName: 'Propriétaire',
        image: null,
        accountType: 'owner',
        isOnline: false,
        email: 'guest@bookaroo.local',
      },
      property_id: guestPropMock.property_id,
    },
    {
      _id: 'guest-room-member-1',
      user_id: 'guest-buyer-001',
      user_role: 'individual',
      user_name: 'Marine Lefèvre',
      user_logo: null,
      user_image: null,
      isOnline: false,
      room_id: [room_id],
      subject: 'Discussion au sujet de la Maison familiale',
      user_details: {
        _id: 'guest-buyer-001',
        fullName: 'Marine Lefèvre',
        image: null,
        accountType: 'individual',
        isOnline: false,
        email: 'marine.lefevre@anyhomes.local',
      },
      property_id: guestPropMock.property_id,
    },
  ];

  const guestMessagesMock = (room_id = 'guest-room-1') => [
    {
      _id: 'guest-msg-1',
      type: 'text',
      room_id,
      sender: 'guest-buyer-001',
      sender_name: 'Marine Lefèvre',
      content: "Bonjour, j'ai vu votre maison familiale sur AnyHomes. Même si je sais qu'elle n'est pas à vendre, je suis très intéressée et j'aimerais savoir si vous seriez prêt à en discuter.",
      media: [],
      message_type: 'text',
      isRead: true,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
      _id: 'guest-msg-2',
      type: 'text',
      room_id,
      sender: 'guest-user-000',
      sender_name: 'Propriétaire',
      content: "Bonjour Marine, c'est bien ma maison. Je n'envisage pas de la vendre tout de suite, mais je peux en parler si votre intérêt est sérieux.",
      media: [],
      message_type: 'text',
      isRead: false,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    },
    {
      _id: 'guest-msg-3',
      type: 'text',
      room_id,
      sender: 'guest-buyer-001',
      sender_name: 'Marine Lefèvre',
      content: "D'accord, merci. Seriez-vous disponible pour un court échange cette semaine ? Je peux m'adapter à vos disponibilités.",
      media: [],
      message_type: 'text',
      isRead: false,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      _id: 'guest-msg-4',
      type: 'text',
      room_id,
      sender: 'guest-user-000',
      sender_name: 'Propriétaire',
      content: "Oui, je peux jeudi après-midi ou samedi matin. Dites-moi ce qui vous convient le mieux.",
      media: [],
      message_type: 'text',
      isRead: false,
      isDeleted: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    },
  ];

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
  const [guestDebugLoaded, setGuestDebugLoaded] = useState(false);
  const [chatDebugInfo, setChatDebugInfo] = useState({
    backendGuest: false,
    status: 'pending',
    error: null,
    propertyChats: 0,
    roomMembers: 0,
    messages: 0,
  });

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

  const setGuestChatFromDebug = (data, guestBackend = true) => {
    const propertyChats = data?.responses?.property_chats?.data || [];
    const roomMembers = data?.responses?.room_members?.data || [];
    const responseMessages = data?.responses?.messages?.data || [];

    const primaryProperty = propertyChats[0] || guestPropMock;
    const self = roomMembers.find(
      (itm) =>
        itm?.user_id === 'guest-user-000' ||
        itm?.user_role === 'guest' ||
        itm?.user_role === 'owner'
    );
    const otherMembers = roomMembers.filter(
      (itm) => itm?.user_id !== 'guest-user-000' && itm?.user_role !== 'owner'
    );
    const active = otherMembers[0] || {};

    setMyProps(propertyChats.length ? propertyChats : [guestPropMock]);
    setActiveProp(primaryProperty);
    setUsers(otherMembers);
    setMySelf(self || {});
    setActiveUser(active);
    setTotalMsg(responseMessages.length);
    setMessages(responseMessages);
    setChatDebugInfo({
      backendGuest: guestBackend,
      status: 'loaded',
      error: null,
      propertyChats: propertyChats.length,
      roomMembers: roomMembers.length,
      messages: responseMessages.length,
    });
  };

  const getGuestDebugFull = async () => {
    if (!isGuest || guestDebugLoaded) return;
    try {
      loader(true);
      const res = await ApiClient.get("chat/debug-full", guestQueryParams({}));
      if (res.success) {
        setGuestChatFromDebug(res.data);
      } else {
        setGuestChatFromDebug({
          responses: {
            property_chats: [guestPropMock],
            room_members: guestRoomMembersMock(),
            messages: guestMessagesMock(),
          },
        }, false);
        setChatDebugInfo((prev) => ({
          ...prev,
          backendGuest: false,
          status: 'error',
          error: res?.message || 'Guest debug-full returned no success',
        }));
      }
    } catch (er) {
      console.error("Error fetching guest debug-full:", er);
      setGuestChatFromDebug({
        responses: {
          property_chats: [guestPropMock],
          room_members: guestRoomMembersMock(),
          messages: guestMessagesMock(),
        },
      }, false);
      setChatDebugInfo((prev) => ({
        ...prev,
        backendGuest: false,
        status: 'error',
        error: er?.message || 'Guest backend fetch failed',
      }));
    } finally {
      loader(false);
      setGuestDebugLoaded(true);
    }
  };

  const getMyProps = async () => {
    let dto = {
      login_user_id: user?._id || (isGuest ? 'guest-user-000' : undefined),
      user_id: user?._id || (isGuest ? 'guest-user-000' : undefined),
      // sortBy: "createdAt desc", //updatedAt desc
    };
    try {
      loader(true);
      const res = await ApiClient.get("chat/property-chats", guestQueryParams(dto));
      if (res.success) {
        const propsData = res?.data?.data || [];
        setMyProps(propsData);
        if (!user?._id && propsData.length === 1) {
          setActiveProp(propsData[0]);
        }
        if (isGuest) {
          setChatDebugInfo((prev) => ({
            ...prev,
            backendGuest: true,
            status: 'loaded',
            error: null,
            propertyChats: propsData.length,
          }));
        }
      } else if (!user?._id) {
        setMyProps([guestPropMock]);
        setActiveProp(guestPropMock);
        setChatDebugInfo((prev) => ({
          ...prev,
          backendGuest: false,
          status: 'error',
          error: 'No guest property chat data',
          propertyChats: 0,
        }));
      }
    } catch (er) {
      console.error("Error fetching properties:", er);
      if (!user?._id) {
        setMyProps([guestPropMock]);
        setActiveProp(guestPropMock);
      }
      if (isGuest) {
        setChatDebugInfo((prev) => ({
          ...prev,
          backendGuest: false,
          status: 'error',
          error: er?.message || 'Guest property fetch failed',
        }));
      }
    } finally {
      loader(false);
    }
  };

  useEffect(() => {
    if (myProps) setFilteredProps(myProps)
  }, [myProps])

  useEffect(() => {
    if (!user?._id && myProps?.length > 0 && !activeProp?.property_id) {
      setActiveProp(myProps[0]);
    }
  }, [myProps, user, activeProp]);

  const handleSearchProp = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchProp(value);
    const filtered = myProps?.filter((item) =>
      item?.propertyTitle?.toLowerCase().includes(value) || item?.property_address.toLowerCase().includes(value)
    );
    setFilteredProps(filtered);
  };

  useEffect(() => {
    if (isGuest) {
      enableGuestMode();
      dispatch({ type: 'ENTER_GUEST_MODE' });
      getGuestDebugFull();
    } else {
      disableGuestMode();
      getMyProps();
    }
  }, [isGuest]);

  useEffect(() => {
    if (activeProp?.property_id) {
      getUsers();
      resetFilter();
    }
  }, [activeProp?.property_id])

  useEffect(() => {
    if (!user?._id && !isGuest && !activeProp?.property_id) {
      setMyProps([guestPropMock]);
      setActiveProp(guestPropMock);
    }
  }, [user, isGuest, activeProp]);

  const getUsers = async () => {
    let dto = {
      login_user_id: user?._id || (isGuest ? 'guest-user-000' : undefined),
      property_id: activeProp?.property_id || activeProp?._id,
    };
    try {
      loader(true);
      const res = await ApiClient.get("chat/room-members", guestQueryParams(dto));
      const members = res.success ? res?.data?.data || [] : [];
      if (!members.length && !user?._id) {
        const fallback = guestRoomMembersMock(activeProp?.room_id?.[0] || 'guest-room-1');
        const fallbackActiveUser =
          fallback.find((itm) => itm?.user_id === activeProp?.property_addedby) ||
          fallback.find((itm) => itm?.user_id !== 'guest-user-000');
        const visibleFallback = fallback.filter(
          (itm) => itm?.user_id !== 'guest-user-000' && itm?.user_role !== 'owner'
        );
        setUsers(visibleFallback);
        setMySelf(
          fallback.find(
            (itm) =>
              itm?.user_id === 'guest-user-000' ||
              itm?.user_role === 'guest' ||
              itm?.user_role === 'owner'
          )
        );
        if (fallbackActiveUser) setActiveUser(fallbackActiveUser);
        return;
      }
      if (res.success) {
        const self = user?._id
          ? members.find((itm) => itm?._id === user?._id)
          : members.find(
              (itm) =>
                itm?.user_id === 'guest-user-000' ||
                itm?.user_role === 'guest' ||
                itm?.user_role === 'owner'
            );
        setMySelf(self || {});
        const exceptMe = user?._id
          ? members.filter((itm) => itm?._id !== user?._id)
          : members.filter(
              (itm) =>
                itm?.user_id !== 'guest-user-000' &&
                itm?.user_role !== 'owner'
            );
        const onlyOwner = exceptMe?.find((el) => el?.user_id === activeProp?.property_addedby);
        if (activeProp?.property_addedby === user?._id) {
          setUsers(exceptMe);
          if (exceptMe?.length > 0) setActiveUser(exceptMe[0]);
        } else {
          setUsers(onlyOwner ? [onlyOwner] : exceptMe);
          if (onlyOwner) {
            setActiveUser(onlyOwner);
          } else if (exceptMe?.length > 0) {
            setActiveUser(exceptMe[0]);
          }
        }
      }
    } catch (er) {
      console.error("Error fetching users:", er);
      if (!user?._id) {
        const fallback = guestRoomMembersMock(activeProp?.room_id?.[0] || 'guest-room-1');
        const visibleFallback = fallback.filter(
          (itm) => itm?.user_id !== 'guest-user-000' && itm?.user_role !== 'owner'
        );
        setUsers(visibleFallback);
        setMySelf(
          fallback.find(
            (itm) =>
              itm?.user_id === 'guest-user-000' ||
              itm?.user_role === 'guest' ||
              itm?.user_role === 'owner'
          )
        );
        setActiveUser(fallback.find((itm) => itm?.user_id === activeProp?.property_addedby));
      }
    } finally {
      loader(false);
    }
  };

  useEffect(() => {
    if (users) setFilteredUsers(users)
  }, [users])

  useEffect(() => {
    if (!activeUser?.room_id?.length && filteredUsers?.length === 1) {
      setActiveUser(filteredUsers[0]);
    }
  }, [filteredUsers, activeUser]);

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
      user_id: user?._id || (isGuest ? 'guest-user-000' : undefined),
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
      user_id: user?._id || (isGuest ? 'guest-user-000' : undefined),
      ...sman
    };
    socket.emit("send-message", payload);
    socket.emit("notify-message", payload); //for notification
    setMsg("");
    msgRef.current?.focus();
  };

  useEffect(() => {
    if (activeUser?.room_id?.[0] && (user?._id || isGuest)) {
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
        user_id: user?._id || user?.id || (isGuest ? 'guest-user-000' : undefined),
      });
      socket.on("receive-message", (res) => {
        const msg = res?.data;
        setMessages((prev) => [...prev, msg]);
        scrollBottom();
      });
      socket.on('error', (res) => {
        const msg = res?.message || t("messages.somethingWrong");

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
      login_user_id: user?._id || (isGuest ? 'guest-user-000' : undefined),
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
      const res = await ApiClient.get("chat/messages", guestQueryParams({
        count: currentCount,
        page: pagenum,
        ...dto,
      }));
      if (res.success) {
        const newMsg = res.data.data || [];
        setTotalMsg(res.data.total);
        const reverseMsg = newMsg.reverse();
        setMessages((msgs) => [...reverseMsg, ...msgs]);
      } else if (!user?._id) {
        const fallback = guestMessagesMock(activeUser?.room_id?.[0] || 'guest-room-1');
        setTotalMsg(fallback.length);
        setMessages((msgs) => [...fallback.reverse(), ...msgs]);
      }
    } catch (er) {
      if (!user?._id) {
        const fallback = guestMessagesMock(activeUser?.room_id?.[0] || 'guest-room-1');
        setTotalMsg(fallback.length);
        setMessages((msgs) => [...fallback.reverse(), ...msgs]);
      } else {
        console.log(er);
      }
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
    if (activeUser?.room_id?.length) {
      resetFilter();
      getChat();
    }
  }, [activeUser?.room_id])

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
        <div className=" mx-auto px-6 lg:px-16 pt-6 ">
          {isGuest && (
            <div className="flex justify-end mb-0.5">
              <span className="dashboard-section-mock-badge inline-flex items-center justify-center px-3 py-1 rounded-full text-[12px] font-semibold text-[#7c4b00] bg-[#fff4dd] shadow-[0_4px_12px_rgba(249,179,71,0.18)] border border-[rgba(249,179,71,0.35)]">
                Données fictives
              </span>
            </div>
          )}
          <div className="grid grid-cols-12 gap-10 pt-1 pb-10">
            <div className="xl:col-span-3 lg:col-span-4 col-span-12 ">
              <div className="mb-3">
                <input
                  type="search"
                  className="bg-[#F0F0F0] text-[#47525E] rounded-[7px] p-3 w-full"
                  placeholder={t("forms.searchProperty")}
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
                        placeholder={t("forms.searchContact")}
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
                    isGuest={isGuest}
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
