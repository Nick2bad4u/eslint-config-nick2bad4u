import type { Linter } from "eslint";

/** Options for creating the shared Nick2bad4u ESLint flat config. */
export interface Nick2Bad4UEslintConfigOptions {
    /**
     * Replace or disable plugins by ESLint namespace.
     *
     * Pass a plugin object to dogfood an explicitly configurable source-rule
     * plugin section, such as `typefest` or `etc-misc`. Pass `false` or `null`
     * to remove that plugin's registered rules from the shared config by
     * namespace.
     */
    readonly plugins?: Readonly<Record<string, unknown>>;

    /**
     * Project root used for TypeScript parser `tsconfigRootDir` and local alias
     * checks. Defaults to `process.cwd()`.
     */
    readonly rootDirectory?: string;

    /**
     * TypeScript project files, relative to `rootDirectory`. Defaults to this
     * repo's common ESLint-plugin tsconfig file names.
     */
    readonly tsconfigPaths?: readonly string[];
}

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

    /** Full shared config without the Copilot rules. */
    readonly withoutCopilot: Linter.Config[];

    /** Full shared config without the Etc-Misc source-rule section. */
    readonly withoutEtcMisc: Linter.Config[];

    /** Full shared config without future eslint-plugin-tsconfig rules. */
    readonly withoutTsconfig: Linter.Config[];

    /** Full shared config without the Typefest source-rule section. */
    readonly withoutTypefest: Linter.Config[];
}

/** Create the shared Nick2bad4u ESLint flat config. */
export declare const createConfig: (
    options?: Nick2Bad4UEslintConfigOptions
) => Linter.Config[];

/** Shared flat config presets. */
export declare const configs: Nick2Bad4UEslintConfigPresets;

declare const nickTwoBadFourU: {
    readonly configs: Nick2Bad4UEslintConfigPresets;
    readonly createConfig: typeof createConfig;
};

export default nickTwoBadFourU;
