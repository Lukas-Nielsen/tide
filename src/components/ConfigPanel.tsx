import { Accordion, Center, Grid, NumberInput, Select, Stack } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import React from "react";
import { useTranslation } from "react-i18next";

interface props {
	locations?: { id: number; name: string }[] | null;
	location: string;
	setLocation: (v: string) => void;
	dayCount: number;
	setDayCount: (v: number) => void;
	date: string;
	setDate: (v: string) => void;
}

export const ConfigPanel = ({ locations, location, setLocation, dayCount, setDayCount, date, setDate }: props) => {
	const { t } = useTranslation("app");
	return (
		<Accordion.Item value="config">
			<Accordion.Control>{t("settings")}</Accordion.Control>
			<Accordion.Panel>
				<Grid columns={2}>
					<Grid.Col span={{ base: 2, md: 1 }} component={Stack}>
						<Select
							label={t("locationLabel")}
							data={locations?.map((l) => ({
								value: l.id.toString(),
								label: l.name,
							}))}
							value={location}
							onChange={(e) => setLocation(e ?? "635")}
							searchable
							checkIconPosition="right"
						/>
						<NumberInput
							label={t("dayCountDisplayLabel")}
							value={dayCount}
							onChange={(e) => setDayCount(Number(e))}
							min={1}
							max={60}
							clampBehavior="strict"
						/>
					</Grid.Col>

					<Grid.Col span={{ base: 2, md: 1 }}>
						<Center>
							<Calendar
								minDate={new Date()}
								getDayProps={(d) => ({
									selected: d === date,
									onClick: () => setDate(d),
								})}
							/>
						</Center>
					</Grid.Col>
				</Grid>
			</Accordion.Panel>
		</Accordion.Item>
	);
};
