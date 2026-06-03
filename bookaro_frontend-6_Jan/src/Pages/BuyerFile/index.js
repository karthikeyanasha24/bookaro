import { useEffect, useMemo, useRef, useState } from "react";
import { BsFiletypePdf } from "react-icons/bs";
import { FaCircleInfo } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { login_success } from "../../actions/user";
import PageLayout from "../../components/global/PageLayout";
import GooglePlaceAutoComplete from "../../components/common/GooglePlaceAutoComplete";
import FinancialCredibilityModal from "../../components/common/Modal/FinancialCredibilityModal";
import ApiClient from "../../methods/api/apiClient";
import { isGuestMode } from "../../methods/guestMode";
import loader from "../../methods/loader";
import { imagePath, stringSeprator } from "../../models/string.model";
import { fireOnboardingEvent } from "../../components/onboarding/onboarding.api";
import buyerQuestionnaire from "./questionnaire.config";

const buyerFileStorageKey = (userId) => `buyerFileAnswers_${userId}`;

const loadSavedBuyerAnswers = (userId) => {
  if (!userId || typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(buyerFileStorageKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveBuyerAnswers = (userId, answers) => {
  if (!userId || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(buyerFileStorageKey(userId), JSON.stringify(answers));
  } catch {
    // ignore write errors
  }
};

const BuyerFile = ({ embedded = false }) => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const isGuest = isGuestMode() || user?.isGuest || !user?.loggedIn;
  const [document, setDocument] = useState(embedded ? "document" : "declarative");
  const [submited, setsubmited] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [scoringResult, setScoringResult] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    identityProof: [],
    familySituation: [],
    addressProof: [],
    preAcceptance: [],
    salarySlips: [],
    bankStatement: [],
    taxNotice: [],
    personalContribution: [],
  });
  const [declarativeAnswers, setDeclarativeAnswers] = useState({
    BuyOption: "",
    propertyType: "",
    InvestOption: "",
    postalCode: "",
    purchasePrice: "",
    ownContribution: "",
    remainingSavings: "",
    salaryType: "",
    salaryAmount: "",
    bonusReceived: "",
    bonusType: "",
    bonusAmount: "",
    additionalIncome: "",
    additionalIncomeType: "",
    additionalIncomeAmount: "",
    creditSituation: "",
    creditType: "",
    creditMonthlyAmount: "",
    creditEntries: [],
    alimonyPayment: "",
    alimonyAmount: "",
    spouseAlimony: "",
    spouseAlimonyAmount: "",
    age: "",
    coBorrowerAge: "",
    numberChildren: "",
    livingArrangement: "",
    residenceLocation: "",
    residencePostalCode: "",
    housingSituation: "",
    employmentCategory: "",
    employmentSector: "",
    employmentContract: "",
    employmentGrade: "",
    probationStatus: "",
    monthlyNetIncome: "",
    existingLoan: "",
    existingLoanAmount: "",
    monthlyPaymentCapacity: "",
    documentsReady: "",
    preAcceptanceStatus: "",
    preAcceptanceAmount: "",
    preAcceptanceEmitter: "",
    preAcceptanceDate: "",
    preAcceptanceValidityMonths: "",
    preAcceptanceDocument: "",
  });
  const [currentRowIndex, setCurrentRowIndex] = useState(0);

  useEffect(() => {
    if (!isGuest && user?.buyerFiles) {
      setForm({
        identityProof: user.buyerFiles?.identityProof || [],
        familySituation: user.buyerFiles?.familySituation || [],
        addressProof: user.buyerFiles?.addressProof || [],
        preAcceptance: user.buyerFiles?.preAcceptance || [],
        salarySlips: user.buyerFiles?.salarySlips || [],
        bankStatement: user.buyerFiles?.bankStatement || [],
        taxNotice: user.buyerFiles?.taxNotice || [],
        personalContribution: user.buyerFiles?.personalContribution || [],
      });
    }
  }, [user?.buyerFiles, isGuest]);

  useEffect(() => {
    if (isGuest) return;

    const savedAnswers = loadSavedBuyerAnswers(user?._id || user?.id);
    if (user?.declarativeBuyerFiles && Object.keys(user.declarativeBuyerFiles).length > 0) {
      setDeclarativeAnswers({
        BuyOption: user?.declarativeBuyerFiles?.BuyOption || "",
        propertyType: user?.declarativeBuyerFiles?.propertyType || "",
        InvestOption: user?.declarativeBuyerFiles?.InvestOption || "",
        postalCode: user?.declarativeBuyerFiles?.postalCode || "",
        purchasePrice: user?.declarativeBuyerFiles?.purchasePrice || "",
        ownContribution: user?.declarativeBuyerFiles?.ownContribution || "",
        remainingSavings: user?.declarativeBuyerFiles?.remainingSavings || "",
        salaryType: user?.declarativeBuyerFiles?.salaryType || "",
        salaryAmount: user?.declarativeBuyerFiles?.salaryAmount || "",
        bonusReceived: user?.declarativeBuyerFiles?.bonusReceived || "",
        bonusType: user?.declarativeBuyerFiles?.bonusType || "",
        bonusAmount: user?.declarativeBuyerFiles?.bonusAmount || "",
        additionalIncome: user?.declarativeBuyerFiles?.additionalIncome || "",
        additionalIncomeType: user?.declarativeBuyerFiles?.additionalIncomeType || "",
        additionalIncomeAmount: user?.declarativeBuyerFiles?.additionalIncomeAmount || "",
        creditSituation: user?.declarativeBuyerFiles?.creditSituation || "",
        creditType: user?.declarativeBuyerFiles?.creditType || "",
        creditMonthlyAmount: user?.declarativeBuyerFiles?.creditMonthlyAmount || "",
        creditEntries: user?.declarativeBuyerFiles?.creditEntries || [],
        alimonyPayment: user?.declarativeBuyerFiles?.alimonyPayment || "",
        alimonyAmount: user?.declarativeBuyerFiles?.alimonyAmount || "",
        spouseAlimony: user?.declarativeBuyerFiles?.spouseAlimony || "",
        spouseAlimonyAmount: user?.declarativeBuyerFiles?.spouseAlimonyAmount || "",
        age: user?.declarativeBuyerFiles?.age || "",
        coBorrowerAge: user?.declarativeBuyerFiles?.coBorrowerAge || "",
        numberChildren: user?.declarativeBuyerFiles?.numberChildren || "",
        livingArrangement: user?.declarativeBuyerFiles?.livingArrangement || "",
        residenceLocation: user?.declarativeBuyerFiles?.residenceLocation || "",
        residencePostalCode: user?.declarativeBuyerFiles?.residencePostalCode || "",
        housingSituation: user?.declarativeBuyerFiles?.housingSituation || "",
        employmentCategory: user?.declarativeBuyerFiles?.employmentCategory || "",
        employmentSector: user?.declarativeBuyerFiles?.employmentSector || "",
        employmentContract: user?.declarativeBuyerFiles?.employmentContract || "",
        employmentGrade: user?.declarativeBuyerFiles?.employmentGrade || "",
        probationStatus: user?.declarativeBuyerFiles?.probationStatus || "",
        monthlyNetIncome: user?.declarativeBuyerFiles?.monthlyNetIncome || "",
        existingLoan: user?.declarativeBuyerFiles?.existingLoan || "",
        existingLoanAmount: user?.declarativeBuyerFiles?.existingLoanAmount || "",
        monthlyPaymentCapacity: user?.declarativeBuyerFiles?.monthlyPaymentCapacity || "",
        documentsReady: user?.declarativeBuyerFiles?.documentsReady || "",
        preAcceptanceStatus: user?.declarativeBuyerFiles?.preAcceptanceStatus || "",
        preAcceptanceAmount: user?.declarativeBuyerFiles?.preAcceptanceAmount || "",
        preAcceptanceEmitter: user?.declarativeBuyerFiles?.preAcceptanceEmitter || "",
        preAcceptanceDate: user?.declarativeBuyerFiles?.preAcceptanceDate || "",
        preAcceptanceValidityMonths: user?.declarativeBuyerFiles?.preAcceptanceValidityMonths || "",
        preAcceptanceDocument: user?.declarativeBuyerFiles?.preAcceptanceDocument || "",
      });
    } else if (savedAnswers) {
      setDeclarativeAnswers(savedAnswers);
    }
  }, [user?.declarativeBuyerFiles, user?._id, isGuest]);

  useEffect(() => {
    if (isGuest) return;
    const userId = user?._id || user?.id;
    if (!userId) return;
    saveBuyerAnswers(userId, declarativeAnswers);
  }, [declarativeAnswers, user?._id, user?.id, isGuest]);

  useEffect(() => {
    if (!isGuest) return;
    const fetchGuestBuyerFile = async () => {
      const response = await ApiClient.get("user/detail", { guest: "true" });
      if (response?.success && response.data) {
        const buyerFiles = response.data.buyerFiles || {};
        setForm((prev) => ({
          ...prev,
          identityProof: buyerFiles.identityProof || [],
          familySituation: buyerFiles.familySituation || [],
          addressProof: buyerFiles.addressProof || [],
          preAcceptance: buyerFiles.preAcceptance || [],
          salarySlips: buyerFiles.salarySlips || [],
          bankStatement: buyerFiles.bankStatement || [],
          taxNotice: buyerFiles.taxNotice || [],
          personalContribution: buyerFiles.personalContribution || [],
        }));
        setDeclarativeAnswers({
          BuyOption: "",
          propertyType: "",
          InvestOption: "",
          postalCode: "",
          purchasePrice: "",
          ownSavings: "",
          monthlyNetIncome: "",
          existingLoan: "",
          existingLoanAmount: "",
          monthlyPaymentCapacity: "",
          documentsReady: "",
          additionalIncome: "",
          additionalIncomeType: "",
          additionalIncomeAmount: "",
          creditEntries: [],
          preAcceptanceStatus: "",
          preAcceptanceAmount: "",
          preAcceptanceEmitter: "",
          preAcceptanceDate: "",
          preAcceptanceValidityMonths: "",
          preAcceptanceDocument: "",
        });
      }
    };
    fetchGuestBuyerFile();
  }, [isGuest]);

  const ImageUpload = (e, key, maxLimit = 10, maxSize = 10) => {
    if (isGuest) return;
    let files = Array.from(e.target.files);
    // validate max limit files
    if (files.length + form[key]?.length > maxLimit) {
      toast.error(t("validation.maxFiles", { max: maxLimit }));
      return (e.target.value = ""); // Clear file input
    }
    // validate max size
    const maxSizeInBytes = maxSize * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter((file) => file.size > maxSizeInBytes);
    if (oversizedFiles.length > 0) {
      toast.error(t("validation.fileSizeLimit", { size: maxSize }));
      return (e.target.value = "");
    }
    // // validate extentions
    // const acceptedTypes = ["image/jpeg", "image/png"];
    // const filteredFiles = files.filter((file) => acceptedTypes.includes(file.type));
    // let invalidFiles = files.filter((file) => !acceptedTypes.includes(file.type));
    // if (invalidFiles.length > 0 && files?.length > 1) {
    //   toast.error("Some files are not valid format and will be ignored.Only JPG and PNG images are allowed.");
    // }
    // if (filteredFiles.length !== files.length && files?.length === 1) {
    //   toast.error("Only JPG and PNG images are allowed.");
    // }
    // if (filteredFiles?.length === 0) return e.target.value = "";

    loader(true);
    ApiClient.multiImageUpload(
      "upload/multiple-images",
      files, // filteredFiles,
      {},
      "files"
    )
      .then((res) => {
        if (res.success) {
          const data = res?.files?.map((item) => {
            return {
              fileName: item?.fileName,
              originalname: item?.originalname,
            };
          });
          if (data?.length + form[key]?.length > maxLimit)
            return toast.error(t("validation.maxFiles", { max: maxLimit }));
          // setForm((prev) => ({
          //   ...prev,
          //   [key]: [...prev[key], ...data],
          // }));
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
    const url = imagePath(fileName);
    window.open(url, "_blank");
  };
  const deleteDoc = (i, key) => {
    let data = form[key]?.filter((_, ind) => ind !== i);
    // setForm((prev) => ({
    //   ...prev,
    //   [key]: data,
    // }));
    let sman = { ...form };
    sman = {
      ...sman,
      [key]: data,
    };
    setForm(sman);
    handleSubmit(sman);
  };
  const getConditionValue = (questionId) => {
    const referencedQuestion = buyerQuestionnaire.find((q) => q.id === questionId);
    if (referencedQuestion?.field) {
      return declarativeAnswers[referencedQuestion.field];
    }
    return declarativeAnswers[questionId];
  };

  const evaluateCondition = (condition) => {
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
  };

  const getVisibleQuestion = (question) => {
    if (!question.condition) return true;
    return evaluateCondition(question.condition);
  };

  const buildQuestionRows = () => {
    const rows = [];
    let currentRow = [];
    buyerQuestionnaire.forEach((question) => {
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

  const isFieldAnswered = (field, question) => {
    if (question && question.required === false) return true;
    const value = declarativeAnswers[field];
    return value !== undefined && value !== null && value !== "";
  };

  const isRowAnswered = (row) => {
    const visibleQuestions = row.filter(getVisibleQuestion);
    if (visibleQuestions.length === 0) return true;
    const questionsWithField = visibleQuestions.filter((question) => question.field);
    if (questionsWithField.length === 0) return true;
    return questionsWithField.every((question) => isFieldAnswered(question.field, question));
  };

  const questionRows = useMemo(() => buildQuestionRows(), []);

  const isQuestionnaireComplete = useMemo(() => {
    return questionRows.every((row) => {
      const visibleQuestions = row.filter(getVisibleQuestion);
      if (visibleQuestions.length === 0) return true;
      return visibleQuestions.every((question) => (question.field ? isFieldAnswered(question.field, question) : true));
    });
  }, [questionRows, declarativeAnswers]);

  const rowRefs = useRef([]);

  const visibleRowIndexes = useMemo(() => {
    return questionRows.reduce((acc, row, index) => {
      const visibleQuestions = row.filter(getVisibleQuestion);
      if (visibleQuestions.length) acc.push(index);
      return acc;
    }, []);
  }, [questionRows, declarativeAnswers]);

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
  }, [questionRows, declarativeAnswers, visibleRowIndexes]);

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
    setDeclarativeAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addCreditEntry = () => {
    setDeclarativeAnswers((prev) => ({
      ...prev,
      creditSituation: "remboursez un crédit",
      creditEntries: [
        ...(prev.creditEntries || []),
        { id: `${Date.now()}-${Math.random()}`, creditType: "", creditMonthlyAmount: "" },
      ],
    }));
  };

  const updateCreditEntry = (id, field, value) => {
    setDeclarativeAnswers((prev) => ({
      ...prev,
      creditEntries: (prev.creditEntries || []).map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  const removeCreditEntry = (id) => {
    setDeclarativeAnswers((prev) => {
      const entries = (prev.creditEntries || []).filter((entry) => entry.id !== id);
      return {
        ...prev,
        creditEntries: entries,
        creditSituation: entries.length ? prev.creditSituation : "ne remboursez pas de crédit",
      };
    });
  };

  const handleSubmit = (form, key = "document") => {
    let payload = {};
    let normalizedAnswers = declarativeAnswers;
    if (key == "declarative") {
      setsubmited(true);
      const requiredFields = ["BuyOption", "propertyType", "InvestOption", "postalCode", "purchasePrice", "preAcceptanceStatus"];
      if (normalizedAnswers.preAcceptanceStatus === "avez") {
        requiredFields.push(
          "preAcceptanceAmount",
          "preAcceptanceEmitter",
          "preAcceptanceDate",
          "preAcceptanceValidityMonths"
        );
      }
      const hasMissingRequired = requiredFields.some((field) => !isFieldAnswered(field));
      if (hasMissingRequired) {
        return;
      }
      normalizedAnswers = { ...declarativeAnswers };
      buyerQuestionnaire.forEach((question) => {
        if (question.inputType === "amount" || question.inputType === "number") {
          const rawValue = normalizedAnswers[question.field];
          normalizedAnswers[question.field] = rawValue === "" ? undefined : Number(String(rawValue).replace(/[^0-9]/g, ""));
        }
      });
      if (Array.isArray(normalizedAnswers.creditEntries)) {
        normalizedAnswers.creditEntries = normalizedAnswers.creditEntries.map((entry) => ({
          ...entry,
          creditMonthlyAmount:
            entry.creditMonthlyAmount === ""
              ? undefined
              : Number(String(entry.creditMonthlyAmount).replace(/[^0-9]/g, "")),
        }));
      }

      payload = {
        userId: user?.id || user?._id,
        declarativeBuyerFiles: normalizedAnswers,
      };
      if (form?.preAcceptance?.length) {
        payload.buyerFiles = form;
      }
    } else {
      payload = {
        userId: user?.id || user?._id,
        buyerFiles: form,
      };
    }

    loader(true);
    if (isGuest && key === "declarative") {
      ApiClient.post("score/financial", payload)
        .then((res) => {
          if (res.success) {
            setScoringResult(res.data);
            setShowScoreModal(true);
            fireOnboardingEvent('financial_score_calculated');
          } else {
            toast.error(res.message || "Unable to calculate the score.");
          }
        })
        .catch(() => {
          toast.error("Unable to calculate the score.");
        })
        .finally(() => {
          loader(false);
        });
      return;
    }

    ApiClient.put("user/editUserDetails", payload)
      .then((res) => {
        if (res.success) {
          toast.success(res?.message);
          dispatch(login_success({ buyerFiles: form, declarativeBuyerFiles: declarativeAnswers }));
          if (key === "declarative") {
            saveBuyerAnswers(user?.id || user?._id, normalizedAnswers);
          }
          if (key === "declarative" && res.scoringResult) {
            setScoringResult(res.scoringResult);
            setShowScoreModal(true);
            fireOnboardingEvent('financial_score_calculated');
          }
        }
      })
      .catch(() => {
        toast.error("Unable to save your data.");
      })
      .finally(() => {
        loader(false);
      });
  };

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

  const renderInputByType = (question) => {
    const rawValue = declarativeAnswers[question.field] ?? "";
    const value = question.inputType === "amount" ? formatAmountValue(rawValue) : rawValue;
    const disabled = false;  // guest mode temporarily enabled on this page
    const isFilled = String(rawValue).trim() !== "";

    const inputBaseClass = "rounded-md border border-[#a177d6] px-3 py-2 h-[42px] outline-none text-sm";
    const placeholderClass = "placeholder:text-[#3c3c3c] placeholder:font-extrabold";
    const unfilledTextClass = "!text-[#3c3c3c] !font-extrabold";
    const filledTextClass = isFilled ? "!text-[#976DD0] !font-extrabold" : unfilledTextClass;

    if (question.field === "postalCode" || question.field === "residencePostalCode") {
      return (
        <GooglePlaceAutoComplete
          placeholder={question.placeholder || "Renseigner ville"}
          value={value}
          id={`buyer-file-${question.field}`}
          disabled={disabled}
          className={`${inputBaseClass} ${placeholderClass} ${filledTextClass} ${question.field === "postalCode" ? "min-w-[220px] w-[280px] max-w-[320px]" : "min-w-[240px] w-[300px] max-w-[360px]"}`}
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
            className={`${inputBaseClass} bg-white ${filledTextClass} ${disabled ? "cursor-not-allowed bg-[#f3f1f8]" : ""} ${question.field === "InvestOption" ? "w-[215px] max-w-none" : question.field === "BuyOption" ? "w-[114px]" : question.field === "propertyType" ? "w-[170px]" : question.field === "livingArrangement" ? "w-[150px]" : question.field === "residenceLocation" ? "w-[150px]" : question.field === "housingSituation" ? "w-[220px] max-w-none" : question.field === "salaryType" ? "w-[200px] max-w-none" : question.field === "bonusReceived" ? "w-[210px] max-w-none" : question.field === "bonusType" ? "w-[190px] max-w-none" : question.field === "additionalIncome" ? "w-[180px]" : question.field === "creditSituation" ? "w-[260px] max-w-none" : question.field === "spouseAlimony" ? "w-[180px] max-w-none" : question.field === "creditType" ? "w-[180px]" : "w-[140px]"}`}
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
              className={`${inputBaseClass} ${placeholderClass} ${filledTextClass} w-[120px] ${disabled ? "bg-[#f3f1f8]" : ""}`}
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
            className={`${inputBaseClass} ${placeholderClass} ${filledTextClass} ${question.field === "age" || question.field === "coBorrowerAge" ? "w-[100px]" : question.field === "numberChildren" ? "w-[100px]" : question.field === "salaryAmount" ? "w-[140px]" : question.field === "bonusAmount" ? "w-[140px]" : question.field === "additionalIncomeAmount" ? "w-[140px]" : question.field === "creditMonthlyAmount" ? "w-[140px]" : "w-[120px]"} ${disabled ? "bg-[#f3f1f8]" : ""}`}
            onChange={(e) => handleAnswer(question.field, e.target.value)}
          />
        );
      case "file":
        if (isGuest) {
          return <span className="text-[#999] text-[14px]">Lecture seule</span>;
        }
        return (
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <span className="rounded-md border border-[#a177d6] bg-white px-3 py-2 text-sm text-[#976DD0]">
              {value ? "Modifier le document" : "Téléverser un document"}
            </span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  ImageUpload(e, "preAcceptance", 1);
                  handleAnswer(question.field, e.target.files[0].name || "document");
                }
              }}
            />
          </label>
        );
      default:
        return (
          <input
            type="text"
            value={value}
            disabled={disabled}
            placeholder={question.placeholder || "Réponse"}
            className={`${inputBaseClass} ${placeholderClass} ${filledTextClass} w-[140px] ${disabled ? "bg-[#f3f1f8]" : ""}`}
            onChange={(e) => handleAnswer(question.field, e.target.value)}
          />
        );
    }
  };

  const findFirstVisibleUnansweredRowIndex = () => {
    for (let i = 0; i < questionRows.length; i++) {
      const row = questionRows[i];
      const visibleQuestions = row.filter(getVisibleQuestion);
      if (!visibleQuestions.length) continue;
      if (!visibleQuestions.every((question) => isFieldAnswered(question.field, question))) {
        return i;
      }
    }
    return questionRows.findIndex((row) => row.some(getVisibleQuestion));
  };

  useEffect(() => {
    const visibleQuestions = questionRows[currentRowIndex]?.filter(getVisibleQuestion);
    if (!visibleQuestions || visibleQuestions.length === 0) {
      setCurrentRowIndex(findFirstVisibleUnansweredRowIndex());
    }
  }, [currentRowIndex, questionRows, declarativeAnswers]);

  const getPreviousRowIndex = () => {
    for (let i = currentRowIndex - 1; i >= 0; i--) {
      const visibleQuestions = questionRows[i].filter(getVisibleQuestion);
      if (visibleQuestions.length && visibleQuestions.every((question) => isFieldAnswered(question.field, question))) {
        return i;
      }
    }
    return -1;
  };

  const getNextRowIndex = () => {
    if (!isRowAnswered(questionRows[currentRowIndex])) return -1;
    for (let i = currentRowIndex + 1; i < questionRows.length; i++) {
      const visibleQuestions = questionRows[i].filter(getVisibleQuestion);
      if (visibleQuestions.length) {
        return i;
      }
    }
    return -1;
  };

  const renderPersonalSituationRow = (row, rowIndex) => {
    const visibleQuestions = row.filter(getVisibleQuestion);
    const q6 = visibleQuestions.find((q) => q.id === "Q6");
    const q7 = visibleQuestions.find((q) => q.id === "Q7");
    const q8 = visibleQuestions.find((q) => q.id === "Q8");
    const q9 = visibleQuestions.find((q) => q.id === "Q9");
    const q10 = visibleQuestions.find((q) => q.id === "Q10");
    const q11 = visibleQuestions.find((q) => q.id === "Q11");
    const q12 = visibleQuestions.find((q) => q.id === "Q12");
    const isAtTwo = declarativeAnswers.BuyOption === "à deux";
    return (
      <div
        ref={(el) => (rowRefs.current[rowIndex] = el)}
        key={rowIndex}
        className="w-full rounded-[10px] bg-white p-4 transition-all duration-300 ease-out"
      >
        <p className="text-[#4b3869] text-[15px] leading-[19px]">
          Vous avez{' '}
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            {q6 && renderInputByType(q6)} ans
          </span>
          {q7 ? (
            <> et le co-emprunteur a{' '}
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                {renderInputByType(q7)} ans
              </span>
              .</>
          ) : (
            <>.</>
          )}
          {' '}Vous avez{' '}
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            {q8 && renderInputByType(q8)} enfants
          </span>
          {isAtTwo && q9 ? (
            <> et vous{' '}
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                {renderInputByType(q9)} ensemble
              </span>
              .</>
          ) : (
            <>.</>
          )}
          {' '}Vous vivez{' '}
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            {q10 && renderInputByType(q10)}
          </span>
          {' '}à{' '}
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            {q11 && renderInputByType(q11)}
          </span>
          {' '}et vous êtes{' '}
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            {q12 && renderInputByType(q12)}
          </span>
          .
        </p>
      </div>
    );
  };

  const renderProfessionalSituationRow = (row, rowIndex) => {
    const visibleQuestions = row.filter(getVisibleQuestion);
    const q13 = visibleQuestions.find((q) => q.id === "Q13");
    const q14 = visibleQuestions.find((q) => q.id === "Q14");
    const q15 = visibleQuestions.find((q) => q.id === "Q15");
    const q16 = visibleQuestions.find((q) => q.id === "Q16");
    const q17 = visibleQuestions.find((q) => q.id === "Q17");
    const isSalaried = declarativeAnswers.employmentCategory === "Salarié";
    return (
      <div
        ref={(el) => (rowRefs.current[rowIndex] = el)}
        key={rowIndex}
        className="w-full rounded-[10px] bg-white p-4 transition-all duration-300 ease-out"
      >
        <p className="text-[#4b3869] text-[15px] leading-[19px]">
          Vous êtes{' '}
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            {q13 && renderInputByType(q13)}
          </span>
          {isSalaried && q14 ? (
            <>
              {' '}et vous êtes employé{' '}
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                {renderInputByType(q14)}
              </span>
              {' '}en{' '}
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                {q15 && renderInputByType(q15)}
              </span>
              {' '}avec le statut{' '}
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                {q16 && renderInputByType(q16)}
              </span>
              {' '}en{' '}
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                {q17 && renderInputByType(q17)}
              </span>
              .
            </>
          ) : (
            <>.</>
          )}
        </p>
      </div>
    );
  };

  const renderAdditionalIncomeRow = (row, rowIndex) => {
    const visibleQuestions = row.filter(getVisibleQuestion);
    const q23 = visibleQuestions.find((q) => q.id === "Q23");
    const q24 = visibleQuestions.find((q) => q.id === "Q24");
    const q24a = visibleQuestions.find((q) => q.id === "Q24a");
    const hasAdditionalIncome = declarativeAnswers.additionalIncome === "percevez des";
    return (
      <div
        ref={(el) => (rowRefs.current[rowIndex] = el)}
        key={rowIndex}
        className="w-full rounded-[10px] bg-white p-4 transition-all duration-300 ease-out"
      >
        <p className="text-[#4b3869] text-[15px] leading-[19px]">
          Vous{' '}
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            {q23 && renderInputByType(q23)}
          </span>
          {' '}revenus additionnels
          {hasAdditionalIncome && q24 ? (
            <>
              {' '}
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                {renderInputByType(q24)}
              </span>
              {' '}de{' '}
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                {q24a && renderInputByType(q24a)}
              </span>
              .
            </>
          ) : (
            <>.</>
          )}
        </p>
      </div>
    );
  };

  const renderCreditRow = (row, rowIndex) => {
    const visibleQuestions = row.filter(getVisibleQuestion);
    const q25 = visibleQuestions.find((q) => q.id === "Q25");
    const q26 = visibleQuestions.find((q) => q.id === "Q26");
    const q27 = visibleQuestions.find((q) => q.id === "Q27");
    const creditEntries = declarativeAnswers.creditEntries || [];
    const hasCredit = declarativeAnswers.creditSituation === "remboursez un crédit";

    return (
      <div
        ref={(el) => (rowRefs.current[rowIndex] = el)}
        key={rowIndex}
        className="w-full space-y-4"
      >
        <div className="rounded-[10px] bg-white p-4 transition-all duration-300 ease-out">
          <p className="text-[#4b3869] text-[15px] leading-[19px]">
            Vous{' '}
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              {q25 && renderInputByType(q25)}
            </span>
            {hasCredit && q26 ? (
              <>
                {' '}de type crédit{' '}
                <span className="inline-flex items-center gap-2 whitespace-nowrap">
                  {q26 && renderInputByType(q26)}
                </span>
                {' '}d'un montant mensuel de{' '}
                <span className="inline-flex items-center gap-2 whitespace-nowrap">
                  {q27 && renderInputByType(q27)}
                </span>
                .
              </>
            ) : (
              <>.</>
            )}
          </p>
        </div>

        {creditEntries.length > 0 && (
          <div className="space-y-3">
            {creditEntries.map((entry) => (
              <div key={entry.id} className="rounded-[10px] border border-[#d8d0e9] bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[#4b3869] text-[15px] leading-[19px]">
                    Vous remboursez un crédit de type{' '}
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      <select
                        value={entry.creditType}
                        onChange={(e) => updateCreditEntry(entry.id, "creditType", e.target.value)}
                        className="rounded-md border border-[#a177d6] px-3 py-2 h-[42px] outline-none text-sm w-[170px]"
                      >
                        <option value="" className="text-[#3c3c3c] font-extrabold">Sélectionner</option>
                        {q26?.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </span>
                    {' '}d'un montant mensuel de{' '}
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={entry.creditMonthlyAmount}
                        onChange={(e) => updateCreditEntry(entry.id, "creditMonthlyAmount", parseAmountValue(e.target.value))}
                        placeholder="Montant"
                        className="rounded-md border border-[#a177d6] px-3 py-2 h-[42px] outline-none text-sm w-[120px]"
                      />
                      <span className="text-[#4b3869]">€</span>
                    </span>
                    .
                  </p>
                  <button
                    type="button"
                    onClick={() => removeCreditEntry(entry.id)}
                    className="self-start rounded-full border border-[#d6d3e8] bg-[#fff4f8] px-4 py-2 text-sm font-semibold text-[#a3496e] transition duration-200 hover:bg-[#f2dce8] sm:self-center"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAlimonyRow = (row, rowIndex) => {
    const visibleQuestions = row.filter(getVisibleQuestion);
    const q28 = visibleQuestions.find((q) => q.id === "Q28");
    const q29 = visibleQuestions.find((q) => q.id === "Q29");
    const q30 = visibleQuestions.find((q) => q.id === "Q30");
    const q31 = visibleQuestions.find((q) => q.id === "Q31");
    const paysAlimony = declarativeAnswers.alimonyPayment === "versez";
    const spousePaysAlimony = declarativeAnswers.spouseAlimony === "verse";
    const showSpouseSection = declarativeAnswers.BuyOption === "à deux";
    return (
      <div
        ref={(el) => (rowRefs.current[rowIndex] = el)}
        key={rowIndex}
        className="w-full rounded-[10px] bg-white p-4 transition-all duration-300 ease-out"
      >
        <p className="text-[#4b3869] text-[15px] leading-[19px]">
          Vous{' '}
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            {q28 && renderInputByType(q28)}
          </span>
          {' '}
          {paysAlimony ? (
            <>
              une pension alimentaire d'un montant de{' '}
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                {q29 && renderInputByType(q29)}
              </span>
            </>
          ) : (
            <>de pension alimentaire</>
          )}
          {showSpouseSection && q30 ? (
            <>
              {' '}et votre conjoint{' '}
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                {renderInputByType(q30)}
              </span>
              {' '}
              {spousePaysAlimony ? (
                <>
                  une pension alimentaire d'un montant de{' '}
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    {q31 && renderInputByType(q31)}
                  </span>
                </>
              ) : (
                <>de pension alimentaire</>
              )}
            </>
          ) : null}
          .
        </p>
      </div>
    );
  };

  const renderSalaryIncomeRow = (row, rowIndex) => {
    const visibleQuestions = row.filter(getVisibleQuestion);
    const q18 = visibleQuestions.find((q) => q.id === "Q18");
    const q19 = visibleQuestions.find((q) => q.id === "Q19");
    const q20 = visibleQuestions.find((q) => q.id === "Q20");
    const q21 = visibleQuestions.find((q) => q.id === "Q21");
    const q22 = visibleQuestions.find((q) => q.id === "Q22");
    const hasBonuses = declarativeAnswers.bonusReceived === "percevez des primes";
    return (
      <div
        ref={(el) => (rowRefs.current[rowIndex] = el)}
        key={rowIndex}
        className="w-full rounded-[10px] bg-white p-4 transition-all duration-300 ease-out"
      >
        <p className="text-[#4b3869] text-[15px] leading-[19px]">
          Vous percevez un salaire fixe{' '}
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            {q18 && renderInputByType(q18)}
          </span>
          {' '}de{' '}
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            {q19 && renderInputByType(q19)}
          </span>
          {' '}et vous{' '}
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            {q20 && renderInputByType(q20)}
          </span>
          {hasBonuses && q21 ? (
            <>
              {' '}
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                {renderInputByType(q21)}
              </span>
              {' '}de{' '}
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                {q22 && renderInputByType(q22)}
              </span>
              .
            </>
          ) : (
            <>.</>
          )}
        </p>
      </div>
    );
  };

  const renderQuestionRow = (row, rowIndex) => {
    const visibleQuestions = row.filter(getVisibleQuestion);
    if (!visibleQuestions.length) return null;
    if (visibleQuestions.length === 1 && visibleQuestions[0].type === "title") {
      const isChargesTitle = visibleQuestions[0].id === "S4";
      return (
        <div
          key={rowIndex}
          ref={(el) => (rowRefs.current[rowIndex] = el)}
          className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <h2 className="text-[#47525E] font-bold text-[18px] mb-5 sm:mb-0">
            {visibleQuestions[0].text}
          </h2>
          {isChargesTitle && (
            <button
              type="button"
              onClick={addCreditEntry}
              className="inline-flex items-center justify-center rounded-full border border-[#a177d6] bg-white px-4 py-2 text-sm font-semibold text-[#4b3869] transition duration-200 hover:bg-[#f3ebf9]"
            >
              Ajouter un crédit
            </button>
          )}
        </div>
      );
    }
    if (visibleQuestions.some((question) => question.field === "age") && visibleQuestions.some((question) => question.field === "housingSituation")) {
      return renderPersonalSituationRow(row, rowIndex);
    }
    if (visibleQuestions.some((question) => question.field === "employmentCategory")) {
      return renderProfessionalSituationRow(row, rowIndex);
    }
    if (visibleQuestions.some((question) => question.field === "additionalIncome")) {
      return renderAdditionalIncomeRow(row, rowIndex);
    }
    if (visibleQuestions.some((question) => question.field === "creditSituation")) {
      return renderCreditRow(row, rowIndex);
    }
    if (visibleQuestions.some((question) => question.field === "alimonyPayment")) {
      return renderAlimonyRow(row, rowIndex);
    }
    if (visibleQuestions.some((question) => question.field === "salaryType")) {
      return renderSalaryIncomeRow(row, rowIndex);
    }
    const missingRequired = submited && visibleQuestions.some((question) => question.required && !isFieldAnswered(question.field));
    const rowClass = "flex flex-wrap items-center gap-3 rounded-[10px] bg-white p-4 transition-all duration-300 ease-out";
    const itemClass = "flex items-center gap-2";
    const textClass = "text-[#4b3869] text-[15px] whitespace-nowrap";

    return (
      <div
        ref={(el) => (rowRefs.current[rowIndex] = el)}
        key={rowIndex}
        className={rowClass}
      >
        {visibleQuestions.map((question) => (
          <div key={question.id} className={itemClass}>
            <span className={textClass}>{question.text}</span>
            {renderInputByType(question)}
            {question.suffixText && (
              <span className={textClass}>{question.suffixText}</span>
            )}
          </div>
        ))}
        {missingRequired && (
          <div className="w-full text-sm text-red-600 mt-2">
            Merci de répondre aux champs obligatoires de cette ligne.
          </div>
        )}
      </div>
    );
  };

  const buyerFileContent = (
      <section className={`${embedded ? "pt-0 pb-0" : "pt-14 lg:pt-16 pb-[100px]"}  bg-[#f3f5f9] relative`}>
        <div className={`${embedded ? "px-0" : "container   px-8 mx-auto xl:px-10"}  h-full `}>
          {!embedded && (
          <div className="w-full ">
            <div>
              <h4 className="text-[#47525E] text-center mb-0 text-[17px]">
                {t("project.buyerFile")}
              </h4>
              <h2 className="text-[#47525E] font-[600] text-[24px] mt-1 text-center">
                {t("buyerFile.saveTimeFindHome")}
              </h2>
              {isGuest && (
                <div className="flex justify-center mt-4">
                  <span className="dashboard-section-mock-badge inline-flex items-center justify-center px-3 py-1 rounded-full text-[12px] font-semibold text-[#7c4b00] bg-[#fff4dd] shadow-[0_4px_12px_rgba(249,179,71,0.18)] border border-[rgba(249,179,71,0.35)]">
                    Données fictives
                  </span>
                </div>
              )}
              {(document === "document" || document === "declarative") && (
                <div className="max-w-2xl mx-auto bg-[#976dd0b5] p-5 rounded-[12px] flex mt-7">
                  <p className=" text-white w-[90%]">
                    {document === "document"
                      ? "Aucun de ces documents ne sera partagé publiquement ni accessible par un tiers. Vous pourrez partager certains documents de votre choix avec nos courtiers partenaires et les propriétaires des biens que vous ciblez pour renforcer votre crédibilité."
                      : "Remplissez ce questionnaire pour obtenir un avis et un score sur la faisabilité de votre projet. Ce score vous donnera accès à des opportunités Off-market et sera présenté aux vendeurs pour renforcer votre crédibilité."}
                  </p>
                  <FaCircleInfo className="w-[50px] text-[35px] ms-5" />
                </div>
              )}
            </div>
          </div>
          )}
          {/* tabs */}
          <div className={`${embedded ? "bg-transparent p-0" : "bg-[#f3ebf9] p-4 md:p-10"} `}>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Sidebar */}
              {!embedded && (
              <div className="flex md:flex-col gap-4  md:w-[220px] ">
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
              )}

              {/* Right Content */}
              <div className="flex-1 space-y-8 md:border-[#a177d6] md:border-l-[5px] md:ps-6">
                {document === "document" && (
                  <>
                    <div>
                      <h2 className="text-[#000000] font-[600] text-[22px] mb-5">
                        {t("buyerFile.personalInformation")}
                      </h2>
                      <div className="grid grid-cols-12 md:gap-10 gap-0">
                        <div className="2xl:col-span-3 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("buyerFile.proofOfIdentity")}
                            </h4>
                            <p className="text-[#47525E] my-2 text-[13px]">
                              {t("buyerFile.identityProofDescription")}
                            </p>
                            <p className="text-[#47525E] italic text-[13px] h-[36px]">
                              {t("buyerFile.identityProofExamples")}
                            </p>
                          </div>
                          {form?.identityProof?.length > 0 &&
                            form?.identityProof?.map((itm, i) => (
                              <div className="p-5 flex justify-between md:flex-row flex-col md:items-center items-start">
                                <div className="flex items-center">
                                  <BsFiletypePdf className="text-[24px] me-3" />
                                  <span className="text-[#383A3D] text-[12px]">
                                    {stringSeprator(itm.originalname, 30)}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  {isGuest ? (
                                    <span className="text-[#999] text-[14px]">
                                      Lecture seule
                                    </span>
                                  ) : (
                                    <>
                                      <p
                                        onClick={() => viewDoc(itm.fileName)}
                                        className="cursor-pointer text-[#383A3D] text-[14px]"
                                      >
                                        {t("buttons.preview")}
                                      </p>
                                      <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                                        {/* Edit */}
                                      </p>
                                      <p
                                        onClick={() =>
                                          deleteDoc(i, "identityProof")
                                        }
                                        className="cursor-pointer text-[#383A3D] text-[14px]"
                                      >
                                        {t("common.delete")}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          {form?.identityProof?.length < 1 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full cursor-pointer">
                                <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold  absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5 pointer">
                                  {t("buyerFile.uploadDocument")}
                                </p>
                                <input
                                  type="file"
                                  name="file"                                    disabled={false}                                  className="opacity-0 w-full h-[64px] cursor-pointer"
                                  // multiple
                                  onChange={(e) =>
                                    ImageUpload(e, "identityProof", 1)
                                  }
                                />
                              </label>
                            </div>
                          )}
                        </div>

                        <div className="2xl:col-span-3 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("buyerFile.proofOfFamilySituation")}
                            </h4>
                            <p className="text-[#47525E] my-2 text-[13px]">
                              {t("buyerFile.familySituationDescription")}
                            </p>
                            <p className="text-[#47525E] italic text-[13px] h-[36px]">
                              {t("buyerFile.familySituationExamples")}
                            </p>
                          </div>
                          {form?.familySituation?.length > 0 &&
                            form?.familySituation?.map((itm, i) => (
                              <div className="p-5 flex justify-between md:flex-row flex-col md:items-center items-start">
                                <div className="flex items-center">
                                  <BsFiletypePdf className="text-[24px] me-3 text-[#ff0000]" />
                                  <span className="text-[#383A3D] text-[12px]">
                                    {stringSeprator(itm.originalname, 30)}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  {isGuest ? (
                                    <span className="text-[#999] text-[14px]">
                                      Lecture seule
                                    </span>
                                  ) : (
                                    <>
                                      <p
                                        onClick={() => viewDoc(itm.fileName)}
                                        className="cursor-pointer text-[#383A3D] text-[14px]"
                                      >
                                        {t("buttons.preview")}
                                      </p>
                                      <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                                        {/* Edit */}
                                      </p>
                                      <p
                                        onClick={() =>
                                          deleteDoc(i, "familySituation")
                                        }
                                        className="cursor-pointer text-[#383A3D] text-[14px]"
                                      >
                                        {t("common.delete")}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          {form?.familySituation?.length < 1 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full group">
                                <p className="text-[#976DD0]  text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5 border-b border-transparent group-hover:border-[#976DD0]">
                                  {t("buyerFile.uploadDocument")}
                                </p>
                                <input
                                  type="file"
                                  name="file"
                                  disabled={false}
                                  className="opacity-0 w-full h-[64px] cursor-pointer"
                                  // multiple
                                  onChange={(e) =>
                                    ImageUpload(e, "familySituation", 1)
                                  }
                                />
                              </label>
                            </div>
                          )}
                        </div>

                        <div className="2xl:col-span-3 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("buyerFile.proofOfCurrentAddress")}
                            </h4>
                            <p className="text-[#47525E] my-2 text-[13px]">
                              {t("buyerFile.addressProofDescription")}
                            </p>
                            <p className="text-[#47525E] italic text-[13px] h-[36px]">
                              {t("buyerFile.addressProofExamples")}
                            </p>
                          </div>
                          {form?.addressProof?.length > 0 &&
                            form?.addressProof?.map((itm, i) => (
                              <div className="p-5 flex justify-between md:flex-row flex-col md:items-center items-start">
                                <div className="flex items-center">
                                  <BsFiletypePdf className="text-[24px] me-3" />
                                  <span className="text-[#383A3D] text-[12px]">
                                    {stringSeprator(itm.originalname, 30)}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  {isGuest ? (
                                    <span className="text-[#999] text-[14px]">
                                      Lecture seule
                                    </span>
                                  ) : (
                                    <>
                                      <p
                                        onClick={() => viewDoc(itm.fileName)}
                                        className="cursor-pointer text-[#383A3D] text-[14px]"
                                      >
                                        {t("buttons.preview")}
                                      </p>
                                      <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                                        {/* Edit */}
                                      </p>
                                      <p
                                        onClick={() => deleteDoc(i, "addressProof")}
                                        className="cursor-pointer text-[#383A3D] text-[14px]"
                                      >
                                        {t("common.delete")}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          {form?.addressProof?.length < 1 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full">
                                <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                  {t("buyerFile.uploadDocument")}
                                </p>
                                <input
                                  type="file"
                                  name="file"
                                  disabled={false}
                                  className="opacity-0 w-full h-[64px]"
                                  // multiple
                                  onChange={(e) =>
                                    ImageUpload(e, "addressProof", 1)
                                  }
                                />
                              </label>
                            </div>
                          )}
                        </div>

                        <div className="2xl:col-span-3 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              Pré-acceptation ou accord de principe
                            </h4>
                            <p className="text-[#47525E] my-2 text-[13px]">
                              Permet de démontrer le sérieux de votre projet auprès du vendeur et augmenter vos chances d'obtenir le bien.
                            </p>
                            <p className="text-[#47525E] italic text-[13px] h-[36px]">
                              Ce document peut etre émis par un courtier en crédit immobilier ou votre banque.
                            </p>
                          </div>
                          {form?.preAcceptance?.length > 0 &&
                            form?.preAcceptance?.map((itm, i) => (
                              <div className="p-5 flex justify-between md:flex-row flex-col md:items-center items-start">
                                <div className="flex items-center">
                                  <BsFiletypePdf className="text-[24px] me-3" />
                                  <span className="text-[#383A3D] text-[12px]">
                                    {stringSeprator(itm.originalname, 30)}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  {isGuest ? (
                                    <span className="text-[#999] text-[14px]">
                                      Lecture seule
                                    </span>
                                  ) : (
                                    <>
                                      <p
                                        onClick={() => viewDoc(itm.fileName)}
                                        className="cursor-pointer text-[#383A3D] text-[14px]"
                                      >
                                        {t("buttons.preview")}
                                      </p>
                                      <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                                        {/* Edit */}
                                      </p>
                                      <p
                                        onClick={() => deleteDoc(i, "preAcceptance")}
                                        className="cursor-pointer text-[#383A3D] text-[14px]"
                                      >
                                        {t("common.delete")}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          {!isGuest && form?.preAcceptance?.length < 1 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full">
                                <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                  {t("buyerFile.uploadDocument")}
                                </p>
                                <input
                                  type="file"
                                  name="file"
                                  disabled={false}
                                  className="opacity-0 w-full h-[64px]"
                                  onChange={(e) =>
                                    ImageUpload(e, "preAcceptance", 1)
                                  }
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-[#000000] font-[600] text-[22px] mt-10">
                        {t("buyerFile.resourcesAndIncome")}
                      </h2>
                      <p className="text-black mb-5 text-[12px] max-w-2xl">
                        {t("buyerFile.resourcesAndIncomeDescription")}
                      </p>

                      <h3 className="text-black underline font-semibold mb-5">
                        {t("buyerFile.yourFinancialSituation")}
                      </h3>
                      <div className="grid grid-cols-12 md:gap-10 gap-0">
                        <div className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("buyerFile.lastThreeSalarySlips")}
                            </h4>
                          </div>
                          {form?.salarySlips?.length > 0 && (
                            <ul className="p-5">
                              {form?.salarySlips?.map((itm, i) => (
                                <li className="mb-3 ">
                                  <div className=" flex justify-between md:flex-row flex-col md:items-center items-start md:mb-0 mb-5">
                                    <div className="flex items-center">
                                      <BsFiletypePdf className="text-[24px] me-3 text-[#ff0000]" />
                                      <span className="text-[#383A3D] text-[12px]">
                                        {stringSeprator(itm.originalname, 30)}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                  {isGuest ? (
                                    <span className="text-[#999] text-[14px]">
                                      Lecture seule
                                    </span>
                                  ) : (
                                    <>
                                      <p
                                        onClick={() => viewDoc(itm.fileName)}
                                        className="cursor-pointer text-[#383A3D] text-[14px]"
                                      >
                                        {t("buttons.preview")}
                                      </p>
                                      <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                                        {/* Edit */}
                                      </p>
                                      <p
                                        onClick={() =>
                                          deleteDoc(i, "salarySlips")
                                        }
                                        className="cursor-pointer text-[#383A3D] text-[14px]"
                                      >
                                        {t("common.delete")}
                                      </p>
                                    </>
                                  )}
                                </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                          {form?.salarySlips?.length < 3 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full">
                                <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                  {t("buyerFile.uploadDocument")}
                                </p>
                                <input
                                  type="file"
                                  name="file"
                                  disabled={false}
                                  className="opacity-0 w-full h-[64px]"
                                  multiple
                                  onChange={(e) =>
                                    ImageUpload(e, "salarySlips", 3)
                                  }
                                />
                              </label>
                            </div>
                          )}
                        </div>
                        <div className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("buyerFile.lastThreeBankStatements")}
                            </h4>
                          </div>
                          {form?.bankStatement?.length > 0 && (
                            <ul className="p-5">
                              {form?.bankStatement?.map((itm, i) => (
                                <li className="mb-3 ">
                                  <div className=" flex justify-between md:flex-row flex-col md:items-center items-start md:mb-0 mb-5">
                                    <div className="flex items-center">
                                      <BsFiletypePdf className="text-[24px] me-3 text-[#ff0000]" />
                                      <span className="text-[#383A3D] text-[12px]">
                                        {stringSeprator(itm.originalname, 30)}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                  {isGuest ? (
                                    <span className="text-[#999] text-[14px]">
                                      Lecture seule
                                    </span>
                                  ) : (
                                    <>
                                      <p
                                        onClick={() => viewDoc(itm.fileName)}
                                        className="cursor-pointer text-[#383A3D] text-[14px]"
                                      >
                                        {t("buttons.preview")}
                                      </p>
                                      <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                                        {/* Edit */}
                                      </p>
                                      <p
                                        onClick={() =>
                                          deleteDoc(i, "bankStatement")
                                        }
                                        className="cursor-pointer text-[#383A3D] text-[14px]"
                                      >
                                        {t("common.delete")}
                                      </p>
                                    </>
                                  )}
                                </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                          {form?.bankStatement?.length < 3 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full">
                                <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                  {t("buyerFile.uploadDocument")}
                                </p>
                                <input
                                  type="file"
                                  name="file"
                                  disabled={false}
                                  className="opacity-0 w-full h-[64px]"
                                  multiple
                                  onChange={(e) =>
                                    ImageUpload(e, "bankStatement", 3)
                                  }
                                />
                              </label>
                            </div>
                          )}
                        </div>
                        <div className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("buyerFile.lastTwoTaxNotices")}
                            </h4>
                          </div>
                          {form?.taxNotice?.length > 0 && (
                            <ul className="p-5">
                              {form?.taxNotice?.map((itm, i) => (
                                <li className="mb-3 ">
                                  <div className=" flex justify-between md:flex-row flex-col md:items-center items-start md:mb-0 mb-5">
                                    <div className="flex items-center">
                                      <BsFiletypePdf className="text-[24px] me-3 text-[#ff0000]" />
                                      <span className="text-[#383A3D] text-[12px]">
                                        {stringSeprator(itm.originalname, 30)}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                  {isGuest ? (
                                    <span className="text-[#999] text-[14px]">
                                      Lecture seule
                                    </span>
                                  ) : (
                                    <>
                                      <p
                                        onClick={() => viewDoc(itm.fileName)}
                                        className="cursor-pointer text-[#383A3D] text-[14px]"
                                      >
                                        {t("buttons.preview")}
                                      </p>
                                      <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                                        {/* Edit */}
                                      </p>
                                      <p
                                        onClick={() =>
                                          deleteDoc(i, "taxNotice")
                                        }
                                        className="cursor-pointer text-[#383A3D] text-[14px]"
                                      >
                                        {t("common.delete")}
                                      </p>
                                    </>
                                  )}
                                </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                          {form?.taxNotice?.length < 2 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full">
                                <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                  {t("buyerFile.uploadDocument")}
                                </p>
                                <input
                                  type="file"
                                  name="file"
                                  disabled={false}
                                  className="opacity-0 w-full h-[64px]"
                                  multiple
                                  onChange={(e) =>
                                    ImageUpload(e, "taxNotice", 2)
                                  }
                                />
                              </label>
                            </div>
                          )}
                        </div>
                        <div className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("buyerFile.personalContribution")}
                            </h4>
                            <p className="text-[#47525E] mt-2 text-[12px]">
                              {t("buyerFile.personalContributionDescription")}
                            </p>
                          </div>
                          {form?.personalContribution?.length > 0 && (
                            <ul className="p-5">
                              {form?.personalContribution?.map((itm, i) => (
                                <li className="mb-3 ">
                                  <div className=" flex justify-between md:flex-row flex-col md:items-center items-start md:mb-0 mb-5">
                                    <div className="flex items-center">
                                      <BsFiletypePdf className="text-[24px] me-3 text-[#ff0000]" />
                                      <span className="text-[#383A3D] text-[12px]">
                                        {stringSeprator(itm.originalname, 30)}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                  {isGuest ? (
                                    <span className="text-[#999] text-[14px]">
                                      Lecture seule
                                    </span>
                                  ) : (
                                    <>
                                      <p
                                        onClick={() => viewDoc(itm.fileName)}
                                        className="cursor-pointer text-[#383A3D] text-[14px]"
                                      >
                                        {t("buttons.preview")}
                                      </p>
                                      <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                                        {/* Edit */}
                                      </p>
                                      <p
                                        onClick={() =>
                                          deleteDoc(i, "personalContribution")
                                        }
                                        className="cursor-pointer text-[#383A3D] text-[14px]"
                                      >
                                        {t("common.delete")}
                                      </p>
                                    </>
                                  )}
                                </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                          {!isGuest && form?.personalContribution?.length < 10 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full">
                                <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                  {t("buyerFile.uploadDocument")}
                                </p>
                                <input
                                  type="file"
                                  name="file"
                                  disabled={false}
                                  className="opacity-0 w-full h-[64px]"
                                  multiple
                                  onChange={(e) =>
                                    ImageUpload(e, "personalContribution", 10)
                                  }
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {!embedded && document === "declarative" && (
                  <>
                    <div className="mb-4">
                      <h3 className="text-[#4b3869] font-bold text-[18px]">Votre projet</h3>
                    </div>
                    <div className="max-h-[55vh] overflow-y-auto pr-2 space-y-5">
                      {displayedRowIndexes.map((rowIndex) => renderQuestionRow(questionRows[rowIndex], rowIndex))}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => handleSubmit(form, "declarative")}
                        disabled={!isQuestionnaireComplete}
                        className={`rounded-[100px] px-14 py-3 text-white border border-transparent transition duration-300 ease-in-out ${isQuestionnaireComplete ? "bg-[#976DD0] hover:bg-[#8750be]" : "bg-[#48464a] cursor-not-allowed"}`}
                      >
                        {isQuestionnaireComplete ? "Voir le résultat" : t("common.saveDraft")}
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
  );

  const scoreModal = (
      <FinancialCredibilityModal
        open={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        userName={user?.firstName || user?.fullName || "User"}
        scoringResult={scoringResult}
      />
  );

  if (embedded) {
    return (
      <>
        {buyerFileContent}
        {scoreModal}
      </>
    );
  }

  return (
    <PageLayout>
      {buyerFileContent}
      {scoreModal}
    </PageLayout>
  );
};

export default BuyerFile;
