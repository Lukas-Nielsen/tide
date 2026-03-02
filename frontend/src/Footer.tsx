import { Anchor, Center, Group, Text } from "@mantine/core";
import React from "react";

export const Footer = () => {
	return (
		<Center my="md">
			<Group justify="space-evenly" miw="40rem" maw="95vw">
				<Text>
					© {new Date().getFullYear()} by{" "}
					<Anchor
						target="_blank"
						href="https://github.com/Lukas-Nielsen"
						rel="noreferrer"
					>
						Lukas Nielsen
					</Anchor>
				</Text>
				<Text>
					Daten von{" "}
					<Anchor
						target="_blank"
						href="https://www.bsh.de"
						rel="noreferrer"
					>
						BSH
					</Anchor>
				</Text>
			</Group>
		</Center>
	);
};
