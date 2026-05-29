# Migration guide — `eslint-config-nick2bad4u`

This guide walks a project from a local hand-written ESLint flat config to the
shared `eslint-config-nick2bad4u` package.

## Prerequisites

- Node.js `>=22.0.0`
- ESLint `^10.4.0`
- TypeScript `^5.0.0 || ^6.0.3`
- npm, pnpm, or yarn support for installing peer dependencies
- A project-level `tsconfig.eslint.json` for type-aware linting

Keep `eslint` and `typescript` installed in the consuming project. They are peer
dependencies so each repository controls its own compiler and linter versions.

## Step 1 — Review direct lint dependencies

The shared config ships the ESLint plugins, parsers, and helper configs it uses.
After replacing your local config, remove direct dependencies that were only
needed by the old local config. Keeping unused direct copies increases version
drift and makes migrations harder to review.

Run this only after confirming the project no longer imports these packages from
its own config files:

```powershell
# Run from the target project root.
$bundledLintPackages = @(
    "@docusaurus/eslint-plugin",
    "@eslint-community/eslint-plugin-eslint-comments",
    "@eslint-react/eslint-plugin",
    "@eslint/config-helpers",
    "@eslint/css",
    "@eslint/js",
    "@eslint/json",
    "@eslint/markdown",
    "@html-eslint/eslint-plugin",
    "@html-eslint/parser",
    "@next/eslint-plugin-next",
    "@stylistic/eslint-plugin",
    "@typpi/eslint-plugin-vite",
    "@vitest/eslint-plugin",
    "eslint-config-flat-gitignore",
    "eslint-config-prettier",
    "eslint-import-resolver-node",
    "eslint-import-resolver-typescript",
    "eslint-plugin-array-func",
    "eslint-plugin-astro",
    "eslint-plugin-canonical",
    "eslint-plugin-case-police",
    "eslint-plugin-comment-length",
    "eslint-plugin-copilot",
    "eslint-plugin-css-modules",
    "eslint-plugin-de-morgan",
    "eslint-plugin-depend",
    "eslint-plugin-docusaurus-2",
    "eslint-plugin-eslint-plugin",
    "eslint-plugin-etc-misc",
    "eslint-plugin-file-progress-2",
    "eslint-plugin-github-actions-2",
    "eslint-plugin-immutable-2",
    "eslint-plugin-import-x",
    "eslint-plugin-jsdoc",
    "eslint-plugin-jsonc",
    "eslint-plugin-listeners",
    "eslint-plugin-math",
    "eslint-plugin-module-interop",
    "eslint-plugin-n",
    "eslint-plugin-nitpick",
    "eslint-plugin-no-barrel-files",
    "eslint-plugin-no-unsanitized",
    "eslint-plugin-node-dependencies",
    "eslint-plugin-package-json",
    "eslint-plugin-perfectionist",
    "eslint-plugin-playwright",
    "eslint-plugin-prettier",
    "eslint-plugin-promise",
    "eslint-plugin-regexp",
    "eslint-plugin-remark",
    "eslint-plugin-repo",
    "eslint-plugin-runtime-cleanup",
    "eslint-plugin-sdl-2",
    "eslint-plugin-security",
    "eslint-plugin-storybook",
    "eslint-plugin-stylelint-2",
    "eslint-plugin-test-signal",
    "eslint-plugin-testing-library",
    "eslint-plugin-toml",
    "eslint-plugin-tsconfig",
    "eslint-plugin-tsdoc",
    "eslint-plugin-tsdoc-require-2",
    "eslint-plugin-typedoc",
    "eslint-plugin-typefest",
    "eslint-plugin-undefined-css-classes",
    "eslint-plugin-unicorn",
    "eslint-plugin-vue",
    "eslint-plugin-write-good-comments-2",
    "eslint-plugin-yml",
    "globals",
    "jsonc-eslint-parser",
    "toml-eslint-parser",
    "typescript-eslint",
    "vue-eslint-parser",
    "yaml-eslint-parser"
)

npm uninstall @($bundledLintPackages)
```

Do not uninstall `eslint` or `typescript`. If the project still imports a listed
package outside ESLint configuration, keep that direct dependency.

## Step 2 — Install the shared config

```powershell
npm install --save-dev eslint-config-nick2bad4u eslint typescript
```

Verify peer dependencies resolve from the consuming project:

```powershell
npm ls eslint typescript
```

## Step 3 — Replace `eslint.config.mjs`

Remove the old root ESLint config files after saving any local overrides you need
to re-apply:

```powershell
Remove-Item "eslint.config.mjs", "eslint.config.js", "eslint.config.cjs" -ErrorAction SilentlyContinue
```

Use the default preset for a normal migration:

```js
import nick2bad4u from "eslint-config-nick2bad4u";

export default [...nick2bad4u.configs.all];
```

Append project-specific overrides after the shared preset:

```js
import nick2bad4u from "eslint-config-nick2bad4u";

export default [
    ...nick2bad4u.configs.all,
    {
        files: ["scripts/**/*.mjs"],
        name: "Project script overrides",
        rules: {
            "no-console": "off",
        },
    },
];
```

Use `createConfig()` when the project needs explicit root or TypeScript project
settings:

```js
import { createConfig } from "eslint-config-nick2bad4u";

export default createConfig({
    rootDirectory: import.meta.dirname,
    tsconfigPaths: ["./tsconfig.eslint.json"],
});
```

