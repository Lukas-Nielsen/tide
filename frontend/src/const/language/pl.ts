import { displayDaysType } from "src/@types/displayDays";
import { languageType } from "src/@types/language";

export const pl: languageType = {
	general: {
		error: "błąd",
		tide: "pływy",
	},
	main: {
		noPermission: "Nie masz uprawnień do dostępu do trybu Administratora.",
		dataFrom: "dane z",
	},
	view: {
		paramter: "parametr",
		chooseLocation: "wybrać miejsce",
		daysToShow: "dni do przedstawienia",
		time: "czas",
		waterLevel: "poziom wody",
		unknown: "nieznany",
	},
};

export const displayDaysPl: displayDaysType[] = [
	{
		value: 1,
		name: "1 dnia",
	},
	{
		value: 3,
		name: "3 dni",
	},
	{
		value: 5,
		name: "5 dni",
	},
	{
		value: 7,
		name: "1 tydzień",
	},
	{
		value: 14,
		name: "2 tygodnie",
	},
	{
		value: 21,
		name: "3 tygodnie",
	},
	{
		value: 28,
		name: "4 tygodnie",
	},
];
