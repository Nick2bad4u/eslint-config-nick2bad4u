import {
    createConfig as createSharedConfig,
    type Nick2Bad4UEslintConfigOptions,
    type Nick2Bad4UEslintConfigPresets,
    configs as sharedConfigs,
} from "./shared-config.js";

/** Shared flat config presets. */
export const presets: Nick2Bad4UEslintConfigPresets = Object.freeze({
    all: sharedConfigs.all,
    base: sharedConfigs.base,
    recommended: sharedConfigs.recommended,
    withoutChunkyLint: sharedConfigs.withoutChunkyLint,
    withoutCopilot: sharedConfigs.withoutCopilot,
    withoutDocusaurus2: sharedConfigs.withoutDocusaurus2,
    withoutEtcMisc: sharedConfigs.withoutEtcMisc,
    withoutFileProgress2: sharedConfigs.withoutFileProgress2,
    withoutGithubActions2: sharedConfigs.withoutGithubActions2,
    withoutImmutable2: sharedConfigs.withoutImmutable2,
    withoutRemark: sharedConfigs.withoutRemark,
    withoutRepo: sharedConfigs.withoutRepo,
    withoutSdl2: sharedConfigs.withoutSdl2,
    withoutStylelint2: sharedConfigs.withoutStylelint2,
    withoutTsconfig: sharedConfigs.withoutTsconfig,
    withoutTsdocRequire2: sharedConfigs.withoutTsdocRequire2,
    withoutTypedoc: sharedConfigs.withoutTypedoc,
    withoutTypefest: sharedConfigs.withoutTypefest,
    withoutUptimeWatcher: sharedConfigs.withoutUptimeWatcher,
    withoutVite: sharedConfigs.withoutVite,
    withoutWriteGoodComments2: sharedConfigs.withoutWriteGoodComments2,
});

/** Create the shared Nick2bad4u ESLint flat config. */
export const createConfig = (
    options?: Nick2Bad4UEslintConfigOptions
): ReturnType<typeof createSharedConfig> => createSharedConfig(options);

/** Default package export containing config presets and factory helper. */
const nickTwoBadFourU: {
    readonly configs: Nick2Bad4UEslintConfigPresets;
    readonly createConfig: typeof createConfig;
} = Object.freeze({
    configs: presets,
    createConfig,
});

export default nickTwoBadFourU;
