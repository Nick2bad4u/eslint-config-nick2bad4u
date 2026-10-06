import css from "@eslint/css";
import { ESLint, type Linter } from "eslint";
import cssicorn from "eslint-cssicorn";
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
const createRuleFixtureESLint = (
    ruleName: string,
    shouldFix = false,
    additionalConfig: readonly Linter.Config[] = []
): ESLint =>
    new ESLint({
        cwd: fixtureWorkspaceRoot,
        fix: shouldFix,
        overrideConfig: [
            ...fixtureConfig,
            fixtureTypeScriptProject,
            ...additionalConfig,
        ],
        overrideConfigFile: true,
        ruleFilter: ({ ruleId }) => ruleId === ruleName,
    });

// These inline Playwright examples exercise syntax-only rules and need no project.
const inlinePlaywrightConfig = [
    {
        files: ["playwright/**/*.ts"],
        languageOptions: {
            parserOptions: { project: false, projectService: false },
        },
    },
] satisfies Linter.Config[];

const cssicornFixtures = [
    ["cssicorn/lowercase", "a { COLOR: red; }"],
    ["cssicorn/no-deprecated-features", "a { color: ButtonHighlight; }"],
    [
        "cssicorn/no-duplicate-font-family-names",
        "a { font-family: Arial, Arial; }",
    ],
    ["cssicorn/no-duplicate-properties", "a { color: red; color: red; }"],
    ["cssicorn/no-duplicate-selectors", "a { color: red; } a { color: blue; }"],
    [
        "cssicorn/no-invalid-media-features",
        "@media (widht: 2px) { a { color: red; } }",
    ],
    [
        "cssicorn/no-nesting-with-mixed-specificity",
        "#a, .b { & span { color: red; } }",
    ],
    ["cssicorn/no-redundant-nested-style-rules", "a { & { color: red; } }"],
    ["cssicorn/no-redundant-shorthand-values", "a { margin: 1px 1px; }"],
    ["cssicorn/no-unknown-annotations", "a { color: red !imprtant; }"],
    ["cssicorn/no-unknown-pseudo-selectors", ".button:hovre { color: red; }"],
    ["cssicorn/no-unscoped-nesting-selector", "& { color: red; }"],
    ["cssicorn/no-zero-length-unit", "a { margin: 0px; }"],
    ["cssicorn/prefer-explicit-viewport-units", "a { height: 100vh; }"],
    [
        "cssicorn/prefer-media-feature-range-syntax",
        "@media (min-width: 600px) { a { color: red; } }",
    ],
    ["cssicorn/prefer-modern-syntax", "a:before { color: red; }"],
    [
        "cssicorn/require-property-descriptors",
        '@property --brand { syntax: "<color>"; inherits: false; }',
    ],
] as const;

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

    it.each([
        "src/jsdoc-type-assertion.valid.js",
        "src/generated-empty-object.valid.ts",
    ])("keeps CSS-only rules out of the config for %s", async (filePath) => {
        expect.assertions(1);

        const eslint = createRuleFixtureESLint(
            "cssicorn/no-invalid-media-features"
        );
        const results = await eslint.lintFiles([filePath]);

        expect(results.flatMap(({ messages }) => messages)).toStrictEqual([]);
    });

    it("enables the selected CSSicorn warnings for stylesheets", async () => {
        expect.assertions(1);

        const eslint = createRuleFixtureESLint(
            "cssicorn/no-invalid-media-features"
        );
        const config: unknown = await eslint.calculateConfigForFile(
            "fixtures/css/duplicate-keyframes.css"
        );

        expect(config).toMatchObject({
            language: css.languages.css,
            rules: Object.fromEntries(
                cssicornFixtures.map(([ruleName]) => [
                    ruleName,
                    expect.objectContaining({ 0: 1 }),
                ])
            ),
        });
    });

    it("explicitly configures every installed CSSicorn rule for stylesheets", async () => {
        expect.assertions(2);

        const eslint = createRuleFixtureESLint("cssicorn/lowercase");
        const config: unknown = await eslint.calculateConfigForFile(
            "fixtures/css/valid.css"
        );
        const ruleNames = Object.keys(cssicorn.rules ?? {});

        expect(ruleNames.length).toBeGreaterThan(0);
        expect(config).toMatchObject({
            rules: Object.fromEntries(
                ruleNames.map((ruleName) => [
                    `cssicorn/${ruleName}`,
                    expect.objectContaining({ 0: expect.any(Number) }),
                ])
            ),
        });
    });

    it.each(cssicornFixtures)(
        "executes the inherited %s warning",
        async (ruleName, code) => {
            expect.assertions(2);

            const eslint = createRuleFixtureESLint(ruleName);
            const invalidResults = await eslint.lintText(code, {
                filePath: "fixtures/css/dependency-rules.css",
            });
            const validResults = await eslint.lintText(
                ".button:hover { color: red; font-family: Arial, sans-serif; height: 100dvh; }",
                { filePath: "fixtures/css/dependency-rules.css" }
            );

            expect(
                invalidResults.flatMap(({ messages }) => messages)
            ).toMatchObject([{ ruleId: ruleName, severity: 1 }]);
            expect(
                validResults.flatMap(({ messages }) => messages)
            ).toStrictEqual([]);
        }
    );

    it.each([
        [
            "cssicorn/lowercase",
            ".Button { COLOR: RED; --Brand: red; animation-name: FadeIn; }",
            ".Button { color: red; --Brand: red; animation-name: FadeIn; }",
        ],
        [
            "cssicorn/no-redundant-shorthand-values",
            ".button { margin: 1px 2px 1px 2px; }",
            ".button { margin: 1px 2px; }",
        ],
        [
            "cssicorn/no-zero-length-unit",
            ".button { margin: 0px; transform: translateX(0rem); }",
            ".button { margin: 0; transform: translateX(0); }",
        ],
        [
            "cssicorn/prefer-modern-syntax",
            ".button:before { color: rgba(0, 0, 0, .5); }",
            ".button::before { color: rgb(0 0 0 / 50%); }",
        ],
    ])("safely fixes inherited %s warnings", async (ruleName, code, output) => {
        expect.assertions(2);

        const eslint = createRuleFixtureESLint(ruleName, true);
        const results = await eslint.lintText(code, {
            filePath: "fixtures/css/dependency-rules.css",
        });

        expect(results[0]?.output).toBe(output);
        expect(results.flatMap(({ messages }) => messages)).toStrictEqual([]);
    });

    it.each([
        [
            "cssicorn/lowercase",
            '.Button { --Brand: red; color: var(--Brand); animation-name: FadeIn; font-family: "MyFont"; } @keyframes FadeIn { to { opacity: 0; } }',
        ],
        [
            "cssicorn/no-duplicate-properties",
            ".button { display: block; display: grid; --Brand: red; --brand: blue; }",
        ],
        [
            "cssicorn/no-redundant-shorthand-values",
            ".button { margin: var(--space) var(--space); padding: 1px 2px 3px 4px; }",
        ],
        [
            "cssicorn/no-zero-length-unit",
            ".button { width: calc(0px + 1px); --space: 0px; flex: 0px; line-height: 0px; transition-duration: 0s; } :export { spacing: 0px; }",
        ],
        [
            "cssicorn/prefer-modern-syntax",
            ".button { color: rgba(var(--rgb), var(--alpha, 1)); } :export { color: rgba(0, 0, 0, .5); }",
        ],
        [
            "cssicorn/require-property-descriptors",
            '@property --brand { syntax: "<color>"; inherits: false; initial-value: red; } @property --tokens { syntax: " * "; inherits: false; }',
        ],
    ])(
        "preserves supported CSS patterns through %s",
        async (ruleName, code) => {
            expect.assertions(2);

            const eslint = createRuleFixtureESLint(ruleName, true);
            const results = await eslint.lintText(code, {
                filePath: "fixtures/css/dependency-rules.css",
            });

            expect(results.flatMap(({ messages }) => messages)).toStrictEqual(
                []
            );
            expect(results[0]?.output).toBeUndefined();
        }
    );

    it.each([
        [
            "cssicorn/no-redundant-longhand-properties",
            ".button { overflow: hidden; overflow-x: clip; overflow-y: clip; }",
        ],
        [
            "cssicorn/no-self-referencing-custom-properties",
            ".button { --base: 1px; --space: var(--base, var(--space)); }",
        ],
        [
            "cssicorn/no-unknown-animations",
            '@import "animations.css"; .button { animation: fade 1s ease; }',
        ],
        ["cssicorn/prefer-short-hex-color", ".button { color: #ffffff; }"],
    ])("leaves incompatible %s checks disabled", async (ruleName, code) => {
        expect.assertions(2);

        const eslint = createRuleFixtureESLint(ruleName, true);
        const results = await eslint.lintText(code, {
            filePath: "fixtures/css/dependency-rules.css",
        });

        expect(results.flatMap(({ messages }) => messages)).toStrictEqual([]);
        expect(results[0]?.output).toBeUndefined();
    });

    it("allows CSS Modules selectors while warning about pseudo-selector typos", async () => {
        expect.assertions(1);

        const eslint = createRuleFixtureESLint(
            "cssicorn/no-unknown-pseudo-selectors"
        );
        const results = await eslint.lintText(
            ":local(.button) { color: red; } :global(.link) { color: blue; } .button:hovre { color: green; }",
            { filePath: "fixtures/css/selectors.module.css" }
        );

        expect(results.flatMap(({ messages }) => messages)).toMatchObject([
            { ruleId: "cssicorn/no-unknown-pseudo-selectors", severity: 1 },
        ]);
    });

    it("fixes inherited media range warnings into clean CSS", async () => {
        expect.assertions(2);

        const eslint = createRuleFixtureESLint(
            "cssicorn/prefer-media-feature-range-syntax",
            true
        );
        const results = await eslint.lintText(
            "@media (min-width: 600px) { .button { color: red; } }",
            { filePath: "fixtures/css/media.css" }
        );

        expect(results[0]?.output).toBe(
            "@media (width >= 600px) { .button { color: red; } }"
        );
        expect(results.flatMap(({ messages }) => messages)).toStrictEqual([]);
    });

    it.each([
        [
            "unicorn/no-empty-link-text",
            "[](https://example.com)",
            "no-empty-link-text",
        ],
        [
            "unicorn/no-empty-link-text",
            "[![](badge.svg)](https://example.com)",
            "no-empty-link-text",
        ],
        [
            "unicorn/no-javascript-url",
            "[Open](JavaScript:alert%281%29)",
            "no-javascript-url",
        ],
        [
            "unicorn/no-javascript-url",
            "[Open][target]\n\n[target]: java&#x73;cript:alert%281%29",
            "no-javascript-url",
        ],
    ])("warns through %s for %s", async (ruleName, code, messageId) => {
        expect.assertions(1);

        const eslint = createRuleFixtureESLint(ruleName);
        const results = await eslint.lintText(code, {
            filePath: "docs/guides/dependency-rules.md",
        });

        expect(results.flatMap(({ messages }) => messages)).toMatchObject([
            { messageId, ruleId: ruleName, severity: 1 },
        ]);
    });

    it.each(["unicorn/no-empty-link-text", "unicorn/no-javascript-url"])(
        "allows accessible links and literal examples through %s",
        async (ruleName) => {
            expect.assertions(1);

            const eslint = createRuleFixtureESLint(ruleName);
            const results = await eslint.lintText(
                "[![Build status](badge.svg)](https://example.com)\n\n`[](javascript:alert%281%29)`",
                { filePath: "docs/guides/dependency-rules.md" }
            );

            expect(results.flatMap(({ messages }) => messages)).toStrictEqual(
                []
            );
        }
    );

    it("retains the separate Markdown destination warning", async () => {
        expect.assertions(1);

        const eslint = createRuleFixtureESLint("markdown/no-empty-links");
        const results = await eslint.lintText("[Visible label]()", {
            filePath: "docs/guides/dependency-rules.md",
        });

        expect(results.flatMap(({ messages }) => messages)).toMatchObject([
            {
                messageId: "emptyLink",
                ruleId: "markdown/no-empty-links",
                severity: 1,
            },
        ]);
    });

    it.each([
        [
            "config/precision.json",
            '{"value": 1.23456789012345678}',
            '{"value": 0.1}',
        ],
        [
            "config/precision.json5",
            "{value: 1.23456789012345678}",
            "{value: 0.30000000000000004}",
        ],
        [
            "config/precision.toml",
            "value = 1_234.567_890_123_456_78",
            "integer = 9007199254740993\nvalue = 0.1",
        ],
    ])(
        "checks written numeric precision in %s",
        async (filePath, invalidCode, validCode) => {
            expect.assertions(2);

            const eslint = createRuleFixtureESLint(
                "unicorn/no-loss-of-precision"
            );
            const invalidResults = await eslint.lintText(invalidCode, {
                filePath,
            });
            const validResults = await eslint.lintText(validCode, { filePath });

            expect(
                invalidResults.flatMap(({ messages }) => messages)
            ).toMatchObject([
                {
                    messageId: "no-loss-of-precision",
                    ruleId: "unicorn/no-loss-of-precision",
                    severity: 2,
                },
            ]);
            expect(
                validResults.flatMap(({ messages }) => messages)
            ).toStrictEqual([]);
        }
    );

    it("retains JSON interchange checks beyond literal rounding", async () => {
        expect.assertions(1);

        const eslint = createRuleFixtureESLint("json/no-unsafe-values");
        const results = await eslint.lintText(
            '{"integer": 9007199254740992, "subnormal": 5e-324}',
            { filePath: "config/precision.json" }
        );

        expect(results.flatMap(({ messages }) => messages)).toMatchObject([
            {
                messageId: "unsafeInteger",
                ruleId: "json/no-unsafe-values",
                severity: 2,
            },
            {
                messageId: "subnormal",
                ruleId: "json/no-unsafe-values",
                severity: 2,
            },
        ]);
    });

    it.each([
        ["config/settings.jsonc", '{"value": 1.23456789012345678}'],
        [
            "package.json",
            '{"name": "precision-fixture", "value": 1.23456789012345678}',
        ],
        ["config/settings.yaml", "value: 1.23456789012345678"],
        ["src/module.js", "export const value = 1.23456789012345678;"],
    ])(
        "keeps unsupported Unicorn numeric checks out of %s",
        async (filePath, code) => {
            expect.assertions(1);

            const eslint = createRuleFixtureESLint(
                "unicorn/no-loss-of-precision"
            );
            const results = await eslint.lintText(code, { filePath });

            expect(results.flatMap(({ messages }) => messages)).toStrictEqual(
                []
            );
        }
    );

    it("retains the core JavaScript precision error", async () => {
        expect.assertions(1);

        const eslint = createRuleFixtureESLint("no-loss-of-precision");
        const results = await eslint.lintText(
            "export const value = 9007199254740993;",
            { filePath: "src/module.js" }
        );

        expect(results.flatMap(({ messages }) => messages)).toMatchObject([
            {
                messageId: "noLossOfPrecision",
                ruleId: "no-loss-of-precision",
                severity: 2,
            },
        ]);
    });

    it.each(["latest", "next"])(
        "warns about the moving dependency tag %s while allowing version ranges",
        async (tag) => {
            expect.assertions(1);

            const eslint = createRuleFixtureESLint(
                "package-json/restrict-dist-tags"
            );
            const results = await eslint.lintText(
                JSON.stringify({
                    dependencies: { stable: "^1.2.3", unstable: tag },
                    devDependencies: { prerelease: "^2.0.0-beta.1" },
                }),
                { filePath: "package.json" }
            );

            expect(results.flatMap(({ messages }) => messages)).toMatchObject([
                { ruleId: "package-json/restrict-dist-tags", severity: 1 },
            ]);
        }
    );

    it.each([
        "playwright/no-action-timeout",
        "playwright/no-template-literal-title",
        "playwright/no-test-return-statement",
        "playwright/prefer-ending-with-an-expect",
    ])("permits supported Playwright patterns through %s", async (ruleName) => {
        expect.assertions(1);

        const eslint = createRuleFixtureESLint(
            ruleName,
            false,
            inlinePlaywrightConfig
        );
        const results = await eslint.lintText(
            `import { test } from "@playwright/test"; const role = "admin"; test(\`supports \${role}\`, async ({ page }) => { return page.click("button", { timeout: 5000 }); });`,
            { filePath: "playwright/policy.spec.ts" }
        );

        expect(results.flatMap(({ messages }) => messages)).toStrictEqual([]);
    });

    it("warns about repeated magic timeouts while allowing one-off values", async () => {
        expect.assertions(1);

        const eslint = createRuleFixtureESLint(
            "playwright/no-magic-timeouts",
            false,
            inlinePlaywrightConfig
        );
        const results = await eslint.lintText(
            'import { test } from "@playwright/test"; test("timeouts", async ({ page }) => { test.setTimeout(30000); await page.click("button", { timeout: 5000 }); await page.fill("input", "value", { timeout: 5000 }); });',
            { filePath: "playwright/timeouts.spec.ts" }
        );

        expect(results.flatMap(({ messages }) => messages)).toMatchObject([
            { ruleId: "playwright/no-magic-timeouts", severity: 1 },
            { ruleId: "playwright/no-magic-timeouts", severity: 1 },
        ]);
    });

    it("allows exported Playwright fixtures while warning on exported tests", async () => {
        expect.assertions(2);

        const eslint = createRuleFixtureESLint(
            "playwright/no-export",
            false,
            inlinePlaywrightConfig
        );
        const validResults = await eslint.lintText(
            'import { test as base } from "@playwright/test"; export const test = base.extend({});',
            { filePath: "playwright/fixtures.ts" }
        );
        const invalidResults = await eslint.lintText(
            'import { test } from "@playwright/test"; export const name = "example"; test(name, async () => {});',
            { filePath: "playwright/export.spec.ts" }
        );

        expect(validResults.flatMap(({ messages }) => messages)).toStrictEqual(
            []
        );
        expect(
            invalidResults.flatMap(({ messages }) => messages)
        ).toMatchObject([{ ruleId: "playwright/no-export", severity: 1 }]);
    });

    it("requires reasons for Playwright annotations", async () => {
        expect.assertions(1);

        const eslint = createRuleFixtureESLint(
            "playwright/require-annotation-reason",
            false,
            inlinePlaywrightConfig
        );
        const results = await eslint.lintText(
            'import { test } from "@playwright/test"; test("annotations", async () => { test.skip(true, "Unsupported on this platform"); test.fixme(true); });',
            { filePath: "playwright/annotations.spec.ts" }
        );

        expect(results.flatMap(({ messages }) => messages)).toMatchObject([
            { ruleId: "playwright/require-annotation-reason", severity: 1 },
        ]);
    });
});
