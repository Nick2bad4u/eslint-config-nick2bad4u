/* eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair -- Disabled by design */
/* eslint-disable import-x/no-rename-default, @typescript-eslint/triple-slash-reference, import-x/max-dependencies -- Disabled by design */
/**
 * Optimized ESLint configuration
 *
 * @see {@link https://www.schemastore.org/eslintrc.json} for JSON schema validation
 */

/// <reference path="./_types/eslint-plugin-shims.d.ts" />

import type { Linter } from "eslint";
import type { Except, UnknownRecord } from "type-fest";

import docusaurus from "@docusaurus/eslint-plugin";
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import react from "@eslint-react/eslint-plugin";
import { globalIgnores } from "@eslint/config-helpers";
import css from "@eslint/css";
import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import html from "@html-eslint/eslint-plugin";
import next from "@next/eslint-plugin-next";
import stylistic from "@stylistic/eslint-plugin";
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
import jsonSchemaValidator from "eslint-plugin-json-schema-validator-2";
import jsonc from "eslint-plugin-jsonc";
import listeners from "eslint-plugin-listeners";
import math from "eslint-plugin-math";
import moduleInterop from "eslint-plugin-module-interop";
import nodePlugin from "eslint-plugin-n";
import nitpick from "eslint-plugin-nitpick";
import noBarrelFiles from "eslint-plugin-no-barrel-files";
import noUnsanitized from "eslint-plugin-no-unsanitized";
import nodeDepends from "eslint-plugin-node-dependencies";
import packageJson from "eslint-plugin-package-json";
import perfectionist from "eslint-plugin-perfectionist";
import playwright from "eslint-plugin-playwright";
import promise from "eslint-plugin-promise";
import regexp from "eslint-plugin-regexp";
import remark from "eslint-plugin-remark";
import repo from "eslint-plugin-repo";
import runtimeCleanup from "eslint-plugin-runtime-cleanup";
import sdl from "eslint-plugin-sdl-2";
import security from "eslint-plugin-security";
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
import vue from "eslint-plugin-vue";
import writeGoodComments from "eslint-plugin-write-good-comments-2";
import yml from "eslint-plugin-yml";
import globals from "globals";
import * as jsoncEslintParser from "jsonc-eslint-parser";
import * as path from "node:path";
import * as tomlEslintParser from "toml-eslint-parser";
import {
    arrayFirst,
    arrayIncludes,
    arrayJoin,
    isDefined,
    isEmpty,
    isPresent,
    keyIn,
    objectEntries,
    objectFromEntries,
    objectHasOwn,
    objectKeys,
    setHas,
    stringSplit,
} from "ts-extras";
import tseslint from "typescript-eslint";
import * as yamlEslintParser from "yaml-eslint-parser";

// eslint-disable-next-line n/no-process-env -- Process environment is used for CI detection and opt-in features such as markdown code block linting and file-progress modes.
const processEnvironment = process.env;

// #region 📁 Markdown Code Block Processor
// ═══════════════════════════════════════════════════════════════════════════════
// The markdown processor changes Markdown linting from "lint the document" to
// "lint extracted fenced code blocks". Keep it opt-in so remark/remark and the
// markdown/gfm document rules remain the default Markdown path.
// PowerShell one-shot:
// `$flag = "ENABLE_MARKDOWN_CODE_BLOCK_LINTING"; Set-Item "Env:$flag" 1; npx eslint .; Remove-Item "Env:$flag" -EA 0`
const enableMarkdownCodeBlockLinting =
    processEnvironment["ENABLE_MARKDOWN_CODE_BLOCK_LINTING"] === "1";

// #endregion 📁 Markdown Code Block Processor
// #region 🏗️ Setup and Public Types
// ═══════════════════════════════════════════════════════════════════════════════
// Consumers get type-aware rules out of the box through TypeScript ESLint's
// project service. Keep lint-visible files in the nearest tsconfig.json; use
// allowDefaultProjectFilePatterns only for a tiny root-file fallback.
const COMMENT_LENGTH_SEMANTIC_COMMENTS = Object.freeze([
    "*`*",
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
    "@fixme",
    "@generator",
    "@highlight",
    "@internal",
    "@link",
    "@listens",
    "@memberof",
    "@mixes",
    "@mixin",
    "@module",
    "@namespace",
    "@note",
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
    "@status",
    "@template",
    "@todo",
    "@typeParam",
    "@typedef",
    "@version",
    "@virtual",
    "@warn",
    "@yields",
]);
const DEFAULT_PROJECT_FILE_PATTERNS = Object.freeze([
    "*.{js,mjs,cjs}",
    ".*.{js,mjs,cjs}",
]);
const DEFAULT_TSCONFIG_PATHS = Object.freeze(["./tsconfig.eslint.json"]);
const DOCUSAURUS_CODE_FILE_PATTERNS = Object.freeze([
    "**/docs/docusaurus/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
]);
const DOCUSAURUS_CONTENT_FILE_PATTERNS = Object.freeze([
    "**/docs/docusaurus/**/*.{md,mdx}",
]);
const DOCUSAURUS_IGNORES = Object.freeze([
    "**/docs/docusaurus/.docusaurus/**",
    "**/docs/docusaurus/build/**",
    "**/docs/docusaurus/static/eslint-inspector/**",
    "**/docs/docusaurus/static/remark-inspector/**",
    "**/docs/docusaurus/static/stylelint-inspector/**",
]);
const GLOBAL_FILE_PATTERNS = Object.freeze([
    "**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
]);
const JSONC_AND_JSON5_RULES = {
    "jsonc/array-bracket-newline": "off", // Handled by Prettier
    "jsonc/array-bracket-spacing": "off", // Handled by Prettier
    "jsonc/array-element-newline": "off", // Handled by Prettier
    // Crashes when combined with `@eslint/json` language handling in
    // fixture/downstream flat-config runs.
    "jsonc/auto": "off",
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
            ],
            pathPattern: "^$", // Hits the root properties
        },
        {
            order: { type: "asc" },
            pathPattern: "^(?:dev|peer|optional|bundled)?[Dd]ependencies$",
        },
    ],
    "jsonc/space-unary-ops": "warn",
    "jsonc/valid-json-number": "warn",
    "jsonc/vue-custom-block/no-parsing-error": "warn",
} satisfies Linter.RulesRecord;
const ROOT_CONFIG_FILE_PATTERNS = Object.freeze([
    "*.config.{js,mjs,cjs,ts,mts,cts}",
    "*.config.*.{js,mjs,cjs,ts,mts,cts}",
    ".*rc.{js,mjs,cjs,ts,mts,cts}",
    "preset.mjs",
]);
const ROOT_SCRIPT_FILE_PATTERNS = Object.freeze([
    "*.{js,mjs,cjs,ts,mts,cts}",
    ".*.{js,mjs,cjs,ts,mts,cts}",
]);

/** Common opt-in globs for TypeScript ESLint's default-project fallback. */
export interface Nick2Bad4UAllowDefaultProjectFilePatternPresets {
    /** Default root-only fallback patterns used by the shared config. */
    readonly defaultRootFiles: readonly string[];
    /** Root config files such as `eslint.config.mjs` and `.secretlintrc.cjs`. */
    readonly rootConfigFiles: readonly string[];
    /** Compatibility preset for root `*.mjs` and `.*.mjs` files. */
    readonly rootMjsFiles: readonly string[];
    /** Root script files such as `eslint.config.mjs` and `.remarkrc.mjs`. */
    readonly rootScriptFiles: readonly string[];
}

/** Common opt-in globs for TypeScript ESLint's default-project fallback. */
export const allowDefaultProjectFilePatternPresets: Nick2Bad4UAllowDefaultProjectFilePatternPresets =
    Object.freeze({
        defaultRootFiles: DEFAULT_PROJECT_FILE_PATTERNS,
        rootConfigFiles: ROOT_CONFIG_FILE_PATTERNS,
        rootMjsFiles: Object.freeze(["*.mjs", ".*.mjs"]),
        rootScriptFiles: ROOT_SCRIPT_FILE_PATTERNS,
    });
const SOURCE_FILE_PATTERNS = Object.freeze([
    "src/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
]);
const TEST_SIGNAL_IGNORES = Object.freeze([
    "**/*RuleTester*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
    "**/*ruleTester*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
    "**/*rule-tester*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
    "**/RuleTester/**",
    "**/__fixtures__/**",
    "**/benchmark/**",
    "**/benchmarks/**",
    "**/rule-tester/**",
    "**/test/_internal/**",
    "**/test/fixtures/**",
    "**/tests/_internal/**",
    "**/tests/fixtures/**",
]);
const TYPEDOC_API_FILE_PATTERNS = Object.freeze([
    "packages/*/src/**/*.{ts,tsx,mts,cts}",
    "src/**/*.{ts,tsx,mts,cts}",
]);
const TYPEDOC_API_IGNORES = Object.freeze([
    "**/*.config.{ts,tsx,mts,cts}",
    "**/*.config.*.{ts,tsx,mts,cts}",
    "**/*.{spec,test}.{ts,tsx,mts,cts}",
    "**/*.stories.{ts,tsx,mts,cts}",
    "**/__fixtures__/**",
    "**/__tests__/**",
    "**/docs/**",
    "**/fixtures/**",
    "**/test/**",
    "**/tests/**",
]);

/**
 * Nick2Bad4UEslintConfigOptions API documentation.
 *
 * @remarks
 * This interface defines the options available for configuring the Nick2Bad4U
 * ESLint setup.
 */
export interface Nick2Bad4UEslintConfigOptions {
    /**
     * Root-level files allowed to use TypeScript ESLint's default project.
     *
     * @remarks
     * Defaults to root-only JavaScript file globs. Only include a small number
     * of root files that are intentionally not covered by the nearest
     * `tsconfig.json`; broad TypeScript globs also match declaration files.
     */
    readonly allowDefaultProjectFilePatterns?: readonly string[];
    /** Plugin overrides keyed by ESLint namespace. */
    readonly plugins?: PluginOverrides;
    /** Project root used for parser root resolution and local alias checks. */
    readonly rootDirectory?: string;
    /** TypeScript project files relative to `rootDirectory`. */
    readonly tsconfigPaths?: readonly string[];
}

/**
 * Nick2Bad4UEslintConfigPresets API documentation.
 *
 * @remarks
 * This interface defines the available ESLint configuration presets for the
 * Nick2Bad4U setup.
 */
export interface Nick2Bad4UEslintConfigPresets {
    readonly all: EslintConfig[];
    readonly base: EslintConfig[];
    readonly recommended: EslintConfig[];
    readonly withoutCopilot: EslintConfig[];
    readonly withoutDocusaurus2: EslintConfig[];
    readonly withoutEtcMisc: EslintConfig[];
    readonly withoutFileProgress2: EslintConfig[];
    readonly withoutGitHubActions2: EslintConfig[];
    /** @deprecated Use `withoutGitHubActions2`. */
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
    readonly withoutVite: EslintConfig[];
    readonly withoutWriteGoodComments2: EslintConfig[];
}

// The public factory accepts plugin overrides so downstream repos can disable
// heavy integrations with withoutX presets or inject a local plugin build while
// keeping the rest of the shared config unchanged.
interface ConfigurablePlugin {
    readonly configs?: object;
    readonly flat?: object;
    readonly rules?: UnknownRecord;
}

type EslintConfig = Linter.Config;
type EslintConfigInput = EslintConfig | readonly EslintConfig[];
type PluginOverride = ConfigurablePlugin | false | null | undefined;
type PluginOverrides = Readonly<Record<string, PluginOverride>>;

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
// PowerShell one-shots:
// `$env:ESLINT_PROGRESS="nofile"; npx eslint .; Remove-Item Env:ESLINT_PROGRESS -EA 0`
// `$env:ESLINT_PROGRESS="off"; npx eslint .; Remove-Item Env:ESLINT_PROGRESS -EA 0`
const ESLINT_PROGRESS_MODE = (
    processEnvironment["ESLINT_PROGRESS"] ?? "on"
).toLowerCase();

