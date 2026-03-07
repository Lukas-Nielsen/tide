import { Table } from "@mantine/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { ITideDate, States } from "../model/tide";

interface props {
	day: ITideDate;
}

export const TideTable = ({ day }: props) => {
	const { t, i18n } = useTranslation("app");

	return (
		<Table
			data={{
				head: [t("time"), t("waterlevel"), ""],
				body: day.items.map((i) => [
					new Date(i.timestamp).toLocaleTimeString(i18n.language, {
						hour: "numeric",
						minute: "numeric",
					}),
					i.height ? `${i.height.toFixed(2)} m` : "",
					t(States[i.state]),
				]),
			}}
		/>
	);
};
