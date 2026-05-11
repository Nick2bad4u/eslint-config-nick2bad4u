import { createConfig } from "eslint-config-nick2bad4u";

/**
 * Example consumer ESLint config using `createConfig()`.
 *
 * Copy this file into a consuming repo if you want to customize root/tsconfig
 * resolution or plugin replacements while still inheriting the shared config.
 *
 * @type {import("eslint").Linter.Config[]}
 */
const localConfig = createConfig({
    rootDirectory: import.meta.dirname,
    tsconfigPaths: ["./tsconfig.eslint.json"],
});

export default localConfig;