const CI_ENVIRONMENT_VALUE = (processEnvironment["CI"] ?? "").toLowerCase();
const IS_CI =
    CI_ENVIRONMENT_VALUE !== "" &&
    CI_ENVIRONMENT_VALUE !== "0" &&
    CI_ENVIRONMENT_VALUE !== "false";
const DISABLE_PROGRESS = arrayIncludes(
    [
        "0",
        "false",
        "off",
    ],
    ESLINT_PROGRESS_MODE
);
const HIDE_PROGRESS_FILENAMES = ESLINT_PROGRESS_MODE === "nofile";

// Storybook helper
const storybookRecommendedConfigs = storybook.configs["flat/recommended"];
const storybookRecommendedSetupConfig =
    arrayFirst(storybookRecommendedConfigs) ?? {};
const storybookRecommendedStoriesRules =
    storybookRecommendedConfigs.find(
        (config) => config.name === "storybook:recommended:stories-rules"
    )?.rules ??
    storybookRecommendedConfigs.find((config) => isDefined(config.rules))
        ?.rules ??
    {};

// #endregion 🏗️ Setup and Public Types
// #region 🛠️ Config
// ═══════════════════════════════════════════════════════════════════════════════
/* eslint-disable max-lines-per-function -- Keep shared flat-config composition centralized. */
/**
 * Create the shared Nick2Bad4U ESLint flat config.
 *
 * @param options - Shared config factory options.
 *
 * @returns The composed ESLint flat config array.
 */
