import react from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import babelParser from "@babel/eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends(
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@next/next/recommended",
    "prettier",
), {
    plugins: {
        react,
        prettier,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
            ...globals.jest,
        },

        parser: babelParser,
        ecmaVersion: 5,
        sourceType: "commonjs",

        parserOptions: {
            requireConfigFile: false,

            babelOptions: {
                presets: ["@babel/preset-react"],
            },
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "prettier/prettier": ["error", {
            trailingComma: "es5",
            singleQuote: true,
            semi: true,
        }],
    },
}];