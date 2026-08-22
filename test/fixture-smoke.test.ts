import { ESLint, type Linter } from "eslint";
import { readdirSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { createConfig } from "../src/preset";

const fixtureWorkspaceRoot = fileURLToPath(
    new URL("fixtures/lint-smoke/workspace", import.meta.url)
);

const fixturePaths = [
    ".codex/config.toml",
    ".codex/hooks.json",
    ".github/actionlint.yaml",
    ".github/actions/cache/action.yml",
    ".github/agents/fixture.agent.md",
    ".github/hooks/pre-commit.json",
    ".github/workflow-templates/reusable.properties.json",
    ".github/workflows/AGENTS.md",
    ".github/workflows/ci.yml",
    ".github/workflows/invalid.yml",
    ".github/workflows/release-caller.yml",
    ".pre-commit-config.yaml",
    ".remarkrc.mjs",
    ".secretlintrc.json",
    ".spellcheck.yml",
    ".storybook/main.ts",
    ".tombi.toml",
    ".vscode/settings.json",
    ".yamllint",
    "ActionLintConfig.yaml",
    "AGENTS.md",
    "app/page.tsx",
    "assets/js/site.js",
    "benchmarks/throughput.bench.ts",
    "checks/home.pw.ts",
    "components/Island.astro/script.js",
    "components/Island.astro/script.ts",
    "config/settings.json",
    "config/settings.json5",
    "config/settings.jsonc",
    "config/site.toml",
    "config/tombi-compat.toml",
    "dependabot.yml",
    "docs/docusaurus/content/guide.md",
    "docs/docusaurus/src/pages/index.tsx",
    "docs/feeds/feed.atom",
    "docs/feeds/feed.rss",
    "docs/guides/code-block.md",
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
    "packages/jest/test/sample.test.ts",
    "pages/index.tsx",
    "playwright/home.spec.ts",
    "postcss.config.cjs",
    "preset.mjs",
    "rollup.config.fixture.mjs",
    "src/__snapshots__/example.md",
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
    "stylelint.config.mjs",
    "test/component.test.tsx",
    "test/sample.test.ts",
    "tsconfig.json",
    "vite.config.ts",
    "web/index.htm",
    "web/index.html",
    "web/index.xhtml",
    "widget.vue.ts",
] as const;

const intentionallyExcludedFixturePaths = [
    ".gitignore",
    // Astro and Vue.js integrations are temporarily disabled.
    // Consumers must add local flat configs before linting these components.
    "components/Counter.vue",
    "components/Hero.astro",
    // These files form the intentionally invalid No Barrel Files fixtures and
    // are covered by focused regressions instead of the general smoke matrix.
    "src/barrel-consumer.js",
    "src/barrel.ts",
    "src/javascript-barrel.js",
    "src/javascript-source.js",
] as const;

const FIXTURE_SCOPE_SETTING_PREFIX = "__fixture-scope:";

const fixtureTypeScriptProject = {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}"],
    languageOptions: {
        parserOptions: {
            project: "./tsconfig.json",
            projectService: false,
            tsconfigRootDir: fixtureWorkspaceRoot,
        },
    },
    name: "Fixture smoke: explicit TypeScript project",
} satisfies Linter.Config;

const normalizeFixturePath = (filePath: string): string =>
    path.relative(fixtureWorkspaceRoot, filePath).replaceAll("\\", "/");

const getFixtureWorkspaceFiles = (directory: string): string[] =>
    readdirSync(directory, { withFileTypes: true }).flatMap(
        (directoryEntry) => {
            const filePath = path.join(directory, directoryEntry.name);

            return directoryEntry.isDirectory()
                ? getFixtureWorkspaceFiles(filePath)
                : [normalizeFixturePath(filePath)];
        }
    );

const instrumentFileScopedConfigs = (
    configEntries: readonly Linter.Config[]
): Linter.Config[] =>
    configEntries.map((configEntry, configIndex) =>
        configEntry.files === undefined
            ? configEntry
            : {
                  ...configEntry,
                  settings: {
                      ...configEntry.settings,
                      [`${FIXTURE_SCOPE_SETTING_PREFIX}${String(configIndex)}`]: true,
                  },
              }
    );

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

const getEnabledRulePluginNames = (config: Linter.Config): Set<string> => {
    const configuredPluginNames = Object.keys(config.plugins ?? {}).toSorted(
        (left, right) => right.length - left.length
    );
    const enabledRulePluginNames = new Set<string>();
    const rules = config.rules;

    if (rules === undefined) {
        return enabledRulePluginNames;
    }

    for (const [ruleName, ruleConfig] of Object.entries(rules)) {
        const severity = Array.isArray(ruleConfig) ? ruleConfig[0] : ruleConfig;

        if (severity === "off" || severity === 0) {
            continue;
        }

        const pluginName = configuredPluginNames.find((candidatePluginName) =>
            ruleName.startsWith(`${candidatePluginName}/`)
        );

        if (pluginName !== undefined) {
            enabledRulePluginNames.add(pluginName);
        }
    }

    return enabledRulePluginNames;
};

