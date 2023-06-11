import React from "react";

export const Footer = () => {
	return (
		<span>
			© {new Date().getFullYear()} by{" "}
			<a
				target="_blank"
				href="https://chayns.de/lukas.nielsen"
				rel="noreferrer"
			>
				Lukas Nielsen
			</a>{" "}
			- Daten von{" "}
			<a target="_blank" href="https://www.bsh.de" rel="noreferrer">
				BSH
			</a>
		</span>
	);
};
