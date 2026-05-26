/* eslint-disable @typescript-eslint/consistent-type-imports -- Ambient shims must avoid top-level imports or TypeScript stops treating these as global declarations. */
interface EslintPluginShim {
    readonly configs: Readonly<
        Record<string, import("eslint").Linter.Config | undefined>
    >;
    readonly processors?: Readonly<import("type-fest").UnknownRecord>;
    readonly rules?: Readonly<import("type-fest").UnknownRecord>;
}

declare module "eslint-plugin-array-func" {
    const plugin: EslintPluginShim;
    export default plugin;
}

declare module "eslint-plugin-css-modules" {
    const plugin: EslintPluginShim;
    export default plugin;
}

declare module "eslint-plugin-listeners" {
    const plugin: EslintPluginShim;
    export default plugin;
}

declare module "eslint-plugin-no-only-tests" {
    const plugin: EslintPluginShim;
    export default plugin;
}

declare module "eslint-plugin-no-unsanitized" {
    const plugin: EslintPluginShim;
    export default plugin;
}

declare module "eslint-plugin-no-use-extend-native" {
    const plugin: EslintPluginShim;
    export default plugin;
}

declare module "eslint-plugin-promise" {
    const plugin: EslintPluginShim;
    export default plugin;
}

declare module "eslint-plugin-redos" {
    const plugin: EslintPluginShim;
    export default plugin;
}

declare module "eslint-plugin-undefined-css-classes" {
    const plugin: EslintPluginShim;
    export default plugin;
}

/* eslint-enable @typescript-eslint/consistent-type-imports -- Re-enable after ambient module shims. */
