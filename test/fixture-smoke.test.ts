import { ESLint, type Linter } from "eslint";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { createConfig } from "../src/preset";

const fixtureWorkspaceRoot = fileURLToPath(
    new URL("fixtures/lint-smoke/workspace", import.meta.url)
);

const fixturePaths = [
    ".github/actions/cache/action.yml",
    ".github/agents/fixture.agent.md",
    ".github/workflow-templates/reusable.properties.json",
    ".github/workflows/ci.yml",
    ".pre-commit-config.yaml",
    ".remarkrc.mjs",
    ".spellcheck.yml",
    ".storybook/main.ts",
    ".tombi.toml",
    ".vscode/settings.json",
    "AGENTS.md",
    "app/page.tsx",
    "assets/js/site.js",
    "benchmarks/throughput.bench.ts",
    "checks/home.pw.ts",
    "components/Counter.vue",
    "components/Hero.astro",
    "components/Island.astro/script.ts",
    "config/settings.json",
    "config/settings.json5",
    "config/settings.jsonc",
    "config/site.toml",
    "config/tombi-compat.toml",
    "dependabot.yml",
    "docs/docusaurus/src/pages/index.tsx",
    "docs/feeds/feed.atom",
    "docs/feeds/feed.rss",
    "docs/guides/component.mdx",
    "docs/guides/intro.markdown",
    "docs/guides/legacy.markup",
    "docs/guides/readme.md",
    "e2e/home.e2e.ts",
    "eslint.config.mjs",
    "fixtures/css/valid.css",
    "fixtures/styles/layout.css",
    "functional/pipeline.ts",
    "nuxt.config.ts",
    "package.json",
    "pages/index.tsx",
    "playwright/home.spec.ts",
    "postcss.config.cjs",
    "preset.mjs",
    "rollup.config.fixture.mjs",
    "src/common.cjs",
    "src/component.jsx",
    "src/declarations.d.ts",
    "src/index.cts",
    "src/index.mts",
    "src/index.ts",
    "src/module.js",
    "src/module.mjs",
    "src/pages/dashboard.tsx",
    "src/view.tsx",
    "stories/Button.stories.tsx",
    "test/component.test.tsx",
    "test/sample.test.ts",
    "tsconfig.json",
    "vite.config.ts",
    "web/index.htm",
    "web/index.html",
    "web/index.xhtml",
    "widget.vue.ts",
] as const;

const forcedOptionalFrameworkRules = {
    files: [
        "app/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
        "pages/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
        "src/app/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
        "src/pages/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
    ],
    name: "Fixture smoke: force optional Next.js rules",
    rules: {
        "@next/next/google-font-display": "warn",
        "@next/next/google-font-preconnect": "warn",
        "@next/next/inline-script-id": "warn",
        "@next/next/next-script-for-ga": "warn",
        "@next/next/no-assign-module-variable": "warn",
        "@next/next/no-async-client-component": "warn",
        "@next/next/no-before-interactive-script-outside-document": "warn",
        "@next/next/no-css-tags": "warn",
        "@next/next/no-document-import-in-page": "warn",
        "@next/next/no-duplicate-head": "warn",
        "@next/next/no-head-element": "warn",
        "@next/next/no-head-import-in-document": "warn",
        "@next/next/no-html-link-for-pages": "warn",
        "@next/next/no-img-element": "warn",
        "@next/next/no-page-custom-font": "warn",
        "@next/next/no-script-component-in-head": "warn",
        "@next/next/no-styled-jsx-in-document": "warn",
        "@next/next/no-sync-scripts": "warn",
        "@next/next/no-title-in-document-head": "warn",
        "@next/next/no-typos": "warn",
        "@next/next/no-unwanted-polyfillio": "warn",
    },
} satisfies Linter.Config;

