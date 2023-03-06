import { useLanguage } from "chayns-api";
import { displayDaysDe } from "./language/de";
import { displayDaysEn } from "./language/en";
import { displayDaysEs } from "./language/es";
import { displayDaysFr } from "./language/fr";
import { displayDaysIt } from "./language/it";
import { displayDaysNl } from "./language/nl";
import { displayDaysPl } from "./language/pl";
import { displayDaysPt } from "./language/pt";
import { displayDaysTr } from "./language/tr";
import { displayDaysUk } from "./language/uk";

export const useDisplayDays = () => {
	const lang = useLanguage()?.active;
	switch (lang) {
		case "en":
			return displayDaysEn;
		case "nl":
			return displayDaysNl;
		case "it":
			return displayDaysIt;
		case "fr":
			return displayDaysFr;
		case "es":
			return displayDaysEs;
		case "pl":
			return displayDaysPl;
		case "pt":
			return displayDaysPt;
		case "tr":
			return displayDaysTr;
		case "uk":
			return displayDaysUk;

		default:
			return displayDaysDe;
	}
};
