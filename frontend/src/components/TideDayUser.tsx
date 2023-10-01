import React from "react";
import { Accordion, AccordionContent } from "@chayns-components/core";
import { TideDay } from "./TideDay";
import { ITide } from "../types/tide";

export const TideDayUser = (props: { data: ITide[]; open?: boolean }) => {
	const date = new Date(props.data[0].timestamp);

	return (
		props.data.length > 0 && (
			<Accordion
				title={date.toLocaleDateString("de", {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
				isDefaultOpen={props.open}
			>
				<AccordionContent>
					<TideDay data={props.data} />
				</AccordionContent>
			</Accordion>
		)
	);
};
