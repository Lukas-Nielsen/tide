import "i18next";
import { app } from "locale/de.json";

declare module "i18next" {
	interface CustomTypeOptions {
		defaultNS: "app";
		resources: {
			app: typeof app;
		};
	}
}
