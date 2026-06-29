import React from "react";
import { Popover } from "antd";

function PopoverHover({ children, content }) {
  return <Popover content={content}>{children}</Popover>;
}

export default PopoverHover;
