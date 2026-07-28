# Configuration guide

This guide explains the runtime configuration surface exported by
`eslint-config-nick2bad4u`. Use it when the quick-start examples in the
[`README`](../README.md) are not enough for a consuming repository.

## Exports

The package exports an ESM default object and named helpers from the package root.

```js
import nick2bad4u, { createConfig, presets } from "eslint-config-nick2bad4u";
```

| Export               | Description                                                                             |
| -------------------- | --------------------------------------------------------------------------------------- |
| `nick2bad4u.configs` | Preset arrays available on the default export.                                          |
| `presets`            | Named export for the same preset arrays.                                                |
| `createConfig()`     | Factory for changing root resolution, import resolver projects, or plugin replacements. |

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
import {
 allowDefaultProjectFilePatternPresets,
 createConfig,
} from "eslint-config-nick2bad4u";

export default createConfig({
 allowDefaultProjectFilePatterns:
  allowDefaultProjectFilePatternPresets.rootScriptFiles,
 rootDirectory: import.meta.dirname,
});
```

| Option                            | Default                      | Guidance                                                                                                             |
| --------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `allowDefaultProjectFilePatterns` | Root JS/CJS/MJS globs        | Root globs passed to `parserOptions.projectService.allowDefaultProject`. Only include files outside `tsconfig.json`. |
| `jest`                            | `false`                      | Pass `true` to add Jest on standard test globs, or `{ files, version }` for custom Jest projects.                    |
| `next`                            | `false`                      | Pass `true` for standard Next.js roots or `{ files, rootDir }` for a monorepo.                                       |
| `rootDirectory`                   | `process.cwd()`              | Set this when ESLint runs from outside the package root.                                                             |
| `sonarjs`                         | `true`                       | Pass `false` to disable SonarJS, or `{ files }` to replace its standard code globs.                                  |
| `tsconfigPaths`                   | `["./tsconfig.eslint.json"]` | Import resolver project paths. The parser still uses project-service discovery of nearest `tsconfig.json`.           |
| `vitest`                          | `true`                       | Pass `false` to disable Vitest, or `{ files }` to replace its standard test and benchmark globs.                     |
| `plugins`                         | `{}`                         | Pass a plugin object to replace a namespace, or `false`/`null` to disable it.                                        |

### Browser compatibility

`eslint-plugin-compat` is registered under the `compat` namespace, while its
single `compat/compat` rule remains off by default. Browser compatibility
depends on the consuming project's supported browsers, so enable the rule only
after defining those targets in a dedicated
[Browserslist configuration file](https://github.com/browserslist/browserslist#config-file):

```js
import nick2bad4u from "eslint-config-nick2bad4u";

export default [
 ...nick2bad4u.configs.all,
 {
  files: ["src/**/*.{js,jsx,ts,tsx}"],
  name: "Project browser compatibility",
  rules: {
   "compat/compat": "warn",
  },
 },
];
```

Normal flat-config precedence changes the rule from `off` to `warn` for the
selected browser files. A `withoutCompat` preset is intentionally unnecessary:
projects that do not opt in receive no Compat diagnostics. The generic plugin
override can still remove its dormant registration with
`createConfig({ plugins: { compat: false } })`.

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

### Etc-Misc

The source-file section starts from Etc-Misc v3's published `all` rule
inventory, then applies this package's reviewed severities and ownership
overrides. Deprecated rules and React allocation/memoization checks are not
enabled. Where an upstream TypeScript, Unicorn, Perfectionist, React, or ESLint
core facility already owns a behavior, the Etc-Misc equivalent stays off so a
node receives one diagnostic.

React allocation checks can be enabled explicitly when a project still needs
them, and invalid void-element nesting remains owned by the React DOM rules.
Use `withoutEtcMisc` when a repository needs to remove the entire source-rule
section or register a local Etc-Misc build.

### Top-level await

The shared config prefers top-level `await` in ECMAScript modules and disables
`n/no-top-level-await`. Top-level `await` is a stable part of modern Node ESM,
while the Node rule enforces the narrower contract that published ESM must
remain synchronously loadable through `require(esm)`.

`unicorn/prefer-top-level-await` is disabled for `.cjs` and `.cts` files because
they are CommonJS. A library that deliberately promises synchronous
`require(esm)` interoperability should reverse both rules in the same published
ESM scope: enable `n/no-top-level-await` and disable
`unicorn/prefer-top-level-await`.

### Next.js

Next.js rules are opt-in because most consumers of this shared config are not
Next.js applications. Use the complete `withNext` preset for the standard
`app`, `pages`, `src/app`, and `src/pages` roots:

```js
import nick2bad4u from "eslint-config-nick2bad4u";

