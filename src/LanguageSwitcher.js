import { useTranslation } from "react-i18next";
import { useState } from "react";
import "./LanguageSwitcher.css";

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLanguageChange = (language) => {
        i18n.changeLanguage(language);
        setIsOpen(false);
    };

    const languages = [
        { code: 'fr', label: 'Français', flag: '🇫🇷' },
        { code: 'en', label: 'English', flag: '🇬🇧' },
    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language);

    return (
        <div className="language-switcher">
            <button
                className="lang-toggle"
                onClick={() => setIsOpen(!isOpen)}
                title="Select language"
                aria-label="Select language"
            >
                <span className="lang-flag">{currentLanguage?.flag || '🌐'}</span>
            </button>
            
            {isOpen && (
                <div className="language-dropdown">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`lang-option ${i18n.language === lang.code ? 'active' : ''}`}
                            onClick={() => handleLanguageChange(lang.code)}
                            title={lang.label}
                        >
                            <span className="lang-flag">{lang.flag}</span>
                            <span className="lang-label">{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;