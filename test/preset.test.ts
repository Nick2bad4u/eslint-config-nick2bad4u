import type { Linter } from "eslint";

import { describe, expect, it } from "vitest";

import nickTwoBadFourU, { createConfig, presets } from "../src/preset";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- Linter.Config is ESLint's mutable public config shape. */

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
}> =>
    configEntries.flatMap((configEntry, configIndex) => {
        const localPluginNames = new Set(
            Object.keys(configEntry.plugins ?? {})
        );

        return Object.entries(configEntry.rules ?? {}).flatMap(
            ([ruleName, ruleConfig]) => {
                if (!isRuleEnabled(ruleConfig)) {
                    return [];
                }

                const pluginName = getPluginNameForRule(ruleName, pluginNames);

                if (
                    pluginName === undefined ||
                    localPluginNames.has(pluginName)
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
        );
    });

const presetByName: Readonly<Record<string, readonly Linter.Config[]>> = {
    withoutChunkyLint: presets.withoutChunkyLint,
    withoutCopilot: presets.withoutCopilot,
    withoutDocusaurus2: presets.withoutDocusaurus2,
    withoutEtcMisc: presets.withoutEtcMisc,
    withoutFileProgress2: presets.withoutFileProgress2,
    withoutGithubActions2: presets.withoutGithubActions2,
    withoutImmutable2: presets.withoutImmutable2,
    withoutRemark: presets.withoutRemark,
    withoutRepo: presets.withoutRepo,
    withoutRuntimeCleanup: presets.withoutRuntimeCleanup,
    withoutSdl2: presets.withoutSdl2,
    withoutStylelint2: presets.withoutStylelint2,
    withoutTestSignal: presets.withoutTestSignal,
    withoutTsconfig: presets.withoutTsconfig,
    withoutTsdocRequire2: presets.withoutTsdocRequire2,
    withoutTypedoc: presets.withoutTypedoc,
    withoutTypefest: presets.withoutTypefest,
    withoutUptimeWatcher: presets.withoutUptimeWatcher,
    withoutVite: presets.withoutVite,
    withoutWriteGoodComments2: presets.withoutWriteGoodComments2,
};

const getPresetByName = (presetName: string): readonly Linter.Config[] =>
    presetByName[presetName] ?? presets.all;
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable after local Linter.Config helpers. */

const presetEntriesByName: Readonly<Record<string, readonly Linter.Config[]>> =
    {
        all: presets.all,
        base: presets.base,
        ...presetByName,
    };

describe("eslint-config-nick2bad4u presets", () => {
    it("exposes plugin-style flat config presets", () => {
        expect.assertions(4);

        const allPreset = presets.all as readonly Linter.Config[];

        expect(nickTwoBadFourU.configs).toBe(presets);
        expect(allPreset.length).toBeGreaterThan(0);
        expect(presets.recommended).toBe(presets.all);
        expect(allPreset).toStrictEqual(
            expect.arrayContaining([expect.any(Object)])
        );
    });

    it("falls back only for unknown preset names", () => {
        expect.assertions(2);

        expect(getPresetByName("missing-preset")).toBe(presets.all);
        expect(getPresetByName("withoutTypefest")).not.toBe(presets.all);
    });

    it.each([
        ["withoutChunkyLint", "chunkylint"],
        ["withoutCopilot", "copilot"],
        ["withoutDocusaurus2", "docusaurus-2"],
        ["withoutEtcMisc", "etc-misc"],
        ["withoutFileProgress2", "file-progress-2"],
        ["withoutGithubActions2", "github-actions-2"],
        ["withoutImmutable2", "immutable-2"],
        ["withoutRemark", "remark"],
        ["withoutRepo", "repo"],
        ["withoutRuntimeCleanup", "runtime-cleanup"],
        ["withoutSdl2", "sdl-2"],
        ["withoutStylelint2", "stylelint-2"],
        ["withoutTestSignal", "test-signal"],
        ["withoutTsconfig", "tsconfig"],
        ["withoutTsdocRequire2", "tsdoc-require-2"],
        ["withoutTypedoc", "typedoc"],
        ["withoutTypefest", "typefest"],
        ["withoutUptimeWatcher", "uptime-watcher"],
        ["withoutVite", "vite"],
        ["withoutWriteGoodComments2", "write-good-comments-2"],
    ] as const)(
        "removes %s plugin rules from the preset",
        (presetName, pluginName) => {
            expect.assertions(2);

            const preset = getPresetByName(presetName);
            const registeredPluginNames = getRegisteredPluginNames(preset);

            expect(getRuleNamesForPlugin(preset, pluginName)).toHaveLength(0);
            expect([...registeredPluginNames]).not.toContain(pluginName);
        }
    );

    it("keeps full preset rules in the all preset", () => {
        expect.assertions(4);

        const allPreset = presets.all as readonly Linter.Config[];

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

    it.each([
        ["runtime-cleanup", "runtime-cleanup/local-only"],
        ["test-signal", "test-signal/local-only"],
    ] as const)(
        "supports %s plugin replacement via createConfig",
        (pluginName, ruleName) => {
            expect.assertions(2);

            const localPlugin = {
                configs: {
                    all: {
                        plugins: {
                            [pluginName]: {
                                rules: {},
                            },
                        },
                        rules: {
                            [ruleName]: "error" as const,
                        },
                    },
                },
                rules: {},
            };

            const configEntries = createConfig({
                plugins: {
                    [pluginName]: localPlugin,
                },
            }) as readonly Linter.Config[];
            const disabledConfigEntries = createConfig({
                plugins: {
                    [pluginName]: false,
                },
            }) as readonly Linter.Config[];

            expect([...getRuleNames(configEntries)]).toContain(ruleName);
            expect([...getRuleNames(disabledConfigEntries)]).not.toContain(
                ruleName
            );
        }
    );
});
