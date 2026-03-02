import { Table } from "@mantine/core";
import React from "react";
import { ITideDate, States } from "../model/tide";

interface props {
	day: ITideDate;
}

export const TideTable = ({ day }: props) => {
	return (
		<Table
			data={{
				head: ["Uhrzeit", "Wasserstand", ""],
				body: day.items.map((i) => [
					new Date(i.timestamp).toLocaleTimeString(undefined, {
						hour: "numeric",
						minute: "numeric",
					}),
					i.height ? `${i.height.toFixed(2)} m` : "",
					States[i.state],
				]),
			}}
		/>
	);
};
