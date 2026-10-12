import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";
import { oxfmt, oxlint } from "oxc-config-mantine";

export default defineConfig({
	staged: {
		"*": "vp check --fix",
	},
	lint: {
		...oxlint,
		overrides: [
			{
				files: ["**/deploy.ts"],
				rules: {
					"no-console": "off",
				},
			},
		],
	},
	fmt: {
		...oxfmt,
		useTabs: true,
		singleQuote: false,
		tabWidth: 4,
		sortPackageJson: true,
		printWidth: 150,
	},
	plugins: [react()],
	server: { open: true, port: 3000 },
	build: {
		emptyOutDir: true,
		outDir: "./build",
	},
});
