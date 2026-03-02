import { useFetch } from "@hyper-fetch/react";
import { Accordion, Center, Stack, Title } from "@mantine/core";
import dayjs from "dayjs";
import React, { useState } from "react";
import { getLocation, getLocations } from "./api/data";
import { ConfigPanel } from "./components/ConfigPanel";
import { TideList } from "./components/TideList";

export const Body = () => {
	dayjs.locale("de");

	const [dayCount, setDayCount] = useState(7);
	const [location, setLocation] = useState<string>("635");
	const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));

	const { data, loading } = useFetch(
		getLocation.setParams({ location, year: new Date().getFullYear() }),
	);
	const { data: locations } = useFetch(getLocations);

	return (
		<Center my="xl">
			<Stack miw="40rem" maw="95vw">
				<Title ta="center">Gezeiten der deutschen Nordseeküste</Title>

				<Accordion>
					<ConfigPanel
						locations={locations}
						location={location}
						setLocation={setLocation}
						dayCount={dayCount}
						setDayCount={setDayCount}
						date={date}
						setDate={setDate}
					/>
				</Accordion>

				{!loading && data && (
					<Title order={1}>
						{
							locations?.find((l) => l.id.toString() === location)
								?.name
						}
					</Title>
				)}
				{!loading && !data && (
					<Title order={3}>Fehler beim anzeigen</Title>
				)}

				{!loading && data && (
					<TideList data={data} date={date} dayCount={dayCount} />
				)}
			</Stack>
		</Center>
	);
};
