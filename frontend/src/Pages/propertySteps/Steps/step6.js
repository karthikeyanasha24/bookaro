import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import ImageUploadAmenties from "../../../components/common/ImageUploadAmenties";
import { imagePath } from "../../../models/string.model";
import { saveChanges } from "../shared";
import SaveDraftModal from "../../../components/common/Modal/SaveDraftModal";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import { useSelector } from "react-redux";
import { RiDraftFill } from "react-icons/ri";
import PropertyCheck from "../PropertyCheck";

const Step6 = ({
  step1,
  setActiveTabIndex,
  formData,
  setFormData,
  amenitiesOptions,
  id,
  editMode = true,
  page,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [errors, setErrors] = useState({ image: "", amenity: "" });
  const user = useSelector((state) => state.user);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draftModal, setdraftModal] = useState(false);
  const [msg, setMsg] = useState("");

  const imageResult = (e) => {
    const uploadedImages = Array.from(e.value);
    if (uploadedImages?.length > 10)
      toast.error(t("propertySteps.step6.errors.maximumImages"));

    const newImages = uploadedImages.map((file) => ({
      file: typeof file === "string" ? file : file.file,
      amenity: null,
      favorite: false,
    }));

    setErrors({ image: "", amenity: "" });
    setFormData((prev) => {
      const existingFiles = new Set(prev.images.map((img) => img.file));
      const uniqueNewImages = newImages.filter(
        (img) => !existingFiles.has(img.file)
      );
      return {
        ...prev,
        images: [...prev.images, ...uniqueNewImages],
      };
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAmenitySelect = (index, amenity) => {
    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index] = {
        ...updatedImages[index],
        amenity,
      };
      return {
        ...prev,
        images: updatedImages,
      };
    });
  };

  const toggleFavorite = (index) => {
    setFormData((prev) => {
      const updatedImages = prev.images.map((img, i) => ({
        ...img,
        favorite: i === index,
      }));
      const favoriteImage = updatedImages[index];
      const remainingImages = updatedImages.filter((_, i) => i !== index);
      return {
        ...prev,
        images: [favoriteImage, ...remainingImages],
      };
    });
  };

  const draftsave = () => {
    const payload = {
      ...formData,
      step: 4,
    };
    loader(true);
    ApiClient.post(`draft/add`, payload, {}, "", true).then((res) => {
      if (res.success) {
        toast.success(res?.message);
        navigate("/");
      } else {
        setdraftModal(true);
        setMsg(res?.message);
      }
      loader(false);
    });
  };

  const validate = () => {
    if (formData?.images?.length === 0) {
      setErrors({ ...errors, image: t("propertySteps.step6.errors.minimumOneImage") });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validate()) return;
    localStorage.setItem("step1", JSON.stringify(formData));
    if (id) {
      navigate(`/property/edit/${id}/6`);
    } else {
      navigate("/property/add/6");
    }
    setActiveTabIndex((prevIndex) => Math.min(prevIndex + 1, 7));
  };

  const handleBack = () => {
    if (id) {
      navigate(`/property/edit/${id}/4`);
    } else {
      navigate("/property/add/4");
    }
    setActiveTabIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== index) {
      setFormData((prev) => {
        const updatedImages = [...prev.images];
        const draggedImage = updatedImages[draggedIndex];
        updatedImages.splice(draggedIndex, 1);
        updatedImages.splice(index, 0, draggedImage);
        return {
          ...prev,
          images: updatedImages,
        };
      });
    }
  };

  const save = () => {
    if (!validate()) return;
    step1.images = formData.images;
    localStorage.setItem("step1", JSON.stringify(step1));
    saveChanges(step1);
  };

  return (
    <>
      <div className=" flex justify-between flex-col h-full relative">
        {/* <PropertyCheck /> */}
        <div className=" lg:overflow-auto lg:h-[500px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
          <div className="flex justify-between items-center gap-3 xl:mb-[50px] lg:mb-[50px] mb-[40px]">
            <h4 className="text-[#47525E] text-[24px] font-[600] ">
              {t("propertySteps.step6.addUpTo10Pictures")}
              <span className="text-[#47525E] font-[400] block text-[14px]">
                {t("propertySteps.step6.mandatoryInformation")}
              </span>
            </h4>
          </div>
          <div className="md:max-w-[500px] w-[100%]">
            <label className="text-[#47525E] font-[600] text-[20px] mb-4 block my-10">
              {t("propertySteps.step6.yourPictures")}
            </label>
            <div className="font-[400] text-[16px] text-[#47525E] mb-3">
              {t("propertySteps.step6.photosAccessInfo")}
            </div>
            <div className="font-[400] text-[16px] text-[#47525E] mb-7">
              {t("propertySteps.step6.reorderInfo")}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-12 md:max-w-[500px] w-[100%] gap-4">
            {formData?.images?.[0] && (
              <div
                className="col-span-full relative"
                draggable
                onDragStart={(e) => handleDragStart(e, 0)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 0)}
              >
                <img
                  src={`${imagePath(formData?.images[0].file)}`}
                  alt=""
                  className="rounded-[10px] h-[250px] w-full object-cover"
                />
                <div>
                  <h5 className="text-[16px] text-white font-[600] bg-[#676460] p-2 px-3 absolute top-[24px] flex items-center">
                    <img
                      src="/assets/img/pngtree-vector-star-icon-png-image_924829.jpg"
                      className="me-2 w-[25px]"
                    />
                    {t("propertySteps.step6.coverPhoto")}
                  </h5>
                </div>
                <div className="flex justify-between">
                  <select
                    disabled={!editMode}
                    onChange={(e) => {
                      if (editMode) {
                        handleAmenitySelect(0, e.target.value);
                        // setErrors({ ...errors, amenity: "" })
                      }
                    }}
                    className="rounded py-2 text-[#5A5A5A] text-[12px] bg-transparent select_checkbox"
                    defaultValue={formData?.images[0]?.amenity || ""}
                  >
                    <option value="">{t("propertySteps.step6.selectAmenity")}</option>
                    {amenitiesOptions.map((amenity) => (
                      <option key={amenity.id} value={amenity.value}>
                        {amenity.name}
                      </option>
                    ))}
                  </select>
                  <button
                    disabled={!editMode}
                    onClick={() => {
                      if (editMode) {
                        handleRemoveImage(0);
                        // setErrors({ ...errors, amenity: "" })
                      }
                    }}
                    className="ml-2 text-red-500"
                  >
                    <img
                      src="/assets/img/icons/delete.png"
                      className="me-2 w-[16px]"
                    />
                  </button>
                </div>
              </div>
            )}
            {formData?.images?.slice(1, 10)?.map((image, index) => (
              <div
                key={index}
                className="sm:col-span-6 col-span-12 mb-4 relative"
                draggable
                onDragStart={(e) => handleDragStart(e, index + 1)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index + 1)}
              >
                <img
                  src={`${imagePath(image.file)}`}
                  alt={`Uploaded ${index}`}
                  className="w-full h-[150px] rounded-[8px] object-cover"
                />
                <div
                  onClick={() => toggleFavorite(index + 1)}
                  className="absolute top-2 right-2 cursor-pointer bg-[#c2a8df] p-[10px] rounded-[50px]"
                >
                  <img
                    src={"/assets/img/icons/star-w.png"}
                    className="w-[25px]"
                    alt={t("propertySteps.step6.favorite")}
                    data-tooltip-id="infoTooltip"
                    data-tooltip-content={t("propertySteps.step6.makeMainImage")}
                  />
                  <Tooltip
                    id="infoTooltip"
                    place="top"
                    effect="solid"
                    className="!w-[200px] text-sm text-center"
                  />
                </div>
                <div className="flex justify-between">
                  <select
                    disabled={!editMode}
                    onChange={(e) => {
                      if (editMode) {
                        handleAmenitySelect(index + 1, e.target.value);
                        // setErrors({ ...errors, amenity: "" })
                      }
                    }}
                    className="rounded py-2 text-[#5A5A5A] text-[12px] bg-transparent"
                    defaultValue={image.amenity || ""}
                  >
                    <option value="">{t("propertySteps.step6.selectAmenity")}</option>
                    {amenitiesOptions.map((amenity) => (
                      <option key={amenity.id} value={amenity.value}>
                        {amenity.name}
                      </option>
                    ))}
                  </select>
                  <button
                    disabled={!editMode}
                    onClick={() => {
                      if (editMode) {
                        handleRemoveImage(index + 1);
                        setErrors({ ...errors, amenity: "" });
                      }
                    }}
                    className="ml-2 text-red-500"
                  >
                    <img
                      src="/assets/img/icons/delete.png"
                      className="me-2 w-[16px]"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* {errors?.amenity && <span className="text-sm text-[#ff0000] mb-3">{errors?.amenity}</span>} */}

          <div className=" md:max-w-[500px] w-[100%]  ">
            <div className="grid grid-cols-12 items-center gap-4">
              {formData?.images?.length < 10 && !page && (
                <div className="md:col-span-6 col-span-12">
                  <ImageUploadAmenties
                    multiple={true}
                    model="img"
                    result={(e) => imageResult(e, "image")}
                    value={formData?.images}
                    disabled={!editMode}
                    accept={".jpeg, .jpg, .png, .heic"}
                  />
                  {errors?.image && (
                    <span className="text-sm text-[#ff0000]">
                      {errors?.image}
                    </span>
                  )}
                </div>
              )}
              <div className="md:col-span-6 col-span-12">
                <div className="">
                  <p className="text-[#47525E] text-[14px]">
                    {formData?.images?.length > 10
                      ? 10
                      : formData?.images?.length}{" "}
                    {t("propertySteps.step6.picturesCount")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {id ? (
          <div className="text-end bg-[#f2ecf8] p-5 w-full ">
            <button
              onClick={save}
              className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
            >
              {t("propertySteps.step6.saveChange")}
            </button>
          </div>
        ) : (
          <div className="text-end flex gap-2 justify-end  bg-[#f7f4fb] p-5 w-full ">
            <button
              onClick={draftsave}
              className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
            >
              {t("propertySteps.step6.saveAsDraft")}
            </button>
            <button
              onClick={handleBack}
              className="btn text-[#48464a] border border-[#48464a] rounded-full px-10 py-4 "
            >
              {t("common.back")}
            </button>
            <button
              onClick={handleNext}
              className="btn text-white bg-[#48464a] rounded-full px-10 py-4"
            >
              {t("common.next")}
            </button>
          </div>
        )}
        {msg === `You already have a draft for ${formData?.propertyType} type of property.` && (
          <SaveDraftModal
            draftModal={draftModal}
            setdraftModal={setdraftModal}
            data={formData}
            step={4}
          />
        )}
      </div>
    </>
  );
};

export default Step6;
