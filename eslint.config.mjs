import { configs as sharedConfigs } from "./dist/shared-config.js";

/** Root ESLint flat config for this repository. */
/** @type {import("eslint").Linter.Config[]} */
const rootConfig = [
    ...sharedConfigs.all,
    {
        files: ["src/preset.ts"],
        name: "Package entrypoint documentation",
        rules: {
            "typedoc/require-package-documentation": "warn",
            "typedoc/require-package-documentation-description": "warn",
        },
    },
    {
        files: ["package.json"],
        name: "Package manifest packlist compatibility",
        rules: {
            // npm 12 omits the main entry from this package's dry-run packlist unless files includes it explicitly.
            "package-json/no-redundant-files": "off",
        },
    },
];

// eslint-disable-next-line no-barrel-files/no-barrel-files -- Intentional adapter re-export for the repo's ESLint config entrypoint.
export {
    allowDefaultProjectFilePatternPresets,
    configs,
    createConfig,
} from "./dist/shared-config.js";

export default rootConfig;
