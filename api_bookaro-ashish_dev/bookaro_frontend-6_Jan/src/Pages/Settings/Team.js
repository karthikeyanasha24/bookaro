import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { login_success } from "../../actions/user";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { imagePath } from "../../models/string.model";
import CompanySidebar from "./CompanySidebar";

const Team = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [team, setTeam] = useState([]);
  const [errors, setErrors] = useState([]);

  const addMember = (e) => {
    e.preventDefault();
    setTeam([
      ...team,
      { id: Date.now(), name: "", designation: "", image: null },
    ]);
  };
  const removeMember = (id) => {
    setTeam(team.filter((member) => member.id !== id));
  };
  const uploadImage = (e, id, maxSize = 10) => {
    let files = Array.from(e.target.files);
    const maxSizeInBytes = maxSize * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter((file) => file.size > maxSizeInBytes);
    if (oversizedFiles.length > 0) {
      toast.error(`Size must be smaller than ${maxSize}MB`);
      return (e.target.value = "");
    }
    const acceptedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];
    let invalidFiles = files.filter(
      (file) => !acceptedTypes.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      toast.error("Only JPG, PNG, GIF, and WebP images are allowed.");
      return (e.target.value = "");
    }
    loader(true);
    ApiClient.multiImageUpload("upload/multiple-images", files, {}, "files")
      .then((res) => {
        if (res.success) {
          const img = res?.files?.[0]?.fileName;
          const updatedTeam = team.map((member) => {
            if (member.id === id) {
              return { ...member, image: img };
            }
            return member;
          });
          setTeam(updatedTeam);
          const updatedErrors = errors?.map((error) => {
            if (error[id]) {
              return { ...error, [id]: "" };
            }
            return error;
          });
          setErrors(updatedErrors);
        }
      })
      .catch((er) => console.log("err in file upload", er))
      .finally(() => {
        loader(false);
        e.target.value = "";
      });
  };
  const removeImage = (id) => {
    setTeam(
      team.map((member) =>
        member.id === id ? { ...member, image: null } : member
      )
    );
  };
  const handleChange = (id, field, value) => {
    setTeam(
      team.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
    const updatedErrors = errors?.map((error) => {
      if (error[id]) {
        return { ...error, [id]: "" };
      }
      return error;
    });
    setErrors(updatedErrors);
  };
  const validateMember = (member) => {
    let error = {};
    if (!member.image?.trim()) error[member.id] = "Image is required.";
    else if (!member.name?.trim()) error[member.id] = "Name is required.";
    else if (!member.designation?.trim())
      error[member.id] = "Designation is required.";
    return error;
  };
  const validate = () => {
    let newErrors = [];
    team.forEach((member) => {
      const errorsForMember = validateMember(member);
      if (Object.keys(errorsForMember).length > 0) {
        newErrors.push(errorsForMember);
      }
    });
    setErrors(newErrors);
    return newErrors?.length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (team?.length === 0) return toast.error("Enter atleast a Team member");
    if (!validate()) return;
    const payload = {
      userId: user?.id || user?._id,
      team,
    };

    loader(true);
    ApiClient.put("user/editUserDetails", payload).then((res) => {
      if (res.success) {
        toast.success(res?.message);
        dispatch(login_success({ ...payload }));
      }
      loader(false);
    });
  };

  const getDetails = () => {
    loader(true);
    ApiClient.get(`user/detail`, { id: user?._id }).then((res) => {
      if (res.success) {
        setTeam(res?.data?.team);
      }
      loader(false);
    });
  };
  useEffect(() => {
    getDetails();
  }, []);

  return (
    <PageLayout>
      <section className="py-14   lg:py-16 bg-[#f2ecf8]">
        <div className="container items-center  px-8 mx-auto xl:px-5">
          <div className="lg:max-w-[1200px] mx-auto max-w-[100%]">
            <div className="grid grid-cols-12 lg:gap-12  gap-0">
              <CompanySidebar />
              <div className="xl:col-span-8 lg:col-span-7 col-span-12 md:mt-0 mt-8 ">
                <h2 className=" text-[#47525E] text-[26px] font-bold mb-6">
                  Manage your company profile
                </h2>
                <div className="p-10 xl:px-14 lg:px-8 px-8 h-[92%] border border-[#976DD0] rounded-[10px] mt-10 lg:mt-0  ">
                  <form
                    onSubmit={handleSubmit}
                    className="flex  flex-col h-full"
                  >
                    <div class="mb-8 flex sm:items-center items-start justify-between sm:flex-row flex-col">
                      <div>
                        <h4 class="text-black font-bold text-[19px]  mb-0">
                          Add Team Member
                        </h4>
                        <p class="text-black text-[18px]  mb-2 ">
                          Tell us about your Team and their roles
                        </p>
                      </div>
                      <button
                        className="flex items-center justify-center bg-[#986dcd] border border-transparent text-white p-3 rounded-lg shadow-md hover:bg-white w-fit hover:border-[#986dcd] hover:text-[#986dcd] transition sm:mt-0 mt-3"
                        onClick={(e) => addMember(e)}
                      >
                        <FaPlus className="mr-2" /> Add Member
                      </button>
                    </div>
                    <div className=" ">
                      {team?.length > 0 &&
                        team.map((member, i) => (
                          <>
                            <div
                              key={member.id}
                              className="flex items-center bg-white shadow-md p-4 rounded-lg mb-4 relative border border-gray-200 sm:flex-row flex-col"
                            >
                              <div className="relative w-24 h-24 sm:mb-0 mb-4 shrink-0">
                                <input
                                  id={`file-input-${member.id}`}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => uploadImage(e, member.id)}
                                />

                                {/* LABEL triggers file input */}
                                <label
                                  htmlFor={`file-input-${member.id}`}
                                  className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer relative"
                                >
                                  {member.image ? (
                                    <img
                                      src={imagePath(member.image)}
                                      alt=""
                                      className="w-full h-full object-cover rounded-[7px]"
                                    />
                                  ) : (
                                    <div className="flex flex-col justify-center">
                                      <FaPlus className="text-gray-400 text-xl mx-auto mb-1" />
                                      <p className="text-gray-400 text-sm">
                                        Add Photo
                                      </p>
                                    </div>
                                  )}
                                </label>

                                {/*  REMOVE BUTTON - outside the label */}
                                {member.image && (
                                  <button
                                    type="button"
                                    className="absolute -top-2 -right-2 cursor-pointer bg-red-500 text-white rounded-full p-1 z-10"
                                    onClick={() => removeImage(member.id)}
                                  >
                                    <IoMdClose size={14} />
                                  </button>
                                )}
                              </div>

                              <div className="sm:ml-4 flex-1 ms-0">
                                <input
                                  type="text"
                                  placeholder="Team Member Name"
                                  className=" w-full h-11 px-3 py-2.5 mb-2 bg-white border border-[#CACACA] rounded-md placeholder-gray-400     outline-none focus:border-[#986dcd]"
                                  value={member.name}
                                  onChange={(e) =>
                                    handleChange(
                                      member.id,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  type="text"
                                  placeholder="Designation"
                                  className=" w-full h-11 px-3 py-2.5  bg-white border border-[#CACACA] rounded-md placeholder-gray-400     outline-none focus:border-[#986dcd]"
                                  value={member.designation}
                                  onChange={(e) =>
                                    handleChange(
                                      member.id,
                                      "designation",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <button
                                className="ml-1 bg-[#986dcd] text-white p-2 rounded-full sm:relative absolute -top-2 -right-2 hover:bg-white transition  hover:text-red-500 hover:border-[#dcdcdc] border border-transparent"
                                onClick={() => removeMember(member.id)}
                              >
                                <AiOutlineDelete size={24} />
                              </button>
                            </div>
                            {errors?.length > 0 &&
                              errors?.some((error) => error[member.id]) && (
                                <p className="text-red-500 text-xs">
                                  {
                                    errors?.find((error) => error[member.id])[
                                      member.id
                                    ]
                                  }
                                </p>
                              )}
                          </>
                        ))}
                    </div>
                    {team?.length > 0 && (
                      <div className="mt-20  flex items-center justify-end">
                        <button
                          type="submit"
                          className="bg-[#48464a] rounded-[100px] px-14 py-3 text-white signup-btn border border-transparent hover:bg-transparent hover:border-[#48464a] transition duration-300 ease-in-out"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Team;
