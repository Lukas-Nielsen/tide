import React from "react";
import { tide } from "types/tide";
import { ContentCard } from "@chayns-components/core";
import { TideDay } from "./TideDay";

export const TideDayInfo = (props: { data: tide[] }) => {
	const date = new Date(props.data[0].timestamp);

	return (
		props.data.length > 0 && (
			<ContentCard>
				<h4>
					{date.toLocaleDateString("de", {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</h4>
				<TideDay data={props.data} />
			</ContentCard>
		)
	);
};
