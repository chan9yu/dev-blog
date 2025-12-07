import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname
});

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	...compat.extends("prettier"),
	{
		plugins: {
			"simple-import-sort": simpleImportSort,
			prettier: prettier
		},
		rules: {
			"prettier/prettier": "error",
			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error",
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
			"no-console": ["warn", { allow: ["warn", "error"] }]
		}
	},
	{
		ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
	}
	// Storybook 설정 임시 비활성화 (순환 참조 문제)
	// ...storybook.configs["flat/recommended"]
];

export default eslintConfig;
