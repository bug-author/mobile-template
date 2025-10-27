module.exports = {
  root: true,
  extends: ["expo", "prettier"],
  plugins: [],
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
  ignorePatterns: [
    "node_modules/",
    ".expo/",
    "dist/",
    "web-build/",
    "ios/",
    "android/",
  ],
};
