import React, { useState } from "react";
import { SelectButton } from "./SelectButton";
import { displayDays } from "../const/displayDays";

export const DaySelect = (props: { onSelect?: (e: number) => void }) => {
	const [day, setDay] = useState<number>(7);

	return (
		<SelectButton
			list={displayDays}
			listKey="value"
			listValue="name"
			quickFind
			label={
				displayDays?.find((item) => item.value === day)?.name ||
				"Tage wählen"
			}
			onSelect={(e) => {
				setDay(e.value);
				props.onSelect && props.onSelect(e.value);
			}}
		/>
	);
};
