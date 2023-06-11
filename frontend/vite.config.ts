import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import { resolve } from "path";

export default defineConfig({
	plugins: [
		react(),
		checker({
			typescript: true,
			eslint: { lintCommand: 'eslint "./src/**/*.{ts,tsx}"' },
		}),
	],
	server: { open: true, port: 3000 },
	build: {
		emptyOutDir: true,
		outDir: "./build",
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	define: {
		"process.env.BUILD_ENV": "'custom'",
		"process.env.VERSION": "'custom'",
	},
});
