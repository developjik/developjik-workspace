/* eslint-env node */
/* eslint no-undef: "off" */
const { config } = require("@repo/eslint-config/react-internal");

module.exports = [
  ...config,
  {
    ignores: [
      ".docusaurus/**",
      "build/**",
      "node_modules/**",
      "eslint.config.js",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-require-imports": "off", // Allow require for Docusaurus static assets
    },
  },
];