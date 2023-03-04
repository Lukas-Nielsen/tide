import { useLanguage } from "chayns-api";
import { de } from "./language/de";
import { en } from "./language/en";
import { es } from "./language/es";
import { fr } from "./language/fr";
import { it } from "./language/it";
import { nl } from "./language/nl";
import { pl } from "./language/pl";
import { pt } from "./language/pt";
import { tr } from "./language/tr";
import { uk } from "./language/uk";

export const useTranslation = () => {
	const lang = useLanguage()?.active;
	switch (lang) {
		case "en":
			return en;
		case "nl":
			return nl;
		case "it":
			return it;
		case "fr":
			return fr;
		case "es":
			return es;
		case "pl":
			return pl;
		case "pt":
			return pt;
		case "tr":
			return tr;
		case "uk":
			return uk;

		default:
			return de;
	}
};