export default nick2bad4u.configs.withNext;
```

Use the factory when a monorepo needs custom file globs or
`settings.next.rootDir`. These settings solve different problems: `files`
controls which files ESLint matches, while `rootDir` tells the Next.js plugin
where its applications live. Relative `rootDir` globs resolve from ESLint's
working directory and are independent of this package's `rootDirectory` option.

```js
import { createConfig } from "eslint-config-nick2bad4u";

export default createConfig({
 next: {
  files: [
   "apps/*/app/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
   "apps/*/pages/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
   "apps/*/src/app/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
   "apps/*/src/pages/**/*.{js,jsx,mjs,cjs,ts,tsx,cts,mts}",
  ],
  rootDir: ["apps/*/"],
 },
});
```

### Jest and Vitest

Vitest is enabled by default and Jest is opt-in. The factory controls them
independently: enabling Jest does not disable Vitest, and each integration can
have its own file globs. The shared Testing Library and test override blocks use
the union of the enabled framework globs.

The `withJest` preset remains Jest-only for compatibility with its existing
behavior:

```js
import nick2bad4u from "eslint-config-nick2bad4u";

export default nick2bad4u.configs.withJest;
```

Use the factory to enable both frameworks. Give them disjoint file globs in a
mixed-runner monorepo so Jest and Vitest rules and globals do not apply to the
same files:

```js
import { createConfig } from "eslint-config-nick2bad4u";

export default createConfig({
 jest: {
  files: ["packages/jest/test/**/*.{js,jsx,ts,tsx}"],
  version: "30.0.0",
 },
 vitest: {
  files: ["packages/vitest/test/**/*.{js,jsx,ts,tsx}"],
 },
});
```

The Jest integration uses the complete `flat/all` config. Unlike `recommended`,
Jest can add rules to `all` in any release, so dependency updates can introduce
new diagnostics without a major `eslint-plugin-jest` version change.

Disable only Vitest with `createConfig({ vitest: false })` or the
`withoutVitest` preset. Passing both `jest: false` and `vitest: false` removes
both framework integrations while retaining the shared test-file overrides.

### SonarJS

SonarJS is enabled by default on JavaScript and TypeScript code files. The
shared config keeps upstream-deprecated rules disabled and turns off SonarJS
rules already owned by its core, TypeScript, RegExp, React, import, and test
plugins so one rule owns each diagnostic.

```js
import nick2bad4u from "eslint-config-nick2bad4u";

export default nick2bad4u.configs.withoutSonarJS;
```

Use the factory to disable it or narrow it to package source files. The former
`withSonarJS` preset remains as a deprecated alias for `all` so existing imports
continue to work.

```js
import { createConfig } from "eslint-config-nick2bad4u";

export default createConfig({
 sonarjs: {
  files: ["packages/*/src/**/*.{js,jsx,ts,tsx}"],
 },
});
```

### Vue

The Vue file block includes the recommended rules from
`eslint-plugin-vue-scoped-css` and `eslint-plugin-vuejs-accessibility`. They are
default-on because they apply only where the existing Vue SFC parser block
matches. Disable either namespace through the plugin override API when a Vue
project relies on dynamic selectors or another accessibility analyzer.

```js
import { createConfig } from "eslint-config-nick2bad4u";

