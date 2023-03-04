import { displayDaysType } from "src/@types/displayDays";
import { languageType } from "src/@types/language";

export const de: languageType = {
	general: {
		error: "Fehler",
		tide: "Gezeiten",
	},
	main: {
		noPermission: "Sie haben keine Berechtigung zum Zugriff auf den Admin-Mode.",
		dataFrom: "Daten vom",
	},
	view: {
		paramter: "Parameter",
		chooseLocation: "wähle einen Ort",
		daysToShow: "Tage zum Anzeigen",
		time: "Uhrzeit",
		waterLevel: "Wasserstand",
		unknown: "unbekannt",
	},
};

export const displayDaysDe: displayDaysType[] = [
	{
		value: 1,
		name: "1 Tag",
	},
	{
		value: 3,
		name: "3 Tage",
	},
	{
		value: 5,
		name: "5 Tage",
	},
	{
		value: 7,
		name: "1 Woche",
	},
	{
		value: 14,
		name: "2 Wochen",
	},
	{
		value: 21,
		name: "3 Wochen",
	},
	{
		value: 28,
		name: "4 Wochen",
	},
];
