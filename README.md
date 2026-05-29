# eslint-config-nick2bad4u

[![npm license.](https://flat.badgen.net/npm/license/eslint-config-nick2bad4u?color=purple)](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/blob/main/LICENSE) [![npm total downloads.](https://flat.badgen.net/npm/dt/eslint-config-nick2bad4u?color=pink)](https://www.npmjs.com/package/eslint-config-nick2bad4u) [![latest GitHub release.](https://flat.badgen.net/github/release/Nick2bad4u/eslint-config-nick2bad4u?color=cyan)](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/releases) [![GitHub stars.](https://flat.badgen.net/github/stars/Nick2bad4u/eslint-config-nick2bad4u?color=yellow)](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/stargazers) [![GitHub forks.](https://flat.badgen.net/github/forks/Nick2bad4u/eslint-config-nick2bad4u?color=green)](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/forks) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/Nick2bad4u/eslint-config-nick2bad4u?color=red)](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/issues) [![codecov.](https://codecov.io/gh/Nick2bad4u/eslint-config-nick2bad4u/branch/main/graph/badge.svg)](https://codecov.io/gh/Nick2bad4u/eslint-config-nick2bad4u)

Shared ESM-only [ESLint flat config](https://eslint.org/docs/latest/use/configure/configuration-files)
for Nick2bad4u ESLint plugin projects.

This package centralizes the lint stack used across those repositories: TypeScript-aware
ESLint configuration, Markdown/JSON/YAML/CSS-adjacent linting, package checks,
prose checks, and project-specific plugin presets. Consumers bring `eslint` and
`typescript` as peer dependencies; this package brings the ESLint plugins and
parsers that the shared config enables.

## Requirements

| Tool | Supported range | Why it is required |
| --- | --- | --- |
| Node.js | `>=22.0.0` | Runtime for ESLint, the config package, and repository scripts. |
| ESLint | `^10.4.0` | Peer dependency supplied by each consuming project. |
| TypeScript | `^5.0.0 \|\| ^6.0.3` | Peer dependency used by TypeScript-aware lint rules. |

Repository development also expects npm `>=11.0.0`; consumers can use the package
with whatever package manager their project supports.

## Install

```sh
npm install --save-dev eslint-config-nick2bad4u eslint typescript
```

Keep `eslint` and `typescript` installed in the consuming project so peer
dependency resolution stays explicit and predictable.

## Quick start

Create `eslint.config.mjs` in the consuming project:

```js
import nick2bad4u from "eslint-config-nick2bad4u";

export default [...nick2bad4u.configs.all];
```

The spread is intentional. Every preset is an ESLint flat-config array, so
spreading it lets you append local overrides without replacing the shared config:

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

If you prefer named imports, use `presets`:

```js
import { presets } from "eslint-config-nick2bad4u";

export default [...presets.all];
```

For migration steps from an existing hand-written config, see the
[migration guide](./docs/migration.md).

## Documentation

Long-form project documentation lives in [`docs/`](./docs/index.md).

| Guide | Use it for |
| --- | --- |
| [Configuration](./docs/configuration.md) | `createConfig()`, presets, plugin replacement, and environment variables. |
| [Migration](./docs/migration.md) | Moving a project from a hand-written flat config to this package. |
| [Contributing](./CONTRIBUTING.md) | Local development workflow and pull request expectations. |
| [Maintainer guide](./docs/maintainer-guide.md) | Rule, preset, dependency, and release maintenance. |
| [Support](./SUPPORT.md) | Issue triage and reproduction details. |
| [Security](./SECURITY.md) | Private vulnerability reporting. |
| [Code of conduct](./CODE_OF_CONDUCT.md) | Participation standards for the project. |

## `createConfig()`

Use `createConfig()` when a project needs to customize root resolution,
TypeScript project files, or plugin replacement/disabling while keeping the
shared defaults:

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

| Option | Type | Default | Use it when |
| --- | --- | --- | --- |
| `allowDefaultProjectFilePatterns` | `readonly string[]` | `["*.mjs", ".*.mjs"]` | Root config files are intentionally outside `tsconfigPaths`; do not include files already covered by your lint tsconfig. |
| `rootDirectory` | `string` | `process.cwd()` | ESLint runs outside the project root or a monorepo package needs its own root. |
| `tsconfigPaths` | `readonly string[]` | `["./tsconfig.eslint.json"]` | The project uses a differently named lint tsconfig or a truly separate TypeScript project. |
| `plugins` | `Readonly<Record<string, unknown>>` | `{}` | You need to dogfood a local plugin build or disable packaged plugin rules by namespace. |

An example copy-paste config is available at
[`examples/eslint.config.create.mjs`](./examples/eslint.config.create.mjs).
Detailed configuration examples live in the
[configuration guide](./docs/configuration.md).

## Available presets

All presets are available from the default export as `nick2bad4u.configs.*` and
from the named `presets` export.

| Preset | Purpose |
| --- | --- |
| `all` | Full shared config, including packaged Typefest and Etc-Misc source-rule sections. |
| `recommended` | Alias for `all`; provided for familiar preset naming. |
| `base` | Shared config without explicit source-rule plugin sections. |
| `withoutCopilot` | Full shared config without Copilot rules. |
| `withoutDocusaurus2` | Full shared config without Docusaurus 2 plugin rules. |
| `withoutEtcMisc` | Full shared config without the Etc-Misc source-rule section. |
| `withoutFileProgress2` | Full shared config without File Progress 2 rules. |
| `withoutGitHubActions2` | Full shared config without GitHub Actions 2 rules. |
| `withoutGithubActions2` | Deprecated alias for `withoutGitHubActions2`. |
| `withoutImmutable2` | Full shared config without Immutable 2 rules. |
| `withoutRemark` | Full shared config without Remark plugin rules. |
| `withoutRepo` | Full shared config without Repo plugin rules. |
| `withoutRuntimeCleanup` | Full shared config without Runtime Cleanup plugin rules. |
| `withoutSdl2` | Full shared config without SDL 2 rules. |
| `withoutStylelint2` | Full shared config without Stylelint 2 rules. |
| `withoutTestSignal` | Full shared config without Test Signal plugin rules. |
| `withoutTsconfig` | Full shared config without tsconfig-validation rules. |
| `withoutTsdocRequire2` | Full shared config without TSDoc Require 2 rules. |
| `withoutTypedoc` | Full shared config without TypeDoc rules. |
| `withoutTypefest` | Full shared config without the Typefest source-rule section. |
| `withoutVite` | Full shared config without Vite plugin rules. |
| `withoutWriteGoodComments2` | Full shared config without Write Good Comments 2 rules. |

Use a `without*` preset when a repository does not use that surface or when it
needs to provide a local build of that plugin for dogfooding.

## TypeScript project setup

The default TypeScript-aware configuration resolves from `process.cwd()` and
expects `./tsconfig.eslint.json`. That project should include every file ESLint
can lint: source, tests, scripts, dotfiles, examples, and docs tooling.

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

One catch-all lint tsconfig is easier to maintain than multiple narrow projects.
The `"**/.*"` include matters because dotfiles such as `.secretlintrc.cjs` are
not matched by extension globs like `**/*.cjs`.

Set `ESLINT_CONFIG_ROOT` only when you need to drive the root directory from the
environment instead of passing `rootDirectory` to `createConfig()`.

## Local plugin dogfooding

Use the matching `without*` preset, then append the local plugin registration.
For example, an `eslint-plugin-typefest` checkout can use its local plugin build
without also enabling the packaged Typefest rules:

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

Use the same shape for other plugin namespaces, such as `withoutCopilot`,
`withoutEtcMisc`, or `withoutWriteGoodComments2`.

## Optional behavior

### JSON schema validation

Schema validation is disabled by default because schema fetching can make lint
runs flaky in offline or locked-down environments. To opt in, install an
ESLint-10-compatible `eslint-plugin-json-schema-validator` in the consuming repo
and set the opt-in environment variable when running ESLint:

```sh
ENABLE_JSON_SCHEMA_VALIDATION=1 eslint .
```

### Progress output

`eslint-plugin-file-progress-2` is enabled by default. Control it with
`ESLINT_PROGRESS`:

| Value | Behavior |
| --- | --- |
| unset or `on` | Show progress and file names. |
| `nofile` | Show progress without file names. |
| `off`, `0`, or `false` | Disable progress output. |

## Development checks

Use the aggregate scripts before opening a pull request or publishing:

```sh
npm run lint:all
npm run release:verify
```

`lint:all` builds the runtime, runs ESLint, typechecks, runs Vitest, checks
Prettier formatting, validates package metadata and published package shape,
lints YAML, and runs Secretlint. `release:verify` adds the stricter no-cache lint
path, package checks with `publint` and ATTW, and sync checks for peer ranges and
Node version files.

Release notes are generated with `git-cliff` through the `changelog:*` scripts.
For contribution and maintenance workflows, see the
[contributing guide](./CONTRIBUTING.md) and
[maintainer guide](./docs/maintainer-guide.md). Historical wording diffs are
captured in [diff notes](./docs/diff-notes.md).

## Contributors

[![All Contributors](https://img.shields.io/github/all-contributors/Nick2bad4u/eslint-config-nick2bad4u?color=ee8449&style=flat-square)](#contributors)

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="25%"><a href="https://github.com/Nick2bad4u"><img src="https://avatars.githubusercontent.com/u/20943337?v=4?s=80" width="80px;" alt="Nick2bad4u"/><br /><sub><b>Nick2bad4u</b></sub></a><br /><a href="https://github.com/Nick2bad4u/eslint-config-nick2bad4u/issues?q=author%3ANick2bad4u" title="Bug reports">🐛</a> <a href="https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commits?author=Nick2bad4u" title="Code">💻</a> <a href="https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commits?author=Nick2bad4u" title="Documentation">📖</a> <a href="#ideas-Nick2bad4u" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-Nick2bad4u" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-Nick2bad4u" title="Maintenance">🚧</a> <a href="https://github.com/Nick2bad4u/eslint-config-nick2bad4u/pulls?q=is%3Apr+reviewed-by%3ANick2bad4u" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commits?author=Nick2bad4u" title="Tests">⚠️</a> <a href="#tool-Nick2bad4u" title="Tools">🔧</a></td>
      <td align="center" valign="top" width="25%"><a href="https://snyk.io/"><img src="https://avatars.githubusercontent.com/u/19733683?v=4?s=80" width="80px;" alt="Snyk bot"/><br /><sub><b>Snyk bot</b></sub></a><br /><a href="#security-snyk-bot" title="Security">🛡️</a> <a href="#infra-snyk-bot" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-snyk-bot" title="Maintenance">🚧</a> <a href="https://github.com/Nick2bad4u/eslint-config-nick2bad4u/pulls?q=is%3Apr+reviewed-by%3Asnyk-bot" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="25%"><a href="https://www.stepsecurity.io/"><img src="https://avatars.githubusercontent.com/u/89328645?v=4?s=80" width="80px;" alt="StepSecurity Bot"/><br /><sub><b>StepSecurity Bot</b></sub></a><br /><a href="#security-step-security-bot" title="Security">🛡️</a> <a href="#infra-step-security-bot" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-step-security-bot" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="25%"><a href="https://github.com/apps/dependabot"><img src="https://avatars.githubusercontent.com/in/29110?v=4?s=80" width="80px;" alt="dependabot[bot]"/><br /><sub><b>dependabot[bot]</b></sub></a><br /><a href="#infra-dependabot[bot]" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#security-dependabot[bot]" title="Security">🛡️</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="25%"><a href="https://github.com/apps/github-actions"><img src="https://avatars.githubusercontent.com/in/15368?v=4?s=80" width="80px;" alt="github-actions[bot]"/><br /><sub><b>github-actions[bot]</b></sub></a><br /><a href="https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commits?author=github-actions[bot]" title="Code">💻</a> <a href="#infra-github-actions[bot]" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
