import React, { useEffect, useState } from "react";
import moment from "moment";
import methodModel from "../../methods/methods";

function FromNow({ date }) {
  const [now, setNow] = useState(moment());
  const [time, setTime] = useState(now.diff(date, "secs"));

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(moment());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    setTime(now.diff(date, "secs"));
  }, [now]);

  let hours = time / (1000 * 60 * 60);
  return hours < 24 ? methodModel.msToTime(time) : moment(date).fromNow();
}

export default FromNow;
