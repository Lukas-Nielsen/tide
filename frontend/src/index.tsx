import React from "react";
import { createRoot } from "react-dom/client";
import { User } from "./pages/User";
import { Infopanel } from "./pages/Infopanel";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route Component={Layout}>
					<Route path="" Component={User} />
					<Route path="/user" Component={User} />
					<Route
						path="/info/:locationId/:dayCount/:fontSize"
						Component={Infopanel}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

const element = document.querySelector("#root");
if (element) {
	const root = createRoot(element);
	root.render(<App />);
}
