import { useTranslation } from "react-i18next";

const LanguageSwitcher = ({ className = "" }) => {
  const { i18n, t } = useTranslation();
  const activeLanguage = i18n.resolvedLanguage || "en";

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem("bookaroo_language", selectedLanguage);
  };

  return (
    <div className={className}>
      <label
        htmlFor="language-select"
        className="block text-[#47525E] text-[14px] font-[600] mb-2"
      >
        {t("common.language")}
      </label>
      <select
        id="language-select"
        onChange={handleLanguageChange}
        value={activeLanguage}
        className="block w-full h-11 px-3 py-2.5 bg-white border border-[#976DD0] rounded-md text-[#47525E] text-[14px]"
      >
        <option value="en">{t("common.english")}</option>
        <option value="fr">{t("common.french")}</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;