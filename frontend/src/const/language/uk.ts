import { displayDaysType } from "src/@types/displayDays";
import { languageType } from "src/@types/language";

export const uk: languageType = {
	general: {
		error: "помилка",
		tide: "Припливи",
	},
	main: {
		noPermission: "У вас немає дозволу на доступ до режиму адміністратора.",
		dataFrom: "дані з",
	},
	view: {
		paramter: "параметр",
		chooseLocation: "обираємо локацію",
		daysToShow: "залишилося кілька днів",
		time: "час",
		waterLevel: "рівень води",
		unknown: "невідомо",
	},
};

export const displayDaysUk: displayDaysType[] = [
	{
		value: 1,
		name: "1 разу",
	},
	{
		value: 3,
		name: "3 дні",
	},
	{
		value: 5,
		name: "5 дні",
	},
	{
		value: 7,
		name: "1 тиждень",
	},
	{
		value: 14,
		name: "2 тижні",
	},
	{
		value: 21,
		name: "3 тижні",
	},
	{
		value: 28,
		name: "4 тижні",
	},
];
