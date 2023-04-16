import React, { useEffect, useState } from "react";
import { Accordion, Button, Input, SelectButton } from "chayns-components";
import "./../index.css";
import "./../css/Admin.css";
import locations from "../location.json";
import { DialogType, createDialog, setWaitCursor, useAccessToken, useSite } from "chayns-api";
import { Config } from "src/@types/config";
import { displayDays } from "src/const/displayDays";
import { fontSize } from "src/const/fontSize";
import { DisplayDays } from "src/@types/displayDays";
import { Location } from "src/@types/location";

const Admin = () => {
	const [config, setConfig] = useState<Config[]>();
	const [isLoading, setIsLoading] = useState(true);

	const siteId = useSite().id;
	const locationId = useSite().locationId;
	const accessToken = useAccessToken();

	const updateValue = (
		deviceId: string,
		valueType: "dayCount" | "location" | "fontSize" | "name",
		value: number | string
	) => {
		if (config) {
			let temp = [...config];
			let index = temp.findIndex((entry) => entry.deviceId === deviceId);
			if (index > -1) {
				if (typeof value === "number") {
					switch (valueType) {
						case "dayCount":
							temp[index].dayCount = value;
							break;

						case "location":
							temp[index].location = value;
							break;

						case "fontSize":
							temp[index].fontSize = value;
							break;
					}
				} else if (typeof value === "string" && valueType === "name") {
					temp[index].name = value;
				}
			}
			setConfig(temp);
		}
	};

	setWaitCursor({ isEnabled: isLoading });

	useEffect(() => {
		if (siteId && isLoading) {
			fetch(`https://tide.chayns.friesendev.de/api/config.php?siteId=${siteId}&deviceId=all`)
				.then((resp) => {
					if (resp.status === 200) {
						return resp.json();
					}
					return undefined;
				})
				.then((data) => {
					setConfig(data);
				})
				.catch()
				.finally(() => setIsLoading(false));
		}
	}, [siteId, isLoading]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (siteId && config && accessToken && locationId) {
				config.forEach((device) => {
					fetch(
						`https://tide.chayns.friesendev.de/api/config.php?siteId=${siteId}&deviceId=${device.deviceId}&locationId=${locationId}`,
						{ headers: { "x-chayns-token": accessToken }, body: JSON.stringify(device), method: "PUT" }
					);
				});
			}
		}, 5 * 1000);
		return () => {
			clearTimeout(timeout);
		};
	}, [config, siteId, accessToken, locationId]);

	const deleteDevice = (deviceId: string) => {
		if (siteId && accessToken) {
			fetch(
				`https://tide.chayns.friesendev.de/api/config.php?siteId=${siteId}&deviceId=${deviceId}&locationId=${locationId}`,
				{ headers: { "x-chayns-token": accessToken }, method: "DELETE" }
			).finally(() => {
				setIsLoading(true);
			});
		}
	};

	return (
		<>
			{config && (
				<>
					{config?.map((device, index) => {
						return (
							<Accordion
								key={device.deviceId}
								head={device.name.length === 0 ? device.deviceId : device.name}
								dataGroup="config"
								defaultOpened={index === 0}
							>
								<div className="admin--config--wrapper">
									<div>
										<h3>Name</h3>
										<Input
											onChange={(e) => {
												updateValue(device.deviceId, "name", e);
											}}
											value={device.name}
											placeholder="Name"
										/>
									</div>
									<div>
										<h3>Tage zum Anzeigen</h3>
										<SelectButton
											label={
												displayDays.find((entry) => entry.value === device.dayCount)?.name ||
												"bitte wählen"
											}
											title="Tage zum anzeigen"
											list={displayDays}
											listKey={"value"}
											listValue={"name"}
											onSelect={(data: { buttonType: number; selection: DisplayDays[] }) => {
												updateValue(device.deviceId, "dayCount", data.selection[0].value);
											}}
										/>
									</div>
									<div>
										<h3>Ort</h3>
										<SelectButton
											label={
												locations.find((entry) => entry.id === device.location)?.displayName ||
												"bitte wählen"
											}
											title="wähle einen Ort"
											list={locations}
											listKey={"id"}
											listValue={"displayName"}
											onSelect={(data: { buttonType: number; selection: Location[] }) => {
												updateValue(device.deviceId, "location", data.selection[0].id);
											}}
											quickFind={true}
										/>
									</div>
									<div>
										<h3>Schriftgröße</h3>
										<SelectButton
											label={device.fontSize.toString() || "bitte wählen"}
											title="wähle eine Schriftgröße"
											list={fontSize}
											listKey={"value"}
											listValue={"value"}
											onSelect={(data: {
												buttonType: number;
												selection: { value: number }[];
											}) => {
												updateValue(device.deviceId, "fontSize", data.selection[0].value);
											}}
											showSelection
										/>
									</div>
									<Accordion head="Wartung">
										<Button className="delete" onClick={() => deleteDevice(device.deviceId)}>
											löschen
										</Button>
									</Accordion>
								</div>
							</Accordion>
						);
					})}
				</>
			)}
		</>
	);
};

export default Admin;
