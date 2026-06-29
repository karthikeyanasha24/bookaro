import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { propertyTypes, saveChanges } from "../shared";
import { FaInfoCircle } from "react-icons/fa";
import { Tooltip } from "antd";
import { useSelector } from "react-redux";
import PropertyCheck from "../propertyCheck";

const Step1 = ({ step1, setActiveTabIndex, formData, setFormData, id }) => {
  const navigate = useNavigate();
  const activePlan = useSelector((state) => state.activePlan);
  const [Error, setError] = useState("");
  useEffect(() => {
    if (step1) setFormData({ ...formData, ...step1, propertyType: step1?.propertyType });
    if (!(formData?.isChoosedDeclDocumentVerified && formData?.isChoosedDocumentVerified)) {
      // setFormData({ ...formData, ...step1, chooseDocumentGrade: "Any" })
      setFormData({ ...formData, ...step1 })
    }
  }, []);

  //   useEffect(() => {
  //   console.log("Before render — RatingValue check:");
  //   RatingValue.forEach((item, index) => {
  //     console.log(`Index ${index}: id=${item.id}, name=${item.name}`);
  //   });
  // }, [formData]);

  const validate = () => {
    if (!formData?.type) {
      setError("Select Property Type..");
      return false;
    }
    if (formData?.propertyType === "directory") {
      if (!formData?.usedAs) {
        setError("Select Property used for..");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    localStorage.setItem("step1", JSON.stringify(formData));
    if (id) {
      navigate(`/property/edit/${id}/1`);
    } else {
      navigate("/property/add/1");
    }
    setActiveTabIndex((prevIndex) => Math.min(prevIndex + 1, 7));
  };

  const save = () => {
    if (!validate()) return;
    const updatedStep1 = {
      ...step1,
      offMarket: formData.offMarket,
    };
    localStorage.setItem("step1", JSON.stringify(updatedStep1));
    saveChanges(updatedStep1);
  };

  const RatingValue = [
    // { id: "Any", name: "Any user with access to off-market can see it" },
    { id: "A", name: "A" },
    { id: "B", name: "B" },
    { id: "C", name: "C" },
    { id: "D", name: "D" },
    { id: "E", name: "E" },
  ];
  const grades = ["A", "B", "C", "D", "E"];

  const handleCheckboxChange = (id) => {
    const current = formData.chooseDocumentGrade;
    if (current === id) {
      setFormData({
        ...formData,
        chooseDocumentGrade: "",
      });
      return;
    }
    if (id === "Any") {
      setFormData({
        ...formData,
        chooseDocumentGrade: "Any",
        isChoosedDeclDocumentVerified: false,
        isChoosedDocumentVerified: false,
      });
      return;
    }
    setFormData({
      ...formData,
      chooseDocumentGrade: id,
    });
  };


  const isChecked = (id) => {
    const selected = formData.chooseDocumentGrade;
    if (selected === "Any") return id === "Any";
    if (
      selected === "" ||
      !(formData?.isChoosedDeclDocumentVerified || formData?.isChoosedDocumentVerified)
    )
      return false;

    const index = grades.indexOf(selected);
    const checkedGrades = grades.slice(0, index + 1);
    return checkedGrades.includes(id);
  };


  const checkDisabled = (item) => {
    if (formData?.offMarket) {
      if (formData?.isChoosedDeclDocumentVerified || formData?.isChoosedDocumentVerified) {
        return item === "Any";
      } else {
        return item !== "Any";
      }
    }
    return true;
  };

  return (
    <div className="flex justify-between flex-col h-full relative">
      <PropertyCheck />
      <div className="lg:overflow-auto lg:h-[500px] h-[100%] md:w-[90%] mx-auto overflow-unset lg:p-8 p-4 lg:py-10">
        <div className="text-center mb-5">
          <h4 className="text-[#47525E] text-[24px] font-[600] leading-tight">
            Sell Off-Market
          </h4>
          <p className="text-[#47525E] text-[18px]">
            Propose your property to only qualified candidates
          </p>
        </div>

        <div className="bg-[#976DD0]/30 rounded-lg p-4 grid lg:grid-cols-5 items-center gap-3">
          <div className="text-center lg:col-span-2">
            <div className="flex items-center justify-center gap-2">
              <h5 className="text-[20px]">Activate Off-Market</h5>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.offMarket}
                  disabled={activePlan?.[0]?.otherDetails?.accessToOffMarketProps?.key == "custom" && (activePlan?.[0]?.otherDetails?.accessToOffMarketProps?.value <= activePlan?.[0]?.offMarketPropertyCount)}
                  onChange={(e) => {
                    if (e.target.checked == false) {
                      setFormData({ ...formData, offMarket: e.target.checked, chooseDocumentGrade: "", isChoosedDocumentVerified: false, isChoosedDeclDocumentVerified: false })
                    } else {
                      setFormData({ ...formData, offMarket: e.target.checked })
                    }
                  }
                  }
                />
                <div className="w-10 h-5 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:bg-[#976DD0] transition-all duration-300"></div>
                <div className="absolute left-0.5 -translate-y-1/2 top-1/2 bg-white w-3.5 h-3.5 rounded-full transition-transform duration-300 peer-checked:translate-x-[20px]"></div>
              </label>
            </div>
            <Link className="text-primary text-[18px]" to={"/plan"}>
              Upgrade plan
            </Link>
          </div>
          <div className="lg:col-span-3">
            <p className="text-[16px]">Define Who can see your property</p>
            <p className="text-[16px]">Target best funding profile first</p>
            <p className="text-[16px]">
              Release progressively your property to the market
            </p>
            <p className="text-[16px]">No obsolescence for your ad</p>
          </div>
        </div>

        <div className="px-5 mt-8">
          <h4 className="text-[20px] mb-3">
            Make sure to get only qualified leads
          </h4>
          <h5 className="text-[18px] mb-3 flex items-center gap-2">
            Only following user can see my property under Off-market:

            <Tooltip title="Among people interested in your property many of them will still be in tourism mode, not ready enough in their purchase project. Target leads with financial profile check will increase your chance to sell quickly and efficiently.">
              <span className=""><FaInfoCircle /></span>
            </Tooltip>
          </h5>
          <ul className="mb-8">
            <li>
              <div className="flex gap-2 items-center mb-2">
                <input
                  type="checkbox"
                  className="accent-[#976DD0] w-4 h-4"
                  checked={formData.isChoosedDocumentVerified}
                  disabled={!formData.offMarket || formData.chooseDocumentGrade === "Any"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isChoosedDocumentVerified: e.target.checked,
                    })
                  }
                />{" "}
                <p>Document based financial background checked.</p>
              </div>
            </li>
            <li>
              <div className="flex gap-2 items-center mb-2">
                <input
                  type="checkbox"
                  className="accent-[#976DD0] w-4 h-4"
                  checked={formData.isChoosedDeclDocumentVerified}
                  disabled={!formData.offMarket || formData.chooseDocumentGrade === "Any"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isChoosedDeclDocumentVerified: e.target.checked,
                    })
                  }
                />{" "}
                <p>Declarative based financial background checked.</p>
              </div>
            </li>
            <li>
              <div className="flex gap-2 items-center mb-2">
                <input
                  type="checkbox"
                  className="accent-[#976DD0] w-4 h-4"
                  checked={isChecked("Any")}
                  disabled={checkDisabled("Any")}
                  onChange={() => handleCheckboxChange("Any")}
                />{" "}
                <p>Any user with access to off-market can see it</p>
              </div>
            </li>
          </ul>

          <h5 className="text-[18px] mb-3 flex items-center gap-2">
            Only following rates will see my property
            <Tooltip title="Preserve the exclusivity of your property by gradually revealing it only to potential buyers with the best financial profile. You can adjust these criteria at any time.">
              <span className=""><FaInfoCircle /></span>
            </Tooltip>
          </h5>
          <ul className="mb-5">
            {RatingValue.map((item, index) => {
              return <li key={item.id}>
                <div className="flex gap-2 items-center mb-2">
                  <input
                    type="checkbox"
                    className="accent-[#976DD0] w-4 h-4"
                    checked={isChecked(item.id)}
                    onChange={(e) => {
                      handleCheckboxChange(item.id)
                    }}
                    disabled={checkDisabled(item.id)}
                  />
                  <p className="text-[15px]">{item?.name}</p>
                </div>
              </li>
            })}
          </ul>
        </div>

        <div className="px-5">
          <h4 className="text-[20px] mb-1">Don't get overwhelmed by requests</h4>
          <p className="text-[16px] text-[#47525E]">
            Once we reach the maximum number of leads we will block the ability
            to contact you.
          </p>
          <div className="inline-flex gap-3 items-center bg-[#fff] p-2 rounded-md border border-[#976DD0] mt-4">
            <input
              type="number"
              value={formData?.maximumLead}
              className="bg-gray-200 p-1 px-3 w-[80px] rounded-md"
              disabled={activePlan?.[0]?.accessToOffMarketProps?.key == "custom" && activePlan?.[0]?.accessToOffMarketProps?.value <= activePlan?.[0]?.offMarketPropertyCount}
              onChange={(e) =>
                setFormData({ ...formData, maximumLead: e.target.value })
              }
            />
            <h5 className="text-[16px] font-[500]">Maximum Leads</h5>
          </div>
        </div>
      </div>

      {id ? (
        formData?.propertyType === "directory" && (
          <div className="text-end bg-[#f2ecf8] p-5 w-full">
            <button
              onClick={save}
              className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
            >
              Save change
            </button>
          </div>
        )
      ) : (
        <div className="text-end bg-[#f7f4fb] p-5 w-full">
          <button
            onClick={handleNext}
            className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Step1;
