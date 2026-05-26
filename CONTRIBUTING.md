# Contributing

Thanks for helping improve `eslint-config-nick2bad4u`. This repository ships a
shared ESLint flat config, so even small changes can affect every consuming
Nick2bad4u plugin project. Keep changes accurate, scoped, and verified.

## Prerequisites

- Node.js `>=22.0.0`
- npm `>=11.0.0` for repository development
- A clean install from the repository root:

  ```sh
  npm install
  ```

## Development workflow

1. Create a focused branch for one change type: config behavior, dependency
   updates, documentation, or release tooling.
2. Read the relevant source-of-truth files before editing:
   - `package.json` for scripts, package metadata, dependencies, peers, engines,
     and published files.
   - `src/shared-config.ts` for runtime config blocks, plugin namespaces,
     environment variables, and preset construction.
   - `src/preset.ts` for the public runtime entry point.
   - `index.d.ts` for the published type contract.
   - `test/preset.test.ts` for behavior that public docs must match.
3. Make the smallest change that solves the problem.
4. Update tests and documentation in the same change when public behavior,
   preset names, package scripts, dependencies, or migration steps change.
5. Run the validation commands that match the surface you changed.

## Documentation expectations

Documentation changes are required when a change affects how consumers install,
configure, migrate, dogfood, or validate this package.

- Update [`README.md`](./README.md) for consumer-facing usage, requirements, presets, and
  common workflows.
- Update the [migration guide](./docs/migration.md) when installation, peer ranges, bundled plugins, or
  config examples change.
- Update the [maintainer guide](./docs/maintainer-guide.md) when maintainers need a new release, plugin,
  preset, or validation step.
- Keep examples Flat Config only; do not add legacy `.eslintrc` snippets.
- Do not edit generated all-contributors sections by hand.
- Do not patch generated output such as `dist/`, coverage reports, or docs build
  artifacts.

## Validation commands

Use the smallest reliable check while developing, then run the aggregate checks
before review.

| Change type | Recommended checks |
| --- | --- |
| Documentation only | `npm run lint:prettier`, `npm run lint`, `npm run lint:secretlint` |
| Config or preset behavior | `npm run test`, `npm run typecheck`, `npm run lint` |
| Package metadata, exports, or published files | `npm run lint:package:strict`, `npm run package:check` |
| Release readiness | `npm run release:verify` |

`npm run lint:all` is the normal pre-PR aggregate check. `npm run
release:verify` is the stricter release gate and includes no-cache linting,
package validation, and sync checks.

## Pull request checklist

- Keep the diff focused on one intent.
- Explain why a rule, plugin, dependency, or documentation change is needed.
- List the commands you ran and summarize the result.
- Include dogfooding notes when changing plugin replacement or `without*` preset
  behavior.
- Confirm public API touchpoints stay synchronized when preset names or exports
  change: `src/shared-config.ts`, `src/preset.ts`, `index.d.ts`,
  `test/preset.test.ts`, `README.md`, and `MIGRATION.md` when applicable.
- Use private vulnerability reporting from the [security policy](./SECURITY.md) for
  sensitive issues instead of opening a public pull request or issue with proof
  of concept details.
