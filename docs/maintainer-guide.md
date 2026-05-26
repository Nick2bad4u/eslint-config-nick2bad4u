# Maintainer guide

This guide is the maintainer runbook for changing rules, plugin packages,
presets, public types, and release validation in `eslint-config-nick2bad4u`.

## Source-of-truth map

| Surface | Source of truth | Keep synchronized with |
| --- | --- | --- |
| Runtime config blocks and preset construction | [`src/shared-config.ts`](../src/shared-config.ts) | [`test/preset.test.ts`](../test/preset.test.ts), [`README.md`](../README.md), [migration guide](./migration.md) |
| Public runtime entry point | [`src/preset.ts`](../src/preset.ts) | [`index.d.ts`](../index.d.ts), [`package.json`](../package.json) exports |
| Published type contract | [`index.d.ts`](../index.d.ts) | [`src/preset.ts`](../src/preset.ts), [`src/shared-config.ts`](../src/shared-config.ts), README examples |
| Package metadata, scripts, peers, dependencies, published files | [`package.json`](../package.json) | README requirements, migration steps, release checks |
| Preset behavior | [`test/preset.test.ts`](../test/preset.test.ts) | [`README.md`](../README.md), [configuration guide](./configuration.md), [migration guide](./migration.md) |
| Consumer documentation | [`README.md`](../README.md), [configuration guide](./configuration.md) | Public API and current package scripts |
| Migration documentation | [migration guide](./migration.md) | Peer ranges, bundled dependencies, preset names |

Do not patch generated output to make checks pass. Fix the source, config, or
generator workflow instead.

## Add or edit rules

1. Locate the narrowest existing config block that matches the target files.
2. Prefer updating a scoped block over adding a broad global rule.
3. Register plugin namespaces in the same config entry that enables their rules
   unless the existing structure intentionally shares that plugin registration.
4. Keep type-aware rules inside TypeScript parser-aware entries that have access
   to the configured TypeScript project.
5. Add short comments only when the reason would not be obvious to a maintainer
   reviewing the rule later.
6. Update tests when the rule affects preset composition, plugin registration,
   parser options, globals, or dogfooding behavior.
7. Update docs when consumers need to know about a new requirement, preset,
   environment variable, or migration step.

Recommended checks:

```sh
npm run test
npm run typecheck
npm run lint
```

## Add a plugin package

1. Add the plugin to `dependencies` in `package.json`, not `devDependencies`, if
   consumers need the rule package at runtime through this config.
2. Import and register the plugin in `src/shared-config.ts`.
3. Enable rules under the plugin's actual ESLint namespace.
4. Confirm every enabled rule namespace has a matching plugin registration.
5. Decide whether consumers need a `without*` preset for the plugin.
6. Update `test/preset.test.ts` to cover plugin usage and removal behavior.
7. Update docs:
   - [`README.md`](../README.md) preset table and configuration guidance.
   - [Configuration guide](./configuration.md) if the plugin changes dogfooding or disabling
     behavior.
   - [Migration guide](./migration.md) if consumers should uninstall a direct dependency or change
     config during migration.

Run package checks after dependency changes:

```sh
npm run lint:package:strict
npm run lint:all
```

## Add a `without*` preset

Add a dedicated `without*` preset when consumers need to dogfood a local plugin
build, disable a costly surface, or adopt the shared config in stages.

Required touchpoints:

1. Add the preset construction in `src/shared-config.ts`.
2. Re-export or map the preset through `src/preset.ts` if the entry point needs
   an explicit update.
3. Add the property to `Nick2Bad4UEslintConfigPresets` in `index.d.ts`.
4. Add the preset and namespace pair to `test/preset.test.ts`.
5. Document the preset in [`README.md`](../README.md).
6. Update the [configuration guide](./configuration.md) when the preset affects common configuration
   or dogfooding guidance.
7. Update the [migration guide](./migration.md) when the preset helps migration from direct plugin
   installs.

Example shape:

```js
withoutMyPlugin: createConfig({
    plugins: {
        "my-plugin": false,
    },
}),
```

Consumer dogfooding shape:

```js
import nick2bad4u from "eslint-config-nick2bad4u";
import localPlugin from "./plugin.mjs";

export default [
    ...nick2bad4u.configs.withoutMyPlugin,
    {
        files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
        name: "Local MyPlugin rules",
        plugins: {
            "my-plugin": localPlugin,
        },
        rules: {
            ...localPlugin.configs.recommended.rules,
        },
    },
];
```

## Update public types or package exports

Treat `index.d.ts`, `package.json` exports, and the built `dist/` entry points as
one contract. If one changes, verify the others still describe the same runtime
surface.

Required checks:

```sh
npm run build
npm run typecheck
npm run lint:package:strict
```

`lint:package:strict` includes package dry-run validation, `publint`, ATTW,
package JSON linting, and package JSON sort checks.

## Release readiness

Run the full release gate before publishing or tagging a release:

```sh
npm run release:verify
```

The release gate builds runtime output, runs Vitest, runs no-cache linting,
typechecks every configured TypeScript project, checks Prettier formatting,
validates package metadata and package shape, lints YAML, runs Secretlint, and
checks synchronized peer ranges and Node version files.

Preview release notes before publishing:

```sh
npm run changelog:preview
```

Generate the changelog only through the configured `git-cliff` scripts. Do not
hand-edit generated changelog output unless the release process explicitly calls
for a manual correction.

## Generated and managed content

- Do not edit the all-contributors table in `README.md` by hand.
- Do not patch `dist/`, coverage output, cache folders, or docs build output.
- Use package sync scripts for peer ranges and Node version files.
- Keep examples and docs aligned with Flat Config only.

If a validation command exposes stale generated output, fix the source or run the
repo-owned generator/sync script that owns that output.
