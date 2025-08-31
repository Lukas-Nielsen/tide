import React, { useEffect, useState } from "react";
import { Accordion, AccordionGroup } from "@chayns-components/core";
import { setWaitCursor } from "chayns-api";
import { ITides } from "../types/tide";
import { LocationSelect } from "../components/LocationSelect";
import { LocationName } from "../components/LocationName";
import { TideDayUser } from "../components/TideDayUser";
import { Calendar, CalendarType } from "@chayns-components/date";

export const User = () => {
	const [data, setData] = useState<ITides>();
	const [isLoading, setIsLoading] = useState(true);
	const dayCount = 28;
	const [location, setLocation] = useState<number>(635);
	const [date, setDate] = useState<Date>(new Date());

	const today = new Date();
	today.setDate(today.getDate() - 1);

	setWaitCursor({ isEnabled: isLoading });

	useEffect(() => {
		fetch(`/data/${new Date().getFullYear()}/${location}.json`)
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				}
				return undefined;
			})
			.then((json) => {
				setData(json);
			})
			.finally(() => {
				setIsLoading(false);
			})
			.catch(() => setData(undefined));
		return setIsLoading(true);
	}, [location]);

	return (
		<div>
			<h1>Parameter</h1>
			<LocationSelect onSelect={(e) => setLocation(e)} />
			<AccordionGroup>
				<Accordion title="Datum">
					<Calendar
						minDate={today}
						type={CalendarType.Single}
						selectedDate={date}
						onChange={(e) => e instanceof Date && setDate(e)}
					/>
				</Accordion>
			</AccordionGroup>
			{!isLoading && data && (
				<h1>
					Gezeiten - <LocationName id={location} />
				</h1>
			)}
			{!isLoading && !data && <h3>Fehler beim anzeigen</h3>}
			{!isLoading && data && (
				<AccordionGroup>
					{Object.keys(data).map((dateLocal) => {
						let selectedDate = new Date(date);
						selectedDate.setDate(selectedDate.getDate() + 1);
						let lastDate = new Date(selectedDate);
						lastDate.setDate(lastDate.getDate() + dayCount);

						console.log(lastDate.toISOString().substring(0, 10));
						if (
							dateLocal >=
								selectedDate.toISOString().substring(0, 10) &&
							dateLocal <= lastDate.toISOString().substring(0, 10)
						) {
							return (
								<TideDayUser
									key={dateLocal}
									data={data[dateLocal]}
									open={
										dateLocal ===
										date.toISOString().substring(0, 10)
									}
								/>
							);
						}
					})}
				</AccordionGroup>
			)}
		</div>
	);
};
