import type { Linter } from "eslint";

import nickTwoBadFourU, {
    configs,
    createConfig,
} from "eslint-config-nick2bad4u";
import { describe, expect, it } from "vitest";

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
/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable after local Linter.Config helpers. */

describe("eslint-config-nick2bad4u presets", () => {
    it("exposes plugin-style flat config presets", () => {
        expect.assertions(4);

        expect(nickTwoBadFourU.configs).toBe(configs);
        expect(configs.all.length).toBeGreaterThan(0);
        expect(configs.recommended).toBe(configs.all);
        expect(Array.isArray(configs.all)).toBeTruthy();
    });

    it.each([
        ["withoutCopilot", "copilot"],
        ["withoutEtcMisc", "etc-misc"],
        ["withoutTsconfig", "tsconfig"],
        ["withoutTypefest", "typefest"],
    ] as const)(
        "removes %s plugin rules from the preset",
        (presetName, pluginName) => {
            expect.assertions(2);

            const preset = configs[presetName];
            const registeredPluginNames = getRegisteredPluginNames(preset);

            expect(hasRuleFromPlugin(preset, pluginName)).toBeFalsy();
            expect(registeredPluginNames.has(pluginName)).toBeFalsy();
        }
    );

    it("keeps full preset rules in the all preset", () => {
        expect.assertions(2);

        expect(hasRuleFromPlugin(configs.all, "copilot")).toBeTruthy();
        expect(hasRuleFromPlugin(configs.all, "typefest")).toBeTruthy();
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
        });

        expect(
            getRuleNames(configEntries).has("typefest/local-only")
        ).toBeTruthy();
    });
});
