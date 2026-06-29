import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveChanges } from "../shared";
import { removeHTMLTags } from "../../../models/string.models";
import ReactQuill from "react-quill";

const Step6 = ({ step1,
  setActiveTabIndex, formData, setFormData, id,
  editMode = true, page, backTo,
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState({ title: "", des: "" });
  const quillRef = useRef(null);
  const [editorReady, setEditorReady] = useState(false);
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
    if (!formData.propertyTitle) {
      data = { ...data, title: "Property title is required." };
    }
    setError({ ...data })
    if (!formData.propertyTitle || !formData.content) return false;
    return true;
  }

  const handleNext = () => {
    if (!validate()) return
    localStorage.setItem('step1', JSON.stringify(formData));
    if (formData?.propertyType === "directory") {
      if (page) {
        navigate(`/property/${page}/${id}`, {
          state: backTo ? { backTo: "property-requests" } : undefined,
        });
      } else if (id) {
        navigate(`/property/add/${id}/7`)
      } else {
        navigate("/property/add/7")
      }
      setActiveTabIndex(7);
    } else {
      if (page) {
        navigate(`/property/${page}/${id}`, {
          state: backTo ? { backTo: "property-requests" } : undefined,
        });
      } else if (id) {
        navigate(`/property/add/${id}/6`)
      } else {
        navigate("/property/add/6")
      }
      setActiveTabIndex((prevIndex) => Math.min(prevIndex + 1, 7));
    }
  };
  const handleBack = () => {
    if (page) {
      navigate(`/property/${page}/${id}`)
    } else if (id) {
      navigate(`/property/add/${id}/5`)
    } else {
      navigate("/property/add/5")
    }
    setActiveTabIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };
  const save = () => {
    if (!validate()) return
    step1.propertyTitle = formData.propertyTitle;
    step1.content = formData.content;
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

  const handleChange = (content) => {
    if (!editorReady || !quillRef.current) return;
    const cleanContent = removeHTMLTags(content);
    const currentLength = cleanContent.length;
    const editor = quillRef.current?.getEditor();
    const cursorPosition = editor.getSelection()?.index;
    if (currentLength <= 4000) {
      setFormData({ ...formData, content });
    } else {
      const truncatedContent = cleanContent.substring(0, 20);
      setFormData({ ...formData, content: truncatedContent });
      setTimeout(() => {
        editor.setSelection(cursorPosition);
      }, 0);
    }
  };

  return (
    <>
      <div className="flex justify-between flex-col h-full relative ">
        <div className=" lg:overflow-auto lg:h-[580px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
          <h4 className="text-[#47525E] text-[24px] font-[600] mb-6 lg:w-[500px] w-[100%] ">
            Describe your property and put the light on what makes it special
            <span className="text-[#47525E] font-[400] block text-[14px]">
              *Mandatory information
            </span>
          </h4>

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


          <div className="mt-4  mb-4 md:max-w-[500px] w-[100%]">
            <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
              Property title
            </label>
            <input disabled={!editMode}
              type="text"
              value={formData.propertyTitle}
              onChange={(e) => {
                const newValue = e.target.value;
                if (editMode) {
                  if (newValue.length <= 50 || newValue.length < formData.propertyTitle.length) {
                    setFormData({ ...formData, propertyTitle: newValue });
                    setError({ ...error, title: "" });
                  }
                }
              }}
              className="bg-white rounded-[7px] border border-[#976DD0] p-2 px-3 md:w-[500px] w-full"
              placeholder="Enter property title"
            />
            <p className="text-[#47525E] mt-1 text-end text-[14px]">Maximum {formData.propertyTitle.length}/50 words</p>
            {error?.title && <p className="text-sm text-[#ff0000]">{error?.title}</p>}
          </div>
          <div className="mt-4  mb-4 lg:max-w-[500px] w-[100%] mb-8">
            <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
              Property description
            </label>
            <p className="text-sm text-gray-500 mt-2 mb-2">
              You can stretch the description box from the right bottom corner to increase its length.


            </p>
            <div className="bg-white rounded-[7px] border border-[#976DD0] p-2 px-3 md:w-[500px] w-full ">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={formData.content}
                onChange={handleChange}
              />
            </div>
            <p className="text-[#47525E] mt-1 text-end">Maximum {removeHTMLTags(formData.content).length}/4000 characters</p>
            {error?.des && <p className="text-sm text-[#ff0000]">{error?.des}</p>}
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
          </div>}
      </div>
    </>
  );
};

export default Step6;
