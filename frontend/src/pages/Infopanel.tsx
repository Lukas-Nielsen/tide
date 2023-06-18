import React, { ReactNode, useEffect, useState } from "react";
import "@/index.css";
import "@/css/View.css";
import "@/css/Infopanel.css";
import { tides } from "@/types/tide";
import { LocationName } from "@/components/LocationName";
import { ColorSchemeProvider } from "@chayns-components/core";
import { useParams } from "react-router-dom";
import { TideDayInfo } from "@/components/TideDayInfo";

export const Infopanel = () => {
	return (
		<ColorSchemeProvider>
			<InfopanelContent />
		</ColorSchemeProvider>
	);
};

const InfopanelContent = () => {
	const [data, setData] = useState<tides>();
	const [renderData, setRenderData] = useState<ReactNode[]>();
	const [isLoading, setIsLoading] = useState(true);
	const { locationId, dayCount, fontSize } = useParams();

	useEffect(() => {
		if (locationId) {
			fetch(`/data/${new Date().getFullYear()}/${locationId}.json`)
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
		}
	}, [locationId]);

	useEffect(() => {
		if (data && dayCount) {
			const temp: ReactNode[] = [];
			for (let i = 0; i < parseInt(dayCount); i++) {
				const date = new Date();
				date.setDate(date.getDate() + i);
				temp.push(
					<TideDayInfo
						key={date.toISOString()}
						data={
							(data &&
								data[date.toISOString().substring(0, 10)]) ||
							[]
						}
					/>
				);
			}
			setRenderData(temp);
		}
	}, [data, dayCount]);

	useEffect(() => {
		document.querySelector(".tapp")?.classList.add("infopanel");
	}, []);

	return (
		<div data-font-size-factor={fontSize}>
			{!isLoading && data && locationId && (
				<h1>
					Gezeiten - <LocationName id={parseInt(locationId)} />
				</h1>
			)}
			<div className="infopanel--wrapper">{!isLoading && renderData}</div>
		</div>
	);
};
