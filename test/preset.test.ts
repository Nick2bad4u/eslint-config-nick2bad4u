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

const getPresetByName = (presetName: string): readonly Linter.Config[] => {
    switch (presetName) {
        case "withoutChunkyLint": {
            return presets.withoutChunkyLint;
        }

        case "withoutCopilot": {
            return presets.withoutCopilot;
        }

        case "withoutDocusaurus2": {
            return presets.withoutDocusaurus2;
        }

        case "withoutEtcMisc": {
            return presets.withoutEtcMisc;
        }

        case "withoutFileProgress2": {
            return presets.withoutFileProgress2;
        }

        case "withoutGithubActions2": {
            return presets.withoutGithubActions2;
        }

        case "withoutImmutable2": {
            return presets.withoutImmutable2;
        }

        case "withoutRemark": {
            return presets.withoutRemark;
        }

        case "withoutRepo": {
            return presets.withoutRepo;
        }

        case "withoutSdl2": {
            return presets.withoutSdl2;
        }

        case "withoutStylelint2": {
            return presets.withoutStylelint2;
        }

        case "withoutTsconfig": {
            return presets.withoutTsconfig;
        }

        case "withoutTsdocRequire2": {
            return presets.withoutTsdocRequire2;
        }

        case "withoutTypedoc": {
            return presets.withoutTypedoc;
        }

        case "withoutTypefest": {
            return presets.withoutTypefest;
        }

        case "withoutUptimeWatcher": {
            return presets.withoutUptimeWatcher;
        }

        case "withoutVite": {
            return presets.withoutVite;
        }

        case "withoutWriteGoodComments2": {
            return presets.withoutWriteGoodComments2;
        }

        default: {
            return presets.all;
        }
    }
};
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
        ["withoutSdl2", "sdl-2"],
        ["withoutStylelint2", "stylelint-2"],
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
});
