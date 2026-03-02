import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.layer.css";
import { DatesProvider } from "@mantine/dates";
import "@mantine/dates/styles.layer.css";
import "dayjs/locale/de";
import React from "react";
import { createRoot } from "react-dom/client";
import { Body } from "./Body";
import { Footer } from "./Footer";

const element = document.querySelector("#root");
if (element) {
	const root = createRoot(element);
	root.render(
		<MantineProvider defaultColorScheme="auto">
			<DatesProvider settings={{ locale: "de" }}>
				<Body />
				<Footer />
			</DatesProvider>
		</MantineProvider>,
	);
}
