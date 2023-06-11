import React from "react";
import { createRoot } from "react-dom/client";
import { User } from "./pages/User";
import { ChaynsProvider } from "chayns-api";
import Infopanel from "./pages/Infopanel";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { ColorSchemeProvider } from "@chayns-components/core";

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route Component={Layout}>
					<Route
						path=""
						element={
							<ChaynsProvider>
								<ColorSchemeProvider>
									<User />
								</ColorSchemeProvider>
							</ChaynsProvider>
						}
					/>
					<Route
						path="/user"
						element={
							<ChaynsProvider>
								<ColorSchemeProvider>
									<User />
								</ColorSchemeProvider>
							</ChaynsProvider>
						}
					/>
					<Route path="/info" Component={Infopanel} />
					{/* <Route path="/config" Component={Home} /> */}
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
