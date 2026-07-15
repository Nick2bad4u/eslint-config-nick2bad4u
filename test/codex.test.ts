import codex from "@typpi/eslint-plugin-codex";
import { ESLint, type Linter } from "eslint";
import { describe, expect, it } from "vitest";

import { createConfig, presets } from "../src/preset";

const isRuleEnabled = (ruleConfig: unknown): boolean => {
    if (ruleConfig === undefined) {
        return false;
    }

    const severity = Array.isArray(ruleConfig) ? ruleConfig[0] : ruleConfig;

    return severity !== "off" && severity !== 0;
};

const getRuleNames = (configEntries: readonly Linter.Config[]): string[] =>
    configEntries.flatMap((configEntry) =>
        Object.keys(configEntry.rules ?? {})
    );

const isNonArrayObject = (
    value: unknown
): value is Record<PropertyKey, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

describe("codex preset integration", () => {
    it("uses every Codex rule without duplicate language plugins", () => {
        expect.assertions(3);

        const codexConfigEntries = presets.all.filter(
            (configEntry) =>
                typeof configEntry.name === "string" &&
                configEntry.name.startsWith(
                    "codex:all-without-language-plugins:"
                )
        );
        const enabledCodexRuleNames = new Set(
            codexConfigEntries.flatMap((configEntry) =>
                Object.entries(configEntry.rules ?? {}).flatMap(
                    ([ruleName, ruleConfig]) =>
                        ruleName.startsWith("codex/") &&
                        isRuleEnabled(ruleConfig)
                            ? [ruleName]
                            : []
                )
            )
        );

        expect(
            codexConfigEntries.map((configEntry) => configEntry.name)
        ).toStrictEqual([
            "codex:all-without-language-plugins:markdown",
            "codex:all-without-language-plugins:toml",
            "codex:all-without-language-plugins:json",
        ]);
        expect(
            codexConfigEntries.map((configEntry) =>
                Object.keys(configEntry.plugins ?? {})
            )
        ).toStrictEqual([
            ["codex"],
            ["codex"],
            ["codex"],
        ]);
        expect(enabledCodexRuleNames).toStrictEqual(
            new Set(
                Object.keys(codex.rules).map((ruleName) => `codex/${ruleName}`)
            )
        );
    });

    it("preserves the shared TOML 1.1 parser policy", async () => {
        expect.assertions(1);

        const eslint = new ESLint({
            overrideConfig: presets.all,
            overrideConfigFile: true,
        });
        const config = (await eslint.calculateConfigForFile(
            ".codex/config.toml"
        )) as Linter.Config | undefined;
        const parserOptions = config?.languageOptions?.["parserOptions"];

        expect(
            isNonArrayObject(parserOptions)
                ? parserOptions["tomlVersion"]
                : undefined
        ).toBe("1.1.0");
    });

    it("keeps AGENTS documents on the Codex document-language path", async () => {
        expect.assertions(2);

        const eslint = new ESLint({
            overrideConfig: presets.all,
            overrideConfigFile: true,
        });
        const config = (await eslint.calculateConfigForFile("AGENTS.md")) as
            Linter.Config | undefined;

        expect(isRuleEnabled(config?.rules?.["codex/no-empty-agents-md"])).toBe(
            true
        );
        expect(isRuleEnabled(config?.rules?.["remark/remark"])).toBe(false);
    });

    it("suppresses oversized instruction chains only for the workflow instructions", async () => {
        expect.assertions(2);

        const eslint = new ESLint({
            overrideConfig: presets.all,
            overrideConfigFile: true,
        });
        const workflowConfig = (await eslint.calculateConfigForFile(
            ".github/workflows/AGENTS.md"
        )) as Linter.Config | undefined;
        const rootConfig = (await eslint.calculateConfigForFile(
            "AGENTS.md"
        )) as Linter.Config | undefined;
        const workflowRule =
            workflowConfig?.rules?.["codex/max-agents-instruction-chain-bytes"];

        expect(
            Array.isArray(workflowRule) ? workflowRule[0] : workflowRule
        ).toBe(0);
        expect(
            isRuleEnabled(
                rootConfig?.rules?.["codex/max-agents-instruction-chain-bytes"]
            )
        ).toBe(true);
    });

    it("supports replacing and disabling the packaged Codex plugin", () => {
        expect.assertions(2);

        const localCodexPlugin = {
            configs: {
                "all-without-language-plugins": [
                    {
                        plugins: {
                            codex: { rules: {} },
                        },
                        rules: {
                            "codex/local-only": "error" as const,
                        },
                    },
                ],
            },
            rules: {},
        };
        const replacedConfig = createConfig({
            plugins: { codex: localCodexPlugin },
        });
        const disabledConfig = createConfig({ plugins: { codex: false } });

        expect(getRuleNames(replacedConfig)).toContain("codex/local-only");
        expect(getRuleNames(disabledConfig)).not.toContain("codex/local-only");
    });
});
