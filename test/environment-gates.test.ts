import { ESLint, type Linter } from "eslint";
import { execFile } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

import { createConfig } from "../src/preset";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const fixtureWorkspaceRoot = fileURLToPath(
    new URL("fixtures/lint-smoke/workspace", import.meta.url)
);
const builtSharedConfigUrl = pathToFileURL(
    path.join(repositoryRoot, "dist/shared-config.js")
).href;

const MARKDOWN_CODE_BLOCK_CONFIG_NAMES = [
    "📁 Markdown: Code block processor",
    "📁 Markdown: Code block virtual files ⛔ Overrides",
    // eslint-disable-next-line perfectionist/sort-arrays -- Preserve emitted order: the final sorting override follows the virtual-file override.
    "📁 Markdown: Code block sorting ⛔ Overrides",
] as const;

const environmentProbeSource = `
const sharedConfigUrl = ${JSON.stringify(builtSharedConfigUrl)};
const fixtureWorkspaceRoot = ${JSON.stringify(fixtureWorkspaceRoot)};
const repositoryRoot = ${JSON.stringify(repositoryRoot)};
const markdownConfigNames = ${JSON.stringify(MARKDOWN_CODE_BLOCK_CONFIG_NAMES)};

const setEnvironment = ({ ci, markdown, progress, root }) => {
    for (const variableName of [
        "CI",
        "ENABLE_MARKDOWN_CODE_BLOCK_LINTING",
        "ESLINT_CONFIG_ROOT",
        "ESLINT_PROGRESS",
    ]) {
        delete process.env[variableName];
    }

    if (ci !== undefined) {
        process.env.CI = ci;
    }

    if (markdown !== undefined) {
        process.env.ENABLE_MARKDOWN_CODE_BLOCK_LINTING = markdown;
    }

    if (progress !== undefined) {
        process.env.ESLINT_PROGRESS = progress;
    }

    if (root !== undefined) {
        process.env.ESLINT_CONFIG_ROOT = root;
    }
};

const importSharedConfig = async (probeName, environment) => {
    setEnvironment(environment);
    return import(
        sharedConfigUrl + "?environment-gate=" + encodeURIComponent(probeName)
    );
};

const progressCases = [
    { environment: {}, name: "default" },
    { environment: { progress: "on" }, name: "on" },
    { environment: { progress: "nofile" }, name: "nofile" },
    { environment: { progress: "off" }, name: "off" },
    { environment: { progress: "0" }, name: "zero" },
    { environment: { progress: "false" }, name: "false" },
    { environment: { ci: "1" }, name: "ci" },
    { environment: { ci: "0" }, name: "ciZero" },
    { environment: { ci: "false" }, name: "ciFalse" },
];
const progress = {};

for (const progressCase of progressCases) {
    const sharedConfigModule = await importSharedConfig(
        "progress-" + progressCase.name,
        progressCase.environment
    );
    const progressConfig = sharedConfigModule
        .createConfig()
        .find(
            (configEntry) =>
                configEntry.name === "⏱️ File Progress: Recommended CI"
        );

    progress[progressCase.name] = {
        activate: progressConfig?.rules?.["file-progress/activate"],
        hide: progressConfig?.settings?.progress?.hide,
        hideFileName: progressConfig?.settings?.progress?.hideFileName,
    };
}

const markdownDisabledModule = await importSharedConfig("markdown-disabled", {
    markdown: "0",
});
const markdownDisabledConfigNames = markdownDisabledModule
    .createConfig()
    .map((configEntry) => configEntry.name)
    .filter((configName) => markdownConfigNames.includes(configName));

const markdownEnabledModule = await importSharedConfig("markdown-enabled", {
    markdown: "1",
});
const markdownEnabledConfig = markdownEnabledModule.createConfig({
    plugins: {
        "file-progress": false,
        "file-progress-2": false,
        secretlint: false,
    },
    rootDirectory: fixtureWorkspaceRoot,
    sonarjs: false,
    tsconfigPaths: ["./tsconfig.json"],
});
const markdownEnabledConfigNames = markdownEnabledConfig
    .map((configEntry) => configEntry.name)
    .filter((configName) => markdownConfigNames.includes(configName));
const configuredMarkdownProcessor =
    markdownEnabledConfig.find(
        (configEntry) =>
            configEntry.name === "📁 Markdown: Code block processor"
    )?.processor ?? null;
const { ESLint } = await import("eslint");
const markdownEslint = new ESLint({
    cwd: fixtureWorkspaceRoot,
    overrideConfig: markdownEnabledConfig,
    overrideConfigFile: true,
});
const markdownResults = await markdownEslint.lintFiles([
    "docs/guides/code-block.md",
]);
const markdownCodeBlockConfig = await markdownEslint.calculateConfigForFile(
    "docs/guides/code-block.md"
);
const markdownAgentConfig = await markdownEslint.calculateConfigForFile(
    ".github/agents/fixture.agent.md"
);

const rootDirectoryModule = await importSharedConfig("root-directory", {
    root: fixtureWorkspaceRoot,
});
const sharedRootProbeOptions = {
    plugins: {
        "file-progress": false,
        "file-progress-2": false,
        secretlint: false,
    },
    sonarjs: false,
    tsconfigPaths: ["./tsconfig.json"],
};
const environmentRootConfig = rootDirectoryModule.createConfig(
    sharedRootProbeOptions
);
const environmentRootEslint = new ESLint({
    cwd: fixtureWorkspaceRoot,
    overrideConfig: environmentRootConfig,
    overrideConfigFile: true,
});
const environmentRootEffectiveConfig =
    await environmentRootEslint.calculateConfigForFile("src/index.ts");

setEnvironment({ root: repositoryRoot });
const explicitRootConfig = rootDirectoryModule.createConfig({
    ...sharedRootProbeOptions,
    rootDirectory: fixtureWorkspaceRoot,
});
const explicitRootEslint = new ESLint({
    cwd: fixtureWorkspaceRoot,
    overrideConfig: explicitRootConfig,
    overrideConfigFile: true,
});
const explicitRootEffectiveConfig =
    await explicitRootEslint.calculateConfigForFile("src/index.ts");

setEnvironment({});
const packageModule = await import("eslint-config-nick2bad4u");
const packageConfig = packageModule.createConfig({
    ...sharedRootProbeOptions,
    rootDirectory: fixtureWorkspaceRoot,
});
const packageEslint = new ESLint({
    cwd: fixtureWorkspaceRoot,
    overrideConfig: packageConfig,
    overrideConfigFile: true,
});
const packageEffectiveConfig =
    await packageEslint.calculateConfigForFile("src/index.ts");

process.stdout.write(
    JSON.stringify({
        markdown: {
            agentProcessorLoaded: markdownAgentConfig?.processor !== undefined,
            codeBlockProcessorLoaded:
                markdownCodeBlockConfig?.processor !== undefined,
            configuredProcessor: configuredMarkdownProcessor,
            disabledConfigNames: markdownDisabledConfigNames,
            enabledConfigNames: markdownEnabledConfigNames,
            fatalErrorCount: markdownResults.reduce(
                (total, result) => total + result.fatalErrorCount,
                0
            ),
            ruleIds: markdownResults.flatMap((result) =>
                result.messages
                    .map((message) => message.ruleId)
                    .filter((ruleId) => ruleId !== null)
            ),
        },
        packageEntrypoint: {
            defaultConfigsArePresets:
                packageModule.default?.configs === packageModule.presets,
            defaultCreateConfigIsNamed:
                packageModule.default?.createConfig ===
                packageModule.createConfig,
            effectiveConfigFound: packageEffectiveConfig !== undefined,
            hasCreateConfig: typeof packageModule.createConfig === "function",
            hasPresets:
                Array.isArray(packageModule.presets?.all) &&
                packageModule.presets.all.length > 0,
        },
        progress,
        rootDirectory: {
            environment: {
                ignoredByFixture: await environmentRootEslint.isPathIgnored(
                    "ignored-by-fixture/generated.ts"
                ),
                sourceIgnored:
                    await environmentRootEslint.isPathIgnored("src/index.ts"),
                tsconfigRootDir:
                    environmentRootEffectiveConfig?.languageOptions
                        ?.parserOptions?.tsconfigRootDir,
            },
            explicit: {
                ignoredByFixture: await explicitRootEslint.isPathIgnored(
                    "ignored-by-fixture/generated.ts"
                ),
                sourceIgnored:
                    await explicitRootEslint.isPathIgnored("src/index.ts"),
                tsconfigRootDir:
                    explicitRootEffectiveConfig?.languageOptions
                        ?.parserOptions?.tsconfigRootDir,
            },
        },
    })
);
`;

