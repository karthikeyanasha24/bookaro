import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import ImageUploadAmenties from "../../../components/common/ImageUploadAmenties";
import environment from "../../../environment";
import { imagePath } from "../../../models/string.models";
import { saveChanges } from "../shared";

const Step5 = ({ step1,
  setActiveTabIndex, formData, setFormData, amenitiesOptions={amenitiesOptions}, id,
  editMode = true, page, backTo, }) => {
    console.log(formData,"0000")
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ image: "", amenity: "" });
  const [draggedIndex, setDraggedIndex] = useState(null);

  const imageResult = (e) => {
    const uploadedImages = Array.from(e.value);
    if (uploadedImages?.length > 10) toast.error("Maximum 10 images allowed to add");

    const newImages = uploadedImages.map((file) => ({
      file: typeof file === 'string' ? file : file.file,
      amenity: null,
      favorite: false,
    }));

    setErrors({ image: "", amenity: "" });
    setFormData((prev) => {
      const existingFiles = new Set(prev.images.map((img) => img.file));
      const uniqueNewImages = newImages.filter((img) => !existingFiles.has(img.file));
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

  const validate = () => {
    if (formData?.images?.length === 0) {
      setErrors({ ...errors, image: "Upload minimum one image." });
      return false;
    }
    return true;
  }

  const handleNext = () => {
    if (!validate()) return
    localStorage.setItem('step1', JSON.stringify(formData));
    if (page) {
      navigate(`/property/${page}/${id}`, {
        state: backTo ? { backTo: "property-requests" } : undefined,
      });
    } else if (id) {
      navigate(`/property/add/${id}/5`);
    } else {
      navigate("/property/add/5");
    }
    setActiveTabIndex((prevIndex) => Math.min(prevIndex + 1, 7));
  };

  const handleBack = () => {
    if (page) {
      navigate(`/property/${page}/${id}`, {
        state: backTo ? { backTo: "property-requests" } : undefined,
      });
    } else if (id) {
      navigate(`/property/add/${id}/4`);
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
    if (!validate()) return
    step1.images = formData.images;
        if (step1?.energymode == "") {
      delete step1.energymode;
    }
    if (step1?.heatingType == "") {
      delete step1.heatingType;
    }
    if (step1?.emission_efficient == "") {
      delete step1.emission_efficient;
    }
    if (step1?.energy_efficient == "") {
      delete step1.energy_efficient;
    }
    if (step1?.usedAs == "") {
      delete step1.usedAs;
    }
    if (step1?.investment?.length == 0 || step1?.investment[0] == "") {
      delete step1.investment
    }
    localStorage.setItem("step1", JSON.stringify(step1))
    saveChanges(step1)
  }

  return (
    <>
      <div className="flex justify-between flex-col h-full relative ">
      <div className=" lg:overflow-auto lg:h-[580px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
          <h4 className="text-[#47525E] text-[24px] font-[600] xl:mb-[50px] lg:mb-[50px] mb-[40px]">
            Add up to 10 nice pictures of your property
            <span className="text-[#47525E] font-[400] block text-[14px]">
              *Mandatory information
            </span>
          </h4>

          <div className="md:max-w-[500px] w-[100%]">
            <label className="text-[#47525E] font-[600] text-[20px] mb-4 block my-10">
              Your pictures
            </label>
            <div className="font-[400] text-[16px] text-[#47525E] mb-3">
              Make sure you have given access to your photos. The size of the
              image must not exceed 10MB. Supported formats are jpeg, png, heic.
            </div>
            <div className="font-[400] text-[16px] text-[#47525E] mb-7">
              You can also change the position of the image by drag and drop or just by a single click on the star of image itself
            </div>
          </div>

          <div className="mt-4 grid grid-cols-12 md:max-w-[500px] w-[100%] gap-4">
            {formData?.images?.[0] && (
              <div className="col-span-full relative"
                draggable
                onDragStart={(e) => {
                  if (editMode) handleDragStart(e, 0)
                }}
                onDragOver={(e) => {
                  if (editMode) handleDragOver(e)
                }}
                onDrop={(e) => {
                  if (editMode) handleDrop(e, 0)
                }}>
                <img
                  src={`${imagePath(formData?.images[0].file)}`}
                  alt=""
                  className="rounded-[10px] h-[250px] w-full object-cover"
                />
                <div>
                  <h5 className="text-[16px] text-white font-[600] bg-[#676460] p-2 px-3 absolute top-[24px] flex items-center">
                    <img src="/assets/img/pngtree-vector-star-icon-png-image_924829.jpg" alt="start" className="me-2 w-[25px]" />
                    Photo de couverture
                  </h5>
                </div>
                <div className="flex justify-between">
                  <select disabled={!editMode}
                    onChange={(e) => {
                      if (editMode) {
                        handleAmenitySelect(0, e.target.value);
                        // setErrors({ ...errors, amenity: "" })
                      }
                    }}
                    className="rounded py-2 text-[#5A5A5A] text-[12px] bg-transparent select_checkbox"
                    defaultValue={formData?.images[0]?.amenity || ""}
                  >
                    <option value="">Select Amenity...</option>
                   {amenitiesOptions.map((amenity) => (
                      <option key={amenity.id} value={amenity.value}>
                        {amenity.name}
                      </option>
                    ))}
                  </select>
                  <button disabled={!editMode}
                    onClick={() => {
                      if (editMode) {
                        handleRemoveImage(0);
                      }
                    }}
                    className="ml-2 text-red-500"
                  >
                    <img src="/assets/img/icons/delete.png" className="me-2 w-[16px]" />
                  </button>
                </div>
              </div>
            )}
            {formData?.images?.slice(1, 10)?.map((image, index) => (
              <div
                key={index}
                className="lg:col-span-6 mb-4 relative"
                draggable
                onDragStart={(e) => {
                  if (editMode) handleDragStart(e, index + 1)
                }}
                onDragOver={(e) => {
                  if (editMode) handleDragOver(e)
                }}
                onDrop={(e) => {
                  if (editMode) handleDrop(e, index + 1)
                }}
              >
                <img
                  src={`${environment.api}img/${image.file}`}
                  alt={`Uploaded ${index}`}
                  className="w-full h-[150px] rounded-[8px] object-cover"
                />
                <div onClick={() => {
                  if (editMode) toggleFavorite(index + 1)
                }} className="absolute top-2 right-2 cursor-pointer bg-[#c2a8df] p-[10px] rounded-[50px]">
                  <img
                    src={"/assets/img/icons/star-w.png"}
                    className="w-[25px]"
                    alt="Favorite"
                    data-tooltip-id="infoTooltip"
                    data-tooltip-content={`Make this image as Main Image.`}
                  />
                  <Tooltip
                    id="infoTooltip"
                    place="top"
                    effect="solid"
                    className="!w-[200px] text-sm text-center"
                  />
                </div>
                <div className="flex justify-between">
                  <select disabled={!editMode}
                    onChange={(e) => {
                      if (editMode) {
                        handleAmenitySelect(index + 1, e.target.value);
                      }
                    }}
                    className="rounded py-2 text-[#5A5A5A] text-[12px] bg-transparent"
                    defaultValue={image.amenity || ""}
                  >
                    <option value="">Select Amenity...</option>
                    {amenitiesOptions={amenitiesOptions}.map((amenity) => (
                      <option key={amenity.id} value={amenity.value}>
                        {amenity.name}
                      </option>
                    ))}
                  </select>
                  <button disabled={!editMode}
                    onClick={() => {
                      if (editMode) {
                        handleRemoveImage(index + 1);
                      }
                    }} className="ml-2 text-red-500"
                  >
                    <img src="/assets/img/icons/delete.png" className="me-2 w-[16px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* {errors?.amenity && <span className="text-sm text-[#ff0000] mb-3">{errors?.amenity}</span>} */}

          <div className="grid grid-cols-12 md:max-w-[500px] w-[100%] gap-4 items-center">
            {(formData?.images?.length < 10 && !page) &&
              <div className="lg:col-span-6">
                <ImageUploadAmenties
                  multiple={true}
                  model="img"
                  result={(e) => imageResult(e, "image")}
                  value={formData?.images}
                  disabled={!editMode}
                  accept={".jpeg, .jpg, .png, .heic"}
                />
                {errors?.image && <span className="text-sm text-[#ff0000]">{errors?.image}</span>}
              </div>
            }
            <div className="col-span-full">
              <div className="mb-5">
                <p className="text-[#47525E] text-[14px] ">{formData?.images?.length > 10 ? 10 : formData?.images?.length}   / 10 pictures</p>
              </div>
            </div>
          </div>
        </div>
        {page === "detail" ? ("") : id ?
          <div className="text-end  bg-[#f7f4fb] p-5 w-full ">
            <button
              onClick={save}
              className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
            >
              Save change
            </button>
          </div> :
     <div className="text-end  bg-[#f7f4fb] p-5 w-full flex justify-end">
            <button
              onClick={handleBack}
              className="btn text-[#48464a] border border-[#48464a] rounded-full px-10 py-4 me-4"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="btn text-white bg-[#48464a] rounded-full px-10 py-4"
            >
              Next
            </button>
          </div>
        }
      </div>
    </>
  );
};

export default Step5;
