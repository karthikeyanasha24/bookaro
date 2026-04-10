// // import { useTranslation } from "react-i18next";

// const LanguageSwitcher = () => {
//     const { i18n } = useTranslation();

//     const handleLanguageChange = (event) => {
//         const language = event.target.value;
//         i18n.changeLanguage(language);
//     };

//     return (
//         <div className="language-switcher">
//             <label htmlFor="language-select" className="mr-2">
//                 Language:
//             </label>
//             <select
//                 id="language-select"
//                 onChange={handleLanguageChange}
//                 defaultValue={i18n.language}
//             >
//                 <option value="en">English</option>
//                 <option value="fr">Français</option>
//             </select>
//         </div>
//     );
// };

// export default LanguageSwitcher;