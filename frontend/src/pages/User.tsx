import React, { useEffect, useState } from "react";
import { AccordionGroup } from "@chayns-components/core";
import { setWaitCursor } from "chayns-api";
import { ITides } from "../types/tide";
import { LocationSelect } from "../components/LocationSelect";
import { LocationName } from "../components/LocationName";
import { checkDate, isToday } from "../const/checkDate";
import { TideDayUser } from "../components/TideDayUser";
import { DaySelect } from "../components/DaySelect";

export const User = () => {
	return <UserContent />;
};

const UserContent = () => {
	const [data, setData] = useState<ITides>();
	const [isLoading, setIsLoading] = useState(true);
	const [dayCount, setDayCount] = useState<number>(7);
	const [location, setLocation] = useState<number>(635);

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
			<>
				<h1>Parameter</h1>
				<div style={{ display: "flex", gap: "1rem" }}>
					<LocationSelect onSelect={(e) => setLocation(e)} />
					<DaySelect onSelect={(e) => setDayCount(e)} />
				</div>
			</>
			{!isLoading && data && (
				<h1>
					Gezeiten - <LocationName id={location} />
				</h1>
			)}
			{!isLoading && !data && <h3>Fehler beim anzeigen</h3>}
			{!isLoading && data && (
				<AccordionGroup>
					{Object.keys(data).map((date) => {
						if (checkDate(new Date(date), dayCount)) {
							return (
								<TideDayUser
									key={date}
									data={data[date]}
									open={isToday(date)}
								/>
							);
						}
					})}
				</AccordionGroup>
			)}
		</div>
	);
};
