# Migration Guide — `eslint-config-nick2bad4u`

This guide walks you through migrating a project from a local hand-rolled ESLint
flat config to the shared `eslint-config-nick2bad4u` package.

---

## Prerequisites

- Node.js ≥ 22
- ESLint ≥ 10.2.1 (flat config, `eslint.config.mjs`)
- TypeScript ≥ 5.0 (peer dep — bring your own)
- A `tsconfig.eslint.json` in the project root (see step 4)

---

## Step 1 — Uninstall plugins now provided by the shared config

The shared config already bundles all of these as dependencies.
Installing them again separately causes duplicate copies and version drift.

```powershell
# Run from the target project root
$eslintPlugins = @(
    "@eslint/css",
    "@eslint/json",
    "@eslint/markdown",
    "@html-eslint/eslint-plugin",
    "@html-eslint/parser",
    "@stylistic/eslint-plugin",
    "@typescript-eslint/eslint-plugin",
    "@typescript-eslint/parser",
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
    "eslint-plugin-no-only-tests",
    "eslint-plugin-perfectionist",
    "eslint-plugin-prefer-arrow",
    "eslint-plugin-prettier",
    "eslint-plugin-promise",
    "eslint-plugin-regexp",
    "eslint-plugin-security",
    "eslint-plugin-sonarjs",
    "eslint-plugin-testing-library",
    "eslint-plugin-unicorn",
    "eslint-plugin-unused-imports",
    "eslint-plugin-vitest",
    "eslint-plugin-write-good-comments",
    "typescript-eslint"
)

npm uninstall @($eslintPlugins)
```

Keep `eslint` itself — it is a peer dependency that the project must supply.

---

## Step 2 — Install the shared config

```powershell
npm install --save-dev eslint-config-nick2bad4u
```

Verify peer deps are satisfied:

```powershell
npm ls eslint typescript
```

---

## Step 3 — Replace `eslint.config.mjs`

Remove the old file and create a minimal one that delegates to the shared config:

```powershell
Remove-Item "eslint.config.mjs","eslint.config.js","eslint.config.cjs" -ErrorAction SilentlyContinue
```

There are two styles — pick the one that fits your repo.

---

### Style A — Spread (simple, good for repos with no extra overrides)

```js
import nick2bad4u from "eslint-config-nick2bad4u";

export default nick2bad4u.configs.all;
```

Drop specific plugin groups when they are irrelevant to your repo:

```js
import { presets } from "eslint-config-nick2bad4u";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...presets.withoutDocusaurus2,
    ...presets.withoutVite,
    // Add repository-specific config entries below as needed.
];

export default config;
```

To dogfood a local plugin (e.g. `eslint-plugin-typefest`), append your section
after spreading a `withoutX` preset:

```js
import nick2bad4u from "eslint-config-nick2bad4u";
import typefest from "./plugin.mjs";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...nick2bad4u.configs.withoutTypefest,

    // Local plugin config — lets you use the plugin's rules in this repo
    // without needing to publish it first.
    {
        files: ["src/**/*.{ts,tsx,mts,cts}"],
        name: "Local Typefest",
        plugins: {
            typefest,
        },
        rules: {
            // @ts-expect-error -- plugin.mjs is typed as generic ESLint.Plugin.
            ...typefest.configs.experimental.rules,
        },
    },
    // Add repository-specific config entries below as needed.
];

export default config;
```

---

### Style B — `createConfig` (preferred when you need option overrides)

Use this style when you need to customise:

- `rootDirectory` — project root for the TypeScript parser
- `tsconfigPaths` — which tsconfig files to use (e.g. add `tsconfig.docusaurus.json` for docs builds)
- `plugins` — swap out or disable specific plugin namespaces

```js
import { createConfig } from "eslint-config-nick2bad4u";

export default createConfig({
    rootDirectory: import.meta.dirname,
    tsconfigPaths: ["./tsconfig.eslint.json"],
});
```

To dogfood a local plugin via `createConfig`, pass it through the `plugins` option
and then append your section to the returned array:

```js
import { createConfig } from "eslint-config-nick2bad4u";
import typefest from "./plugin.mjs";

/** @type {import("eslint").Linter.Config[]} */
const config = [
    // Disable the packaged typefest namespace; we'll supply it ourselves below.
    ...createConfig({
        rootDirectory: import.meta.dirname,
        plugins: { typefest: false },
    }),

    // Local plugin config — lets you use the plugin's rules in this repo
    // without needing to publish it first.
    {
        files: ["src/**/*.{ts,tsx,mts,cts}"],
        name: "Local Typefest",
        plugins: {
            typefest,
        },
        rules: {
            // @ts-expect-error -- plugin.mjs is typed as generic ESLint.Plugin.
            ...typefest.configs.experimental.rules,
        },
    },
    // Add repository-specific config entries below as needed.
];

export default config;
```

To cover benchmark or docs script files that the default tsconfigs don't include,
add a tsconfig that includes them and pass it via `tsconfigPaths`:

```js
import { createConfig } from "eslint-config-nick2bad4u";

export default createConfig({
    rootDirectory: import.meta.dirname,
    tsconfigPaths: [
        "./tsconfig.eslint.json",
        "./tsconfig.json",
        "./tsconfig.build.json",
        "./tsconfig.js.json",
        "./tsconfig.benchmarks.json",
    ],
});
```

Available `createConfig` options:

