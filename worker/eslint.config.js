import tseslint from "typescript-eslint";
import globals from "globals";

export default [
  {
    ignores: ["dist/**"]
rules: {
  "@typescript-eslint/no-explicit-any": "warn"
  // or
  // "@typescript-eslint/no-explicit-any": ["error", { "fixToUnknown": true }]
}
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
