import { displayDaysType } from "src/@types/displayDays";
import { languageType } from "src/@types/language";

export const pt: languageType = {
	general: {
		error: "erro",
		tide: "marés",
	},
	main: {
		noPermission: "Não tem permissão para aceder ao Admin-Mode.",
		dataFrom: "dados de",
	},
	view: {
		paramter: "parâmetro",
		chooseLocation: "escolha um local",
		daysToShow: "dias para mostrar",
		time: "tempo",
		waterLevel: "nível da água",
		unknown: "desconhecido",
	},
};

export const displayDaysPt: displayDaysType[] = [
	{
		value: 1,
		name: "1 dia",
	},
	{
		value: 3,
		name: "3 dias",
	},
	{
		value: 5,
		name: "5 dias",
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
