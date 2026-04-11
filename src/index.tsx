import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.layer.css";
import { DatesProvider } from "@mantine/dates";
import "@mantine/dates/styles.layer.css";
import { useDocumentTitle } from "@mantine/hooks";
import "dayjs/locale/da";
import "dayjs/locale/de";
import "dayjs/locale/en";
import React from "react";
import { createRoot } from "react-dom/client";
import { useTranslation } from "react-i18next";

import { Body } from "./Body";
import { Footer } from "./Footer";
import "./i18n";

const App = () => {
	const { t, i18n } = useTranslation("app");

	useDocumentTitle(t("tidesOf"));

	return (
		<MantineProvider defaultColorScheme="auto">
			<DatesProvider
				settings={{
					locale: i18n.language,
				}}
			>
				<Body />
				<Footer />
			</DatesProvider>
		</MantineProvider>
	);
};

const element = document.querySelector("#root");
if (element) {
	const root = createRoot(element);
	root.render(<App />);
}
