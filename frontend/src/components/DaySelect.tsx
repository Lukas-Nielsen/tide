import React, { useState } from "react";
import { displayDays } from "../const/displayDays";
import { SelectButton } from "@chayns-components/core";

export const DaySelect = (props: { onSelect?: (e: number) => void }) => {
	const [day, setDay] = useState<number>(7);

	return (
		<SelectButton
			list={displayDays}
			buttonText={
				displayDays?.find((item) => item.id === day)?.text ||
				"Tage wählen"
			}
			title="Tage wählen"
			selectedItemIds={[day]}
			onSelect={(e) => {
				setDay(e[0]);
				props.onSelect && props.onSelect(e[0]);
			}}
		/>
	);
};
