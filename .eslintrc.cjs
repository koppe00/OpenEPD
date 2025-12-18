/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "next/core-web-vitals", // zorgt dat alle apps de Next.js regels krijgen
  ],
  overrides: [
    {
      files: [
        "next.config.js",
        "next.config.mjs",
        "tailwind.config.js",
        "postcss.config.js",
        "*.config.*"
      ],
      rules: {
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ]
}