const executeEnvironmentProbe = async (): Promise<string> =>
    new Promise((resolve, reject) => {
        const abortController = new AbortController();
        const abortChildProcess = (): void => {
            abortController.abort();
        };
        const removeProcessExitHandler = (): void => {
            process.off("exit", abortChildProcess);
        };
        const childProcess = execFile(
            process.execPath,
            [
                "--input-type=module",
                "--eval",
                environmentProbeSource,
            ],
            {
                cwd: repositoryRoot,
                encoding: "utf8",
                signal: abortController.signal,
                timeout: 120_000,
                windowsHide: true,
            },
            (error, stdout) => {
                removeProcessExitHandler();

                if (error === null) {
                    resolve(stdout);
                    return;
                }

                reject(
                    new Error("The environment probe process failed.", {
                        cause: error,
                    })
                );
            }
        );

        process.once("exit", abortChildProcess);
        childProcess.once("exit", removeProcessExitHandler);
    });

const runEnvironmentProbe = async (): Promise<unknown> => {
    const stdout = await executeEnvironmentProbe();

    return JSON.parse(stdout) as unknown;
};

describe("isolated runtime integrations", () => {
    it("evaluates package loading, root resolution, Markdown processing, and file-progress modes", async () => {
        expect.assertions(1);

        await expect(runEnvironmentProbe()).resolves.toStrictEqual({
            markdown: {
                agentProcessorLoaded: false,
                codeBlockProcessorLoaded: true,
                configuredProcessor: "markdown/markdown",
                disabledConfigNames: [],
                enabledConfigNames: [...MARKDOWN_CODE_BLOCK_CONFIG_NAMES],
                fatalErrorCount: 0,
                ruleIds: expect.arrayContaining(["no-var"]),
            },
            packageEntrypoint: {
                defaultConfigsArePresets: true,
                defaultCreateConfigIsNamed: true,
                effectiveConfigFound: true,
                hasCreateConfig: true,
                hasPresets: true,
            },
            progress: {
                ci: {
                    activate: 1,
                    hide: true,
                    hideFileName: false,
                },
                ciFalse: {
                    activate: 1,
                    hide: false,
                    hideFileName: false,
                },
                ciZero: {
                    activate: 1,
                    hide: false,
                    hideFileName: false,
                },
                default: {
                    activate: 1,
                    hide: false,
                    hideFileName: false,
                },
                false: {
                    activate: 0,
                    hide: true,
                    hideFileName: false,
                },
                nofile: {
                    activate: 1,
                    hide: false,
                    hideFileName: true,
                },
                off: {
                    activate: 0,
                    hide: true,
                    hideFileName: false,
                },
                on: {
                    activate: 1,
                    hide: false,
                    hideFileName: false,
                },
                zero: {
                    activate: 0,
                    hide: true,
                    hideFileName: false,
                },
            },
            rootDirectory: {
                environment: {
                    ignoredByFixture: true,
                    sourceIgnored: false,
                    tsconfigRootDir: fixtureWorkspaceRoot,
                },
                explicit: {
                    ignoredByFixture: true,
                    sourceIgnored: false,
                    tsconfigRootDir: fixtureWorkspaceRoot,
                },
            },
        });
    }, 180_000);

    it("loads Jest rules and reports a focused Jest test at runtime", async () => {
        expect.assertions(6);

        const jestFixturePath = "packages/jest/test/sample.test.ts";
        const configEntries = createConfig({
            jest: {
                files: ["packages/jest/test/**/*.{ts,tsx}"],
                version: "30.0.0",
            },
            plugins: {
                "file-progress": false,
                "file-progress-2": false,
                secretlint: false,
            },
            rootDirectory: fixtureWorkspaceRoot,
            sonarjs: false,
            tsconfigPaths: ["./tsconfig.json"],
            vitest: false,
        });
        const eslint = new ESLint({
            cwd: fixtureWorkspaceRoot,
            overrideConfig: [
                ...configEntries,
                {
                    files: ["packages/jest/test/**/*.ts"],
                    languageOptions: {
                        parserOptions: {
                            project: "./tsconfig.json",
                            projectService: false,
                            tsconfigRootDir: fixtureWorkspaceRoot,
                        },
                    },
                    name: "Jest runtime fixture: TypeScript project",
                } satisfies Linter.Config,
            ],
            overrideConfigFile: true,
        });
        const effectiveConfig = (await eslint.calculateConfigForFile(
            jestFixturePath
        )) as Linter.Config | undefined;
        const [lintResult] = await eslint.lintText(
            [
                'describe("Jest fixture", () => {',
                '    it.only("detects a focused test", () => undefined);',
                "});",
            ].join("\n"),
            { filePath: jestFixturePath }
        );

        expect(effectiveConfig?.plugins).toHaveProperty("jest");
        expect(effectiveConfig?.plugins).not.toHaveProperty("vitest");
        expect(effectiveConfig?.languageOptions?.["globals"]).toHaveProperty(
            "jest"
        );
        expect(lintResult?.filePath).toBe(
            path.join(fixtureWorkspaceRoot, jestFixturePath)
        );
        expect(lintResult?.fatalErrorCount).toBe(0);
        expect(lintResult?.messages.map((message) => message.ruleId)).toContain(
            "jest/no-focused-tests"
        );
    });
});