export default createConfig({
 plugins: {
  "vue-scoped-css": false,
  "vuejs-accessibility": false,
 },
});
```

The TypeDoc package-header rule remains off in the shared preset because a
single generic source glob would incorrectly require `@packageDocumentation`
in every exporting module. Append a local override for each actual package
entrypoint instead.

### TypeScript projects

Typed linting uses TypeScript ESLint's project service. The parser looks for the
nearest `tsconfig.json` from the linted file, rooted at `rootDirectory`. That
project should cover every TypeScript-aware file ESLint can visit.

```json
{
 "$schema": "https://www.schemastore.org/tsconfig.json",
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

`tsconfigPaths` configures import resolution and related non-parser integrations.
It does not force the TypeScript parser project service to use
`tsconfig.eslint.json` instead of `tsconfig.json`.

Add another `tsconfigPaths` entry only when import resolution needs another
project file.

```js
import { createConfig } from "eslint-config-nick2bad4u";

export default createConfig({
 rootDirectory: import.meta.dirname,
 tsconfigPaths: ["./tsconfig.eslint.json", "./tsconfig.benchmarks.json"],
});
```

### Default-project fallback patterns

The shared config opts root-only JavaScript file globs into
`parserOptions.projectService.allowDefaultProject` by default. Prefer including
lint-visible nested files in `tsconfig.json`. Use the option only for a small
number of root files that intentionally stay outside the TypeScript project.

```js
import {
 allowDefaultProjectFilePatternPresets,
 createConfig,
} from "eslint-config-nick2bad4u";

export default createConfig({
 allowDefaultProjectFilePatterns:
  allowDefaultProjectFilePatternPresets.rootConfigFiles,
 rootDirectory: import.meta.dirname,
});
```

Available pattern presets:

| Pattern preset                                           | Globs                                                                                                                  | Use it when                                                       |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `allowDefaultProjectFilePatternPresets.defaultRootFiles` | `*.{js,mjs,cjs}`, `.*.{js,mjs,cjs}`                                                                                    | You want the packaged default root-only fallback.                 |
| `allowDefaultProjectFilePatternPresets.rootScriptFiles`  | `*.{js,mjs,cjs,ts,mts,cts}`, `.*.{js,mjs,cjs,ts,mts,cts}`                                                              | Any root script files intentionally stay outside `tsconfig.json`. |
| `allowDefaultProjectFilePatternPresets.rootConfigFiles`  | `*.config.{js,mjs,cjs,ts,mts,cts}`, `*.config.*.{js,mjs,cjs,ts,mts,cts}`, `.*rc.{js,mjs,cjs,ts,mts,cts}`, `preset.mjs` | Root config files intentionally stay outside `tsconfig.json`.     |
| `allowDefaultProjectFilePatternPresets.rootMjsFiles`     | `*.mjs`, `.*.mjs`                                                                                                      | You need compatibility with the previous root-`.mjs` fallback.    |

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

| Variable             | Values                                     | Effect                                                                      |
| -------------------- | ------------------------------------------ | --------------------------------------------------------------------------- |
| `ESLINT_CONFIG_ROOT` | path string                                | Fallback root directory when `createConfig({ rootDirectory })` is not used. |
| `ESLINT_PROGRESS`    | unset, `on`, `nofile`, `off`, `0`, `false` | Controls file progress output.                                              |

## Validation after configuration changes

Run these commands in the consuming project after changing `eslint.config.mjs`,
`tsconfig.json`, or import resolver project paths.
If a file is missing from typed linting, first fix the nearest `tsconfig.json`;
use `allowDefaultProjectFilePatterns` only for a small number of root config
files that should intentionally stay outside the TypeScript project.

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
