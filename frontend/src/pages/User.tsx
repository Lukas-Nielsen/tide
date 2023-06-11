import React, { useEffect, useState } from "react";
import { Accordion, SelectButton } from "chayns-components";
import "./../index.css";
import "./../css/View.css";
import locations from "../location.json";
import { setWaitCursor, useLanguage } from "chayns-api";
import { Location } from "types/location";
import { displayDays } from "const/displayDays";
import { DisplayDays } from "types/displayDays";

const User = () => {
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

	const locale = useLanguage().active;

	const [data, setData] = useState<dataType[][]>();
	const [isLoading, setIsLoading] = useState(true);

	const [dayCount, setDayCount] = useState<number>(
		JSON.parse(localStorage.getItem("tide-day-count") || JSON.stringify(3))
	);

	const [location, setLocation] = useState<Location>(
		JSON.parse(
			localStorage.getItem("tide-location") ||
				JSON.stringify({
					id: 635,
					displayName: "Dagebüll",
				} as Location)
		)
	);

	setWaitCursor({ isEnabled: isLoading });

	useEffect(() => {
		fetch(
			`https://tide.chayns.friesendev.de/api/serve.php?location=${location.id}&days=${dayCount}`
		)
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
	}, [location, dayCount]);

	return (
		<div>
			{!isLoading && (
				<>
					<h1>Parameter</h1>
					<div className="settings">
						<SelectButton
							label={location.displayName}
							title="wähle einen Ort"
							list={locations}
							listKey={"id"}
							listValue={"displayName"}
							onSelect={(data: {
								buttonType: number;
								selection: Location[];
							}) => {
								setLocation({
									id: data.selection[0].id,
									displayName: data.selection[0].displayName,
								});
								localStorage.setItem(
									"tide-location",
									JSON.stringify({
										id: data.selection[0].id,
										displayName:
											data.selection[0].displayName,
									})
								);
							}}
							quickFind={true}
						/>
						<SelectButton
							label={
								displayDays.find(
									(entry) => entry.value === dayCount
								)?.name || "unbekannt"
							}
							title="Tage zum anzeigen"
							list={displayDays}
							listKey={"value"}
							listValue={"name"}
							onSelect={(data: {
								buttonType: number;
								selection: DisplayDays[];
							}) => {
								setDayCount(data.selection[0].value);
								localStorage.setItem(
									"tide-day-count",
									JSON.stringify(data.selection[0].value)
								);
							}}
						/>
					</div>
				</>
			)}
			{!isLoading && data && <h1>Gezeiten - {location.displayName}</h1>}
			{!isLoading && !data && <h3>Fehler beim anzeigen</h3>}
			{!isLoading &&
				data?.map((day, index) => {
					const date = new Date(day[0].timestamp);
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
										const time = new Date(event.timestamp);
										return (
											<tr key={event.timestamp}>
												<td>
													{time.toLocaleTimeString(
														locale,
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
												<td>{states[event.state]}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</Accordion>
					);
				})}
		</div>
	);
};

export default User;
