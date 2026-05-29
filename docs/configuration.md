# Configuration guide

This guide explains the runtime configuration surface exported by
`eslint-config-nick2bad4u`. Use it when the quick-start examples in the
[`README`](../README.md) are not enough for a consuming repository.

## Exports

The package exports an ESM default object and named helpers from the package root.

```js
import nick2bad4u, { createConfig, presets } from "eslint-config-nick2bad4u";
```

| Export | Description |
| --- | --- |
| `nick2bad4u.configs` | Preset arrays available on the default export. |
| `presets` | Named export for the same preset arrays. |
| `createConfig()` | Factory for changing root resolution, TypeScript projects, or plugin replacements. |

The package is ESM-only. Use `eslint.config.mjs` or an ESM `eslint.config.js`
in consuming projects.

## Choosing a preset

Start with `all` unless a repository has a known reason to remove a surface.
Each preset is an array of ESLint flat-config entries.

```js
import { presets } from "eslint-config-nick2bad4u";

export default [...presets.all];
```

Use `recommended` only when a project expects a conventional preset name. It is
an alias for `all`.

Use `base` when a repository wants the shared foundation without explicit
source-rule plugin sections.

Use a `without*` preset when one of these applies:

- the repository does not use that tool or file type;
- a packaged plugin conflicts with a local plugin build;
- a migration needs to remove one namespace at a time.

## Adding local overrides

Append local entries after the shared preset so the local entry has normal flat
config precedence.

```js
import nick2bad4u from "eslint-config-nick2bad4u";

export default [
    ...nick2bad4u.configs.all,
    {
        files: ["src/**/*.ts"],
        name: "Project TypeScript overrides",
        rules: {
            "no-console": "off",
        },
    },
];
```

Keep overrides scoped with `files` when the rule only applies to one file family.
Broad global overrides are harder to review during future package upgrades.

## Using `createConfig()`

`createConfig()` returns the same flat-config array shape as a preset, with
factory options applied before the array is returned.

```js
import { createConfig } from "eslint-config-nick2bad4u";

export default createConfig({
    allowDefaultProjectFilePatterns: [
        "*.config.{js,mjs,cjs,ts,mts,cts}",
        "*.config.*.{js,mjs,cjs,ts,mts,cts}",
        ".*rc.{js,mjs,cjs,ts,mts,cts}",
        "preset.mjs",
    ],
    rootDirectory: import.meta.dirname,
    tsconfigPaths: ["./tsconfig.eslint.json"],
});
```

| Option | Default | Guidance |
| --- | --- | --- |
| `allowDefaultProjectFilePatterns` | `["*.mjs", ".*.mjs"]` | Root globs passed to `parserOptions.projectService.allowDefaultProject`. Only include files outside `tsconfigPaths`. |
| `rootDirectory` | `process.cwd()` | Set this when ESLint runs from outside the package root. |
| `tsconfigPaths` | `["./tsconfig.eslint.json"]` | Prefer one catch-all lint tsconfig. Add paths only for isolated compiler settings. |
| `plugins` | `{}` | Pass a plugin object to replace a namespace, or `false`/`null` to disable it. |

### Root directory

`rootDirectory` controls TypeScript parser root resolution and local path checks.
Passing `import.meta.dirname` is the most explicit option for ESM config files.

```js
import { createConfig } from "eslint-config-nick2bad4u";

export default createConfig({
    rootDirectory: import.meta.dirname,
});
```

`ESLINT_CONFIG_ROOT` exists for environments where command wrappers control the
root path. Prefer `rootDirectory` in repository-owned config files because the
setting stays visible to reviewers.

### TypeScript projects

The default expects `./tsconfig.eslint.json` relative to `rootDirectory`.
That project should cover every file ESLint can visit.

```json
{
    "$schema": "https://www.schemastore.org/tsconfig.json",
    "extends": "./tsconfig.json",
    "compilerOptions": {
        "allowJs": true,
        "checkJs": true,
        "noEmit": true
    },
    "exclude": ["node_modules/**", "dist/**", "coverage/**", ".cache/**"],
    "include": ["**/*", "**/.*"]
}
```

The `"**/.*"` include covers dotfiles. Extension globs such as `**/*.cjs` do
not match files like `.secretlintrc.cjs`.

Add another `tsconfigPaths` entry only when the extra project has different
compiler options that cannot live in the catch-all lint project.

```js
import { createConfig } from "eslint-config-nick2bad4u";

export default createConfig({
    rootDirectory: import.meta.dirname,
    tsconfigPaths: [
        "./tsconfig.eslint.json",
        "./tsconfig.benchmarks.json",
    ],
});
```

## Replacing or disabling plugins

The `plugins` option is keyed by ESLint plugin namespace. Pass `false` or `null`
to remove a packaged namespace from the shared config.

```js
import { createConfig } from "eslint-config-nick2bad4u";

export default createConfig({
    plugins: {
        typefest: false,
    },
});
```

To dogfood a local plugin, disable the packaged namespace and then append the
local plugin config entry.

```js
import { createConfig } from "eslint-config-nick2bad4u";
import localTypefest from "./plugin.mjs";

export default [
    ...createConfig({
        rootDirectory: import.meta.dirname,
        plugins: { typefest: false },
    }),
    {
        files: ["src/**/*.{ts,tsx,mts,cts}"],
        name: "Local Typefest rules",
        plugins: {
            typefest: localTypefest,
        },
        rules: {
            ...localTypefest.configs.experimental.rules,
        },
    },
];
```

When a matching `without*` preset exists, that preset is the shorter option.

```js
import nick2bad4u from "eslint-config-nick2bad4u";
import localTypefest from "./plugin.mjs";

export default [
    ...nick2bad4u.configs.withoutTypefest,
    {
        files: ["src/**/*.{ts,tsx,mts,cts}"],
        name: "Local Typefest rules",
        plugins: {
            typefest: localTypefest,
        },
        rules: {
            ...localTypefest.configs.experimental.rules,
        },
    },
];
```

## Environment variables

| Variable | Values | Effect |
| --- | --- | --- |
| `ESLINT_CONFIG_ROOT` | path string | Fallback root directory when `createConfig({ rootDirectory })` is not used. |
| `ESLINT_PROGRESS` | unset, `on`, `nofile`, `off`, `0`, `false` | Controls file progress output. |
| `ENABLE_JSON_SCHEMA_VALIDATION` | `1` | Enables the optional validator preset for JSON, JSONC, JSON5, YAML, TOML, JavaScript, and Vue custom blocks when the consumer installs an ESLint-10-compatible validator plugin. |

## Validation after configuration changes

Run these commands in the consuming project after changing `eslint.config.mjs` or
`tsconfig.eslint.json`.

```sh
npm ls eslint typescript
npm run lint
```

If the consuming project has typecheck and test scripts, run them too. Type-aware
ESLint rules can expose stale TypeScript project includes before application code
fails at runtime.

## See also

- [Migration guide](./migration.md)
- [Support guide](../SUPPORT.md)
- [Maintainer guide](./maintainer-guide.md)
