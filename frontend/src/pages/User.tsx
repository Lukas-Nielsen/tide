import React, { useEffect, useState } from "react";
import { AccordionGroup, Input, InputSize } from "@chayns-components/core";
import { setWaitCursor } from "chayns-api";
import { ITides } from "../types/tide";
import { LocationSelect } from "../components/LocationSelect";
import { LocationName } from "../components/LocationName";
import { TideDayUser } from "../components/TideDayUser";

export const User = () => {
	const [data, setData] = useState<ITides>();
	const [isLoading, setIsLoading] = useState(true);
	const dayCount = 28;
	const [location, setLocation] = useState<number>(635);
	const [date, setDate] = useState<string>(
		new Date().toISOString().substring(0, 10),
	);

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
			<div style={{ display: "flex", gap: "1rem" }}>
				<LocationSelect onSelect={(e) => setLocation(e)} />
				<Input
					size={InputSize.Small}
					type="date"
					value={date}
					onChange={(e) => setDate(e.currentTarget?.value || "")}
				/>
			</div>
			{!isLoading && data && (
				<h1>
					Gezeiten - <LocationName id={location} />
				</h1>
			)}
			{!isLoading && !data && <h3>Fehler beim anzeigen</h3>}
			{!isLoading && data && (
				<AccordionGroup>
					{Object.keys(data).map((dateLocal) => {
						let lastDate = new Date(date);
						lastDate.setDate(lastDate.getDate() + dayCount);
						if (
							dateLocal >= date &&
							dateLocal <= lastDate.toISOString().substring(0, 10)
						) {
							return (
								<TideDayUser
									key={dateLocal}
									data={data[dateLocal]}
									open={dateLocal === date}
								/>
							);
						}
					})}
				</AccordionGroup>
			)}
		</div>
	);
};
