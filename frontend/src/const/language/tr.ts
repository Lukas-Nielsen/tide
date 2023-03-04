import { displayDaysType } from "src/@types/displayDays";
import { languageType } from "src/@types/language";

export const tr: languageType = {
	general: {
		error: "hata",
		tide: "gelgitler",
	},
	main: {
		noPermission: "Yönetici Moduna erişim izniniz yok.",
		dataFrom: "gelen veriler",
	},
	view: {
		paramter: "parametresi",
		chooseLocation: "bir konum seçin",
		daysToShow: "gösterilecek günler",
		time: "zaman",
		waterLevel: "su seviyesi",
		unknown: "Bilinmiyor",
	},
};

export const displayDaysTr: displayDaysType[] = [
	{
		value: 1,
		name: "1 gün",
	},
	{
		value: 3,
		name: "3 gün",
	},
	{
		value: 5,
		name: "5 gün",
	},
	{
		value: 7,
		name: "1 hafta",
	},
	{
		value: 14,
		name: "2 hafta",
	},
	{
		value: 21,
		name: "3 hafta",
	},
	{
		value: 28,
		name: "4 hafta",
	},
];
