import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import { removeHTMLTags } from "../../../models/string.model";
import { saveChanges } from "../shared";
import SaveDraftModal from "../../../components/common/Modal/SaveDraftModal";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RiDraftFill } from "react-icons/ri";
import PropertyCheck from "../propertyCheck";

const Step7 = ({ step1, setActiveTabIndex, formData, setFormData, id }) => {
  const navigate = useNavigate();
  const [error, setError] = useState({ title: "", des: "" });
  const user = useSelector((state) => state.user);
  const [draftModal, setdraftModal] = useState(false);
  const quillRef = useRef(null);
  const [editorReady, setEditorReady] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (quillRef.current) {
      setEditorReady(true);
    }
  }, []);

  const validate = () => {
    let data = { ...error };
    if (!removeHTMLTags(formData.content?.trim())) {
      data = { ...data, des: "Property description is required." };
    }
    if (!formData.propertyTitle?.trim()) {
      data = { ...data, title: "Property title is required." };
    }
    setError({ ...data });
    if (!formData.propertyTitle || !formData.content) return false;
    return true;
  };
  const draftsave = () => {
    const payload = {
      ...formData,
      step: 5,
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

  const handleNext = () => {
    if (!validate()) return;
    localStorage.setItem("step1", JSON.stringify(formData));
    if (formData?.propertyType === "directory") {
      if (id) {
        navigate(`/property/edit/${id}/7`);
      } else {
        navigate("/property/add/8");
      }
      setActiveTabIndex(8);
    } else {
      if (id) {
        navigate(`/property/edit/${id}/7`);
      } else {
        navigate("/property/add/7");
      }
      setActiveTabIndex((prevIndex) => Math.min(prevIndex + 1, 7));
    }
  };

  const handleBack = () => {
    if (id) {
      navigate(`/property/edit/${id}/4`);
    } else {
      navigate("/property/add/4");
    }
    setActiveTabIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const save = () => {
    if (!validate()) return;
    step1.propertyTitle = formData.propertyTitle;
    step1.content = formData.content;
    localStorage.setItem("step1", JSON.stringify(step1));
    saveChanges(step1);
  };

  const handleChange = (content) => {
    if (!editorReady || !quillRef.current) return;
    const cleanContent = removeHTMLTags(content);
    const currentLength = cleanContent.length;
    const editor = quillRef.current?.getEditor();
    const cursorPosition = editor.getSelection()?.index;
    if (currentLength <= 4000) {
      setFormData({ ...formData, content });
    } else {
      const truncatedContent = cleanContent.substring(0, 4000);
      setFormData({ ...formData, content: truncatedContent });
      setTimeout(() => {
        editor.setSelection(cursorPosition);
      }, 0);
    }
  };

  return (
    <div className=" flex justify-between flex-col h-full relative">
      <PropertyCheck />
      <div className=" lg:overflow-auto lg:h-[500px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
        <div>
          <div className="flex justify-between items-center gap-3 xl:mb-[50px] lg:mb-[50px] mb-[40px]">
            <h4 className="text-[#47525E] text-[24px] font-[600] lg:w-[500px] w-[100%]">
              Describe your property and put the light on what makes it special
              <span className="text-[#47525E] font-[400] block text-[14px]">
                *Mandatory information
              </span>
            </h4>
          </div>
          <div className="md:max-w-[500px] w-[100%]">
            <label className="text-[#47525E] font-[600] text-[20px] mb-4 block my-10">
              Property description
            </label>
            <div className="font-[400]  text-[16px] text-[#47525E] mb-7 ">
              Enhance your property. The more details you provide, the higher
              the quality of your ad. Detail here what's important and what
              makes your property stand out from the rest. A good description
              can add value to your property.
            </div>
          </div>

          <div className="mt-4  md:max-w-[500px] w-[100%]">
            <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
              Property title
            </label>
            <input
              type="text"
              value={formData.propertyTitle}
              onChange={(e) => {
                const newValue = e.target.value;
                if (
                  newValue.length <= 50 ||
                  newValue.length < formData.propertyTitle.length
                ) {
                  setFormData({ ...formData, propertyTitle: newValue });
                  setError({ ...error, title: "" });
                }
              }}
              className="bg-white rounded-[7px] border border-[#976DD0] p-2 px-3 md:w-[500px] w-full"
              placeholder="Enter property title"
            />
            <p className="text-[#47525E] mt-1 text-end">
              Maximum {formData.propertyTitle.length}/50 words
            </p>
            {error?.title && (
              <p className="text-sm text-[#ff0000]">{error?.title}</p>
            )}
          </div>
          <div className="mt-2 md:max-w-[500px] w-[100%] mb-8">
            <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
              Property description
            </label>
            {/* <p className="text-sm text-gray-500 mt-2 mb-2">
              You can stretch the description box from the bottom  right corner to increase its length.
            </p> */}
            <div className="bg-white rounded-[7px] border border-[#976DD0]  md:w-[500px] w-full textarea-border">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={formData.content}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <p className="text-[#47525E] mt-1 text-end">
              Maximum {removeHTMLTags(formData.content).length}/4000 characters
            </p>
            {error?.des && (
              <p className="text-sm text-[#ff0000]">{error?.des}</p>
            )}
          </div>
        </div>
      </div>

      {id ? (
        <div className="text-end bg-[#f2ecf8] p-5 w-full ">
          <button
            onClick={save}
            className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
          >
            Save change
          </button>
        </div>
      ) : (
        <div className="text-end  flex gap-2 justify-end bg-[#f7f4fb] p-5 w-full  ">
          <button
            onClick={draftsave}
            className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
          >
            Save As Draft
          </button>
          <button
            onClick={handleBack}
            className="btn text-[#48464a] border border-[#48464a] rounded-full px-10 py-4 "
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
      )}
      {msg === `You already have a draft for ${formData?.propertyType} type of property.` && (
        <SaveDraftModal
          draftModal={draftModal}
          setdraftModal={setdraftModal}
          data={formData}
          step={5}
        />
      )}

    </div>
  );
};

export default Step7;
