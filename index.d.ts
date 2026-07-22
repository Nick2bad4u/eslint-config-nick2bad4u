import type { ESLint, Linter } from "eslint";

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

/** Options for creating the shared Nick2Bad4U ESLint flat config. */
export interface Nick2Bad4UEslintConfigOptions {
    /**
     * Root-level files passed to TypeScript ESLint's
     * `parserOptions.projectService.allowDefaultProject`.
     *
     * Defaults to root-only JavaScript file globs. Only include a small number
     * of root files that are intentionally not covered by the nearest
     * `tsconfig.json`; broad TypeScript globs also match declaration files, and
     * TypeScript ESLint errors when a file is both in a configured project and
     * in `allowDefaultProject`.
     */
    readonly allowDefaultProjectFilePatterns?: readonly string[];

    /** Use Jest instead of Vitest for test and benchmark files. */
    readonly jest?: boolean | Nick2Bad4UJestOptions;

    /** Enable the recommended Next.js rules, with optional monorepo scoping. */
    readonly next?: boolean | Nick2Bad4UNextOptions;

    /**
     * Replace or disable plugins by ESLint namespace.
     *
     * Pass a plugin object to dogfood an explicitly configurable source-rule
     * plugin section. Pass `false` or `null` to remove that plugin's registered
     * rules from the shared config by namespace.
     */
    readonly plugins?: Nick2Bad4UEslintConfigPluginOverrides;

    /**
     * Project root used for TypeScript parser `tsconfigRootDir` and local alias
     * checks. Defaults to `process.cwd()`.
     */
    readonly rootDirectory?: string;

    /** Configure the default-on SonarJS rules, or pass `false` to disable them. */
    readonly sonarjs?: boolean | Nick2Bad4USonarJSOptions;

    /**
     * Import resolver TypeScript project files, relative to `rootDirectory`.
     * Defaults to `["./tsconfig.eslint.json"]`. This does not replace
     * TypeScript parser project-service discovery of the nearest
     * `tsconfig.json`.
     */
    readonly tsconfigPaths?: readonly string[];
}

/** Public plugin override values accepted by `createConfig`. */
export type Nick2Bad4UEslintConfigPluginOverride =
    | ESLint.Plugin
    | false
    | null
    | undefined
    | {
        readonly configs?: object;
        readonly flat?: object;
        readonly rules?: Readonly<Record<string, unknown>>;
    };

/** Plugin overrides keyed by ESLint namespace. */
export type Nick2Bad4UEslintConfigPluginOverrides = Readonly<
    Record<string, Nick2Bad4UEslintConfigPluginOverride>
>;

/** Named flat config presets exposed by this package. */
export interface Nick2Bad4UEslintConfigPresets {
    /**
     * Full shared config, including packaged Typefest and Etc-Misc source
     * rules.
     */
    readonly all: Linter.Config[];

    /** Shared config without the explicit source-rule plugin sections. */
    readonly base: Linter.Config[];

    /** Alias for `all`; kept for familiar preset naming. */
    readonly recommended: Linter.Config[];

    /** Full shared config using Jest instead of Vitest for test files. */
    readonly withJest: Linter.Config[];

    /** Full shared config with the recommended Next.js rules enabled. */
    readonly withNext: Linter.Config[];

    /** Full shared config without Codex plugin rules. */
    readonly withoutCodex: Linter.Config[];

    /** Full shared config without the Copilot rules. */
    readonly withoutCopilot: Linter.Config[];

    /** Full shared config without Docusaurus 2 plugin rules. */
    readonly withoutDocusaurus2: Linter.Config[];

    /** Full shared config without the Etc-Misc source-rule section. */
    readonly withoutEtcMisc: Linter.Config[];

    /** Full shared config without File Progress 2 rules. */
    readonly withoutFileProgress2: Linter.Config[];

