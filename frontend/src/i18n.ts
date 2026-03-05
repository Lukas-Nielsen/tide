import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

void i18n
	.use(HttpBackend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "de",
		supportedLngs: ["de", "en", "da"],
		ns: ["app"],
		defaultNS: "app",
		backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
		detection: {
			order: ["querystring", "cookie", "localStorage", "navigator"],
			caches: ["localStorage", "cookie"],
		},
		interpolation: { escapeValue: false },
		react: { useSuspense: true },
	});

export default i18n;
