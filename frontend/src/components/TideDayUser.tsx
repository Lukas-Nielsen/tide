import React from "react";
import { tide } from "types/tide";
import { Accordion, AccordionContent } from "@chayns-components/core";
import { TideDay } from "./TideDay";

export const TideDayUser = (props: { data: tide[]; open?: boolean }) => {
	const date = new Date(props.data[0].timestamp);

	return (
		props.data.length > 0 && (
			<Accordion
				title=""
				titleElement={
					<div style={{ lineHeight: 2 }}>
						{date.toLocaleDateString("de", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</div>
				}
				isDefaultOpen={props.open}
			>
				<AccordionContent>
					<TideDay data={props.data} />
				</AccordionContent>
			</Accordion>
		)
	);
};