export const createConfig = (
    options: Nick2Bad4UEslintConfigOptions = {}
): EslintConfig[] => {
    const allowDefaultProjectFilePatterns =
        options.allowDefaultProjectFilePatterns ??
        DEFAULT_PROJECT_FILE_PATTERNS;
    const rootDirectory = path.resolve(
        options.rootDirectory ?? processEnvironment["ESLINT_CONFIG_ROOT"] ?? "."
    );
    const tsconfigPaths = options.tsconfigPaths ?? DEFAULT_TSCONFIG_PATHS;
    const pluginOverrides = options.plugins ?? {};
    const pluginOverrideEntries = new Map(objectEntries(pluginOverrides));
    // Plugin overrides are the same mechanism behind the public withoutX
    // presets and local-plugin dogfooding. A false/null value removes both the
    // plugin registration and every rule in that namespace after composition.
    const disabledPluginNames = new Set(
        [...pluginOverrideEntries]
            .filter(([, plugin]) => plugin === false || plugin === null)
            .map(([pluginName]) => pluginName)
    );
    const projectService = isEmpty(allowDefaultProjectFilePatterns)
        ? true
        : {
              allowDefaultProject: [...allowDefaultProjectFilePatterns],
          };
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

    // #region ⚙️ Global Settings
    // ═══════════════════════════════════════════════════════════════════════════════
    // #region 🧹 Global Ignore Patterns
    // ═══════════════════════════════════════════════════════════════════════════════
    // NOTE: In ESLint flat config, ignore-only entries are safest when
    // placed near the start of the config array.
    // Add patterns here to ignore files and directories globally
    const configs = [
        globalIgnores(
            [
                "**/**-instructions.md",
                "**/**.instructions.md",
                "**/**dist**/**",
                "**/*.css.d.ts",
                "**/*.module.css.d.ts",
                "**/*.secretlintrc.cjs",
                "**/*.secretlintrc.js",
                "**/*.secretlintrc.mjs",
                "**/.agentic-tools*",
                "**/.cache/**",
                "**/AGENTS.md",
                "**/CHANGELOG.md",
                "**/Coverage/**",
                "**/_ZENTASKS*",
                "**/chatproject.md",
                "**/coverage-results.json",
                "**/coverage/**",
                "**/dist-scripts/**",
                "**/dist/**",
                "**/html/**",
                "**/node_modules/**",
                "**/package-lock.json",
                "**/release/**",
                "**/secretlint.config.{js,cjs,mjs}",
                "**/secretlint.{js,cjs,mjs}",
                ".devskim.json",
                ".github/ISSUE_TEMPLATE/**",
                ".github/PULL_REQUEST_TEMPLATE/**",
                ".github/chatmodes/**",
                ".github/instructions/**",
                ".github/prompts/**",
                ".stryker-tmp/**",
                ".temp/**",
                "config/testing/types/**/*.d.ts",
                "coverage-report.json",
                "docs/Archive/**",
                "docs/Logger-Error-report.md",
                "docs/Packages/**",
                "docs/Reviews/**",
                "docs/docusaurus/.docusaurus/**",
                "docs/docusaurus/build/**",
                "docs/docusaurus/docs/**",
                "docs/docusaurus/static/*-inspector/**",
                "docs/docusaurus/static/eslint-inspector/**",
                "docs/docusaurus/static/stylelint-inspector/**",
                "examples/**",
                "playwright/reports/**",
                "playwright/test-results/**",
                "public/mockServiceWorker.js",
                "report/**",
                "reports/**",
                "script/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "scripts/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "scripts/devtools-snippets/**",
                "temp/**",
                "test/fixtures/**",
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
        // #endregion 🧹 Global Ignore Patterns
        // #region 🧭 Custom Global Rules
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
        // #endregion 🧭 Custom Global Rules
        // #region 🗣️ Global Language Options
        // ═══════════════════════════════════════════════════════════════════════════════
        // Intentionally left empty.
        // #endregion 🗣️ Global Language Options
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            name: "🌍 Global: Settings",
            settings: {
                "import-x/resolver": {
                    node: true, // Don't warn about multiple projects
                },
                "import-x/resolver-next": [
                    createTypeScriptImportResolver({
                        // Prefer package types, including ambient packages such as @types/unist.
                        alwaysTryTypes: true,
                        // Resolve Bun modules in import-x's TypeScript resolver.
                        bun: true,
                        extensions: [
                            ".cjs",
                            ".cts",
                            ".js",
                            ".json",
                            ".jsx",
                            ".mjs",
                            ".mts",
                            ".node",
                            ".ts",
                            ".tsx",
                        ],
                        // Use an array.
                        project: [...tsconfigPaths],
                    }),
                ],
            },
        },
        // #endregion ⚙️ Global Settings
        // #region 🧱 Base Flat Configs
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            // MARK: 🚚 Import-X
            ...importX.flatConfigs.recommended,
            files: [...GLOBAL_FILE_PATTERNS],
            name: "🚚 Import-X: Recommended + TypeScript",
            rules: {
                ...importX.flatConfigs.recommended.rules,
                ...importX.flatConfigs.typescript.rules,
                "import-x/consistent-type-specifier-style": "off",
                "import-x/dynamic-import-chunkname": "off",
                "import-x/exports-last": "off",
                "import-x/extensions": "warn",
                "import-x/first": "warn",
                "import-x/group-exports": "off",
                "import-x/max-dependencies": [
                    "error",
                    {
                        ignoreTypeImports: true,
                        max: 10,
                    },
                ],
                "import-x/named": "warn",
                "import-x/newline-after-import": "warn",
                "import-x/no-absolute-path": "warn",
                "import-x/no-amd": "warn",
                "import-x/no-anonymous-default-export": "warn",
                "import-x/no-commonjs": "warn",
                "import-x/no-cycle": "warn",
                "import-x/no-default-export": "off",
                "import-x/no-deprecated": "warn",
                "import-x/no-dynamic-require": "warn",
                "import-x/no-empty-named-blocks": "warn",
                "import-x/no-extraneous-dependencies": "warn",
                "import-x/no-import-module-exports": "warn",
                "import-x/no-internal-modules": "off",
                "import-x/no-mutable-exports": "warn",
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
                "import-x/prefer-namespace-import": [
                    "error",
                    {
                        patterns: [
                            "react",
                            "zod",
                            "zod/mini",
                        ],
                    },
                ],
                "import-x/unambiguous": "warn",
            },
        },
        {
            // MARK: ☕ JS
            ...js.configs.all,
            files: [...GLOBAL_FILE_PATTERNS],
            name: "☕ ESLint JS: All",
        },
        {
            // MARK: 🦄 Unicorn
            ...unicorn.configs.all,
            files: [...GLOBAL_FILE_PATTERNS],
            name: "🦄 Unicorn: All",
            rules: {
                ...unicorn.configs.all.rules,
                "unicorn/consistent-boolean-name": [
                    "error",
                    {
                        prefixes: {
                            allow: true,
                            allows: true,
                            are: true,
                            disable: true,
                            disallow: true,
                            enable: true,
                            exclude: true,
                            hide: true,
                            ignore: true,
                            include: true,
                            require: true,
                            requires: true,
                            show: true,
                            skip: true,
                            supports: true,
                            use: true,
                            without: true,
                        },
                    },
                ],
                "unicorn/consistent-destructuring": "off",
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
                "unicorn/no-asterisk-prefix-in-documentation-comments": "off",
                "unicorn/no-keyword-prefix": "off", // Too hostile for TypeScript/domain names like typeNode and errorMessage
                "unicorn/no-null": "off", // Noisy and low quality
                "unicorn/no-useless-undefined": "off",
                "unicorn/prevent-abbreviations": "off", // Noisy and low quality
                "unicorn/try-complexity": ["error", { max: 3 }],
            },
        },
        {
            // MARK: 🍹 Node
            ...nodePlugin.configs["flat/all"],
            files: [...GLOBAL_FILE_PATTERNS],
            name: "🍹 Node: All",
            rules: {
                ...nodePlugin.configs["flat/all"].rules,
                "n/file-extension-in-import": "off",
                // @Deprecated Rule: https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/no-hide-core-modules.md
                // This is deprecated since v4.2.0. This rule was based on an invalid assumption.
                // @see https://github.com/mysticatea/eslint-plugin-node/issues/69
                "n/no-hide-core-modules": "off",
                "n/no-missing-import": "off",
                // @Deprecated Rule: Old alias for hashbang
                // @see https://github.com/eslint-community/eslint-plugin-n/issues/529
                "n/shebang": "off",
            },
        },
        {
            // MARK: 🧮 Math
            ...math.configs.recommended,
            files: [...GLOBAL_FILE_PATTERNS],
            name: "🧮 Math: Recommended",
            rules: {
                ...math.configs.recommended.rules,
                "math/abs": "warn",
                "math/prefer-exponentiation-operator": "warn",
                "math/prefer-math-sum-precise": "warn",
            },
        },
        {
            // MARK: ⚜️ Canonical
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Canonical upstream types as an any
            ...canonical.configs["flat/recommended"],
            files: [...GLOBAL_FILE_PATTERNS],
            name: "⚜️ Canonical: Recommended",
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Canonical upstream types as an any
            rules: {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access  -- Canonical upstream types as an any
                ...canonical.configs["flat/recommended"].rules,
                "canonical/destructuring-property-newline": "off",
                "canonical/export-specifier-newline": "off",
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
            },
        },
        ...(isDefined(listeners.configs["strict"])
            ? [
                  {
                      // MARK: 🎧 Listeners
                      files: [...GLOBAL_FILE_PATTERNS],
                      name: "🎧 Listeners: Strict",
                      plugins: {
                          listeners,
                      },
                      rules: {
                          ...listeners.configs["strict"].rules,
                      },
                  },
              ]
            : []),
        {
            // MARK: 🐝 Module Interop
            files: [...GLOBAL_FILE_PATTERNS],
            name: "🐝 Module Interop: Recommended",
            plugins: {
                "module-interop": moduleInterop,
            },
            rules: {
                ...moduleInterop.configs.recommended.rules,
                "module-interop/no-import-cjs": "off",
                "module-interop/no-require-esm": "warn",
            },
        },
        {
            // MARK: 🍂 Comment Length
            files: [...GLOBAL_FILE_PATTERNS],
            name: "🍂 Comment Length: Recommended",
            plugins: {
                "comment-length": commentLength,
            },
            rules: {
                ...commentLength.configs["flat/recommended"].rules,
                "comment-length/limit-multi-line-comments": [
                    "warn",
                    {
                        ignoreCommentsWithCode: false,
                        ignoreUrls: true,
                        logicalWrap: true,
                        maxLength: 120,
                        mode: "compact-on-overflow",
                        semanticComments: [...COMMENT_LENGTH_SEMANTIC_COMMENTS],
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
                        semanticComments: [...COMMENT_LENGTH_SEMANTIC_COMMENTS],
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
                        semanticComments: [...COMMENT_LENGTH_SEMANTIC_COMMENTS],
                        tabSize: 4,
                    },
                ],
            },
        },
        {
            // MARK: 🍭 ESLint Plugin
            files: [...GLOBAL_FILE_PATTERNS],
            name: "🍭 ESLint Plugin: Recommended",
            plugins: {
                "eslint-plugin": eslintPluginEslintPlugin,
            },
            rules: {
                ...eslintPluginEslintPlugin.configs.recommended.rules,
                "eslint-plugin/consistent-output": "error",
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
                "eslint-plugin/no-matching-violation-suggest-message-ids":
                    "error",
                "eslint-plugin/no-property-in-node": "warn",
                "eslint-plugin/prefer-placeholders": "warn",
                "eslint-plugin/prefer-replace-text": "warn",
                "eslint-plugin/report-message-format": "warn",
                "eslint-plugin/require-meta-docs-description": "warn",
                "eslint-plugin/require-meta-docs-recommended": "warn",
                "eslint-plugin/require-meta-docs-url": "warn",
                "eslint-plugin/require-test-case-name": "warn",
                "eslint-plugin/require-test-error-positions": "warn",
                "eslint-plugin/test-case-property-ordering": "warn",
                "eslint-plugin/test-case-shorthand-strings": "warn",
                "eslint-plugin/unique-test-case-names": "warn",
            },
        },
        // #region 🦖 Docusaurus 2 Configs
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            ...docusaurus2.configs.experimental,
            files: [...DOCUSAURUS_CODE_FILE_PATTERNS],
            ignores: [...DOCUSAURUS_IGNORES],
            name: "🦖 Docusaurus 2: Experimental: Includes All + Extra Rules",
            rules: {
                ...docusaurus2.configs.experimental.rules,
                "docusaurus-2/local-search-will-not-work-in-dev": "off",
            },
        },
        {
            ...docusaurus2.configs.content,
            files: [...DOCUSAURUS_CONTENT_FILE_PATTERNS],
            ignores: [...DOCUSAURUS_IGNORES],
            name: "🦖 Docusaurus 2: Content",
        },
        // ═══════════════════════════════════════════════════════════════════════════════
        // #endregion 🦖 Docusaurus 2 Configs
        {
            // MARK: 🗂️ TSConfig
            ...tsconfig.configs.all,
            name: "🗂️ TSConfig: All",
        },
        // MARK: 📝 Remark
        remark.configs.all,
        {
            // MARK: 🧼 No Unsanitized
            files: [...GLOBAL_FILE_PATTERNS],
            name: "🧼 No Unsanitized: Recommended",
            ...noUnsanitized.configs["recommended"],
        },
        {
            // MARK: ⏱️ File Progress
            ...progress.configs["recommended-ci"],
            name: "⏱️ File Progress: Recommended CI",
            rules: {
                ...progress.configs["recommended-ci"].rules,
                // The preset already auto-hides on CI, but we also support
                // explicit local toggles.
                "file-progress/activate": DISABLE_PROGRESS ? 0 : 1,
            },
            settings: {
                ...progress.configs["recommended-ci"].settings,
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
        },
        // #region ✅ JSON Schema Validator
        // ═══════════════════════════════════════════════════════════════════════════════
        jsonSchemaValidator.configs.recommended,
        // #endregion ✅ JSON Schema Validator
        // MARK: 🤖 Copilot
        copilot.configs.all,
        // MARK: 🛡️ SDL
        sdl.configs.required,
        {
            // MARK: 🦑 GitHub Actions
            ...githubActions.configs.all,
            name: "🦑 GitHub Actions: All",
            rules: {
                ...githubActions.configs.all.rules,
                "github-actions/no-external-job": "off", // Noisy and low value (also inteferes with our dependabot merge workflow)
                "github-actions/no-top-level-permissions": "off", // Noisy and low value
            },
        },
        {
            // MARK: 👮 Security
            ...security.configs.recommended,
            name: "👮 Security: Recommended",
            rules: {
                ...security.configs.recommended.rules,
                "security/detect-object-injection": "off",
            },
        },
        {
            // MARK: 🌹 Perfectionist
            ...perfectionist.configs["recommended-natural"],
            files: [...GLOBAL_FILE_PATTERNS],
            name: "🌹 Perfectionist: Recommended Natural",
            rules: {
                ...perfectionist.configs["recommended-natural"].rules,
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
                                "TSAsExpression:not(TSSatisfiesExpression > TSAsExpression) > ArrayExpression",
                        },
                    },
                ],
            },
        },
        {
            // MARK: 🐌 RegExp
            ...regexp.configs.all,
            files: [...GLOBAL_FILE_PATTERNS],
            name: "🐌 RegExp: All",
        },
        {
            // MARK: 🐮 Promise
            ...promise.configs["flat/recommended"],
            files: [...GLOBAL_FILE_PATTERNS],
            name: "🐮 Promise: Flat Recommended",
            rules: {
                // Note: These rules are confirmed to work, upstream typing is wrong
                // @ts-expect-error -- TypeScript ESLint flat config typing issue
                ...promise.configs["flat/recommended"].rules,
                "promise/no-multiple-resolved": "warn",
                "promise/prefer-await-to-callbacks": "off",
                "promise/prefer-await-to-then": "warn",
                "promise/prefer-catch": "warn",
                "promise/spec-only": "warn",
            },
        },
        // MARK: 🍩 TypeScript ESLint Strict + Stylistic
        tseslint.configs.strictTypeChecked.map((config) =>
            scopeTypeScriptEslintConfigToCodeFiles(config)
        ),
        tseslint.configs.stylisticTypeChecked.map((config) =>
            scopeTypeScriptEslintConfigToCodeFiles(config)
        ),
        /*
         * Runtime Cleanup is an explicit opt-out/dogfood target.
         * Keep it conditional so createConfig({ plugins: { name: false } })
         * removes the upstream preset before the final namespace cleanup pass.
         * Strip runtime-cleanup's projectService so this config owns TS project
         * resolution.
         */
        // MARK: 🍧 Runtime Cleanup
        ...(runtimeCleanupPlugin === null
            ? []
            : [
                  withoutProjectServiceParserOption(
                      runtimeCleanupPlugin.configs.all
                  ),
              ]),
        // MARK: 🧪 Test Signal
        ...(testSignalPlugin === null
            ? []
            : [
                  {
                      ...testSignalPlugin.configs.all,
                      ignores: [...TEST_SIGNAL_IGNORES],
                      name: "🧪 Test Signal: All",
                  },
              ]),
        // MARK: ⚡ Vite
        vite.configs.all,
        // MARK: 🎨 Stylelint
        stylelint2.configs.all,
        {
            // MARK: 🐲 Repo Compliance
            ...repo.configs.recommended,
            name: "🐲 Repo Compliance: Recommended",
            plugins: {
                ...repo.configs.recommended.plugins,
            },
            // prettier-ignore
            rules: {
                ...repo.configs.recommended.rules,
                ...repo.configs.github.rules,
                ...repo.configs.dependabot.rules,
                ...repo.configs.node.rules,
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
                "repo-compliance/require-copilot-instructions-file": "off",
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
        {
            ...typedoc.configs.recommended,
            files: [...TYPEDOC_API_FILE_PATTERNS],
            ignores: [...TYPEDOC_API_IGNORES],
            name: "⌨️ TypeDoc: Recommended",
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
            // MARK: 🌲 Immutable
            ...immutable.configs.all,
            files: ["functional/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}"],
            name: "🌲 Immutable: functional (not used in this repo)",
        },
        {
            // MARK: 🍀 Write Good Comments
            ...writeGoodComments.configs.all,
            files: [...SOURCE_FILE_PATTERNS],
            name: "🍀 Write Good Comments: (not used in this repo)",
            // Placeholder only: keep the plugin visible without enabling its
            // prose checks for this config package's source.
            rules: {
                "write-good-comments/inclusive-language-comments": "off",
                "write-good-comments/no-profane-comments": "off",
                "write-good-comments/readability-comments": "off",
                "write-good-comments/spellcheck-comments": "off",
                "write-good-comments/task-comment-format": "off",
                "write-good-comments/write-good-comments": "off",
            },
        },
        {
            // MARK: 🛢️ No Barrel Files
            ...noBarrelFiles.flat,
            files: [...GLOBAL_FILE_PATTERNS],
            name: "🛢️ No Barrel Files",
        },
        {
            // MARK: 🐓 Nitpick
            ...nitpick.configs.recommended,
            files: [...GLOBAL_FILE_PATTERNS],
            name: "🐓 Nitpick: recommended",
        },
        {
            // MARK: 💬 ESLint Comments
            ...comments.recommended,
            files: [...GLOBAL_FILE_PATTERNS],
            name: "💬 ESLint comments: recommended",
            rules: {
                ...comments.recommended.rules,
                "@eslint-community/eslint-comments/no-restricted-disable":
                    "warn",
                "@eslint-community/eslint-comments/no-use": [
                    "error",
                    {
                        allow: [
                            "eslint",
                            "eslint-disable",
                            "eslint-disable-line",
                            "eslint-disable-next-line",
                            "eslint-enable",
                        ],
                    },
                ],
                "@eslint-community/eslint-comments/require-description": "warn",
            },
        },
        {
            // MARK: ➿ Array func
            ...arrayFunc.configs["all"],
            files: [...GLOBAL_FILE_PATTERNS],
            name: "➿ Array func: all",
            rules: {
                // Note: These rules are confirmed to work, upstream typing is wrong
                // @ts-expect-error -- TypeScript ESLint flat config typing issue
                ...arrayFunc.configs["all"].rules,
                //  Always use spread. It's more performant and the TypeScript/JavaScript community standard.
                "array-func/prefer-array-from": "off",
            },
        },
        {
            // MARK: 🫎 De Morgan
            files: [...GLOBAL_FILE_PATTERNS],
            name: "🫎 De Morgan: recommended",
            ...deMorgan.configs.recommended,
        },
        // MARK: 🧑‍⚖️ Case Police
        ...casePolice.configs.recommended.map((config) =>
            config.name === "case-police/rules"
                ? {
                      ...config,
                      plugins: {
                          ...config.plugins,
                          "case-police": casePolice,
                      },
                  }
                : config
        ),
        // ...jsdocPlugin.configs["examples-and-default-expressions"],
        // #endregion 🧱 Base Flat Configs
        // #region 🐙 GitHub Plugin Notes
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
        //     files: [...CODE_FILE_PATTERNS],
        //     name: "GitHub: recommended",
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
        // #endregion 🐙 GitHub Plugin Notes
        // #region 🦬 TSDoc Rules
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/*.{ts,mts,cts,tsx}"],
            name: "🦬 TSDoc: syntax (TypeScript files)",
            plugins: {
                tsdoc: tsdoc,
            },
            rules: {
                "tsdoc/syntax": "warn",
            },
        },
        {
            files: ["src/**/*.{ts,mts,cts,tsx}"],
            name: "⌨️ TSDoc Require 2: source docs",
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
        // #endregion 🦬 TSDoc Rules
        // #region 🎨 CSS Files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            ...css.configs.recommended,
            files: ["**/*.css"],
            ignores: ["docs/**", "**/test*/**"],
            language: "css/css",
            languageOptions: {
                tolerant: true,
            },
            name: "🎨 CSS: recommended",
            rules: {
                ...css.configs.recommended.rules,
                "css/prefer-logical-properties": "warn",
                "css/relative-font-units": "warn",
                "css/selector-complexity": "warn",
                "css/use-layers": "off",
            },
        },
        {
            ...cssModules.configs["recommended"],
            files: ["**/*.css"],
            ignores: ["docs/**", "**/test*/**"],
            name: "🎨 CSS Modules: recommended",
            plugins: {
                "css-modules": cssModules,
            },
            rules: {
                // Note: These rules are confirmed to work, upstream typing is wrong
                // @ts-expect-error -- TypeScript ESLint flat config typing issue
                ...cssModules.configs["recommended"].rules,
            },
        },
        {
            files: ["**/*.css"],
            ignores: ["docs/**", "**/test*/**"],
            name: "🎨 Undefined CSS Classes: recommended",
            plugins: {
                "undefined-css-classes": undefinedCSS,
            },
            rules: {
                "undefined-css-classes/no-undefined-css-classes": [
                    "error",
                    {
                        // Allow dynamic classes with template literals (default: true)
                        allowDynamicClasses: true,
                        // Glob patterns for CSS files to scan
                        cssFiles: ["**/*.css"],
                        // Patterns to exclude from scanning
                        excludePatterns: [
                            "**/node_modules/**",
                            "**/dist/**",
                            "**/build/**",
                        ],
                        // Regex patterns for classes to ignore
                        ignoreClassPatterns: ["^custom-", "^legacy-"],
                        // Ignore Tailwind CSS classes (default: true)
                        ignoreTailwind: true,
                        // Only ignore Tailwind if config file exists (default: true)
                        requireTailwindConfig: true,
                        // Base directory for CSS file resolution
                        // baseDir: rootDirectory,
                    },
                ],
            },
        },
        // #endregion 🎨 CSS Files
        // #region 🕸️ React + Web Files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            ...react.configs.all,
            files: [
                "**/{web,app,frontend,client,components,pages,routes,layouts,views,screens,features,ui,widgets,containers,hooks,context,contexts,providers}/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                // Common React entry/root files without applying React rules to all of src/
                "**/src/*.{jsx,tsx}",
                "**/src/{App,main,index,router,routes,Root,ErrorBoundary}.{js,jsx,ts,tsx}",
                ...DOCUSAURUS_CODE_FILE_PATTERNS,
                "**/assets/js/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            ],
            ignores: [...DOCUSAURUS_IGNORES],
            name: "🕸️ React + Web Files",
            rules: {
                ...react.configs.all.rules,
                ...react.configs["strict-type-checked"].rules,
                "@eslint-react/no-implicit-children": "warn",
                "@eslint-react/no-implicit-key": "warn",
                "@eslint-react/no-implicit-ref": "warn",
                // Legacy React rule aliases:
                "@eslint-react/x-error-boundaries": "off",
                "@eslint-react/x-exhaustive-deps": "off",
                "@eslint-react/x-globals": "off",
                "@eslint-react/x-immutability": "off",
                "@eslint-react/x-no-access-state-in-setstate": "off",
                "@eslint-react/x-no-array-index-key": "off",
                "@eslint-react/x-no-children-count": "off",
                "@eslint-react/x-no-children-for-each": "off",
                "@eslint-react/x-no-children-map": "off",
                "@eslint-react/x-no-children-only": "off",
                "@eslint-react/x-no-children-to-array": "off",
                "@eslint-react/x-no-class-component": "off",
                "@eslint-react/x-no-clone-element": "off",
                "@eslint-react/x-no-component-will-mount": "off",
                "@eslint-react/x-no-component-will-receive-props": "off",
                "@eslint-react/x-no-component-will-update": "off",
                "@eslint-react/x-no-context-provider": "off",
                "@eslint-react/x-no-create-ref": "off",
                "@eslint-react/x-no-direct-mutation-state": "off",
                "@eslint-react/x-no-duplicate-key": "off",
                "@eslint-react/x-no-forward-ref": "off",
                "@eslint-react/x-no-implicit-children": "off",
                "@eslint-react/x-no-implicit-key": "off",
                "@eslint-react/x-no-implicit-ref": "off",
                "@eslint-react/x-no-leaked-conditional-rendering": "off",
                "@eslint-react/x-no-missing-component-display-name": "off",
                "@eslint-react/x-no-missing-context-display-name": "off",
                "@eslint-react/x-no-missing-key": "off",
                "@eslint-react/x-no-misused-capture-owner-stack": "off",
                "@eslint-react/x-no-nested-component-definitions": "off",
                "@eslint-react/x-no-nested-lazy-component-declarations": "off",
                "@eslint-react/x-no-set-state-in-component-did-mount": "off",
                "@eslint-react/x-no-set-state-in-component-did-update": "off",
                "@eslint-react/x-no-set-state-in-component-will-update": "off",
                "@eslint-react/x-no-unnecessary-use-prefix": "off",
                "@eslint-react/x-no-unsafe-component-will-mount": "off",
                "@eslint-react/x-no-unsafe-component-will-receive-props": "off",
                "@eslint-react/x-no-unsafe-component-will-update": "off",
                "@eslint-react/x-no-unstable-context-value": "off",
                "@eslint-react/x-no-unstable-default-props": "off",
                "@eslint-react/x-no-unused-class-component-members": "off",
                "@eslint-react/x-no-unused-props": "off",
                "@eslint-react/x-no-unused-state": "off",
                "@eslint-react/x-no-use-context": "off",
                "@eslint-react/x-purity": "off",
                "@eslint-react/x-refs": "off",
                "@eslint-react/x-rules-of-hooks": "off",
                "@eslint-react/x-set-state-in-effect": "off",
                "@eslint-react/x-set-state-in-render": "off",
                "@eslint-react/x-static-components": "off",
                "@eslint-react/x-unsupported-syntax": "off",
                "@eslint-react/x-use-memo": "off",
                "@eslint-react/x-use-state": "off",
            },
        },
        // #endregion 🕸️ React + Web Files
        // #region 🦖 Docusaurus Files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            ...docusaurus.configs.all,
            files: [...DOCUSAURUS_CODE_FILE_PATTERNS],
            ignores: [...DOCUSAURUS_IGNORES],
            languageOptions: {
                globals: {
                    ...globals.browser,
                    ...globals.node,
                },
                parser: tseslint.parser,
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true,
                        jsx: true,
                    },
                    ecmaVersion: "latest",
                    jsDocParsingMode: "all",
                    projectService: true,
                    sourceType: "module",
                    tsconfigRootDir: rootDirectory,
                    warnOnUnsupportedTypeScriptVersion: true,
                },
            },
            name: "🦖 Docusaurus: Workspace Files",
            plugins: {
                "@docusaurus": docusaurus,
            },
            rules: {
                ...docusaurus.configs.all.rules,
                "@docusaurus/no-untranslated-text": "off",
                "@docusaurus/string-literal-i18n-messages": "off",
                "import-x/no-unresolved": [
                    "error",
                    {
                        ignore: [
                            "^@docusaurus/",
                            "^@generated(?:/|$)",
                            "^@site(?:/|$)",
                            "^@theme(?:/|$)",
                            "^@theme-init(?:/|$)",
                            "^@theme-original(?:/|$)",
                        ],
                    },
                ],
            },
        },
        // #endregion 🦖 Docusaurus Files
        // #region 🚢 Dogfood Plugin Overrides
        // ═══════════════════════════════════════════════════════════════════════════════
        // Pass `createConfig({ plugins: { typefest: localPlugin } })` from a
        // consuming eslint-plugin repo to lint against its local build/source plugin.
        // Pass `false`/`null` to disable that plugin's packaged rules entirely.
        // #endregion 🚢 Dogfood Plugin Overrides
        // #region ⌨️ Typefest Rules
        // ═══════════════════════════════════════════════════════════════════════════════
        ...(typefest === null
            ? []
            : [
                  {
                      ...typefest.configs.experimental,
                      // We only target source files because they're unnecessary for tests/etc
                      files: [
                          "src/**/*.{ts,tsx,mts,cts}",
                          //    "test/**/*.{ts,tsx,mts,cts}"
                      ],
                      name: "⌨️ Typefest: Rules for Source",
                  },
              ]),
        // #endregion ⌨️ Typefest Rules
        // #region 🧰 Etc-Misc Rules
        // ═══════════════════════════════════════════════════════════════════════════════
        ...(etcMisc === null
            ? []
            : [
                  {
                      // We only target source files because they're unnecessary for tests/etc
                      files: [
                          ...SOURCE_FILE_PATTERNS,
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
        // #endregion 🧰 Etc-Misc Rules
        // #region 🌍 Global Rules After Plugin Configs
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: [...GLOBAL_FILE_PATTERNS],
            languageOptions: {
                globals: {
                    ...globals.builtin,
                    ...globals.browser,
                    ...globals.nodeBuiltin,
                },
                parser: tseslint.parser,
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true,
                    },
                    ecmaVersion: "latest",
                    jsDocParsingMode: "all",
                    projectService,
                    sourceType: "module",
                    tsconfigRootDir: rootDirectory,
                    warnOnUnsupportedTypeScriptVersion: true,
                },
            },
            name: "🌍 Global: Rules",
            plugins: {
                "@typescript-eslint": tseslint.plugin,
            },
            rules: {
                "@typescript-eslint/class-methods-use-this": "warn",
                // @see https://typescript-eslint.io/rules/consistent-return/
                // Recommended to use `noImplicitReturns` in Tsconfig for better coverage and to avoid edge cases where
                // the ESLint rule can miss certain code paths.
                "@typescript-eslint/consistent-return": "off",
                // Function and type safety rules
                "@typescript-eslint/consistent-type-exports": "warn",
                "@typescript-eslint/consistent-type-imports": "warn",
                "@typescript-eslint/default-param-last": "warn",
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
                "@typescript-eslint/no-dupe-class-members": "warn",
                "@typescript-eslint/no-explicit-any": [
                    "warn",
                    {
                        fixToUnknown: false,
                        ignoreRestArgs: true,
                    },
                ],
                // Keep enabled: Helps with bundle optimization and makes type vs runtime imports clearer.
                // Can be resolved incrementally as warnings.
                "@typescript-eslint/no-import-type-side-effects": "warn",
                // @see https://typescript-eslint.io/rules/no-invalid-this/
                // Covered by TypeScript's `noImplicitThis` compiler option,
                // which provides better coverage and understanding of `this` in various contexts (e.g. class
                // properties, arrow functions, etc.) without false positives.
                "@typescript-eslint/no-invalid-this": "off",
                "@typescript-eslint/no-loop-func": "warn",
                "@typescript-eslint/no-magic-numbers": "off",
                "@typescript-eslint/no-misused-promises": [
                    "error",
                    {
                        checksConditionals: true, // Check if Promises used in conditionals
                        checksSpreads: true, // Check Promise spreads
                        checksVoidReturn: true, // Critical for IPC handlers
                    },
                ],
                "@typescript-eslint/no-non-null-assertion": "warn",
                // @see https://typescript-eslint.io/rules/no-redeclare/
                // Covered by TypeScript compiler
                "@typescript-eslint/no-redeclare": "off",
                "@typescript-eslint/no-restricted-imports": [
                    "warn",
                    {
                        paths: [
                            {
                                message:
                                    "sys is deprecated. Use node:util instead.",
                                name: "sys",
                            },
                            {
                                message:
                                    "node:sys is deprecated. Use node:util instead.",
                                name: "node:sys",
                            },
                            {
                                message:
                                    "constants is deprecated. Use constants from the relevant module, e.g. node:fs.constants, node:os.constants, or node:crypto.constants.",
                                name: "constants",
                            },
                            {
                                message:
                                    "node:constants is deprecated. Use constants from the relevant module, e.g. node:fs.constants, node:os.constants, or node:crypto.constants.",
                                name: "node:constants",
                            },
                            {
                                message:
                                    "domain is legacy/pending deprecation. Use AsyncLocalStorage, AsyncResource, try/catch, promises, or explicit error handling instead.",
                                name: "domain",
                            },
                            {
                                message:
                                    "node:domain is legacy/pending deprecation. Use AsyncLocalStorage, AsyncResource, try/catch, promises, or explicit error handling instead.",
                                name: "node:domain",
                            },
                            {
                                message:
                                    "request is deprecated/maintenance-only. Use native fetch for ordinary HTTP, or undici/got when you need a dedicated client.",
                                name: "request",
                            },
                            {
                                message:
                                    "request-promise depends on deprecated request. Use native fetch, undici, or got.",
                                name: "request-promise",
                            },
                            {
                                message:
                                    "request-promise-native depends on deprecated request. Use native fetch, undici, or got.",
                                name: "request-promise-native",
                            },
                            {
                                message:
                                    "Use URLSearchParams unless you specifically need Node's legacy querystring behavior.",
                                name: "querystring",
                            },
                            {
                                message:
                                    "Use URLSearchParams unless you specifically need Node's legacy querystring behavior.",
                                name: "node:querystring",
                            },
                            {
                                importNames: ["parse", "resolve"],
                                message:
                                    "Avoid Node's legacy URL API. Use URL, URLSearchParams, fileURLToPath, pathToFileURL, domainToASCII, or domainToUnicode from node:url instead.",
                                name: "url",
                            },
                            {
                                importNames: ["parse", "resolve"],
                                message:
                                    "Avoid Node's legacy URL API. Use URL, URLSearchParams, fileURLToPath, pathToFileURL, domainToASCII, or domainToUnicode from node:url instead.",
                                name: "node:url",
                            },
                            {
                                importNames: [
                                    "_extend",
                                    "debug",
                                    "error",
                                    "isArray",
                                    "isBoolean",
                                    "isBuffer",
                                    "isDate",
                                    "isError",
                                    "isFunction",
                                    "isNull",
                                    "isNullOrUndefined",
                                    "isNumber",
                                    "isObject",
                                    "isPrimitive",
                                    "isRegExp",
                                    "isString",
                                    "isSymbol",
                                    "isUndefined",
                                    "log",
                                    "print",
                                    "puts",
                                    "toUSVString",
                                ],
                                message:
                                    "Avoid deprecated/legacy util helpers. Use modern JS built-ins, Buffer.isBuffer(), Array.isArray(), util.types, Object.assign(), or a real logger.",
                                name: "util",
                            },
                            {
                                importNames: [
                                    "_extend",
                                    "debug",
                                    "error",
                                    "isArray",
                                    "isBoolean",
                                    "isBuffer",
                                    "isDate",
                                    "isError",
                                    "isFunction",
                                    "isNull",
                                    "isNullOrUndefined",
                                    "isNumber",
                                    "isObject",
                                    "isPrimitive",
                                    "isRegExp",
                                    "isString",
                                    "isSymbol",
                                    "isUndefined",
                                    "log",
                                    "print",
                                    "puts",
                                    "toUSVString",
                                ],
                                message:
                                    "Avoid deprecated/legacy node:util helpers. Use modern JS built-ins, Buffer.isBuffer(), Array.isArray(), util.types, Object.assign(), or a real logger.",
                                name: "node:util",
                            },
                            {
                                message:
                                    "node:punycode is deprecated. Use node:url domainToASCII/domainToUnicode for URL/domain work, or an explicit userland punycode package if you truly need raw Punycode.",
                                name: "node:punycode",
                            },
                            {
                                message:
                                    "The bundled punycode module is deprecated. Use node:url domainToASCII/domainToUnicode, WHATWG URL APIs, or import an explicit userland punycode package if truly needed.",
                                name: "punycode",
                            },
                            {
                                importNames: [
                                    "createCipher",
                                    "createDecipher",
                                    "pseudoRandomBytes",
                                    "prng",
                                    "rng",
                                ],
                                message:
                                    "Avoid deprecated crypto APIs. Use createCipheriv/createDecipheriv with explicit IVs, or randomBytes/randomUUID as appropriate.",
                                name: "crypto",
                            },
                            {
                                importNames: [
                                    "createCipher",
                                    "createDecipher",
                                    "pseudoRandomBytes",
                                    "prng",
                                    "rng",
                                ],
                                message:
                                    "Avoid deprecated crypto APIs. Use createCipheriv/createDecipheriv with explicit IVs, or randomBytes/randomUUID as appropriate.",
                                name: "node:crypto",
                            },
                            {
                                importNames: [
                                    "_unrefActive",
                                    "active",
                                    "enroll",
                                    "unenroll",
                                ],
                                message:
                                    "Avoid undocumented/deprecated timer internals. Use setTimeout, clearTimeout, setInterval, clearInterval, ref(), or unref().",
                                name: "timers",
                            },
                            {
                                importNames: [
                                    "_unrefActive",
                                    "active",
                                    "enroll",
                                    "unenroll",
                                ],
                                message:
                                    "Avoid undocumented/deprecated timer internals. Use setTimeout, clearTimeout, setInterval, clearInterval, ref(), or unref().",
                                name: "node:timers",
                            },
                            {
                                message: "Use String.prototype.padStart().",
                                name: "left-pad",
                            },
                            {
                                message:
                                    "node-uuid is obsolete. Use uuid named exports or crypto.randomUUID() for UUID v4.",
                                name: "node-uuid",
                            },
                            {
                                message:
                                    "uuid deep imports are deprecated/unsupported in modern uuid. Use named exports from uuid, e.g. import { v4 as uuidv4 } from 'uuid'.",
                                name: "uuid/v1",
                            },
                            {
                                message:
                                    "uuid deep imports are deprecated/unsupported in modern uuid. Use named exports from uuid, e.g. import { v4 as uuidv4 } from 'uuid'.",
                                name: "uuid/v3",
                            },
                            {
                                message:
                                    "uuid deep imports are deprecated/unsupported in modern uuid. Use named exports from uuid, e.g. import { v4 as uuidv4 } from 'uuid'.",
                                name: "uuid/v4",
                            },
                            {
                                message:
                                    "uuid deep imports are deprecated/unsupported in modern uuid. Use named exports from uuid, e.g. import { v5 as uuidv5 } from 'uuid'.",
                                name: "uuid/v5",
                            },
                            {
                                message:
                                    "Use uuid named exports or crypto.randomUUID() instead.",
                                name: "uuidv4",
                            },
                            {
                                message:
                                    "@babel/polyfill is deprecated. Use core-js/stable and regenerator-runtime/runtime directly if needed.",
                                name: "@babel/polyfill",
                            },
                            {
                                message:
                                    "babel-polyfill is deprecated. Use core-js/stable and regenerator-runtime/runtime directly if needed.",
                                name: "babel-polyfill",
                            },
                            {
                                message:
                                    "lodash.get is obsolete. Use optional chaining and nullish coalescing instead.",
                                name: "lodash.get",
                            },
                            {
                                message:
                                    "object-assign is obsolete for modern runtimes. Use Object.assign().",
                                name: "object-assign",
                            },
                            {
                                message:
                                    "isarray is obsolete. Use Array.isArray().",
                                name: "isarray",
                            },
                        ],
                    },
                ],
                "@typescript-eslint/no-restricted-types": [
                    "error",
                    {
                        types: {
                            Function: {
                                message: arrayJoin(
                                    [
                                        "The `Function` type accepts any function-like value.",
                                        "It provides no type safety when calling the function, which can be a common source of bugs.",
                                        "If you are expecting the function to accept certain arguments, you should explicitly define the function shape.",
                                        "Use '(...args: unknown[]) => unknown' for generic handlers or define specific function signatures.",
                                    ],
                                    "\n"
                                ),
                            },
                        },
                    },
                ],
                "@typescript-eslint/no-shadow": "warn",
                "@typescript-eslint/no-unnecessary-condition": [
                    "warn",
                    {
                        allowConstantLoopConditions: true, // Allow while(true) patterns in services
                    },
                ],
                "@typescript-eslint/no-unnecessary-parameter-property-assignment":
                    "warn",
                "@typescript-eslint/no-unnecessary-qualifier": "warn",
                "@typescript-eslint/no-unsafe-type-assertion": "warn",
                "@typescript-eslint/no-unused-private-class-members": "warn",
                "@typescript-eslint/no-use-before-define": [
                    "warn",
                    {
                        allowNamedExports: false,
                        classes: true,
                        enums: true,
                        functions: false,
                        ignoreTypeReferences: true,
                        typedefs: true,
                        variables: true,
                    },
                ],
                "@typescript-eslint/no-useless-empty-export": "warn",
                "@typescript-eslint/parameter-properties": "warn",
                "@typescript-eslint/prefer-destructuring": "off",
                "@typescript-eslint/prefer-enum-initializers": "warn",
                "@typescript-eslint/prefer-nullish-coalescing": [
                    "error",
                    {
                        ignoreConditionalTests: false, // Check conditionals for nullish coalescing opportunities
                    },
                ],
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
                "@typescript-eslint/require-array-sort-compare": "warn",
                "@typescript-eslint/restrict-template-expressions": [
                    "error",
                    {
                        allowAny: false,
                        allowBoolean: false,
                        allowNever: false,
                        allowNullish: false,
                        allowNumber: true,
                        allowRegExp: false,
                    },
                ],
                "@typescript-eslint/strict-boolean-expressions": "warn",
                "@typescript-eslint/strict-void-return": "warn",
                "@typescript-eslint/switch-exhaustiveness-check": "error", // Ensure switch statements are exhaustive
                camelcase: "off",
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
                // Use the TypeScript rule; it handles class properties and React components better.
                "class-methods-use-this": "off",
                "consistent-return": "off", // Use TypeScript version
                curly: "off",
                "default-param-last": "off", // Use TypeScript version instead for better type awareness
                "dot-notation": "off", // Use the TypeScript version instead
                eqeqeq: "off", // Use the TypeScript version instead
                "func-style": "off",
                "id-length": "off",
                "init-declarations": "off", // Use TypeScript Version
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
                "max-params": "off", // Use TypeScript version which can be configured to ignore `this` parameters and is more aware of function overloads.
                "max-statements": "off",
                "no-continue": "off",
                "no-implied-eval": "off", // Use TypeScript version which can catch more cases with type information
                "no-inline-comments": "off", // Allow inline comments for complex logic explanations
                "no-invalid-this": "off", // Use TypeScript version which understands class properties and arrow functions
                "no-loop-func": "off", // Use TypeScript version instead
                "no-magic-numbers": "off", // Use TypeScript Version instead
                "no-restricted-imports": "off", // Use the TypeScript-specific version for better type-aware handling
                "no-shadow": "off", // Use the TypeScript-specific version for better type-aware handling
                "no-ternary": "off",
                "no-undefined": "off", // Use explicit `undefined` for clarity and type safety
                "no-unused-private-class-members": "off", // Use TypeScript version instead
                "no-use-before-define": "off", // Use TypeScript version instead
                "no-void": "off",
                "object-shorthand": "off",
                "one-var": "off",
                "prefer-arrow-callback": [
                    "warn",
                    { allowNamedFunctions: true, allowUnboundThis: true },
                ],
                "prefer-destructuring": "off",
                "require-unicode-regexp": "off",
                "sdl/no-nonnull-assertion-on-security-input": "error",
                "sdl/no-trusted-types-policy-pass-through": "error",
                "sdl/no-unsafe-cast-to-trusted-types": "error",
                "sort-imports": "off",
                "sort-keys": "off",
                "sort-vars": "off",
            },
        },
        // #endregion 🌍 Global Rules After Plugin Configs
        // #region 🧪 Test & Benchmark Files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            // MARK: 🧪 Vitest
            ...vitest.configs.all,
            files: [
                "test/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "tests/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "src/test/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "benchmarks/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "benchmark/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            ],
            name: "🧪 Vitest: all",
            rules: {
                ...vitest.configs.all.rules,
                "vitest/max-expects": ["warn", { max: 20 }], // Encourage more focused tests, but allow flexibility when needed
                "vitest/prefer-mock-return-shorthand": "warn",
                "vitest/prefer-to-be-falsy": "off", // Allow explicit checks for false, 0, '', etc. for clarity in tests
                "vitest/prefer-to-be-truthy": "off", // Allow explicit checks for true, non-empty strings, non-zero numbers, etc. for clarity in tests
                "vitest/require-hook": "off",
                "vitest/require-test-timeout": "off", // Allow flexibility in test timeouts, especially for integration tests or tests with external dependencies
                "vitest/warn-todo": "warn",
            },
        },
        {
            // MARK: 👨‍🔬 Testing Library
            ...testingLibrary.configs["flat/dom"],
            files: [
                "test/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "tests/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "src/test/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "benchmarks/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "benchmark/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            ],
            name: "👨‍🔬 Testing Library: DOM",
            rules: {
                ...testingLibrary.configs["flat/dom"].rules,
                "testing-library/await-async-queries": "error",
                "testing-library/consistent-data-testid": [
                    "warn",
                    {
                        testIdAttribute: ["data-testid"],
                        testIdPattern:
                            "^[a-z]+([A-Z][a-z]+)*(-[a-z]+([A-Z][a-z]+)*)*$", // Kebab-case or camelCase
                    },
                ],
                "testing-library/no-container": "warn",
                "testing-library/no-debugging-utils": "warn",
                "testing-library/no-dom-import": "warn",
                "testing-library/no-manual-cleanup": "warn",
                "testing-library/no-node-access": [
                    "warn",
                    { allowContainerFirstChild: true },
                ],
                "testing-library/no-render-in-lifecycle": "warn",
                "testing-library/no-test-id-queries": "warn",
                "testing-library/no-unnecessary-act": "warn",
                "testing-library/prefer-explicit-assert": "warn",
                "testing-library/prefer-implicit-assert": "warn",
                "testing-library/prefer-query-matchers": "warn",
                "testing-library/prefer-screen-queries": "warn",
                "testing-library/prefer-user-event": "warn",
                "testing-library/prefer-user-event-setup": "warn",
                "testing-library/render-result-naming-convention": "warn",
            },
        },
        {
            // MARK: 🧪 Tests: Tests, Benchmarks ⛔ Overrides
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
                parser: tseslint.parser,
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true,
                    },
                    ecmaVersion: "latest",
                    jsDocParsingMode: "all",
                    projectService: true,
                    sourceType: "module",
                    tsconfigRootDir: rootDirectory,
                    warnOnUnsupportedTypeScriptVersion: true,
                },
            },
            name: "🧪 Tests: Tests, Benchmarks ⛔ Overrides",
            rules: {
                "@typescript-eslint/array-type": "off",
                "@typescript-eslint/no-empty-function": "off", // Empty mocks/stubs are common
                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/no-floating-promises": "off",
                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/no-restricted-types": "off", // Tests may need generic Function types
                "@typescript-eslint/no-shadow": "off",
                "@typescript-eslint/no-unnecessary-condition": "off",
                "@typescript-eslint/no-unsafe-assignment": "off",
                "@typescript-eslint/no-unsafe-enum-comparison": "off",
                "@typescript-eslint/no-unsafe-function-type": "off", // Tests may use generic handlers
                "@typescript-eslint/no-unsafe-type-assertion": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/no-use-before-define": "off", // Allow use before define in tests
                "@typescript-eslint/prefer-readonly-parameter-types": "off",
                "@typescript-eslint/unbound-method": "off",
                "default-case": "off",
                "func-name-matching": "off", // Allow function names to not match variable names
                "func-names": "off",
                "import-x/max-dependencies": "off",
                "max-classes-per-file": "off",
                "max-depth": "off",
                "n/no-sync": "off",
                "n/no-unpublished-import": "off",
                "new-cap": "off", // Allow new-cap for class constructors
                "no-await-in-loop": "off", // Allow await in loops for sequential operations
                "no-barrel-files/no-barrel-files": "off", // Allow barrel files in tests for convenience
                "no-console": "off",
                "no-new": "off", // Allow new for class constructors
                "no-plusplus": "off",
                "no-promise-executor-return": "off", // Allow returning values from promise executors
                "no-undef-init": "off",
                "no-underscore-dangle": "off",
                "no-useless-assignment": "off",
                "security/detect-non-literal-fs-filename": "off",
                "typedoc/require-exported-doc-comment": "off", // Allow non-exported functions in tests without doc comments
                "unicorn/consistent-function-scoping": "off", // Tests often use different scoping
                "unicorn/filename-case": "off", // Allow test files to have any case
                "unicorn/no-array-callback-reference": "off",
                "unicorn/no-await-expression-member": "off", // Allow await in test expressions
                "unicorn/prefer-at": "off",
                "unicorn/prefer-spread": "off",
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
                        // Prefer package types, including ambient packages such as @types/unist.
                        alwaysTryTypes: true,
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
                "unicorn/no-negated-condition": "off",
                "unicorn/no-typeof-undefined": "off",
            },
        },
        // #endregion 🧪 Test Files
        // #region 📦 Package Metadata
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/package.json"],
            language: "json/json",
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
                "json/sort-keys": "off",
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
                "package-json/no-local-dependencies": "warn",
                "package-json/no-redundant-files": "warn",
                "package-json/no-redundant-publishConfig": "warn",
                "package-json/order-properties": "warn",
                "package-json/repository-shorthand": "warn",
                "package-json/require-attribution": "warn",
                "package-json/require-author": "warn",
                // Not a CLI package.
                "package-json/require-bin": "off",
                "package-json/require-browser": "off",
                "package-json/require-bugs": "warn",
                "package-json/require-bundleDependencies": "off",
                "package-json/require-config": "off",
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
                "package-json/require-gypfile": "off",
                "package-json/require-homepage": "warn",
                "package-json/require-keywords": "warn",
                "package-json/require-libc": "off",
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
                "package-json/require-peerDependenciesMeta": "warn",
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
                "package-json/restrict-private-properties": [
                    "warn",
                    {
                        blockedProperties: ["publishConfig"],
                    },
                ],
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
                "package-json/valid-browser": "warn",
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
                "package-json/valid-gypfile": "warn",
                "package-json/valid-homepage": "warn",
                "package-json/valid-keywords": "warn",
                "package-json/valid-libc": "warn",
                "package-json/valid-license": "warn",
                "package-json/valid-main": "warn",
                "package-json/valid-man": "warn",
                "package-json/valid-module": "warn",
                "package-json/valid-name": "warn",
                "package-json/valid-optionalDependencies": "warn",
                "package-json/valid-os": "warn",
                "package-json/valid-packageManager": "warn",
                "package-json/valid-peerDependencies": "warn",
                "package-json/valid-peerDependenciesMeta": "warn",
                "package-json/valid-peerDependenciesMeta-relationship": "warn",
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
        // #endregion 📦 Package Metadata
        // #region 📁 Markdown Files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/*.{md,markup,atom,rss,markdown}"],
            ignores: [
                "**/docs/packages/**",
                "**/docs/TSDoc/**",
                "**/.github/agents/**",
            ],
            language: "markdown/gfm",
            languageOptions: {
                frontmatter: "yaml",
                math: true,
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true,
                    },
                },
            },
            name: "📁 Markdown: **/*.{MD,MARKUP,ATOM,RSS,MARKDOWN}",
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
                "markdown/no-missing-label-refs": [
                    "warn",
                    {
                        allowLabels: [
                            "!CAUTION",
                            "!IMPORTANT",
                            "!NOTE",
                            "!TIP",
                            "!WARNING",
                        ],
                    },
                ],
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
        ...(enableMarkdownCodeBlockLinting
            ? [
                  // The markdown processor is an extraction pass: ESLint
                  // receives virtual files such as `README.md/0_0.js`, not the
                  // original Markdown document. That keeps remark/remark away
                  // from snippets, but it also means an enabled processor
                  // changes the Markdown lint pass from "document rules" to
                  // "extracted snippet rules". Keep this opt-in via
                  // ENABLE_MARKDOWN_CODE_BLOCK_LINTING=1.
                  // Non-standalone snippets need `<!-- eslint-skip -->`
                  // immediately before the fence or a non-JS language tag such
                  // as `text`.
                  {
                      files: ["**/*.{md,markdown}"],
                      ignores: [
                          "**/docs/packages/**",
                          "**/docs/TSDoc/**",
                          "**/.github/agents/**",
                      ],
                      name: "📁 Markdown: Code block processor",
                      processor: "markdown/markdown",
                  },
                  // Extracted code fences are matched again by normal
                  // flat-config globs. For example, `README.md/0_0.js` matches
                  // the global JS/TS blocks and `README.md/1_1.json` matches
                  // the JSON block. Keep this override narrow to virtual
                  // Markdown paths so these relaxations do not affect real
                  // source files.
                  {
                      files: ["**/*.md/**", "**/*.markdown/**"],
                      languageOptions: {
                          parserOptions: {
                              ecmaFeatures: {
                                  impliedStrict: true,
                              },
                              program: null,
                              project: false,
                              projectService: false,
                          },
                      },
                      name: "📁 Markdown: Code block virtual files ⛔ Overrides",
                      rules: {
                          ...tseslint.configs.disableTypeChecked.rules,
                          "@typescript-eslint/no-unused-vars": "off",
                          "eol-last": "off",
                          "import-x/default": "off",
                          "import-x/export": "off",
                          "import-x/extensions": "off",
                          "import-x/max-dependencies": "off",
                          "import-x/named": "off",
                          "import-x/namespace": "off",
                          "import-x/no-anonymous-default-export": "off",
                          "import-x/no-cycle": "off",
                          "import-x/no-extraneous-dependencies": "off",
                          "import-x/no-relative-packages": "off",
                          "import-x/no-restricted-paths": "off",
                          "import-x/no-unassigned-import": "off",
                          "import-x/no-unresolved": "off",
                          "import-x/no-unused-modules": "off",
                          "import-x/unambiguous": "off",
                          "json/sort-keys": "off",
                          "n/no-extraneous-import": "off",
                          "n/no-extraneous-require": "off",
                          "n/no-missing-import": "off",
                          "n/no-missing-require": "off",
                          "n/no-unpublished-import": "off",
                          "n/no-unpublished-require": "off",
                          "n/no-unsupported-features/es-builtins": "off",
                          "n/no-unsupported-features/es-syntax": "off",
                          "n/no-unsupported-features/node-builtins": "off",
                          "no-undef": "off",
                          "no-unused-expressions": "off",
                          "no-unused-vars": "off",
                          "padded-blocks": "off",
                          "perfectionist/sort-array-includes": "off",
                          "perfectionist/sort-arrays": "off",
                          "perfectionist/sort-classes": "off",
                          "perfectionist/sort-enums": "off",
                          "perfectionist/sort-exports": "off",
                          "perfectionist/sort-imports": "off",
                          "perfectionist/sort-interfaces": "off",
                          "perfectionist/sort-intersection-types": "off",
                          "perfectionist/sort-maps": "off",
                          "perfectionist/sort-modules": "off",
                          "perfectionist/sort-named-exports": "off",
                          "perfectionist/sort-named-imports": "off",
                          "perfectionist/sort-object-types": "off",
                          "perfectionist/sort-objects": "off",
                          "perfectionist/sort-sets": "off",
                          "perfectionist/sort-switch-case": "off",
                          "perfectionist/sort-union-types": "off",
                          "perfectionist/sort-variable-declarations": "off",
                          strict: "off",
                          "unicode-bom": "off",
                          "unicorn/filename-case": "off",
                      },
                  },
              ]
            : []),
        // #endregion 📁 Markdown Files
        // #region 🏝️ YAML Files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/*.{yaml,yml}"],
            language: "yml/yaml",
            languageOptions: {
                parser: yamlEslintParser,
                // Options used with yaml-eslint-parser.
                parserOptions: {
                    defaultYAMLVersion: "1.2",
                },
            },
            name: "🏝️ YAML/YML: **/*.{YAML,YML}",
            plugins: {
                yml: yml,
            },
            rules: {
                // Most off rules below are "off" because they conflict with Prettier
                // Because using yml.configs.prettier looks bad in inspector, we manually turn
                // them off here.
                "yml/block-mapping": "warn",
                "yml/block-mapping-colon-indicator-newline": "off",
                "yml/block-mapping-question-indicator-newline": "off",
                "yml/block-sequence": "warn",
                "yml/block-sequence-hyphen-indicator-newline": "off",
                "yml/file-extension": "off",
                "yml/flow-mapping-curly-newline": "off",
                "yml/flow-mapping-curly-spacing": "off",
                "yml/flow-sequence-bracket-newline": "off",
                "yml/flow-sequence-bracket-spacing": "off",
                "yml/indent": "off",
                "yml/key-name-casing": "off",
                "yml/key-spacing": "off",
                "yml/no-empty-document": "error",
                "yml/no-empty-key": "error",
                "yml/no-empty-mapping-value": "error",
                "yml/no-empty-sequence-entry": "error",
                "yml/no-irregular-whitespace": "error",
                "yml/no-multiple-empty-lines": "off",
                "yml/no-tab-indent": "error",
                "yml/no-trailing-zeros": "off",
                "yml/plain-scalar": "off",
                "yml/quotes": "off",
                "yml/require-string-key": "error",
                "yml/sort-keys": "error",
                "yml/sort-sequence-values": "off",
                "yml/spaced-comment": "warn",
                "yml/vue-custom-block/no-parsing-error": "warn",
            },
        },
        // #endregion 🏝️ YAML Files
        // #region 🌐 HTML Files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            ...html.configs["flat/all"],
            files: ["**/*.{html,htm,xhtml}"],
            ignores: [
                "**/report/**",
                "**/coverage",
                "**/.coverage",
            ],
            name: "🌐 HTML: **/*.{HTML,HTM,XHTML}",
            rules: {
                ...html.configs["flat/all"].rules,
                "@html-eslint/indent": "off", // Conflicts with prettier
                "@html-eslint/require-closing-tags": "off", // Conflicts with prettier
            },
        },
        // #endregion 🌐 HTML Files
        // #region 🐭 JSONC Files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/*.jsonc"],
            languageOptions: {
                parser: jsoncEslintParser,
                parserOptions: { jsonSyntax: "JSONC" },
            },
            name: "🐭 JSONC: **/*.JSONC",
            plugins: {
                json: json,
                jsonc: jsonc,
            },
            rules: {
                ...JSONC_AND_JSON5_RULES,
            },
        },
        // #endregion 🐭 JSONC Files
        // #region 🐀 JSON Files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/*.json"],
            // Package.json has a dedicated config block above that uses jsonc-eslint-parser
            // (needed for some package.json-specific tooling rules).
            ignores: ["**/package.json"],
            language: "json/json",
            name: "🐀 JSON: **/*.JSON",
            plugins: {
                json: json,
            },
            rules: {
                ...json.configs.recommended.rules,
                "json/sort-keys": ["warn"],
                "json/top-level-interop": "warn",
            },
        },
        // #endregion 🐀 JSON Files
        // #region 🐁 JSON5 Files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/*.json5"],
            language: "json/json5",
            name: "🐁 JSON5: **/*.JSON5",
            plugins: {
                json: json,
                jsonc: jsonc,
            },
            rules: {
                ...JSONC_AND_JSON5_RULES,
            },
        },
        // #endregion 🐁 JSON5 Files
        // #region 🐦‍🔥 TOML Files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: ["**/*.toml"],
            ignores: ["lychee.toml"],
            language: "toml/toml",
            languageOptions: {
                parser: tomlEslintParser,
                parserOptions: { tomlVersion: "1.0.0" },
            },
            name: "🐦‍🔥 TOML: **/*.TOML",
            plugins: { toml: toml },
            rules: {
                // TOML ESLint Plugin Rules (toml/*)
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
        // #endregion 🐦‍🔥 TOML Files
        // #region 📁 Markdown Code Block Final Overrides
        // ═══════════════════════════════════════════════════════════════════════════════
        ...(enableMarkdownCodeBlockLinting
            ? [
                  // Data-language blocks are declared after the markdown
                  // processor above, so they can re-enable sorting rules for
                  // virtual snippets like `README.md/1_1.json`. Keep
                  // config-example snippets free to mirror the docs narrative
                  // instead of package/file ordering conventions.
                  {
                      files: ["**/*.{md,markdown}/**"],
                      name: "📁 Markdown: Code block sorting ⛔ Overrides",
                      rules: {
                          "json/sort-keys": "off",
                          "jsonc/sort-array-values": "off",
                          "jsonc/sort-keys": "off",
                          "toml/keys-order": "off",
                          "toml/tables-order": "off",
                          "yml/sort-keys": "off",
                          "yml/sort-sequence-values": "off",
                      },
                  },
              ]
            : []),
        // #endregion 📁 Markdown Code Block Final Overrides
        // #region 📚 JSDoc Rules
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            ...jsdoc.configs["flat/recommended"],
            files: ["src/**/*.{js,cjs,mjs,jsx}"],
            languageOptions: {
                globals: {
                    ...globals.builtin,
                    ...globals.nodeBuiltin,
                    ...globals.commonjs,
                },
            },
            name: "📚 JSDoc: recommended - src/**/*.{js,cjs,mjs,jsx}",
            rules: {
                ...jsdoc.configs["flat/recommended"].rules,
                "jsdoc/check-syntax": "warn",
                "jsdoc/check-template-names": "warn",
                "jsdoc/convert-to-jsdoc-comments": "warn",
                "jsdoc/imports-as-dependencies": "warn",
                "jsdoc/informative-docs": "warn",
                "jsdoc/lines-before-block": "warn",
                "jsdoc/match-description": "warn",
                "jsdoc/no-bad-blocks": "warn",
                "jsdoc/no-blank-block-descriptions": "warn",
                "jsdoc/no-blank-blocks": "warn",
                "jsdoc/prefer-import-tag": "warn",
                "jsdoc/require-asterisk-prefix": "warn",
                "jsdoc/require-hyphen-before-param-description": "warn",
                "jsdoc/require-next-description": "warn",
                "jsdoc/require-param": "off", // Too noisy - low value
                "jsdoc/require-param-description": "off", // Too noisy - low value
                "jsdoc/require-returns": "off", // Too noisy - low value
                "jsdoc/require-returns-description": "off", // Too noisy - low value
                "jsdoc/require-template": "warn",
                "jsdoc/require-template-description": "warn",
                "jsdoc/require-throws": "warn",
                "jsdoc/require-throws-description": "warn",
                "jsdoc/require-yields-description": "warn",
                "jsdoc/tag-lines": "off", // Conflicts with Prettier
                "jsdoc/text-escaping": [
                    "warn",
                    {
                        escapeHTML: true,
                    },
                ],
                "jsdoc/ts-method-signature-style": "warn",
                "jsdoc/ts-no-unnecessary-template-expression": "warn",
                "jsdoc/ts-prefer-function-type": "warn",
            },
            settings: {
                jsdoc: {
                    // JS files in this repo use classic JSDoc.
                    mode: "jsdoc",
                },
            },
        },
        // #endregion 📚 JSDoc Rules
        // #region 🎭 Framework Configurations
        // ═══════════════════════════════════════════════════════════════════════════════
        // These configurations are scoped to specific frameworks and file types.
        // Projects that don't use these frameworks won't be affected.
        // #region 🎭 Playwright Files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            ...playwright.configs["flat/recommended"],
            files: [
                "playwright/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "test/e2e/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "e2e/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "**/*.e2e.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "**/*.pw.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            ],
            languageOptions: {
                globals: {
                    ...globals.browser,
                    ...globals.vitest,
                    ...globals.commonjs,
                    ...globals.nodeBuiltin,
                },
                parser: tseslint.parser,
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true,
                    },
                    ecmaVersion: "latest",
                    jsDocParsingMode: "all",
                    projectService: true,
                    sourceType: "module",
                    tsconfigRootDir: rootDirectory,
                    warnOnUnsupportedTypeScriptVersion: true,
                },
            },
            name: "🎭 Playwright E2E Tests: playwright/**, test/e2e/**, **/*.e2e.*",
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
        // #endregion 🎭 Playwright Files
        // #region 📖 Storybook Files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            ...storybookRecommendedSetupConfig,
            files: [
                "**/*.stories.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "**/.storybook/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            ],
            languageOptions: {
                globals: {
                    ...globals.nodeBuiltin,
                    browser: "readonly",
                    context: "readonly",
                    expect: "readonly",
                    page: "readonly",
                },
                parser: tseslint.parser,
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
            name: "📖 Storybook Stories: **/*.stories.{js,jsx,mjs,cjs,ts,tsx,cts,mts}, **/.storybook/**",
            rules: {
                ...storybookRecommendedStoriesRules,
                "storybook/csf-component": "warn",
                "storybook/meta-inline-properties": "warn",
                "storybook/meta-satisfies-type": "warn",
                "storybook/no-stories-of": "warn",
                "storybook/no-title-property-in-meta": "warn",
                "storybook/no-uninstalled-addons": "warn",
            },
        },
        // #endregion 📖 Storybook Files
        // #region 🖖 Vue.js Files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            ...vue.configs["flat/base"][1],
            files: [
                "**/*.vue",
                "*.vue.js",
                "*.vue.ts",
            ],
            languageOptions: {
                ...vue.configs["flat/base"][1]?.languageOptions,
                parserOptions: {
                    extraFileExtensions: [".vue"],
                    parser: tseslint.parser,
                    sourceType: "module",
                },
            },
            name: "🖖 Vue SFCs: **/*.vue",
            rules: {
                ...vue.configs.essential.rules,
                ...vue.configs.recommended.rules,
                ...vue.configs["strongly-recommended"].rules,
                "vue/block-lang": "warn",
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
                "vue/new-line-between-multi-line-property": "warn",
                "vue/next-tick-style": "warn",
                "vue/no-bare-strings-in-template": "warn",
                "vue/no-boolean-default": "warn",
                "vue/no-console": "warn",
                "vue/no-constant-condition": "warn",
                "vue/no-custom-modifiers-on-v-model": "warn",
                "vue/no-duplicate-attr-inheritance": "warn",
                "vue/no-duplicate-class-names": "warn",
                "vue/no-empty-component-block": "warn",
                "vue/no-empty-pattern": "warn",
                "vue/no-implicit-coercion": "warn",
                "vue/no-import-compiler-macros": "warn",
                "vue/no-irregular-whitespace": "warn",
                "vue/no-literals-in-template": "warn",
                "vue/no-loss-of-precision": "warn",
                "vue/no-multiple-objects-in-class": "warn",
                "vue/no-multiple-template-root": "warn",
                "vue/no-mutating-props": "warn",
                "vue/no-negated-condition": "warn",
                "vue/no-negated-v-if-condition": "warn",
                "vue/no-potential-component-option-typo": "warn",
                "vue/no-ref-object-reactivity-loss": "warn",
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
                "vue/no-sparse-arrays": "warn",
                "vue/no-static-inline-styles": "warn",
                "vue/no-template-target-blank": "warn",
                "vue/no-this-in-before-route-enter": "warn",
                "vue/no-undef-components": "warn",
                "vue/no-undef-directives": "warn",
                "vue/no-undef-properties": "warn",
                "vue/no-unsupported-features": "warn",
                "vue/no-unused-emit-declarations": "warn",
                "vue/no-unused-properties": "warn",
                "vue/no-unused-refs": "warn",
                "vue/no-use-v-else-with-v-for": "warn",
                "vue/no-useless-concat": "warn",
                "vue/no-useless-mustaches": "warn",
                "vue/no-useless-v-bind": "warn",
                // Deprecated rule
                // @see https://eslint.vuejs.org/rules/no-v-for-template-key.html
                "vue/no-v-for-template-key": "off",
                // Deprecated rule
                // @see https://eslint.vuejs.org/rules/no-v-model-argument.html
                "vue/no-v-model-argument": "off",
                "vue/no-v-text": "warn",
                "vue/object-shorthand": "warn",
                "vue/padding-line-between-blocks": "warn",
                "vue/padding-line-between-tags": "warn",
                "vue/padding-lines-in-component-definition": "warn",
                "vue/prefer-define-options": "warn",
                "vue/prefer-prop-type-boolean-first": "warn",
                "vue/prefer-separate-static-class": "warn",
                "vue/prefer-single-event-payload": "warn",
                "vue/prefer-template": "warn",
                "vue/prefer-true-attribute-shorthand": "warn",
                "vue/prefer-use-template-ref": "warn",
                "vue/prefer-v-model": "warn",
                "vue/require-default-export": "warn",
                "vue/require-direct-export": "warn",
                "vue/require-emit-validator": "warn",
                "vue/require-explicit-slots": "warn",
                "vue/require-expose": "warn",
                "vue/require-macro-variable-name": "warn",
                "vue/require-name-property": "warn",
                "vue/require-prop-comment": "warn",
                "vue/require-typed-object-prop": "warn",
                "vue/require-typed-ref": "warn",
                "vue/restricted-component-names": "warn",
                "vue/slot-name-casing": "warn",
                "vue/sort-keys": "warn",
                "vue/static-class-names-order": "warn",
                "vue/v-for-delimiter-style": "warn",
                "vue/v-if-else-key": "warn",
                "vue/v-on-handler-style": "warn",
            },
        },
        // #endregion 🖖 Vue.js Files
        // #region 🚀 Astro Files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            ...arrayFirst(astro.configs.base),
            ...astro.configs.base[1],
            files: ["*.astro", "**/*.astro"],
            name: "🚀 Astro Components: **/*.astro",
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
        // #endregion 🚀 Astro Files
        // #region ⚛️ Next.js Files
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            ...next.configs.recommended,
            files: [
                "app/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "pages/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "src/app/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "src/pages/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            ],
            languageOptions: {
                parser: tseslint.parser,
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true,
                        jsx: true,
                    },
                    ecmaVersion: "latest",
                    jsDocParsingMode: "all",
                    sourceType: "module",
                    tsconfigRootDir: rootDirectory,
                    warnOnUnsupportedTypeScriptVersion: true,
                },
            },
            name: "⚛️ Next.js: Pages and App Router - app/**, pages/**, src/app/**, src/pages/**",
            // Let users enable Next.js rules in their project if they want,
            // but don't force them to fix Next.js-specific issues if they're not using Next.js or don't care about
            // those rules
            rules: {
                // ...next.configs.recommended.rules,
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
        // #endregion ⚛️ Next.js Files
        // #endregion 🎭 Framework Configurations
        // #region 🐆 Config Files ⛔ Overrides
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: [
                ...ROOT_CONFIG_FILE_PATTERNS,
                "**/*.config.{js,mjs,cjs}",
                "**/*.config.*.{js,mjs,cjs}",
                "**/.*rc.{js,mjs,cjs}",
                "**/preset.mjs",
            ],
            languageOptions: {
                globals: {
                    ...globals.builtin,
                    ...globals.nodeBuiltin,
                    ...globals.commonjs,
                },
            },
            name: "🐆 Config Files",
            rules: {
                "max-classes-per-file": "off",
                "n/no-process-env": "off",
                "no-console": "off",
                "no-undef-init": "off",
                "perfectionist/sort-arrays": "off", // Configs often have intentionally unsorted arrays
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
        // #endregion 🐆 JS Config Files ⛔ Overrides
        // #region 🤖 GitHub Workflow Files ⛔ Overrides
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: [
                "**/.github/workflows/**/*.{yaml,yml}",
                "**/.github/*.{yaml,yml}",
                "**/flatpak-build.yml",
                "**/dependabot.yml",
                "**/.spellcheck.yml",
                "**/.pre-commit-config.yaml",
                "**/.github/workflow-templates/**/*.{yaml,yml}",
                "**/.github/actions/**/*.{yaml,yml}",
            ],
            name: "🏝️ YAML/YML GitHub Workflows - ⛔ Overrides",
            rules: {
                "yml/no-empty-key": "off",
                "yml/no-empty-mapping-value": "off",
                "yml/sort-keys": "off",
            },
        },
        // #endregion 🤖 GitHub Workflow Files ⛔ Overrides
        // #region 🎯 Targeted ⛔️ Overrides
        // ═══════════════════════════════════════════════════════════════════════════════
        // {
        //     files: ["**/EXAMPLE-OVERRIDE-FILE/**"],
        //     name: "🎯 Targeted: ⛔ Overrides 1",
        //     rules: {
        //     },
        // },
        // #endregion 🎯 Targeted ⛔️ Overrides
        // #region 🎨 Stylistic ⛔️ Overrides
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            ...stylistic.configs.all,
            name: "🎨 Global: Stylistic ⛔ Overrides",
            rules: {
                ...stylistic.configs["disable-legacy"].rules,
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
        // #endregion 🎨 Stylistic ⛔️ Overrides
        // #region 🌍 Global ⛔️ Overrides
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            files: [...GLOBAL_FILE_PATTERNS],
            name: "🌐 Global: ⛔ Overrides",
            rules: {
                "remark/require-remark-config-file-naming-convention": "off",
            },
        },
        {
            files: ["**/*.{js,mjs,cjs}"],
            name: "☕ JavaScript: JS/MJS/CJS ⛔ Overrides",
            rules: {
                "@typescript-eslint/explicit-module-boundary-types": "off",
            },
        },
        {
            files: ["*.mjs", "**/*.mjs"],
            name: "🟢 Node ESM: MJS ⛔ Overrides",
            rules: {
                "import-x/extensions": "off",
            },
        },
        {
            files: ["**/__snapshots__/**/*.{md,markdown,mdx}"],
            name: "📸 Markdown Snapshots: ⛔ Overrides",
            rules: {
                "remark/remark": "off",
            },
        },
        {
            files: ["**/*.d.{ts,tsx,mts,cts}"],
            languageOptions: {
                parser: tseslint.parser,
                parserOptions: {
                    ecmaVersion: "latest",
                    jsDocParsingMode: "all",
                    sourceType: "module",
                    warnOnUnsupportedTypeScriptVersion: true,
                },
            },
            name: "🗄️ Type Declarations: TypeScript Parser",
            rules: {
                "@typescript-eslint/prefer-readonly-parameter-types": "off",
                "import-x/unambiguous": "off",
            },
        },
        // #endregion 🌍 Global ⛔️ Overrides
        // #region 🧹 Prettier ⛔ Overrides
        // ═══════════════════════════════════════════════════════════════════════════════
        {
            name: "🌍 Global: 🎨 Prettier ⛔ Overrides",
            // This turns off rules globally that conflict and/or are handled by Prettier
            ...prettierOverrides,
        },
        // #endregion 🧹 Prettier ⛔ Overrides
    ];
    return removeDisabledPluginRules(
        // eslint-disable-next-line typefest/prefer-ts-extras-safe-cast-to -- We know we're casting to readonly EslintConfigInput[]
        flattenConfigs(configs as readonly EslintConfigInput[]),
        disabledPluginNames
    );
};
/* eslint-enable max-lines-per-function -- shared config factory boundary */
// #endregion 🛠️ Config
// #region 🆘 Helper Functions
// ═══════════════════════════════════════════════════════════════════════════════
/*
 * ESLint exposes mutable, loosely typed flat-config shapes here.
 * Keep the unavoidable assertions local to private helpers.
 */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/prefer-readonly-parameter-types -- helper boundary */
