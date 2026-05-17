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

const hasRuleFromPlugin = (
    configEntries: readonly Linter.Config[],
    pluginName: string
): boolean =>
    [...getRuleNames(configEntries)].some((ruleName) =>
        ruleName.startsWith(`${pluginName}/`)
    );

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

describe("eslint-config-nick2bad4u presets", () => {
    it("exposes plugin-style flat config presets", () => {
        expect.assertions(4);

        const allPreset = presets.all as readonly Linter.Config[];

        expect(nickTwoBadFourU.configs).toBe(presets);
        expect(allPreset.length).toBeGreaterThan(0);
        expect(presets.recommended).toBe(presets.all);
        expect(Array.isArray(allPreset)).toBeTruthy();
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

            expect(hasRuleFromPlugin(preset, pluginName)).toBeFalsy();
            expect(registeredPluginNames.has(pluginName)).toBeFalsy();
        }
    );

    it("keeps full preset rules in the all preset", () => {
        expect.assertions(2);

        const allPreset = presets.all as readonly Linter.Config[];

        expect(hasRuleFromPlugin(allPreset, "copilot")).toBeTruthy();
        expect(hasRuleFromPlugin(allPreset, "typefest")).toBeTruthy();
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

        expect(
            getRuleNames(configEntries).has("typefest/local-only")
        ).toBeTruthy();
    });

    it.each([
        ["runtime-cleanup", "runtime-cleanup/local-only"],
        ["test-signal", "test-signal/local-only"],
    ] as const)(
        "supports optional %s plugin replacement via createConfig",
        (pluginName, ruleName) => {
            expect.assertions(2);

            const localPlugin = {
                configs: {
                    recommended: {
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

            expect(getRuleNames(configEntries).has(ruleName)).toBeTruthy();
            expect(
                getRuleNames(disabledConfigEntries).has(ruleName)
            ).toBeFalsy();
        }
    );
});
