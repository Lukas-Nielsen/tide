import { useEffect, useState } from "react";
import { locations } from "types/location";

export const LocationName = (props: { id?: number }) => {
	const [data, setData] = useState<locations>();

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
			}).catch;
	}, []);

	return data && props.id && data[props.id.toString()].name;
};
