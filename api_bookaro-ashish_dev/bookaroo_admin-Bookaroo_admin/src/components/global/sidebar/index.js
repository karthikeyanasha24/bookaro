import React, { useEffect, useState } from "react";
import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import Html from "./Html";
import { useSelector } from "react-redux";

const Sidebar = ({ isOpen , menus}) => {
  const user = useSelector((state) => state.user);
  const history = useNavigate();
  const menustabs = {
    user: ["roles", "users"],
    catalogue: ["types", "categories", "category/"],
    plan: ["features", "plans"],
    api: ["bookingSystem", "pos", "reviews", "accountingSystem"],
    geo: ["continents", "countries", "regions", "cities"],
    dynamicPricing: ["dynamicprice"],
    skills: ["skills", "skill-roles"],
  };

  const ListItemLink = ({ to, type = "link", disabled = false, ...rest }) => {
    let url = window.location.href;
    const host = window.location.host;
    url = url.split(host)[1];
    return (
      <>
        {type == "link" ? (
          <li
            className={`nav-item ${url.includes(to) ? "active" : ""} ${
              disabled ? "disabled" : ""
            }`}
          >
            {/* {...rest} */}
            <Link to={to} {...rest} className="" />
          </li>
        ) : (
          <li
            className={`nav-item main ${url.includes(to) ? "active" : ""}`}
            {...rest}
          ></li>
        )}
      </>
    );
  };

  const tabclass = (tab) => {
    let url = window.location.href;
    let value = false;
    menustabs[tab]?.map((itm) => {
      if (url.includes(itm)) value = true;
    });
    return value;
  };

  const isAllow = (url = "") => {
    let permissions = user?.permissions?.[0];
    let arr = url.split(",");
    let value = false;

    if (user?.role === "staff" && arr.includes("readstaff")) {
      return false;
    }

    arr.forEach((itm) => {
      if (permissions?.[itm]) value = permissions?.[itm];
    });

    if (!url || user?.role === "admin") value = true;

    return value;
  };

  const route = (p) => {
    history(p);
  };

  return (
    <>
      <Html
        user={user}
        route={route}
        tabclass={tabclass}
        isAllow={isAllow}
        ListItemLink={ListItemLink}
        isOpen={isOpen}
        menus={menus}
      />
    </>
  );
};

export default Sidebar;