const getActiveConfigScopeIndexes = (
    config: Linter.Config | undefined
): number[] =>
    Object.keys(config?.settings ?? {}).flatMap((settingName) => {
        if (!settingName.startsWith(FIXTURE_SCOPE_SETTING_PREFIX)) {
            return [];
        }

        const configIndex = Number(
            settingName.slice(FIXTURE_SCOPE_SETTING_PREFIX.length)
        );

        return Number.isSafeInteger(configIndex) ? [configIndex] : [];
    });

// The exhaustive matrix competes with the other typechecked Vitest projects
// during the full release gate. Its isolated runtime is much lower, but the
// shared Windows runner can legitimately exceed one minute under that load.
const FIXTURE_SMOKE_TEST_TIMEOUT = 180_000;

describe("fixture smoke matrix", () => {
    it("keeps every fixture explicitly included or intentionally excluded", () => {
        expect.assertions(2);

        const expectedFixturePaths = [
            ...fixturePaths,
            ...intentionallyExcludedFixturePaths,
        ];
        const actualFixturePaths =
            getFixtureWorkspaceFiles(fixtureWorkspaceRoot);

        expect(actualFixturePaths).toHaveLength(expectedFixturePaths.length);
        expect(new Set(actualFixturePaths)).toStrictEqual(
            new Set(expectedFixturePaths)
        );
    });

    it("gives every generated config a nonempty name", () => {
        expect.assertions(1);

        const sharedConfig = createConfig({
            next: true,
            rootDirectory: fixtureWorkspaceRoot,
            tsconfigPaths: ["./tsconfig.json"],
        });

        expect(
            sharedConfig.flatMap((configEntry, configIndex) =>
                configEntry.name === undefined ||
                configEntry.name.trim().length === 0
                    ? [{ index: configIndex, name: configEntry.name }]
                    : []
            )
        ).toStrictEqual([]);
    });

    it(
        "lints every configured fixture surface without parser or rule-loading failures",
        async () => {
            expect.assertions(7);

            const sharedConfig = createConfig({
                next: true,
                rootDirectory: fixtureWorkspaceRoot,
                tsconfigPaths: ["./tsconfig.json"],
            });
            const instrumentedSharedConfig =
                instrumentFileScopedConfigs(sharedConfig);

            const eslint = new ESLint({
                cwd: fixtureWorkspaceRoot,
                overrideConfig: [
                    ...instrumentedSharedConfig,
                    fixtureTypeScriptProject,
                ],
                overrideConfigFile: true,
            });

            const results = await eslint.lintFiles([...fixturePaths]);
            const lintedPaths = results.map((result) =>
                normalizeFixturePath(result.filePath)
            );
            const activePluginNames = new Set<string>();
            const activeRulePluginNames = new Set<string>();
            const activeConfigScopeIndexes = new Set<number>();

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

                if (config !== undefined) {
                    for (const pluginName of getEnabledRulePluginNames(
                        config
                    )) {
                        activeRulePluginNames.add(pluginName);
                    }
                }

                const configScopeIndexes = getActiveConfigScopeIndexes(config);

                for (const configIndex of configScopeIndexes) {
                    activeConfigScopeIndexes.add(configIndex);
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
            const secretScanningMessages = results.flatMap((result) =>
                result.messages
                    .filter(
                        ({ ruleId }) =>
                            ruleId ===
                            "repo-compliance/require-secret-scanning-config"
                    )
                    .map(({ messageId, ruleId, severity }) => ({
                        filePath: normalizeFixturePath(result.filePath),
                        messageId,
                        ruleId,
                        severity,
                    }))
            );

            expect(new Set(lintedPaths)).toStrictEqual(new Set(fixturePaths));
            expect(
                getMissingPluginNames(
                    getConfiguredPluginNames(sharedConfig),
                    activePluginNames
                )
            ).toStrictEqual([]);
            expect(
                sharedConfig.flatMap((configEntry, configIndex) =>
                    configEntry.files === undefined ||
                    activeConfigScopeIndexes.has(configIndex)
                        ? []
                        : [
                              {
                                  files: configEntry.files,
                                  index: configIndex,
                                  name: configEntry.name ?? "(unnamed config)",
                              },
                          ]
                )
            ).toStrictEqual([]);
            expect(fatalMessages).toStrictEqual([]);
            expect(missingJsxA11yPeerMessages).toStrictEqual([]);
            // Compat is intentionally registration-only until a consumer opts
            // into compat/compat with its own Browserslist targets.
            expect(
                getMissingPluginNames(
                    getConfiguredPluginNames(sharedConfig),
                    activeRulePluginNames
                )
            ).toStrictEqual(["compat"]);
            // The fixture workspace deliberately omits
            // .github/secret_scanning.yml so the repository-policy warning is
            // exercised instead of merely asserted in the static config.
            expect(secretScanningMessages).toStrictEqual([
                {
                    filePath: "eslint.config.mjs",
                    messageId: "missingSecretScanningConfig",
                    ruleId: "repo-compliance/require-secret-scanning-config",
                    severity: 1,
                },
            ]);
        },
        FIXTURE_SMOKE_TEST_TIMEOUT
    );
});
