import { Accordion } from "@mantine/core";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TideTable } from "./TideTable";

interface props {
	data: any[];
	date: string;
	dayCount: number;
}

export const TideList = ({ data, date, dayCount }: props) => {
	const { i18n } = useTranslation();
	const start = useMemo(() => dayjs(date), [date]);

	return (
		<Accordion>
			{data.map((day) => {
				const diff = dayjs(day.date).diff(start, "days");
				if (diff >= 0 && diff < dayCount) {
					return (
						<Accordion.Item key={day.date} value={day.date}>
							<Accordion.Control>
								{new Date(day.date).toLocaleDateString(
									i18n.language,
									{
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
									},
								)}
							</Accordion.Control>
							<Accordion.Panel>
								<TideTable day={day} />
							</Accordion.Panel>
						</Accordion.Item>
					);
				}
				return null;
			})}
		</Accordion>
	);
};
