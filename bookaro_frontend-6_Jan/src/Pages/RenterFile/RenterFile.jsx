import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BsFiletypePdf } from "react-icons/bs";
import { FaCircleInfo } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { login_success } from "../../actions/user";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { imagePath, stringSeprator } from "../../models/string.model";
import GooglePlaceAutoComplete from "../../components/common/GooglePlaceAutoComplete";
import renterQuestionnaire from "./questionnaire.config";
import { isGuestMode } from "../../methods/guestMode";
import { fireOnboardingEvent } from "../../components/onboarding/onboarding.api";
import FinancialCredibilityModal from "../../components/common/Modal/FinancialCredibilityModal";

const RenterFile = ({ isModal = false, embedded = false, result = (_) => { } }) => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const isGuest = isGuestMode() || user?.isGuest;
  const [selectall, setSelectAll] = useState(true);
  const [document, setDocument] = useState(embedded ? "document" : "declarative");
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [scoringResult, setScoringResult] = useState(null);
  const [declartiveForm, setdeclartiveForm] = useState({
    targetRooms: "",
    targetCity: "",
    targetRent: "",
    birthDate: "",
    nationality: "",
    hasResidencePermit: "",
    currentHousingStatus: "",
    residenceDuration: "",
    currentRent: "",
    employmentStatus: "",
    contractType: "",
    contractStatus: "",
    jobSeniority: "",
    incomeType: "",
    monthlyIncome: "",
    hasGuarantor: "",
    guarantorType: "",
    guarantorIncomeType: "",
    guarantorMonthlyIncome: "",
  });
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    identityProof: [],
    addressProof: [],
    salarySlips: [],
    otherDocs: [],
  });

  const guestRenterFiles = useMemo(
    () => ({
      identityProof: [
        {
          fileName: "guest-carte-didentite.pdf",
          originalname: t("renterFile.guestIdentityProof", "Carte d’identité"),
          checked: true,
        },
      ],
      addressProof: [
        {
          fileName: "guest-justificatif-domicile.pdf",
          originalname: t("renterFile.guestAddressProof", "Justificatif de domicile (facture EDF)"),
          checked: true,
        },
      ],
      salarySlips: [
        {
          fileName: "guest-bulletin-salaire-janvier.pdf",
          originalname: t("renterFile.guestSalarySlip", "Bulletin de salaire - janvier"),
          checked: true,
        },
        {
          fileName: "guest-bulletin-salaire-fevrier.pdf",
          originalname: t("renterFile.guestSalarySlip", "Bulletin de salaire - février"),
          checked: true,
        },
        {
          fileName: "guest-bulletin-salaire-mars.pdf",
          originalname: t("renterFile.guestSalarySlip", "Bulletin de salaire - mars"),
          checked: true,
        },
      ],
      otherDocs: [
        {
          fileName: "guest-lettre-motivation.pdf",
          originalname: t("renterFile.guestOptionalDoc", "Lettre de motivation"),
          checked: true,
        },
      ],
    }),
    [t]
  );

  const guestDeclarativeForm = useMemo(
    () => ({
      targetRooms: "",
      targetCity: "",
      targetRent: "",
      birthDate: "",
      nationality: "",
      hasResidencePermit: "",
      currentHousingStatus: "",
      residenceDuration: "",
      currentRent: "",
      employmentStatus: "",
      contractType: "",
      contractStatus: "",
      jobSeniority: "",
      incomeType: "",
      monthlyIncome: "",
      hasGuarantor: "",
      guarantorType: "",
      guarantorIncomeType: "",
      guarantorMonthlyIncome: "",
    }),
    []
  );

  useEffect(() => {
    if (isGuest) {
      setForm(guestRenterFiles);
      return;
    }
    if (user?.renterFiles) {
      setForm({
        identityProof: user.renterFiles?.identityProof || [],
        addressProof: user.renterFiles?.addressProof || [],
        salarySlips: user.renterFiles?.salarySlips || [],
        otherDocs: user.renterFiles?.otherDocs || [],
      });
    }
  }, [user?.renterFiles, isGuest, guestRenterFiles]);

  useEffect(() => {
    if (isGuest) {
      setdeclartiveForm(() => guestDeclarativeForm);
      return;
    }
      if (user?.declarativeRenterFiles) {
      setdeclartiveForm((prev) => ({
        ...prev,
        targetRooms: user?.declarativeRenterFiles?.targetRooms || "",
        targetCity: user?.declarativeRenterFiles?.targetCity || "",
        targetRent: user?.declarativeRenterFiles?.targetRent || "",
        birthDate: user?.declarativeRenterFiles?.birthDate || "",
        nationality: user?.declarativeRenterFiles?.nationality || "",
        hasResidencePermit: user?.declarativeRenterFiles?.hasResidencePermit || "",
        currentHousingStatus:
          user?.declarativeRenterFiles?.currentHousingStatus ||
          user?.declarativeRenterFiles?.residenceStatus || "",
        residenceDuration: user?.declarativeRenterFiles?.residenceDuration || "",
        currentRent: user?.declarativeRenterFiles?.currentRent || "",
        employmentStatus: user?.declarativeRenterFiles?.employmentStatus || "",
        contractType: user?.declarativeRenterFiles?.contractType || "",
        contractStatus: user?.declarativeRenterFiles?.contractStatus || "",
        jobSeniority: user?.declarativeRenterFiles?.jobSeniority || "",
        incomeType: user?.declarativeRenterFiles?.incomeType || "",
        monthlyIncome: user?.declarativeRenterFiles?.monthlyIncome || "",
        hasGuarantor:
          user?.declarativeRenterFiles?.hasGuarantor === "oui"
            ? "avez"
            : user?.declarativeRenterFiles?.hasGuarantor === "non"
            ? "n_avez_pas"
            : user?.declarativeRenterFiles?.hasGuarantor || "",
        guarantorType: user?.declarativeRenterFiles?.guarantorType || "",
        guarantorIncomeType: user?.declarativeRenterFiles?.guarantorIncomeType || "",
        guarantorMonthlyIncome: user?.declarativeRenterFiles?.guarantorMonthlyIncome || "",
      }));
    }
  }, [user?.declarativeRenterFiles, isGuest, guestDeclarativeForm]);

  const getConditionValue = useCallback(
    (questionId) => {
      const referencedQuestion = renterQuestionnaire.find((q) => q.id === questionId);
      if (referencedQuestion?.field) {
        return declartiveForm[referencedQuestion.field];
      }
      return declartiveForm[questionId];
    },
    [declartiveForm]
  );

  const evaluateCondition = useCallback(
    (condition) => {
      if (!condition) return true;
      if (condition.type === "equals") {
        return getConditionValue(condition.questionId) === condition.value;
      }
      if (condition.type === "notIn") {
        return !condition.values.includes(getConditionValue(condition.questionId));
      }
      if (condition.type === "and") {
        return condition.conditions.every((subCondition) => evaluateCondition(subCondition));
      }
      if (condition.type === "or") {
        return condition.conditions.some((subCondition) => evaluateCondition(subCondition));
      }
      return getConditionValue(condition.questionId) === condition.value;
    },
    [getConditionValue]
  );

  const getVisibleQuestion = useCallback(
    (question) => {
      if (!question.condition) return true;
      return evaluateCondition(question.condition);
    },
    [evaluateCondition]
  );

  const buildQuestionRows = () => {
    const rows = [];
    let currentRow = [];
    renterQuestionnaire.forEach((question) => {
      if (question.type === "title") {
        if (currentRow.length) {
          rows.push(currentRow);
          currentRow = [];
        }
        rows.push([question]);
        return;
      }
      if (question.lineBreak && currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [];
      }
      currentRow.push(question);
    });
    if (currentRow.length) {
      rows.push(currentRow);
    }
    return rows;
  };

  const isFieldAnswered = useCallback(
    (field, question) => {
      if (question && question.required === false) return true;
      const value = declartiveForm[field];
      return value !== undefined && value !== null && value !== "";
    },
    [declartiveForm]
  );

  const isRowAnswered = useCallback(
    (row) => {
      const visibleQuestions = row.filter(getVisibleQuestion);
      if (visibleQuestions.length === 0) return true;
      const questionsWithField = visibleQuestions.filter((question) => question.field);
      if (questionsWithField.length === 0) return true;
      return questionsWithField.every((question) => isFieldAnswered(question.field, question));
    },
    [getVisibleQuestion, isFieldAnswered]
  );

  const questionRows = useMemo(() => buildQuestionRows(), []);

  const isQuestionnaireComplete = useMemo(() => {
    return questionRows.every((row) => {
      const visibleQuestions = row.filter(getVisibleQuestion);
      if (visibleQuestions.length === 0) return true;
      return visibleQuestions.every((question) => (question.field ? isFieldAnswered(question.field, question) : true));
    });
  }, [questionRows, getVisibleQuestion, isFieldAnswered]);

  const rowRefs = useRef([]);

  const visibleRowIndexes = useMemo(() => {
    return questionRows.reduce((acc, row, index) => {
      const visibleQuestions = row.filter(getVisibleQuestion);
      if (visibleQuestions.length) acc.push(index);
      return acc;
    }, []);
  }, [questionRows, getVisibleQuestion]);

  const lastVisibleRowIndex = useMemo(() => {
    for (let i = 0; i < questionRows.length; i++) {
      const row = questionRows[i];
      const visibleQuestions = row.filter(getVisibleQuestion);
      if (!visibleQuestions.length) continue;
      if (!isRowAnswered(row)) {
        return i;
      }
    }
    return visibleRowIndexes.length ? visibleRowIndexes[visibleRowIndexes.length - 1] : 0;
  }, [questionRows, visibleRowIndexes, getVisibleQuestion, isRowAnswered]);

  const displayedRowIndexes = useMemo(() => {
    return visibleRowIndexes.filter((index) => index <= lastVisibleRowIndex);
  }, [visibleRowIndexes, lastVisibleRowIndex]);

  const scrollToRow = (rowIndex) => {
    const rowElement = rowRefs.current[rowIndex];
    if (rowElement?.scrollIntoView) {
      rowElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (lastVisibleRowIndex < 0) return;
    if (currentRowIndex > lastVisibleRowIndex) {
      setCurrentRowIndex(lastVisibleRowIndex);
      scrollToRow(lastVisibleRowIndex);
    }
  }, [currentRowIndex, lastVisibleRowIndex]);

  const handleAnswer = (field, value) => {
    setdeclartiveForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const findFirstVisibleUnansweredRowIndex = useCallback(() => {
    for (let i = 0; i < questionRows.length; i++) {
      const row = questionRows[i];
      const visibleQuestions = row.filter(getVisibleQuestion);
      if (!visibleQuestions.length) continue;
      if (!visibleQuestions.every((question) => isFieldAnswered(question.field, question))) {
        return i;
      }
    }
    return questionRows.findIndex((row) => row.some(getVisibleQuestion));
  }, [questionRows, getVisibleQuestion, isFieldAnswered]);

  useEffect(() => {
    const visibleQuestions = questionRows[currentRowIndex]?.filter(getVisibleQuestion);
    if (!visibleQuestions || visibleQuestions.length === 0) {
      setCurrentRowIndex(findFirstVisibleUnansweredRowIndex());
    }
  }, [currentRowIndex, questionRows, findFirstVisibleUnansweredRowIndex, getVisibleQuestion]);

  const formatAmountValue = (value) => {
    if (value === undefined || value === null || value === "") return "";
    const digits = String(value).replace(/[^0-9]/g, "");
    if (!digits) return "";
    return Number(digits).toLocaleString("fr-FR");
  };

  const parseAmountValue = (value) => {
    if (value === undefined || value === null) return "";
    return String(value).replace(/[^0-9]/g, "");
  };

  const renderQuestionSuffix = (question) => {
    if (question.field === "jobSeniority" || question.field === "residenceDuration") {
      const rawValue = declartiveForm[question.field];
      const count = Number(String(rawValue).replace(/[^0-9]/g, ""));
      if (!count) return null;
      return <span className="ml-1">{count === 1 ? "an" : "ans"}</span>;
    }
    return null;
  };

  const renderInputByType = (question) => {
    const rawValue = declartiveForm[question.field] ?? "";
    const value = question.inputType === "amount" ? formatAmountValue(rawValue) : rawValue;
    const disabled = false;
    const isFilled = String(rawValue).trim() !== "";
    const inputBaseClass = "rounded-md border border-[#a177d6] px-3 py-2 h-[42px] outline-none text-sm";
    const placeholderClass = "placeholder:text-[#3c3c3c] placeholder:font-extrabold";
    const filledTextClass = isFilled ? "!text-[#976DD0] !font-extrabold" : "!text-[#3c3c3c] !font-extrabold";
    const selectWidthClass =
      question.field === "targetRooms"
        ? "min-w-[120px] w-auto"
        : "min-w-[140px] w-auto max-w-[320px]";

    if (question.field === "targetCity") {
      return (
        <GooglePlaceAutoComplete
          placeholder={question.placeholder || "Renseigner la ville"}
          value={value}
          id={`renter-file-${question.field}`}
          disabled={disabled}
          className={`${inputBaseClass} ${placeholderClass} ${filledTextClass} min-w-[260px] w-[280px] max-w-[360px]`}
          onChange={(text) => handleAnswer(question.field, text)}
          result={({ value: selectedValue }) => handleAnswer(question.field, selectedValue)}
        />
      );
    }

    switch (question.inputType) {
      case "select":
        return (
          <select
            value={value}
            disabled={disabled}
            className={`${inputBaseClass} bg-white ${filledTextClass} ${disabled ? "cursor-not-allowed bg-[#f3f1f8]" : ""} ${selectWidthClass}`}
            onChange={(e) => handleAnswer(question.field, e.target.value)}
          >
            <option value="" className="text-[#3c3c3c] font-extrabold">Sélectionner</option>
            {question.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "amount":
        return (
          <span className="inline-flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={value}
              disabled={disabled}
              placeholder={question.placeholder || "Montant"}
              className={`${inputBaseClass} ${placeholderClass} ${filledTextClass} w-[140px] ${disabled ? "bg-[#f3f1f8]" : ""}`}
              onChange={(e) => handleAnswer(question.field, parseAmountValue(e.target.value))}
            />
            <span className="text-[#4b3869]">€</span>
          </span>
        );
      case "date":
        return (
          <input
            type="date"
            value={value}
            disabled={disabled}
            className={`${inputBaseClass} ${filledTextClass} w-[180px] ${disabled ? "bg-[#f3f1f8]" : ""}`}
            onChange={(e) => handleAnswer(question.field, e.target.value)}
          />
        );
      case "number":
        return (
          <input
            type="number"
            min="0"
            value={value}
            disabled={disabled}
            placeholder={question.placeholder || "Nombre"}
            className={`${inputBaseClass} ${placeholderClass} ${filledTextClass} w-[120px] ${disabled ? "bg-[#f3f1f8]" : ""}`}
            onChange={(e) => handleAnswer(question.field, e.target.value)}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            disabled={disabled}
            placeholder={question.placeholder || "Réponse"}
            className={`${inputBaseClass} ${placeholderClass} ${filledTextClass} w-[180px] ${disabled ? "bg-[#f3f1f8]" : ""}`}
            onChange={(e) => handleAnswer(question.field, e.target.value)}
          />
        );
    }
  };

  const renderRenterRow = (row, rowIndex) => {
    const visibleQuestions = row.filter(getVisibleQuestion);
    if (row[0]?.type === "title") {
      return (
        <div key={rowIndex} className="mb-4">
          <h3 className="text-[#4b3869] font-bold text-[18px]">{row[0].text}</h3>
        </div>
      );
    }
    return (
      <div
        ref={(el) => (rowRefs.current[rowIndex] = el)}
        key={rowIndex}
        className="w-full rounded-[10px] bg-white p-5 transition-all duration-300 ease-out border border-[#E6DAF2]"
      >
        <p className="text-[#4b3869] text-[15px] leading-[22px] flex flex-wrap items-center gap-2">
          {visibleQuestions.map((question, index) => (
            <span key={question.id} className="inline-flex items-center gap-2 whitespace-nowrap">
              <span>{question.text}</span>
              {question.field ? renderInputByType(question) : null}
              {renderQuestionSuffix(question)}
            </span>
          ))}
          .
        </p>
      </div>
    );
  };

  const ImageUpload = (e, key, maxLimit = 10, maxSize = 10) => {
    if (isGuest) {
      toast.info(t("renterFile.guestReadOnlyMessage", "Guest mode is read-only. Upload is disabled."));
      e.target.value = "";
      return;
    }

    let files = Array.from(e.target.files);
    // validate max limit files
    if (files.length + form[key]?.length > maxLimit) {
      toast.error(t("renterFile.maxFilesAllowed", { max: maxLimit }));
      return (e.target.value = ""); // Clear file input
    }
    // validate max size
    const maxSizeInBytes = maxSize * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter((file) => file.size > maxSizeInBytes);
    if (oversizedFiles.length > 0) {
      toast.error(t("renterFile.eachFileMaxSize", { max: maxSize }));
      return (e.target.value = "");
    }

    loader(true);
    ApiClient.multiImageUpload(
      "upload/multiple-images",
      files,
      {},
      "files"
    )
      .then((res) => {
        if (res.success) {
          const data = res?.files?.map((item) => {
            return {
              fileName: item?.fileName,
              originalname: item?.originalname,
              checked: true,
            };
          });
          if (data?.length + form[key]?.length > maxLimit)
            return toast.error(t("renterFile.maxFilesAllowed", { max: maxLimit }));
          let sman = { ...form };
          sman = {
            ...sman,
            [key]: [...sman[key], ...data],
          };
          setForm(sman);
          handleSubmit(sman);
        }
      })
      .catch((er) => console.log("err in file upload", er))
      .finally(() => {
        loader(false);
        e.target.value = "";
      });
  };

  const viewDoc = (fileName) => {
    if (isGuest) {
      toast.info(t("renterFile.guestReadOnlyMessage", "Guest mode is read-only. Preview is disabled."));
      return;
    }
    const url = imagePath(fileName);
    window.open(url, "_blank");
  };
  const deleteDoc = (i, key) => {
    if (isGuest) {
      toast.info(t("renterFile.guestReadOnlyMessage", "Guest mode is read-only. Deleting documents is disabled."));
      return;
    }
    let data = form[key]?.filter((_, ind) => ind !== i);
    let sman = { ...form };
    sman = {
      ...sman,
      [key]: data,
    };
    setForm(sman);
    handleSubmit(sman);
  };

  const handleSubmit = (form, key = "document") => {
    if (isGuest && key !== "declarative") {
      toast.info(t("renterFile.guestReadOnlyMessage", "Guest mode is read-only. Changes are not saved."));
      return;
    }

    let payload = {};
    let normalizedAnswers = null;
    if (key === "declarative") {
      if (!isQuestionnaireComplete) {
        return;
      }
      normalizedAnswers = { ...declartiveForm };
      [
        'targetRent',
        'currentRent',
        'monthlyIncome',
        'guarantorMonthlyIncome',
      ].forEach((field) => {
        if (normalizedAnswers[field] !== "") {
          normalizedAnswers[field] = Number(String(normalizedAnswers[field]).replace(/[^0-9]/g, ""));
        } else {
          normalizedAnswers[field] = undefined;
        }
      });
      ['residenceDuration', 'jobSeniority'].forEach((field) => {
        if (normalizedAnswers[field] !== "") {
          normalizedAnswers[field] = Number(String(normalizedAnswers[field]).replace(/[^0-9]/g, ""));
        } else {
          normalizedAnswers[field] = undefined;
        }
      });
      if (normalizedAnswers.hasGuarantor !== 'avez') {
        normalizedAnswers.guarantorType = undefined;
        normalizedAnswers.guarantorIncomeType = undefined;
        normalizedAnswers.guarantorMonthlyIncome = undefined;
      }
      payload = {
        userId: user?.id || user?._id,
        declarativeRenterFiles: normalizedAnswers,
      };
    } else {
      payload = {
        userId: user?.id || user?._id,
        renterFiles: form,
      };
    }
    loader(true);
    const request = isGuest && key === "declarative"
      ? ApiClient.post("score/renter", { declarativeRenterFiles: normalizedAnswers })
      : ApiClient.put("user/editUserDetails", payload);

    request
      .then((res) => {
        if (res.success) {
          if (key === "declarative") {
            const scoringResultFromApi = res?.data || res?.scoringResult || null;
            if (scoringResultFromApi) {
              setScoringResult(scoringResultFromApi);
              setShowScoreModal(true);
            }
          }
          toast.success(res?.message || t("renterFile.scoreFetched", "Score obtenu."));
          dispatch(login_success({
            renterFiles: form,
            declarativeRenterFiles: declartiveForm,
            ...(res?.data?.score ? { renterFinancingReferenceScore: res.data.score } : {}),
          }));
          if (key === "declarative") {
            fireOnboardingEvent('financial_score_calculated');
          }
        } else {
          toast.error(res?.message || t("common.somethingWentWrong", "Une erreur est survenue."));
        }
      })
      .catch((err) => {
        toast.error(err?.message || t("common.somethingWentWrong", "Une erreur est survenue."));
      })
      .finally(() => {
        loader(false);
      });
  };

  const updateCheckbox = (key = "", index) => {
    const updatedItems = [...form[key]];
    updatedItems[index].checked = !updatedItems[index].checked;
    const updatedForm = {
      ...form,
      [key]: updatedItems,
    };
    setForm(updatedForm);

    const allSelected = Object.values(updatedForm).every((category) =>
      category.every((file) => file.checked)
    );
    setSelectAll(allSelected);
  };

  const selectAllDocs = (isChecked) => {
    setSelectAll(isChecked);
    setForm((prevDocs) => {
      const updatedDocs = {};
      for (const [key, files] of Object.entries(prevDocs)) {
        updatedDocs[key] = files.map((file) => ({ ...file, checked: isChecked }));
      }
      return updatedDocs;
    });
  };

  return (
    <>
      <section className={`${embedded ? "pt-0 pb-0" : "pt-14 lg:pt-16 pb-5 h-[80vh] overflow-y-auto"} bg-[#f3f5f9] relative `}>
        <div className={`${embedded ? "px-0" : "container   px-8 mx-auto xl:px-10"}  flex justify-between flex-col `}>
          {isModal ? <></> : null}

          {!embedded && (
          <div className="w-full ">
            <div>
              <h4 className="text-[#47525E] text-center mb-0 text-[17px]">
                {t("renterFile.renterFile")}
              </h4>
              <h2 className="text-[#47525E] font-[600] text-[24px] mt-1 text-center">
                {t("renterFile.saveTimeFindHome")}
              </h2>
              {isGuest && (
                <div className="flex justify-center mt-3">
                  <span className="dashboard-section-mock-badge inline-flex items-center justify-center px-3 py-1 rounded-full text-[12px] font-semibold text-[#7c4b00] bg-[#fff4dd] shadow-[0_4px_12px_rgba(249,179,71,0.18)] border border-[rgba(249,179,71,0.35)]">
                    Données fictives
                  </span>
                </div>
              )}
            </div>
          </div>
          )}
          <div className={`${embedded ? "bg-transparent p-0" : "bg-[#f3ebf9] p-4 md:p-10"} `}>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Sidebar */}
              {!isModal && !embedded && <div className="flex md:flex-col gap-4  md:w-[220px] ">
                <button
                  onClick={() => setDocument("declarative")}
                  className={`rounded-full border-2 border-[#a177d6]  ${document === 'declarative' ? 'bg-primary hover:opacity-90 text-white' : 'text-[#a177d6]'}  font-semibold px-6 py-2`}
                >
                  Votre projet
                </button>
                <button
                  onClick={() => setDocument("document")}
                  className={`rounded-full border-2 border-[#a177d6]  ${document === 'document' ? 'bg-primary hover:opacity-90 text-white' : 'text-[#a177d6]'}  font-semibold px-6 py-2`}
                >
                  Vos documents
                </button>
              </div>
              }
              {/* Right Content */}
              <div className="flex-1 space-y-8 md:border-[#a177d6] md:border-l-[5px] md:ps-6">
                <div className="max-w-2xl bg-[#976dd0b5] p-5 rounded-[12px] flex mt-0">
                  <p className="text-white w-[90%] text-[14px] leading-6">
                    {document === 'declarative'
                      ? 'Remplissez ce questionnaire pour obtenir un avis et un score sur la faisabilité de votre projet de location. Ce score vous donnera accès à des opportunités Off-market et sera présenté aux propriétaires pour renforcer votre crédibilité.'
                      : 'Aucun de ces documents ne sera partagé publiquement ni accessible par un tiers. Vous pourrez partager ces documents avec les propriétaires des biens que vous ciblez pour renforcer votre crédibilité.'
                    }
                  </p>
                  <FaCircleInfo className="w-[50px] text-[35px] ms-5" />
                </div>
                {document === "document" && (
                  <>
                    <div>
                      <h2 className="text-[#000000] font-[600] text-[22px] mb-5   inline-block">
                        {t("renterFile.personalInformation")}
                      </h2>
                      {isModal &&
                        <div className="inline-flex justify-end items-center ml-5">
                          <input
                            type="checkbox"
                            checked={selectall ? true : false}
                            onChange={(e) => selectAllDocs(e.target.checked)}
                            id="selectAll"
                            className="mr-2"
                          />
                          <label htmlFor="selectAll">{t("common.selectAll")}</label>
                        </div>}

                      <div className="grid grid-cols-12 md:gap-10 gap-0">
                        <div className=" lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("renterFile.proofOfIdentity")}
                            </h4>
                            <p className="text-[#47525E] my-2 text-[13px]">
                              {t("renterFile.identityProofDescription")}
                            </p>
                            <p className="text-[#47525E] italic text-[12px] ">
                              {t("renterFile.identityProofExamples")}
                            </p>
                          </div>
                          {form?.identityProof?.length > 0 &&
                            form?.identityProof?.map((itm, i) => (
                              <div className="p-5 flex justify-between md:flex-row flex-col md:items-center items-start">
                                <div className="flex items-center gap-2">
                                  {isModal &&
                                    <input
                                      id="default-checkbox"
                                      checked={itm?.checked || false}
                                      onChange={() => updateCheckbox("identityProof", i)}
                                      type="checkbox"
                                      value=""
                                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />}
                                  <BsFiletypePdf className="text-[24px] me-3" />
                                  <span className="text-[#383A3D] text-[12px]">
                                    {stringSeprator(itm.originalname, 30)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <p
                                    onClick={() => !isGuest && viewDoc(itm.fileName)}
                                    className={`${isGuest ? "cursor-not-allowed text-[#8b8b8b]" : "cursor-pointer text-[#383A3D]"} text-[14px]`}
                                  >
                                    {t("common.preview")}
                                  </p>
                                  <p className="text-[#383A3D] text-[14px] mx-3">
                                    {/* Edit */}
                                  </p>
                                  <p
                                    onClick={() => !isGuest && deleteDoc(i, "identityProof")}
                                    className={`${isGuest ? "cursor-not-allowed text-[#8b8b8b]" : "cursor-pointer text-[#383A3D]"} text-[14px]`}
                                  >
                                    {t("common.delete")}
                                  </p>
                                </div>
                              </div>
                            ))}
                          {form?.identityProof?.length < 1 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              {isGuest ? (
                                <div className="flex items-center justify-center w-full text-[#8b8b8b] text-[14px]">
                                  {t("renterFile.guestUploadDisabled", "Guests cannot upload documents.")}
                                </div>
                              ) : (
                                <label className="relative  h-full w-full">
                                  <p className="text-[#976DD0] w-full text-[14px] text-center fFont-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                    {t("renterFile.uploadDocument")}
                                  </p>
                                  <input
                                    type="file"
                                    name="file"
                                    className="opacity-0 w-full h-[64px]"
                                    onChange={(e) => ImageUpload(e, "identityProof", 1)}
                                  />
                                </label>
                              )}
                            </div>
                          )}
                        </div>

                        <div className=" lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("renterFile.proofOfCurrentAddress")}
                            </h4>
                            <p className="text-[#47525E] my-2 text-[13px]">
                              {t("renterFile.addressProofDescription")}
                            </p>
                            <p className="text-[#47525E] italic text-[12px] ">
                              {t("renterFile.addressProofExamples")}
                            </p>
                          </div>
                          {form?.addressProof?.length > 0 &&
                            form?.addressProof?.map((itm, i) => (
                              <div className="p-5 flex justify-between md:flex-row flex-col md:items-center items-start">
                                <div className="flex items-center gap-2">
                                  {isModal &&
                                    <input
                                      id="default-checkbox"
                                      checked={itm?.checked || false}
                                      onChange={() => updateCheckbox("addressProof", i)}
                                      type="checkbox"
                                      value=""
                                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />}
                                  <BsFiletypePdf className="text-[24px] me-3" />
                                  <span className="text-[#383A3D] text-[12px]">
                                    {stringSeprator(itm.originalname, 30)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <p
                                    onClick={() => !isGuest && viewDoc(itm.fileName)}
                                    className={`${isGuest ? "cursor-not-allowed text-[#8b8b8b]" : "cursor-pointer text-[#383A3D]"} text-[14px]`}
                                  >
                                    {t("common.preview")}
                                  </p>
                                  <p className="text-[#383A3D] text-[14px] mx-3">
                                    {/* Edit */}
                                  </p>
                                  <p
                                    onClick={() => !isGuest && deleteDoc(i, "addressProof")}
                                    className={`${isGuest ? "cursor-not-allowed text-[#8b8b8b]" : "cursor-pointer text-[#383A3D]"} text-[14px]`}
                                  >
                                    {t("common.delete")}
                                  </p>
                                </div>
                              </div>
                            ))}
                          {form?.addressProof?.length < 1 && (
                            <div className="flex justify-center h-[64px]">
                              {isGuest ? (
                                <div className="flex items-center justify-center w-full text-[#8b8b8b] text-[14px]">
                                  {t("renterFile.guestUploadDisabled", "Guests cannot upload documents.")}
                                </div>
                              ) : (
                                <label className="relative  h-full w-full">
                                  <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                    {t("renterFile.uploadDocument")}
                                  </p>
                                  <input
                                    type="file"
                                    name="file"
                                    className="opacity-0 w-full h-[64px]"
                                    onChange={(e) => ImageUpload(e, "addressProof", 1)}
                                  />
                                </label>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-[#000000] font-[600] text-[22px] mt-5 ">
                        {t("renterFile.resourcesAndIncome")}
                      </h2>
                      <p className="text-black mb-5 text-[12px] max-w-2xl">
                        {t("renterFile.resourcesAndIncomeDescription")}
                      </p>
                      <h3 className="text-black underline font-semibold mb-5">
                        {t("renterFile.yourFinancialSituation")}
                      </h3>
                      <div className="grid grid-cols-12 md:gap-10 gap-0">
                        <div className="  col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("renterFile.lastThreeSalarySlips")}
                            </h4>
                          </div>
                          {form?.salarySlips?.length > 0 && (
                            <ul className="p-5">
                              {form?.salarySlips?.map((itm, i) => (
                                <li className="mb-3 ">
                                  <div className=" flex justify-between md:flex-row flex-col md:items-center items-start md:mb-0 mb-5">
                                    <div className="flex items-center gap-2">
                                      {isModal &&
                                        <input
                                          id="default-checkbox"
                                          checked={itm?.checked || false}
                                          onChange={() => updateCheckbox("salarySlips", i)}
                                          type="checkbox"
                                          value=""
                                          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />}
                                      <BsFiletypePdf className="text-[24px] me-3 text-[#ff0000]" />
                                      <span className="text-[#383A3D] text-[12px]">
                                        {stringSeprator(itm.originalname, 30)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <p
                                        onClick={() => !isGuest && viewDoc(itm.fileName)}
                                        className={`${isGuest ? "cursor-not-allowed text-[#8b8b8b]" : "cursor-pointer text-[#383A3D]"} text-[14px]`}
                                      >
                                        {t("common.preview")}
                                      </p>
                                      <p className="text-[#383A3D] text-[14px] mx-3">
                                        {/* Edit */}
                                      </p>
                                      <p
                                        onClick={() => !isGuest && deleteDoc(i, "salarySlips")}
                                        className={`${isGuest ? "cursor-not-allowed text-[#8b8b8b]" : "cursor-pointer text-[#383A3D]"} text-[14px]`}
                                      >
                                        {t("common.delete")}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                          {form?.salarySlips?.length < 3 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              {isGuest ? (
                                <div className="flex items-center justify-center w-full text-[#8b8b8b] text-[14px]">
                                  {t("renterFile.guestUploadDisabled", "Guests cannot upload documents.")}
                                </div>
                              ) : (
                                <label className="relative  h-full w-full">
                                  <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                    {t("renterFile.uploadDocument")}
                                  </p>
                                  <input
                                    type="file"
                                    name="file"
                                    className="opacity-0 w-full h-[64px]"
                                    multiple
                                    onChange={(e) => ImageUpload(e, "salarySlips", 3)}
                                  />
                                </label>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-[#000000] font-[600] text-[22px] mt-5 ">
                        {t("renterFile.optionalDocuments")}
                      </h2>
                      <p className="text-black mb-5 text-[12px] max-w-2xl">
                        {t("renterFile.optionalDocumentsDescription")}
                      </p>
                      <div className="grid grid-cols-12 md:gap-10 gap-0">
                        <div className=" col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("renterFile.makeCandidacyStandOut")}
                            </h4>
                            <p className="text-[#47525E] mt-2 text-[12px]">
                              {t("renterFile.optionalDocsNote1")}
                            </p>
                            <p className="text-[#47525E] mb-2 text-[12px]">
                              {t("renterFile.optionalDocsNote2")}
                            </p>
                          </div>
                          {form?.otherDocs?.length > 0 && (
                            <ul className="p-5 border-b border-[#D5D5D5]">
                              {form?.otherDocs?.map((itm, i) => (
                                <li className="mb-3 ">
                                  <div className=" flex justify-between md:flex-row flex-col md:items-center items-start md:mb-0 mb-5">
                                    <div className="flex items-center gap-2">
                                      {isModal &&
                                        <input
                                          id="default-checkbox"
                                          checked={itm?.checked || false}
                                          onChange={() => updateCheckbox("otherDocs", i)}
                                          type="checkbox"
                                          value=""
                                          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />}
                                      <BsFiletypePdf className="text-[24px] me-3 text-[#ff0000]" />
                                      <span className="text-[#383A3D] text-[12px]">
                                        {stringSeprator(itm.originalname, 30)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <p
                                        onClick={() => !isGuest && viewDoc(itm.fileName)}
                                        className={`${isGuest ? "cursor-not-allowed text-[#8b8b8b]" : "cursor-pointer text-[#383A3D]"} text-[14px]`}
                                      >
                                        {t("common.preview")}
                                      </p>
                                      <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                                        {/* Edit */}
                                      </p>
                                      <p
                                        onClick={() => !isGuest && deleteDoc(i, "otherDocs")}
                                        className={`${isGuest ? "cursor-not-allowed text-[#8b8b8b]" : "cursor-pointer text-[#383A3D]"} text-[14px]`}
                                      >
                                        {t("common.delete")}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                          {form?.otherDocs?.length < 10 && (
                            <div className="flex justify-center h-[64px]">
                              {isGuest ? (
                                <div className="flex items-center justify-center w-full text-[#8b8b8b] text-[14px]">
                                  {t("renterFile.guestUploadDisabled", "Guests cannot upload documents.")}
                                </div>
                              ) : (
                                <label className="relative  h-full w-full">
                                  <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                    {t("renterFile.uploadDocument")}
                                  </p>
                                  <input
                                    type="file"
                                    name="file"
                                    className="opacity-0 w-full h-[64px]"
                                    multiple
                                    onChange={(e) => ImageUpload(e, "otherDocs", 10)}
                                  />
                                </label>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {document === "declarative" && !isModal && !embedded && (
                  <>
                    <div className="space-y-4">
                      {displayedRowIndexes.map((rowIndex) => renderRenterRow(questionRows[rowIndex], rowIndex))}
                    </div>
                    <div className="mt-6 flex items-center justify-end">
                      <button
                        onClick={() => handleSubmit(form, "declarative")}
                        className={`rounded-[100px] px-14 py-3 text-white border border-transparent transition duration-300 ease-in-out ${isQuestionnaireComplete ? "!bg-[#976DD0] hover:!bg-[#8750be]" : "!bg-[#48464a] hover:bg-transparent hover:border-[#48464a]"}`}
                      >
                        {isQuestionnaireComplete ? "Voir le résultat" : "Enregistrer brouillon"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* <div className="mt-20 flex items-center justify-end">
            <button
              onClick={() => handleSubmit()}
              className="bg-[#48464a] rounded-[100px] px-14 py-3 text-white signup-btn border border-transparent hover:bg-transparent hover:border-[#48464a] transition duration-300 ease-in-out"
            >
              Save
            </button>
          </div> */}
        </div>
      </section>
      <FinancialCredibilityModal
        open={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        userName={user?.firstName || user?.fullName || "User"}
        scoringResult={scoringResult}
        headerTitle={t("renterFile.resultModalTitle", "Votre résultat locataire")}
        headerSubtitle={t("renterFile.resultModalSubtitle", "Voici votre indice de crédibilité locative")}
      />
    </>
  );
};

export default RenterFile;