    /** Full shared config without GitHub Actions 2 rules. */
    readonly withoutGitHubActions2: Linter.Config[];

    /**
     * Full shared config without GitHub Actions 2 rules.
     *
     * @deprecated Use `withoutGitHubActions2`.
     */
    readonly withoutGithubActions2: Linter.Config[];

    /** Full shared config without Immutable 2 rules. */
    readonly withoutImmutable2: Linter.Config[];

    /** Full shared config without Remark plugin rules. */
    readonly withoutRemark: Linter.Config[];

    /** Full shared config without Repo plugin rules. */
    readonly withoutRepo: Linter.Config[];

    /** Full shared config without Runtime Cleanup plugin rules. */
    readonly withoutRuntimeCleanup: Linter.Config[];

    /** Full shared config without SDL 2 rules. */
    readonly withoutSdl2: Linter.Config[];

    /** Full shared config without Secretlint plugin rules. */
    readonly withoutSecretlint: Linter.Config[];

    /** Full shared config without SonarJS rules. */
    readonly withoutSonarJS: Linter.Config[];

    /** Full shared config without Stylelint 2 rules. */
    readonly withoutStylelint2: Linter.Config[];

    /** Full shared config without Test Signal plugin rules. */
    readonly withoutTestSignal: Linter.Config[];

    /** Full shared config without Tombi plugin rules. */
    readonly withoutTombi: Linter.Config[];

    /** Full shared config without future eslint-plugin-tsconfig rules. */
    readonly withoutTsconfig: Linter.Config[];

    /** Full shared config without TSDoc Require 2 rules. */
    readonly withoutTsdocRequire2: Linter.Config[];

    /** Full shared config without TypeDoc rules. */
    readonly withoutTypedoc: Linter.Config[];

    /** Full shared config without the Typefest source-rule section. */
    readonly withoutTypefest: Linter.Config[];

    /** Full shared config without Vite plugin rules. */
    readonly withoutVite: Linter.Config[];

    /** Full shared config without Write Good Comments 2 rules. */
    readonly withoutWriteGoodComments2: Linter.Config[];

    /** Full shared config without Yamllint plugin rules. */
    readonly withoutYamllint: Linter.Config[];

    /** @deprecated SonarJS is enabled by default. Use `all` or `recommended`. */
    readonly withSonarJS: Linter.Config[];
}

/** Options for the opt-in Jest rule section. */
export interface Nick2Bad4UJestOptions {
    /** File globs that replace the standard test and benchmark globs. */
    readonly files?: readonly string[];

    /** Jest version used by version-sensitive rules. */
    readonly version?: number | string;
}

/** Options for the opt-in Next.js rule section. */
export interface Nick2Bad4UNextOptions {
    /** File globs that replace the standard Next.js router globs. */
    readonly files?: readonly string[];

    /** Value passed directly to `settings.next.rootDir`. */
    readonly rootDir?: readonly string[] | string;
}

/** Options for scoping the default-on SonarJS rule section. */
export interface Nick2Bad4USonarJSOptions {
    /** File globs that replace the standard JavaScript and TypeScript globs. */
    readonly files?: readonly string[];
}

/** Create the shared Nick2Bad4U ESLint flat config. */
export declare const createConfig: (
    options?: Nick2Bad4UEslintConfigOptions
) => Linter.Config[];

/** Shared flat config presets. */
export declare const presets: Nick2Bad4UEslintConfigPresets;

/** Opt-in file-pattern presets for TypeScript ESLint's default-project fallback. */
export declare const allowDefaultProjectFilePatternPresets: Nick2Bad4UAllowDefaultProjectFilePatternPresets;

declare const nickTwoBadFourU: {
    readonly allowDefaultProjectFilePatternPresets: typeof allowDefaultProjectFilePatternPresets;
    readonly configs: Nick2Bad4UEslintConfigPresets;
    readonly createConfig: typeof createConfig;
};

export default nickTwoBadFourU;
