import React from "react";
import { render } from "react-dom";
import User from "./pages/User";
import Admin from "./pages/Admin";
import { ChaynsProvider, useIsAdminMode, useUser } from "chayns-api";
import Infopanel from "./pages/Infopanel";

const PageWrapper = () => {
	const isAdminMode = useIsAdminMode();
	const user = useUser();

	if (
		isAdminMode &&
		user.uacGroups?.findIndex((group) => {
			return group.id === 3 || group.id === 1;
		}) === -1
	)
		return (
			<>
				<h2>Dir Fehlen die Berechtigungen zum Anzeigen der Konfiguration.</h2>
				<User />
			</>
		);

	if (
		isAdminMode &&
		user.uacGroups?.findIndex((group) => {
			return group.id === 3 || group.id === 1;
		}) !== -1
	)
		return <Admin />;

	return <User />;
};

const Footer = () => {
	return (
		<span>
			© {new Date().getFullYear()} by{" "}
			<a target="_blank" href="https://chayns.de/lukas.nielsen" rel="noreferrer">
				Lukas Nielsen
			</a>{" "}
			- Daten von{" "}
			<a target="_blank" href="https://www.bsh.de" rel="noreferrer">
				BSH
			</a>
		</span>
	);
};

const App = () => {
	if (window.location.pathname.includes("/info-ui/")) {
		return (
			<>
				<Infopanel />
				<Footer />
			</>
		);
	}
	return (
		<ChaynsProvider>
			<PageWrapper />
			<Footer />
		</ChaynsProvider>
	);
};

try {
	const ReactDOMClient = require("react-dom/client");
	const root = ReactDOMClient.createRoot(document.getElementById("root"));
	root.render(<App />);
} catch (error) {
	render(<App />, document.getElementById("root"));
}
