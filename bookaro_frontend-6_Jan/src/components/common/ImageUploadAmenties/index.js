import React, { useEffect, useRef, useState } from "react";
import ApiClient from "../../../methods/api/apiClient";
import Html from "./html";
import "./style.scss";
import { toast } from "react-toastify";

const ImageUploadAmenties = ({
  model,
  result,
  accept = "image/*",
  value,
  multiple,
  required,
  err,
  label = "",
  type = "img"
}) => {
  const inputElement = useRef();
  const [img, setImg] = useState("");
  const [loading, setLoader] = useState(false);

  const uploadImage = async (e) => {
    let url = "upload/Image";
    let dataFile = "file";
    let files = Array.from(e.target.files);
    if (multiple) {
      url = "upload/multiple-images";
      dataFile = "files";
    }

    let images = img ? [...img] : [];
    const newImageFiles = files.map((file) => file.name); // Get filenames of new images
    const totalImagesCount = images.length + newImageFiles.length;

    // Max length check for 10 images
    if (totalImagesCount > 10) {
      toast.error("Maximum 10 images allowed to add");
      return e.target.value = ""; // Clear file input to prevent unintended uploads
    }
    // Check for max file size (10MB)
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB in bytes
    const oversizedFiles = files.filter((file) => file.size > maxSizeInBytes);
    if (oversizedFiles.length > 0) {
      toast.error("Each image must be smaller than 10MB");
      return e.target.value = ""; // Clear file input
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/heic'];
    const unsupportedFiles = files.filter((file) => !allowedTypes.includes(file.type));
    if (unsupportedFiles.length > 0) {
      toast.error("Supported formats are jpeg, png, heic only");
      return e.target.value = ""; // Clear file input
    }
    setLoader(true);
    ApiClient.multiImageUpload(url, files, {}, dataFile).then((res) => {
      if (res.success) {
        if (!multiple) {
          let image = [res.fileName]
          setImg(image[0]);
          result({ event: "value", value: image[0] });
        } else {
          let image = res.files.map((itm) => itm.fileName);
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
export default ImageUploadAmenties;
