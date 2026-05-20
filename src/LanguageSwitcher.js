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

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
    const otherLanguage = languages.find(lang => lang.code !== currentLanguage.code);
    const hasTwoLanguages = languages.length === 2;

    const handleToggle = () => {
        if (hasTwoLanguages && otherLanguage) {
            handleLanguageChange(otherLanguage.code);
            return;
        }
        setIsOpen((prev) => !prev);
    };

    return (
        <div className="language-switcher">
            <button
                className="lang-toggle"
                onClick={handleToggle}
                title={hasTwoLanguages ? `Passer en ${otherLanguage?.label || 'langue'}` : 'Select language'}
                aria-label={hasTwoLanguages ? `Switch to ${otherLanguage?.label || 'other language'}` : 'Select language'}
            >
                <span className="lang-code">{currentLanguage?.code?.toUpperCase() || 'FR'}</span>
            </button>
            
            {isOpen && !hasTwoLanguages && (
                <div className="language-dropdown">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`lang-option ${i18n.language === lang.code ? 'active' : ''}`}
                            onClick={() => handleLanguageChange(lang.code)}
                            title={lang.label}
                        >
                            <span className="lang-code">{lang.code.toUpperCase()}</span>
                            <span className="lang-label">{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;