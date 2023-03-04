import { displayDaysType } from "src/@types/displayDays";
import { languageType } from "src/@types/language";

export const fr: languageType = {
	general: {
		error: "erreur",
		tide: "marées",
	},
	main: {
		noPermission: "Vous n'avez pas l'autorisation d'accéder au mode Admin.",
		dataFrom: "données de",
	},
	view: {
		paramter: "paramètre",
		chooseLocation: "choisir un lieu",
		daysToShow: "jours pour montrer",
		time: "heure",
		waterLevel: "niveau de l'eau",
		unknown: "inconnu",
	},
};

export const displayDaysFr: displayDaysType[] = [
	{
		value: 1,
		name: "1 jour",
	},
	{
		value: 3,
		name: "3 jours",
	},
	{
		value: 5,
		name: "5 jours",
	},
	{
		value: 7,
		name: "1 semaine",
	},
	{
		value: 14,
		name: "2 semaines",
	},
	{
		value: 21,
		name: "3 semaines",
	},
	{
		value: 28,
		name: "4 semaines",
	},
];
