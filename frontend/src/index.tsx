import React from "react";
import { render } from "react-dom";
import { useTranslation } from "./const/language";
import View from "./pages/View";
import Admin from "./pages/Admin";
import { ChaynsProvider, useIsAdminMode, useUser } from "chayns-api";

const PageWrapper = () => {
	const translation = useTranslation();
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
				<h2>{translation.main.noPermission}</h2>
				<View />
			</>
		);

	if (
		isAdminMode &&
		user.uacGroups?.findIndex((group) => {
			return group.id === 3 || group.id === 1;
		}) !== -1
	)
		return <Admin />;

	return <View />;
};

const Footer = () => {
	const translation = useTranslation();
	return (
		<span>
			© {new Date().getFullYear()} by{" "}
			<a target="_blank" href="https://chayns.de/lukas.nielsen" rel="noreferrer">
				Lukas Nielsen
			</a>{" "}
			- {translation.main.dataFrom}{" "}
			<a target="_blank" href="https://www.bsh.de" rel="noreferrer">
				BSH
			</a>
		</span>
	);
};

const App = () => {
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
