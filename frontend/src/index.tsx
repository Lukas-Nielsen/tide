import React from "react";
import { createRoot } from "react-dom/client";
import { ChaynsProvider } from "chayns-api";
import { Layout } from "./Layout";

const element = document.querySelector("#root");
if (element) {
	const root = createRoot(element);
	root.render(
		<ChaynsProvider>
			<Layout />
		</ChaynsProvider>,
	);
}