| Option | Type | Default | Purpose |
|---|---|---|---|
| `rootDirectory` | `string` | `process.cwd()` | Repo root for `tsconfigRootDir` |
| `tsconfigPaths` | `string[]` | `["tsconfig.eslint.json", "tsconfig.json", "tsconfig.build.json", "tsconfig.js.json"]` | TS project files for type-aware rules |
| `plugins` | `Record<string, Plugin \| false \| null>` | `{}` | Swap out or disable plugins by namespace |

---

## Step 4 — Ensure `tsconfig.eslint.json` exists

The parser uses this file for type-aware rules.
Create it if missing — it should include every file ESLint will touch:

```json
{
    "$schema": "https://www.schemastore.org/tsconfig.json",
    "extends": "./tsconfig.json",
    "compilerOptions": {
        "noEmit": true
    },
    "include": [
        "*.mjs",
        "*.ts",
        "*.d.ts",
        "test/**/*.ts",
        "src/**/*.ts"
    ]
}
```

> **Note:** Root-level `.mjs`/`.cjs`/`.js` config files (e.g. `stylelint.config.mjs`,
> `prettier.config.mjs`) are handled automatically via `projectService.allowDefaultProject`
> in the shared config — you do **not** need to add them to every tsconfig.

---

## Step 5 — Verify

```powershell
# Type-check still passes
npm run typecheck

# ESLint passes with the new config
npm run lint

# Optional: check for fixable issues
npm run lint -- --fix
```

---

## Available presets

All presets are exposed on the default export (`.configs`) and as the `presets` named export.

| Preset | Description |
|---|---|
| `all` | Every rule and plugin enabled (alias: `recommended`) |
| `base` | Core TS/JS rules only, no optional plugins |
| `withoutChunkyLint` | Omits `eslint-plugin-chunky-lint` rules |
| `withoutCopilot` | Omits GitHub Copilot plugin rules |
| `withoutDocusaurus2` | Omits Docusaurus-specific config |
| `withoutEtcMisc` | Omits `eslint-plugin-etc` miscellaneous rules |
| `withoutFileProgress2` | Omits file-progress reporting plugin |
| `withoutGithubActions2` | Omits GitHub Actions YAML rules |
| `withoutImmutable2` | Omits immutability-enforcing rules |
| `withoutRepo` | Omits repo-specific rules |
| `withoutSdl2` | Omits SDL/security rules |
| `withoutStylelint2` | Omits Stylelint bridge rules |
| `withoutTsconfig` | Omits tsconfig-validation rules |
| `withoutTsdocRequire2` | Omits TSDoc `@param`/`@returns` requirements |
| `withoutTypedoc` | Omits TypeDoc comment rules |
| `withoutTypefest` | Omits `eslint-plugin-typefest` rules |
| `withoutUptimeWatcher` | Omits uptime-watcher-specific rules |
| `withoutVite` | Omits Vite config file rules |
| `withoutWriteGoodComments2` | Omits prose linting for comments |

---

## Troubleshooting

### `Parsing error: "parserOptions.project" has been provided … file not found`

Your `tsconfig.eslint.json` doesn't include the file being linted.
The shared config uses `projectService.allowDefaultProject` to handle root-level
`.mjs`/`.cjs`/`.js` files automatically, but if you see this on a `.ts` file,
add it to your `tsconfig.eslint.json` `include` array.

### `Multiple projects found, consider using a single tsconfig`

You are passing more than one path to `tsconfigPaths`. Reduce to a single
`tsconfig.eslint.json` that covers all linted files.

### `TS2883: The inferred type of 'default' cannot be named …`

This is a TypeScript declaration-emit issue in a consumer config. Add an explicit
type annotation to your `eslint.config.mjs` export, or upgrade to the latest
version of this package (fixed in 1.0.1+).

### `import-x/no-named-as-default-member` warning on `nick2bad4u.configs`

Use the `presets` named export instead of `nick2bad4u.configs` for named imports:

```js
import { presets } from "eslint-config-nick2bad4u";
```

---

## PowerShell quick-migration script

```powershell
param(
    [Parameter(Mandatory)][string]$ProjectPath
)

Set-Location $ProjectPath

# 1 — Remove bundled plugins
$plugins = @(
    "@eslint/css","@eslint/json","@eslint/markdown",
    "@html-eslint/eslint-plugin","@html-eslint/parser",
    "@stylistic/eslint-plugin","@typescript-eslint/eslint-plugin",
    "@typescript-eslint/parser","eslint-config-prettier",
    "eslint-plugin-canonical","eslint-plugin-comment-length",
    "eslint-plugin-de-morgan","eslint-plugin-eslint-comments",
    "eslint-plugin-eslint-plugin","eslint-plugin-import-x",
    "eslint-plugin-jsdoc","eslint-plugin-jsonc","eslint-plugin-math",
    "eslint-plugin-n","eslint-plugin-no-only-tests",
    "eslint-plugin-perfectionist","eslint-plugin-prefer-arrow",
    "eslint-plugin-prettier","eslint-plugin-promise",
    "eslint-plugin-regexp","eslint-plugin-security",
    "eslint-plugin-sonarjs","eslint-plugin-testing-library",
    "eslint-plugin-unicorn","eslint-plugin-unused-imports",
    "eslint-plugin-vitest","eslint-plugin-write-good-comments",
    "typescript-eslint"
)
npm uninstall @($plugins)

# 2 — Install shared config
npm install --save-dev eslint-config-nick2bad4u

# 3 — Write minimal config
@'
import nick2bad4u from "eslint-config-nick2bad4u";

export default nick2bad4u.configs.all;
'@ | Set-Content -Path "eslint.config.mjs" -Encoding utf8

# 4 — Verify
npm run lint
```
