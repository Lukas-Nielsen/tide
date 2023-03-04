import React from "react";
import { render } from "react-dom";
import View from "./pages/View";
import Admin from "./pages/Admin";
import { ChaynsProvider, useIsAdminMode, useUser } from "chayns-api";

const PageWrapper = () => {
	const isAdminMode = useIsAdminMode();
	const user = useUser();

	if (
		isAdminMode &&
		user.uacGroups.findIndex((group) => {
			return group.id === 3 || group.id === 1;
		}) === -1
	)
		return (
			<>
				<h2>Du hast keine Berechtigungen für den Admin-Modus.</h2>
				<View />
			</>
		);

	if (
		isAdminMode &&
		user.uacGroups.findIndex((group) => {
			return group.id === 3 || group.id === 1;
		}) !== -1
	)
		return <Admin />;

	return <View />;
};

const App = () => {
	return (
		<ChaynsProvider>
			<PageWrapper />
			<span>
				© {new Date().getFullYear()} by{" "}
				<a target="_blank" href="https://chayns.de/lukas.nielsen" rel="noreferrer">
					Lukas Nielsen
				</a>{" "}
				- Daten vom{" "}
				<a target="_blank" href="https://www.bsh.de" rel="noreferrer">
					BSH
				</a>
			</span>
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
