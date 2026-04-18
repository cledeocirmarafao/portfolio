import { useTranslation } from "react-i18next";

export const LanguageToggle = ({ className = "" }: { className?: string }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={() => i18n.changeLanguage("pt")}
        className={`text-sm font-medium transition-colors cursor-pointer ${
          currentLang === "pt"
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <span>🇧🇷 PT</span>
      </button>
      <span className="text-muted-foreground">/</span>
      <button
        onClick={() => i18n.changeLanguage("en")}
        className={`text-sm font-medium transition-colors cursor-pointer ${
          currentLang === "en"
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <span>🇺🇸 EN</span>
      </button>
    </div>
  );
};