Use a `without*` preset when one plugin surface should be removed:

```js
import { presets } from "eslint-config-nick2bad4u";

export default [...presets.withoutDocusaurus2];
```

To remove more than one namespace, prefer `createConfig({ plugins })` instead of
stacking multiple complete presets:

```js
import { createConfig } from "eslint-config-nick2bad4u";

export default createConfig({
    rootDirectory: import.meta.dirname,
    plugins: {
        "docusaurus-2": false,
        vite: false,
    },
});
```

## Step 4 — Create `tsconfig.eslint.json`

The shared config uses type-aware rules. The lint tsconfig should include every
file ESLint can visit, including JavaScript config files and dotfiles.

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

The `"**/.*"` include is required for dotfiles such as `.secretlintrc.cjs`.
Extension globs such as `**/*.cjs` do not match those files.

If TypeScript misses a specific config file because a sibling declaration file
changes module detection, add that file explicitly:

```json
{
    "files": ["stylelint.config.mjs"],
    "include": ["**/*", "**/.*"]
}
```

## Step 5 — Verify the migration

```powershell
npm run typecheck
npm run lint
npm run test
```

If the target project does not have all of those scripts, run the closest local
equivalents and run ESLint directly:

```powershell
npx eslint .
```

## Available presets

All presets are exposed on the default export as `.configs` and as the named
`presets` export.

| Preset | Description |
| --- | --- |
| `all` | Full shared config, including packaged Typefest and Etc-Misc source-rule sections. |
| `recommended` | Alias for `all`. |
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

## Local plugin dogfooding

Use the matching `without*` preset, then append the local plugin registration.
This prevents the packaged plugin and the local plugin from registering the same
namespace.

```js
import nick2bad4u from "eslint-config-nick2bad4u";
import typefest from "./plugin.mjs";

export default [
    ...nick2bad4u.configs.withoutTypefest,
    {
        files: ["src/**/*.{ts,tsx,mts,cts}"],
        name: "Local Typefest rules",
        plugins: {
            typefest,
        },
        rules: {
            ...typefest.configs.experimental.rules,
        },
    },
];
```

The same pattern applies to other namespaces with matching `without*` presets.

## Troubleshooting

### Peer dependency warnings

Install or update the peer dependencies in the consuming project:

```powershell
npm install --save-dev eslint@^10.4.0 typescript@^6.0.3
```

TypeScript `^5.0.0` is also supported when the project has not migrated to
TypeScript 6.

### `parserOptions.project` file-not-found errors

The lint tsconfig does not include the file ESLint is checking. Add `"**/*"` and
`"**/.*"` to `include`, then confirm the file is not excluded by the lint
tsconfig or a parent config.

### Duplicate plugin or duplicate rule behavior

Remove direct plugin dependencies that the old local config used, or switch to a
matching `without*` preset when dogfooding a local plugin build. Do not register
the same namespace twice in the final flat-config array.

### `Multiple projects found, consider using a single tsconfig`

The default migration path uses one `tsconfig.eslint.json`. If this warning
appears, review custom `tsconfigPaths` and merge them unless the extra project
has required compiler settings that cannot live in the catch-all lint project.

### `import-x/no-named-as-default-member` on `nick2bad4u.configs`

Use the named `presets` export in configs where that rule is enabled:

```js
import { presets } from "eslint-config-nick2bad4u";

export default [...presets.all];
```

### Optional schema validation does not run

Schema validation is opt-in. Install an ESLint-10-compatible
`eslint-plugin-json-schema-validator` in the consuming repository and run ESLint
with the opt-in environment variable:

```powershell
$env:ENABLE_JSON_SCHEMA_VALIDATION = "1"
npx eslint .
```

## PowerShell quick-migration script

Review this script before running it. It overwrites `eslint.config.mjs` in the
target project.

```powershell
param(
    [Parameter(Mandatory)] [string] $ProjectPath
)

Set-Location $ProjectPath

$bundledLintPackages = @(
    "@eslint/css",
    "@eslint/json",
    "@eslint/markdown",
    "@html-eslint/eslint-plugin",
    "@html-eslint/parser",
    "@stylistic/eslint-plugin",
    "eslint-config-prettier",
    "eslint-plugin-canonical",
    "eslint-plugin-comment-length",
    "eslint-plugin-de-morgan",
    "eslint-plugin-eslint-comments",
    "eslint-plugin-eslint-plugin",
    "eslint-plugin-import-x",
    "eslint-plugin-jsdoc",
    "eslint-plugin-jsonc",
    "eslint-plugin-math",
    "eslint-plugin-n",
    "eslint-plugin-perfectionist",
    "eslint-plugin-prettier",
    "eslint-plugin-promise",
    "eslint-plugin-regexp",
    "eslint-plugin-security",
    "eslint-plugin-testing-library",
    "eslint-plugin-unicorn",
    "eslint-plugin-write-good-comments-2",
    "typescript-eslint"
)

npm uninstall @($bundledLintPackages)
npm install --save-dev eslint-config-nick2bad4u eslint typescript

@'
import nick2bad4u from "eslint-config-nick2bad4u";

export default [
    ...nick2bad4u.configs.all,
];
'@ | Set-Content -Path "eslint.config.mjs" -Encoding utf8

npx eslint .

Write-Host 'Migration complete. Review eslint.config.mjs, tsconfig.eslint.json, and any project-specific overrides.' -ForegroundColor Green
```
