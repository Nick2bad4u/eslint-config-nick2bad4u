import {
    createConfig as createSharedConfig,
    configs as sharedConfigs,
} from "./eslint.config.mjs";

export const configs = Object.freeze({
    all: sharedConfigs.all,
    base: sharedConfigs.base,
    recommended: sharedConfigs.recommended,
    withoutCopilot: sharedConfigs.withoutCopilot,
    withoutEtcMisc: sharedConfigs.withoutEtcMisc,
    withoutTsconfig: sharedConfigs.withoutTsconfig,
    withoutTypefest: sharedConfigs.withoutTypefest,
});

/**
 * Create the shared Nick2bad4u ESLint flat config.
 *
 * @type {typeof createSharedConfig}
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types -- The public wrapper inherits its full call signature from createSharedConfig above.
export const createConfig = (options) => createSharedConfig(options);

const nickTwoBadFourU = Object.freeze({
    configs,
    createConfig,
});

export default nickTwoBadFourU;