const forcedOptionalDocusaurusRules = {
    files: ["docs/docusaurus/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}"],
    name: "Fixture smoke: force optional Docusaurus rules",
    rules: {
        "@docusaurus/no-untranslated-text": "warn",
        "@docusaurus/string-literal-i18n-messages": "warn",
    },
} satisfies Linter.Config;

const fixtureTypeScriptProject = {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts,vue}"],
    languageOptions: {
        parserOptions: {
            extraFileExtensions: [".vue"],
            project: "./tsconfig.json",
            projectService: false,
            tsconfigRootDir: fixtureWorkspaceRoot,
        },
    },
    name: "Fixture smoke: explicit TypeScript project",
} satisfies Linter.Config;

const normalizeFixturePath = (filePath: string): string =>
    path.relative(fixtureWorkspaceRoot, filePath).replaceAll("\\", "/");

const getConfiguredPluginNames = (
    configEntries: readonly Linter.Config[]
): Set<string> => {
    const pluginNames = new Set<string>();

    for (const configEntry of configEntries) {
        const configPluginNames = Object.keys(configEntry.plugins ?? {});

        for (const pluginName of configPluginNames) {
            pluginNames.add(pluginName);
        }
    }

    return pluginNames;
};

const getMissingPluginNames = (
    expectedPluginNames: ReadonlySet<string>,
    actualPluginNames: ReadonlySet<string>
): string[] =>
    [...expectedPluginNames]
        .filter((pluginName) => !actualPluginNames.has(pluginName))
        .toSorted((left, right) => left.localeCompare(right));

const FIXTURE_SMOKE_TEST_TIMEOUT = 60_000;

describe("fixture smoke matrix", () => {
    it(
        "lints every configured fixture surface without parser or rule-loading failures",
        async () => {
            expect.assertions(4);

            const sharedConfig = createConfig({
                rootDirectory: fixtureWorkspaceRoot,
                tsconfigPaths: ["./tsconfig.json"],
            });

            const eslint = new ESLint({
                cwd: fixtureWorkspaceRoot,
                overrideConfig: [
                    ...sharedConfig,
                    forcedOptionalFrameworkRules,
                    forcedOptionalDocusaurusRules,
                    fixtureTypeScriptProject,
                ],
                overrideConfigFile: true,
            });

            const results = await eslint.lintFiles([...fixturePaths]);
            const lintedPaths = results.map((result) =>
                normalizeFixturePath(result.filePath)
            );
            const activePluginNames = new Set<string>();

            for (const fixturePath of fixturePaths) {
                const config = (await eslint.calculateConfigForFile(
                    fixturePath
                )) as Linter.Config | undefined;
                const configPluginNames = getConfiguredPluginNames(
                    config === undefined ? [] : [config]
                );

                for (const pluginName of configPluginNames) {
                    activePluginNames.add(pluginName);
                }
            }

            const fatalMessages = results.flatMap((result) =>
                result.messages
                    .filter((message) => message.fatal === true)
                    .map(
                        (message) =>
                            `${normalizeFixturePath(result.filePath)}:${String(message.line)}:${String(message.column)} ${message.message}`
                    )
            );
            const missingJsxA11yPeerMessages = results.flatMap((result) =>
                result.messages
                    .filter((message) =>
                        message.message.includes(
                            "need to install eslint-plugin-jsx-a11y"
                        )
                    )
                    .map(
                        (message) =>
                            `${normalizeFixturePath(result.filePath)}:${String(message.line)}:${String(message.column)} ${message.message}`
                    )
            );

            expect(new Set(lintedPaths)).toStrictEqual(new Set(fixturePaths));
            expect(
                getMissingPluginNames(
                    getConfiguredPluginNames(sharedConfig),
                    activePluginNames
                )
            ).toStrictEqual([]);
            expect(fatalMessages).toStrictEqual([]);
            expect(missingJsxA11yPeerMessages).toStrictEqual([]);
        },
        FIXTURE_SMOKE_TEST_TIMEOUT
    );
});
