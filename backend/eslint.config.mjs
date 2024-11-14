import baseDefault from "@phoenix35/eslint-config";
import tseslint from "typescript-eslint";

export default tseslint.config(
  ...baseDefault,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    ignores: [
      "**/dev/*",
      "**/dist/*",
      "**/tests/*",
      "tsconfig.json",
    ],
  },
  {
    languageOptions: { sourceType: "module" },
    rules: {
      // curly braces for all blocks
      curly: [ "error", "all" ],
      // single quotes
      "@stylistic/js/quotes": [ "error", "double", { avoidEscape: true } ],
      // statement beside the control
      "@stylistic/js/nonblock-statement-body-position": [ "error", "below" ],
      "no-shadow": "off",
    },
  },
);
