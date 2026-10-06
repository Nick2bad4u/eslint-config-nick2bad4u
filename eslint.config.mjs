import { configs as sharedConfigs } from "./dist/shared-config.js";

/** Root ESLint flat config for this repository. */
/** @type {import("eslint").Linter.Config[]} */
const rootConfig = [
    {
        files: ["**/*.{md,mdx}"],
        name: "Remark lint performance",
        rules: {
            "remark/remark": ["error", { skipCompilation: true }],
        },
    },
    ...sharedConfigs.all,
    {
        files: [".github/workflows/release.yml"],
        name: "Release workflow input compatibility",
        rules: {
            // Preserve the existing workflow_dispatch input API.
            "github-actions/input-id-case": ["error", "snake_case"],
        },
    },
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
        name: "Package manifest compatibility",
        rules: {
            // JSDoc 64.5.4+ skips the first assertion; require the temporary exact pin.
            // Introduced by https://github.com/gajus/eslint-plugin-jsdoc/pull/1774.
            "node-dependencies/absolute-version": [
                "error",
                {
                    dependencies: "never",
                    devDependencies: "never",
                    optionalDependencies: "never",
                    overridePackages: {
                        "eslint-plugin-jsdoc": { dependencies: "always" },
                    },
                    peerDependencies: "never",
                },
            ],
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
