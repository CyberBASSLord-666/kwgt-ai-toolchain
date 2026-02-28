import tseslint from "typescript-eslint";
import globals from "globals";

export default [
  {
    ignores: ["dist/**"]
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.serviceworker
      }
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
];
