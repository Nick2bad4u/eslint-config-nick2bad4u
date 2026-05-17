/**
 * Optimized ESLint configuration
 *
 * @see {@link https://www.schemastore.org/eslintrc.json} for JSON schema validation
 */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference -- Local ambient declarations for untyped plugin modules.
/// <reference path="./_types/eslint-plugin-shims.d.ts" />
/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair, sonarjs/no-duplicate-string, perfectionist/sort-imports, perfectionist/sort-modules, perfectionist/sort-interfaces, typefest/prefer-type-fest-except, typefest/prefer-type-fest-json-value, typefest/prefer-type-fest-unknown-record, typefest/prefer-ts-extras-is-defined, typefest/prefer-ts-extras-safe-cast-to, typefest/prefer-ts-extras-string-split, unicorn/no-array-reduce, @typescript-eslint/prefer-readonly-parameter-types -- Eslint doesn't use default */

import type { Linter } from "eslint";
import docusaurus from "@docusaurus/eslint-plugin";
import * as eslintCommentsPlugin from "@eslint-community/eslint-plugin-eslint-comments";
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import react from "@eslint-react/eslint-plugin";
import { globalIgnores } from "@eslint/config-helpers";
import css from "@eslint/css";
import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import html from "@html-eslint/eslint-plugin";
import * as htmlParser from "@html-eslint/parser";
import next from "@next/eslint-plugin-next";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";
import vite from "@typpi/eslint-plugin-vite";
import vitest from "@vitest/eslint-plugin";
import gitignore from "eslint-config-flat-gitignore";
import prettierOverrides from "eslint-config-prettier";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import arrayFunc from "eslint-plugin-array-func";
import astro from "eslint-plugin-astro";
import canonical from "eslint-plugin-canonical";
import casePolice from "eslint-plugin-case-police";
import commentLength from "eslint-plugin-comment-length";
import copilot from "eslint-plugin-copilot";
import cssModules from "eslint-plugin-css-modules";
import deMorgan from "eslint-plugin-de-morgan";
import depend from "eslint-plugin-depend";
import docusaurus2 from "eslint-plugin-docusaurus-2";
import eslintPluginEslintPlugin from "eslint-plugin-eslint-plugin";
import etcMiscPlugin from "eslint-plugin-etc-misc";
import progress from "eslint-plugin-file-progress-2";
import githubActions from "eslint-plugin-github-actions-2";
import immutable from "eslint-plugin-immutable-2";
import { importX } from "eslint-plugin-import-x";
import jsdoc from "eslint-plugin-jsdoc";
import jsonc from "eslint-plugin-jsonc";
import listeners from "eslint-plugin-listeners";
import math from "eslint-plugin-math";
import moduleInterop from "eslint-plugin-module-interop";
import nodePlugin from "eslint-plugin-n";
import nitpick from "eslint-plugin-nitpick";
import noBarrelFiles from "eslint-plugin-no-barrel-files";
import noOnly from "eslint-plugin-no-only-tests";
import noSecrets from "eslint-plugin-no-secrets";
import noUnsanitized from "eslint-plugin-no-unsanitized";
import nodeDepends from "eslint-plugin-node-dependencies";
import packageJson from "eslint-plugin-package-json";
import perfectionist from "eslint-plugin-perfectionist";
import playwright from "eslint-plugin-playwright";
import prettierBridge from "eslint-plugin-prettier";
import promise from "eslint-plugin-promise";
import regexp from "eslint-plugin-regexp";
import remark from "eslint-plugin-remark";
import repo from "eslint-plugin-repo";
import runtimeCleanup from "eslint-plugin-runtime-cleanup";
import sdl from "eslint-plugin-sdl-2";
import security from "eslint-plugin-security";
import { configs as sonarjsConfigs } from "eslint-plugin-sonarjs";
import storybook from "eslint-plugin-storybook";
import stylelint2 from "eslint-plugin-stylelint-2";
import testSignal from "eslint-plugin-test-signal";
import testingLibrary from "eslint-plugin-testing-library";
import toml from "eslint-plugin-toml";
import tsconfig from "eslint-plugin-tsconfig";
import tsdoc from "eslint-plugin-tsdoc";
import tsdocRequire from "eslint-plugin-tsdoc-require-2";
import typedoc from "eslint-plugin-typedoc";
import typefestPlugin from "eslint-plugin-typefest";
import undefinedCSS from "eslint-plugin-undefined-css-classes";
import unicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
import vue from "eslint-plugin-vue";
import writeGoodComments from "eslint-plugin-write-good-comments-2";
import yml from "eslint-plugin-yml";
import globals from "globals";
import * as jsoncEslintParser from "jsonc-eslint-parser";
import { createRequire } from "node:module";
import * as path from "node:path";
import * as tomlEslintParser from "toml-eslint-parser";
import * as vueParser from "vue-eslint-parser";
import * as yamlEslintParser from "yaml-eslint-parser";
import {
    arrayFirst,
    arrayJoin,
    isPresent,
    keyIn,
    objectEntries,
    objectFromEntries,
    objectHasOwn,
    setHas,
} from "ts-extras";

const require = createRequire(import.meta.url);

// NOTE: eslint-plugin-json-schema-validator may attempt to fetch remote schemas
// at lint time. That makes linting flaky/offline-hostile.
// Keep it opt-in via ENABLE_JSON_SCHEMA_VALIDATION=1.
const enableJsonSchemaValidation =
    globalThis.process.env["ENABLE_JSON_SCHEMA_VALIDATION"] === "1";

const jsonSchemaValidatorPackageName = "eslint-plugin-json-schema-validator";
let eslintPluginJsonSchemaValidator = null;

if (enableJsonSchemaValidation) {
    try {
        // eslint-disable-next-line import-x/no-dynamic-require -- Controlled optional package name constant; no user input reaches require.
        const loadedJsonSchemaValidator = require(
            jsonSchemaValidatorPackageName
        );

        eslintPluginJsonSchemaValidator =
            loadedJsonSchemaValidator.default ?? loadedJsonSchemaValidator;
    } catch {
        console.warn(
            `[eslint-config-nick2bad4u] ${jsonSchemaValidatorPackageName} is not installed; JSON schema validation remains disabled.`
        );
    }
}

const jsonSchemaValidatorPlugins =
    eslintPluginJsonSchemaValidator === null
        ? {}
        : { "json-schema-validator": eslintPluginJsonSchemaValidator };

const jsonSchemaValidatorRules =
    eslintPluginJsonSchemaValidator === null
        ? {}
        : { "json-schema-validator/no-invalid": "error" };

const processEnvironment = globalThis.process.env;

// A single catch-all tsconfig.eslint.json (includes **/* and **/.* for dotfiles,
// extends tsconfig.json, allowJs:true) is the only project ESLint needs.
// Consumer repos can override via createConfig({ tsconfigPaths: [...] }).
const DEFAULT_TSCONFIG_PATHS = Object.freeze(["./tsconfig.eslint.json"]);

type EslintConfig = Linter.Config;

const casePoliceRecommendedConfigs =
    casePolice.configs.recommended as unknown as readonly EslintConfig[];
const casePoliceRulePlugin =
    casePoliceRecommendedConfigs.find(
        (config) => config.plugins?.["case-police"] !== undefined
    )?.plugins?.["case-police"] ?? casePolice;
const eslintCommentsRecommendedConfig = comments.recommended;
const eslintCommentsRulePlugin =
    eslintCommentsRecommendedConfig.plugins?.[
        "@eslint-community/eslint-comments"
    ] ?? eslintCommentsPlugin;
const fileProgressRecommendedConfig = progress.configs["recommended-ci"];
const fileProgressRulePlugin =
    fileProgressRecommendedConfig.plugins?.["file-progress"] ?? progress;
const sdlRequiredConfigs =
    sdl.configs.required as unknown as readonly EslintConfig[];
const nodeRulePlugin =
    sdlRequiredConfigs.find((config) => config.plugins?.["n"] !== undefined)
        ?.plugins?.["n"] ?? nodePlugin;
const sdlRulePlugin =
    sdlRequiredConfigs.find((config) => config.plugins?.["sdl"] !== undefined)
        ?.plugins?.["sdl"] ?? sdl;

interface ConfigurablePlugin {
    readonly configs?: object;
    readonly flat?: object;
}

type PluginOverride = ConfigurablePlugin | false | null | undefined;

type PluginOverrides = Readonly<Record<string, PluginOverride>>;

export interface Nick2Bad4UEslintConfigOptions {
    /** Project root used for parser root resolution and local alias checks. */
    readonly rootDirectory?: string;

    /** TypeScript project files relative to `rootDirectory`. */
    readonly tsconfigPaths?: readonly string[];

    /** Plugin overrides keyed by ESLint namespace. */
    readonly plugins?: PluginOverrides;
}

export interface Nick2Bad4UEslintConfigPresets {
    readonly all: EslintConfig[];
    readonly base: EslintConfig[];
    readonly recommended: EslintConfig[];
    readonly withoutChunkyLint: EslintConfig[];
    readonly withoutCopilot: EslintConfig[];
    readonly withoutDocusaurus2: EslintConfig[];
    readonly withoutEtcMisc: EslintConfig[];
    readonly withoutFileProgress2: EslintConfig[];
    readonly withoutGithubActions2: EslintConfig[];
    readonly withoutImmutable2: EslintConfig[];
    readonly withoutRemark: EslintConfig[];
    readonly withoutRepo: EslintConfig[];
    readonly withoutRuntimeCleanup: EslintConfig[];
    readonly withoutSdl2: EslintConfig[];
    readonly withoutStylelint2: EslintConfig[];
    readonly withoutTestSignal: EslintConfig[];
    readonly withoutTsconfig: EslintConfig[];
    readonly withoutTsdocRequire2: EslintConfig[];
    readonly withoutTypedoc: EslintConfig[];
    readonly withoutTypefest: EslintConfig[];
    readonly withoutUptimeWatcher: EslintConfig[];
    readonly withoutVite: EslintConfig[];
    readonly withoutWriteGoodComments2: EslintConfig[];
}

type MutableEslintConfig = Omit<EslintConfig, "plugins" | "rules"> & {
    plugins?: Record<string, unknown>;
    rules?: Record<string, unknown>;
};

/**
 * @param {ReadonlyMap<string, PluginOverride>} pluginOverrideEntries
 * @param {string} pluginName
 * @param {ConfigurablePlugin} fallbackPlugin
 *
 * @returns {ConfigurablePlugin | null}
 */
const resolvePlugin = (
    pluginOverrideEntries: ReadonlyMap<string, PluginOverride>,
    pluginName: string,
    fallbackPlugin: ConfigurablePlugin
): ConfigurablePlugin | null => {
    const configuredPlugin = pluginOverrideEntries.get(pluginName);

    if (configuredPlugin === false || configuredPlugin === null) {
        return null;
    }

    return configuredPlugin ?? fallbackPlugin;
};

const resolveTypedPlugin = <TPlugin extends ConfigurablePlugin>(
    pluginOverrideEntries: ReadonlyMap<string, PluginOverride>,
    pluginName: string,
    fallbackPlugin: TPlugin
): null | TPlugin => {
    const resolvedPlugin = resolvePlugin(
        pluginOverrideEntries,
        pluginName,
        fallbackPlugin
    );

    return resolvedPlugin === null ? null : (resolvedPlugin as TPlugin);
};

/**
 * @param {string} ruleName
 *
 * @returns {string}
 */
const getRulePluginName = (ruleName: string): string => {
    if (ruleName.startsWith("@")) {
        return arrayJoin(ruleName.split("/").slice(0, 2), "/");
    }

    return arrayFirst(ruleName.split("/")) ?? ruleName;
};

/**
 * @param {readonly EslintConfig[]} configs
 * @param {ReadonlySet<string>} disabledPluginNames
 *
 * @returns {EslintConfig[]}
 */
const removeDisabledPluginRules = (
    configs: readonly EslintConfig[],
    disabledPluginNames: ReadonlySet<string>
): EslintConfig[] => {
    if (disabledPluginNames.size === 0) {
        return [...configs];
    }

    return configs.map((config): EslintConfig => {
        const nextConfig: MutableEslintConfig = { ...config };

        if (nextConfig.plugins !== undefined) {
            nextConfig.plugins = objectFromEntries(
                objectEntries(nextConfig.plugins).filter(
                    ([pluginName]) => !setHas(disabledPluginNames, pluginName)
                )
            );
        }

        if (nextConfig.rules !== undefined) {
            nextConfig.rules = objectFromEntries(
                objectEntries(nextConfig.rules).filter(
                    ([ruleName]) =>
                        !setHas(
                            disabledPluginNames,
                            getRulePluginName(ruleName)
                        )
                )
            );
        }

        return nextConfig as EslintConfig;
    });
};

/**
 * @param {readonly (EslintConfig | readonly EslintConfig[])[]} configs
 *
 * @returns {EslintConfig[]}
 */
const flattenConfigs = (
    configs: readonly (EslintConfig | readonly EslintConfig[])[]
): EslintConfig[] =>
    configs.reduce<EslintConfig[]>((flattenedConfigs, config) => {
        if (Array.isArray(config)) {
            flattenedConfigs.push(
                ...flattenConfigs(config as readonly EslintConfig[])
            );
        } else {
            flattenedConfigs.push(config as EslintConfig);
        }

        return flattenedConfigs;
    }, []);

const withoutProjectServiceParserOption = (
    config: EslintConfig
): EslintConfig => {
    const languageOptions = config.languageOptions;
    const parserOptions = languageOptions?.["parserOptions"];

    if (
        !isPresent(parserOptions) ||
        typeof parserOptions !== "object" ||
        Array.isArray(parserOptions) ||
        !objectHasOwn(parserOptions, "projectService")
    ) {
        return config;
    }

    const nextParserOptions: Record<string, unknown> = { ...parserOptions };
    Reflect.deleteProperty(nextParserOptions, "projectService");

    return {
        ...config,
        languageOptions: {
            ...languageOptions,
            parserOptions: nextParserOptions,
        },
    };
};

/**
 * Controls eslint-plugin-file-progress behavior.
 *
 * @remarks
 * The file-progress rule is great for interactive CLI runs, but it produces
 * extremely large logs when output is redirected to a file.
 *
 * Supported values:
 *
 * - (unset) / "on": enable progress and show file names
 * - "nofile": enable progress but hide file names
 * - "off" / "0" / "false": disable progress
 */
const ESLINT_PROGRESS_MODE = (
    processEnvironment["ESLINT_PROGRESS"] ?? "on"
).toLowerCase();

const IS_CI = (processEnvironment["CI"] ?? "").toLowerCase() === "true";
const DISABLE_PROGRESS =
    ESLINT_PROGRESS_MODE === "off" ||
    ESLINT_PROGRESS_MODE === "0" ||
    ESLINT_PROGRESS_MODE === "false";
const HIDE_PROGRESS_FILENAMES = ESLINT_PROGRESS_MODE === "nofile";

/** @type {import("eslint").Linter.Config} */
const fileProgressOverridesConfig = {
    name: "⏱️ CLI: File Progress Overrides",
    plugins: {
        "file-progress": fileProgressRulePlugin,
    },
    rules: {
        // The preset already auto-hides on CI, but we also support explicit
        // local toggles.
        "file-progress/activate": DISABLE_PROGRESS ? 0 : 1,
    },
    settings: {
        progress: {
            detailedSuccess: false, // Show multi-line final summary (duration, file count, exit code)
            failureMark: "✖", // Custom mark used for failure completion
            fileNameOnNewLine: true, // Show file names on a new line for better readability
            hide: IS_CI || DISABLE_PROGRESS, // Hide progress output (useful in CI)
            hideDirectoryNames: false, // Show only the filename (no directory path segments)
            hideFileName: HIDE_PROGRESS_FILENAMES, // Show generic "Linting..." instead of file names
            hidePrefix: false, // Hide plugin prefix text before progress/summary output
            prefixMark: "•", // Marker after plugin name prefix in progress lines
            spinnerStyle: "dots", // Line | dots | arc | bounce | clock
            successMark: "✔", // Custom mark used for success completion
            successMessage: "Linting complete!", // Custom message on successful completion
        },
    },
};

/**
 * Create the shared Nick2bad4u ESLint flat config.
 *
 * @param {Nick2Bad4UEslintConfigOptions} [options]
 *
 * @returns {EslintConfig[]}
 */
