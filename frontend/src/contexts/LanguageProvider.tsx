import { defaultLocale, supportedLocales } from "@/i18n";
import type { Locale } from "@/i18n";
import { useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { LanguageContext } from "@/contexts/LanguageContext";
import type { ReactNode } from "react";

type LanguageProviderProps = {
  children: ReactNode;
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ locale?: string }>();

  // Extract locale from URL params or pathname
  const getLocaleFromPath = (): Locale => {
    // First try to get from route params
    if (params.locale && supportedLocales.includes(params.locale as Locale)) {
      return params.locale as Locale;
    }

    // Fall back to pathname parsing for routes outside the locale param
    const pathParts = location.pathname.split("/").filter(Boolean);
    const firstPart = pathParts[0];

    if (firstPart && supportedLocales.includes(firstPart)) {
      return firstPart as Locale;
    }
    return defaultLocale;
  };

  const locale = getLocaleFromPath();
  const isRTL = locale === "ar";

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    changeLocale(newLocale);
  };

  const changeLocale = (newLocale: Locale) => {
    const currentPath = location.pathname;
    const pathParts = currentPath.split("/").filter(Boolean);

    // If first part is a locale, replace it
    if (pathParts[0] && supportedLocales.includes(pathParts[0])) {
      pathParts[0] = newLocale;
    } else {
      // If no locale in path, prepend it
      pathParts.unshift(newLocale);
    }

    const newPath = "/" + pathParts.join("/");
    navigate(newPath, { replace: true });
  };

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = locale;

    localStorage.setItem("locale", locale);
  }, [locale, isRTL]);

  return (
        <LanguageContext.Provider value={{ locale, setLocale: changeLocale, isRTL, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}
