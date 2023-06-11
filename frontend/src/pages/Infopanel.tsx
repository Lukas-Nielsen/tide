import React, { useEffect, useState } from "react";
import "@/index.css";
import "@/css/View.css";
import "@/css/Infopanel.css";

const Infopanel = () => {
	type stateType = {
		[key: string]: string;
	};

	type dataType = {
		timestamp: string;
		state: string;
		height: number;
	};

	const states: stateType = {
		H: "HW",
		N: "NW",
	};

	const [data] = useState<dataType[][]>();
	const [isLoading] = useState(true);

	useEffect(() => {
		document.querySelector(".tapp")?.classList.add("infopanel");
	}, []);

	return (
		<div data-font-size-factor={""}>
			{!isLoading && data && <h1>Gezeiten - </h1>}
			{!isLoading && !data && <h3>Fehler beim anzeigen</h3>}
			<div className="infopanel--wrapper">
				{!isLoading &&
					data?.map((day) => {
						const date = new Date(day[0].timestamp);
						return (
							<div key={day[0].timestamp} className="container">
								<h2>
									{date.toLocaleDateString("de", {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</h2>
								<table>
									<thead>
										<tr>
											<th className="table-col-time">
												Uhrzeit
											</th>
											<th className="table-col-height">
												Wasserstand
											</th>
											<th className="table-col-state">
												&nbsp;
											</th>
										</tr>
									</thead>
									<tbody>
										{day.map((event) => {
											const time = new Date(
												event.timestamp
											);
											return (
												<tr key={event.timestamp}>
													<td>
														{time.toLocaleTimeString(
															"de",
															{
																hour: "numeric",
																minute: "numeric",
															}
														)}
													</td>
													<td>
														{event.height === 0 &&
															"unbekannt"}
														{event.height !== 0 &&
															event.height.toFixed(
																2
															) + "m"}
													</td>
													<td>
														{states[event.state]}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default Infopanel;
