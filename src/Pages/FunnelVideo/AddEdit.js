import { useState, useEffect, useRef } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/global/layout";
import { Tooltip } from "antd";
import FormControl from "../../components/common/FormControl";
import { MdCategory } from "react-icons/md";
import SelectDropdown from "../../components/common/SelectDropdown";
import methodModel from "../../methods/methods";
import { IoCloseOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import shared from "./shared";
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useSelector } from "react-redux";

const AddEdit = () => {
  const { id } = useParams();
  const inputRef = useRef(null);
  const user = useSelector((state) => state.user);
  const [form, setform] = useState({ videoOwner: user?.id || user?._id });
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [users, setUsers] = useState([]);
  const [personaOptions, setPersonaOptions] = useState([]);
  const [tagError, setTagError] = useState('');
  const history = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const hiddenPlayerRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [newTopic, setNewTopic] = useState("");

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      const topicObj = { id: newTopic.trim(), name: newTopic.trim() };
      setTopics((prev) => [...prev, topicObj]);
      setform((prev) => ({ ...prev, topic: newTopic.trim() }));
      setNewTopic("");
      setShowModal(false);
    }
  };

  // Load personas on mount
  useEffect(() => {
    fetchPersonas();
  }, []);

  // Load video data when editing (independent of personas being loaded)
  useEffect(() => {
    if (id) {
      loader(true);
      ApiClient.get(`funnelUrl/get`, { id }).then((res) => {
        if (res.success) {
          setform(res?.data);
          setNewTopic(res?.data?.topic)
          const mapped = res?.data?.tags?.map((item) => ({
            id: item._id,
            tag: item.title,
          }));
          setTags(mapped || [])
        }
        loader(false);
      });
    }
  }, [id]);

  useEffect(() => {
    getUserData()
  }, []);

  const fetchPersonas = () => {
    ApiClient.get("persona/list")
      .then((res) => {
        if (res.success && res.data) {
          // Sort by rank ascending
          const sortedPersonas = [...res.data].sort((a, b) => {
            const rankA = a.rank || 0;
            const rankB = b.rank || 0;
            if (rankA !== rankB) {
              return rankA - rankB;
            }
            return a.name.localeCompare(b.name);
          });
          
          const personasFromDB = sortedPersonas.map((persona) => ({
            id: persona.name,
            name: persona.name,
          }));

          setPersonaOptions(personasFromDB);
        }
      })
      .catch((error) => {
        console.error("Error fetching personas:", error);
      });
  };

  useEffect(() => {
    loader(true);
    ApiClient.get(`trainingTopic/list`).then((res) => {
      if (res.success) {
        const mapped = res.data.map((item) => ({
          id: item.id,
          name: item.name,
          personaName: item.persona?.name || null,
        }));
        setTopics(mapped);
      }
      loader(false);
    });
    getUserData()
  }, [loader]);

  // Filter topics by selected persona
  useEffect(() => {
    if (form?.type && topics.length > 0) {
      const filtered = topics.filter(t => t.personaName === form.type);
      setFilteredTopics(filtered);
    } else {
      setFilteredTopics([]);
    }
  }, [form?.type, topics]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const pad = (num) => num.toString().padStart(2, "0");

    return hours > 0
      ? `${hours}:${pad(minutes)}:${pad(seconds)}`
      : `${minutes}:${pad(seconds)}`;
  };

  const getStatusOptions = () => {
    return [
      { value: "draft", name: "Draft" },
      { value: "published", name: "Published" },
      { value: "archived", name: "Archived" },
    ];
  };

  const addTag = () => {
    ApiClient.post(`tags/addNew`, { title: newTag }).then((res) => {
      if (res.success) {
        setTags([...tags, { id: res?.data?.id || res?.data?._id, tag: newTag.trim() }]);
      }
    })
  }

  const getDuration = () => {
    return new Promise((resolve, reject) => {
      const videoId = getVideoId(form?.youtubeUrl);
      if (!videoId) {
        resolve(null);
        return;
      }

      const loadYouTubeAPI = () => {
        return new Promise((resolveYT) => {
          if (window.YT && window.YT.Player) {
            resolveYT(window.YT);
          } else {
            const existingScript = document.getElementById("youtube-iframe-api");
            if (!existingScript) {
              const tag = document.createElement("script");
              tag.id = "youtube-iframe-api";
              tag.src = "https://www.youtube.com/iframe_api";
              document.body.appendChild(tag);
            }

            const checkYT = setInterval(() => {
              if (window.YT && window.YT.Player) {
                clearInterval(checkYT);
                resolveYT(window.YT);
              }
            }, 100);
          }
        });
      };

      loadYouTubeAPI().then((YT) => {
        const player = new YT.Player(hiddenPlayerRef.current, {
          videoId,
          events: {
            onReady: (event) => {
              try {
                const dur = event.target.getDuration();
                event.target.destroy();
                resolve(dur);
              } catch (err) {
                reject(err);
              }
            },
          },
        });
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const dur = await getDuration();
    const newDuration = formatTime(dur)
    const videoId = getVideoId(form?.youtubeUrl);
    if (
      !form?.youtubeUrl ||
      // !form?.funnelStatus ||
      !form?.title ||
      tags?.length === 0 ||
      !form?.type ||
      !form?.image ||
      !form?.topic ||
      !form?.videoOwner ||
      !videoId
    )
      return;

    let method = "post";
    let url = `funnelUrl/add`;

    const newTag = tags.map((item) => item?.id || item?._id);
    let value = {
      title: form?.title,
      youtubeUrl: form?.youtubeUrl,
      funnelStatus: form?.funnelStatus,
      tags: newTag,
      type: form?.type,
      isLearning: form?.isLearning,
      isFunnel: form?.isFunnel,
      image: form?.image,
      topic: form?.topic,
      description: form?.description,
      id: id,
      videoOwner: form?.videoOwner,
      duration: newDuration,
    };

    if (id) {
      method = "put";
      url = `funnelUrl/update`;
    } else {
      delete value.id;
    }

    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        history(`/funnelvideo`);
      }
      loader(false);
    });
  };

  const ImageUpload = (e) => {
    let files = e.target.files;
    let file = files.item(0);
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]; // Add more image types if needed
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG and PNG images are allowed.");
      return;
    }
    loader(true);
    ApiClient.postFormData("upload/image", { file: file }).then((res) => {
      if (res.success) {
        setform({ ...form, image: res?.fileName });
      }
      loader(false);
    });
  };

  // Personas are now fetched from database via fetchPersonas()


  const handleAddTag = (e) => {
    if (e) e.preventDefault();
    if (tags?.length >= 3) {
      setTagError('Maximum 3 tags allowed');
      return;
    }
    if (newTag.trim() === '') return;

    setNewTag('');
    setTagError('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
    addTag()
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(e);
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t?.id !== tag));
    ApiClient.delete(`tags/delete?id=${tag}`).then((res) => {
      if (res.success) {
      }
    })
  };

  const getUserData = (p = {}) => {
    // setLoader(true);
    ApiClient.get(`user/listing`, { role: "user" }).then((res) => {
      if (res.success) {
        const mapped = res?.data?.map((item) => ({
          id: item.id || item?._id,
          name: item.fullName,
        }));
        setUsers(mapped)
      }
      // setLoader(false);
    });
  };

  const getVideoId = (url) => {
    try {
      const parsed = new URL(url);
      // Handle youtu.be links (e.g., https://youtu.be/VIDEO_ID)
      if (parsed.hostname === "youtu.be") {
        return parsed.pathname.slice(1);
      }
      // Handle full YouTube URLs (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
      if (parsed.hostname.includes("youtube.com")) {
        // Priority: get v param from URL
        const v = parsed.searchParams.get("v");
        if (v) return v;
        // If v is missing, try pathname parsing for embed or /v/VIDEO_ID
        const pathParts = parsed.pathname.split("/");
        const idFromPath = pathParts.find((part) => /^[a-zA-Z0-9_-]{11}$/.test(part));
        if (idFromPath) return idFromPath;
      }
      return null;
    } catch {
      return null;
    }
  }


  return (
    <>
      <Layout>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-8">
            <Tooltip placement="top" title="Back">
              <Link
                to={`/funnelvideo`}
                className="!px-4  py-2 flex items-center justify-center bg-[#976DD0] text-white rounded-lg shadow-btn hover:bg-[#976DD0] border transition-all  mr-3"
              >
                <i className="fa fa-angle-left text-lg"></i>
              </Link>
            </Tooltip>
            <div>
              <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
                {id ? "Edit" : "Add"} Funnel Video
              </h3>
              <p class="text-xs lg:text-sm font-normal text-[#75757A]">
                Here you can see all about your funnel video
              </p>
            </div>
          </div>
          <div className="shadow-box overflow-auto rounded-lg bg-white  gap-4">
            <div>
              <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#976DD0] ">
                <div className=" me-3 bg-[#996dca21] p-3 rounded-md">
                  <MdCategory className="text-[18px]" />
                </div>
                Video Information
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 p-4 gap-6">
              <div className="">
                <span className="text-[14px] mb-2 inline-block">Video Title <span className="star">*</span></span>
                <FormControl
                  type="text"
                  name="title"
                  // label="Video Title"
                  // placeholder="Enter Name"
                  value={form?.title}
                  onChange={(e) => setform({ ...form, title: e })}
                  required
                />
              </div>
              <div className="">
                <span className="text-[14px] mb-2 inline-block">Titre vidéo (FR) <span className="text-gray-400 text-xs">— optionnel</span></span>
                <FormControl
                  type="text"
                  name="title_fr"
                  value={form?.title_fr || ''}
                  onChange={(e) => setform({ ...form, title_fr: e })}
                />
                {/* {submitted && !form.title && (
                  <div className="d-block text-red-600">Video Title is required</div>
                )} */}
              </div>{" "}
              <div className=" custom-drop flex   flex-col ">
                <span className="text-[14px] mb-2 inline-block">Persona <span className="star">*</span></span>
                <SelectDropdown
                  id="personaDropdown"
                  displayValue="name"
                  placeholder="persona"
                  className="capitalize"
                  theme="search"
                  isClearable={false}
                  intialValue={form?.type}
                  result={(e) => {
                    setform({ ...form, type: e.value, topic: '' });
                  }}
                  options={personaOptions}
                  required
                />
              </div>{" "}
              <div className="flex flex-col">
                <div className="custom-drop">
                  <span className="text-[14px] mb-2 inline-block">Training Topics <span className="star">*</span></span>
                  <SelectDropdown
                    id="statusDropdown"
                    displayValue="name"
                    placeholder="Training Topics"
                    className="capitalize w-full"
                    theme="search"
                    isClearable={false}
                    intialValue={form?.topic}
                    result={(e) => {
                      setform({ ...form, topic: e.value });
                    }}
                    options={filteredTopics}
                    required
                  />
                </div>
              </div>
              <div className="">
                <span className="text-[14px] mb-2 inline-block">Tags <span className="star">*</span></span>
                <div className="flex justify-between gap-2 items-center">
                  <FormControl
                    type="text"
                    name="tags"
                    value={newTag}
                    onChange={(e) => setNewTag(e)}
                    onkeyDown={handleKeyDown}
                    ref={inputRef}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="p-2 bg-[#976DD0] text-white rounded-lg hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-3">
                  {tags?.length > 0 && (
                    <ul className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <li
                          key={index}
                          className="flex items-center space-x-2 bg-[#976DD0]/10 text-[#976DD0] px-4 py-2 rounded-full text-sm"
                        >
                          <span>{tag?.tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag?.id || tag?._id)}
                            className="text-[#976DD0] hover:text-indigo-800 focus:outline-none"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {submitted && tags?.length == 0 && (
                  <div className="d-block text-red-600">Tag is required</div>
                )}
                {tagError && (
                  <div className="text-red-600 mt-2">{tagError}</div>
                )}
              </div>{" "}

              <div className="">
                <span className="text-[14px] mb-2 inline-block">Video Owner <span className="star">*</span></span>

                <SelectDropdown
                  id="statusDropdown"
                  displayValue="name"
                  placeholder="Video Owner"
                  className="capitalize w-full"
                  theme="search"
                  isClearable={false}
                  intialValue={form?.videoOwner}
                  result={(e) => {
                    setform({ ...form, videoOwner: e.value });
                  }}
                  options={[
                    { id: user?.id || user?._id, name: user?.fullName },
                    ...users,
                  ]}
                  required
                />

                {/* {submitted && !form.videoOwner && (
                  <div className="d-block text-red-600">
                    Video Owner is required
                  </div>
                )} */}
              </div>{" "}
              <div className="flex gap-2 items-center mb-2">
                <input
                  type="checkbox"
                  className="accent-[#976DD0] w-4 h-4"
                  checked={form?.isLearning}
                  value={form?.isLearning}
                  onChange={(e) =>
                    setform({ ...form, isLearning: e.target.checked })
                  }
                />
                <p className="text-[15px]">
                  Learning Center.
                </p>
              </div>
              <div className="flex gap-2 items-center mb-2">
                <input
                  type="checkbox"
                  className="accent-[#976DD0] w-4 h-4"
                  checked={form?.isFunnel}
                  value={form?.isFunnel}
                  onChange={(e) =>
                    setform({ ...form, isFunnel: e.target.checked })
                  }
                />
                <p className="text-[15px]">
                  Funnel Status.
                </p>
              </div>
              {form?.type && form?.isFunnel && <div className=" flex    flex-col ">
                <label className="text-sm mb-2 block">
                  Funnel Status
                  {/*<span className="star">*</span> */}
                </label>

                <SelectDropdown
                  id="statusDropdown"
                  displayValue="name"
                  placeholder="Funnel Status"
                  className="capitalize"
                  theme="search"
                  isClearable={false}
                  intialValue={form?.funnelStatus}
                  result={(e) => {
                    setform({ ...form, funnelStatus: e.value });
                  }}
                  options={getStatusOptions()}
                // required
                />
                {/* {submitted && !form.funnelStatus && (
                  <div className="d-block text-red-600">
                    Please Select Funnel status
                  </div>
                )} */}
              </div>}

              <div className="flex flex-col">
                <FormControl
                  type="text"
                  name="url"
                  label="URL"
                  value={form?.youtubeUrl}
                  onChange={(e) => setform({ ...form, youtubeUrl: e })}
                  required
                />
                {submitted && !getVideoId(form?.youtubeUrl) && (
                  <div className="d-block text-red-600">Please enter a valid URL</div>
                )}
              </div>

              <div className=" flex    flex-col ">
                <span className="text-[14px] mb-2 inline-block">Thumbnail/Image (JPG/PNG) <span className="star">*</span></span>
                <div className="flex flex-col rounded-lg cursor-pointer gap-6 ">
                  {form?.image ? (
                    <>
                      <div className="flex flex-wrap gap-3 mt-3">
                        <div className="relative">
                          <img
                            src={methodModel.userImg(form?.image)}
                            className="bg-white thumbnail !w-[100px] !h-[100px] rounded-lg shadow-lg border-[2px] border-white object-contain"
                          />
                          <IoCloseOutline
                            className="absolute -top-2 -right-2 pointer hover:text-red-600 w-5 h-5 border bg-white shadow-md rounded-[50%]"
                            onClick={(e) => setform({ ...form, image: "" })}
                            size={25}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <label
                      className={`flex items-center justify-center cursor-pointer text-black-800 bg-[#fff] focus:outline-none font-medium rounded-lg text-sm px-5 py-2 border-2 border-dashed border-gray-200 `}
                      style={{ gap: "8px" }}
                    >
                      <FiPlus />
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={ImageUpload}
                      />
                      Upload Image
                    </label>
                  )}
                </div>
              </div>
              {submitted && !form.image && (
                <div className="d-block text-red-600">Image is required</div>
              )}


              <div className="">
                <span className="text-[14px] mb-2 inline-block">Video Description</span>
                <FormControl
                  type="textarea"
                  name="title"
                  value={form?.description}
                  onChange={(e) => setform({ ...form, description: e })}
                />
              </div>{" "}
            </div>
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="text-white bg-[#EB6A59] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-5 mb-2"
            >
              {form && form?.id ? "Update" : "Save"}
            </button>
          </div>
          <div ref={hiddenPlayerRef} style={{ display: "none" }} />
        </form>
      </Layout>
    </>
  );
};

export default AddEdit;