import React, { useEffect, useRef, useState } from "react";
import ApiClient from "../../../methods/api/apiClient";
import Html from "./html";
import "./style.scss";

const ImageUpload = ({
  model,
  result,
  accept="image/*",
  value,
  multiple,
  required,
  err,
  label = "",
  type="img"
}) => {
  const inputElement = useRef();
  const [img, setImg] = useState("");
  const [loading, setLoader] = useState(false);

  const uploadImage = async (e) => {
    let url = "upload/Image";
    let files = e.target.files;
    if (files?.length > 1) {
      url = "upload/Image";
    }

    let images = [];
    if (img) images = img;
    setLoader(true);
    ApiClient.multiImageUpload(url, files, {}, "file").then((res) => {
      if (res.fileName) {
        // let image = res.files.map((itm) => itm.fileName);
        let image = [res.fileName]
        if (!multiple) {
          setImg(image[0]);
          result({ event: "value", value: image[0] });
        } else {
          images = [...images, ...image];
          setImg(images);
          result({ event: "value", value: images });
        }
      }
      setLoader(false);
    });
  };

  const remove = (index) => {
    if (multiple) {
      let images = img.filter((itm, idx) => idx !== index);
      result({ event: "remove", value: images });
      setImg(images);
    } else {
      result({ event: "remove", value: "" });
      setImg("");
    }
  };

  useEffect(() => {
    setImg(value);
  }, [value]);

  return (
    <>
      <Html
      type={type}
        label={label}
        multiple={multiple}
        inputElement={inputElement}
        uploadImage={uploadImage}
        img={img}
        model={model}
        accept={accept}
        required={required}
        loader={loading}
        err={err}
        remove={remove}
      />
    </>
  );
};
export default ImageUpload;
