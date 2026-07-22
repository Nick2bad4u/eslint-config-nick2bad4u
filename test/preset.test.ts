import next from "@next/eslint-plugin-next";
import { ESLint, type Linter } from "eslint";
import astro from "eslint-plugin-astro";
import etcMiscPlugin from "eslint-plugin-etc-misc";
import jest from "eslint-plugin-jest";
import {
    configs as sonarjsConfigs,
    rules as sonarjsRules,
} from "eslint-plugin-sonarjs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import nickTwoBadFourU, {
    allowDefaultProjectFilePatternPresets,
    createConfig,
    presets,
} from "../src/preset";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const ruleOwnershipFixtureWorkspaceRoot = fileURLToPath(
    new URL("fixtures/lint-smoke/workspace", import.meta.url)
);

const getRuleNames = (configEntries: readonly Linter.Config[]): Set<string> => {
    const ruleNames = configEntries.flatMap((configEntry) =>
        Object.keys(configEntry.rules ?? {})
    );

    return new Set(ruleNames);
};

const getRegisteredPluginNames = (
    configEntries: readonly Linter.Config[]
): Set<string> => {
    const pluginNames = configEntries.flatMap((configEntry) =>
        Object.keys(configEntry.plugins ?? {})
    );

    return new Set(pluginNames);
};

const getRuleNamesForPlugin = (
    configEntries: readonly Linter.Config[],
    pluginName: string
): string[] =>
    [...getRuleNames(configEntries)].filter((ruleName) =>
        ruleName.startsWith(`${pluginName}/`)
    );

const getPresetNamespaces = (
    configEntries: readonly Linter.Config[],
    pluginNames: readonly string[]
): Set<string> => {
    const registeredPluginNames = getRegisteredPluginNames(configEntries);
    const ruleNames = getRuleNames(configEntries);

    return new Set(
        pluginNames.filter(
            (pluginName) =>
                registeredPluginNames.has(pluginName) ||
                [...ruleNames].some((ruleName) =>
                    ruleName.startsWith(`${pluginName}/`)
                )
        )
    );
};

const getRuleSeverity = (ruleConfig: unknown): unknown =>
    Array.isArray(ruleConfig) ? ruleConfig[0] : ruleConfig;

const isRuleEnabled = (ruleConfig: unknown): boolean => {
    const severity = getRuleSeverity(ruleConfig);

    return severity !== "off" && severity !== 0;
};

const getPluginNameForRule = (
    ruleName: string,
    pluginNames: ReadonlySet<string>
): string | undefined => {
    let matchingPluginName: string | undefined;

    for (const pluginName of pluginNames) {
        if (
            ruleName.startsWith(`${pluginName}/`) &&
            (matchingPluginName === undefined ||
                pluginName.length > matchingPluginName.length)
        ) {
            matchingPluginName = pluginName;
        }
    }

    return matchingPluginName;
};

const getMissingEnabledRulePluginRegistrations = (
    configEntries: readonly Linter.Config[],
    pluginNames: ReadonlySet<string>
): Array<{
    readonly configIndex: number;
    readonly configName: string;
    readonly pluginName: string;
    readonly ruleName: string;
}> => {
    const availablePluginNames = new Set<string>();
    const missingRegistrations: Array<{
        readonly configIndex: number;
        readonly configName: string;
        readonly pluginName: string;
        readonly ruleName: string;
    }> = [];

    for (const [configIndex, configEntry] of configEntries.entries()) {
        const configPluginNames = Object.keys(configEntry.plugins ?? {});

        for (const pluginName of configPluginNames) {
            availablePluginNames.add(pluginName);
        }

        missingRegistrations.push(
            ...Object.entries(configEntry.rules ?? {}).flatMap(
                ([ruleName, ruleConfig]) => {
                    if (!isRuleEnabled(ruleConfig)) {
                        return [];
                    }

                    const pluginName = getPluginNameForRule(
                        ruleName,
                        pluginNames
                    );

                    if (
                        pluginName === undefined ||
                        availablePluginNames.has(pluginName)
                    ) {
                        return [];
                    }

                    return [
                        {
                            configIndex,
                            configName:
                                typeof configEntry.name === "string"
                                    ? configEntry.name
                                    : "(unnamed config)",
                            pluginName,
                            ruleName,
                        },
                    ];
                }
            )
        );
    }

    return missingRegistrations;
};

const isNonArrayObject = (
    value: unknown
): value is Record<PropertyKey, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const assertNonArrayObject = (
    value: unknown,
    message: string
): Record<PropertyKey, unknown> => {
    if (!isNonArrayObject(value)) {
        throw new TypeError(message);
    }

    return value;
};

const getParserOptionsGlobalsEntries = (
    configEntries: readonly Linter.Config[]
): Array<{
    readonly configIndex: number;
    readonly configName: string;
}> =>
    configEntries.flatMap((configEntry, configIndex) => {
        const parserOptions = configEntry.languageOptions?.["parserOptions"];

        if (
            !isNonArrayObject(parserOptions) ||
            !Object.hasOwn(parserOptions, "globals")
        ) {
            return [];
        }

        return [
            {
                configIndex,
                configName:
                    typeof configEntry.name === "string"
                        ? configEntry.name
                        : "(unnamed config)",
            },
        ];
    });

const presetByName: Readonly<Record<string, readonly Linter.Config[]>> = {
    withJest: presets.withJest,
    withNext: presets.withNext,
    withoutCodex: presets.withoutCodex,
    withoutCopilot: presets.withoutCopilot,
    withoutDocusaurus2: presets.withoutDocusaurus2,
    withoutEtcMisc: presets.withoutEtcMisc,
    withoutFileProgress2: presets.withoutFileProgress2,
    withoutGitHubActions2: presets.withoutGitHubActions2,
    withoutGithubActions2: presets.withoutGitHubActions2,
    withoutImmutable2: presets.withoutImmutable2,
    withoutRemark: presets.withoutRemark,
    withoutRepo: presets.withoutRepo,
    withoutRuntimeCleanup: presets.withoutRuntimeCleanup,
    withoutSdl2: presets.withoutSdl2,
    withoutSecretlint: presets.withoutSecretlint,
    withoutSonarJS: presets.withoutSonarJS,
    withoutStylelint2: presets.withoutStylelint2,
    withoutTestSignal: presets.withoutTestSignal,
    withoutTombi: presets.withoutTombi,
    withoutTsconfig: presets.withoutTsconfig,
    withoutTsdocRequire2: presets.withoutTsdocRequire2,
    withoutTypedoc: presets.withoutTypedoc,
    withoutTypefest: presets.withoutTypefest,
    withoutVite: presets.withoutVite,
    withoutWriteGoodComments2: presets.withoutWriteGoodComments2,
    withoutYamllint: presets.withoutYamllint,
    withSonarJS: presets.withSonarJS,
};

const getPresetByName = (presetName: string): readonly Linter.Config[] =>
    presetByName[presetName] ?? presets.all;

const findConfigByName = (
    configEntries: readonly Linter.Config[],
    configName: string
): Linter.Config | undefined =>
    configEntries.find((configEntry) => configEntry.name === configName);

const createLocalConfig = (
    pluginName: string,
    ruleName: string
): Linter.Config => ({
    plugins: {
        [pluginName]: {
            rules: {},
        },
    },
    rules: {
        [ruleName]: "error",
    },
});

const createSingleConfigLocalPlugin = (
    configName: string,
    pluginName: string,
    ruleName: string
) => ({
    configs: {
        [configName]: createLocalConfig(pluginName, ruleName),
    },
    rules: {},
});

const presetEntriesByName: Readonly<Record<string, readonly Linter.Config[]>> =
    {
        all: presets.all,
        base: presets.base,
        ...presetByName,
    };

