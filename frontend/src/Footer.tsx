import React from "react";

export const Footer = () => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-evenly",
				marginTop: "1rem",
			}}
		>
			<span>
				© {new Date().getFullYear()} by{" "}
				<a
					target="_blank"
					href="https://chayns.de/lukas.nielsen"
					rel="noreferrer"
				>
					Lukas Nielsen
				</a>
			</span>
			<span>
				Daten von{" "}
				<a target="_blank" href="https://www.bsh.de" rel="noreferrer">
					BSH
				</a>
			</span>
		</div>
	);
};
