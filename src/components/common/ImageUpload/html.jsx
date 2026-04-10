import React from "react";
import methodModel from "../../../methods/methods";
import { FiPlus } from "react-icons/fi";

const Html = ({
  inputElement,
  uploadImage,
  img,
  remove,
  loader,
  model,
  multiple,
  required,
  accept,
  err,
  type,
  label = "",
}) => {
  return (
    <>
      <label
        className={`block cursor-pointer text-gray-500 bg-white border border-dashed border-[#00358575] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-8 py-2 text-center ${img && !multiple ? "d-none" : ""
          }`}
      >
        <input
          type="file"
          className="hidden"
          ref={inputElement}
          accept={accept}
          multiple={multiple ? true : false}
          disabled={loader}
          onChange={(e) => {
            uploadImage(e);
          }}
        />
        <div className="flex  items-center justify-center">
          <FiPlus className="text-2xl text-[#976DD0] me-2" />
          <span>{label || "Please upload images"}</span>
        </div>
      </label>

      {loader ? (
        <div className="text-success text-center mt-2">
          Uploading... <i className="fa fa-spinner fa-spin"></i>
        </div>
      ) : (
        <></>
      )}

      {type == 'img' ? <>
        {multiple ? (
          <>
            <div className="imagesRow">
              {img &&
                img.map((itm, i) => {
                  return (
                    <div className="imagethumbWrapper">
                      <img
                        src={methodModel.noImg(itm,'img')}
                        className="thumbnail"
                      />
                      <i
                        className="fa fa-times"
                        title="Remove"
                        onClick={(e) => remove(i)}
                      ></i>
                    </div>
                  );
                })}
            </div>
          </>
        ) : (
          <>
            {img ? (
              <div className="imagethumbWrapper">
                <img src={methodModel.noImg(img,'img')} className="thumbnail  w-[100px] h-[100px] object-cover " />
                <i
                  className="fa fa-times"
                  title="Remove"
                  onClick={(e) => remove()}
                ></i>
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </> : <>
        {img ? <>
          {multiple ? <>
            <div className="flex gap-3">
              {img.map((itm, i) => {
                return <div className="imagethumbWrapper">
                  <a className="" target="_new" href={methodModel.noImg(itm, model)}>
                    <span class="material-symbols-outlined text-[50px]">draft</span>
                  </a>
                  <i
                    className="fa fa-times"
                    title="Remove"
                    onClick={(e) => remove(i)}
                  ></i>
                </div>
              })}
            </div>
          </> : <>
            <div className="imagethumbWrapper">
              <a className="" target="_new" href={methodModel.noImg(img, model)}>
                <span class="material-symbols-outlined text-[50px]">draft</span>
              </a>
              <i
                className="fa fa-times"
                title="Remove"
                onClick={(e) => remove()}
              ></i>
            </div>

          </>}

        </> : <></>}

      </>}



      {required && !img ? (
        <div className="text-danger">{err ? err : "Image is Required"}</div>
      ) : (
        <></>
      )}
    </>
  );
};
export default Html;