describe("eslint-config-nick2bad4u presets", () => {
    it("exposes plugin-style flat config presets", () => {
        expect.assertions(5);

        const allPreset = presets.all as readonly Linter.Config[];

        expect(nickTwoBadFourU.configs).toBe(presets);
        expect(allPreset.length).toBeGreaterThan(0);
        expect(presets.recommended).toBe(presets.all);
        expect(Reflect.get(presets, "withoutGithubActions2")).toBe(
            presets.withoutGitHubActions2
        );
        expect(isNonArrayObject(allPreset[0])).toBe(true);
    });

    it("falls back only for unknown preset names", () => {
        expect.assertions(2);

        expect(getPresetByName("missing-preset")).toBe(presets.all);
        expect(getPresetByName("withoutTypefest")).not.toBe(presets.all);
    });

    it.each([
        ["withoutCodex", ["codex"]],
        ["withoutCopilot", ["copilot"]],
        ["withoutDocusaurus2", ["docusaurus-2"]],
        ["withoutEtcMisc", ["etc-misc"]],
        ["withoutFileProgress2", ["file-progress", "file-progress-2"]],
        ["withoutGitHubActions2", ["github-actions", "github-actions-2"]],
        ["withoutGithubActions2", ["github-actions", "github-actions-2"]],
        ["withoutImmutable2", ["immutable", "immutable-2"]],
        ["withoutRemark", ["remark"]],
        ["withoutRepo", ["repo", "repo-compliance"]],
        ["withoutRuntimeCleanup", ["runtime-cleanup"]],
        ["withoutSdl2", ["sdl", "sdl-2"]],
        ["withoutSecretlint", ["secretlint"]],
        ["withoutStylelint2", ["stylelint-2"]],
        ["withoutTestSignal", ["test-signal"]],
        ["withoutTombi", ["tombi"]],
        ["withoutTsconfig", ["tsconfig"]],
        ["withoutTsdocRequire2", ["tsdoc-require-2"]],
        ["withoutTypedoc", ["typedoc"]],
        ["withoutTypefest", ["typefest"]],
        ["withoutVite", ["vite"]],
        [
            "withoutWriteGoodComments2",
            ["write-good-comments", "write-good-comments-2"],
        ],
        ["withoutYamllint", ["yamllint"]],
    ] as const)(
        "removes %s plugin rules from the preset",
        (presetName, pluginNames) => {
            expect.assertions(3);

            const preset = getPresetByName(presetName);
            const presentNamespacesInAll = getPresetNamespaces(
                presets.all,
                pluginNames
            );
            const presentNamespacesInPreset = getPresetNamespaces(
                preset,
                pluginNames
            );

            expect([...presentNamespacesInAll]).not.toHaveLength(0);
            expect([...presentNamespacesInPreset]).toStrictEqual([]);
            expect(
                [...getRuleNames(preset)].filter((ruleName) =>
                    pluginNames.some((pluginName) =>
                        ruleName.startsWith(`${pluginName}/`)
                    )
                )
            ).toStrictEqual([]);
        }
    );

    it("keeps full preset rules in the all preset", () => {
        expect.assertions(7);

        const allPreset = presets.all as readonly Linter.Config[];

        expect(
            getRuleNamesForPlugin(allPreset, "copilot").length
        ).toBeGreaterThan(0);
        expect(
            getRuleNamesForPlugin(allPreset, "codex").length
        ).toBeGreaterThan(0);
        expect(
            getRuleNamesForPlugin(allPreset, "runtime-cleanup").length
        ).toBeGreaterThan(0);
        expect(
            getRuleNamesForPlugin(allPreset, "test-signal").length
        ).toBeGreaterThan(0);
        expect(
            getRuleNamesForPlugin(allPreset, "typefest").length
        ).toBeGreaterThan(0);
        expect(
            getRuleNamesForPlugin(allPreset, "secretlint").length
        ).toBeGreaterThan(0);
        expect(
            getRuleNamesForPlugin(allPreset, "yamllint").length
        ).toBeGreaterThan(0);
    });

    it("uses the Listeners flat strict preset", () => {
        expect.assertions(5);

        const listenersConfig = findConfigByName(
            presets.all,
            "🎧 Listeners: Strict"
        );

        expect(listenersConfig?.name).toBe("🎧 Listeners: Strict");
        expect(Object.keys(listenersConfig?.plugins ?? {})).toContain(
            "listeners"
        );
        expect(
            listenersConfig?.rules?.[
                "listeners/no-missing-remove-event-listener"
            ]
        ).toBe("error");
        expect(
            listenersConfig?.rules?.["listeners/matching-remove-event-listener"]
        ).toBe("error");
        expect(
            listenersConfig?.rules?.[
                "listeners/no-inline-function-event-listener"
            ]
        ).toBe("error");
    });

    it("keeps the Node plugin available when withoutSdl2 removes SDL namespaces", () => {
        expect.assertions(3);

        const registeredPluginNames = getRegisteredPluginNames(
            presets.withoutSdl2
        );
        const sdlPluginNames = ["sdl", "sdl-2"];

        expect([...registeredPluginNames]).toContain("n");
        expect(
            [...registeredPluginNames].filter((pluginName) =>
                sdlPluginNames.includes(pluginName)
            )
        ).toStrictEqual([]);
        expect(
            [...getRuleNames(presets.withoutSdl2)].filter((ruleName) =>
                sdlPluginNames.some((pluginName) =>
                    ruleName.startsWith(`${pluginName}/`)
                )
            )
        ).toStrictEqual([]);
    });

    it.each(Object.entries(presetEntriesByName))(
        "keeps enabled plugin rules self-contained in the %s preset",
        (_presetName, preset) => {
            expect.assertions(1);

            const pluginNames = getRegisteredPluginNames(
                Object.values(presetEntriesByName).flat()
            );

            expect(
                getMissingEnabledRulePluginRegistrations(preset, pluginNames)
            ).toStrictEqual([]);
        }
    );

    it.each(Object.entries(presetEntriesByName))(
        "keeps globals out of parserOptions in the %s preset",
        (_presetName, preset) => {
            expect.assertions(1);

            expect(getParserOptionsGlobalsEntries(preset)).toStrictEqual([]);
        }
    );

    it("uses Copilot configs without duplicate-prone language plugin registrations", () => {
        expect.assertions(3);

        const copilotConfigEntries = presets.all.filter(
            (configEntry) =>
                typeof configEntry.name === "string" &&
                configEntry.name.startsWith(
                    "copilot:all-without-language-plugins:"
                )
        );
        const documentLanguageConfig = findConfigByName(
            presets.all,
            "🔌 Document Language Plugins"
        );

        expect(
            copilotConfigEntries.map((configEntry) => configEntry.name)
        ).toStrictEqual([
            "copilot:all-without-language-plugins:markdown",
            "copilot:all-without-language-plugins:json",
        ]);

        expect(
            copilotConfigEntries.map((configEntry) =>
                Object.keys(configEntry.plugins ?? {})
            )
        ).toStrictEqual([["copilot"], ["copilot"]]);

        expect(
            Object.keys(documentLanguageConfig?.plugins ?? {})
        ).toStrictEqual(
            expect.arrayContaining([
                "json",
                "jsonc",
                "markdown",
            ])
        );
    });

    it("keeps Runtime Cleanup from owning TypeScript project service", () => {
        expect.assertions(1);

        const runtimeCleanupConfig = findConfigByName(
            presets.all,
            "runtime-cleanup:all"
        );
        const parserOptions = assertNonArrayObject(
            runtimeCleanupConfig?.languageOptions?.["parserOptions"],
            "Expected runtime-cleanup parserOptions."
        );

        expect(Object.hasOwn(parserOptions, "projectService")).toBe(false);
    });

    it("uses ESLint built-in inline config reporting", () => {
        expect.assertions(1);

        const linterOptionsConfig = findConfigByName(
            presets.all,
            "🌍 Global: Linter Options"
        );

        expect(linterOptionsConfig?.linterOptions).toStrictEqual({
            noInlineConfig: false,
            reportUnusedDisableDirectives: "warn",
            reportUnusedInlineConfigs: "warn",
        });
    });

    it("configures browser and Node globals for Docusaurus workspace files", () => {
        expect.assertions(1);

        const docusaurusConfig = findConfigByName(
            presets.all,
            "🦖 Docusaurus: Workspace Files"
        );
        const docusaurusGlobals =
            docusaurusConfig?.languageOptions?.["globals"];

        expect(Object.keys(docusaurusGlobals ?? {})).toStrictEqual(
            expect.arrayContaining([
                "document",
                "process",
                "window",
            ])
        );
    });

    it("enables only root-level default TypeScript project fallback patterns by default", () => {
        expect.assertions(3);

        const globalConfig = findConfigByName(presets.all, "🌍 Global: Rules");
        const parserOptions = globalConfig?.languageOptions?.["parserOptions"];
        const projectService = isNonArrayObject(parserOptions)
            ? parserOptions["projectService"]
            : undefined;
        const allowDefaultProject = isNonArrayObject(projectService)
            ? projectService["allowDefaultProject"]
            : undefined;

        expect(allowDefaultProject).toStrictEqual([
            "*.{js,mjs,cjs}",
            ".*.{js,mjs,cjs}",
        ]);
        expect(nickTwoBadFourU.allowDefaultProjectFilePatternPresets).toBe(
            allowDefaultProjectFilePatternPresets
        );
        expect(
            allowDefaultProjectFilePatternPresets.defaultRootFiles
        ).toStrictEqual(allowDefaultProject);
    });

    it("exports opt-in default-project file-pattern presets", () => {
        expect.assertions(3);

        expect(
            allowDefaultProjectFilePatternPresets.rootConfigFiles
        ).toStrictEqual([
            "*.config.{js,mjs,cjs,ts,mts,cts}",
            "*.config.*.{js,mjs,cjs,ts,mts,cts}",
            ".*rc.{js,mjs,cjs,ts,mts,cts}",
            "preset.mjs",
        ]);
        expect(
            allowDefaultProjectFilePatternPresets.rootScriptFiles
        ).toStrictEqual([
            "*.{js,mjs,cjs,ts,mts,cts}",
            ".*.{js,mjs,cjs,ts,mts,cts}",
        ]);
        expect(
            allowDefaultProjectFilePatternPresets.rootMjsFiles
        ).toStrictEqual(["*.mjs", ".*.mjs"]);
    });

    it("supports opting root config files into the default TypeScript project", () => {
        expect.assertions(1);

        const configEntries = createConfig({
            allowDefaultProjectFilePatterns:
                allowDefaultProjectFilePatternPresets.rootConfigFiles,
        }) as readonly Linter.Config[];
        const globalConfig = findConfigByName(
            configEntries,
            "🌍 Global: Rules"
        );
        const parserOptions = globalConfig?.languageOptions?.["parserOptions"];
        const projectService = isNonArrayObject(parserOptions)
            ? parserOptions["projectService"]
            : undefined;
        const allowDefaultProject = isNonArrayObject(projectService)
            ? projectService["allowDefaultProject"]
            : undefined;

        expect(allowDefaultProject).toStrictEqual([
            "*.config.{js,mjs,cjs,ts,mts,cts}",
            "*.config.*.{js,mjs,cjs,ts,mts,cts}",
            ".*rc.{js,mjs,cjs,ts,mts,cts}",
            "preset.mjs",
        ]);
    });

    it("scopes Docusaurus 2 rules to the docs workspace", () => {
        expect.assertions(2);

        const docusaurusConfig = findConfigByName(
            presets.all,
            "🦖 Docusaurus 2: Experimental: Includes All + Extra Rules"
        );
        const docusaurusContentConfig = findConfigByName(
            presets.all,
            "🦖 Docusaurus 2: Content"
        );

        expect(docusaurusConfig?.files).toStrictEqual([
            "**/docs/docusaurus/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
        ]);
        expect(docusaurusContentConfig?.files).toStrictEqual([
            "**/docs/docusaurus/**/*.{md,mdx}",
        ]);
    });

    it("scopes TypeDoc to package API source files", () => {
        expect.assertions(2);

        const typedocConfig = findConfigByName(
            presets.all,
            "⌨️ TypeDoc: Recommended"
        );

        expect(typedocConfig?.files).toStrictEqual([
            "packages/*/src/**/*.{ts,tsx,mts,cts}",
            "src/**/*.{ts,tsx,mts,cts}",
        ]);
        expect(typedocConfig?.ignores).toStrictEqual(
            expect.arrayContaining([
                "**/docs/**",
                "**/test/**",
                "**/tests/**",
            ])
        );
    });

    it("keeps Test Signal away from harness and fixture internals", () => {
        expect.assertions(1);

        const testSignalConfig = findConfigByName(
            presets.all,
            "🧪 Test Signal: All"
        );

        expect(testSignalConfig?.ignores).toStrictEqual(
            expect.arrayContaining([
                "**/*RuleTester*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "**/*ruleTester*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "**/*rule-tester*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
                "**/RuleTester/**",
                "**/benchmark/**",
                "**/benchmarks/**",
                "**/rule-tester/**",
                "**/test/_internal/**",
                "**/test/fixtures/**",
                "**/tests/_internal/**",
                "**/tests/fixtures/**",
            ])
        );
    });

    it("relaxes global low-value style and template-expression rules", () => {
        expect.assertions(4);

        const globalConfig = findConfigByName(presets.all, "🌍 Global: Rules");
        const unicornConfig = findConfigByName(presets.all, "🦄 Unicorn: All");

        expect(globalConfig?.rules?.["no-continue"]).toBe("off");
        expect(
            globalConfig?.rules?.[
                "@typescript-eslint/restrict-template-expressions"
            ]
        ).toStrictEqual([
            "error",
            {
                allowAny: false,
                allowBoolean: false,
                allowNever: false,
                allowNullish: false,
                allowNumber: true,
                allowRegExp: false,
            },
        ]);
        expect(unicornConfig?.rules?.["unicorn/no-keyword-prefix"]).toBe("off");
        expect(unicornConfig?.rules?.["unicorn/try-complexity"]).toStrictEqual([
            "error",
            { max: 3 },
        ]);
    });

    it("enforces arrow callbacks across global JavaScript and TypeScript files", () => {
        expect.assertions(1);

        const globalConfig = findConfigByName(presets.all, "🌍 Global: Rules");

        expect(globalConfig?.rules?.["prefer-arrow-callback"]).toStrictEqual([
            "error",
            { allowNamedFunctions: true, allowUnboundThis: true },
        ]);
    });

    it("keeps Unicorn boolean-name prefixes focused on common config flags", () => {
        expect.assertions(1);

        const unicornConfig = findConfigByName(presets.all, "🦄 Unicorn: All");

        expect(
            unicornConfig?.rules?.["unicorn/consistent-boolean-name"]
        ).toStrictEqual([
            "error",
            {
                ignore: ["^allowDefaultProjectFilePatternPresets$"],
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
        ]);
    });

    it("keeps targeted shared false-positive overrides scoped", () => {
        expect.assertions(9);

        const configFileConfig = findConfigByName(
            presets.all,
            "🐆 Config Files"
        );
        const javaScriptConfig = findConfigByName(
            presets.all,
            "☕ JavaScript: JS/MJS/CJS ⛔ Overrides"
        );
        const nodeEsmConfig = findConfigByName(
            presets.all,
            "🟢 Node ESM: MJS ⛔ Overrides"
        );
        const markdownSnapshotConfig = findConfigByName(
            presets.all,
            "📸 Markdown Snapshots: ⛔ Overrides"
        );
        const testConfig = findConfigByName(
            presets.all,
            "🧪 Tests: Tests, Benchmarks ⛔ Overrides"
        );
        const typeDeclarationConfig = findConfigByName(
            presets.all,
            "🗄️ Type Declarations: TypeScript Parser"
        );

        expect(configFileConfig?.rules?.["n/no-process-env"]).toBe("off");
        expect(javaScriptConfig?.files).toStrictEqual(["**/*.{js,mjs,cjs}"]);
        expect(
            javaScriptConfig?.rules?.[
                "@typescript-eslint/explicit-module-boundary-types"
            ]
        ).toBe("off");
        expect(nodeEsmConfig?.files).toStrictEqual(["*.mjs", "**/*.mjs"]);
        expect(nodeEsmConfig?.rules?.["import-x/extensions"]).toBe("off");
        expect(markdownSnapshotConfig?.files).toStrictEqual([
            "**/__snapshots__/**/*.{md,markdown,mdx}",
        ]);
        expect(markdownSnapshotConfig?.rules?.["remark/remark"]).toBe("off");
        expect(testConfig?.rules?.["vitest/require-hook"]).toBeUndefined();
        expect(
            typeDeclarationConfig?.rules?.[
                "@typescript-eslint/prefer-readonly-parameter-types"
            ]
        ).toBe("off");
    });

    it("supports local source-rule plugin replacement via createConfig", () => {
        expect.assertions(1);

        const localTypefestPlugin = {
            configs: {
                experimental: {
                    rules: {
                        "typefest/local-only": "error",
                    },
                },
            },
            rules: {},
        };

        const configEntries = createConfig({
            plugins: {
                typefest: localTypefestPlugin,
            },
        }) as readonly Linter.Config[];

        expect([...getRuleNames(configEntries)]).toContain(
            "typefest/local-only"
        );
    });

    it("supports owned plugin replacement via createConfig", () => {
        expect.assertions(34);

        // eslint-disable perfectionist/sort-arrays -- Keep cases grouped by config shape and plugin family to make fixture setup easier to audit.
        const ownedPluginReplacementCases = [
            {
                createPlugin: () => ({
                    configs: {
                        "all-without-language-plugins": [
                            createLocalConfig("copilot", "copilot/local-only"),
                        ],
                    },
                    rules: {},
                }),
                overrideName: "copilot",
                ruleName: "copilot/local-only",
            },
            {
                createPlugin: () => ({
                    configs: {
                        content: {},
                        experimental: createLocalConfig(
                            "docusaurus-2",
                            "docusaurus-2/local-only"
                        ),
                    },
                    rules: {},
                }),
                overrideName: "docusaurus-2",
                ruleName: "docusaurus-2/local-only",
            },
            {
                createPlugin: () => ({
                    configs: {
                        dependabot: { rules: {} },
                        github: { rules: {} },
                        node: { rules: {} },
                        recommended: createLocalConfig(
                            "repo-compliance",
                            "repo-compliance/local-only"
                        ),
                    },
                    rules: {},
                }),
                overrideName: "repo",
                ruleName: "repo-compliance/local-only",
            },
            {
                createPlugin: () =>
                    createSingleConfigLocalPlugin(
                        "all",
                        "github-actions",
                        "github-actions/local-only"
                    ),
                overrideName: "github-actions-2",
                ruleName: "github-actions/local-only",
            },
            {
                createPlugin: () =>
                    createSingleConfigLocalPlugin(
                        "all",
                        "immutable",
                        "immutable/local-only"
                    ),
                overrideName: "immutable-2",
                ruleName: "immutable/local-only",
            },
            {
                createPlugin: () =>
                    createSingleConfigLocalPlugin(
                        "all",
                        "remark",
                        "remark/local-only"
                    ),
                overrideName: "remark",
                ruleName: "remark/local-only",
            },
            {
                createPlugin: () =>
                    createSingleConfigLocalPlugin(
                        "all",
                        "runtime-cleanup",
                        "runtime-cleanup/local-only"
                    ),
                overrideName: "runtime-cleanup",
                ruleName: "runtime-cleanup/local-only",
            },
            {
                createPlugin: () =>
                    createSingleConfigLocalPlugin(
                        "all",
                        "secretlint",
                        "secretlint/local-only"
                    ),
                overrideName: "secretlint",
                ruleName: "secretlint/local-only",
            },
            {
                createPlugin: () =>
                    createSingleConfigLocalPlugin(
                        "all",
                        "stylelint-2",
                        "stylelint-2/local-only"
                    ),
                overrideName: "stylelint-2",
                ruleName: "stylelint-2/local-only",
            },
            {
                createPlugin: () =>
                    createSingleConfigLocalPlugin(
                        "all",
                        "test-signal",
                        "test-signal/local-only"
                    ),
                overrideName: "test-signal",
                ruleName: "test-signal/local-only",
            },
            {
                createPlugin: () =>
                    createSingleConfigLocalPlugin(
                        "all",
                        "tombi",
                        "tombi/local-only"
                    ),
                overrideName: "tombi",
                ruleName: "tombi/local-only",
            },
            {
                createPlugin: () =>
                    createSingleConfigLocalPlugin(
                        "all",
                        "tsconfig",
                        "tsconfig/local-only"
                    ),
                overrideName: "tsconfig",
                ruleName: "tsconfig/local-only",
            },
            {
                createPlugin: () =>
                    createSingleConfigLocalPlugin(
                        "all",
                        "yamllint",
                        "yamllint/local-only"
                    ),
                overrideName: "yamllint",
                ruleName: "yamllint/local-only",
            },
            {
                createPlugin: () =>
                    createSingleConfigLocalPlugin(
                        "recommended",
                        "json-schema-validator",
                        "json-schema-validator/local-only"
                    ),
                overrideName: "json-schema-validator-2",
                ruleName: "json-schema-validator/local-only",
            },
            {
                createPlugin: () =>
                    createSingleConfigLocalPlugin(
                        "recommended",
                        "typedoc",
                        "typedoc/local-only"
                    ),
                overrideName: "typedoc",
                ruleName: "typedoc/local-only",
            },
            {
                createPlugin: () =>
                    createSingleConfigLocalPlugin(
                        "recommended-ci",
                        "file-progress",
                        "file-progress/local-only"
                    ),
                overrideName: "file-progress-2",
                ruleName: "file-progress/local-only",
            },
            {
                createPlugin: () =>
                    createSingleConfigLocalPlugin(
                        "required",
                        "sdl",
                        "sdl/local-only"
                    ),
                overrideName: "sdl-2",
                ruleName: "sdl/local-only",
            },
        ] as const;
        // eslint-enable perfectionist/sort-arrays -- Re-enable after intentionally grouped fixture cases.

        for (const {
            createPlugin,
            overrideName,
            ruleName,
        } of ownedPluginReplacementCases) {
            const configEntries = createConfig({
                plugins: {
                    [overrideName]: createPlugin(),
                },
            }) as readonly Linter.Config[];
            const disabledConfigEntries = createConfig({
                plugins: {
                    [overrideName]: false,
                },
            }) as readonly Linter.Config[];

            expect([...getRuleNames(configEntries)]).toContain(ruleName);
            expect([...getRuleNames(disabledConfigEntries)]).not.toContain(
                ruleName
            );
        }
    });

    it("uses local plugins in owned manual-rule sections", () => {
        expect.assertions(3);

        const localEtcMiscPlugin = { configs: {}, rules: {} };
        const localTsdocRequirePlugin = { configs: {}, rules: {} };
        const localWriteGoodCommentsPlugin = {
            configs: {
                all: {
                    plugins: {
                        "write-good-comments": {
                            rules: {},
                        },
                    },
                    settings: {
                        localWriteGoodComments: true,
                    },
                },
            },
            rules: {},
        };
        const configEntries = createConfig({
            plugins: {
                "etc-misc": localEtcMiscPlugin,
                "tsdoc-require-2": localTsdocRequirePlugin,
                "write-good-comments-2": localWriteGoodCommentsPlugin,
            },
        }) as readonly Linter.Config[];

        expect(
            findConfigByName(configEntries, "⌨️ Etc-Misc: Rules for Source")
                ?.plugins?.["etc-misc"]
        ).toBe(localEtcMiscPlugin);
        expect(
            findConfigByName(configEntries, "⌨️ TSDoc Require 2: source docs")
                ?.plugins?.["tsdoc-require-2"]
        ).toBe(localTsdocRequirePlugin);
        expect(
            findConfigByName(
                configEntries,
                "🍀 Write Good Comments: (not used in this repo)"
            )?.settings?.["localWriteGoodComments"]
        ).toBe(true);
    });
});

describe("selected rule defaults", () => {
    it("enables the selected low-noise rules at warning severity", () => {
        expect.assertions(3);

        const etcMiscConfig = findConfigByName(
            presets.all,
            "⌨️ Etc-Misc: Rules for Source"
        );
        const typedocConfig = findConfigByName(
            presets.all,
            "⌨️ TypeDoc: Recommended"
        );
        const writeGoodCommentsConfig = findConfigByName(
            presets.all,
            "🍀 Write Good Comments: (not used in this repo)"
        );

        expect(etcMiscConfig?.rules).toMatchObject({
            "etc-misc/no-const-enum": "warn",
            "etc-misc/no-unnecessary-as-const": "warn",
        });
        expect(typedocConfig?.rules).toMatchObject({
            "typedoc/require-package-documentation-description": "warn",
            "typedoc/require-param-tag-description": "warn",
            "typedoc/require-returns-description": "warn",
            "typedoc/require-since-tag-description": "warn",
            "typedoc/require-throws-description": "warn",
            "typedoc/require-type-param-tag-description": "warn",
        });
        expect(
            writeGoodCommentsConfig?.rules?.[
                "write-good-comments/task-comment-format"
            ]
        ).toBe("warn");
    });

    it("enables the canonical unsafe Object.assign rule", () => {
        expect.assertions(1);

        const etcMiscConfig = findConfigByName(
            presets.all,
            "⌨️ Etc-Misc: Rules for Source"
        );

        expect(
            etcMiscConfig?.rules?.[
                "etc-misc/typescript/no-unsafe-object-assign"
            ]
        ).toBe("warn");
    });

    it("scopes package documentation to the repository entrypoint", async () => {
        expect.assertions(3);

        const typedocConfig = findConfigByName(
            presets.all,
            "⌨️ TypeDoc: Recommended"
        );
        const eslint = new ESLint({ cwd: repositoryRoot });
        const presetConfig = (await eslint.calculateConfigForFile(
            "src/preset.ts"
        )) as Linter.Config | undefined;
        const sharedConfig = (await eslint.calculateConfigForFile(
            "src/shared-config.ts"
        )) as Linter.Config | undefined;

        expect(
            typedocConfig?.rules?.["typedoc/require-package-documentation"]
        ).toBe("off");
        expect(
            getRuleSeverity(
                presetConfig?.rules?.["typedoc/require-package-documentation"]
            )
        ).toBe(1);
        expect(
            getRuleSeverity(
                sharedConfig?.rules?.["typedoc/require-package-documentation"]
            )
        ).toBe(0);
    });
});

describe("etc-misc v3 rule ownership", () => {
    it("uses the real all preset inventory without enabling deprecated rules", () => {
        expect.assertions(5);

        const etcMiscConfig = findConfigByName(
            presets.all,
            "⌨️ Etc-Misc: Rules for Source"
        );
        const configuredRules = etcMiscConfig?.rules ?? {};
        const configuredRuleNames = Object.keys(configuredRules).filter(
            (ruleName) => ruleName.startsWith("etc-misc/")
        );
        const pluginRuleNames = new Set(Object.keys(etcMiscPlugin.rules));
        const allPresetRuleNames = Object.keys(etcMiscPlugin.configs.all.rules);
        const deprecatedRuleNames = Object.entries(etcMiscPlugin.rules)
            .filter(([, rule]) => Boolean(rule.meta.deprecated))
            .map(([ruleName]) => `etc-misc/${ruleName}`);

        expect(
            allPresetRuleNames.filter(
                (ruleName) => !Object.hasOwn(configuredRules, ruleName)
            )
        ).toStrictEqual([]);
        expect(
            configuredRuleNames.filter(
                (ruleName) => !pluginRuleNames.has(ruleName.slice(9))
            )
        ).toStrictEqual([]);
        expect(
            deprecatedRuleNames.filter(
                (ruleName) =>
                    Object.hasOwn(configuredRules, ruleName) &&
                    isRuleEnabled(configuredRules[ruleName])
            )
        ).toStrictEqual([]);
        expect(configuredRules["etc-misc/require-memo"]).toBe("off");
        expect(configuredRuleNames).not.toStrictEqual(
            expect.arrayContaining([
                "etc-misc/require-usememo",
                "etc-misc/require-usememo-children",
            ])
        );
    });

    it("keeps canonical upstream behavior owners enabled exactly once", async () => {
        expect.assertions(9);

        const eslint = new ESLint({
            cwd: repositoryRoot,
            overrideConfig: presets.all,
            overrideConfigFile: true,
        });
        const effectiveConfig = (await eslint.calculateConfigForFile(
            "src/preset.ts"
        )) as Linter.Config | undefined;
        const testConfig = (await eslint.calculateConfigForFile(
            "src/test/example.test.ts"
        )) as Linter.Config | undefined;
        const canonicalRuleOwners = [
            "@stylistic/no-multiple-empty-lines",
            "@typescript-eslint/array-type",
            "@typescript-eslint/consistent-type-exports",
            "@typescript-eslint/member-ordering",
            "@typescript-eslint/no-base-to-string",
            "@typescript-eslint/no-mixed-enums",
            "@typescript-eslint/no-unnecessary-type-parameters",
            "@typescript-eslint/no-unused-vars",
            "@typescript-eslint/only-throw-error",
            "@typescript-eslint/prefer-promise-reject-errors",
            "@typescript-eslint/prefer-readonly-parameter-types",
            "@typescript-eslint/use-unknown-in-catch-callback-variable",
            "id-match",
            "no-restricted-exports",
            "perfectionist/sort-arrays",
            "perfectionist/sort-exports",
            "perfectionist/sort-imports",
            "perfectionist/sort-named-exports",
            "perfectionist/sort-objects",
            "unicorn/no-unreadable-iife",
            "unicorn/no-unused-properties",
            "unicorn/no-useless-template-literals",
            "unicorn/prefer-includes",
            "unicorn/throw-new-error",
        ] as const;
        const deprecatedEtcMiscRuleNames = [
            "etc-misc/consistent-empty-lines",
            "etc-misc/jsx-no-jsx-as-prop",
            "etc-misc/jsx-no-new-array-as-prop",
            "etc-misc/jsx-no-new-function-as-prop",
            "etc-misc/jsx-no-new-object-as-prop",
            "etc-misc/no-implicit-any-catch",
            "etc-misc/no-underscore-export",
            "etc-misc/no-unnecessary-template-literal",
            "etc-misc/restrict-identifier-characters",
            "etc-misc/sort-array",
            "etc-misc/sort-call-signature",
            "etc-misc/sort-construct-signature",
            "etc-misc/sort-export-specifiers",
            "etc-misc/sort-keys",
            "etc-misc/throw-error",
        ] as const;
        const intentionallyUnownedPluginNames = [
            "compat",
            "no-secrets",
            "simple-import-sort",
            "unused-imports",
        ] as const;
        const readonlyParameterRule =
            effectiveConfig?.rules?.[
                "@typescript-eslint/prefer-readonly-parameter-types"
            ];
        const readonlyParameterOptions = assertNonArrayObject(
            Array.isArray(readonlyParameterRule)
                ? readonlyParameterRule[1]
                : undefined,
            "Expected prefer-readonly-parameter-types to have options."
        );

        expect(
            canonicalRuleOwners.filter(
                (ruleName) => !isRuleEnabled(effectiveConfig?.rules?.[ruleName])
            )
        ).toStrictEqual([]);
        expect(
            intentionallyUnownedPluginNames.filter((pluginName) =>
                Object.hasOwn(effectiveConfig?.plugins ?? {}, pluginName)
            )
        ).toStrictEqual([]);
        expect(
            deprecatedEtcMiscRuleNames.filter((ruleName) =>
                isRuleEnabled(effectiveConfig?.rules?.[ruleName])
            )
        ).toStrictEqual([]);
        expect(readonlyParameterOptions).toMatchObject({
            checkParameterProperties: true,
            ignoreInferredTypes: true,
            treatMethodsAsReadonly: true,
        });
        expect(
            effectiveConfig?.rules?.[
                "@eslint-community/eslint-comments/no-unused-disable"
            ]
        ).toBeUndefined();
        expect(
            effectiveConfig?.linterOptions?.reportUnusedDisableDirectives
        ).toBe(1);
        expect(
            isRuleEnabled(testConfig?.rules?.["vitest/no-focused-tests"])
        ).toBe(true);
        expect(
            isRuleEnabled(testConfig?.rules?.["test-signal/no-focused-tests"])
        ).toBe(false);
        expect(
            isRuleEnabled(testConfig?.rules?.["etc-misc/no-only-tests"])
        ).toBe(false);
    });

    it("keeps deprecated React allocation checks and their umbrella rule opt-in", async () => {
        expect.assertions(10);

        const eslint = new ESLint({
            cwd: repositoryRoot,
            overrideConfig: presets.all,
            overrideConfigFile: true,
        });
        const effectiveConfig = (await eslint.calculateConfigForFile(
            "src/components/example.tsx"
        )) as Linter.Config | undefined;
        const intrinsicAllocationRuleNames = [
            "etc-misc/jsx-no-jsx-as-prop",
            "etc-misc/jsx-no-new-array-as-prop",
            "etc-misc/jsx-no-new-function-as-prop",
            "etc-misc/jsx-no-new-object-as-prop",
        ] as const;

        for (const ruleName of intrinsicAllocationRuleNames) {
            expect(isRuleEnabled(effectiveConfig?.rules?.[ruleName])).toBe(
                false
            );
        }

        expect(
            effectiveConfig?.rules?.["etc-misc/no-invalid-jsx-nesting"]
        ).toStrictEqual([2, { checkVoidParents: false }]);
        expect(
            isRuleEnabled(
                effectiveConfig?.rules?.[
                    "@eslint-react/dom-no-void-elements-with-children"
                ]
            )
        ).toBe(true);
        expect(
            isRuleEnabled(
                effectiveConfig?.rules?.[
                    "etc-misc/react-prefer-function-component"
                ]
            )
        ).toBe(false);
        expect(
            isRuleEnabled(
                effectiveConfig?.rules?.["@eslint-react/no-class-component"]
            )
        ).toBe(true);
        expect(
            isRuleEnabled(
                effectiveConfig?.rules?.["etc-misc/no-unstable-react-values"]
            )
        ).toBe(false);
        expect(
            isRuleEnabled(
                effectiveConfig?.rules?.[
                    "@eslint-react/no-unstable-context-value"
                ]
            )
        ).toBe(false);
    });

    it("reports migrated behavior through one upstream owner", async () => {
        expect.assertions(2);

        const eslint = new ESLint({
            cwd: ruleOwnershipFixtureWorkspaceRoot,
            overrideConfig: createConfig({
                plugins: {
                    "file-progress": false,
                    "file-progress-2": false,
                    secretlint: false,
                },
                rootDirectory: ruleOwnershipFixtureWorkspaceRoot,
                sonarjs: false,
                tsconfigPaths: ["./tsconfig.json"],
            }),
            overrideConfigFile: true,
        });
        const [typescriptResult] = await eslint.lintText(
            `export function inspect(values: string[]): void {
    const labels = ["beta", "alpha"] as const;
    void labels;

    if (values.length === 0) {
        throw "reason";
    }

    void Promise.reject("reason");
    void Promise.resolve().catch((reason: any): any => reason);
}
`,
            { filePath: "src/index.ts" }
        );
        const [reactResult] = await eslint.lintText(
            `declare function Widget(properties: Readonly<Record<string, unknown>>): JSX.Element;

export const View = (): JSX.Element => (
    <Widget
        callback={() => undefined}
        child={<span />}
        items={[]}
        options={{}}
    />
);
`,
            { filePath: "src/view.tsx" }
        );
        const readonlyAndErrorRuleNames = new Set([
            "@typescript-eslint/only-throw-error",
            "@typescript-eslint/prefer-promise-reject-errors",
            "@typescript-eslint/prefer-readonly-parameter-types",
            "@typescript-eslint/use-unknown-in-catch-callback-variable",
            "etc-misc/no-implicit-any-catch",
            "etc-misc/sort-array",
            "etc-misc/throw-error",
            "perfectionist/sort-arrays",
        ]);
        const reactAllocationRuleNames = new Set([
            "etc-misc/jsx-no-jsx-as-prop",
            "etc-misc/jsx-no-new-array-as-prop",
            "etc-misc/jsx-no-new-function-as-prop",
            "etc-misc/jsx-no-new-object-as-prop",
            "etc-misc/no-unstable-react-values",
        ]);

        expect(
            typescriptResult?.messages
                .map((message) => message.ruleId)
                .filter(
                    (ruleName): ruleName is string =>
                        ruleName !== null &&
                        readonlyAndErrorRuleNames.has(ruleName)
                )
                .toSorted((left, right) => left.localeCompare(right))
        ).toStrictEqual([
            "@typescript-eslint/only-throw-error",
            "@typescript-eslint/prefer-promise-reject-errors",
            "@typescript-eslint/prefer-readonly-parameter-types",
            "@typescript-eslint/use-unknown-in-catch-callback-variable",
            "perfectionist/sort-arrays",
        ]);
        expect(
            reactResult?.messages
                .map((message) => message.ruleId)
                .filter(
                    (ruleName): ruleName is string =>
                        ruleName !== null &&
                        reactAllocationRuleNames.has(ruleName)
                )
        ).toStrictEqual([]);
    });

    it("removes Etc-Misc completely from the effective opt-out preset", async () => {
        expect.assertions(2);

        const eslint = new ESLint({
            cwd: repositoryRoot,
            overrideConfig: presets.withoutEtcMisc,
            overrideConfigFile: true,
        });
        const effectiveConfig = (await eslint.calculateConfigForFile(
            "src/preset.ts"
        )) as Linter.Config | undefined;

        expect(Object.hasOwn(effectiveConfig?.plugins ?? {}, "etc-misc")).toBe(
            false
        );
        expect(
            Object.keys(effectiveConfig?.rules ?? {}).some((ruleName) =>
                ruleName.startsWith("etc-misc/")
            )
        ).toBe(false);
    });
});

describe("vue preset integration", () => {
    it("enables the maintained scoped-CSS and accessibility rules", () => {
        expect.assertions(10);

        const vueConfig = findConfigByName(
            presets.all,
            "🖖 Vue SFCs: **/*.vue"
        );

        expect(Object.keys(vueConfig?.plugins ?? {})).toStrictEqual(
            expect.arrayContaining(["vue-scoped-css", "vuejs-accessibility"])
        );
        expect(
            getRuleNamesForPlugin(presets.all, "vue-scoped-css")
        ).toHaveLength(14);
        expect(
            getRuleNamesForPlugin(presets.all, "vuejs-accessibility")
        ).toHaveLength(22);
        expect(vueConfig?.rules?.["vue-scoped-css/no-unused-selector"]).toBe(
            "warn"
        );
        expect(
            vueConfig?.rules?.[
                "vue-scoped-css/no-deprecated-v-enter-v-leave-class"
            ]
        ).toBe("warn");
        expect(
            vueConfig?.rules?.["vue-scoped-css/require-selector-used-inside"]
        ).toBe("warn");
        expect(vueConfig?.rules?.["vuejs-accessibility/alt-text"]).toBe(
            "error"
        );
        expect(
            vueConfig?.rules?.[
                "vuejs-accessibility/no-aria-hidden-on-focusable"
            ]
        ).toBe("off");
        expect(
            vueConfig?.rules?.[
                "vuejs-accessibility/no-role-presentation-on-focusable"
            ]
        ).toBe("error");
        expect(
            vueConfig?.rules?.["vuejs-accessibility/no-onchange"]
        ).toBeUndefined();
    });

    it("supports disabling either added Vue namespace", () => {
        expect.assertions(4);

        const configEntries = createConfig({
            plugins: {
                "vue-scoped-css": false,
                "vuejs-accessibility": false,
            },
        });
        const registeredPluginNames = getRegisteredPluginNames(configEntries);

        expect(registeredPluginNames).not.toContain("vue-scoped-css");
        expect(registeredPluginNames).not.toContain("vuejs-accessibility");
        expect(
            getRuleNamesForPlugin(configEntries, "vue-scoped-css")
        ).toStrictEqual([]);
        expect(
            getRuleNamesForPlugin(configEntries, "vuejs-accessibility")
        ).toStrictEqual([]);
    });
});

describe("jest preset integration", () => {
    it("keeps Jest absent and Vitest enabled by default", () => {
        expect.assertions(3);

        expect(getRegisteredPluginNames(presets.all)).not.toContain("jest");
        expect(getRuleNamesForPlugin(presets.all, "jest")).toStrictEqual([]);
        expect(findConfigByName(presets.all, "🧪 Vitest: all")?.name).toBe(
            "🧪 Vitest: all"
        );
    });

    it("replaces Vitest with the stable Jest recommended config", () => {
        expect.assertions(5);

        const configEntries = createConfig({ jest: true });
        const jestConfig = findConfigByName(
            configEntries,
            "🃏 Jest: Recommended"
        );

        expect(jestConfig?.files).toStrictEqual([
            "test/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            "tests/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            "src/test/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            "benchmarks/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            "benchmark/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
        ]);
        expect(jestConfig?.plugins?.["jest"]).toBe(jest);
        expect(jestConfig?.rules).toStrictEqual(
            jest.configs["flat/recommended"].rules
        );
        expect(
            findConfigByName(configEntries, "🧪 Vitest: all")
        ).toBeUndefined();
        expect(getRuleNamesForPlugin(configEntries, "vitest")).toStrictEqual(
            []
        );
    });

    it("supports custom files and an explicit Jest version", () => {
        expect.assertions(4);

        const files = ["packages/*/jest/**/*.{ts,tsx}"] as const;
        const configEntries = createConfig({
            jest: { files, version: "30.0.0" },
        });
        const jestConfig = findConfigByName(
            configEntries,
            "🃏 Jest: Recommended"
        );
        const testingLibraryConfig = findConfigByName(
            configEntries,
            "👨‍🔬 Testing Library: DOM"
        );
        const testOverrides = findConfigByName(
            configEntries,
            "🧪 Tests: Tests, Benchmarks ⛔ Overrides"
        );
        const jestSettings = assertNonArrayObject(
            jestConfig?.settings?.["jest"],
            "Expected the enabled Jest config to define settings.jest."
        );

        expect(jestConfig?.files).toStrictEqual([...files]);
        expect(testingLibraryConfig?.files).toStrictEqual([...files]);
        expect(testOverrides?.files).toStrictEqual([...files]);
        expect(jestSettings["version"]).toBe("30.0.0");
    });

    it("maps withJest as a complete opt-in preset", () => {
        expect.assertions(3);

        expect(getPresetByName("withJest")).toBe(presets.withJest);
        expect(nickTwoBadFourU.configs.withJest).toBe(presets.withJest);
        expect(
            findConfigByName(presets.withJest, "🃏 Jest: Recommended")?.rules
        ).toStrictEqual(jest.configs["flat/recommended"].rules);
    });
});

const sonarJSRulesCoveredElsewhere = [
    "sonarjs/arguments-usage",
    "sonarjs/array-callback-without-return",
    "sonarjs/arrow-function-convention",
    "sonarjs/assertions-in-test-cases",
    "sonarjs/assertions-in-tests",
    "sonarjs/async-test-assertions",
    "sonarjs/block-scoped-var",
    "sonarjs/code-eval",
    "sonarjs/concise-regex",
    "sonarjs/constructor-for-side-effects",
    "sonarjs/declarations-in-global-scope",
    "sonarjs/duplicates-in-character-class",
    "sonarjs/existing-groups",
    "sonarjs/fixme-tag",
    "sonarjs/for-in",
    "sonarjs/for-loop-increment-sign",
    "sonarjs/function-inside-loop",
    "sonarjs/generator-without-yield",
    "sonarjs/hooks-before-test-cases",
    "sonarjs/index-of-compare-to-positive-number",
    "sonarjs/jsx-no-leaked-render",
    "sonarjs/label-position",
    "sonarjs/link-with-target-blank",
    "sonarjs/no-alphabetical-sort",
    "sonarjs/no-array-delete",
    "sonarjs/no-built-in-override",
    "sonarjs/no-case-label-in-switch",
    "sonarjs/no-control-regex",
    "sonarjs/no-dead-store",
    "sonarjs/no-delete-var",
    "sonarjs/no-duplicate-in-composite",
    "sonarjs/no-duplicate-test-title",
    "sonarjs/no-empty-alternatives",
    "sonarjs/no-empty-character-class",
    "sonarjs/no-empty-group",
    "sonarjs/no-empty-test-title",
    "sonarjs/no-exclusive-tests",
    "sonarjs/no-fallthrough",
    "sonarjs/no-fixed-wait-in-tests",
    "sonarjs/no-for-in-iterable",
    "sonarjs/no-function-declaration-in-block",
    "sonarjs/no-hook-setter-in-body",
    "sonarjs/no-implicit-dependencies",
    "sonarjs/no-implicit-global",
    "sonarjs/no-incorrect-string-concat",
    "sonarjs/no-interpolation-in-inline-snapshots",
    "sonarjs/no-invalid-regexp",
    "sonarjs/no-labels",
    "sonarjs/no-misleading-array-reverse",
    "sonarjs/no-misleading-character-class",
    "sonarjs/no-nested-incdec",
    "sonarjs/no-parameter-reassignment",
    "sonarjs/no-primitive-wrappers",
    "sonarjs/no-redundant-boolean",
    "sonarjs/no-regex-spaces",
    "sonarjs/no-require-or-define",
    "sonarjs/no-return-type-any",
    "sonarjs/no-skipped-tests",
    "sonarjs/no-trivial-assertions",
    "sonarjs/no-unused-function-argument",
    "sonarjs/no-unused-vars",
    "sonarjs/no-use-of-empty-return-value",
    "sonarjs/no-useless-catch",
    "sonarjs/no-variable-usage-before-declaration",
    "sonarjs/prefer-default-last",
    "sonarjs/prefer-object-literal",
    "sonarjs/prefer-regexp-exec",
    "sonarjs/prefer-specific-assertions",
    "sonarjs/single-char-in-character-classes",
    "sonarjs/slow-regex",
    "sonarjs/super-linear-regex",
    "sonarjs/test-check-exception",
    "sonarjs/todo-tag",
    "sonarjs/unused-import",
    "sonarjs/unused-named-groups",
] as const;

describe("sonarjs preset integration", () => {
    it("enables the audited SonarJS rules by default on code files", () => {
        expect.assertions(7);

        const sonarJSConfig = findConfigByName(
            presets.all,
            "📡 SonarJS: Recommended"
        );

        expect(sonarJSConfig?.files).toStrictEqual([
            "**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
        ]);
        expect(Object.keys(sonarJSConfig?.plugins ?? {})).toContain("sonarjs");
        expect(sonarJSConfig?.rules?.["sonarjs/no-identical-expressions"]).toBe(
            sonarjsConfigs.recommended.rules?.[
                "sonarjs/no-identical-expressions"
            ]
        );
        expect(sonarJSConfig?.rules?.["sonarjs/no-inconsistent-returns"]).toBe(
            "warn"
        );
        expect(sonarJSConfig?.rules?.["sonarjs/no-undefined-assignment"]).toBe(
            "warn"
        );
        expect(
            Object.entries(sonarjsRules)
                .filter(
                    ([, rule]) =>
                        rule.meta?.deprecated === true ||
                        typeof rule.meta?.deprecated === "object"
                )
                .map(([ruleName]) => `sonarjs/${ruleName}`)
                .filter((ruleName) =>
                    isRuleEnabled(sonarJSConfig?.rules?.[ruleName])
                )
        ).toStrictEqual([]);
        expect(
            sonarJSRulesCoveredElsewhere.filter((ruleName) =>
                isRuleEnabled(sonarJSConfig?.rules?.[ruleName])
            )
        ).toStrictEqual([]);
    });

    it("supports explicitly disabling SonarJS", () => {
        expect.assertions(3);

        const configEntries = createConfig({ sonarjs: false });

        expect(
            findConfigByName(configEntries, "📡 SonarJS: Recommended")
        ).toBeUndefined();
        expect(getRegisteredPluginNames(configEntries)).not.toContain(
            "sonarjs"
        );
        expect(getRuleNamesForPlugin(configEntries, "sonarjs")).toStrictEqual(
            []
        );
    });

    it("supports custom SonarJS file globs", () => {
        expect.assertions(1);

        const files = ["packages/*/src/**/*.{js,ts}"] as const;
        const configEntries = createConfig({ sonarjs: { files } });
        const sonarJSConfig = findConfigByName(
            configEntries,
            "📡 SonarJS: Recommended"
        );

        expect(sonarJSConfig?.files).toStrictEqual([...files]);
    });

    it("exposes the opt-out preset and preserves the former opt-in alias", () => {
        expect.assertions(6);

        expect(getPresetByName("withSonarJS")).toBe(presets.withSonarJS);
        expect(nickTwoBadFourU.configs.withSonarJS).toBe(presets.withSonarJS);
        expect(presets.withSonarJS).toBe(presets.all);
        expect(getPresetByName("withoutSonarJS")).toBe(presets.withoutSonarJS);
        expect(nickTwoBadFourU.configs.withoutSonarJS).toBe(
            presets.withoutSonarJS
        );
        expect(
            findConfigByName(presets.withoutSonarJS, "📡 SonarJS: Recommended")
        ).toBeUndefined();
    });
});

describe("next.js preset integration", () => {
    it("omits the Next plugin and its rules by default", () => {
        expect.assertions(2);

        expect(getRegisteredPluginNames(presets.all)).not.toContain(
            "@next/next"
        );
        expect(getRuleNamesForPlugin(presets.all, "@next/next")).toStrictEqual(
            []
        );
    });

    it("enables the exact recommended rules on the default router globs", () => {
        expect.assertions(2);

        const configEntries = createConfig({ next: true });
        const nextConfig = findConfigByName(
            configEntries,
            "⚛️ Next.js: Recommended"
        );

        expect(nextConfig?.files).toStrictEqual([
            "app/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            "pages/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            "src/app/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
            "src/pages/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
        ]);
        expect(nextConfig?.rules).toStrictEqual(next.configs.recommended.rules);
    });

    it("replaces the default router globs with custom files", () => {
        expect.assertions(2);

        const files = ["apps/*/src/app/**/*.{ts,tsx}"] as const;
        const configEntries = createConfig({ next: { files } });
        const nextConfig = findConfigByName(
            configEntries,
            "⚛️ Next.js: Recommended"
        );

        expect(nextConfig?.files).toStrictEqual([...files]);
        expect(nextConfig?.rules).toStrictEqual(next.configs.recommended.rules);
    });

    it.each([
        ["readonly array", ["apps/docs", "apps/web"] as const],
        ["string", "apps/web"],
    ] as const)("preserves a %s Next rootDir", (_description, rootDir) => {
        expect.assertions(1);

        const configEntries = createConfig({ next: { rootDir } });
        const nextConfig = findConfigByName(
            configEntries,
            "⚛️ Next.js: Recommended"
        );
        const nextSettings = assertNonArrayObject(
            nextConfig?.settings?.["next"],
            "Expected the enabled Next config to define settings.next."
        );

        expect(nextSettings["rootDir"]).toStrictEqual(rootDir);
    });

    it("maps withNext as a complete recommended-rule preset", () => {
        expect.assertions(4);

        const nextConfig = findConfigByName(
            presets.withNext,
            "⚛️ Next.js: Recommended"
        );

        expect(getPresetByName("withNext")).toBe(presets.withNext);
        expect(nickTwoBadFourU.configs.withNext).toBe(presets.withNext);
        expect(nextConfig?.rules).toStrictEqual(next.configs.recommended.rules);
        expect(
            Object.values(nextConfig?.rules ?? {}).some((ruleConfig) =>
                isRuleEnabled(ruleConfig)
            )
        ).toBe(true);
    });
});

describe("astro preset integration", () => {
    it("keeps the complete base, supported rules, and disabled JSX-a11y wrappers", () => {
        expect.assertions(5);

        const presetConfigNames = new Set(
            presets.all.map((configEntry) => configEntry.name)
        );
        const missingAstroBaseConfigNames = astro.configs.base
            .map((configEntry) => configEntry.name)
            .filter((configName) => !presetConfigNames.has(configName));
        // JSX accessibility wrappers are not self-contained and their optional peer
        // does not support this package's ESLint major yet.
        const supportedAstroRuleNames = Object.entries(astro.rules)
            .filter(([ruleName, rule]) => {
                const deprecated = rule.meta?.deprecated;

                return (
                    !ruleName.startsWith("jsx-a11y/") &&
                    (deprecated === undefined || deprecated === false)
                );
            })
            .map(([ruleName]) => `astro/${ruleName}`)
            .toSorted((left, right) => left.localeCompare(right));
        const astroJsxA11yRuleNames = Object.keys(astro.rules)
            .filter((ruleName) => ruleName.startsWith("jsx-a11y/"))
            .map((ruleName) => `astro/${ruleName}`)
            .toSorted((left, right) => left.localeCompare(right));
        const unsortedExpectedConfiguredAstroRuleNames = [
            ...supportedAstroRuleNames,
            ...astroJsxA11yRuleNames,
        ];
        const expectedConfiguredAstroRuleNames =
            unsortedExpectedConfiguredAstroRuleNames.toSorted((left, right) =>
                left.localeCompare(right)
            );
        const astroComponentConfig = findConfigByName(
            presets.all,
            "🚀 Astro Components: **/*.astro"
        );
        const astroComponentRules = astroComponentConfig?.rules ?? {};
        const astroTypeScriptBaseConfig = findConfigByName(
            presets.all,
            "astro/base/typescript"
        );
        const astroTypeScriptParserOptions = assertNonArrayObject(
            astroTypeScriptBaseConfig?.languageOptions?.["parserOptions"],
            "Expected the Astro TypeScript base config to define parser options."
        );

        expect(missingAstroBaseConfigNames).toStrictEqual([]);
        expect(
            getRuleNamesForPlugin(presets.all, "astro").toSorted(
                (left, right) => left.localeCompare(right)
            )
        ).toStrictEqual(expectedConfiguredAstroRuleNames);
        expect(
            supportedAstroRuleNames.filter(
                (ruleName) => !isRuleEnabled(astroComponentRules[ruleName])
            )
        ).toStrictEqual([]);
        expect(
            astroJsxA11yRuleNames.map((ruleName) => [
                ruleName,
                astroComponentRules[ruleName],
            ])
        ).toStrictEqual(
            astroJsxA11yRuleNames.map((ruleName) => [ruleName, "off"])
        );
        expect(Reflect.get(astroTypeScriptParserOptions, "project")).toBeNull();
    });
});
