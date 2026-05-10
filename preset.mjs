import nickTwoBadFourU from "./dist/preset.js";

// eslint-disable-next-line no-barrel-files/no-barrel-files -- Intentional re-exporting adapter module.
export { createConfig, presets } from "./dist/preset.js";

// eslint-disable-next-line no-barrel-files/no-barrel-files, unicorn/prefer-export-from, canonical/no-re-export -- Intentional default export adapter for root package entrypoint.
export default nickTwoBadFourU;
