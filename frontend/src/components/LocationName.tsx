import { useEffect, useState } from "react";
import { setWaitCursor } from "chayns-api";
import { locations } from "types/location";

export const LocationName = (props: { id?: number }) => {
	const [data, setData] = useState<locations>();
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
				setData(json);
			})
			.finally(() => setLoading(false)).catch;
	}, []);

	return data && props.id && data[props.id.toString()].name;
};
