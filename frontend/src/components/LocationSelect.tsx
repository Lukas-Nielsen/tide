import { setWaitCursor } from "chayns-api";
import React, { useEffect, useState } from "react";
import { ILocation } from "../types/location";
import { SelectButton, SelectButtonItem } from "@chayns-components/core";

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
			.finally(() => setLoading(false))
			.catch();
	}, []);

	return (
		<SelectButton
			list={
				data?.map((e) => {
					return { id: e.id, text: e.name } as SelectButtonItem;
				}) || []
			}
			shouldShowSearch
			selectedItemIds={[location]}
			buttonText={
				data?.find((entry) => entry.id === location)?.name ||
				"Ort wählen"
			}
			onSelect={(e) => {
				if (typeof e[0] === "number") {
					setLocation(e[0]);
					if (props.onSelect) props.onSelect(e[0]);
				}
			}}
		/>
	);
};
