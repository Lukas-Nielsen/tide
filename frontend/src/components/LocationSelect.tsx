import { setWaitCursor } from "chayns-api";
import React, { useEffect, useState } from "react";
import { SelectButton } from "./SelectButton";
import { ILocation } from "../types/location";

export const LocationSelect = (props: { onSelect?: (e: number) => void }) => {
	const [data, setData] = useState<ILocation[]>();
	const [location, setLocation] = useState<number>(635);
	const [isLoading, setLoading] = useState<boolean>(true);

	setWaitCursor({ isEnabled: isLoading });

	useEffect(() => {
		fetch("/data/locations.json")
			.then((resp) => {
				if (resp.status === 200) {
					return resp.json();
				}
				return undefined;
			})
			.then((json) => {
				const temp: ILocation[] = [];
				for (const k in json) {
					const item: ILocation = json[k];
					temp.push(item);
				}
				setData(temp);
			})
			.finally(() => setLoading(false)).catch;
	}, []);

	return (
		<SelectButton
			list={data || []}
			listKey="id"
			listValue="name"
			quickFind
			label={
				data?.find((entry) => entry.id === location)?.name ||
				"Ort wählen"
			}
			onSelect={(e) => {
				setLocation(e.id);
				props.onSelect && props.onSelect(e.id);
			}}
		/>
	);
};
