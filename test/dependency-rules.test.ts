import css from "@eslint/css";
import { ESLint, type Linter } from "eslint";
import stylelintPlugin from "eslint-plugin-stylelint-2";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { createConfig } from "../src/preset";

const fixtureWorkspaceRoot = fileURLToPath(
    new URL("fixtures/lint-smoke/workspace", import.meta.url)
);
const fixtureConfig = createConfig({
    rootDirectory: fixtureWorkspaceRoot,
    tsconfigPaths: ["./tsconfig.json"],
});
const fixtureTypeScriptProject = {
    files: ["**/*.{js,ts}"],
    languageOptions: {
        parserOptions: {
            project: "./tsconfig.json",
            projectService: false,
            tsconfigRootDir: fixtureWorkspaceRoot,
        },
    },
} satisfies Linter.Config;

// Filter execution without overriding the rule's inherited severity or options.
// This also keeps unrelated autofixers from changing the expected fixture output.
const createRuleFixtureESLint = (ruleName: string, shouldFix = false): ESLint =>
    new ESLint({
        cwd: fixtureWorkspaceRoot,
        fix: shouldFix,
        overrideConfig: [...fixtureConfig, fixtureTypeScriptProject],
        overrideConfigFile: true,
        ruleFilter: ({ ruleId }) => ruleId === ruleName,
    });

describe("dependency rule regressions", () => {
    it("executes the inherited generated-empty-object check with type information", async () => {
        expect.assertions(1);

        const eslint = createRuleFixtureESLint(
            "@typescript-eslint/no-generated-empty-object-type"
        );
        const results = await eslint.lintFiles([
            "src/generated-empty-object.invalid.ts",
        ]);

        expect(results.flatMap(({ messages }) => messages)).toMatchObject([
            {
                messageId: "noGeneratedEmptyObjectType",
                ruleId: "@typescript-eslint/no-generated-empty-object-type",
                severity: 2,
            },
        ]);
    });

    it("allows nonempty and unresolved generic type operations", async () => {
        expect.assertions(1);

        const eslint = createRuleFixtureESLint(
            "@typescript-eslint/no-generated-empty-object-type"
        );
        const results = await eslint.lintFiles([
            "src/generated-empty-object.valid.ts",
        ]);

        expect(results.flatMap(({ messages }) => messages)).toStrictEqual([]);
    });

    it("warns about redundant JSDoc assertions in JavaScript source", async () => {
        expect.assertions(1);

        const eslint = createRuleFixtureESLint(
            "jsdoc/no-unnecessary-type-assertion"
        );
        const results = await eslint.lintFiles([
            "src/jsdoc-type-assertion.invalid.js",
        ]);

        expect(results.flatMap(({ messages }) => messages)).toMatchObject([
            {
                fix: { text: "42" },
                ruleId: "jsdoc/no-unnecessary-type-assertion",
                severity: 1,
            },
        ]);
    });

    it("removes redundant JSDoc assertions and produces clean JavaScript", async () => {
        expect.assertions(2);

        const eslint = createRuleFixtureESLint(
            "jsdoc/no-unnecessary-type-assertion",
            true
        );
        const results = await eslint.lintFiles([
            "src/jsdoc-type-assertion.invalid.js",
        ]);

        expect(results[0]?.output).toBe("export const count = 42;\n");
        expect(results.flatMap(({ messages }) => messages)).toStrictEqual([]);
    });

    it("preserves JSDoc tuple types and const assertions", async () => {
        expect.assertions(2);

        const eslint = createRuleFixtureESLint(
            "jsdoc/no-unnecessary-type-assertion",
            true
        );
        const results = await eslint.lintFiles([
            "src/jsdoc-type-assertion.valid.js",
        ]);

        expect(results.flatMap(({ messages }) => messages)).toStrictEqual([]);
        expect(results[0]?.output).toBeUndefined();
    });

    it("shares one CSS language plugin without mutating the Stylelint preset", () => {
        expect.assertions(4);

        const upstreamConfigs: readonly Linter.Config[] = [
            stylelintPlugin.configs.all,
        ].flat();
        const upstreamCssConfig = upstreamConfigs.find(
            (config) => config.plugins?.["css"] !== undefined
        );
        const upstreamCssPlugin = upstreamCssConfig?.plugins?.["css"];
        const sharedConfig = createConfig();
        const bridgeConfig = sharedConfig.find(
            (config) => config.name === upstreamCssConfig?.name
        );

        expect(upstreamCssConfig).toMatchObject({
            language: "css/css",
            name: "stylelint2:stylelintOnly",
        });
        expect(bridgeConfig).not.toBe(upstreamCssConfig);
        expect(upstreamCssConfig?.plugins?.["css"]).toBe(upstreamCssPlugin);
        expect(
            sharedConfig.flatMap((config) =>
                config.plugins?.["css"] === undefined
                    ? []
                    : [config.plugins["css"]]
            )
        ).toStrictEqual([css, css]);
    });

    it("lints CSS with the Stylelint bridge and detects equivalent keyframe selectors", async () => {
        expect.assertions(1);

        const eslint = createRuleFixtureESLint(
            "css/no-duplicate-keyframe-selectors"
        );
        const results = await eslint.lintFiles([
            "fixtures/css/duplicate-keyframes.css",
        ]);

        expect(results.flatMap(({ messages }) => messages)).toMatchObject([
            {
                messageId: "duplicateKeyframeSelector",
                ruleId: "css/no-duplicate-keyframe-selectors",
                severity: 2,
            },
        ]);
    });
});