export const createConfig = (
    options: Nick2Bad4UEslintConfigOptions = {}
): EslintConfig[] => {
    const rootDirectory = path.resolve(
        options.rootDirectory ?? processEnvironment["ESLINT_CONFIG_ROOT"] ?? "."
    );
    const tsconfigPaths = options.tsconfigPaths ?? DEFAULT_TSCONFIG_PATHS;
    const pluginOverrides = options.plugins ?? {};
    const pluginOverrideEntries = new Map(objectEntries(pluginOverrides));
    const disabledPluginNames = new Set(
        [...pluginOverrideEntries]
            .filter(([, plugin]) => plugin === false || plugin === null)
            .map(([pluginName]) => pluginName)
    );
    const typefest = resolveTypedPlugin(
        pluginOverrideEntries,
        "typefest",
        typefestPlugin
    );
    const etcMisc = resolveTypedPlugin(
        pluginOverrideEntries,
        "etc-misc",
        etcMiscPlugin
    );
    const runtimeCleanupPlugin = resolveTypedPlugin(
        pluginOverrideEntries,
        "runtime-cleanup",
        runtimeCleanup
    );
    const testSignalPlugin = resolveTypedPlugin(
        pluginOverrideEntries,
        "test-signal",
        testSignal
    );

    // NOTE: In ESLint flat config, ignore-only entries are safest when
    // placed near the start of the config array.
    // ═══════════════════════════════════════════════════════════════════════════════
    // #region 🌍 Global Configs and Rules
    // SECTION: Global Configs and Rules
    // ═══════════════════════════════════════════════════════════════════════════════
    // #endregion
    // ═══════════════════════════════════════════════════════════════════════════════
    // #region 🧹 Global Ignore Patterns
    // SECTION: 🧹 Global Ignore Patterns
    // ═══════════════════════════════════════════════════════════════════════════════
    // Add patterns here to ignore files and directories globally
    const configs = [
        globalIgnores(
            [
                "**/AGENTS.md",
                "**/CHANGELOG.md",
                "test/fixtures/**",
                "**/**-instructions.md",
                "**/**.instructions.md",
                "**/**dist**/**",
                "**/.agentic-tools*",
                "**/.cache/**",
                "**/Coverage/**",
                "**/_ZENTASKS*",
                "**/chatproject.md",
                "**/coverage-results.json",
                "**/coverage/**",
                "**/dist-scripts/**",
                "**/dist/**",
                "**/*.css.d.ts",
                "**/*.module.css.d.ts",
                "**/html/**",
                "examples/**",
                "**/node_modules/**",
                "**/package-lock.json",
                "**/release/**",
                ".devskim.json",
                ".github/ISSUE_TEMPLATE/**",
                ".github/PULL_REQUEST_TEMPLATE/**",
                ".github/chatmodes/**",
                ".github/instructions/**",
                ".github/prompts/**",
                ".stryker-tmp/**",
                "**/CHANGELOG.md",
                "coverage-report.json",
                "config/testing/types/**/*.d.ts",
                "docs/Archive/**",
                "docs/Logger-Error-report.md",
                "docs/Packages/**",
                "docs/Reviews/**",
                "docs/docusaurus/.docusaurus/**",
                "docs/docusaurus/build/**",
                "docs/docusaurus/docs/**",
                "docs/docusaurus/static/eslint-inspector/**",
                "docs/docusaurus/static/stylelint-inspector/**",
                "docs/docusaurus/static/*-inspector/**",
                "report/**",
                "reports/**",
                "scripts/devtools-snippets/**",
                "playwright/reports/**",
                "playwright/test-results/**",
                "public/mockServiceWorker.js",
                "temp/**",
                ".temp/**",
            ],
            "🌍 Global: Ignore Patterns"
        ),
        gitignore({
            cwd: rootDirectory,
            files: [".gitignore", ".eslintignore"],
            filesGitModules: [".gitmodules"],
            name: "🌍 Global: .gitignore Rules",
            recursive: false,
            root: true,
            strict: false,
        }),
        // Stylistic.configs.customize({
        //     arrowParens: true,
        //     blockSpacing: true,
        //     braceStyle: "stroustrup",
        //     commaDangle: "always-multiline",
        //     experimental: true,
        //     // The following options are the default values
        //     indent: 4,
        //     jsx: true,
        //     pluginName: "@stylistic",
        //     quoteProps: "as-needed",
        //     quotes: 'double',
        //     semi: true,
        //     severity: "warn",
        //     // ...
        //   }),

        // #endregion
        // #region 🧭 Custom Global Rules
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: Custom Global Rules
        // ═══════════════════════════════════════════════════════════════════════════════
        // Add any global rules here that don't fit within specific plugin configs or that require custom options
        // {
        //     files: ["example.md"],
        //     languageOptions: {
        //         parser: example,
        //         parserOptions: { jsonSyntax: "example" },
        //     },
        //     plugins: ["example"],
        //     rules: {
        //         "example/example": "error",
        //     },
        // },
        // #endregion
        // #region 🗣️ Global Language Options
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION:  Global Language Options
        // ═══════════════════════════════════════════════════════════════════════════════
        // Intentionally left empty.
        // #region ⚙️ Global Settings
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION:  Global Settings
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            name: "🌍 Global: Settings",
            settings: {
                "import-x/resolver": {
                    node: true, // Don't warn about multiple projects
                },
                "import-x/resolver-next": [
                    createTypeScriptImportResolver({
                        alwaysTryTypes: true, // Always try to resolve types under `<root>@types` directory even if it doesn't contain any source code, like `@types/unist`
                        bun: true, // Resolve Bun modules (https://github.com/import-js/eslint-import-resolver-typescript#bun) // Don't warn about multiple projects
                        // Use an array.
                        project: [...tsconfigPaths],
                    }),
                ],
            },
        },
        // #endregion
        {
            files: ["**/*.d.{ts,tsx,mts,cts}"],
            languageOptions: {
                parser: tseslintParser,
                parserOptions: {
                    ecmaVersion: "latest",
                    jsDocParsingMode: "all",
                    sourceType: "module",
                    warnOnUnsupportedTypeScriptVersion: true,
                },
            },
            name: "🗄️ Type Declarations: TypeScript Parser",
            rules: {
                "import-x/unambiguous": "off",
            },
        },
        // #endregion
        // #region 🧱 Base Flat Configs
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION:  Base Flat Configs
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            ...importX.flatConfigs.typescript,
            files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}"],
            name: "📦 Import-X: TypeScript (code files only)",
        },
        {
            ...sonarjsConfigs.recommended,
            files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}"],
            name: "📦 SonarJS: Recommended (code files only)",
            rules: {
                ...sonarjsConfigs.recommended.rules,
                "sonarjs/arguments-usage": "warn",
                "sonarjs/array-constructor": "warn",
                "sonarjs/aws-iam-all-resources-accessible": "warn",
                "sonarjs/cognitive-complexity": ["warn", 30],
                "sonarjs/comment-regex": "warn",
                "sonarjs/cyclomatic-complexity": [
                    "warn",
                    {
                        threshold: 25,
                    },
                ],
                "sonarjs/declarations-in-global-scope": "off",
                "sonarjs/different-types-comparison": "off",
                "sonarjs/elseif-without-else": "warn",
                "sonarjs/expression-complexity": ["warn", { max: 10 }],
                "sonarjs/for-in": "warn",
                "sonarjs/max-union-size": [
                    "warn",
                    {
                        threshold: 8,
                    },
                ],
                "sonarjs/nested-control-flow": [
                    "warn",
                    {
                        maximumNestingLevel: 6,
                    },
                ],
                "sonarjs/no-built-in-override": "warn",
                "sonarjs/no-collapsible-if": "warn",
                "sonarjs/no-duplicate-string": [
                    "warn",
                    {
                        ignoreStrings: "application/json",
                        threshold: 7,
                    },
                ],
                "sonarjs/no-for-in-iterable": "warn",
                "sonarjs/no-function-declaration-in-block": "warn",
                "sonarjs/no-implicit-dependencies": "warn",
                "sonarjs/no-inconsistent-returns": "warn",
                "sonarjs/no-incorrect-string-concat": "warn",
                "sonarjs/no-nested-conditional": "off",
                "sonarjs/no-nested-incdec": "warn",
                "sonarjs/no-nested-switch": "warn",
                "sonarjs/no-reference-error": "warn",
                "sonarjs/no-require-or-define": "warn",
                "sonarjs/no-return-type-any": "warn",
                "sonarjs/no-sonar-comments": "error",
                "sonarjs/no-undefined-assignment": "warn",
                "sonarjs/no-unused-function-argument": "warn",
                "sonarjs/non-number-in-arithmetic-expression": "warn",
                "sonarjs/operation-returning-nan": "warn",
                "sonarjs/prefer-immediate-return": "warn",
                "sonarjs/shorthand-property-grouping": "off",
                "sonarjs/strings-comparison": "warn",
                "sonarjs/too-many-break-or-continue-in-loop": "warn",
            },
        },
        {
            files: ["**/*.d.ts"],
            name: "📦 Import-X: TypeScript declarations (no unambiguous)",
            rules: {
                "import-x/unambiguous": "off",
            },
        },
        {
            ...docusaurus2.configs.all,
            rules: {
                ...docusaurus2.configs.experimental.rules,
                ...docusaurus2.configs["strict-mdx-upgrade"].rules,
                ...docusaurus2.configs.content.rules,
                "docusaurus-2/local-search-will-not-work-in-dev": "off",
            },
        },
        {
            files: [
                "tsconfig*.json",
                "**/tsconfig*.json",
                "**/.*tsconfig.*.json",
                "**/tsconfig*.*.json",
            ],
            ...tsconfig.configs.strictest,
            rules: {
                ...tsconfig.configs.all.rules,
            },
        },
        remark.configs.all,
        progress.configs["recommended-ci"],
        copilot.configs.all,
        sdl.configs.required,
        githubActions.configs.all,
        ...(runtimeCleanupPlugin === null
            ? []
            : [
                  withoutProjectServiceParserOption(
                      runtimeCleanupPlugin.configs.all
                  ),
              ]),
        ...(testSignalPlugin === null ? [] : [testSignalPlugin.configs.all]),
        vite.configs.all,
        stylelint2.configs.all,
        {
            ...repo.configs.recommended,
            // prettier-ignore
            rules: {
                ...repo.configs.recommended.rules,
                "repo-compliance/require-aws-amplify-artifacts-base-directory": "off",
                "repo-compliance/require-aws-amplify-artifacts-base-directory-relative-path": "off",
                "repo-compliance/require-aws-amplify-artifacts-files": "off",
                "repo-compliance/require-aws-amplify-artifacts-files-non-empty": "off",
                "repo-compliance/require-aws-amplify-build-commands": "off",
                "repo-compliance/require-aws-amplify-config-file": "off",
                "repo-compliance/require-aws-amplify-version": "off",
                "repo-compliance/require-aws-amplify-version-value": "off",
                "repo-compliance/require-azure-pipelines-config-file": "off",
                "repo-compliance/require-azure-pipelines-execution-plan": "off",
                "repo-compliance/require-azure-pipelines-name": "off",
                "repo-compliance/require-azure-pipelines-pr-branches": "off",
                "repo-compliance/require-azure-pipelines-pr-trigger": "off",
                "repo-compliance/require-azure-pipelines-trigger": "off",
                "repo-compliance/require-azure-pipelines-trigger-branches": "off",
                "repo-compliance/require-azure-pipelines-trigger-include-branches": "off",
                "repo-compliance/require-bitbucket-pipelines-clone-depth": "off",
                "repo-compliance/require-bitbucket-pipelines-config-file": "off",
                "repo-compliance/require-bitbucket-pipelines-default-pipeline": "off",
                "repo-compliance/require-bitbucket-pipelines-image-pinned-tag": "off",
                "repo-compliance/require-bitbucket-pipelines-max-time": "off",
                "repo-compliance/require-bitbucket-pipelines-pull-requests": "off",
                "repo-compliance/require-bitbucket-pipelines-pull-requests-target-branches": "off",
                "repo-compliance/require-bitbucket-pipelines-step-name": "off",
                "repo-compliance/require-copilot-instructions-file": "warn",
                "repo-compliance/require-digitalocean-app-spec-component": "off",
                "repo-compliance/require-digitalocean-app-spec-file": "off",
                "repo-compliance/require-digitalocean-app-spec-name": "off",
                "repo-compliance/require-digitalocean-app-spec-name-value": "off",
                "repo-compliance/require-digitalocean-app-spec-region": "off",
                "repo-compliance/require-digitalocean-app-spec-region-lowercase": "off",
                "repo-compliance/require-digitalocean-app-spec-region-value": "off",
                "repo-compliance/require-dockerfile": "off",
                "repo-compliance/require-dockerfile-base-image-tag": "off",
                "repo-compliance/require-dockerfile-cmd-or-entrypoint": "off",
                "repo-compliance/require-dockerfile-first-instruction-from": "off",
                "repo-compliance/require-dockerfile-from-instruction": "off",
                "repo-compliance/require-dockerfile-user": "off",
                "repo-compliance/require-dockerfile-workdir": "off",
                "repo-compliance/require-dockerignore-file": "off",
                "repo-compliance/require-forgejo-actions-concurrency": "off",
                "repo-compliance/require-forgejo-actions-job-timeout-minutes": "off",
                "repo-compliance/require-forgejo-actions-no-write-all-permissions": "off",
                "repo-compliance/require-forgejo-actions-pinned-sha": "off",
                "repo-compliance/require-forgejo-actions-workflow-dispatch": "off",
                "repo-compliance/require-forgejo-actions-workflow-file": "off",
                "repo-compliance/require-forgejo-actions-workflow-name": "off",
                "repo-compliance/require-forgejo-actions-workflow-permissions": "off",
                "repo-compliance/require-forgejo-actions-workflow-trigger-coverage": "off",
                "repo-compliance/require-gitlab-ci-cache-policy": "off",
                "repo-compliance/require-gitlab-ci-config-file": "off",
                "repo-compliance/require-gitlab-ci-default-timeout": "off",
                "repo-compliance/require-gitlab-ci-interruptible": "off",
                "repo-compliance/require-gitlab-ci-merge-request-pipelines": "off",
                "repo-compliance/require-gitlab-ci-needs-dag": "off",
                "repo-compliance/require-gitlab-ci-rules-over-only-except": "off",
                "repo-compliance/require-gitlab-ci-security-scanning": "off",
                "repo-compliance/require-gitlab-ci-stages": "off",
                "repo-compliance/require-gitlab-ci-workflow-rules": "off",
                "repo-compliance/require-gitlab-issue-template-file": "off",
                "repo-compliance/require-gitlab-merge-request-template-file": "off",
                "repo-compliance/require-google-cloud-build-config-file": "off",
                "repo-compliance/require-google-cloud-build-step-name": "off",
                "repo-compliance/require-google-cloud-build-steps": "off",
                "repo-compliance/require-google-cloud-build-steps-non-empty": "off",
                "repo-compliance/require-google-cloud-build-timeout": "off",
                "repo-compliance/require-google-cloud-build-timeout-format": "off",
                "repo-compliance/require-google-cloud-build-timeout-max": "off",
                "repo-compliance/require-google-cloud-build-timeout-positive": "off",
                "repo-compliance/require-netlify-build-command": "off",
                "repo-compliance/require-netlify-build-command-non-empty": "off",
                "repo-compliance/require-netlify-build-publish-directory": "off",
                "repo-compliance/require-netlify-build-section": "off",
                "repo-compliance/require-netlify-config-file": "off",
                "repo-compliance/require-netlify-publish-directory-no-trailing-slash": "off",
                "repo-compliance/require-netlify-publish-directory-non-empty": "off",
                "repo-compliance/require-netlify-publish-relative-path": "off",
                "repo-compliance/require-pr-template-checklist-items": "warn",
                "repo-compliance/require-readme-badges": "warn",
                "repo-compliance/require-readme-sections": "off",
                "repo-compliance/require-vercel-build-command": "off",
                "repo-compliance/require-vercel-config-file": "off",
                "repo-compliance/require-vercel-config-object": "off",
                "repo-compliance/require-vercel-schema": "off",
                "repo-compliance/require-vercel-schema-url": "off",
                "repo-compliance/require-vercel-valid-json": "off",
                "repo-compliance/require-vercel-version-value": "off",
            },
        },
        repo.configs.github,
        repo.configs.dependabot,
        repo.configs.node,
        {
            ...typedoc.configs.recommended,
            name: "⌨️ TypeDoc: recommended (repo tuned)",
            rules: {
                ...typedoc.configs.recommended.rules,
                "typedoc/no-empty-private-remarks-tag": "warn",
                "typedoc/no-extra-type-param-tags": "warn",
                "typedoc/no-unknown-tags": "warn",
                "typedoc/require-code-fence-language": "warn",
                "typedoc/require-default-value-tag": "off",
                "typedoc/require-example-tag": "off",
                "typedoc/require-package-documentation": "off",
                "typedoc/require-package-documentation-description": "off",
                "typedoc/require-param-tag-description": "off",
                "typedoc/require-param-tags": "off",
                "typedoc/require-returns-description": "off",
                "typedoc/require-returns-tag": "off",
                "typedoc/require-see-tag-link": "warn",
                "typedoc/require-since-tag-description": "off",
                "typedoc/require-throws-description": "off",
                "typedoc/require-throws-tag": "warn",
                "typedoc/require-type-param-tag-description": "off",
                "typedoc/require-type-param-tags": "off",
            },
        },
        {
            ...immutable.configs.all,
            files: ["functional/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}"],
            name: "🧩 Immutable: functional (not used in this repo)",
        },
        {
            ...writeGoodComments.configs.all,
            files: ["src/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}"],
            name: "📝 Write Good Comments: (not used in this repo)",
            rules: {
                "write-good-comments/inclusive-language-comments": "off",
                "write-good-comments/no-profane-comments": "off",
                "write-good-comments/readability-comments": "off",
                "write-good-comments/spellcheck-comments": "off",
                "write-good-comments/task-comment-format": "off",
                "write-good-comments/write-good-comments": "off",
            },
        },
        fileProgressOverridesConfig,
        {
            ...noBarrelFiles.flat,
            files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}"],
            name: "🛑 No Barrel Files (code files only)",
        },
        {
            ...nitpick.configs.recommended,
            files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}"],
            name: "📝 Nitpick: recommended (code files only)",
        },
        {
            ...comments.recommended,
            files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}"],
            name: "💬 ESLint comments: recommended (code files only)",
        },
        {
            ...arrayFunc.configs.all,
            files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}"],
            name: "🧩 Array func: all (code files only)",
            rules: {
                ...arrayFunc.configs.all.rules,
                //  Always use spread. It's more performant and the TypeScript/JavaScript community standard.
                "array-func/prefer-array-from": "off",
            },
        },
        {
            files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}"],
            name: "🧩 De Morgan: recommended (code files only)",
            ...deMorgan.configs.recommended,
        },
        ...casePolice.configs.recommended.map((config) => ({
            ...config,
            plugins: {
                ...config.plugins,
                "case-police": casePoliceRulePlugin,
            },
        })),
        // ...jsdocPlugin.configs["examples-and-default-expressions"],
        // #endregion
        // #region 🧩 Custom Flat Configs
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION:  Github Config Rules
        // ═══════════════════════════════════════════════════════════════════════════════
        // NOTE:
        // `eslint-plugin-github` rules are written for JS/TS and assume the ESLint
        // rule context supports scope analysis (e.g. `context.getScope`). When
        // ESLint is linting non-JS languages (YAML via `yaml-eslint-parser`, TOML,
        // etc.), that API surface is not available and those rules can crash while
        // trying to bind missing methods.
        //
        // Scope GitHub rules to code files only so they never run on `.yml` like
        // `.codecov.yml`.
        // {
        //     ...github.getFlatConfigs().recommended,
        //     files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}"],
        //     name: "GitHub: recommended (code files only)",
        // },
        // {
        //     ...github.getFlatConfigs().react,
        //     files: ["**/*.{jsx,tsx}"],
        //     name: "GitHub: react (jsx/tsx only)",
        // },
        // ...github.getFlatConfigs().typescript.map(
        //     /**
        //      * @param {EslintConfig} config
        //      */
        //     (config) => ({
        //     ...config,
        //     files: ["**/*.{ts,tsx,cts,mts}"],
        //     name: config.name
        //         ? `GitHub: typescript (${config.name})`
        //         : "GitHub: typescript (ts/tsx only)",
        //     })
        // ),
        // #endregion
        // #region 📃 TSDoc Setup
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: 📃 TSDoc (tsdoc/*)
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/*.{ts,mts,cts,tsx}"],
            name: "⌨️ TSDoc: rules (TypeScript files)",
            plugins: {
                tsdoc: tsdoc,
            },
            rules: {
                "tsdoc/syntax": "warn",
            },
        },
        {
            files: ["src/**/*.{ts,mts,cts,tsx}"],
            name: "⌨️ TSDoc: rules (TypeScript files)",
            plugins: {
                "tsdoc-require-2": tsdocRequire,
            },
            rules: {
                "tsdoc-require-2/require": "warn",
                "tsdoc-require-2/require-abstract": "off",
                "tsdoc-require-2/require-alpha": "off",
                "tsdoc-require-2/require-author": "off",
                "tsdoc-require-2/require-beta": "off",
                "tsdoc-require-2/require-category": "off",
                "tsdoc-require-2/require-class": "off",
                "tsdoc-require-2/require-decorator": "off",
                "tsdoc-require-2/require-default-value": "off",
                "tsdoc-require-2/require-deprecated": "off",
                "tsdoc-require-2/require-document": "off",
                "tsdoc-require-2/require-enum": "off",
                "tsdoc-require-2/require-event": "off",
                "tsdoc-require-2/require-event-property": "off",
                "tsdoc-require-2/require-example": "off",
                "tsdoc-require-2/require-expand": "off",
                "tsdoc-require-2/require-experimental": "off",
                "tsdoc-require-2/require-function": "off",
                "tsdoc-require-2/require-group": "off",
                "tsdoc-require-2/require-hidden": "off",
                "tsdoc-require-2/require-hideconstructor": "off",
                "tsdoc-require-2/require-ignore": "off",
                "tsdoc-require-2/require-import": "off",
                "tsdoc-require-2/require-include": "off",
                "tsdoc-require-2/require-inherit-doc": "off",
                "tsdoc-require-2/require-inline": "off",
                "tsdoc-require-2/require-interface": "off",
                "tsdoc-require-2/require-internal": "off",
                "tsdoc-require-2/require-label": "off",
                "tsdoc-require-2/require-license": "off",
                "tsdoc-require-2/require-link": "off",
                "tsdoc-require-2/require-merge-module-with": "off",
                "tsdoc-require-2/require-module": "off",
                "tsdoc-require-2/require-namespace": "off",
                "tsdoc-require-2/require-overload": "off",
                "tsdoc-require-2/require-override": "off",
                "tsdoc-require-2/require-package-documentation": "off",
                "tsdoc-require-2/require-param": "off",
                "tsdoc-require-2/require-primary-export": "off",
                "tsdoc-require-2/require-private": "off",
                "tsdoc-require-2/require-private-remarks": "off",
                "tsdoc-require-2/require-property": "off",
                "tsdoc-require-2/require-protected": "off",
                "tsdoc-require-2/require-public": "off",
                "tsdoc-require-2/require-readonly": "off",
                "tsdoc-require-2/require-remarks": "off",
                "tsdoc-require-2/require-returns": "off",
                "tsdoc-require-2/require-sealed": "off",
                "tsdoc-require-2/require-see": "off",
                "tsdoc-require-2/require-since": "off",
                "tsdoc-require-2/require-sort-strategy": "off",
                "tsdoc-require-2/require-summary": "off",
                "tsdoc-require-2/require-template": "off",
                "tsdoc-require-2/require-throws": "off",
                "tsdoc-require-2/require-type-param": "off",
                "tsdoc-require-2/require-use-declared-type": "off",
                "tsdoc-require-2/require-virtual": "off",
                "tsdoc-require-2/restrict-tags": "off",
            },
        },
        // #endregion
        // #region 🎨 CSS files
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: CSS (css/*)
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/*.css"],
            ignores: ["docs/**", "**/test/**"],
            language: "css/css",
            languageOptions: {
                tolerant: true,
            },
            name: "🎨 CSS: All Files",
            plugins: {
                css: css,
                "css-modules": cssModules,
                "undefined-css-classes": undefinedCSS,
            },
            rules: {
                ...css.configs.recommended.rules,
                ...undefinedCSS.configs?.recommended?.rules,
                ...cssModules.configs.recommended.rules,
                // CSS Eslint Rules (css/*)
                "css/no-empty-blocks": "error",
                "css/no-invalid-at-rules": "warn",
                "css/no-invalid-properties": "warn",
                "css/prefer-logical-properties": "warn",
                "css/relative-font-units": "warn",
                "css/selector-complexity": "warn",
                "css/use-baseline": "warn",
                "css/use-layers": "off",
                // CSS Classes Rules (undefined-css-classes/*)
                "undefined-css-classes/no-undefined-css-classes": "warn",
            },
        },
        // #endregion
        // #region 🦖 Docusaurus files
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: Docusaurus (docusaurus/*)
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["docs/docusaurus/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}"],
            ignores: [
                "docs/docusaurus/.docusaurus/**",
                "docs/docusaurus/build/**",
                "docs/docusaurus/static/eslint-inspector/**",
            ],
            languageOptions: {
                parser: tseslintParser,
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true,
                        jsx: true,
                    },
                    ecmaVersion: "latest",
                    jsDocParsingMode: "all",
                    project: [...tsconfigPaths],
                    sourceType: "module",
                    tsconfigRootDir: rootDirectory,
                    warnOnUnsupportedTypeScriptVersion: true,
                },
            },
            name: "🦖 Docusaurus: Workspace Files",
            plugins: {
                "@docusaurus": docusaurus,
                "@eslint-react": react,
            },
            rules: {
                ...react.configs["strict-type-checked"].rules,
                "@docusaurus/no-html-links": "warn",
                "@docusaurus/no-untranslated-text": "off",
                "@docusaurus/prefer-docusaurus-heading": "warn",
                "@docusaurus/string-literal-i18n-messages": "off",
                "@eslint-react/dom-no-string-style-prop": "warn",
                "@eslint-react/dom-no-unknown-property": "warn",
                // Keep only the @eslint-react rules that are not already covered by
                // the current strict-type-checked preset and still exist after the
                // plugin upgrade.
                "@eslint-react/globals": "warn",
                "@eslint-react/immutability": "warn",
                "@eslint-react/jsx-no-leaked-dollar": "warn",
                "@eslint-react/no-duplicate-key": "warn",
                "@eslint-react/no-implicit-children": "warn",
                "@eslint-react/no-implicit-key": "warn",
                "@eslint-react/no-implicit-ref": "warn",
                "@eslint-react/no-missing-component-display-name": "warn",
                "@eslint-react/no-missing-context-display-name": "warn",
                "@eslint-react/refs": "warn",
                "@eslint-react/static-components": "warn",
                "@eslint-react/web-api-no-leaked-fetch": "warn",
                "@eslint-react/x-error-boundaries": "warn",
                "@eslint-react/x-exhaustive-deps": "warn",
                "@eslint-react/x-globals": "warn",
                "@eslint-react/x-immutability": "warn",
                "@eslint-react/x-no-access-state-in-setstate": "warn",
                "@eslint-react/x-no-array-index-key": "warn",
                "@eslint-react/x-no-children-count": "warn",
                "@eslint-react/x-no-children-for-each": "warn",
                "@eslint-react/x-no-children-map": "warn",
                "@eslint-react/x-no-children-only": "warn",
                "@eslint-react/x-no-children-to-array": "warn",
                "@eslint-react/x-no-class-component": "warn",
                "@eslint-react/x-no-clone-element": "warn",
                "@eslint-react/x-no-component-will-mount": "warn",
                "@eslint-react/x-no-component-will-receive-props": "warn",
                "@eslint-react/x-no-component-will-update": "warn",
                "@eslint-react/x-no-context-provider": "warn",
                "@eslint-react/x-no-create-ref": "warn",
                "@eslint-react/x-no-direct-mutation-state": "warn",
                "@eslint-react/x-no-duplicate-key": "warn",
                "@eslint-react/x-no-forward-ref": "warn",
                "@eslint-react/x-no-implicit-children": "warn",
                "@eslint-react/x-no-implicit-key": "warn",
                "@eslint-react/x-no-implicit-ref": "warn",
                "@eslint-react/x-no-leaked-conditional-rendering": "warn",
                "@eslint-react/x-no-missing-component-display-name": "warn",
                "@eslint-react/x-no-missing-context-display-name": "warn",
                "@eslint-react/x-no-missing-key": "warn",
                "@eslint-react/x-no-misused-capture-owner-stack": "warn",
                "@eslint-react/x-no-nested-component-definitions": "warn",
                "@eslint-react/x-no-nested-lazy-component-declarations": "warn",
                "@eslint-react/x-no-set-state-in-component-did-mount": "warn",
                "@eslint-react/x-no-set-state-in-component-did-update": "warn",
                "@eslint-react/x-no-set-state-in-component-will-update": "warn",
                "@eslint-react/x-no-unnecessary-use-prefix": "warn",
                "@eslint-react/x-no-unsafe-component-will-mount": "warn",
                "@eslint-react/x-no-unsafe-component-will-receive-props":
                    "warn",
                "@eslint-react/x-no-unsafe-component-will-update": "warn",
                "@eslint-react/x-no-unstable-context-value": "warn",
                "@eslint-react/x-no-unstable-default-props": "warn",
                "@eslint-react/x-no-unused-class-component-members": "warn",
                "@eslint-react/x-no-unused-props": "warn",
                "@eslint-react/x-no-unused-state": "warn",
                "@eslint-react/x-no-use-context": "warn",
                "@eslint-react/x-purity": "warn",
                "@eslint-react/x-refs": "warn",
                "@eslint-react/x-rules-of-hooks": "warn",
                "@eslint-react/x-set-state-in-effect": "warn",
                "@eslint-react/x-set-state-in-render": "warn",
                "@eslint-react/x-static-components": "warn",
                "@eslint-react/x-unsupported-syntax": "warn",
                "@eslint-react/x-use-memo": "warn",
                "@eslint-react/x-use-state": "warn",
            },
            settings: {
                ...react.configs["strict-type-checked"].settings,
            },
        },
        // #endregion
        // #region 🚢 Dogfood Plugin Overrides
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: 🚢 Dogfood Plugin Overrides
        // Pass `createConfig({ plugins: { typefest: localPlugin } })` from a
        // consuming eslint-plugin repo to lint against its local build/source plugin.
        // Pass `false`/`null` to disable that plugin's packaged rules entirely.
        // ═══════════════════════════════════════════════════════════════════════════════
        // #endregion
        // #region ⌨️ Typefest
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: ⌨️ Typefest (typefest/*)
        // ═══════════════════════════════════════════════════════════════════════════════
        ...(typefest === null
            ? []
            : [
                  {
                      files: [
                          "src/**/*.{ts,tsx,mts,cts}",
                          //    "test/**/*.{ts,tsx,mts,cts}"
                      ],
                      name: "⌨️ Typefest: Rules for Source",
                      plugins: {
                          typefest: typefest,
                      },
                      rules: {
                          ...typefest.configs.experimental.rules,
                      },
                  },
              ]),
        // #endregion
        // #region ⌨ Etc-Misc
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: ⌨ Etc-Misc (etc-misc/*)
        // ═══════════════════════════════════════════════════════════════════════════════
        ...(etcMisc === null
            ? []
            : [
                  {
                      files: [
                          "src/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                          //    "test/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}"
                      ],
                      name: "⌨️ Etc-Misc: Rules for Source",
                      plugins: {
                          "etc-misc": etcMisc,
                      },
                      // prettier-ignore
                      rules: {
                          // Enable rules as needed or the config:
                          // ...etcMisc.configs.recommended.rules

                         "etc-misc/class-match-filename": "off",
                          "etc-misc/comment-spacing": "off",
                          "etc-misc/consistent-empty-lines": "off",
                          "etc-misc/consistent-enum-members": "off",
                          "etc-misc/consistent-import": "off",
                          "etc-misc/consistent-optional-props": "off",
                          "etc-misc/consistent-symbol-description": "off",
                          "etc-misc/default-case": "off",
                          "etc-misc/disallow-import": "off",
                          "etc-misc/export-matching-filename-only": "off",
                          "etc-misc/match-filename": "off",
                          "etc-misc/max-identifier-blocks": "off",
                          "etc-misc/no-assign-mutated-array": "off",
                          "etc-misc/no-at-sign-import": "off",
                          "etc-misc/no-at-sign-internal-import": "off",
                          "etc-misc/no-chain-coalescence-mixture": "off",
                          "etc-misc/no-const-enum": "off",
                          "etc-misc/no-enum": "off",
                          "etc-misc/no-expression-empty-lines": "off",
                          "etc-misc/no-foreach": "off",
                          "etc-misc/no-function-declare-after-return": "warn",
                          "etc-misc/no-implicit-any-catch": "warn",
                          "etc-misc/no-index-import": "warn",
                          "etc-misc/no-internal": "off",
                          "etc-misc/no-internal-modules": "off",
                          "etc-misc/no-language-mixing": "off",
                          "etc-misc/no-misused-generics": "off",
                          "etc-misc/no-negated-conditions": "off",
                          "etc-misc/no-nodejs-modules": "off",
                          "etc-misc/no-param-reassign": "warn",
                          "etc-misc/no-sibling-import": "off",
                          "etc-misc/no-single-line-comment": "off",
                          "etc-misc/no-t": "off",
                          "etc-misc/no-underscore-export": "off",
                          "etc-misc/no-unnecessary-as-const": "off",
                          "etc-misc/no-unnecessary-break": "warn",
                          "etc-misc/no-unnecessary-initialization": "warn",
                          "etc-misc/no-unnecessary-template-literal": "warn",
                          "etc-misc/no-use-extend-native": "error",
                          "etc-misc/no-vulnerable": "error",
                          "etc-misc/no-writeonly": "off",
                          "etc-misc/object-format": "off",
                          "etc-misc/only-export-name": "off",
                          "etc-misc/prefer-arrow-function-property": "off",
                          "etc-misc/prefer-const-require": "warn",
                          "etc-misc/prefer-less-than": "off",
                          "etc-misc/prefer-only-export": "off",
                          "etc-misc/require-syntax": "off",
                          "etc-misc/restrict-identifier-characters": "off",
                          "etc-misc/sort-array": "off",
                          "etc-misc/sort-call-signature": "off",
                          "etc-misc/sort-construct-signature": "off",
                          "etc-misc/sort-export-specifiers": "off",
                          "etc-misc/sort-keys": "off",
                          "etc-misc/sort-top-comments": "off",
                          "etc-misc/template-literal-format": "off",
                          "etc-misc/throw-error": "warn",
                          "etc-misc/typescript/array-callback-return-type": "off",
                          "etc-misc/typescript/consistent-array-type-name": "off",
                          "etc-misc/typescript/define-function-in-one-statement": "off",
                          "etc-misc/typescript/no-boolean-literal-type": "off",
                          "etc-misc/typescript/no-complex-declarator-type": "off",
                          "etc-misc/typescript/no-complex-return-type": "off",
                          "etc-misc/typescript/no-multi-type-tuples": "off",
                          "etc-misc/typescript/no-never": "off",
                          "etc-misc/typescript/no-redundant-undefined-const": "off",
                          "etc-misc/typescript/no-redundant-undefined-default-parameter": "off",
                          "etc-misc/typescript/no-redundant-undefined-let": "off",
                          "etc-misc/typescript/no-redundant-undefined-optional": "off",
                          "etc-misc/typescript/no-redundant-undefined-promise-return-type": "off",
                          "etc-misc/typescript/no-redundant-undefined-readonly-property": "off",
                          "etc-misc/typescript/no-redundant-undefined-return-type": "off",
                          "etc-misc/typescript/no-redundant-undefined-var": "off",
                          "etc-misc/typescript/no-unsafe-object-assign": "off",
                          "etc-misc/typescript/no-unsafe-object-assignment": "off",
                          "etc-misc/typescript/prefer-array-type-alias": "off",
                          "etc-misc/typescript/prefer-class-method": "off",
                          "etc-misc/typescript/prefer-enum": "off",
                          "etc-misc/typescript/prefer-named-tuple-members": "off",
                          "etc-misc/typescript/prefer-readonly-array": "off",
                          "etc-misc/typescript/prefer-readonly-array-parameter": "off",
                          "etc-misc/typescript/prefer-readonly-index-signature": "off",
                          "etc-misc/typescript/prefer-readonly-map": "off",
                          "etc-misc/typescript/prefer-readonly-property": "off",
                          "etc-misc/typescript/prefer-readonly-record": "off",
                          "etc-misc/typescript/prefer-readonly-set": "off",
                          "etc-misc/typescript/require-prop-type-annotation": "off",
                          "etc-misc/typescript/require-readonly-array-property-type": "off",
                          "etc-misc/typescript/require-readonly-array-return-type": "off",
                          "etc-misc/typescript/require-readonly-array-type-alias": "off",
                          "etc-misc/typescript/require-readonly-map-parameter-type": "off",
                          "etc-misc/typescript/require-readonly-map-property-type": "off",
                          "etc-misc/typescript/require-readonly-map-return-type": "off",
                          "etc-misc/typescript/require-readonly-map-type-alias": "off",
                          "etc-misc/typescript/require-readonly-record-parameter-type": "off",
                          "etc-misc/typescript/require-readonly-record-property-type": "off",
                          "etc-misc/typescript/require-readonly-record-return-type": "off",
                          "etc-misc/typescript/require-readonly-record-type-alias": "off",
                          "etc-misc/typescript/require-readonly-set-parameter-type": "off",
                          "etc-misc/typescript/require-readonly-set-property-type": "off",
                          "etc-misc/typescript/require-readonly-set-return-type": "off",
                          "etc-misc/typescript/require-readonly-set-type-alias": "off",
                          "etc-misc/typescript/require-this-void": "off",
                          "etc-misc/underscore-internal": "off",
                      },
                  },
              ]),
        // #endregion
        // #region 🔌 Source Files
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: Source Files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: [
                "*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "src/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "test/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "benchmarks/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            ],
            ignores: ["plugin.mjs"],
            languageOptions: {
                globals: {
                    ...globals.builtin,
                    ...globals.browser,
                    ...globals.nodeBuiltin,
                },
                parser: tseslintParser,
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true,
                    },
                    ecmaVersion: "latest",
                    jsDocParsingMode: "all",
                    project: [...tsconfigPaths],
                    sourceType: "module",
                    tsconfigRootDir: rootDirectory,
                    warnOnUnsupportedTypeScriptVersion: true,
                },
            },
            name: "📂 Source Files - Src, Test, Benchmarks, and Root JS/TS files",
            plugins: {
                "@eslint-community/eslint-comments": eslintCommentsRulePlugin,
                "@typescript-eslint": tseslint,
                canonical: canonical,
                "comment-length": commentLength,
                "eslint-plugin": eslintPluginEslintPlugin,
                "etc-misc": etcMisc,
                "import-x": importX,
                jsdoc: jsdoc,
                listeners,
                math: math,
                "module-interop": moduleInterop,
                n: nodeRulePlugin,
                perfectionist: perfectionist,
                prettier: prettierBridge,
                promise: promise,
                regexp: regexp,
                sdl: sdlRulePlugin,
                security: security,
                "tsdoc-require-2": tsdocRequire,
                unicorn: unicorn,
                "unused-imports": unusedImports,
            },
            rules: {
                // TypeScript backend rules
                ...js.configs.all.rules,
                ...tseslint.configs["recommendedTypeChecked"],
                ...tseslint.configs["recommended"]?.rules,
                ...tseslint.configs["strictTypeChecked"],
                ...tseslint.configs["strict"]?.rules,
                ...tseslint.configs["stylisticTypeChecked"],
                ...tseslint.configs["stylistic"]?.rules,
                ...regexp.configs.all.rules,
                ...importX.flatConfigs.recommended.rules,
                ...importX.flatConfigs.electron.rules,
                ...importX.flatConfigs.typescript.rules,
                ...promise.configs["flat/recommended"].rules,
                ...unicorn.configs.all.rules,
                ...perfectionist.configs["recommended-natural"].rules,
                ...security.configs.recommended.rules,
                ...nodePlugin.configs["flat/all"].rules,
                ...math.configs.recommended.rules,
                ...canonical.configs.recommended.rules,
                ...listeners.configs.strict?.rules,
                ...moduleInterop.configs.recommended.rules,

                "@eslint-community/eslint-comments/no-restricted-disable":
                    "warn",
                "@eslint-community/eslint-comments/no-use": "off",
                "@eslint-community/eslint-comments/require-description": "warn",
                "@typescript-eslint/await-thenable": "error", // Prevent awaiting non-promises
                "@typescript-eslint/class-methods-use-this": "warn",
                "@typescript-eslint/consistent-return": "warn",
                // Function and type safety rules
                "@typescript-eslint/consistent-type-assertions": "error",
                "@typescript-eslint/consistent-type-exports": "warn",
                "@typescript-eslint/consistent-type-imports": "warn",
                "@typescript-eslint/default-param-last": "warn",
                "@typescript-eslint/dot-notation": [
                    "warn",
                    {
                        allowPattern: "^[A-Z0-9_]+$",
                    },
                ],
                "@typescript-eslint/explicit-function-return-type": "off",
                "@typescript-eslint/explicit-member-accessibility": "warn",
                "@typescript-eslint/explicit-module-boundary-types": "warn",
                "@typescript-eslint/init-declarations": "warn",
                "@typescript-eslint/max-params": [
                    "warn",
                    {
                        countVoidThis: false,
                        max: 20,
                    },
                ],
                "@typescript-eslint/member-ordering": "warn",
                "@typescript-eslint/method-signature-style": "warn",
                "@typescript-eslint/naming-convention": "off",
                "@typescript-eslint/no-array-delete": "warn",
                "@typescript-eslint/no-base-to-string": "warn",
                "@typescript-eslint/no-confusing-void-expression": "warn",
                "@typescript-eslint/no-deprecated": "error",
                "@typescript-eslint/no-dupe-class-members": "warn",
                "@typescript-eslint/no-duplicate-type-constituents": "warn",
                "@typescript-eslint/no-empty-function": [
                    "error",
                    {
                        allow: ["arrowFunctions"], // Allow empty arrow functions for React useEffect cleanup
                    },
                ],
                "@typescript-eslint/no-empty-object-type": "error",
                // Advanced type-checked rules for async safety and runtime error prevention
                "@typescript-eslint/no-floating-promises": [
                    "error",
                    {
                        ignoreIIFE: false, // Catch floating IIFEs which can cause issues
                        ignoreVoid: true, // Allow void for intentionally ignored promises
                    },
                ],
                "@typescript-eslint/no-for-in-array": "warn",
                "@typescript-eslint/no-implied-eval": "warn",
                // Keep enabled: Helps with bundle optimization and makes type vs runtime imports clearer.
                // Can be resolved incrementally as warnings.
                "@typescript-eslint/no-import-type-side-effects": "warn",
                "@typescript-eslint/no-invalid-this": "warn",
                "@typescript-eslint/no-loop-func": "warn",
                "@typescript-eslint/no-magic-numbers": "off",

                "@typescript-eslint/no-meaningless-void-operator": "warn",
                "@typescript-eslint/no-misused-promises": [
                    "error",
                    {
                        checksConditionals: true, // Check if Promises used in conditionals
                        checksSpreads: true, // Check Promise spreads
                        checksVoidReturn: true, // Critical for IPC handlers
                    },
                ],
                "@typescript-eslint/no-misused-spread": "warn",
                "@typescript-eslint/no-mixed-enums": "warn",
                "@typescript-eslint/no-redeclare": "warn",
                "@typescript-eslint/no-redundant-type-constituents": "warn",
                // Granular selector rules still need to be added manually here.
                "@typescript-eslint/no-restricted-imports": "warn",
                "@typescript-eslint/no-restricted-types": [
                    "error",
                    {
                        types: {
                            Function: {
                                message: [
                                    "The `Function` type accepts any function-like value.",
                                    "It provides no type safety when calling the function, which can be a common source of bugs.",
                                    "If you are expecting the function to accept certain arguments, you should explicitly define the function shape.",
                                    "Use '(...args: unknown[]) => unknown' for generic handlers or define specific function signatures.",
                                ].join("\n"),
                            },
                        },
                    },
                ],
                "@typescript-eslint/no-shadow": "warn",
                "@typescript-eslint/no-unnecessary-boolean-literal-compare":
                    "warn",
                "@typescript-eslint/no-unnecessary-condition": [
                    "warn",
                    {
                        allowConstantLoopConditions: true, // Allow while(true) patterns in services
                    },
                ],
                "@typescript-eslint/no-unnecessary-parameter-property-assignment":
                    "warn",
                "@typescript-eslint/no-unnecessary-qualifier": "warn",
                "@typescript-eslint/no-unnecessary-template-expression": "warn",
                "@typescript-eslint/no-unnecessary-type-arguments": "warn",
                // Enhanced type safety for backend services
                "@typescript-eslint/no-unnecessary-type-assertion": "error", // Remove redundant type assertions
                "@typescript-eslint/no-unnecessary-type-conversion": "warn",
                "@typescript-eslint/no-unnecessary-type-parameters": "warn",
                "@typescript-eslint/no-unsafe-argument": "warn", // Warn on passing any to typed parameters
                "@typescript-eslint/no-unsafe-assignment": "warn", // Warn on unsafe assignments to any
                "@typescript-eslint/no-unsafe-call": "warn", // Warn on calling any-typed functions
                "@typescript-eslint/no-unsafe-enum-comparison": "warn",
                "@typescript-eslint/no-unsafe-member-access": "warn", // Warn on accessing any-typed properties
                "@typescript-eslint/no-unsafe-return": "warn", // Warn on returning any from typed functions
                "@typescript-eslint/no-unsafe-type-assertion": "warn",
                "@typescript-eslint/no-unsafe-unary-minus": "warn",
                "@typescript-eslint/no-unused-private-class-members": "warn",
                "@typescript-eslint/no-use-before-define": "warn",
                "@typescript-eslint/no-useless-empty-export": "warn",
                "@typescript-eslint/no-wrapper-object-types": "error",
                "@typescript-eslint/non-nullable-type-assertion-style": "warn",
                "@typescript-eslint/only-throw-error": "warn",
                "@typescript-eslint/parameter-properties": "warn",
                "@typescript-eslint/prefer-enum-initializers": "warn",
                "@typescript-eslint/prefer-find": "warn",
                "@typescript-eslint/prefer-includes": "warn",
                "@typescript-eslint/prefer-nullish-coalescing": [
                    "error",
                    {
                        ignoreConditionalTests: false, // Check conditionals for nullish coalescing opportunities
                        ignoreMixedLogicalExpressions: false, // Check complex logical expressions
                    },
                ],
                "@typescript-eslint/prefer-optional-chain": "error", // Use optional chaining instead of logical AND
                "@typescript-eslint/prefer-promise-reject-errors": "warn",
                // Backend-specific type safety
                "@typescript-eslint/prefer-readonly": "warn", // Prefer readonly for service class properties
                // Keep signal strong on explicitly typed APIs while avoiding noisy
                // churn for inferred callback/test parameters.
                "@typescript-eslint/prefer-readonly-parameter-types": [
                    "warn",
                    {
                        allow: [
                            {
                                from: "lib",
                                name: ["Readonly"],
                            },
                            {
                                from: "package",
                                name: ["RuleContext", "SourceCode"],
                                package: "@typescript-eslint/utils",
                            },
                            {
                                from: "package",
                                name: [
                                    "BinaryExpression",
                                    "CallExpression",
                                    "Expression",
                                    "MemberExpression",
                                    "Node",
                                    "Program",
                                    "Statement",
                                    "ThrowStatement",
                                    "TSTypeReference",
                                    "TSUnionType",
                                    "TypeNode",
                                ],
                                package: "@typescript-eslint/types",
                            },
                            {
                                from: "package",
                                name: [
                                    "Signature",
                                    "Type",
                                    "TypeChecker",
                                ],
                                package: "typescript",
                            },
                        ],
                        ignoreInferredTypes: true,
                        treatMethodsAsReadonly: true,
                    },
                ],
                "@typescript-eslint/prefer-reduce-type-parameter": "warn",
                "@typescript-eslint/prefer-regexp-exec": "warn",
                "@typescript-eslint/prefer-return-this-type": "warn",
                "@typescript-eslint/prefer-string-starts-ends-with": "warn",
                // Configured: Allows non-async functions that return promises
                // (like utility wrappers around Promise.all).
                // But encourages async for most cases.
                "@typescript-eslint/promise-function-async": [
                    "warn",
                    {
                        allowAny: true,
                        allowedPromiseNames: ["Promise"],
                        checkArrowFunctions: false,
                    },
                ],
                "@typescript-eslint/related-getter-setter-pairs": "warn",
                "@typescript-eslint/require-array-sort-compare": "warn",
                "@typescript-eslint/require-await": "error", // Functions marked async must use await
                "@typescript-eslint/restrict-plus-operands": "warn",
                "@typescript-eslint/restrict-template-expressions": "warn",
                "@typescript-eslint/return-await": ["error", "in-try-catch"], // Proper await handling in try-catch
                "@typescript-eslint/strict-boolean-expressions": "warn",
                "@typescript-eslint/switch-exhaustiveness-check": "error", // Ensure switch statements are exhaustive
                "@typescript-eslint/unbound-method": "warn",
                "@typescript-eslint/use-unknown-in-catch-callback-variable":
                    "warn",
                "canonical/destructuring-property-newline": "off",
                "canonical/export-specifier-newline": "off",
                "canonical/filename-match-exported": "off",
                "canonical/filename-match-regex": "off", // Taken care of by unicorn rules
                "canonical/filename-no-index": "error",
                "canonical/id-match": "off",
                "canonical/import-specifier-newline": "off",
                "canonical/no-barrel-import": "error",
                "canonical/no-export-all": "error",
                "canonical/no-import-namespace-destructure": "warn",
                "canonical/no-re-export": "warn",
                "canonical/no-reassign-imports": "error",
                "canonical/no-restricted-imports": "off",
                "canonical/prefer-import-alias": [
                    "off",
                    {
                        aliases: [
                            {
                                alias: "@plugin/",
                                matchParent: rootDirectory,
                                matchPath: "^plugin/",
                                maxRelativeDepth: 0,
                            },
                        ],
                    },
                ],
                "canonical/prefer-inline-type-import": "off",
                "canonical/prefer-react-lazy": "off",
                "canonical/prefer-use-mount": "warn",
                "canonical/sort-react-dependencies": "warn",
                "capitalized-comments": [
                    "error",
                    "always",
                    {
                        ignoreConsecutiveComments: true,
                        ignoreInlineComments: true,
                        ignorePattern:
                            "pragma|ignored|import|prettier|eslint|tslint|copyright|license|eslint-disable|@ts-.*|jsx-a11y.*|@eslint.*|global|jsx|jsdoc|prettier|istanbul|jcoreio|metamask|microsoft|no-unsafe-optional-chaining|no-unnecessary-type-assertion|no-non-null-asserted-optional-chain|no-non-null-asserted-nullish-coalescing|@typescript-eslint.*|@docusaurus.*|@react.*|boundaries.*|depend.*|deprecation.*|etc.*|ex.*|functional.*|import-x.*|import-zod.*|jsx-a11y.*|loadable-imports.*|math.*|n.*|neverthrow.*|no-constructor-bind.*|no-explicit-type-exports.*|no-lookahead-lookbehind-regexp.*|no-secrets.*|no-unary-plus.*|no-unawaited-dot-catch-throw.*|no-unsanitized.*|no-use-extend-native.*|observers.*|prefer-arrow.*|perfectionist.*|prettier.*|promise.*|react.*|react-hooks.*|react-hooks-addons.*|redos.*|regexp.*|require-jsdoc.*|safe-jsx.*|security.*|sonarjs.*|sort-class-members.*|sort-destructure-keys.*|sort-keys-fix.*|sql-template.*|ssr-friendly.*|styled-components-a11y.*|switch-case.*|total-functions.*|tsdoc.*|unicorn.*|unused-imports.*|usememo-recommendations.*|validate-jsx-nesting.*|write-good-comments.*|xss.*|v8.*|c8.*|istanbul.*|nyc.*|codecov.*|coveralls.*|c8-coverage.*|codecov-coverage.*",
                    },
                ],
                "class-methods-use-this": "off", // Use the TypeScript version of this rule which is more type-aware and works better with class properties and React components.
                "comment-length/limit-multi-line-comments": [
                    "warn",
                    {
                        ignoreCommentsWithCode: false,
                        ignoreUrls: true,
                        logicalWrap: true,
                        maxLength: 120,
                        mode: "compact-on-overflow",
                        semanticComments: [
                            "@abstract",
                            "@async",
                            "@author",
                            "@callback",
                            "@constructs",
                            "@deprecated",
                            "@emits",
                            "@event",
                            "@example",
                            "@fires",
                            "@generator",
                            "@internal",
                            "@link",
                            "@listens",
                            "@memberof",
                            "@mixes",
                            "@mixin",
                            "@module",
                            "@namespace",
                            "@override",
                            "@packageDocumentation",
                            "@param",
                            "@private",
                            "@protected",
                            "@public",
                            "@readonly",
                            "@remarks",
                            "@returns",
                            "@see",
                            "@since",
                            "@template",
                            "@typeParam",
                            "@typedef",
                            "@version",
                            "@virtual",
                            "@yields",
                            "*`*",
                        ],
                        tabSize: 4,
                    },
                ],
                "comment-length/limit-single-line-comments": [
                    "warn",
                    {
                        ignoreCommentsWithCode: false,
                        ignoreUrls: true,
                        logicalWrap: true,
                        maxLength: 120,
                        mode: "compact-on-overflow",
                        semanticComments: [
                            "@abstract",
                            "@async",
                            "@author",
                            "@callback",
                            "@constructs",
                            "@deprecated",
                            "@emits",
                            "@event",
                            "@example",
                            "@fires",
                            "@generator",
                            "@internal",
                            "@link",
                            "@listens",
                            "@memberof",
                            "@mixes",
                            "@mixin",
                            "@module",
                            "@namespace",
                            "@override",
                            "@packageDocumentation",
                            "@param",
                            "@private",
                            "@protected",
                            "@public",
                            "@readonly",
                            "@remarks",
                            "@returns",
                            "@see",
                            "@since",
                            "@template",
                            "@typeParam",
                            "@typedef",
                            "@version",
                            "@virtual",
                            "@yields",
                            "*`*",
                        ],
                        tabSize: 4,
                    },
                ],
                "comment-length/limit-tagged-template-literal-comments": [
                    "warn",
                    {
                        ignoreCommentsWithCode: false,
                        ignoreUrls: true,
                        logicalWrap: true,
                        maxLength: 120,
                        mode: "compact-on-overflow",
                        semanticComments: [
                            "@abstract",
                            "@async",
                            "@author",
                            "@callback",
                            "@constructs",
                            "@deprecated",
                            "@emits",
                            "@event",
                            "@example",
                            "@fires",
                            "@generator",
                            "@internal",
                            "@link",
                            "@listens",
                            "@memberof",
                            "@mixes",
                            "@mixin",
                            "@module",
                            "@namespace",
                            "@override",
                            "@packageDocumentation",
                            "@param",
                            "@private",
                            "@protected",
                            "@public",
                            "@readonly",
                            "@remarks",
                            "@returns",
                            "@see",
                            "@since",
                            "@template",
                            "@typeParam",
                            "@typedef",
                            "@version",
                            "@virtual",
                            "@yields",
                            "*`*",
                        ],
                        tabSize: 4,
                    },
                ],
                curly: "off",
                "dot-notation": "off", // Use the TypeScript version instead
                eqeqeq: "off", // Use the TypeScript version instead
                "eslint-plugin/consistent-output": "error",
                "eslint-plugin/fixer-return": "error",
                "eslint-plugin/meta-property-ordering": [
                    "error",
                    [
                        "defaultOptions",
                        "deprecated",
                        "docs",
                        "fixable",
                        "hasSuggestions",
                        "messages",
                        "replacedBy",
                        "schema",
                        "type",
                    ],
                ],
                "eslint-plugin/no-deprecated-context-methods": "error",
                "eslint-plugin/no-deprecated-report-api": "error",
                "eslint-plugin/no-identical-tests": "error",
                "eslint-plugin/no-matching-violation-suggest-message-ids":
                    "error",
                "eslint-plugin/no-meta-replaced-by": "error",
                "eslint-plugin/no-meta-schema-default": "error",
                "eslint-plugin/no-missing-message-ids": "error",
                "eslint-plugin/no-missing-placeholders": "error",
                "eslint-plugin/no-only-tests": "error",
                "eslint-plugin/no-property-in-node": "error",
                "eslint-plugin/no-unused-message-ids": "error",
                "eslint-plugin/no-unused-placeholders": "error",
                "eslint-plugin/no-useless-token-range": "error",
                "eslint-plugin/prefer-message-ids": "error",
                "eslint-plugin/prefer-object-rule": "error",
                "eslint-plugin/prefer-output-null": "error",
                "eslint-plugin/prefer-placeholders": "warn",
                "eslint-plugin/prefer-replace-text": "error",
                "eslint-plugin/report-message-format": "warn",
                "eslint-plugin/require-meta-default-options": "error",
                "eslint-plugin/require-meta-docs-description": "warn",
                "eslint-plugin/require-meta-docs-recommended": "warn",
                "eslint-plugin/require-meta-docs-url": "error",
                "eslint-plugin/require-meta-fixable": "error",
                "eslint-plugin/require-meta-has-suggestions": "error",
                "eslint-plugin/require-meta-schema": "error",
                "eslint-plugin/require-meta-schema-description": "error",
                "eslint-plugin/require-meta-type": "error",
                "eslint-plugin/require-test-case-name": "warn",
                "eslint-plugin/test-case-property-ordering": "warn",
                "eslint-plugin/test-case-shorthand-strings": "error",
                "eslint-plugin/unique-test-case-names": "error",
                "func-style": "off",
                "id-length": "off",
                "import-x/consistent-type-specifier-style": "off",
                "import-x/default": "warn",
                "import-x/dynamic-import-chunkname": "off",
                "import-x/export": "warn",
                "import-x/exports-last": "off",
                "import-x/extensions": "warn",
                "import-x/first": "warn",
                "import-x/group-exports": "off",
                "import-x/named": "warn",
                "import-x/namespace": "warn",
                "import-x/newline-after-import": "warn",
                "import-x/no-absolute-path": "warn",
                "import-x/no-amd": "warn",
                "import-x/no-anonymous-default-export": "warn",
                "import-x/no-commonjs": "warn",
                "import-x/no-cycle": "warn",
                "import-x/no-default-export": "off",
                "import-x/no-deprecated": "warn",
                "import-x/no-duplicates": "warn",
                "import-x/no-dynamic-require": "warn",
                "import-x/no-empty-named-blocks": "warn",
                "import-x/no-extraneous-dependencies": "warn",
                "import-x/no-import-module-exports": "warn",
                "import-x/no-internal-modules": "off",
                "import-x/no-mutable-exports": "warn",
                "import-x/no-named-as-default": "off",
                "import-x/no-named-as-default-member": "off",
                "import-x/no-named-default": "warn",
                "import-x/no-named-export": "off",
                "import-x/no-namespace": "off",
                "import-x/no-nodejs-modules": "off",
                "import-x/no-relative-packages": "warn",
                "import-x/no-relative-parent-imports": "off",
                "import-x/no-rename-default": "warn",
                "import-x/no-restricted-paths": "warn",
                "import-x/no-self-import": "warn",
                "import-x/no-unassigned-import": [
                    "error",
                    {
                        allow: ["**/*.css", "**/*.scss"], // Allow CSS imports without assignment
                    },
                ],
                "import-x/no-unresolved": "warn",
                "import-x/no-unused-modules": [
                    "warn",
                    {
                        missingExports: true,
                        suppressMissingFileEnumeratorAPIWarning: true,
                    },
                ],
                "import-x/no-useless-path-segments": "warn",
                "import-x/no-webpack-loader-syntax": "warn",
                "import-x/order": "off",
                "import-x/prefer-default-export": "off",
                "import-x/prefer-namespace-import": "off",
                "import-x/unambiguous": "warn",
                "math/abs": "warn",
                "math/prefer-exponentiation-operator": "warn",
                "math/prefer-math-sum-precise": "warn",
                "max-lines": "off",
                "max-lines-per-function": [
                    "error",
                    {
                        IIFEs: false,
                        max: 750,
                        skipBlankLines: true,
                        skipComments: true,
                    },
                ],
                "max-params": "off",
                "max-statements": "off",
                "module-interop/no-import-cjs": "off",
                "module-interop/no-require-esm": "warn",
                "n/file-extension-in-import": "off",
                // Deprecated Rule: https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/no-hide-core-modules.md
                //  This is deprecated since v4.2.0. This rule was based on an invalid assumption.
                // @see https://github.com/mysticatea/eslint-plugin-node/issues/69
                "n/no-hide-core-modules": "off",
                "n/no-missing-file-extension": "off",
                "n/no-missing-import": "off",
                // Deprecated Rule: Old alias for hashbang
                // @see https://github.com/eslint-community/eslint-plugin-n/issues/529
                "n/shebang": "off",
                "no-empty-character-class": "error",
                "no-inline-comments": "off", // Allow inline comments for complex logic explanations
                "no-invalid-regexp": "error",
                "no-magic-numbers": "off",
                "no-ternary": "off",
                "no-undefined": "off", // Use explicit `undefined` for clarity and type safety
                "no-unexpected-multiline": "off",
                "no-useless-backreference": "error",
                "no-void": "off",
                "object-shorthand": "off",
                "one-var": "off",
                "perfectionist/sort-arrays": [
                    "warn",
                    {
                        customGroups: [],
                        fallbackSort: { type: "unsorted" },
                        groups: ["literal"],
                        ignoreCase: true,
                        newlinesBetween: "ignore",
                        newlinesInside: "ignore",
                        order: "asc",
                        partitionByNewLine: false,
                        specialCharacters: "keep",
                        type: "natural",
                        useConfigurationIf: {
                            matchesAstSelector:
                                "TSAsExpression > ArrayExpression",
                        },
                    },
                ],
                "prefer-arrow-callback": [
                    "warn",
                    { allowNamedFunctions: true, allowUnboundThis: true },
                ],
                "prefer-destructuring": "off",
                "promise/no-multiple-resolved": "warn",
                "promise/prefer-await-to-callbacks": "off",
                "promise/prefer-await-to-then": "warn",
                "promise/prefer-catch": "warn",
                "promise/spec-only": "warn",
                "require-await": "off", // Use the TypeScript version of this rule which is more type-aware and works better with async functions in general.
                "require-unicode-regexp": "off",
                "sdl/no-nonnull-assertion-on-security-input": "error",
                "sdl/no-trusted-types-policy-pass-through": "error",
                "sdl/no-unsafe-cast-to-trusted-types": "error",
                "security/detect-non-literal-fs-filename": "warn",
                "security/detect-object-injection": "off",
                "sort-imports": "off",
                "sort-keys": "off",
                "sort-vars": "off",
                "unicorn/consistent-destructuring": "off",
                "unicorn/empty-brace-spaces": "off",
                "unicorn/import-style": [
                    "error",
                    {
                        styles: {
                            fs: {
                                default: false,
                                named: true,
                                namespace: true,
                            },
                            // ─────────────────────────────────────────────────────────────
                            // crypto: disallow default imports, allow named + namespace
                            // (named is most common; namespace is sometimes handy)
                            // ─────────────────────────────────────────────────────────────
                            "node:crypto": {
                                default: false,
                                named: true,
                                namespace: true,
                            },
                            // ─────────────────────────────────────────────────────────────
                            // Filesystem: disallow default imports, but allow named + namespace
                            // (named is ergonomic; namespace is useful for vi.spyOn(fs, "..."))
                            // ─────────────────────────────────────────────────────────────
                            "node:fs": {
                                default: false,
                                named: true,
                                namespace: true,
                            },
                            "node:fs/promises": {
                                default: false,
                                named: true,
                                namespace: true,
                            },
                            // ─────────────────────────────────────────────────────────────
                            // Node “path-like” modules: allow ONLY namespace imports
                            // (prevents `import path from "node:path"` which relies on default interop)
                            // ─────────────────────────────────────────────────────────────
                            "node:path": { default: false, namespace: true },
                            "node:path/posix": {
                                default: false,
                                namespace: true,
                            },
                            "node:path/win32": {
                                default: false,
                                namespace: true,
                            },
                            // ─────────────────────────────────────────────────────────────
                            // timers/promises: named is the common usage
                            // ─────────────────────────────────────────────────────────────
                            "node:timers/promises": { named: true },
                            // ─────────────────────────────────────────────────────────────
                            // util: keep unicorn’s intent (named only)
                            // ─────────────────────────────────────────────────────────────
                            "node:util": { named: true },
                            path: { default: false, namespace: true }, // Just in case any non-node: path remains
                            util: { named: true },
                        },
                    },
                ],
                "unicorn/no-keyword-prefix": [
                    "error",
                    {
                        checkProperties: false,
                        disallowedPrefixes: [
                            "interface",
                            "type",
                            "enum",
                        ],
                    },
                ], // Allow "class" prefix for className and other legitimate uses
                "unicorn/no-nested-ternary": "off", // Allow nested ternaries for concise conditional types
                "unicorn/no-null": "off",
                "unicorn/no-useless-undefined": "off",
                "unicorn/number-literal-case": "off", // Allow uppercase hex literals for consistency with JS/TS community
                "unicorn/prevent-abbreviations": "off",
                "unicorn/template-indent": "off", // Disable to allow flexible indentation in complex template literals
                "unused-imports/no-unused-imports": "error",
                "unused-imports/no-unused-vars": "error",
            },
        },
        {
            files: ["src/shared-config.ts"],
            name: "🧩 Repo Internal: shared-config.ts compatibility overrides",
            rules: {
                "@typescript-eslint/no-unsafe-assignment": "off",
                "@typescript-eslint/no-unsafe-member-access": "off",
                "@typescript-eslint/no-unsafe-type-assertion": "off",
                "import-x/no-rename-default": "off",
            },
        },
        // #endregion
        // #region 🧪 Internal Tooling
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: 🧪 Internal Tooling
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: [
                "test/**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "test/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            ],
            name: "🧪 ESLint Plugin Tests: internal tooling",
            rules: {
                "@typescript-eslint/array-type": "off",
                "@typescript-eslint/no-floating-promises": "off",
                "@typescript-eslint/no-unsafe-assignment": "off",
                canonical: "off",
                "n/no-sync": "off",
                "n/no-unpublished-import": "off",
                "unicorn/no-array-callback-reference": "off",
                "unicorn/prefer-at": "off",
                "unicorn/prefer-spread": "off",
            },
        },
        // #endregion
        // #region 🧪 Tests
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: 🧪 Tests
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: [
                "test/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "tests/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "src/test/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "benchmarks/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "benchmark/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            ],
            languageOptions: {
                globals: {
                    ...globals.builtin,
                    ...globals.nodeBuiltin,
                    ...globals.commonjs,
                    ...vitest.environments.env.globals,
                    createTypedRuleSelectorAwarePassThrough: "readonly",
                },
                parser: tseslintParser,
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true,
                    },
                    ecmaVersion: "latest",
                    jsDocParsingMode: "all",
                    project: [...tsconfigPaths],
                    sourceType: "module",
                    tsconfigRootDir: rootDirectory,
                    warnOnUnsupportedTypeScriptVersion: true,
                },
            },
            name: "🧪 Tests: Tests, Benchmarks",
            plugins: {
                "@typescript-eslint": tseslint,
                "no-only-tests": noOnly,
                "testing-library": testingLibrary,
                vitest: vitest,
            },
            rules: {
                ...vitest.configs.all.rules,
                ...testingLibrary.configs["flat/react"].rules,
                "@typescript-eslint/no-empty-function": "off", // Empty mocks/stubs are common
                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/no-restricted-types": "off", // Tests may need generic Function types
                "@typescript-eslint/no-shadow": "off",
                "@typescript-eslint/no-unnecessary-condition": "off",
                "@typescript-eslint/no-unsafe-enum-comparison": "off",
                "@typescript-eslint/no-unsafe-function-type": "off", // Tests may use generic handlers
                "@typescript-eslint/no-unsafe-type-assertion": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/no-use-before-define": "off", // Allow use before define in tests
                "@typescript-eslint/no-useless-default-assignment": "warn",
                "@typescript-eslint/strict-void-return": "warn",
                "@typescript-eslint/unbound-method": "off",
                "default-case": "off",
                "func-name-matching": "off", // Allow function names to not match variable names
                "func-names": "off",
                "init-declarations": "off",
                "max-classes-per-file": "off",
                "max-depth": "off",
                "new-cap": "off", // Allow new-cap for class constructors
                "no-await-in-loop": "off", // Allow await in loops for sequential operations
                "no-barrel-files/no-barrel-files": "off", // Allow barrel files in tests for convenience
                "no-console": "off",
                "no-loop-func": "off", // Allow functions in loops for test setups
                "no-new": "off", // Allow new for class constructors
                // No Only Tests
                "no-only-tests/no-only-tests": "error",
                "no-plusplus": "off",
                "no-promise-executor-return": "off", // Allow returning values from promise executors
                "no-redeclare": "off", // Allow redeclaring variables in tests
                "no-shadow": "off",
                "no-throw-literal": "off",
                "no-undef-init": "off",
                "no-underscore-dangle": "off",
                "no-use-before-define": "off", // Allow use before define in tests
                "no-useless-assignment": "off",
                "security/detect-non-literal-fs-filename": "off",
                "sonarjs/no-duplicate-string": "off",
                "testing-library/await-async-queries": "error",
                "testing-library/consistent-data-testid": [
                    "warn",
                    {
                        testIdAttribute: ["data-testid"],
                        testIdPattern:
                            "^[a-z]+([A-Z][a-z]+)*(-[a-z]+([A-Z][a-z]+)*)*$", // Kebab-case or camelCase
                    },
                ],
                "testing-library/no-await-sync-queries": "error",
                "testing-library/no-debugging-utils": "off",
                "testing-library/no-node-access": "off",
                "testing-library/no-test-id-queries": "warn",
                "testing-library/prefer-explicit-assert": "warn",
                "testing-library/prefer-implicit-assert": "warn",
                "testing-library/prefer-query-matchers": "warn",
                "testing-library/prefer-screen-queries": "warn",
                "testing-library/prefer-user-event": "warn",
                "testing-library/prefer-user-event-setup": "warn",
                "unicorn/consistent-function-scoping": "off", // Tests often use different scoping
                "unicorn/filename-case": "off", // Allow test files to have any case

                "unicorn/no-await-expression-member": "off", // Allow await in test expressions
                "vitest/max-expects": ["warn", { max: 20 }], // Encourage more focused tests, but allow flexibility when neededq
                // Needs update to not use deprecated alias methods like
                // Replace toThrow() with its canonical name oThrowError()
                "vitest/no-alias-methods": "warn",
                "vitest/no-commented-out-tests": "warn",
                "vitest/no-conditional-expect": "warn",
                "vitest/no-disabled-tests": "warn",
                "vitest/no-focused-tests": "warn",
                "vitest/no-identical-title": "warn",
                "vitest/no-import-node-test": "warn",
                "vitest/no-interpolation-in-snapshots": "warn",
                "vitest/no-standalone-expect": "warn",
                "vitest/no-test-prefixes": "warn",
                "vitest/prefer-called-exactly-once-with": "warn",
                "vitest/prefer-called-once": "warn",
                // Conflicts with `prefer-called-once` for `.toHaveBeenCalledTimes(1)`.
                // Keep the more specific once-only rule enabled.
                "vitest/prefer-called-times": "off",
                "vitest/prefer-called-with": "warn",
                "vitest/prefer-comparison-matcher": "warn",
                "vitest/prefer-describe-function-title": "warn",
                "vitest/prefer-expect-assertions": "warn",
                "vitest/prefer-expect-resolves": "warn",
                // Vitest's autofix currently rewrites to `expectTypeOf(...).toBeFunction()`
                // which does not typecheck with the current expect-type typings.
                "vitest/prefer-expect-type-of": "warn",
                "vitest/prefer-mock-return-shorthand": "warn",
                "vitest/prefer-spy-on": "warn",
                "vitest/prefer-strict-boolean-matchers": "off",
                "vitest/prefer-strict-equal": "warn",
                "vitest/prefer-to-be": "warn",
                "vitest/prefer-to-be-falsy": "warn",
                "vitest/prefer-to-be-object": "warn",
                "vitest/prefer-to-be-truthy": "warn",
                "vitest/prefer-to-contain": "warn",
                "vitest/prefer-to-have-length": "warn",
                "vitest/prefer-todo": "warn",
                "vitest/prefer-vi-mocked": "warn",
                "vitest/require-hook": "off",
                "vitest/require-mock-type-parameters": "warn",
                "vitest/require-test-timeout": "off",
                "vitest/valid-expect": "warn",
                "vitest/valid-title": "warn",
                "vitest/warn-todo": "warn",
            },
            settings: {
                "import-x/resolver": {
                    node: true,
                    project: [...tsconfigPaths],
                    // You will also need to install and configure the TypeScript resolver
                    // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
                    typescript: true,
                },
                "import/resolver": {
                    // You will also need to install and configure the TypeScript resolver
                    // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
                    typescript: {
                        alwaysTryTypes: true, // Always try to resolve types under `<root>@types` directory even if it doesn't contain any source code, like `@types/unist`
                        project: [...tsconfigPaths],
                    },
                },
                n: {
                    allowModules: [
                        "electron",
                        "node",
                        "electron-devtools-installer",
                    ],
                },
                vitest: {
                    typecheck: true,
                },
            },
        },
        {
            files: [
                "benchmark/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "benchmarks/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            ],
            name: "🧪 Benchmarks: benchmark/** and benchmarks/**",
            rules: {
                "@typescript-eslint/no-unsafe-enum-comparison": "off",
                "unicorn/no-negated-condition": "off",
                "unicorn/no-typeof-undefined": "off",
            },
        },
        // #endregion
        // #region 📦 Package.json Linting
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: Package.json Linting
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/package.json"],
            languageOptions: {
                parser: jsoncEslintParser,
                parserOptions: { jsonSyntax: "JSON" },
            },
            name: "📦 Package: **/Package.json",
            plugins: {
                depend: depend,
                json: json,
                "node-dependencies": nodeDepends,
                "package-json": packageJson,
            },
            rules: {
                ...json.configs.recommended.rules,

                "depend/ban-dependencies": "error",
                // NOTE: Keeping node-dependencies scoped to package.json avoids perf + parser issues.
                "node-dependencies/absolute-version": [
                    "error",
                    "never", // Or always
                ],
                // Can be noisy depending on how transitive deps declare engines.
                "node-dependencies/compat-engines": "off",
                "node-dependencies/no-deprecated": [
                    "error",
                    {
                        allows: ["prettier-plugin-packagejson"],
                        devDependencies: true,
                    },
                ],
                "node-dependencies/no-dupe-deps": "error",
                "node-dependencies/no-restricted-deps": "off",
                "node-dependencies/prefer-caret-range-version": "error",
                "node-dependencies/prefer-tilde-range-version": "off",
                // This rule is currently not viable for most ecosystems (many packages
                // do not publish provenance metadata consistently).
                "node-dependencies/require-provenance-deps": "off",
                "node-dependencies/valid-semver": "error",
                "package-json/bin-name-casing": "warn",
                "package-json/exports-subpaths-style": "warn",
                "package-json/no-empty-fields": "warn",
                "package-json/no-redundant-files": "off",
                "package-json/no-redundant-publishConfig": "warn",
                "package-json/order-properties": "warn",
                "package-json/repository-shorthand": "warn",
                "package-json/require-attribution": "warn",
                "package-json/require-author": "warn",
                // Not a CLI package.
                "package-json/require-bin": "off",
                "package-json/require-bugs": "warn",
                "package-json/require-bundleDependencies": "off",
                // Optional metadata for this repository.
                "package-json/require-contributors": "warn",
                "package-json/require-cpu": "off",
                "package-json/require-dependencies": "warn",
                "package-json/require-description": "warn",
                "package-json/require-devDependencies": "warn",
                // Optional and currently uncommon metadata field.
                "package-json/require-devEngines": "warn",
                // Legacy npm field, not needed for this plugin package.
                "package-json/require-directories": "off",
                "package-json/require-engines": "warn",
                "package-json/require-exports": [
                    "error",
                    {
                        ignorePrivate: true,
                    },
                ],
                "package-json/require-files": "warn",
                // Optional for this project.
                "package-json/require-funding": "off",
                "package-json/require-homepage": "warn",
                "package-json/require-keywords": "warn",
                "package-json/require-license": "warn",
                "package-json/require-main": "warn",
                // Not a manpage-distributed package.
                "package-json/require-man": "off",
                "package-json/require-module": "off",
                "package-json/require-name": "warn",
                "package-json/require-optionalDependencies": "off",
                "package-json/require-os": "off",
                "package-json/require-packageManager": "warn",
                "package-json/require-peerDependencies": "warn",
                "package-json/require-private": "warn",
                "package-json/require-publishConfig": "warn",
                "package-json/require-repository": "error",
                "package-json/require-scripts": "warn",
                "package-json/require-sideEffects": "warn",
                "package-json/require-type": [
                    "error",
                    {
                        ignorePrivate: true,
                    },
                ],
                "package-json/require-types": [
                    "error",
                    {
                        ignorePrivate: true,
                    },
                ],
                "package-json/require-version": "warn",
                "package-json/restrict-dependency-ranges": "warn",
                "package-json/restrict-private-properties": "warn",
                // Package.json Plugin Rules (package-json/*)
                "package-json/restrict-top-level-properties": [
                    "error",
                    {
                        ban: [
                            {
                                message:
                                    "Configure Babel in a dedicated config file.",
                                property: "babel",
                            },
                            {
                                message:
                                    "Configure Browserslist in a dedicated config file.",
                                property: "browserslist",
                            },
                            {
                                message:
                                    "Configure commitlint in a dedicated config file.",
                                property: "commitlint",
                            },
                            {
                                message:
                                    "Configure ESLint in a dedicated config file.",
                                property: "eslintConfig",
                            },
                            {
                                message:
                                    "Configure Jest in a dedicated config file.",
                                property: "jest",
                            },
                            {
                                message:
                                    "Configure lint-staged in a dedicated config file.",
                                property: "lint-staged",
                            },
                            {
                                message:
                                    "Configure pnpm in a dedicated config file.",
                                property: "pnpm",
                            },
                            {
                                message:
                                    "Configure Prettier in a dedicated config file.",
                                property: "prettier",
                            },
                            {
                                message:
                                    "Configure release-it in a dedicated config file.",
                                property: "release-it",
                            },
                            {
                                message:
                                    "Configure Renovate in a dedicated config file.",
                                property: "renovate",
                            },
                            {
                                message:
                                    "Configure Stylelint in a dedicated config file.",
                                property: "stylelint",
                            },
                            {
                                message:
                                    "Configure TypeDoc in a dedicated config file.",
                                property: "typedoc",
                            },
                        ],
                    },
                ],
                // This repo intentionally uses stable camelCase script names.
                "package-json/scripts-name-casing": "warn",
                "package-json/sort-collections": [
                    "warn",
                    [
                        "config",
                        "dependencies",
                        "devDependencies",
                        "exports",
                        "optionalDependencies",
                        // "overrides",
                        "peerDependencies",
                        "peerDependenciesMeta",
                        "scripts",
                    ],
                ],
                "package-json/specify-peers-locally": "warn",
                "package-json/unique-dependencies": "warn",
                "package-json/valid-author": "warn",
                "package-json/valid-bin": "warn",
                "package-json/valid-bugs": "warn",
                "package-json/valid-bundleDependencies": "warn",
                "package-json/valid-config": "warn",
                "package-json/valid-contributors": "warn",
                "package-json/valid-cpu": "warn",
                "package-json/valid-dependencies": "warn",
                "package-json/valid-description": "warn",
                "package-json/valid-devDependencies": "warn",
                "package-json/valid-devEngines": "warn",
                "package-json/valid-directories": "warn",
                "package-json/valid-engines": "warn",
                "package-json/valid-exports": "warn",
                "package-json/valid-files": "warn",
                "package-json/valid-funding": "warn",
                "package-json/valid-homepage": "warn",
                "package-json/valid-keywords": "warn",
                "package-json/valid-license": "warn",
                "package-json/valid-main": "warn",
                "package-json/valid-man": "warn",
                "package-json/valid-module": "warn",
                "package-json/valid-name": "warn",
                "package-json/valid-optionalDependencies": "warn",
                "package-json/valid-os": "warn",
                // Deprecated upstream rule; retained as explicit off until removed.
                "package-json/valid-package-definition": "off",
                "package-json/valid-packageManager": "warn",
                "package-json/valid-peerDependencies": "warn",
                "package-json/valid-private": "warn",
                "package-json/valid-publishConfig": "warn",
                "package-json/valid-repository": "warn",
                "package-json/valid-repository-directory": "warn",
                "package-json/valid-scripts": "warn",
                "package-json/valid-sideEffects": "warn",
                "package-json/valid-type": "warn",
                "package-json/valid-version": "warn",
                "package-json/valid-workspaces": "warn",
            },
        },
        {
            files: ["docs/docusaurus/package.json"],
            name: "📦 Package: Docusaurus Private Override",
            rules: {
                "package-json/restrict-private-properties": "off",
            },
        },
        // #endregion
        // #region 📝 Markdown files (with Remark linting)
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: Markdown (md/*, markdown/*, markup/*, atom/*, rss/*)
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/*.{md,markup,atom,rss,markdown}"],
            ignores: [
                "**/docs/packages/**",
                "**/docs/TSDoc/**",
                "**/.github/agents/**",
            ],
            language: "markdown/gfm",
            name: "📝 Markdown: **/*.{MD,MARKUP,ATOM,RSS,MARKDOWN} (with Remark)",
            plugins: {
                markdown: markdown,
            },
            rules: {
                "markdown/fenced-code-language": "warn",
                "markdown/fenced-code-meta": ["warn", "never"],
                "markdown/heading-increment": "warn",
                "markdown/no-bare-urls": "warn",
                "markdown/no-duplicate-definitions": "warn",
                "markdown/no-duplicate-headings": "warn",
                "markdown/no-empty-definitions": "warn",
                "markdown/no-empty-images": "warn",
                "markdown/no-empty-links": "warn",
                "markdown/no-html": "off",
                "markdown/no-invalid-label-refs": "warn",
                "markdown/no-missing-atx-heading-space": "warn",
                "markdown/no-missing-label-refs": "warn",
                "markdown/no-missing-link-fragments": "warn",
                "markdown/no-multiple-h1": "warn",
                "markdown/no-reference-like-urls": "warn",
                "markdown/no-reversed-media-syntax": "warn",
                "markdown/no-space-in-emphasis": "warn",
                "markdown/no-unused-definitions": "warn",
                "markdown/require-alt-text": "warn",
                "markdown/table-column-count": "warn",
            },
        },
        // #endregion
        // #region 🧾 YAML/YML files
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: YAML/YML files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/*.{yaml,yml}"],
            ignores: [],
            language: "yml/yaml",
            languageOptions: {
                parser: yamlEslintParser,
                // Options used with yaml-eslint-parser.
                parserOptions: {
                    defaultYAMLVersion: "1.2",
                },
            },
            name: "🧾 YAML/YML: **/*.{YAML,YML}",
            plugins: {
                ...jsonSchemaValidatorPlugins,
                yml: yml,
            },
            rules: {
                ...jsonSchemaValidatorRules,
                "yml/block-mapping": "warn",
                "yml/block-mapping-colon-indicator-newline": "error",
                "yml/block-mapping-question-indicator-newline": "error",
                "yml/block-sequence": "warn",
                "yml/block-sequence-hyphen-indicator-newline": "error",
                "yml/file-extension": "off",
                "yml/flow-mapping-curly-newline": "error",
                "yml/flow-mapping-curly-spacing": "error",
                "yml/flow-sequence-bracket-newline": "error",
                "yml/flow-sequence-bracket-spacing": "error",
                "yml/indent": "off",
                "yml/key-name-casing": "off",
                "yml/key-spacing": "error",
                "yml/no-empty-document": "error",
                "yml/no-empty-key": "error",
                "yml/no-empty-mapping-value": "error",
                "yml/no-empty-sequence-entry": "error",
                "yml/no-irregular-whitespace": "error",
                "yml/no-multiple-empty-lines": "error",
                "yml/no-tab-indent": "error",
                "yml/no-trailing-zeros": "error",
                "yml/plain-scalar": "off",
                "yml/quotes": "error",
                "yml/require-string-key": "error",
                // Re-enabled: eslint-plugin-yml v2.0.1 fixes the diff-sequences
                // import crash (TypeError: diff is not a function).
                "yml/sort-keys": "error",
                "yml/sort-sequence-values": "off",
                "yml/spaced-comment": "warn",
                "yml/vue-custom-block/no-parsing-error": "warn",
            },
        },
        // #endregion
        // #region 🌐 HTML files
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: HTML files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/*.{html,htm,xhtml}"],
            ignores: ["report/**"],
            languageOptions: {
                parser: htmlParser,
            },
            name: "🌐 HTML: **/*.{HTML,HTM,XHTML}",
            plugins: {
                html: html,
            },
            rules: {
                ...html.configs.recommended.rules,
                "html/class-spacing": "warn",
                "html/css-no-empty-blocks": "warn",
                "html/head-order": "warn",
                "html/id-naming-convention": "warn",
                "html/indent": "error",
                "html/lowercase": "warn",
                "html/max-element-depth": "warn",
                "html/no-abstract-roles": "warn",
                "html/no-accesskey-attrs": "warn",
                "html/no-aria-hidden-body": "warn",
                "html/no-aria-hidden-on-focusable": "warn",
                "html/no-duplicate-class": "warn",
                "html/no-empty-headings": "warn",
                "html/no-extra-spacing-tags": [
                    "error",
                    { enforceBeforeSelfClose: true },
                ],
                "html/no-extra-spacing-text": "warn",
                "html/no-heading-inside-button": "warn",
                "html/no-ineffective-attrs": "warn",
                // HTML Eslint Plugin Rules (html/*)
                "html/no-inline-styles": "warn",
                "html/no-invalid-attr-value": "warn",
                "html/no-invalid-entity": "warn",
                "html/no-invalid-role": "warn",
                "html/no-multiple-empty-lines": "warn",
                "html/no-nested-interactive": "warn",
                "html/no-non-scalable-viewport": "warn",
                "html/no-positive-tabindex": "warn",
                "html/no-redundant-role": "warn",
                "html/no-restricted-attr-values": "warn",
                "html/no-restricted-attrs": "warn",
                "html/no-restricted-tags": "warn",
                "html/no-script-style-type": "warn",
                "html/no-skip-heading-levels": "warn",
                "html/no-target-blank": "warn",
                "html/no-trailing-spaces": "warn",
                "html/no-whitespace-only-children": "warn",
                "html/prefer-https": "warn",
                "html/require-attrs": "warn",
                "html/require-button-type": "warn",
                // Conflicts with prettier
                "html/require-closing-tags": "off",
                "html/require-content": "warn",
                "html/require-details-summary": "warn",
                "html/require-explicit-size": "warn",
                "html/require-form-method": "warn",
                "html/require-frame-title": "warn",
                "html/require-input-label": "warn",
                "html/require-meta-charset": "warn",
                "html/require-meta-description": "warn",
                "html/require-meta-viewport": "warn",
                "html/require-open-graph-protocol": "warn",
                "html/sort-attrs": "warn",
                "html/svg-require-viewbox": "warn",
            },
        },
        // #endregion
        // #region 🧾 JSONC/JSON files
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: JSONC (jsonc/*)
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/*.jsonc", ".vscode/*.json"],
            ignores: [],
            name: "🧾 JSONC: **/*.JSONC",
            // ═══════════════════════════════════════════════════════════════════════════════
            // Plugin Config for eslint-plugin-jsonc to enable Prettier formatting
            // ═══════════════════════════════════════════════════════════════════════════════
            ...jsonc.configs["flat/prettier"][0],
            language: "json/jsonc",
            languageOptions: {
                parser: jsoncEslintParser,
                parserOptions: { jsonSyntax: "JSON" },
            },
            plugins: {
                json: json,
                jsonc: jsonc,
                ...jsonSchemaValidatorPlugins,
                "no-secrets": noSecrets,
            },
            rules: {
                ...json.configs.recommended.rules,
                "jsonc/array-bracket-newline": "warn",
                "jsonc/array-bracket-spacing": "warn",
                "jsonc/array-element-newline": "off", // Handled by Prettier
                "jsonc/auto": "warn",
                "jsonc/comma-dangle": "warn",
                "jsonc/comma-style": "warn",
                "jsonc/indent": "off", // Handled by Prettier
                "jsonc/key-name-casing": "off",
                "jsonc/key-spacing": "warn",
                "jsonc/no-bigint-literals": "warn",
                "jsonc/no-binary-expression": "warn",
                "jsonc/no-binary-numeric-literals": "warn",
                "jsonc/no-comments": "warn",
                "jsonc/no-dupe-keys": "warn",
                "jsonc/no-escape-sequence-in-identifier": "warn",
                "jsonc/no-floating-decimal": "warn",
                "jsonc/no-hexadecimal-numeric-literals": "warn",
                "jsonc/no-infinity": "warn",
                "jsonc/no-irregular-whitespace": "warn",
                "jsonc/no-multi-str": "warn",
                "jsonc/no-nan": "warn",
                "jsonc/no-number-props": "warn",
                "jsonc/no-numeric-separators": "warn",
                "jsonc/no-octal": "warn",
                "jsonc/no-octal-escape": "warn",
                "jsonc/no-octal-numeric-literals": "warn",
                "jsonc/no-parenthesized": "warn",
                "jsonc/no-plus-sign": "warn",
                "jsonc/no-regexp-literals": "warn",
                "jsonc/no-sparse-arrays": "warn",
                "jsonc/no-template-literals": "warn",
                "jsonc/no-undefined-value": "warn",
                "jsonc/no-unicode-codepoint-escapes": "warn",
                "jsonc/no-useless-escape": "warn",
                "jsonc/object-curly-newline": "warn",
                "jsonc/object-curly-spacing": "warn",
                "jsonc/object-property-newline": "warn",
                "jsonc/quote-props": "warn",
                "jsonc/quotes": "warn",
                "jsonc/sort-array-values": [
                    "error",
                    {
                        order: { type: "asc" },
                        pathPattern: "^files$", // Hits the files property
                    },
                    {
                        order: [
                            "eslint",
                            "eslintplugin",
                            "eslint-plugin",
                            {
                                // Fallback order
                                order: { type: "asc" },
                            },
                        ],
                        pathPattern: "^keywords$", // Hits the keywords property
                    },
                ],
                "jsonc/sort-keys": [
                    "error",
                    // For example, a definition for package.json
                    {
                        order: [
                            "name",
                            "version",
                            "private",
                            "publishConfig",
                            // ...
                        ],
                        pathPattern: "^$", // Hits the root properties
                    },
                    {
                        order: { type: "asc" },
                        pathPattern:
                            "^(?:dev|peer|optional|bundled)?[Dd]ependencies$",
                    },
                    // ...
                ],
                "jsonc/space-unary-ops": "warn",
                "jsonc/valid-json-number": "warn",
                "jsonc/vue-custom-block/no-parsing-error": "warn",
                "no-secrets/no-secrets": [
                    "error",
                    {
                        tolerance: 5,
                    },
                ],
            },
        },
        // #endregion
        // #region 🧾 JSON files
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: JSON (json/*)
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/*.json"],
            // Package.json has a dedicated config block above that uses jsonc-eslint-parser
            // (needed for some package.json-specific tooling rules).
            ignores: ["**/package.json"],
            language: "json/json",
            name: "🧾 JSON: **/*.JSON",
            plugins: {
                json: json,
                ...jsonSchemaValidatorPlugins,
                "no-secrets": noSecrets,
            },
            rules: {
                ...json.configs.recommended.rules,
                ...jsonSchemaValidatorRules,
                "json/sort-keys": ["warn"],
                "json/top-level-interop": "warn",
                "no-secrets/no-secrets": [
                    "error",
                    {
                        tolerance: 5,
                    },
                ],
            },
        },
        // #endregion
        // #region 🧾 JSON5 files
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: JSON5 (json5/*)
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/*.json5"],
            language: "json/json5",
            name: "🧾 JSON5: **/*.JSON5",
            plugins: {
                json: json,
                ...jsonSchemaValidatorPlugins,
                "no-secrets": noSecrets,
            },
            rules: {
                ...json.configs.recommended.rules,
                ...jsonSchemaValidatorRules,
                "no-secrets/no-secrets": [
                    "error",
                    {
                        tolerance: 5,
                    },
                ],
            },
        },
        // #endregion
        // #region 🧾 TOML files
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: TOML (toml/*)
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/*.toml"],
            ignores: ["lychee.toml"],
            languageOptions: {
                parser: tomlEslintParser,
                parserOptions: { tomlVersion: "1.0.0" },
            },
            name: "🧾 TOML: **/*.TOML",
            plugins: { toml: toml },
            rules: {
                // TOML Eslint Plugin Rules (toml/*)
                "toml/array-bracket-newline": "warn",
                "toml/array-bracket-spacing": "warn",
                "toml/array-element-newline": "warn",
                "toml/comma-style": "warn",
                "toml/indent": "off",
                "toml/inline-table-curly-newline": "warn",
                "toml/inline-table-curly-spacing": "warn",
                "toml/inline-table-key-value-newline": "warn",
                "toml/key-spacing": "off",
                "toml/keys-order": "warn",
                "toml/no-mixed-type-in-array": "warn",
                "toml/no-non-decimal-integer": "warn",
                "toml/no-space-dots": "warn",
                "toml/no-unreadable-number-separator": "warn",
                "toml/padding-line-between-pairs": "warn",
                "toml/padding-line-between-tables": "warn",
                "toml/precision-of-fractional-seconds": "warn",
                "toml/precision-of-integer": "warn",
                "toml/quoted-keys": "warn",
                "toml/spaced-comment": "warn",
                "toml/table-bracket-spacing": "warn",
                "toml/tables-order": "warn",
                "toml/vue-custom-block/no-parsing-error": "warn",
            },
        },
        // #endregion
        // #region 📚 JS JsDoc
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: JS JsDoc
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/*.{js,cjs,mjs,jsx}"],
            languageOptions: {
                globals: {
                    ...globals.builtin,
                    ...globals.nodeBuiltin,
                    ...globals.commonjs,
                },
            },
            name: "📚 JSDoc: **/*.{JS,CJS,MJS,JSX}",
            plugins: {
                jsdoc: jsdoc,
            },
            rules: {
                // Start from upstream defaults for JS so new recommended rules are
                // picked up automatically when eslint-plugin-jsdoc updates.
                ...jsdoc.configs["flat/recommended"].rules,
                "jsdoc/check-access": "warn", // Recommended
                "jsdoc/check-alignment": "warn", // Recommended
                "jsdoc/check-indentation": "off",
                "jsdoc/check-line-alignment": "off",
                "jsdoc/check-param-names": "warn", // Recommended
                "jsdoc/check-property-names": "warn", // Recommended
                "jsdoc/check-syntax": "warn",
                "jsdoc/check-tag-names": "warn", // Recommended
                "jsdoc/check-template-names": "warn",
                "jsdoc/check-types": "warn", // Recommended
                "jsdoc/check-values": "warn", // Recommended
                "jsdoc/convert-to-jsdoc-comments": "warn",
                "jsdoc/empty-tags": "warn", // Recommended
                "jsdoc/escape-inline-tags": "warn", // Recommended for TS configs
                "jsdoc/implements-on-classes": "warn", // Recommended
                "jsdoc/imports-as-dependencies": "warn",
                "jsdoc/informative-docs": "warn",
                "jsdoc/lines-before-block": "warn",
                "jsdoc/match-description": "warn",
                "jsdoc/match-name": "off",
                "jsdoc/multiline-blocks": "warn", // Recommended
                "jsdoc/no-bad-blocks": "warn",
                "jsdoc/no-blank-block-descriptions": "warn",
                "jsdoc/no-blank-blocks": "warn",
                "jsdoc/no-defaults": "warn", // Recommended
                "jsdoc/no-missing-syntax": "off",
                "jsdoc/no-multi-asterisks": "warn", // Recommended
                "jsdoc/no-restricted-syntax": "off",
                "jsdoc/no-types": "off", // Recommended for TS configs
                "jsdoc/no-undefined-types": "warn", // Too noisy for tooling scripts
                "jsdoc/prefer-import-tag": "warn",
                "jsdoc/reject-any-type": "warn",
                "jsdoc/reject-function-type": "warn",
                "jsdoc/require-asterisk-prefix": "warn",
                "jsdoc/require-description": "off",
                "jsdoc/require-description-complete-sentence": "off",
                "jsdoc/require-example": "off",
                "jsdoc/require-file-overview": "off",
                "jsdoc/require-hyphen-before-param-description": "warn",
                "jsdoc/require-jsdoc": "warn", // Recommended
                "jsdoc/require-next-description": "warn",
                "jsdoc/require-next-type": "warn", // Recommended
                "jsdoc/require-param": "off", // Too noisy for tooling scripts
                "jsdoc/require-param-description": "off", // Too noisy for tooling scripts
                "jsdoc/require-param-name": "warn", // Recommended
                "jsdoc/require-param-type": "warn",
                "jsdoc/require-property": "warn", // Recommended
                "jsdoc/require-property-description": "warn", // Recommended
                "jsdoc/require-property-name": "warn", // Recommended
                "jsdoc/require-property-type": "warn", // Recommended in non-TS configs
                "jsdoc/require-rejects": "off", // Too noisy for tooling scripts
                "jsdoc/require-returns": "off", // Too noisy for tooling scripts
                "jsdoc/require-returns-check": "warn", // Recommended
                "jsdoc/require-returns-description": "off", // Too noisy for tooling scripts
                "jsdoc/require-returns-type": "warn",
                "jsdoc/require-tags": "off",
                "jsdoc/require-template": "warn",
                "jsdoc/require-template-description": "warn",
                "jsdoc/require-throws": "warn",
                "jsdoc/require-throws-description": "warn",
                "jsdoc/require-throws-type": "warn",
                "jsdoc/require-yields": "warn", // Recommended
                "jsdoc/require-yields-check": "warn", // Recommended
                "jsdoc/require-yields-description": "warn",
                "jsdoc/require-yields-type": "warn", // Recommended
                "jsdoc/sort-tags": "off", // Conflicts with Prettier
                "jsdoc/tag-lines": "off", // Conflicts with Prettier
                "jsdoc/text-escaping": [
                    "warn",
                    {
                        escapeHTML: true,
                    },
                ],
                "jsdoc/ts-method-signature-style": "warn",
                "jsdoc/ts-no-empty-object-type": "warn",
                "jsdoc/ts-no-unnecessary-template-expression": "warn",
                "jsdoc/ts-prefer-function-type": "warn",
                "jsdoc/type-formatting": [
                    "off",
                    {
                        enableFixer: false,
                        objectFieldIndent: "  ",
                    },
                ],
                "jsdoc/valid-types": "off", // Tooling scripts frequently use TS-style imports/types
                // "jsdoc/check-examples": "warn", // Deprecated and not for ESLint >= 8
                // "jsdoc/rejct-any-type": "warn", // broken
            },
            settings: {
                jsdoc: {
                    // JS files in this repo use classic JSDoc.
                    mode: "jsdoc",
                },
            },
        },
        // #endregion
        // #region 🧾 Config JS/MJS Configuration files
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: 🧾 Config JS/MJS Configuration files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: [
                "**/*.config.{js,jsx,mjs,cjs}",
                "**/*.config.**.*.{js,jsx,mjs,cjs}",
            ],
            languageOptions: {
                globals: {
                    ...globals.builtin,
                    ...globals.nodeBuiltin,
                    ...globals.commonjs,
                },
            },
            name: "🧾 JS/MJS Config Files: **/*.config.{js,jsx,mjs,cjs}",
            plugins: {
                perfectionist,
                unicorn: unicorn,
                "unused-imports": unusedImports,
            },
            rules: {
                "max-classes-per-file": "off",
                "no-console": "off",
                "no-undef-init": "off",
                "perfectionist/sort-arrays": "off", // Configs often have intentionally unsorted arrays
                "sonarjs/no-duplicate-string": "off",
                "unicorn/consistent-function-scoping": "off", // Configs often use different scoping
                "unicorn/filename-case": "off", // Allow config files to have any case
                "unicorn/no-await-expression-member": "off", // Allow await in config expressions
                "unicorn/no-unused-properties": "off", // Allow unused properties in config setups
            },
            settings: {
                "import-x/resolver": {
                    node: true,
                },
                n: {
                    allowModules: [
                        "electron",
                        "node",
                        "electron-devtools-installer",
                    ],
                },
            },
        },
        // #endregion
        // #region 🤖 GitHub Workflows YAML/YML
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: Github Workflows YAML/YML
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: [
                "**/.github/workflows/**/*.{yaml,yml}",
                "config/tools/flatpak-build.yml",
                "**/dependabot.yml",
                "**/.spellcheck.yml",
                "**/.pre-commit-config.yaml",
                "**/.github/workflow-templates/**/*.{yaml,yml}",
                "**/.github/actions/**/*.{yaml,yml}",
            ],
            name: "🧾 YAML/YML GitHub Workflows - ⛔ Overrides",
            rules: {
                "yml/block-mapping-colon-indicator-newline": "off",
                "yml/no-empty-key": "off",
                "yml/no-empty-mapping-value": "off",
                "yml/sort-keys": "off",
            },
        },
        // #endregion
        // #region 🎭 Framework-Specific Configurations
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: Framework-Specific Configurations (Optional)
        // These configurations are scoped to specific frameworks and file types.
        // Projects that don't use these frameworks won't be affected.
        // ═══════════════════════════════════════════════════════════════════════════════
        // #region 🎭 Playwright
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: Playwright E2E Testing
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: [
                "playwright/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "test/e2e/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "e2e/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "**/*.e2e.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "**/*.pw.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            ],
            languageOptions: {
                globals: {
                    ...globals.nodeBuiltin,
                    ...globals.vitest,
                    browser: "readonly",
                    context: "readonly",
                    expect: "readonly",
                    page: "readonly",
                },
                parser: tseslintParser,
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true,
                    },
                    ecmaVersion: "latest",
                    jsDocParsingMode: "all",
                    sourceType: "module",
                    tsconfigRootDir: rootDirectory,
                    warnOnUnsupportedTypeScriptVersion: true,
                },
            },
            name: "🎭 Playwright E2E Tests: playwright/**, test/e2e/**, **/*.e2e.*",
            plugins: {
                playwright: playwright,
            },
            rules: {
                ...playwright.configs["flat/recommended"].rules,
                "playwright/max-expects": "warn",
                "playwright/no-commented-out-tests": "warn",
                "playwright/no-get-by-title": "warn",
                "playwright/no-hooks": "warn",
                "playwright/no-nth-methods": "warn",
                "playwright/no-raw-locators": "warn",
                "playwright/no-restricted-locators": "warn",
                "playwright/no-restricted-matchers": "warn",
                "playwright/no-restricted-roles": "warn",
                "playwright/no-slowed-test": "warn",
                "playwright/prefer-comparison-matcher": "warn",
                "playwright/prefer-equality-matcher": "warn",
                "playwright/prefer-lowercase-title": "warn",
                "playwright/prefer-native-locators": "warn",
                "playwright/prefer-strict-equal": "warn",
                "playwright/prefer-to-be": "warn",
                "playwright/prefer-to-contain": "warn",
                "playwright/require-hook": "warn",
                "playwright/require-soft-assertions": "warn",
                "playwright/require-tags": "warn",
                "playwright/require-to-pass-timeout": "warn",
                "playwright/require-to-throw-message": "warn",
                "playwright/require-top-level-describe": "warn",
            },
        },
        // #endregion
        // #region 📖 Storybook
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: Storybook Component Stories
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: [
                "**/*.stories.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                ".storybook/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            ],
            languageOptions: {
                globals: {
                    ...globals.nodeBuiltin,
                    browser: "readonly",
                    context: "readonly",
                    expect: "readonly",
                    page: "readonly",
                },
                parser: tseslintParser,
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true,
                    },
                    ecmaVersion: "latest",
                    jsDocParsingMode: "all",
                    sourceType: "module",
                    tsconfigRootDir: rootDirectory,
                    warnOnUnsupportedTypeScriptVersion: true,
                },
            },
            name: "📖 Storybook Stories: **/*.stories.{js,jsx,mjs,cjs,ts,tsx,cts,mts}, .storybook/**",
            plugins: {
                storybook: storybook,
            },
            rules: {
                "storybook/await-interactions": "warn",
                "storybook/context-in-play-function": "warn",
                "storybook/csf-component": "warn",
                "storybook/default-exports": "warn",
                "storybook/hierarchy-separator": "warn",
                "storybook/meta-inline-properties": "warn",
                "storybook/meta-satisfies-type": "warn",
                "storybook/no-redundant-story-name": "warn",
                "storybook/no-renderer-packages": "warn",
                "storybook/no-stories-of": "warn",
                "storybook/no-title-property-in-meta": "warn",
                "storybook/no-uninstalled-addons": "warn",
                "storybook/prefer-pascal-case": "warn",
                "storybook/story-exports": "warn",
                "storybook/use-storybook-expect": "warn",
                "storybook/use-storybook-testing-library": "warn",
            },
        },
        // #endregion
        // #region 🖖 Vue
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: Vue Single File Components
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: [
                "**/*.vue",
                "*.vue.js",
                "*.vue.ts",
            ],
            languageOptions: {
                globals: {
                    ...globals.nodeBuiltin,
                    ...globals.vue,
                    browser: "readonly",
                    context: "readonly",
                    expect: "readonly",
                    page: "readonly",
                },
                parser: vueParser,
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true,
                    },
                    ecmaVersion: "latest",
                    jsDocParsingMode: "all",
                    parser: tseslintParser,
                    sourceType: "module",
                    tsconfigRootDir: rootDirectory,
                    warnOnUnsupportedTypeScriptVersion: true,
                },
            },
            name: "🖖 Vue SFCs: **/*.vue",
            plugins: {
                vue: vue,
            },
            rules: {
                "vue/attribute-hyphenation": "warn",
                "vue/attributes-order": "warn",
                "vue/block-lang": "warn",
                "vue/block-order": "warn",
                "vue/camelcase": "warn",
                "vue/comment-directive": "warn",
                "vue/component-api-style": "warn",
                "vue/component-definition-name-casing": "warn",
                "vue/component-name-in-template-casing": "warn",
                "vue/component-options-name-casing": "warn",
                "vue/custom-event-name-casing": "warn",
                "vue/define-emits-declaration": "warn",
                "vue/define-macros-order": "warn",
                "vue/define-props-declaration": "warn",
                "vue/define-props-destructuring": "warn",
                "vue/dot-notation": "warn",
                "vue/enforce-style-attribute": "warn",
                "vue/eqeqeq": "warn",
                "vue/first-attribute-linebreak": "warn",
                "vue/html-button-has-type": "warn",
                "vue/html-comment-content-newline": "warn",
                "vue/html-comment-content-spacing": "warn",
                "vue/html-comment-indent": "warn",
                "vue/jsx-uses-vars": "warn",
                "vue/match-component-file-name": "warn",
                "vue/match-component-import-name": "warn",
                "vue/max-lines-per-block": "warn",
                "vue/max-props": "warn",
                "vue/max-template-depth": "warn",
                "vue/multi-word-component-names": "warn",
                "vue/new-line-between-multi-line-property": "warn",
                "vue/next-tick-style": "warn",
                "vue/no-arrow-functions-in-watch": "warn",
                "vue/no-async-in-computed-properties": "warn",
                "vue/no-bare-strings-in-template": "warn",
                "vue/no-boolean-default": "warn",
                "vue/no-child-content": "warn",
                "vue/no-computed-properties-in-data": "warn",
                "vue/no-console": "warn",
                "vue/no-constant-condition": "warn",
                "vue/no-custom-modifiers-on-v-model": "warn",
                "vue/no-deprecated-data-object-declaration": "warn",
                "vue/no-deprecated-delete-set": "warn",
                "vue/no-deprecated-destroyed-lifecycle": "warn",
                "vue/no-deprecated-dollar-listeners-api": "warn",
                "vue/no-deprecated-dollar-scopedslots-api": "warn",
                "vue/no-deprecated-events-api": "warn",
                "vue/no-deprecated-filter": "warn",
                "vue/no-deprecated-functional-template": "warn",
                "vue/no-deprecated-html-element-is": "warn",
                "vue/no-deprecated-inline-template": "warn",
                "vue/no-deprecated-model-definition": "warn",
                "vue/no-deprecated-props-default-this": "warn",
                "vue/no-deprecated-router-link-tag-prop": "warn",
                "vue/no-deprecated-scope-attribute": "warn",
                "vue/no-deprecated-slot-attribute": "warn",
                "vue/no-deprecated-slot-scope-attribute": "warn",
                "vue/no-deprecated-v-bind-sync": "warn",
                "vue/no-deprecated-v-is": "warn",
                "vue/no-deprecated-v-on-native-modifier": "warn",
                "vue/no-deprecated-v-on-number-modifiers": "warn",
                "vue/no-deprecated-vue-config-keycodes": "warn",
                "vue/no-dupe-keys": "warn",
                "vue/no-dupe-v-else-if": "warn",
                "vue/no-duplicate-attr-inheritance": "warn",
                "vue/no-duplicate-attributes": "warn",
                "vue/no-duplicate-class-names": "warn",
                "vue/no-empty-component-block": "warn",
                "vue/no-empty-pattern": "warn",
                "vue/no-export-in-script-setup": "warn",
                "vue/no-expose-after-await": "warn",
                "vue/no-implicit-coercion": "warn",
                "vue/no-import-compiler-macros": "warn",
                "vue/no-irregular-whitespace": "warn",
                "vue/no-lifecycle-after-await": "warn",
                "vue/no-literals-in-template": "warn",
                "vue/no-lone-template": "warn",
                "vue/no-loss-of-precision": "warn",
                "vue/no-multiple-objects-in-class": "warn",
                "vue/no-multiple-slot-args": "warn",
                "vue/no-multiple-template-root": "warn",
                "vue/no-mutating-props": "warn",
                "vue/no-negated-condition": "warn",
                "vue/no-negated-v-if-condition": "warn",
                "vue/no-parsing-error": "warn",
                "vue/no-potential-component-option-typo": "warn",
                "vue/no-ref-as-operand": "warn",
                "vue/no-ref-object-reactivity-loss": "warn",
                "vue/no-required-prop-with-default": "warn",
                "vue/no-reserved-component-names": "warn",
                "vue/no-reserved-keys": "warn",
                "vue/no-reserved-props": "warn",
                "vue/no-restricted-block": "warn",
                "vue/no-restricted-call-after-await": "warn",
                "vue/no-restricted-class": "warn",
                "vue/no-restricted-component-names": "warn",
                "vue/no-restricted-component-options": "warn",
                "vue/no-restricted-custom-event": "warn",
                "vue/no-restricted-html-elements": "warn",
                "vue/no-restricted-props": "warn",
                "vue/no-restricted-static-attribute": "warn",
                "vue/no-restricted-syntax": "warn",
                "vue/no-restricted-v-bind": "warn",
                "vue/no-restricted-v-on": "warn",
                "vue/no-root-v-if": "warn",
                "vue/no-setup-props-reactivity-loss": "warn",
                "vue/no-shared-component-data": "warn",
                "vue/no-side-effects-in-computed-properties": "warn",
                "vue/no-sparse-arrays": "warn",
                "vue/no-static-inline-styles": "warn",
                "vue/no-template-key": "warn",
                "vue/no-template-shadow": "warn",
                "vue/no-template-target-blank": "warn",
                "vue/no-textarea-mustache": "warn",
                "vue/no-this-in-before-route-enter": "warn",
                "vue/no-undef-components": "warn",
                "vue/no-undef-directives": "warn",
                "vue/no-undef-properties": "warn",
                "vue/no-unsupported-features": "warn",
                "vue/no-unused-components": "warn",
                "vue/no-unused-emit-declarations": "warn",
                "vue/no-unused-properties": "warn",
                "vue/no-unused-refs": "warn",
                "vue/no-unused-vars": "warn",
                "vue/no-use-computed-property-like-method": "warn",
                "vue/no-use-v-else-with-v-for": "warn",
                "vue/no-use-v-if-with-v-for": "warn",
                "vue/no-useless-concat": "warn",
                "vue/no-useless-mustaches": "warn",
                "vue/no-useless-template-attributes": "warn",
                "vue/no-useless-v-bind": "warn",
                "vue/no-v-for-template-key-on-child": "warn",
                "vue/no-v-html": "warn",
                "vue/no-v-text": "warn",
                "vue/no-v-text-v-html-on-component": "warn",
                "vue/no-watch-after-await": "warn",
                "vue/object-shorthand": "warn",
                "vue/one-component-per-file": "warn",
                "vue/order-in-components": "warn",
                "vue/padding-line-between-blocks": "warn",
                "vue/padding-line-between-tags": "warn",
                "vue/padding-lines-in-component-definition": "warn",
                "vue/prefer-define-options": "warn",
                "vue/prefer-import-from-vue": "warn",
                "vue/prefer-prop-type-boolean-first": "warn",
                "vue/prefer-separate-static-class": "warn",
                "vue/prefer-single-event-payload": "warn",
                "vue/prefer-template": "warn",
                "vue/prefer-true-attribute-shorthand": "warn",
                "vue/prefer-use-template-ref": "warn",
                "vue/prefer-v-model": "warn",
                "vue/prop-name-casing": "warn",
                "vue/require-component-is": "warn",
                "vue/require-default-export": "warn",
                "vue/require-default-prop": "warn",
                "vue/require-direct-export": "warn",
                "vue/require-emit-validator": "warn",
                "vue/require-explicit-emits": "warn",
                "vue/require-explicit-slots": "warn",
                "vue/require-expose": "warn",
                "vue/require-macro-variable-name": "warn",
                "vue/require-name-property": "warn",
                "vue/require-prop-comment": "warn",
                "vue/require-prop-type-constructor": "warn",
                "vue/require-prop-types": "warn",
                "vue/require-render-return": "warn",
                "vue/require-slots-as-functions": "warn",
                "vue/require-toggle-inside-transition": "warn",
                "vue/require-typed-object-prop": "warn",
                "vue/require-typed-ref": "warn",
                "vue/require-v-for-key": "warn",
                "vue/require-valid-default-prop": "warn",
                "vue/restricted-component-names": "warn",
                "vue/return-in-computed-property": "warn",
                "vue/return-in-emits-validator": "warn",
                "vue/slot-name-casing": "warn",
                "vue/sort-keys": "warn",
                "vue/static-class-names-order": "warn",
                "vue/this-in-template": "warn",
                "vue/use-v-on-exact": "warn",
                "vue/v-bind-style": "warn",
                "vue/v-for-delimiter-style": "warn",
                "vue/v-if-else-key": "warn",
                "vue/v-on-event-hyphenation": "warn",
                "vue/v-on-handler-style": "warn",
                "vue/v-on-style": "warn",
                "vue/v-slot-style": "warn",
                "vue/valid-attribute-name": "warn",
                "vue/valid-define-emits": "warn",
                "vue/valid-define-options": "warn",
                "vue/valid-define-props": "warn",
                "vue/valid-next-tick": "warn",
                "vue/valid-template-root": "warn",
                "vue/valid-v-bind": "warn",
                "vue/valid-v-cloak": "warn",
                "vue/valid-v-else": "warn",
                "vue/valid-v-else-if": "warn",
                "vue/valid-v-for": "warn",
                "vue/valid-v-html": "warn",
                "vue/valid-v-if": "warn",
                "vue/valid-v-is": "warn",
                "vue/valid-v-memo": "warn",
                "vue/valid-v-model": "warn",
                "vue/valid-v-on": "warn",
                "vue/valid-v-once": "warn",
                "vue/valid-v-pre": "warn",
                "vue/valid-v-show": "warn",
                "vue/valid-v-slot": "warn",
                "vue/valid-v-text": "warn",
            },
        },
        // #endregion
        // #region 🚀 Astro
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: Astro Components
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/*.astro"],
            languageOptions: {
                ecmaVersion: "latest",
                globals: {
                    ...globals.nodeBuiltin,
                    ...globals.astro,
                    ...globals.browser,
                    ...globals.vitest,
                    context: "readonly",
                    expect: "readonly",
                    page: "readonly",
                },
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true,
                    },
                    ecmaVersion: "latest",
                    jsDocParsingMode: "all",
                    sourceType: "module",
                    tsconfigRootDir: rootDirectory,
                    warnOnUnsupportedTypeScriptVersion: true,
                },
                sourceType: "module",
            },
            name: "🚀 Astro Components: **/*.astro",
            plugins: {
                astro: astro,
            },
            rules: {
                "astro/jsx-a11y/alt-text": "warn",
                "astro/jsx-a11y/anchor-ambiguous-text": "warn",
                "astro/jsx-a11y/anchor-has-content": "warn",
                "astro/jsx-a11y/anchor-is-valid": "warn",
                "astro/jsx-a11y/aria-activedescendant-has-tabindex": "warn",
                "astro/jsx-a11y/aria-props": "warn",
                "astro/jsx-a11y/aria-proptypes": "warn",
                "astro/jsx-a11y/aria-role": "warn",
                "astro/jsx-a11y/aria-unsupported-elements": "warn",
                "astro/jsx-a11y/autocomplete-valid": "warn",
                "astro/jsx-a11y/click-events-have-key-events": "warn",
                "astro/jsx-a11y/control-has-associated-label": "warn",
                "astro/jsx-a11y/heading-has-content": "warn",
                "astro/jsx-a11y/html-has-lang": "warn",
                "astro/jsx-a11y/iframe-has-title": "warn",
                "astro/jsx-a11y/img-redundant-alt": "warn",
                "astro/jsx-a11y/interactive-supports-focus": "warn",
                "astro/jsx-a11y/label-has-associated-control": "warn",
                "astro/jsx-a11y/lang": "warn",
                "astro/jsx-a11y/media-has-caption": "warn",
                "astro/jsx-a11y/mouse-events-have-key-events": "warn",
                "astro/jsx-a11y/no-access-key": "warn",
                "astro/jsx-a11y/no-aria-hidden-on-focusable": "warn",
                "astro/jsx-a11y/no-autofocus": "warn",
                "astro/jsx-a11y/no-distracting-elements": "warn",
                "astro/jsx-a11y/no-interactive-element-to-noninteractive-role":
                    "warn",
                "astro/jsx-a11y/no-noninteractive-element-interactions": "warn",
                "astro/jsx-a11y/no-noninteractive-element-to-interactive-role":
                    "warn",
                "astro/jsx-a11y/no-noninteractive-tabindex": "warn",
                "astro/jsx-a11y/no-redundant-roles": "warn",
                "astro/jsx-a11y/no-static-element-interactions": "warn",
                "astro/jsx-a11y/prefer-tag-over-role": "warn",
                "astro/jsx-a11y/role-has-required-aria-props": "warn",
                "astro/jsx-a11y/role-supports-aria-props": "warn",
                "astro/jsx-a11y/scope": "warn",
                "astro/jsx-a11y/tabindex-no-positive": "warn",
                "astro/missing-client-only-directive-value": "warn",
                "astro/no-conflict-set-directives": "warn",
                "astro/no-deprecated-astro-canonicalurl": "warn",
                "astro/no-deprecated-astro-fetchcontent": "warn",
                "astro/no-deprecated-astro-resolve": "warn",
                "astro/no-deprecated-getentrybyslug": "warn",
                "astro/no-exports-from-components": "warn",
                "astro/no-prerender-export-outside-pages": "warn",
                "astro/no-set-html-directive": "warn",
                "astro/no-set-text-directive": "warn",
                "astro/no-unsafe-inline-scripts": "warn",
                "astro/no-unused-css-selector": "warn",
                "astro/no-unused-define-vars-in-style": "warn",
                "astro/prefer-class-list-directive": "warn",
                "astro/prefer-object-class-list": "warn",
                "astro/prefer-split-class-list": "warn",
                "astro/semi": "warn",
                "astro/sort-attributes": "warn",
                "astro/valid-compile": "error",
            },
        },
        // #endregion
        // #region ⚛️ Next.js
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: Next.js App Router and Pages
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: [
                "app/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "pages/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "src/app/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "src/pages/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            ],
            languageOptions: {
                parser: tseslintParser,
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true,
                        jsx: true,
                    },
                    ecmaVersion: "latest",
                    jsDocParsingMode: "all",
                    project: [...tsconfigPaths],
                    sourceType: "module",
                    tsconfigRootDir: rootDirectory,
                    warnOnUnsupportedTypeScriptVersion: true,
                },
            },
            name: "⚛️ Next.js: Pages and App Router - app/**, pages/**, src/app/**, src/pages/**",
            plugins: {
                "@next/next": next,
            },
            // Let users enable Next.js rules in their project if they want,
            // but don't force them to fix Next.js-specific issues if they're not using Next.js or don't care about
            // those rules
            rules: {
                "@next/next/google-font-display": "off",
                "@next/next/google-font-preconnect": "off",
                "@next/next/inline-script-id": "off",
                "@next/next/next-script-for-ga": "off",
                "@next/next/no-assign-module-variable": "off",
                "@next/next/no-async-client-component": "off",
                "@next/next/no-before-interactive-script-outside-document":
                    "off",
                "@next/next/no-css-tags": "off",
                "@next/next/no-document-import-in-page": "off",
                "@next/next/no-duplicate-head": "off",
                "@next/next/no-head-element": "off",
                "@next/next/no-head-import-in-document": "off",
                "@next/next/no-html-link-for-pages": "off",
                "@next/next/no-img-element": "off",
                "@next/next/no-page-custom-font": "off",
                "@next/next/no-script-component-in-head": "off",
                "@next/next/no-styled-jsx-in-document": "off",
                "@next/next/no-sync-scripts": "off",
                "@next/next/no-title-in-document-head": "off",
                "@next/next/no-typos": "off",
                "@next/next/no-unwanted-polyfillio": "off",
            },
        },
        // #endregion
        // #endregion
        // #region ⛔ Overrides
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: ⛔ Overrides
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/package.json", "**/package-lock.json"],
            name: "🧾 Package.JSON: Files - ⛔ Overrides",
            rules: {
                "json/sort-keys": "off",
            },
        },
        {
            files: ["**/.vscode/**"],
            name: "🛠️ VS Code Files: ⛔ Overrides",
            rules: {
                "jsonc/array-bracket-newline": "off",
            },
        },
        // #endregion
        // #region 📐 @Stylistic Overrides
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: @Stylistic Overrides
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/**"],
            name: "📐 Global: Stylistic - ⛔ Overrides",
            plugins: {
                "@stylistic": stylistic,
            },
            rules: {
                "@stylistic/curly-newline": "off",
                "@stylistic/exp-jsx-props-style": "off",
                "@stylistic/exp-list-style": "off",
                "@stylistic/jsx-curly-brace-presence": "off",
                "@stylistic/jsx-function-call-newline": "off",
                "@stylistic/jsx-pascal-case": "off",
                "@stylistic/jsx-self-closing-comp": "off",
                "@stylistic/line-comment-position": "off",
                "@stylistic/lines-between-class-members": "off",
                "@stylistic/multiline-comment-style": "off",
                "@stylistic/padding-line-between-statements": "off",
                "@stylistic/spaced-comment": [
                    "error",
                    "always",
                    {
                        exceptions: ["-", "+"],
                    },
                ],
            },
        },
        // #endregion
        // #region 🛠️ Global Overrides
        // ═══════════════════════════════════════════════════════════════════════════════
        // SECTION: Global Overrides
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}"],
            name: "🌐 Global:  ⛔ Overrides",
            plugins: {
                canonical: canonical,
                "no-secrets": noSecrets,
                "no-unsanitized": noUnsanitized,
            },
            rules: {
                "@typescript-eslint/prefer-destructuring": "off",
                "callback-return": "off",
                camelcase: "off",
                "github-actions/no-top-level-permissions": "off",
                "import-x/max-dependencies": "off",
                "no-secrets/no-pattern-match": "off",
                "no-secrets/no-secrets": [
                    "error",
                    {
                        tolerance: 5,
                    },
                ],
                "no-unsanitized/method": "error",
                "no-unsanitized/property": "error",
                "prettier/prettier": "off", // Using in Prettier directly for less noise for AI
                "remark/require-remark-config-file-naming-convention": "off",
            },
        },
        {
            files: [
                "**/*.test.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "**/*.spec.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "src/test/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "test/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "tests/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "benchmarks/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "scripts/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            ],
            name: "📃 Typedoc: ⛔ Disable Require Exported Doc Comment in Test/Script/Benchmark Files",
            rules: {
                // This rule is extremely noisy in tests (especially property-based
                // tests) where callback return values are often incidental.
                "typedoc/require-exported-doc-comment": "off", // Tests often have non-exported members where doc comments would be low-value and high-effort.
            },
        },
        {
            files: ["plugin.mjs", "src/**/*.{ts,tsx,mts,cts,js,mjs,cjs}"],
            name: "📢 Source runtime logging policy: ⛔ Overrides",
            rules: {
                // Runtime/library code should not emit console output.
                "no-console": "error",
                // Keep explicit in source scope even though this is also configured
                // globally for defense-in-depth.
                "no-debugger": "error",
            },
        },
        {
            files: ["eslint.config.mjs", "src/shared-config.ts"],
            name: "📦 Shared Config Implementation: ⛔ Overrides",
            rules: {
                "@typescript-eslint/strict-boolean-expressions": "off",
                "max-lines-per-function": "off",
                "n/no-top-level-await": "off",
                "no-console": "off",
                "tsdoc-require-2/require": "off",
                "tsdoc/syntax": "off",
                "typedoc/require-exported-doc-comment": "off",
                "typefest/prefer-ts-extras-array-first": "off",
                "typefest/prefer-ts-extras-array-join": "off",
                "typefest/prefer-ts-extras-object-entries": "off",
                "typefest/prefer-ts-extras-object-from-entries": "off",
                "typefest/prefer-ts-extras-set-has": "off",
            },
        },
        {
            files: [
                "**/*.secretlintrc.cjs",
                "**/*.secretlintrc.mjs",
                "**/*.secretlintrc.js",
                "**/secretlint.config.{js,cjs,mjs}",
                "**/secretlint.{js,cjs,mjs}",
            ],
            name: "🔒 Secretlint Configs: ⛔ Overrides",
            // Secretlint configs often use CommonJS, and the import-x rule is too noisy to justify forcing all
            // configs to ESM.
            rules: {
                "@typescript-eslint/no-require-imports": "off",
                "import-x/no-commonjs": "off",
                "import-x/unambiguous": "off",
                "n/no-mixed-requires": "off",
                "sonarjs/no-require-or-define": "off",
            },
        },
        // #endregion
        // #region 🧹 Prettier Disable Config
        {
            name: "🌍 Global: 🎨 Prettier ⛔ Overrides",
            ...prettierOverrides,
        },
        // #endregion
    ];

    return removeDisabledPluginRules(
        flattenConfigs(configs),
        disabledPluginNames
    );
};

