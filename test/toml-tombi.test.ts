import { ESLint, type Linter } from "eslint";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { createConfig, presets } from "../src/preset";

const fixtureWorkspaceRoot = fileURLToPath(
    new URL("fixtures/lint-smoke/workspace", import.meta.url)
);

const compatibleTomlRules = [
    "toml/array-bracket-spacing",
    "toml/comma-style",
    "toml/inline-table-curly-newline",
    "toml/inline-table-curly-spacing",
    "toml/inline-table-key-value-newline",
    "toml/no-mixed-type-in-array",
    "toml/no-non-decimal-integer",
    "toml/no-space-dots",
    "toml/no-unreadable-number-separator",
    "toml/padding-line-between-tables",
    "toml/precision-of-fractional-seconds",
    "toml/precision-of-integer",
    "toml/quoted-keys",
    "toml/spaced-comment",
    "toml/table-bracket-spacing",
    "toml/vue-custom-block/no-parsing-error",
] as const;

const conflictingOrDuplicateTomlRules = [
    "toml/array-bracket-newline",
    "toml/array-element-newline",
    "toml/indent",
    "toml/key-spacing",
    "toml/keys-order",
    "toml/padding-line-between-pairs",
    "toml/tables-order",
] as const;

const tombiAllRules = [
    "tombi/disallow-tombi-empty-files-exclude",
    "tombi/disallow-tombi-empty-files-include",
    "tombi/disallow-tombi-unknown-config-properties",
    "tombi/prefer-tombi-builtin-schema-catalog",
    "tombi/prefer-tombi-files-include-array",
    "tombi/require-tombi-config-file-naming-convention",
    "tombi/require-tombi-valid-lint-rule-levels",
    "tombi/tombi",
] as const;

const externalToolTomlFixtures = [
    {
        code: "max_concurrency = 16\n",
        filePath: "lychee.toml",
    },
    {
        code: '[changelog]\n    body = ""\n',
        filePath: "cliff.toml",
    },
    {
        code: 'title = "fixture"\n',
        filePath: ".gitleaks.toml",
    },
    {
        code: 'toml-version = "v1.1.0"\n\n[files]\n    include = [ "**/*.toml" ]\n',
        filePath: ".tombi.toml",
    },
] as const;

const isNonArrayObject = (
    value: unknown
): value is Record<PropertyKey, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const isRuleEnabled = (ruleConfig: unknown): boolean => {
    const severity = Array.isArray(ruleConfig) ? ruleConfig[0] : ruleConfig;

    return severity !== "off" && severity !== 0;
};

const getRules = (
    config: Linter.Config | undefined
): Readonly<Record<string, unknown>> => config?.rules ?? {};

describe("toml and Tombi config", () => {
    it("keeps Tombi as the TOML policy owner while retaining compatible toml rules", async () => {
        expect.assertions(5);

        const eslint = new ESLint({
            cwd: fixtureWorkspaceRoot,
            overrideConfig: createConfig({
                rootDirectory: fixtureWorkspaceRoot,
                tsconfigPaths: ["./tsconfig.json"],
            }),
            overrideConfigFile: true,
        });
        const config = (await eslint.calculateConfigForFile(
            "config/site.toml"
        )) as Linter.Config | undefined;
        const parserOptions = config?.languageOptions?.["parserOptions"];
        const rules = getRules(config);

        expect(
            isNonArrayObject(parserOptions)
                ? parserOptions["tomlVersion"]
                : undefined
        ).toBe("1.1.0");
        expect(
            compatibleTomlRules.filter(
                (ruleName) => !isRuleEnabled(rules[ruleName])
            )
        ).toStrictEqual([]);
        expect(
            conflictingOrDuplicateTomlRules.filter((ruleName) =>
                isRuleEnabled(rules[ruleName])
            )
        ).toStrictEqual([]);
        expect(
            tombiAllRules.filter((ruleName) => !isRuleEnabled(rules[ruleName]))
        ).toStrictEqual([]);
        expect(Object.keys(config?.plugins ?? {})).toStrictEqual(
            expect.arrayContaining(["tombi", "toml"])
        );
    });

    it("can lint TOML fixtures with Tombi all rules enabled", async () => {
        expect.assertions(1);

        const eslint = new ESLint({
            cwd: fixtureWorkspaceRoot,
            overrideConfig: createConfig({
                rootDirectory: fixtureWorkspaceRoot,
                tsconfigPaths: ["./tsconfig.json"],
            }),
            overrideConfigFile: true,
        });
        const results = await eslint.lintFiles([
            "config/site.toml",
            "config/tombi-compat.toml",
        ]);

        expect(
            results.flatMap((result) =>
                result.messages.map(
                    (message) =>
                        `${result.filePath}:${String(message.line)}:${String(message.column)} ${message.ruleId ?? "fatal"} ${message.message}`
                )
            )
        ).toStrictEqual([]);
    });

    it("lints external-tool TOML configs with Tombi enabled", async () => {
        expect.assertions(2);

        const eslint = new ESLint({
            cwd: fixtureWorkspaceRoot,
            overrideConfig: createConfig({
                plugins: { secretlint: false },
                rootDirectory: fixtureWorkspaceRoot,
                tsconfigPaths: ["./tsconfig.json"],
            }),
            overrideConfigFile: true,
        });
        const toolConfigResults = await Promise.all(
            externalToolTomlFixtures.map(async ({ code, filePath }) => {
                const config = (await eslint.calculateConfigForFile(
                    filePath
                )) as Linter.Config | undefined;
                const lintResults = await eslint.lintText(code, { filePath });

                return {
                    filePath,
                    lintResults,
                    tombiEnabled: isRuleEnabled(config?.rules?.["tombi/tombi"]),
                } as const;
            })
        );

        expect(
            toolConfigResults.map(({ filePath, tombiEnabled }) => [
                filePath,
                tombiEnabled,
            ])
        ).toStrictEqual(
            externalToolTomlFixtures.map(({ filePath }) => [filePath, true])
        );
        expect(
            toolConfigResults.flatMap(({ lintResults }) =>
                lintResults.flatMap((result) =>
                    result.messages.map(
                        (message) =>
                            `${result.filePath}:${String(message.line)}:${String(message.column)} ${message.ruleId ?? "fatal"} ${message.message}`
                    )
                )
            )
        ).toStrictEqual([]);
    });

    it("exposes a withoutTombi preset", () => {
        expect.assertions(2);

        const allRuleNames = new Set(
            presets.all.flatMap((config) => Object.keys(config.rules ?? {}))
        );
        const ruleNamesWithoutTombi = new Set(
            presets.withoutTombi.flatMap((config) =>
                Object.keys(config.rules ?? {})
            )
        );

        expect(
            [...allRuleNames].some((ruleName) => ruleName.startsWith("tombi/"))
        ).not.toBe(false);
        expect(
            [...ruleNamesWithoutTombi].filter((ruleName) =>
                ruleName.startsWith("tombi/")
            )
        ).toStrictEqual([]);
    });
});
