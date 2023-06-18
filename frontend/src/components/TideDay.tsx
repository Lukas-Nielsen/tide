import React from "react";
import { tide } from "types/tide";

type stateType = {
	[key: string]: string;
};

const states: stateType = {
	H: "HW",
	N: "NW",
};

export const TideDay = (props: { data: tide[] }) => {
	return (
		props.data.length > 0 && (
			<table>
				<thead>
					<tr>
						<th className="table-col-time">Uhrzeit</th>
						{props.data[0].height && (
							<th className="table-col-height">Wasserstand</th>
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
									<td>{entry.height.toFixed(2) + "m"}</td>
								)}
								<td>{states[entry.state]}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		)
	);
};
