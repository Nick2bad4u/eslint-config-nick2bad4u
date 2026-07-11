import type { Linter } from "eslint";

import { describe, expect, it } from "vitest";

import nickTwoBadFourU, {
    allowDefaultProjectFilePatternPresets,
    createConfig,
    presets,
} from "../src/preset";

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

const isRuleEnabled = (ruleConfig: unknown): boolean => {
    const severity = Array.isArray(ruleConfig) ? ruleConfig[0] : ruleConfig;

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
    withoutActionlint: presets.withoutActionlint,
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
        ["withoutActionlint", ["actionlint"]],
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
            getRuleNamesForPlugin(allPreset, "actionlint").length
        ).toBeGreaterThan(0);
        expect(
            getRuleNamesForPlugin(allPreset, "copilot").length
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

            const pluginNames = getRegisteredPluginNames(presets.all);

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
                        "actionlint",
                        "actionlint/local-only"
                    ),
                overrideName: "actionlint",
                ruleName: "actionlint/local-only",
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
