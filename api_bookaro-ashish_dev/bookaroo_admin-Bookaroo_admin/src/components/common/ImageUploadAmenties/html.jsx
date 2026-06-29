
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
  disabled,
}) => {
  return (
    <>
      <div className="">
        <div>
          <label
            className={`block cursor-pointer text-gray-500  border border-[#976DD0] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-8 py-2 text-center w-full h-[150px] flex items-center justify-center ${img && !multiple ? "d-none" : ""
              }`}
          >
            <input
              type="file"
              className="hidden"
              ref={inputElement}
              accept={accept}
              multiple={multiple ? true : false}
              disabled={disabled || loader}
              onChange={(e) => {
                uploadImage(e);
              }}
            />
            <div className="flex  items-center justify-center flex-col">
              <img src="/assets/img/icons/circle-plus.png" className="w-[40px] mb-4" />
              <span className="text-[#47525E] font-[600] text-[16px]">
                {label || "Add pictures"}
              </span>
            </div>
          </label>

          {loader && (
            <div className="text-success text-center mt-2">
              Uploading... <i className="fa fa-spinner fa-spin"></i>
            </div>
          )}

          {required && !img && (
            <div className="text-danger">{err ? err : "Image is Required"}</div>
          )}
        </div>
      </div>
    </>
  );
};
export default Html;
