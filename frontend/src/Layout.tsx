import React from "react";
import { Footer } from "./Footer";
import { ColorSchemeProvider } from "@chayns-components/core";
import { useSite } from "chayns-api";
import { User } from "./pages/User";

export const Layout = () => {
	const { color, colorMode } = useSite();
	return (
		<ColorSchemeProvider color={color} colorMode={colorMode}>
			<User />
			<Footer />
		</ColorSchemeProvider>
	);
};
