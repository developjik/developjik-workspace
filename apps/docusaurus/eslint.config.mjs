import { config } from "@repo/eslint-config/react-internal";

export default [
  ...config,
  {
    ignores: [
      ".docusaurus/**",
      "build/**",
      "node_modules/**",
      "eslint.config.mjs",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-require-imports": "off", // Allow require for Docusaurus static assets
    },
  },
];