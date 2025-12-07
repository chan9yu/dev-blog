import nextPlugin from "@next/eslint-plugin-next";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config} */
const nextConfig = {
	plugins: {
		"@next/next": nextPlugin
	},
	rules: {
		...nextPlugin.configs.recommended.rules,
		...nextPlugin.configs["core-web-vitals"].rules
	}
};

/** @type {import('eslint').Linter.Config} */
const prettierLinterConfig = {
	plugins: {
		prettier: prettierPlugin
	},
	rules: {
		...prettierConfig.rules,
		"prettier/prettier": "error"
	}
};

/** @type {import('eslint').Linter.Config} */
const importSortConfig = {
	plugins: {
		"simple-import-sort": simpleImportSortPlugin
	},
	rules: {
		"simple-import-sort/imports": "error",
		"simple-import-sort/exports": "error"
	}
};

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
	...tseslint.configs.recommended,
	nextConfig,
	prettierLinterConfig,
	importSortConfig,
	{
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_"
				}
			],
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{
					prefer: "type-imports",
					fixStyle: "separate-type-imports"
				}
			],
			"no-console": [
				"warn",
				{
					allow: ["warn", "error"]
				}
			]
		}
	},
	{
		ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
	}
];

export default eslintConfig;
