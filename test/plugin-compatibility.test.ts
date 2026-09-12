import codexPlugin from "@typpi/eslint-plugin-codex";
import etcMiscPlugin from "eslint-plugin-etc-misc";
import fileProgressPlugin from "eslint-plugin-file-progress-2";
import listenersPlugin from "eslint-plugin-listeners";
import nodePlugin from "eslint-plugin-n";
import storybookPlugin from "eslint-plugin-storybook";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createConfig } from "../src/preset";

describe("dependency compatibility", () => {
    // eslint-disable-next-line vitest/no-hooks -- Restore import-time mocks and environment variables after every compatibility case.
    afterEach(() => {
        vi.doUnmock("eslint-plugin-listeners");
        vi.doUnmock("eslint-plugin-n");
        vi.doUnmock("eslint-plugin-storybook");
        vi.unstubAllEnvs();
        vi.resetModules();
    });

    describe("upstream preset compatibility", () => {
        it.each([
            {
                configs: {
                    "flat/strict": {
                        rules: {
                            "listeners/matching-remove-event-listener": "warn",
                        },
                    },
                },
                names: ["🎧 Listeners: Strict"],
                shape: "one flat config",
            },
            {
                configs: {
                    "flat/strict": [
                        {
                            rules: {
                                "listeners/matching-remove-event-listener":
                                    "warn",
                            },
                        },
                        { rules: {} },
                    ],
                },
                names: ["🎧 Listeners: Strict 1", "🎧 Listeners: Strict 2"],
                shape: "unnamed flat config array",
            },
            {
                configs: {
                    strict: {
                        rules: {
                            "listeners/matching-remove-event-listener": "warn",
                        },
                    },
                },
                names: ["🎧 Listeners: Strict"],
                shape: "legacy rules config",
            },
            { configs: {}, names: [], shape: "missing preset" },
        ])(
            "supports listener $shape without mutating the plugin",
            async ({ configs, names }) => {
                expect.assertions(4);

                const upstreamPlugin = { ...listenersPlugin, configs };
                const originalConfigs = structuredClone(configs);
                // eslint-disable-next-line vitest/prefer-import-in-mock -- Compatibility fixtures intentionally differ from the installed preset's literal types.
                vi.doMock("eslint-plugin-listeners", () => ({
                    default: upstreamPlugin,
                }));
                vi.resetModules();
                // Reload import-time preset normalization with the supplied upstream shape.
                const { createConfig: createFreshConfig } =
                    await import("../src/preset");
                const listenerConfigs = createFreshConfig().filter(
                    (config) =>
                        config.name?.startsWith("🎧 Listeners: Strict") === true
                );

                expect(listenerConfigs.map(({ name }) => name)).toStrictEqual(
                    names
                );
                expect(
                    listenerConfigs.every(
                        (config) =>
                            config.files?.includes(
                                "**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}"
                            ) === true
                    )
                ).toBe(true);
                expect(upstreamPlugin.configs).toStrictEqual(originalConfigs);
                expect(
                    listenerConfigs[0]?.rules?.[
                        "listeners/matching-remove-event-listener"
                    ] ?? null
                ).toBe(names.length === 0 ? null : "warn");
            }
        );

        it.each([
            { configs: [], expectedRules: {}, shape: "empty" },
            {
                configs: [
                    {
                        name: "renamed/recommended",
                        rules: { "storybook/default-exports": "warn" },
                    },
                ],
                expectedRules: { "storybook/default-exports": "warn" },
                shape: "renamed",
            },
        ])(
            "supports $shape Storybook recommended presets",
            async ({ configs, expectedRules }) => {
                expect.assertions(2);

                // eslint-disable-next-line vitest/prefer-import-in-mock -- Exercise alternate upstream preset shapes without asserting the installed version's exact types.
                vi.doMock("eslint-plugin-storybook", () => ({
                    default: {
                        ...storybookPlugin,
                        configs: {
                            ...storybookPlugin.configs,
                            "flat/recommended": configs,
                        },
                    },
                }));
                vi.resetModules();
                const { createConfig: createFreshConfig } =
                    await import("../src/preset");
                const storyConfig = createFreshConfig().find(
                    (config) =>
                        config.name?.startsWith("📖 Storybook Stories:") ===
                        true
                );

                expect(storyConfig?.rules?.["storybook/default-exports"]).toBe(
                    expectedRules["storybook/default-exports"]
                );
                expect(
                    storyConfig?.rules?.["storybook/no-uninstalled-addons"]
                ).toBe("warn");
            }
        );

        it("retains Node rule registration when the SDL-free preset needs a fallback", async () => {
            expect.assertions(2);

            const upstreamPlugin = {
                ...nodePlugin,
                configs: {
                    ...nodePlugin.configs,
                    "flat/all": {
                        ...nodePlugin.configs["flat/all"],
                        plugins: {},
                    },
                },
            };
            vi.doMock(import("eslint-plugin-n"), () => ({
                default: upstreamPlugin,
            }));
            vi.resetModules();
            const { presets } = await import("../src/preset");

            expect(presets.withoutSdl2[0]).toStrictEqual({
                name: "Node plugin registration (withoutSdl2 only)",
                plugins: { n: upstreamPlugin },
            });
            expect(
                presets.withoutSdl2.some(
                    (config) =>
                        config.rules?.["n/no-process-exit"] !== undefined
                )
            ).toBe(true);
        });

        it.each([
            null,
            "invalid",
            {},
            { rules: null },
            { rules: "invalid" },
        ])("ignores malformed optional upstream rule maps: %j", (all) => {
            expect.assertions(2);

            const localPlugin = { ...etcMiscPlugin, configs: { all } };
            const config = createConfig({
                plugins: { "etc-misc": localPlugin },
            }).find((entry) => entry.name === "⌨️ Etc-Misc: Rules for Source");

            expect(config?.plugins?.["etc-misc"]).toBe(localPlugin);
            expect(config?.rules?.["etc-misc/no-const-enum"]).toBe("warn");
        });

        it("allows consumers to disable the default-project fallback", () => {
            expect.assertions(1);

            const config = createConfig({
                allowDefaultProjectFilePatterns: [],
            }).find((entry) => entry.name === "🌍 Global: Rules");

            expect(config?.languageOptions?.["parserOptions"]).toMatchObject({
                projectService: true,
            });
        });

        it("collects Codex Markdown patterns from string and AND selectors", () => {
            expect.assertions(1);

            const config = createConfig({
                plugins: {
                    codex: {
                        ...codexPlugin,
                        configs: {
                            "all-without-language-plugins": [
                                { language: "markdown/gfm" },
                                {
                                    files: [
                                        "AGENTS.md",
                                        ["docs/**", "**/*.md"],
                                    ],
                                    language: "markdown/gfm",
                                },
                            ],
                        },
                    },
                },
            }).find(
                (entry) =>
                    entry.name === "🧠 Codex: Markdown document overrides"
            );

            expect(config?.files).toStrictEqual([
                "AGENTS.md",
                "docs/**",
                "**/*.md",
            ]);
        });

        it("skips undefined alias overrides and uses the next configured alias", () => {
            expect.assertions(1);

            const localPlugin = {
                ...fileProgressPlugin,
                configs: {
                    ...fileProgressPlugin.configs,
                    "recommended-ci": {
                        ...fileProgressPlugin.configs["recommended-ci"],
                        settings: { compatibilityAlias: "secondary" },
                    },
                },
            };
            const config = createConfig({
                plugins: {
                    // eslint-disable-next-line sonarjs/no-undefined-assignment -- Undefined skips this alias; null deliberately disables the plugin.
                    "file-progress": undefined,
                    "file-progress-2": localPlugin,
                },
            }).find(
                (entry) => entry.name === "⏱️ File Progress: Recommended CI"
            );

            expect(config?.settings?.["compatibilityAlias"]).toBe("secondary");
        });
    });

    describe("import-time environment switches", () => {
        it("does not enable Markdown extraction for a disabled environment flag", async () => {
            expect.assertions(1);

            vi.stubEnv("ENABLE_MARKDOWN_CODE_BLOCK_LINTING", "0");
            vi.resetModules();
            const { createConfig: createFreshConfig } =
                await import("../src/preset");

            expect(createFreshConfig().map(({ name }) => name)).not.toContain(
                "📁 Markdown: Code block processor"
            );
        });

        it.each([
            {
                ci: "",
                progress: "on",
                severity: 1,
                shouldHide: false,
                shouldHideFileName: false,
            },
            {
                ci: "0",
                progress: "nofile",
                severity: 1,
                shouldHide: false,
                shouldHideFileName: true,
            },
            {
                ci: "false",
                progress: "off",
                severity: 0,
                shouldHide: true,
                shouldHideFileName: false,
            },
            {
                ci: "true",
                progress: "on",
                severity: 1,
                shouldHide: true,
                shouldHideFileName: false,
            },
        ])(
            "respects CI=$ci and ESLINT_PROGRESS=$progress",
            async ({
                ci,
                progress,
                severity,
                shouldHide,
                shouldHideFileName,
            }) => {
                expect.assertions(2);

                vi.stubEnv("CI", ci);
                vi.stubEnv("ESLINT_PROGRESS", progress);
                vi.resetModules();
                const { createConfig: createFreshConfig } =
                    await import("../src/preset");
                const config = createFreshConfig().find(
                    (entry) => entry.name === "⏱️ File Progress: Recommended CI"
                );

                expect(config?.rules?.["file-progress/activate"]).toBe(
                    severity
                );
                expect(config?.settings?.["progress"]).toMatchObject({
                    hide: shouldHide,
                    hideFileName: shouldHideFileName,
                });
            }
        );

        it("enables the Markdown processor and its virtual-file overrides together", async () => {
            expect.assertions(2);

            vi.stubEnv("ENABLE_MARKDOWN_CODE_BLOCK_LINTING", "1");
            vi.resetModules();
            const { createConfig: createFreshConfig } =
                await import("../src/preset");
            const configs = createFreshConfig().filter(
                (entry) =>
                    entry.name?.startsWith("📁 Markdown: Code block") === true
            );

            expect(configs.map(({ name }) => name)).toStrictEqual([
                "📁 Markdown: Code block processor",
                "📁 Markdown: Code block virtual files ⛔ Overrides",
                "📁 Markdown: Code block sorting ⛔ Overrides",
            ]);
            expect(configs[0]?.processor).toBe("markdown/markdown");
        });
    });
});
