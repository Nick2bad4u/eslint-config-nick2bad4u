# eslint-config-nick2bad4u

Shared flat ESLint config for Nick2bad4u ESLint plugin projects.

## Install

```sh
npm install --save-dev eslint-config-nick2bad4u eslint typescript
```

The config package ships the ESLint plugins/parsers/configs it enables. `eslint` and `typescript` stay as peer dependencies so each consuming repo controls those versions.

This package currently targets ESLint 10. The copied Docusaurus JSX-a11y add-on was intentionally omitted because `eslint-plugin-jsx-a11y@6` does not yet publish an ESLint 10 peer range, while the rest of this stack is already on ESLint 10.

## Basic usage

Create `eslint.config.mjs` in a consuming project:

```js
import nick2bad4u from "eslint-config-nick2bad4u";

export default [...nick2bad4u.configs.all];
```

That shape is intentional: the package behaves like an ESLint plugin preset, so you can compose it with local config entries instead of letting it take over the entire file:

```js
import nick2bad4u from "eslint-config-nick2bad4u";

export default [
    ...nick2bad4u.configs.all,
    {
        name: "Local overrides",
        rules: {
            "no-console": "off",
        },
    },
];
```

Available presets:

- `nick2bad4u.configs.all` - full shared config, including packaged Typefest and Etc-Misc source rules.
- `nick2bad4u.configs.recommended` - alias for `all`.
- `nick2bad4u.configs.base` - shared config without the explicit source-rule plugin sections.
- `nick2bad4u.configs.withoutCopilot` - full shared config without Copilot rules.
- `nick2bad4u.configs.withoutTypefest` - full shared config without the Typefest source-rule section.
- `nick2bad4u.configs.withoutEtcMisc` - full shared config without the Etc-Misc source-rule section.
- `nick2bad4u.configs.withoutTsconfig` - reserved for the upcoming `eslint-plugin-tsconfig` integration.

## Configure project roots / TypeScript projects

By default, TypeScript-aware rules resolve projects from `process.cwd()` and try these files:

- `./tsconfig.eslint.json`
- `./tsconfig.json`
- `./tsconfig.build.json`
- `./tsconfig.js.json`

Override that when a repo has different config names:

```js
import { createConfig } from "eslint-config-nick2bad4u";

export default createConfig({
    rootDirectory: import.meta.dirname,
    tsconfigPaths: ["./tsconfig.eslint.json", "./tsconfig.json"],
});
```

You can also set `ESLINT_CONFIG_ROOT` if you need to drive the root from the environment.

## Dogfood a local ESLint plugin

The shared config imports `eslint-plugin-typefest` from npm by default. In the `eslint-plugin-typefest` repo, use the preset without packaged Typefest and then add the local plugin section:

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

If your local plugin is built to `dist/plugin.js`, use that instead:

```js
import nick2bad4u from "eslint-config-nick2bad4u";
import localTypefest from "./dist/plugin.js";

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

## Disable a plugin from the shared config

Use a preset that omits the source-rule section you do not want:

```js
import nick2bad4u from "eslint-config-nick2bad4u";

export default [...nick2bad4u.configs.withoutTypefest];
```

For advanced cases, `createConfig(options)` is still exported. Use it when you need custom `rootDirectory`, custom `tsconfigPaths`, or dynamic plugin disables/replacements.

The same pattern works for dogfooding any local plugin with a matching `without*` preset. For example, in `eslint-plugin-copilot`:

```js
import nick2bad4u from "eslint-config-nick2bad4u";
import localCopilot from "./plugin.mjs";

export default [
    ...nick2bad4u.configs.withoutCopilot,
    {
        files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
        name: "Local Copilot rules",
        plugins: {
            copilot: localCopilot,
        },
        rules: {
            ...localCopilot.configs.all.rules,
        },
    },
];
```

## Optional JSON schema validation

JSON/YAML schema validation is off by default because schema fetching can make lint runs flaky/offline-hostile. To opt in, install `eslint-plugin-json-schema-validator` in the consuming repo and set:

```sh
ENABLE_JSON_SCHEMA_VALIDATION=1 eslint .
```

## Progress output

`eslint-plugin-file-progress-2` is enabled. Control it with `ESLINT_PROGRESS`:

- unset / `on`: show progress and file names
- `nofile`: show progress without file names
- `off`, `0`, or `false`: disable progress

## Development checks

Use the aggregate scripts before publishing or opening a pull request:

```sh
npm run lint:all
npm run release:verify
```

The release verification pipeline runs typechecking, Vitest tests, ESLint,
Prettier, package sorting/linting, `publint`, ATTW in ESM-only mode, YAML lint,
`actionlint`, and Secretlint. Release notes are generated with `git-cliff` via
the `changelog:*` scripts.