type MutableEslintConfig = Except<EslintConfig, "plugins" | "rules"> & {
    plugins?: UnknownRecord;
    rules?: UnknownRecord;
};

function flattenConfigs(configs: readonly EslintConfigInput[]): EslintConfig[] {
    // eslint-disable-next-line unicorn/no-array-reduce -- Clearer for flattening nested config arrays.
    return configs.reduce<EslintConfig[]>((result, entry) => {
        if (Array.isArray(entry)) {
            result.push(...flattenConfigs(entry));
        } else {
            result.push(entry as EslintConfig);
        }
        return result;
    }, []);
}

function getRulePluginName(ruleName: string): string {
    if (ruleName.startsWith("@")) {
        return arrayJoin(stringSplit(ruleName, "/").slice(0, 2), "/");
    }
    return arrayFirst(stringSplit(ruleName, "/")) ?? ruleName;
}

function removeDisabledPluginRules(
    configs: readonly EslintConfig[],
    disabledPluginNames: ReadonlySet<string>
): EslintConfig[] {
    if (disabledPluginNames.size === 0) {
        return [...configs];
    }
    return configs.map((config): EslintConfig => {
        const nextConfig: MutableEslintConfig = { ...config };
        if (isDefined(nextConfig.plugins)) {
            nextConfig.plugins = objectFromEntries(
                objectEntries(nextConfig.plugins).filter(
                    ([pluginName]) => !setHas(disabledPluginNames, pluginName)
                )
            );
        }
        if (isDefined(nextConfig.rules)) {
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
}

function resolvePlugin(
    pluginOverrideEntries: ReadonlyMap<string, PluginOverride>,
    pluginName: string,
    fallbackPlugin: ConfigurablePlugin
): ConfigurablePlugin | null {
    const configuredPlugin = pluginOverrideEntries.get(pluginName);
    if (configuredPlugin === false || configuredPlugin === null) {
        return null;
    }
    return configuredPlugin ?? fallbackPlugin;
}

function resolveTypedPlugin<TPlugin extends ConfigurablePlugin>(
    pluginOverrideEntries: ReadonlyMap<string, PluginOverride>,
    pluginName: string,
    fallbackPlugin: TPlugin
): null | TPlugin {
    const resolvedPlugin = resolvePlugin(
        pluginOverrideEntries,
        pluginName,
        fallbackPlugin
    );
    return resolvedPlugin === null ? null : (resolvedPlugin as TPlugin);
}

function scopeConfigToCodeFiles(config: EslintConfig): EslintConfig {
    return {
        ...config,
        files: config.files ?? [...GLOBAL_FILE_PATTERNS],
    };
}

function scopeTypeScriptEslintConfigToCodeFiles(
    config: EslintConfig
): EslintConfig {
    const scopedConfig = scopeConfigToCodeFiles(config);
    const hasTypeScriptEslintRules = objectKeys(scopedConfig.rules ?? {}).some(
        (ruleName) => ruleName.startsWith("@typescript-eslint/")
    );
    if (!hasTypeScriptEslintRules) {
        return scopedConfig;
    }
    return {
        ...scopedConfig,
        plugins: {
            ...scopedConfig.plugins,
            "@typescript-eslint": tseslint.plugin,
        },
    };
}

function withoutProjectServiceParserOption(config: EslintConfig): EslintConfig {
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
    const nextParserOptions: UnknownRecord = { ...parserOptions };
    Reflect.deleteProperty(nextParserOptions, "projectService");
    return {
        ...config,
        languageOptions: {
            ...languageOptions,
            parserOptions: nextParserOptions,
        },
    };
}
/* eslint-enable @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/prefer-readonly-parameter-types -- helper boundary */
// #endregion 🆘 Helper Functions
// #region 📦 Preset Construction
// ═══════════════════════════════════════════════════════════════════════════════
const allConfigs: EslintConfig[] = createConfig();
const withoutSdl2BaseConfigs: EslintConfig[] = createConfig({
    plugins: {
        sdl: false,
        "sdl-2": false,
    },
});
const withoutSdl2HasNodePlugin = withoutSdl2BaseConfigs.some(
    (config) => isDefined(config.plugins) && keyIn(config.plugins, "n")
);
const withoutGitHubActions2Configs: EslintConfig[] = createConfig({
    plugins: {
        "github-actions": false,
        "github-actions-2": false,
    },
});

/** Shared preset arrays for plugin-style flat config consumption. */
const sharedConfigs: Nick2Bad4UEslintConfigPresets = {
    all: allConfigs,
    base: createConfig({
        plugins: {
            "etc-misc": false,
            typefest: false,
        },
    }),
    // Keep recommended as a direct alias of all until this package has a
    // smaller opinionated preset surface worth exposing separately.
    recommended: allConfigs,
    // Some packages register shorter runtime namespaces than their package
    // names. Disable both the real namespace and the package-family alias so
    // consumers can choose the obvious withoutX preset name.
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
    withoutGitHubActions2: withoutGitHubActions2Configs,
    withoutGithubActions2: withoutGitHubActions2Configs,
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
        ? withoutSdl2BaseConfigs
        : [
              {
                  name: "Node plugin registration (withoutSdl2 only)",
                  plugins: {
                      n: nodePlugin,
                  },
              },
              ...withoutSdl2BaseConfigs,
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
// #endregion 📦 Preset Construction
// #region 📤 Public Exports
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * Public named export for consumers that import this package as an ESLint
 * config collection.
 */
export const configs: Nick2Bad4UEslintConfigPresets = sharedConfigs;

/** Default package export matching ESLint's plugin/config convention. */
const nickTwoBadFourU: {
    readonly configs: Nick2Bad4UEslintConfigPresets;
    readonly createConfig: typeof createConfig;
} = {
    configs,
    createConfig,
};

export default nickTwoBadFourU;
// #endregion 📤 Public Exports
