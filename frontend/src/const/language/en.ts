import { displayDaysType } from "src/@types/displayDays";
import { languageType } from "src/@types/language";

export const en: languageType = {
	general: {
		error: "error",
		tide: "tide",
	},
	main: {
		noPermission: "You hav no permission to access the Admin-Mode.",
		dataFrom: "data from",
	},
	view: {
		paramter: "parameter",
		chooseLocation: "choose a location",
		daysToShow: "days to show",
		time: "time",
		waterLevel: "water level",
		unknown: "unknown",
	},
};

export const displayDaysEn: displayDaysType[] = [
	{
		value: 1,
		name: "1 day",
	},
	{
		value: 3,
		name: "3 days",
	},
	{
		value: 5,
		name: "5 days",
	},
	{
		value: 7,
		name: "1 week",
	},
	{
		value: 14,
		name: "2 weeks",
	},
	{
		value: 21,
		name: "3 weeks",
	},
	{
		value: 28,
		name: "4 weeks",
	},
];
