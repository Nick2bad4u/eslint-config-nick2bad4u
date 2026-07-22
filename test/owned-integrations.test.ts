import { ESLint, type Linter } from "eslint";
import docusaurus2 from "eslint-plugin-docusaurus-2";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { createConfig, presets } from "../src/preset";

const fixtureWorkspaceRoot = fileURLToPath(
    new URL("fixtures/lint-smoke/workspace", import.meta.url)
);

const findConfigByName = (
    configEntries: readonly Linter.Config[],
    name: string
): Linter.Config | undefined =>
    configEntries.find((configEntry) => configEntry.name === name);

const getRuleNamesForPlugin = (
    configEntries: readonly Linter.Config[],
    pluginName: string
): string[] =>
    configEntries.flatMap((configEntry) =>
        Object.keys(configEntry.rules ?? {}).filter((ruleName) =>
            ruleName.startsWith(`${pluginName}/`)
        )
    );

const getRuleSeverity = (ruleConfig: unknown): unknown =>
    Array.isArray(ruleConfig) ? ruleConfig[0] : ruleConfig;

const getEffectiveRuleSeverity = (
    config: unknown,
    ruleName: string
): unknown => {
    if (typeof config !== "object" || config === null) {
        return undefined;
    }

    const rules: unknown = Reflect.get(config, "rules");
    if (typeof rules !== "object" || rules === null) {
        return undefined;
    }

    return getRuleSeverity(Reflect.get(rules, ruleName));
};

const createIntegrationConfig = () =>
    createConfig({
        plugins: {
            "file-progress": false,
            "file-progress-2": false,
            secretlint: false,
        },
        rootDirectory: fixtureWorkspaceRoot,
        sonarjs: false,
        tsconfigPaths: ["./tsconfig.json"],
    });

describe("owned Actionlint and Docusaurus integrations", () => {
    it("keeps GitHub Actions 2 enabled in the Actionlint opt-out", () => {
        expect.assertions(2);

        expect(
            getRuleNamesForPlugin(presets.withoutActionlint, "actionlint")
        ).toStrictEqual([]);
        expect(
            getRuleNamesForPlugin(presets.withoutActionlint, "github-actions")
                .length
        ).toBeGreaterThan(0);
    });

    it("uses owned Docusaurus rules with opt-in i18n defaults", () => {
        expect.assertions(5);

        const docusaurusConfig = findConfigByName(
            presets.all,
            "🦖 Docusaurus 2: Experimental: Includes All + Extra Rules"
        );
        const docusaurusRules = docusaurusConfig?.rules ?? {};

        expect(docusaurusRules["docusaurus-2/no-html-links"]).toBe("warn");
        expect(docusaurusRules["docusaurus-2/no-untranslated-text"]).toBe(
            "off"
        );
        expect(docusaurusRules["docusaurus-2/prefer-docusaurus-heading"]).toBe(
            "warn"
        );
        expect(
            docusaurusRules["docusaurus-2/string-literal-i18n-messages"]
        ).toBe("off");
        expect(
            Object.keys(docusaurusRules).filter((ruleName) =>
                ruleName.startsWith("@docusaurus/")
            )
        ).toStrictEqual([]);
    });

    it("scopes Actionlint rules to workflows and Actionlint config files", () => {
        expect.assertions(4);

        const workflowConfig = findConfigByName(
            presets.all,
            "actionlint:actionlintOnly"
        );
        const configurationConfig = findConfigByName(
            presets.all,
            "actionlint:configuration"
        );

        expect(workflowConfig?.files).toStrictEqual([
            ".github/workflows/**/*.{yml,yaml}",
        ]);
        expect(workflowConfig?.rules?.["actionlint/actionlint"]).toBe("error");
        expect(configurationConfig?.files).toStrictEqual([
            "**/.github/actionlint.{yml,yaml}",
            "**/actionlint.{yml,yaml}",
            "**/ActionLintConfig.{yml,yaml}",
        ]);
        expect(
            Object.keys(configurationConfig?.rules ?? {}).every((ruleName) =>
                ruleName.startsWith("actionlint/")
            )
        ).toBe(true);
    });

    it("runs the owned Actionlint bridge for valid and invalid workflows", async () => {
        expect.assertions(2);

        const eslint = new ESLint({
            cwd: fixtureWorkspaceRoot,
            overrideConfig: createIntegrationConfig(),
            overrideConfigFile: true,
        });
        const [validResult, invalidResult] = await eslint.lintFiles([
            ".github/workflows/ci.yml",
            ".github/workflows/invalid.yml",
        ]);
        const getActionlintMessages = (
            result: typeof validResult | undefined
        ) =>
            result?.messages.filter(
                (message) => message.ruleId === "actionlint/actionlint"
            ) ?? [];

        expect(getActionlintMessages(validResult)).toStrictEqual([]);
        expect(getActionlintMessages(invalidResult).length).toBeGreaterThan(0);
    }, 120_000);

    it("reports each owned default Docusaurus diagnostic once", async () => {
        expect.assertions(2);

        const eslint = new ESLint({
            cwd: fixtureWorkspaceRoot,
            overrideConfig: createIntegrationConfig(),
            overrideConfigFile: true,
        });
        const [result] = await eslint.lintFiles([
            "docs/docusaurus/src/pages/index.tsx",
        ]);
        const docusaurusMessages =
            result?.messages.filter(
                (message) =>
                    message.ruleId?.startsWith("docusaurus-2/") === true
            ) ?? [];

        expect(
            docusaurusMessages
                .filter((message) =>
                    [
                        "docusaurus-2/no-html-links",
                        "docusaurus-2/prefer-docusaurus-heading",
                    ].includes(message.ruleId ?? "")
                )
                .map(({ ruleId, severity }) => ({ ruleId, severity }))
        ).toStrictEqual([
            {
                ruleId: "docusaurus-2/prefer-docusaurus-heading",
                severity: 1,
            },
            { ruleId: "docusaurus-2/no-html-links", severity: 1 },
        ]);
        expect(
            docusaurusMessages.filter((message) =>
                [
                    "docusaurus-2/no-untranslated-text",
                    "docusaurus-2/string-literal-i18n-messages",
                ].includes(message.ruleId ?? "")
            )
        ).toStrictEqual([]);
    });

    it("supports explicit Docusaurus i18n config composition", async () => {
        expect.assertions(3);

        const eslint = new ESLint({
            cwd: fixtureWorkspaceRoot,
            overrideConfig: [
                ...createIntegrationConfig(),
                docusaurus2.configs.i18n,
            ],
            overrideConfigFile: true,
        });
        const fixtureFile = "docs/docusaurus/src/pages/index.tsx" as const;
        const effectiveConfig =
            await eslint.calculateConfigForFile(fixtureFile);
        const [result] = await eslint.lintFiles([fixtureFile]);
        const hasUntranslatedTextDiagnostic =
            result?.messages.some(
                (message) =>
                    message.ruleId === "docusaurus-2/no-untranslated-text"
            ) ?? false;

        expect(
            getEffectiveRuleSeverity(
                effectiveConfig,
                "docusaurus-2/no-untranslated-text"
            )
        ).toBe(2);
        expect(
            getEffectiveRuleSeverity(
                effectiveConfig,
                "docusaurus-2/string-literal-i18n-messages"
            )
        ).toBe(2);
        expect(hasUntranslatedTextDiagnostic).toBe(true);
    });
});
