import React from "react";
import { ITide } from "../types/tide";

type stateType = {
	[key: string]: string;
};

const states: stateType = {
	H: "HW",
	N: "NW",
};

export const TideDay = (props: { data: ITide[] }) => {
	return (
		props.data.length > 0 && (
			<table>
				<thead>
					<tr>
						<th style={{ width: "7rem", textAlign: "left" }}>
							Uhrzeit
						</th>
						{props.data[0].height && (
							<th style={{ width: "14rem", textAlign: "left" }}>
								Wasserstand
							</th>
						)}
						<th>&nbsp;</th>
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
									<td>{entry.height.toFixed(2) + " m"}</td>
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
