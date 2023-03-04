import React, { useEffect, useState } from "react";
import { Accordion, SelectButton } from "chayns-components";
import "./../index.css";
import "./../css/View.css";
import locations from "../location.json";
import { displayDays } from "../const/displayDays";
import { setWaitCursor, useCurrentPage, useSite } from "chayns-api";

const locale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;

const View = () => {
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
	const [dayCount, setDayCount] = useState<number | undefined>(JSON.parse(localStorage.getItem("tide-dayCount") || "7"));
	const [isLoading, setIsLoading] = useState(true);
	const [interactive, setInteractive] = useState(true);
	const [locationList, setLocationList] = useState<number[]>([]);
	const [locationId] = useState<number>(
		JSON.parse(
			localStorage.getItem("tide-location") ||
				JSON.stringify({
					id: 635,
					displayName: "Dagebüll",
				})
		).id
	);
	const [location, setLocation] = useState<{ id: number; displayName: string }>(
		JSON.parse(
			localStorage.getItem("tide-location") ||
				JSON.stringify({
					id: 635,
					displayName: "Dagebüll",
				})
		)
	);

	const site = useSite();
	const tapp = useCurrentPage();

	setWaitCursor({ isEnabled: isLoading });

	useEffect(() => {
		if (site.originSiteId && tapp.id) {
			fetch(`https://tide.lukasnielsen.de/api/config.php?siteId=${site.originSiteId}&tappId=${tapp.id}`)
				.then((resp) => {
					if (resp.status === 200) {
						return resp.json();
					} else {
						return { interactive: true, location: [], days: 1 };
					}
				})
				.then((data) => {
					if ("interactive" in data) setInteractive(data.interactive);
					if ("interactive" in data && !data.interactive) {
						setLocation({
							id: data.location[0],
							displayName: locations.find((entry) => entry.id === data.location[0])?.displayName || "",
						});
					} else if ("interactive" in data && data.interactive) {
						if ("location" in data) setLocationList(data.location);
						if (data.location.indexOf(locationId) === -1) {
							setLocation(locations.find((entry) => data.location.indexOf(entry.id) !== -1) || { id: 635, displayName: "Dagebüll" });
						}
					}
					if ("days" in data && data.days !== null) setDayCount(data.days);
				})
				.catch()
				.finally(() => setIsLoading(false));
		}
	}, [site, tapp, locationId]);

	useEffect(() => {
		setIsLoading(true);
		if (location && dayCount) {
			fetch(`https://tide.lukasnielsen.de/api/serve.php?location=` + location.id)
				.then((response) => {
					return response.json();
				})
				.then((actualData) => {
					setData(actualData.slice(0, dayCount));
				})
				.catch(() => {
					setData(undefined);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [location, dayCount]);

	return (
		<div>
			{!isLoading && interactive && (
				<>
					<h1>Parameter</h1>
					<div className="settings">
						<SelectButton
							label={location.displayName}
							title={"wähle einen Ort"}
							list={locationList.length > 0 ? locations.filter((entry) => locationList.indexOf(entry.id) !== -1) : locations}
							listKey={"id"}
							listValue={"displayName"}
							defaultValue={location.id}
							onSelect={(event: any) => {
								setLocation({
									id: event.selection[0].id,
									displayName: event.selection[0].displayName,
								});
								localStorage.setItem(
									"tide-location",
									JSON.stringify({
										id: event.selection[0].id,
										displayName: event.selection[0].displayName,
									})
								);
							}}
							quickFind={true}
						/>
						<SelectButton
							label={displayDays.find((entry) => entry.value === dayCount)?.name}
							title={"Tage zum Anzeigen"}
							list={displayDays}
							listKey={"value"}
							listValue={"name"}
							defaultValue={dayCount}
							onSelect={(event: any) => {
								setDayCount(event.selection[0].value);
								localStorage.setItem("tide-dayCount", JSON.stringify(event.selection[0].value));
							}}
						/>
					</div>
				</>
			)}
			{!isLoading && data && <h1>Gezeiten - {location.displayName}</h1>}
			{!isLoading && !data && <h3>Fehler</h3>}
			{!isLoading &&
				interactive &&
				data?.map((day, index) => {
					let date = new Date(day[0].timestamp);
					return (
						<Accordion
							defaultOpened={index === 0 ? true : false}
							key={day[0].timestamp}
							head={date.toLocaleDateString(locale, {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
							dataGroup="gezeiten"
						>
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
													{time.toLocaleTimeString(locale, {
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
						</Accordion>
					);
				})}

			{!isLoading &&
				!interactive &&
				data?.map((day, index) => {
					let date = new Date(day[0].timestamp);
					return (
						<div key={day[0].timestamp}>
							<h2>
								{date.toLocaleDateString(locale, {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</h2>
							<table className="chayns__background-color--100 not-interactive">
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
													{time.toLocaleTimeString(locale, {
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
	);
};

export default View;