const allConfig: EslintConfig[] = createConfig();

const withoutSdl2BaseConfig: EslintConfig[] = createConfig({
    plugins: {
        sdl: false,
        "sdl-2": false,
    },
});

const withoutSdl2HasNodePlugin = withoutSdl2BaseConfig.some(
    (config) => config.plugins !== undefined && keyIn(config.plugins, "n")
);

/** Shared preset arrays for plugin-style flat config consumption. */
const sharedConfigs: Nick2Bad4UEslintConfigPresets = {
    all: allConfig,
    base: createConfig({
        plugins: {
            "etc-misc": false,
            typefest: false,
        },
    }),
    recommended: allConfig,
    withoutChunkyLint: createConfig({
        plugins: {
            chunkylint: false,
        },
    }),
    withoutCopilot: createConfig({
        plugins: {
            copilot: false,
        },
    }),
    withoutDocusaurus2: createConfig({
        plugins: {
            "docusaurus-2": false,
        },
    }),
    withoutEtcMisc: createConfig({
        plugins: {
            "etc-misc": false,
        },
    }),
    withoutFileProgress2: createConfig({
        plugins: {
            "file-progress": false,
            "file-progress-2": false,
        },
    }),
    withoutGithubActions2: createConfig({
        plugins: {
            "github-actions": false,
            "github-actions-2": false,
        },
    }),
    withoutImmutable2: createConfig({
        plugins: {
            immutable: false,
            "immutable-2": false,
        },
    }),
    withoutRemark: createConfig({
        plugins: {
            remark: false,
        },
    }),
    withoutRepo: createConfig({
        plugins: {
            repo: false,
            "repo-compliance": false,
        },
    }),
    withoutRuntimeCleanup: createConfig({
        plugins: {
            "runtime-cleanup": false,
        },
    }),
    withoutSdl2: withoutSdl2HasNodePlugin
        ? withoutSdl2BaseConfig
        : [
              {
                  name: "Node plugin registration (withoutSdl2 only)",
                  plugins: {
                      n: nodePlugin,
                  },
              },
              ...withoutSdl2BaseConfig,
          ],
    withoutStylelint2: createConfig({
        plugins: {
            "stylelint-2": false,
        },
    }),
    withoutTestSignal: createConfig({
        plugins: {
            "test-signal": false,
        },
    }),
    withoutTsconfig: createConfig({
        plugins: {
            tsconfig: false,
        },
    }),
    withoutTsdocRequire2: createConfig({
        plugins: {
            "tsdoc-require-2": false,
        },
    }),
    withoutTypedoc: createConfig({
        plugins: {
            typedoc: false,
        },
    }),
    withoutTypefest: createConfig({
        plugins: {
            typefest: false,
        },
    }),
    withoutUptimeWatcher: createConfig({
        plugins: {
            "uptime-watcher": false,
        },
    }),
    withoutVite: createConfig({
        plugins: {
            vite: false,
        },
    }),
    withoutWriteGoodComments2: createConfig({
        plugins: {
            "write-good-comments": false,
            "write-good-comments-2": false,
        },
    }),
};

export const configs: Nick2Bad4UEslintConfigPresets = sharedConfigs;

const nickTwoBadFourU: {
    readonly configs: Nick2Bad4UEslintConfigPresets;
    readonly createConfig: typeof createConfig;
} = {
    configs,
    createConfig,
};

export default nickTwoBadFourU;
