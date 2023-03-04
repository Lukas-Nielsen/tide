import { displayDaysType } from "src/@types/displayDays";
import { languageType } from "src/@types/language";

export const it: languageType = {
	general: {
		error: "Errore",
		tide: "maree",
	},
	main: {
		noPermission: "L'utente non ha i permessi per accedere alla modalità Admin.",
		dataFrom: "dati da",
	},
	view: {
		paramter: "parametro",
		chooseLocation: "scegliere una località",
		daysToShow: "giorni di esposizione",
		time: "tempo",
		waterLevel: "livello dell'acqua",
		unknown: "sconosciuto",
	},
};

export const displayDaysIt: displayDaysType[] = [
	{
		value: 1,
		name: "1 giorno",
	},
	{
		value: 3,
		name: "3 giorni",
	},
	{
		value: 5,
		name: "5 giorni",
	},
	{
		value: 7,
		name: "1 settimana",
	},
	{
		value: 14,
		name: "2 settimane",
	},
	{
		value: 21,
		name: "3 settimane",
	},
	{
		value: 28,
		name: "4 settimane",
	},
];
