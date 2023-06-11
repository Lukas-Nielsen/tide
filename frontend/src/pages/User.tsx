import { LocationSelect } from "@/components/LocationSelect";
import React, { ReactNode, useEffect, useState } from "react";
import "@/index.css";
import "@/css/View.css";
import { setWaitCursor } from "chayns-api";
import { tides } from "@/types/tide";
import { TideDay } from "@/components/TideDay";
import { LocationName } from "@/components/LocationName";
import { AccordionGroup } from "@chayns-components/core";

export const User = () => {
	const [data, setData] = useState<tides>();
	const [renderData, setRenderData] = useState<ReactNode[]>();
	const [isLoading, setIsLoading] = useState(true);
	const [dayCount] = useState<number>(7);
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

	useEffect(() => {
		if (data) {
			const temp: ReactNode[] = [];
			for (let i = 0; i < dayCount; i++) {
				const date = new Date();
				date.setDate(date.getDate() + i);
				temp.push(
					<TideDay
						key={date.toISOString()}
						data={
							(data &&
								data[date.toISOString().substring(0, 10)]) ||
							[]
						}
						open={i === 0}
					/>
				);
			}
			setRenderData(temp);
		}
	}, [data, dayCount]);

	return (
		<div>
			<>
				<h1>Parameter</h1>
				<div className="settings">
					<LocationSelect onSelect={(e) => setLocation(e)} />
				</div>
			</>
			{!isLoading && data && (
				<h1>
					Gezeiten - <LocationName id={location} />
				</h1>
			)}
			{!isLoading && !data && <h3>Fehler beim anzeigen</h3>}
			{!isLoading && <AccordionGroup>{renderData}</AccordionGroup>}
		</div>
	);
};
