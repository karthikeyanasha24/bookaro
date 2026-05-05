import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../actions/user";
import Html from "./Html";
import "./style.scss";

import { memo } from 'react';

const Header = memo(function Header({ setIsOpen, isOpen, particularData }) {
  const user = useSelector((state) => state.user);
  const toggle = () => {
    setIsOpen(!isOpen);
    localStorage.setItem("sidebar", !isOpen);
  };
  const [isOpen1, setIsOpen1] = useState(false);
  let messagecount = localStorage.getItem("unreadMessages") || 0;
  const [messageCount, setUnreadMessagesCount] = useState(messagecount);
  const history = useNavigate();
  const dispatch = useDispatch();

  const searchState = { data: "" };

  const Logout = () => {
    dispatch(logout());
    localStorage.removeItem("persist:admin-app");
    localStorage.removeItem("token");
    history("/login");
  };


  useEffect(() => {
    window.scrollTo({ top: 0 });
    // if (searchState.data) {
    //   dispatch(search_success(''))
    // }
  }, []);

  useEffect(() => {
    setSearch(searchState.data);
  }, [searchState]);

  const [search, setSearch] = useState("");

  const searchHandle = (e) => {
    e.preventDefault();
    // dispatch(search_success(search))
  };

  const searchChange = (e) => {
    setSearch(e);
    if (!e) {
      // dispatch(search_success(''))
    }
  };

  const clear = () => {
    setSearch("");
    // dispatch(search_success(''))
  };

  return (
    <Html
      isOpen={isOpen}
      toggle={toggle}
      searchHandle={searchHandle}
      search={search}
      user={user}
      searchChange={searchChange}
      isOpen1={isOpen1}
      clear={clear}
      Logout={Logout}
      messageCount={messageCount}
      particularData={particularData}
    />
  );
});

export default Header;
