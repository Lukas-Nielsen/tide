import { displayDaysType } from "src/@types/displayDays";
import { languageType } from "src/@types/language";

export const nl: languageType = {
	general: {
		error: "fout",
		tide: "getijden",
	},
	main: {
		noPermission: "Je hebt geen toestemming voor de admin modus.",
		dataFrom: "gegevens van",
	},
	view: {
		paramter: "parameter",
		chooseLocation: "kies een locatie",
		daysToShow: "te tonen dagen",
		time: "tijd",
		waterLevel: "waterniveau",
		unknown: "onbekend",
	},
};

export const displayDaysNl: displayDaysType[] = [
	{
		value: 1,
		name: "1 dag",
	},
	{
		value: 3,
		name: "3 dagen",
	},
	{
		value: 5,
		name: "5 dagen",
	},
	{
		value: 7,
		name: "1 week",
	},
	{
		value: 14,
		name: "2 weken",
	},
	{
		value: 21,
		name: "3 weken",
	},
	{
		value: 28,
		name: "4 weken",
	},
];
