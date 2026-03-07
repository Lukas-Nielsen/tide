import { Anchor, Center, Group, Select, Text } from "@mantine/core";
import React from "react";
import { useTranslation } from "react-i18next";

export const Footer = () => {
	const { t, i18n } = useTranslation("app");

	return (
		<Center my="md">
			<Group justify="space-evenly" w="100%">
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
					{t("dataFrom")}{" "}
					<Anchor
						target="_blank"
						href="https://www.bsh.de"
						rel="noreferrer"
					>
						BSH
					</Anchor>
				</Text>
				<Select
					data={[
						{ value: "de", label: "deutsch" },
						{ value: "da", label: "dansk" },
						{ value: "en", label: "english" },
					]}
					value={i18n.resolvedLanguage}
					onChange={(e) => i18n.changeLanguage(e || undefined)}
					searchable
					checkIconPosition="right"
				/>
			</Group>
		</Center>
	);
};
