import { displayDaysType } from "src/@types/displayDays";
import { languageType } from "src/@types/language";

export const es: languageType = {
	general: {
		error: "error",
		tide: "mareas",
	},
	main: {
		noPermission: "No tiene permiso para acceder al modo Admin.",
		dataFrom: "datos de",
	},
	view: {
		paramter: "parámetro",
		chooseLocation: "elija una ubicación",
		daysToShow: "días para mostrar",
		time: "tiempo",
		waterLevel: "nivel del agua",
		unknown: "desconocido",
	},
};

export const displayDaysEs: displayDaysType[] = [
	{
		value: 1,
		name: "1 día",
	},
	{
		value: 3,
		name: "3 días",
	},
	{
		value: 5,
		name: "5 días",
	},
	{
		value: 7,
		name: "1 semana",
	},
	{
		value: 14,
		name: "2 semanas",
	},
	{
		value: 21,
		name: "3 semanas",
	},
	{
		value: 28,
		name: "4 semanas",
	},
];
