import React, { useEffect, useState } from "react";
import "./../index.css";
import "./../css/View.css";
import "./../css/Infopanel.css";
import locations from "../location.json";
import { Config } from "src/@types/config";

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

	const [data, setData] = useState<dataType[][]>();
	const [isLoading, setIsLoading] = useState(true);

	const [deviceId, setDeviceId] = useState<string>();

	const [config, setConfig] = useState<Config>(
		JSON.parse(
			localStorage.getItem("tide-config") ||
				JSON.stringify({
					location: 635,
					name: "unbekannt",
					dayCount: 3,
					fontSize: 1,
				} as Config)
		)
	);

	useEffect(() => {
		let localDeviceId = localStorage.getItem("tide-device-id");
		if (localDeviceId === null || localDeviceId.length <= 10 || localDeviceId.length >= 20) {
			localDeviceId = Date.now().toString(16).toUpperCase();
			localStorage.setItem("tide-device-id", localDeviceId);
		}
		setDeviceId(localDeviceId);
	}, []);

	useEffect(() => {
		document.querySelector(".tapp")?.classList.add("infopanel");
	}, []);

	useEffect(() => {
		fetch(`https://tide.chayns.friesendev.de/api/serve.php?location=${config.location}&days=${config.dayCount}`)
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				}
				return undefined;
			})
			.then((actualData) => {
				setData(actualData);
			})
			.catch(() => {
				setData(undefined);
			})
			.finally(() => {
				setIsLoading(false);
			});
		return setIsLoading(true);
	}, [config]);

	useEffect(() => {
		const getSiteId = () => {
			const searchParams = new URL(window.location.href).searchParams;
			if (searchParams.has("siteId")) {
				return searchParams.get("siteId");
			}
			return undefined;
		};

		const siteId = getSiteId();

		if (siteId && deviceId) {
			fetch(`https://tide.chayns.friesendev.de/api/config.php?siteId=${siteId}&deviceId=${deviceId}`)
				.then((response) => {
					if (response.status === 200) {
						return response.json();
					}
					return undefined;
				})
				.then((actualData) => {
					if (actualData) setConfig(actualData);
				})
				.catch(() => {});
		}
	}, [deviceId]);

	return (
		<div data-font-size-factor={config.fontSize}>
			{!isLoading && data && (
				<h1>Gezeiten - {locations.find((entry) => entry.id === config.location)?.displayName}</h1>
			)}
			{!isLoading && !data && <h3>Fehler beim anzeigen</h3>}
			<div className="infopanel--wrapper">
				{!isLoading &&
					data?.map((day) => {
						let date = new Date(day[0].timestamp);
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
											<th className="table-col-time">Uhrzeit</th>
											<th className="table-col-height">Wasserstand</th>
											<th className="table-col-state">&nbsp;</th>
										</tr>
									</thead>
									<tbody>
										{day.map((event) => {
											let time = new Date(event.timestamp);
											return (
												<tr key={event.timestamp}>
													<td>
														{time.toLocaleTimeString("de", {
															hour: "numeric",
															minute: "numeric",
														})}
													</td>
													<td>
														{event.height === 0 && "unbekannt"}
														{event.height !== 0 && event.height.toFixed(2) + "m"}
													</td>
													<td>{states[event.state]}</td>
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
