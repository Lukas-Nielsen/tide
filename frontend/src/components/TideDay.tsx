import React from "react";
import { tide } from "types/tide";
import { Accordion, AccordionContent } from "@chayns-components/core";

type stateType = {
	[key: string]: string;
};

const states: stateType = {
	H: "HW",
	N: "NW",
};

export const TideDay = (props: {
	data: tide[];
	open?: boolean;
	infopanel?: boolean;
}) => {
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
				isFixed={props.infopanel}
			>
				<AccordionContent>
					<table>
						<thead>
							<tr>
								<th className="table-col-time">Uhrzeit</th>
								{props.data[0].height && (
									<th className="table-col-height">
										Wasserstand
									</th>
								)}
								<th className="table-col-state">&nbsp;</th>
							</tr>
						</thead>
						<tbody>
							{props.data.map((entry) => {
								const time = new Date(entry.timestamp);
								return (
									<tr key={entry.timestamp}>
										<td>
											{time.toLocaleTimeString("de", {
												hour: "numeric",
												minute: "numeric",
											})}
										</td>
										{entry.height && (
											<td>
												{entry.height.toFixed(2) + "m"}
											</td>
										)}
										<td>{states[entry.state]}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</AccordionContent>
			</Accordion>
		)
	);
};
