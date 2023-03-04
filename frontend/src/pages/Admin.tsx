import React, { useEffect, useState } from "react";
import { Accordion, Button, Input } from "chayns-components";
import "./../index.css";
import "./../css/Admin.css";
import locations from "../location.json";
import { setWaitCursor, useAccessToken, useCurrentPage, useSite } from "chayns-api";

const Admin = () => {
	const [filterValue, setFilterValue] = useState("");
	const [onlySelected, setOnlySelected] = useState(false);
	const [interactive, setInteractive] = useState(true);
	const [locationList, setLocationList] = useState<number[]>([]);
	const [days, setDays] = useState<number | string>(1);
	const [isLoading, setIsLoading] = useState(true);

	const site = useSite();
	const tapp = useCurrentPage();
	const accessToken = useAccessToken();

	setWaitCursor({ isEnabled: isLoading });

	useEffect(() => {
		if (site.originSiteId && tapp.id) {
			fetch(`https://tide.lukasnielsen.de/api/config.php?siteId=${site.originSiteId}&tappId=${tapp.id}`)
				.then((resp) => {
					if (resp.status === 200) {
						return resp.json();
					} else {
						return { interactive: true, location: [], days: 1 };
					}
				})
				.then((data) => {
					if ("interactive" in data) setInteractive(data.interactive);
					if ("location" in data) setLocationList(data.location);
					if ("days" in data && data.days !== null) setDays(data.days);
				})
				.catch()
				.finally(() => setIsLoading(false));
		}
	}, [site, tapp]);

	const save = () => {
		const config = {
			interactive: interactive,
			location: locationList,
			days: interactive ? null : days < 1 ? 1 : typeof days === "number" ? days : parseInt(days),
		};
		if (site.originSiteId && tapp.id && site.locationId && accessToken) {
			fetch(`https://tide.lukasnielsen.de/api/config.php?siteId=${site.originSiteId}&tappId=${tapp.id}&locationId=${site.locationId}`, { headers: { "x-chayns-token": accessToken }, body: JSON.stringify(config), method: "PUT" });
		}
	};

	const updateOnlySelected = () => {
		setOnlySelected(!onlySelected);
	};

	return (
		<>
			{!isLoading && (
				<>
					<Accordion head="Ansichtsmodus" dataGroup="config" defaultOpened>
						<ul className="interactive--wrapper">
							<li>
								<label className="flex">
									<input
										type="radio"
										name="interactive"
										checked={interactive}
										onChange={() => {
											setInteractive(!interactive);
											setLocationList([]);
										}}
									/>
									<span>Web / App</span>
								</label>
							</li>
							<li>
								<label className="flex">
									<input
										type="radio"
										name="interactive"
										checked={!interactive}
										onChange={() => {
											setInteractive(!interactive);
											setLocationList([]);
										}}
									/>
									<span>Infotafel</span>
								</label>
							</li>
						</ul>
					</Accordion>
					{interactive && (
						<Accordion head="Standorte" dataGroup="config">
							<div>
								<Input placeholder="Dagebüll" onChange={setFilterValue} defaultValue={filterValue} className="location--filter" />
								<Button className="only-selected" onClick={updateOnlySelected}>
									{onlySelected && "nur ausgewählte"}
									{!onlySelected && "alle"}
								</Button>
								<ul className="location--wrapper">
									{locations.map((location) => {
										return (
											<li key={location.id} className={onlySelected ? (locationList.indexOf(location.id) !== -1 ? "" : " hidden") : location.displayName.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ? "" : " hidden"}>
												<label className="flex">
													<input
														type="checkbox"
														checked={locationList.indexOf(location.id) !== -1}
														onChange={(e) => {
															if (e.target.checked) {
																setLocationList([location.id, ...locationList]);
															} else {
																setLocationList(locationList.filter((entry) => entry !== location.id));
															}
														}}
													/>
													<span>{location.displayName}</span>
												</label>
											</li>
										);
									})}
								</ul>
							</div>
						</Accordion>
					)}
					{!interactive && (
						<Accordion head="Standorte" dataGroup="config">
							<div>
								<Input placeholder="Dagebüll" onChange={setFilterValue} value={filterValue} className="location--filter" />
								<ul className="location--wrapper">
									{locations.map((location) => {
										return (
											<li key={location.id} className={location.displayName.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ? "" : " hidden"}>
												<label className="flex">
													<input type="radio" name="location" checked={locationList.indexOf(location.id) !== -1} onChange={() => setLocationList([location.id])} />
													<span>{location.displayName}</span>
												</label>
											</li>
										);
									})}
								</ul>
							</div>
						</Accordion>
					)}
					{!interactive && (
						<Accordion head="Tage zum Anzeigen" dataGroup="config">
							<div>
								<Input placeholder="2" type="number" onChange={setDays} value={days} className="days" />
							</div>
						</Accordion>
					)}
					<Button className="save" onClick={save}>
						speichern
					</Button>
				</>
			)}
		</>
	);
};

export default Admin;
