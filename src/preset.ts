/**
 * Public flat-config presets and factory helpers for eslint-config-nick2bad4u.
 *
 * @packageDocumentation
 */
import {
    createConfig as createSharedConfig,
    type Nick2Bad4UAllowDefaultProjectFilePatternPresets,
    type Nick2Bad4UEslintConfigOptions,
    type Nick2Bad4UEslintConfigPresets,
    allowDefaultProjectFilePatternPresets as sharedAllowDefaultProjectFilePatternPresets,
    configs as sharedConfigs,
} from "./shared-config.js";

/** Opt-in file-pattern presets for TypeScript ESLint's default-project fallback. */
export const allowDefaultProjectFilePatternPresets: Nick2Bad4UAllowDefaultProjectFilePatternPresets =
    Object.freeze({
        defaultRootFiles: [
            ...sharedAllowDefaultProjectFilePatternPresets.defaultRootFiles,
        ],
        rootConfigFiles: [
            ...sharedAllowDefaultProjectFilePatternPresets.rootConfigFiles,
        ],
        rootMjsFiles: [
            ...sharedAllowDefaultProjectFilePatternPresets.rootMjsFiles,
        ],
        rootScriptFiles: [
            ...sharedAllowDefaultProjectFilePatternPresets.rootScriptFiles,
        ],
    });

/** Shared flat config presets. */
export const presets: Nick2Bad4UEslintConfigPresets = Object.freeze({
    all: sharedConfigs.all,
    base: sharedConfigs.base,
    recommended: sharedConfigs.recommended,
    withJest: sharedConfigs.withJest,
    withNext: sharedConfigs.withNext,
    withoutCodex: sharedConfigs.withoutCodex,
    withoutCopilot: sharedConfigs.withoutCopilot,
    withoutDocusaurus2: sharedConfigs.withoutDocusaurus2,
    withoutEtcMisc: sharedConfigs.withoutEtcMisc,
    withoutFileProgress2: sharedConfigs.withoutFileProgress2,
    withoutGitHubActions2: sharedConfigs.withoutGitHubActions2,
    withoutGithubActions2: sharedConfigs.withoutGitHubActions2,
    withoutImmutable2: sharedConfigs.withoutImmutable2,
    withoutRemark: sharedConfigs.withoutRemark,
    withoutRepo: sharedConfigs.withoutRepo,
    withoutRuntimeCleanup: sharedConfigs.withoutRuntimeCleanup,
    withoutSdl2: sharedConfigs.withoutSdl2,
    withoutSecretlint: sharedConfigs.withoutSecretlint,
    withoutSonarJS: sharedConfigs.withoutSonarJS,
    withoutStylelint2: sharedConfigs.withoutStylelint2,
    withoutTestSignal: sharedConfigs.withoutTestSignal,
    withoutTombi: sharedConfigs.withoutTombi,
    withoutTsconfig: sharedConfigs.withoutTsconfig,
    withoutTsdocRequire2: sharedConfigs.withoutTsdocRequire2,
    withoutTypedoc: sharedConfigs.withoutTypedoc,
    withoutTypefest: sharedConfigs.withoutTypefest,
    withoutVite: sharedConfigs.withoutVite,
    withoutWriteGoodComments2: sharedConfigs.withoutWriteGoodComments2,
    withoutYamllint: sharedConfigs.withoutYamllint,
    withSonarJS: sharedConfigs.withSonarJS,
});

/** Create the shared Nick2Bad4U ESLint flat config. */
export const createConfig = (
    options?: Nick2Bad4UEslintConfigOptions
): ReturnType<typeof createSharedConfig> => createSharedConfig(options);

/** Default package export containing config presets and factory helper. */
const nickTwoBadFourU: {
    readonly allowDefaultProjectFilePatternPresets: typeof allowDefaultProjectFilePatternPresets;
    readonly configs: Nick2Bad4UEslintConfigPresets;
    readonly createConfig: typeof createConfig;
} = Object.freeze({
    allowDefaultProjectFilePatternPresets,
    configs: presets,
    createConfig,
});

export default nickTwoBadFourU;
