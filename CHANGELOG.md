<!-- markdownlint-disable -->
<!-- eslint-disable markdown/no-missing-label-refs -->

# Changelog

All notable changes to this project will be documented in this file.

## What's Changed

- <b>Commit Range: ➡️</b> [`v3.3.3...ff85a07`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.3.3...ff85a075f9490192c1397714d95f51b57324d2ad "View full commit range on GitHub")

### 🧹 Chores

- [`ff85a07`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/ff85a075f9490192c1397714d95f51b57324d2ad "Diff: 1 file, +1 | -1") — 🔧 [chore] Keep JSCPD and Lychee out of lint all <sub><em>(1 file, +1, -1)</em></sub>

🔧 [chore] Leave the dedicated JSCPD and Lychee scripts available while keeping aggregate CI lint runs focused on existing gates.

- [`531124c`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/531124c924c79f838e3c73dfc301ff75d4ca8676 "Diff: 4 files, +171 | -236") — 🔧 [chore] Adopt shared validation configs <sub><em>(4 files, +171, -236)</em></sub>

🔧 [chore] Wire JSCPD, git-cliff, and Lychee through shared config packages.

👷 [ci] Point release-note generation at the shared git-cliff config where workflows invoke git-cliff directly.

## What's Changed in v3.3.3

- <b>Commit Range: ➡️</b> [`v3.3.2...v3.3.3`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.3.2...v3.3.3 "View full commit range on GitHub")

### 📦 Dependencies

- [`79e7b7d`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/79e7b7d468ce1eb239bcf6687c3fcf239d867e2f "Diff: 4 files, +106 | -102") — ⬆️ [build] Refresh React and Perfectionist lint plugins <sub><em>(4 files, +106, -102)</em></sub>

Update @eslint-react/eslint-plugin to 5.11.3 and eslint-plugin-perfectionist to 5.10.0.

Keep the composed preset aligned with ESLint inline config reporting and cover the linter options in preset tests.

### 🧹 Chores

- [`ac99169`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/ac991692fed92b1bd8a289492a186a4ad3ec7ff3 "Diff: 2 files, +3 | -3") — Release v3.3.3 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.3.2...v3.3.3

## What's Changed in v3.3.2

- <b>Commit Range: ➡️</b> [`v3.3.1...v3.3.2`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.3.1...v3.3.2 "View full commit range on GitHub")

### 📦 Dependencies

- [`4e8b784`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/4e8b784ef041c8841792ef24cf8c7633a85f4318 "Diff: 9 files, +1133 | -1060") — ⬆️ [build] Refresh lint dependency stack <sub><em>(9 files, +1133, -1060)</em></sub>

⬆️ [build] Update ESLint ecosystem dependencies and lockfile entries after the dependency refresh.

🔧 [build] Adopt updated Copilot, Runtime Cleanup, YAML, and TOML preset surfaces while keeping document language plugin registration explicit.

🚨 [fix] Use ESLint built-in unused-disable reporting instead of enabling the deprecated eslint-comments no-unused-disable rule.

🚨 [fix] Disable tombi/tombi for tool-owned TOML configs because the Tombi ESLint fixer can corrupt .tombi.toml and external tool TOML schemas are not fully available yet.

🧪 [test] Cover Copilot language plugin registration, Runtime Cleanup parser ownership, unused-disable reporting, and the scoped Tombi disables.

🧪 [test] Switch Vitest to the fork pool because Unicorn v71 loads web-worker code that is incompatible with Vitest worker_threads workerData.

### 🧹 Chores

- [`7d27117`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/7d27117e70a08c36bd713b8b94339918a7dfe580 "Diff: 2 files, +3 | -3") — Release v3.3.2 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.3.1...v3.3.2

## What's Changed in v3.3.1

- <b>Commit Range: ➡️</b> [`v3.3.0...v3.3.1`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.3.0...v3.3.1 "View full commit range on GitHub")

### 🛠️ Bug Fixes

- [`282f373`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/282f37343dbfc774379073940b198c99dababf29 "Diff: 5 files, +88 | -30") — 🐛 [fix] Align flat listener and TOML rules <sub><em>(5 files, +88, -30)</em></sub>

🐛 [fix] Consume eslint-plugin-listeners' flat strict config when available, preserving the legacy strict rule fallback for older package shapes.

🐛 [fix] Disable toml/array-bracket-newline by default because Tombi intentionally formats multiline arrays with bracket line breaks that the TOML stylistic rule rejects.

⬆️ [build] [dependency] Update eslint-plugin-listeners 1.6.0 so the shared config can use the plugin's ESLint flat-config surface.

🧪 [test] Cover the Listeners strict preset wiring and move array-bracket-newline into the TOML/Tombi conflict fixture set.

### 🧹 Chores

- [`074f27e`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/074f27ea55c74cc0d58739e25f8cd67e22de809b "Diff: 2 files, +3 | -3") — Release v3.3.1 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.3.0...v3.3.1

## What's Changed in v3.3.0

- <b>Commit Range: ➡️</b> [`v3.2.0...v3.3.0`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.2.0...v3.3.0 "View full commit range on GitHub")

### 📦 Dependencies

- [`0743ad7`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/0743ad78a82b5a37d08f2aa95767a39ad3b7423f "Diff: 8 files, +604 | -500") — ⬆️ [build] Refresh lint dependency stack <sub><em>(8 files, +604, -500)</em></sub>

⬆️ Update ESLint, formatting, Vite, Tombi, and support dependency ranges, including eslint-plugin-unicorn 70.0.0.

🐛 Preserve the public allowDefaultProjectFilePatternPresets export under Unicorn's stricter consistent-boolean-name rule while renaming private helpers that looked boolean.

👷 Update CodeQL action pins and sync Node version files to the configured minimum runtime.

🧪 Update preset/Tombi tests for the new rule configuration and helper naming.

### 🎨 Styling

- [`ccdcc5f`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/ccdcc5ff19a5cb5c3776dd39e7f564e02fb93cab "Diff: 1 file, +1 | -0") — 🎨 [style] Format source instructions <sub><em>(1 file, +1, -0)</em></sub>

🎨 Add the Prettier-required trailing blank line in src/AGENTS.md so the CI release verification pipeline matches the local verified tree.

### 🧹 Chores

- [`e3e900c`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/e3e900cc3f7df3795c9769dc9f9d84c13909df5e "Diff: 2 files, +3 | -3") — Release v3.3.0 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.2.0...v3.3.0

## What's Changed in v3.2.0

- <b>Commit Range: ➡️</b> [`v3.1.1...v3.2.0`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.1.1...v3.2.0 "View full commit range on GitHub")

### ✨ Features

- [`1fc60df`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/1fc60dff822a429bd6a9665ddea2ede484b09ef9 "Diff: 14 files, +864 | -256") — ✨ [feat] Enable Tombi TOML linting <sub><em>(14 files, +864, -256)</em></sub>

✨ [feat] Add eslint-plugin-tombi to the shared config and enable its all preset so Tombi becomes the TOML policy owner for formatting, linting, schema, and config-file validation.

🔧 [chore] Move TOML parsing to version 1.1.0, keep the compatible eslint-plugin-toml rules, and disable the duplicated or conflicting TOML style/order rules by default.

✨ [feat] Expose a withoutTombi preset for consumers that need the shared config without Tombi plugin rules.

🧪 [test] Add TOML/Tombi fixture coverage proving the enabled rule split, all Tombi rules, fixture linting, and the opt-out preset.

📝 [docs] Document the withoutTombi preset and add repository Tombi configuration fixtures.

### 🛠️ Bug Fixes

- [`d295a40`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/d295a40dd5f6a47f3b4b3c76b78ad1c33728bc2a "Diff: 1 file, +293 | -143") — 🐛 [fix] Keep git-cliff TOML release notes compatible <sub><em>(1 file, +293, -143)</em></sub>

🐛 [fix] Convert git-cliff object arrays from multiline inline tables to arrays-of-tables so Tombi formatting stays valid while git-cliff can still parse the release configuration.

🧪 [test] Verify release notes generation locally with git-cliff and rerun the full release verification gate on version 3.2.0.

### 🧹 Chores

- [`6ad4922`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/6ad4922e8d9613f1d4d32f657d90935592dfd347 "Diff: 2 files, +3 | -3") — Release v3.2.0 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.1.1...v3.2.0

## What's Changed in v3.1.1

- <b>Commit Range: ➡️</b> [`v3.1.0...v3.1.1`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.1.0...v3.1.1 "View full commit range on GitHub")

### 📦 Dependencies

- [`8ee33a1`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/8ee33a18c96ed4ebcb02ce6bd0f3d886ef733fad "Diff: 2 files, +8 | -8") — ⬆️ [build] Refresh shared Prettier config <sub><em>(2 files, +8, -8)</em></sub>

⬆️ [build] Updates prettier-config-nick2bad4u from ^1.0.19 to ^1.0.20 and refreshes the lockfile resolution.

🧹 [chore] Carries the transitive brace-expansion patch update from the dependency refresh without changing the public ESLint config surface.

### 🧹 Chores

- [`9778968`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/97789680a93f8991bc34c8aeb263c551fdf781b1 "Diff: 2 files, +3 | -3") — Release v3.1.1 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.1.0...v3.1.1

## What's Changed in v3.1.0

- <b>Commit Range: ➡️</b> [`v3.0.3...v3.1.0`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.0.3...v3.1.0 "View full commit range on GitHub")

### 📦 Dependencies

- [`dec9c22`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/dec9c22422d760c38b472939ded561c7f8b14e99 "Diff: 8 files, +467 | -245") — ⬆️ [build] Refresh lint dependencies and peer range policy <sub><em>(8 files, +467, -245)</em></sub>

⬆️ [build] Updates ESLint ecosystem dependencies, shared formatter/lint configs, and the lockfile while keeping package metadata sorted and validated.

🛠️ [fix] Keeps peerDependencies.eslint at the supported ^10.0.0 consumer floor instead of narrowing it to the current development dependency during patch/minor ESLint updates.

📝 [docs] Aligns README and migration guidance with the broad ESLint peer range, removes now-inherited yamllint overrides, allows the pinned Prettier dev range policy, and adds local VS Code launch configs for inspector/build watch workflows.

### 🧹 Chores

- [`104440f`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/104440f7384f16ea6c8ded7673f10eb65b6eb327 "Diff: 2 files, +3 | -3") — Release v3.1.0 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.0.3...v3.1.0

## What's Changed in v3.0.3

- <b>Commit Range: ➡️</b> [`v3.0.2...v3.0.3`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.0.2...v3.0.3 "View full commit range on GitHub")

### 🧹 Chores

- [`5d529de`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/5d529de0aa6d134d709d58cce3f062a148030810 "Diff: 2 files, +3 | -3") — Release v3.0.3 <sub><em>(2 files, +3, -3)</em></sub>

- [`9aa759a`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/9aa759a7f5eda1842805f69d4ab3ca01e1bd4111 "Diff: 2 files, +17 | -16") — 🔧 [chore] Update eslint-plugin-n and remark-config-nick2bad4u to latest versions <sub><em>(2 files, +17, -16)</em></sub>

- Upgraded "eslint-plugin-n" from "^18.1.0" to "^18.2.1" for improved linting capabilities.

- Updated "remark-config-nick2bad4u" from "^1.1.0" to "^1.1.1" for better markdown processing.

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.0.2...v3.0.3

## What's Changed in v3.0.2

- <b>Commit Range: ➡️</b> [`v3.0.1...v3.0.2`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.0.1...v3.0.2 "View full commit range on GitHub")

### ✨ Features

- [`35b3301`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/35b3301e42ef33f2d2a5f8e94439160ce26ddc86 "Diff: 9 files, +405 | -49") — ✨ [feat] Add Actionlint Secretlint and Yamllint presets <sub><em>(9 files, +405, -49)</em></sub>

✨ [feat] Wire eslint-plugin-actionlint, eslint-plugin-secretlint, and eslint-plugin-yamllint into the shared flat config using the same plugin override path as the existing dogfoodable plugins.

✨ [feat] Expose withoutActionlint, withoutSecretlint, and withoutYamllint presets so consumers can remove those rule namespaces when a repository does not use the related surface.

📝 [docs] Document the new presets in README and migration docs, and mirror the public preset surface in generated TypeScript declarations.

🧪 [test] Extend preset coverage for the new namespaces, rule removal, and local plugin replacement.

### 🚜 Refactor

- [`603d1e3`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/603d1e386db3ef4587fcd4215789cba5df4c79fd "Diff: 7 files, +763 | -325") — ♻️ [refactor] Support owned plugin replacement consistently <sub><em>(7 files, +763, -325)</em></sub>

♻️ [refactor] Resolve Nick-owned plugin blocks through createConfig plugin overrides, including alias-aware namespaces such as github-actions/github-actions-2, repo/repo-compliance, and write-good-comments/write-good-comments-2.

✨ [feat] Upgrade eslint-plugin-secretlint to v2 so its all config can run parser-neutral across code files while keeping raw-text parsing scoped to text-like files.

🧪 [test] Expand preset replacement coverage across owned plugin config shapes and strengthen the fixture smoke matrix to confirm configured plugins remain active without parser failures.

🧪 [test] Verified with npm run release:verify.

### 🧹 Chores

- [`edff311`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/edff311347d4dc108469e3f8000a482d16cb6c12 "Diff: 2 files, +3 | -3") — Release v3.0.2 <sub><em>(2 files, +3, -3)</em></sub>

- [`e610ba9`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/e610ba90daeb5b84dfbaa925254895708a9be8d1 "Diff: 2 files, +195 | -193") — 🔧 [chore] Update dependencies and add update-all script <sub><em>(2 files, +195, -193)</em></sub>

- ✨ Introduced a new script "update-all" to streamline the process of updating dependencies and actions.
- 🔄 Updated "@eslint-react/eslint-plugin" from "^5.9.2" to "^5.9.3" for improved linting capabilities.
- 🔄 Updated "eslint-plugin-regexp" from "^3.1.0" to "^3.1.1" to incorporate the latest fixes.
- 🔄 Updated "remark-config-nick2bad4u" from "^1.0.10" to "^1.1.0" for enhanced functionality.
- 🔄 Updated "stylelint" from "^17.13.0" to "^17.14.0" to ensure compatibility with the latest styles.

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.0.1...v3.0.2

## What's Changed in v3.0.1

- <b>Commit Range: ➡️</b> [`v3.0.0...v3.0.1`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.0.0...v3.0.1 "View full commit range on GitHub")

### 📝 Documentation

- [`71d31ae`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/71d31ae35a771de3cd913917a5661584e3ffb149 "Diff: 2 files, +6 | -6") — 📝 [docs] (migration) Update Node.js version requirements in migration guide <sub><em>(2 files, +6, -6)</em></sub>

### 🧹 Chores

- [`fa96d12`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/fa96d12f7a09c4c4e15b4180561d9867890869fc "Diff: 2 files, +3 | -3") — Release v3.0.1 <sub><em>(2 files, +3, -3)</em></sub>

- [`a4c62bc`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/a4c62bcd5fd189d17594a4eb25ded6c11b3de63c "Diff: 3 files, +127 | -141") — 🔧 [chore] Update dependencies and ESLint configurations <sub><em>(3 files, +127, -141)</em></sub>

- ⬆️ Upgrade "eslint-plugin-astro" from ^2.0.0 to ^2.1.1 for improved linting capabilities.

- ⬆️ Upgrade "eslint-plugin-jsdoc" from ^63.0.7 to ^63.0.8 for better JSDoc support.

- ⬆️ Upgrade "eslint-plugin-unicorn" from ^68.0.0 to ^69.0.0 for additional linting rules.

- ⬆️ Upgrade "eslint-plugin-yml" from ^3.4.0 to ^3.5.0 for enhanced YAML linting.

- ⬆️ Upgrade "@types/node" from ^26.0.0 to ^26.0.1 for updated TypeScript definitions.

📝 [docs] (eslint) Add new linting rules for YAML and Astro

- ⚠️ Add "yml/no-trailing-spaces" rule with a warning level to enforce cleaner YAML formatting.

- ⚠️ Add "astro/no-omitted-end-tags" rule with a warning level to ensure proper HTML structure in Astro components.

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v3.0.0...v3.0.1

## What's Changed in v3.0.0

- <b>Commit Range: ➡️</b> [`v2.0.4...v3.0.0`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v2.0.4...v3.0.0 "View full commit range on GitHub")

### 🛠️ Bug Fixes

- [`3c8a749`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/3c8a74995501ae32bf679f6d112c79a6ea7c51fa "Diff: 1 file, +44 | -44") — 💚 [fix] Restore workflow formatting <sub><em>(1 file, +44, -44)</em></sub>

### 📦 Dependencies

- [`315cd28`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/315cd2859807133459fee4dbf6f6f04672c75a16 "Diff: 7 files, +428 | -424") — ⬆️ [build] Refresh lint dependency toolchain <sub><em>(7 files, +428, -424)</em></sub>

⬆️ [build] Updates lint, parser, packaging, test, and documentation tooling dependencies in package.json and package-lock.json, including the eslint-plugin-astro major update and the eslint-plugin-github-actions preset update that now enforces lowercase small words in workflow title casing.

💥 [build] Tightens the published Node engine and devEngines runtime range to ^22.22.3 || ^24.16.0 || >=26.3.0 so package metadata matches the current direct dependency runtime floor instead of falsely advertising all Node >=22.0.0 releases.

👷 [ci] Updates the pinned softprops/action-gh-release SHA, trims obsolete Dependabot ignores, and normalizes the stale workflow display names so the refreshed GitHub Actions lint rule passes.

🔧 [build] Synchronizes .node-version and .nvmrc with the current Node 26.3.1 runtime used by release verification.

🧪 [test] Verified with npm run release:verify after fixing the workflow title casing failure and again after tightening the Node engine metadata.

### 🛡️ Security

- [`528a7fa`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/528a7fa51cae13fe64d10387e8e02bd9ef80d2bb "Diff: 1 file, +45 | -45") — 👷 [ci] Use shared workflow callers <sub><em>(1 file, +45, -45)</em></sub>

👷 [ci] Switches the Dependabot auto-merge caller to workflow-templates@main and replaces local security and maintenance workflows with shared reusable callers.

⬆️ [build] Updates eslint-config-nick2bad4u to the published caller override version and records any peer dependency needed for the shared ESLint config to load.

### 🧹 Chores

- [`36af875`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/36af8754630b089f42be83d7ad8a2604866c2a47 "Diff: 2 files, +3 | -3") — Release v3.0.0 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v2.0.4...v3.0.0

## What's Changed in v2.0.4

- <b>Commit Range: ➡️</b> [`v2.0.3...v2.0.4`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v2.0.3...v2.0.4 "View full commit range on GitHub")

### 🧹 Chores

- [`c47969c`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/c47969cdc9bf1162210e1705f0ea161bc3a75359 "Diff: 2 files, +3 | -3") — Release v2.0.4 <sub><em>(2 files, +3, -3)</em></sub>

- [`44a4bef`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/44a4bef61b17175b6135c2ea0b798026da69b525 "Diff: 1 file, +6 | -6") — 🧹 [chore] Fix lint warn in caller <sub><em>(1 file, +6, -6)</em></sub>

### 👷 CI/CD

- [`e632aa4`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/e632aa4901a9f7db457efa19eb3093bf55707597 "Diff: 12 files, +223 | -252") — 👷 [ci] Migrate repository automation to reusable workflow callers <sub><em>(12 files, +223, -252)</em></sub>

👷 [ci] Replace local dependency review, Gitleaks, TruffleHog, labeler, and stale-management workflow implementations with reusable workflow-template callers.

- Preserve existing pull request, merge group, push, scheduled, and manual triggers while adding clearer run names and concurrency keys.

- Keep job permissions explicit at the caller boundary before delegating execution to Nick2bad4u/workflow-templates.
  🎨 [style] Broaden the shared GitHub Actions caller override to all *caller.yml workflows and disable dependency-review requirements for those reusable workflow entry points.
  🧹 [chore] Trim stale labeler bootstrap comments and point maintainers at the shared Sync-GitHub-Label.ps1 workflow instead.

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v2.0.3...v2.0.4

## What's Changed in v2.0.3

- <b>Commit Range: ➡️</b> [`v2.0.2...v2.0.3`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v2.0.2...v2.0.3 "View full commit range on GitHub")

### 🛡️ Security

- [`30759b7`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/30759b75f211f47ad6ea6b63ad5fb73857c17fa6 "Diff: 10 files, +1038 | -1463") — ⬆️ [build] Refresh lint dependencies and pinned workflow actions <sub><em>(10 files, +1038, -1463)</em></sub>

⬆️ [build] [dependency] Update the shared ESLint plugin/config dependency set and regenerate package-lock metadata for the updated resolution graph.
🎨 [style] Update shared lint defaults for upstream rule changes by disabling noisy unicorn/name-replacements and removing stale core-rule disables now covered by current config behavior.
👷 [ci] Update pinned GitHub Actions references across CI, release, CodeQL, dependency review, Gitleaks, and TruffleHog workflows, including actions/checkout v7.0.0.
👷 [ci] Refresh release and secret-scan action pins for softprops/action-gh-release v3.0.1 and trufflesecurity/trufflehog v3.95.6.
🔧 [chore] Add a targeted workflow override for the Dependabot auto-merge caller so github-actions/pin-action-shas does not block that reusable workflow.

### 🧹 Chores

- [`3cede78`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/3cede78d64c247f1daf30acb44ccb918b13e8240 "Diff: 2 files, +3 | -3") — Release v2.0.3 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v2.0.2...v2.0.3

## What's Changed in v2.0.2

- <b>Commit Range: ➡️</b> [`v2.0.1...v2.0.2`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v2.0.1...v2.0.2 "View full commit range on GitHub")

### 🛠️ Bug Fixes

- [`381ef7c`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/381ef7cab125907e78d079eb88e9276304eebdec "Diff: 1 file, +25 | -13") — 🐛 [fix] Centralize JSON plugin registration <sub><em>(1 file, +25, -13)</em></sub>

🐛 [fix] Strip the Copilot JSON helper's duplicate json plugin registration and register @eslint/json/jsonc once for data-file language configs, so ESLint 10.5 can compose JSON, JSONC, and JSON5 blocks without namespace collisions.

🧪 [test] Verified with npm run release:verify and a local eslint-plugin-vite tarball smoke.

### 🧹 Chores

- [`cfcdb8c`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/cfcdb8cd97a462996c68df9f675bb0f841cc9422 "Diff: 2 files, +3 | -3") — Release v2.0.2 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v2.0.1...v2.0.2

## What's Changed in v2.0.1

- <b>Commit Range: ➡️</b> [`v2.0.0...v2.0.1`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v2.0.0...v2.0.1 "View full commit range on GitHub")

### 🛠️ Bug Fixes

- [`0d78ed0`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/0d78ed0bb5abc2e634a9b3ca7cc70bfc764ca55e "Diff: 1 file, +0 | -2") — 🐛 [fix] Avoid duplicate JSON plugin registration <sub><em>(1 file, +0, -2)</em></sub>

🐛 [fix] Stop spreading the full @eslint/json recommended config into custom package.json and JSON blocks, so ESLint 10.5 does not reject the shared config for redefining the json plugin.

🧪 [test] Verified with npm run release:verify.

### 🧹 Chores

- [`1de517f`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/1de517f3f5e088bc26f3d3d6a9df5cd8c65b8781 "Diff: 2 files, +3 | -3") — Release v2.0.1 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v2.0.0...v2.0.1

## What's Changed in v2.0.0

- <b>Commit Range: ➡️</b> [`v1.2.15...v2.0.0`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.15...v2.0.0 "View full commit range on GitHub")

### 🛠️ Bug Fixes

- [`934eb43`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/934eb4331425194c99658f1591732b71c4f48745 "Diff: 1 file, +2 | -2") — 🛠️ [fix] Repair local validation script invocations <sub><em>(1 file, +2, -2)</em></sub>

🛠️ [fix] Run actionlint and yamllint as installed CLIs instead of routing through npx packages that do not provide the expected executables.

🧪 [test] Verified both supplemental validation scripts after the package script change.

- [`b463514`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/b463514f458210171087569aacab6852f9805e87 "Diff: 2 files, +60 | -2") — 🚨 [fix] Tune Unicorn v67 boolean naming <sub><em>(2 files, +60, -2)</em></sub>

🚨 [fix] Configure unicorn/consistent-boolean-name with focused config-flag prefixes instead of accepting an overly broad generated list.

🧪 [test] Pin the exported Unicorn boolean-name policy in preset tests and simplify the plugin-name loop for the new for-of readability rule.

🧹 [chore] Remove a stale unicorn/comment-content disable that no longer suppresses a live finding.

### 📦 Dependencies

- [`a8f3326`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/a8f3326bf13421d3905b56e135475ade08bd6e55 "Diff: 2 files, +1368 | -303") — ➕ [build] Add shared ESLint formatter dependencies <sub><em>(2 files, +1368, -303)</em></sub>

➕ [build] Add lightweight downstream formatter packages for Checkstyle, compact, GitHub Actions, JUnit, summary, and Visual Studio output.

🧑‍💻 [chore] Keep eslint-formatter-mo as a dev-only local formatter so consumers do not inherit its presentation stack.

⬆️ [build] Refresh lockfile dependency ranges for current ESLint and shared lint-tool packages.

### 🧹 Chores

- [`8a3c0a6`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/8a3c0a642240b1ffcdc09294bae4ce3b461ef396 "Diff: 2 files, +3 | -3") — Release v2.0.0 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.15...v2.0.0

## What's Changed in v1.2.15

- <b>Commit Range: ➡️</b> [`v1.2.14...v1.2.15`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.14...v1.2.15 "View full commit range on GitHub")

### 🧹 Chores

- [`502b167`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/502b167a73470e99e878be93bc2fe2ef178b88d3 "Diff: 2 files, +3 | -3") — Release v1.2.15 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.14...v1.2.15

## What's Changed in v1.2.14

- <b>Commit Range: ➡️</b> [`v1.2.13...v1.2.14`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.13...v1.2.14 "View full commit range on GitHub")

### ✨ Features

- [`acc9ad1`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/acc9ad13ba5d3cefdfec109caaeb87de20136fa7 "Diff: 5 files, +428 | -176") — ✨ [feat] Update ESLint configuration and dependencies <sub><em>(5 files, +428, -176)</em></sub>

- 🔧 Upgrade "eslint-plugin-perfectionist" to version 5.9.1

- 🔧 Upgrade "eslint-plugin-storybook" to version 10.4.5

- 🔧 Upgrade "typescript-eslint" to version 8.61.1

- 🔧 Upgrade "@vitest/coverage-v8" to version 4.1.9

- 🔧 Upgrade "vitest" to version 4.1.9

- ⚡️ Add new rule "import-x/named" with warning level

- ⚡️ Update "import-x/prefer-namespace-import" to enforce specific patterns

- ⚡️ Enhance "@eslint-community/eslint-comments/no-use" to allow specific directives

- ⚡️ Modify "@typescript-eslint/no-explicit-any" to warn instead of error

- ⚡️ Add detailed restrictions for deprecated imports in "@typescript-eslint/no-restricted-imports"

- ⚡️ Adjust "package-json/no-redundant-files" to warn instead of off
  🧪 [test] Update preset tests for ESLint configuration

- 🔧 Change expectation for "vitest/require-hook" rule to be undefined

### 🧹 Chores

- [`324588c`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/324588c49f5ee1f506834c043aa08743fe384d07 "Diff: 2 files, +3 | -3") — Release v1.2.14 <sub><em>(2 files, +3, -3)</em></sub>

- [`91977f7`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/91977f7fac48322addda04e948eda1432476dc19 "Diff: 2 files, +41 | -66") — 🔧 [chore] Update dependencies in package.json and package-lock.json <sub><em>(2 files, +41, -66)</em></sub>

- Upgrade eslint-plugin-jsdoc from ^63.0.2 to ^63.0.4

- Upgrade npm-package-json-lint from ^10.4.0 to ^10.4.1

- Update electron-to-chromium from 1.5.372 to 1.5.373

- Upgrade es-to-primitive from 1.3.0 to 1.3.1

- Add es-abstract-get as a new dependency with version 1.0.0

- Update minimatch from 10.2.4 to 10.2.5

- Update semver from 7.7.4 to 7.8.4

- Update type-fest from 5.6.0 to 5.7.0

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.13...v1.2.14

## What's Changed in v1.2.13

- <b>Commit Range: ➡️</b> [`v1.2.12...v1.2.13`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.12...v1.2.13 "View full commit range on GitHub")

### 📝 Documentation

- [`61b9326`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/61b93267b41308b6ff3cf26416408c7cf184f6c9 "Diff: 6 files, +314 | -175") — 📝 [docs] Update documentation and ignore files <sub><em>(6 files, +314, -175)</em></sub>

- Added non-prose instruction and GitHub template files to .remarkignore

- Updated section header from `createConfig()` to `Configuration` in README.md

🧹 [chore] Update license and package dependencies

- Changed copyright symbol in LICENSE file

- Upgraded `remark-config-nick2bad4u` from version 1.0.5 to 1.0.7 in package.json and package-lock.json

- Added `standard-readme-preset` as a new dependency in package-lock.json

- Added `remark-lint-appropriate-heading` as a new dependency in package-lock.json

🚜 [refactor] Improve build scripts

- Updated build scripts in package.json to use `npx` for better consistency and reliability

- Ensured all linting and testing commands utilize `npx` for local execution

### 🧹 Chores

- [`0e57e4f`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/0e57e4feeee814c403fa489d8eca3d26aecbe87f "Diff: 2 files, +3 | -3") — Release v1.2.13 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.12...v1.2.13

## What's Changed in v1.2.12

- <b>Commit Range: ➡️</b> [`v1.2.11...v1.2.12`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.11...v1.2.12 "View full commit range on GitHub")

### 📝 Documentation

- [`3fdd040`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/3fdd040661aa022a1bbc384be01ab88efdac5bc6 "Diff: 1 file, +7 | -7") — 📝 [docs] Update README for consistency and clarity <sub><em>(1 file, +7, -7)</em></sub>

- Standardize badge labels from lowercase to title case

- Improve phrasing for clarity in peer dependency explanation

- Correct typo in migration guide reference

### 🧹 Chores

- [`559e828`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/559e8283918843c41822c6bb3241a82c7752757a "Diff: 2 files, +3 | -3") — Release v1.2.12 <sub><em>(2 files, +3, -3)</em></sub>

- [`0a75b09`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/0a75b095be11933c34906dee197e2e61e7e003f2 "Diff: 4 files, +143 | -139") — 🔧 [chore] Update dependencies and improve code comments <sub><em>(4 files, +143, -139)</em></sub>

- 🔄 Upgrade `eslint-plugin-unicorn` from `^65.0.1` to `^66.0.0` for enhanced linting capabilities.
- 📝 Refactor `shared-config.ts` to use `process.env` directly, adding comments to clarify its usage in CI detection and markdown linting.
- 📝 Update comments throughout `shared-config.ts` for clarity and consistency, including fixing typos and improving readability.
- 🔄 Modify `vite.config.ts` to use `Math.trunc` for parsing worker count, ensuring safer integer conversion.

### 👷 CI/CD

- [`fe2376c`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/fe2376cfdf3f264af91d34a917cf2a7c47fbfb72 "Diff: 1 file, +1 | -1") — Update Dependabot auto-merge workflow pin <sub><em>(1 file, +1, -1)</em></sub>

- [`1c45838`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/1c458380233790ed4ea4d23a682b7a344151b87c "Diff: 1 file, +3 | -2") — Add Dependabot auto-merge workflow <sub><em>(1 file, +3, -2)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.11...v1.2.12

## What's Changed in v1.2.11

- <b>Commit Range: ➡️</b> [`v1.2.10...v1.2.11`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.10...v1.2.11 "View full commit range on GitHub")

### 🛡️ Security

- [`5eeb7a0`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/5eeb7a0d8698478cf0628ca2f410bb64abcdf12c "Diff: 7 files, +160 | -140") — ✨ [feat] Update ESLint and related dependencies <sub><em>(7 files, +160, -140)</em></sub>

- Upgrade ESLint from `^10.4.0` to `^10.5.0` in `migration.md`, `package.json`, and `package-lock.json`

- Update `@eslint-react/eslint-plugin` from `^5.8.18` to `^5.9.0` in `package.json` and `package-lock.json`

- Upgrade `eslint-plugin-security` from `^4.0.0` to `^4.0.1` in `package.json` and `package-lock.json`

- Adjust TypeScript peer dependency to ensure compatibility

- Update `@augment-vir/*` packages to version `31.73.1` in `package-lock.json`

- Disable specific GitHub Actions rules in `shared-config.ts` for improved workflow

- [`d6f2845`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/d6f2845ea5940126aff4015217334ecb866c8bbb "Diff: 9 files, +22 | -21") — 🔧 [chore] Update GitHub Actions workflows and dependencies <sub><em>(9 files, +22, -21)</em></sub>

- Update 'step-security/harden-runner' to v2.19.4 in CI, CodeQL, Dependency Review, Gitleaks, Labeler, Release, Stale, and Trufflehog workflows for improved security.

- Upgrade 'actions/checkout' to v6.0.3 across multiple workflows for better performance and compatibility.

- Update 'github/codeql-action/init' and 'github/codeql-action/analyze' to v4.36.2 in CodeQL workflow for the latest features and fixes.

- Upgrade 'actions/dependency-review-action' to v5.0.0 in Dependency Review workflow for enhanced functionality.

- Update 'actions/stale' to v10.3.0 in Stale workflow for improved stale issue management.

- Upgrade 'trufflesecurity/trufflehog' to v3.95.5 in Trufflehog workflow for better secret scanning capabilities.

- Add 'update-actions' script in package.json for easier action updates.

### 🧹 Chores

- [`3b7ce84`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/3b7ce849fb2abde1ff05d95c0d590aaa313c1ca4 "Diff: 2 files, +3 | -3") — Release v1.2.11 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.10...v1.2.11

## What's Changed in v1.2.10

- <b>Commit Range: ➡️</b> [`v1.2.9...v1.2.10`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.9...v1.2.10 "View full commit range on GitHub")

### ✨ Features

- [`b9d498e`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/b9d498ec0bd9603cd6d4630679c7e185c3a6fd94 "Diff: 2 files, +6 | -1") — ✨ [feat] (rules) Add 'unicorn/try-complexity' rule with max complexity of 3 <sub><em>(2 files, +6, -1)</em></sub>
  🧪 [test] Update tests to assert 'unicorn/try-complexity' rule configuration

### 🧹 Chores

- [`5ed97cd`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/5ed97cd4cf8cb1d9cb0bbe298d0b2fd699ba5029 "Diff: 2 files, +3 | -3") — Release v1.2.10 <sub><em>(2 files, +3, -3)</em></sub>

- [`0b9939f`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/0b9939fce85d53c0f10fb44d9218f47503808f4e "Diff: 3 files, +203 | -978") — 🔧 [chore] Update dependencies in package.json <sub><em>(3 files, +203, -978)</em></sub>

- Upgraded @eslint-react/eslint-plugin from ^5.8.17 to ^5.8.18 for improved linting capabilities.

- Updated @vitest/eslint-plugin from ^1.6.19 to ^1.6.20 to ensure compatibility with the latest features.

- [dependency] Updateed eslint-plugin-storybook from ^10.4.3 to ^10.4.4 for bug fixes and enhancements.

- Incremented @types/node from ^25.9.2 to ^25.9.3 to align with the latest TypeScript definitions.

- Updated packageManager from npm@11.16.0 to npm@11.17.0 for better package management features.

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.9...v1.2.10

## What's Changed in v1.2.9

- <b>Commit Range: ➡️</b> [`v1.2.8...v1.2.9`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.8...v1.2.9 "View full commit range on GitHub")

### ✨ Features

- [`be5c8fb`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/be5c8fb36689d91d9057cf65eb85ca7a925fda59 "Diff: 12 files, +759 | -624") — ✨ [feat] (preset) Introduce opt-in file-pattern presets for TypeScript ESLint's default project fallback <sub><em>(12 files, +759, -624)</em></sub>

- Add `allowDefaultProjectFilePatternPresets` to manage root-level file patterns

- Update `createConfig` to utilize new file-pattern presets

- Refactor shared config to include new JSONC and JSON5 rules

- Enhance tests to verify new file-pattern presets and their integration

🔧 [refactor] (shared-config) Improve structure of project file patterns

- Consolidate default project file patterns for better maintainability

- Introduce `COMMENT_LENGTH_SEMANTIC_COMMENTS` for semantic comment handling

- Streamline ESLint rules for JSONC and JSON5 files

🧪 [test] (preset) Expand tests for new file-pattern presets

- Validate that only root-level default TypeScript project fallback patterns are enabled

- Ensure exported presets match the expected structure and values

### 🧹 Chores

- [`4004915`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/40049152a4621cf343e27fad47b7d590b416f6cc "Diff: 2 files, +3 | -3") — Release v1.2.9 <sub><em>(2 files, +3, -3)</em></sub>

- [`a9292c1`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/a9292c16244350aa32105f8a945a5366972b5c13 "Diff: 2 files, +143 | -143") — 🔧 [chore] Update dependencies in package.json and package-lock.json <sub><em>(2 files, +143, -143)</em></sub>

- Upgrade @eslint-react/eslint-plugin from ^5.8.16 to ^5.8.17

- Upgrade @next/eslint-plugin-next from ^16.2.7 to ^16.2.9

- Upgrade prettier-config-nick2bad4u from ^1.0.15 to ^1.0.16

- Upgrade @date-vir/duration from 8.4.0 to 8.5.0

- Upgrade @eslint-react/ast, @eslint-react/core, @eslint-react/eslint, @eslint-react/jsx, @eslint-react/shared, and @eslint-react/var from 5.8.16 to 5.8.17

- Upgrade @typescript-eslint/types, @typescript-eslint/typescript-estree, and @typescript-eslint/utils from ^8.60.1 to ^8.61.0

- Upgrade prettier from ^3.8.4 to ^3.8.4

- Upgrade semver from 7.8.3 to 7.8.4

- [`8963f8f`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/8963f8f9e360b47168e16c891f0e3d68f7546ebd "Diff: 3 files, +97 | -97") — 🔧 [chore] Update dependencies and configuration <sub><em>(3 files, +97, -97)</em></sub>

- Update cooldown setting in .ncurc.json from "15m" to "1m" for improved performance.

- Upgrade @eslint-react/eslint-plugin from version 5.8.13 to 5.8.16 for better compatibility.

- Upgrade stylelint-config-nick2bad4u from version 1.0.16 to 1.0.18 for enhanced features.

- Update stylelint-scss from version 7.1.1 to 7.2.0 for improved functionality.

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.8...v1.2.9

## What's Changed in v1.2.8

- <b>Commit Range: ➡️</b> [`v1.2.7...v1.2.8`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.7...v1.2.8 "View full commit range on GitHub")

### ✨ Features

- [`21b6ffb`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/21b6ffb4136b6d90f4d3f73e77313cebed4b32af "Diff: 5 files, +169 | -114") — ✨ [feat] (workflow) Add Dependabot auto-merge workflow <sub><em>(5 files, +169, -114)</em></sub>

- Introduced a new GitHub Actions workflow for auto-merging Dependabot pull requests.

- Configured concurrency to prevent multiple merges at once.

- Set permissions for the workflow to write to contents and pull requests.

- Added rules to disable specific GitHub Actions linting for the workflow file.

🔧 [chore] (eslint) Update ESLint configuration

- Modified root ESLint config to include the new workflow file with specific rules.

- Updated dependencies in package.json and package-lock.json to the latest versions.

- Removed unnecessary ESLint rules to streamline configuration.

- [`c42ca92`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/c42ca924e1bdf0c5dbc5e97c430a57f25df93865 "Diff: 1 file, +83 | -0") — ✨ [feat] Add TSDoc configuration with custom tag definitions <sub><em>(1 file, +83, -0)</em></sub>

### 🛠️ Bug Fixes

- [`25d29f8`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/25d29f8eace7dc0e021c1e091c07a76b6959feeb "Diff: 1 file, +77 | -17") — 🚨 [fix] (config) Silence deprecated lint rule noise <sub><em>(1 file, +77, -17)</em></sub>

🚨 [fix] Turn off legacy @eslint-react x-* aliases while preserving the modern @eslint-react rule names from the active presets.

🎨 [style] Keep YAML formatting concerns delegated to Prettier by disabling overlapping eslint-plugin-yml style rules directly in the shared config.

🚨 [fix] Disable deprecated Vue rules and broaden YAML override globs for GitHub and workflow-adjacent configuration files.

### 📦 Dependencies

- [`0cd1762`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/0cd17622873cd654eb6cc7082cb06d1235b426e8 "Diff: 26 files, +577 | -501") — 🎨 [style] Update configuration files for consistency and readability <sub><em>(26 files, +577, -501)</em></sub>

- 📝 Update package.json description for clarity on usage

- 🔧 Upgrade dependencies: eslint-plugin-jsdoc, eslint-plugin-json-schema-validator-2, @types/node, prettier-config-nick2bad4u, stylelint

- 🎨 Refactor action.yml, ci.yml, .pre-commit-config.yaml, .spellcheck.yml, site.toml, and dependabot.yml for consistent quoting and formatting

### 🛡️ Security

- [`ed9f276`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/ed9f276166cac0c013f88c6e058cbc6c9890b534 "Diff: 1 file, +4 | -0") — 🔒️ [fix] (gitleaks) Ignore local scratch outputs <sub><em>(1 file, +4, -0)</em></sub>

🔒️ [fix] Add a local allowlist for the ignored temp directory so repository secret scans do not fail on transient command-output files.

### 🛠️ Other Changes

- [`1dae162`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/1dae162e68a9983b1aee438f9a5899e4b64ca5a5 "Diff: 1 file, +2 | -2") — Update Codecov action to v7.0.0 <sub><em>(1 file, +2, -2)</em></sub>

### 🎨 Styling

- [`0add098`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/0add098afb80e0abf24af20198596e22c13c9f13 "Diff: 2 files, +5 | -5") — 🎨 [style] Format shared config wrappers <sub><em>(2 files, +5, -5)</em></sub>

🎨 [style] Apply the repo Prettier settings to the compact npm-package-json-lint and TSDoc config files produced by the shared-config migration.

### 🧹 Chores

- [`0d97d23`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/0d97d233534b46b50628a95ac00b7c204993c212 "Diff: 2 files, +3 | -3") — Release v1.2.8 <sub><em>(2 files, +3, -3)</em></sub>

- [`821583f`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/821583f98422600ea3936d93e74596b78471f89e "Diff: 9 files, +864 | -1080") — 🔧 [chore] (tooling) Adopt shared lint configuration packages <sub><em>(9 files, +864, -1080)</em></sub>

🔧 [chore] Replace repo-local Gitleaks, npm-package-json-lint, yamllint, and TSDoc settings with shared package-backed configuration files.

👷 [ci] Install npm dependencies before the Gitleaks workflow so the extended shared Gitleaks config resolves from node_modules.

🔨 [chore] Add standalone actionlint and shared config lint scripts while keeping optional YAML-specific checks outside the aggregate gates.

⬆️ [chore] Refresh dependency manifests and Node version files for the shared tooling packages.

### 👷 CI/CD

- [`e47aa1c`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/e47aa1c8de4b96bf39f443084efa731154d829fa "Diff: 1 file, +1 | -0") — 👷 [ci] (gitleaks) Declare dependency install shell <sub><em>(1 file, +1, -0)</em></sub>

👷 [ci] Add the explicit bash shell required by the shared GitHub Actions lint rules for the npm ci step in the Gitleaks workflow.

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.7...v1.2.8

## What's Changed in v1.2.7

- <b>Commit Range: ➡️</b> [`v1.2.6...v1.2.7`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.6...v1.2.7 "View full commit range on GitHub")

### 🧹 Chores

- [`4d0e8cf`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/4d0e8cf21584e032130dcbcaddd075259e718e73 "Diff: 2 files, +3 | -3") — Release v1.2.7 <sub><em>(2 files, +3, -3)</em></sub>

- [`0e21617`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/0e21617f13c17981771cc0f242675b729742c668 "Diff: 3 files, +515 | -1092") — 🔧 [chore] Update dependencies and add new ESLint rule <sub><em>(3 files, +515, -1092)</em></sub>

- ⬆️ Upgrade "@eslint-react/eslint-plugin" from "^5.8.8" to "^5.8.9"

- ⬆️ Upgrade "@next/eslint-plugin-next" from "^16.2.6" to "^16.2.7"

- ⬆️ Upgrade "eslint-import-resolver-typescript" from "^4.4.4" to "^4.4.5"

- ⬆️ Upgrade "eslint-plugin-eslint-plugin" from "^7.3.3" to "^7.4.0"

- ⬆️ Upgrade "typescript-eslint" from "^8.60.0" to "^8.60.1"

- ⬆️ Upgrade "@vitest/coverage-v8" from "^4.1.7" to "^4.1.8"

- ⬆️ Upgrade "stylelint-config-nick2bad4u" from "^1.0.15" to "^1.0.16"

- ⬆️ Upgrade "vite" from "^8.0.14" to "^8.0.16"

- ⬆️ Upgrade "vitest" from "^4.1.7" to "^4.1.8"

- ✨ Add new ESLint rule "require-test-error-positions" with a warning level

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.6...v1.2.7

## What's Changed in v1.2.6

- <b>Commit Range: ➡️</b> [`v1.2.5...v1.2.6`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.5...v1.2.6 "View full commit range on GitHub")

### ✨ Features

- [`f87a7c4`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/f87a7c43009929080455f0939cc472c8c7429fba "Diff: 5 files, +231 | -132") — ✨ [feat] Enhance ESLint configuration and test coverage <sub><em>(5 files, +231, -132)</em></sub>

- Add additional ignore patterns for test signals in shared config

- Relax global low-value style and template-expression rules

- Introduce scoped overrides for various configurations

### 🎨 Styling

- [`5c5fc34`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/5c5fc3439f7044059c06d951368f5d78337b59dd "Diff: 1 file, +2 | -7") — 🎨 [style] Refactor test formatting for improved readability <sub><em>(1 file, +2, -7)</em></sub>

### 🧹 Chores

- [`a97e8ca`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/a97e8caa565587528164dda6157bc9cd7a77e8a0 "Diff: 2 files, +3 | -3") — Release v1.2.6 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.5...v1.2.6

## What's Changed in v1.2.5

- <b>Commit Range: ➡️</b> [`v1.2.4...v1.2.5`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.4...v1.2.5 "View full commit range on GitHub")

### 🛡️ Security

- [`8c0dabd`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/8c0dabdb05e80ea3af13db2a05bde366443a6b95 "Diff: 7 files, +402 | -514") — 🧹 [chore] Update dependencies and clean up shared config <sub><em>(7 files, +402, -514)</em></sub>

- ⬆️ Upgrade "@eslint-react/eslint-plugin" to version 5.8.8 for improved linting capabilities.

- ⬆️ Upgrade "@vitest/eslint-plugin" to version 1.6.19 to ensure compatibility with the latest features.

- ⬆️ Upgrade "eslint-plugin-json-schema-validator-2" to version 7.0.4 for enhanced validation support.

- ⬆️ Upgrade "type-fest" to version 5.7.0 for updated type utilities.

- ⬆️ Upgrade "remark-config-nick2bad4u" to version 1.0.3 for better markdown processing.

- ⬆️ Upgrade "secretlint-config-nick2bad4u" to version 1.1.0 for improved security linting.

- ⬆️ Upgrade "stylelint-config-nick2bad4u" to version 1.0.15 for updated style linting rules.

- 🔧 Refactor shared config to remove JSON Schema Validator conditional logic, always applying recommended configs.

- 📝 Update markdown linting rules to allow specific alert labels without requiring link definitions.

- 📝 Add new markdown fixture examples to test alert markup handling.

### 📝 Documentation

- [`24714fb`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/24714fbd6b452f00784708ea5d5c410bb2ff580a "Diff: 1 file, +4 | -4") — 📝 [docs] Update environment variable table formatting for clarity <sub><em>(1 file, +4, -4)</em></sub>

### 🧹 Chores

- [`fe346bd`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/fe346bde70c84a410b9a57fd07a950bd5edd5543 "Diff: 2 files, +3 | -3") — Release v1.2.5 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.4...v1.2.5

## What's Changed in v1.2.4

- <b>Commit Range: ➡️</b> [`v1.2.3...v1.2.4`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.3...v1.2.4 "View full commit range on GitHub")

### ✨ Features

- [`4c57be2`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/4c57be2fd1b0221817996a883d5442b53c72e983 "Diff: 17 files, +1202 | -1030") — ✨ [feat] Update ESLint plugins and configurations <sub><em>(17 files, +1202, -1030)</em></sub>

- 🔧 Upgrade "eslint-plugin-json-schema-validator" to "eslint-plugin-json-schema-validator-2" in package.json

- 🎨 Refactor shared-config.ts to integrate the new JSON Schema Validator plugin

- 🧪 Enhance JSON Schema validation logic with improved error handling and configuration retrieval

- 📝 Update AGENTS.md for clearer test writing guidelines and examples

### 🧹 Chores

- [`f2e7c33`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/f2e7c33767cf7c6fb15ff301feafeed94181fe2f "Diff: 2 files, +3 | -3") — Release v1.2.4 <sub><em>(2 files, +3, -3)</em></sub>

- [`2826a0f`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/2826a0f474fb2cb770ef054684c1ba3250a6a5c2 "Diff: 16 files, +123 | -2292") — Update github agent instruction paths <sub><em>(16 files, +123, -2292)</em></sub>

- [`8e71376`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/8e71376751389d5ecb0c88e31a9481d796d1bff5 "Diff: 1 file, +0 | -1") — Stop ignoring mdx files in prettierignore <sub><em>(1 file, +0, -1)</em></sub>

- [`350c61c`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/350c61c5aa2feb68c9188e0f5a1686bdbf90a2fa "Diff: 2 files, +28 | -28") — 🔧 [chore] Update devDependencies and peerDependencies for @arethetypeswrong packages and eslint <sub><em>(2 files, +28, -28)</em></sub>

- [`34a3e9d`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/34a3e9df8b9b2374d29106921669db468ebb9c70 "Diff: 1 file, +0 | -7") — Stop ignoring markdown files in prettierignore <sub><em>(1 file, +0, -7)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.3...v1.2.4

## What's Changed in v1.2.3

- <b>Commit Range: ➡️</b> [`v1.2.2...v1.2.3`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.2...v1.2.3 "View full commit range on GitHub")

### ✨ Features

- [`ef6dcd4`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/ef6dcd43ddfc7438c0c001ddc6777d5f9be4772f "Diff: 9 files, +641 | -192") — ✨ [feat] (eslint) Update ESLint plugins and configurations <sub><em>(9 files, +641, -192)</em></sub>

- Upgrade `@eslint-react/eslint-plugin` to version `5.8.7`

- Replace `eslint-plugin-jsonc` with `eslint-plugin-json-schema-validator` and update its version

- Upgrade `eslint-plugin-toml` to version `1.4.0`

- Upgrade `eslint-plugin-yml` to version `3.4.0`

- Enhance JSON Schema Validator integration with recommended configurations

- Introduce opt-in support for Markdown code block linting

- Scope Docusaurus and TypeDoc configurations to specific file patterns

- Improve handling of default TypeScript project allow-list

- Add tests to verify new configurations and ensure proper scoping

### 🧹 Chores

- [`c63af5b`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/c63af5bc988513a1e03e45c12cb895fa60f80d23 "Diff: 2 files, +3 | -3") — Release v1.2.3 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.2...v1.2.3

## What's Changed in v1.2.2

- <b>Commit Range: ➡️</b> [`v1.2.1...v1.2.2`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.1...v1.2.2 "View full commit range on GitHub")

### 🧹 Chores

- [`fca7ec0`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/fca7ec0ae18997b1518969233175e73c1a15e0e3 "Diff: 2 files, +3 | -3") — Release v1.2.2 <sub><em>(2 files, +3, -3)</em></sub>

- [`e4e59c2`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/e4e59c29c146ce587a2218628475dba9e7ae2a95 "Diff: 4 files, +154 | -100") — 🔧 [chore] Update dependencies and ESLint rules <sub><em>(4 files, +154, -100)</em></sub>

- Upgrade @eslint/css from ^1.2.0 to ^1.3.0

- Upgrade @eslint/json from ^1.2.0 to ^2.0.0

- Upgrade eslint-plugin-package-json from ^1.1.0 to ^1.2.0

- Upgrade eslint-plugin-prettier from ^5.5.5 to ^5.5.6

- Upgrade stylelint-config-nick2bad4u from ^1.0.12 to ^1.0.14

- Update build script for ESLint inspector to use latest version

- Adjust ignore patterns in shared config for CSS and JSON files

- Refactor test cases to remove unnecessary ESLint disable comments

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.1...v1.2.2

## What's Changed in v1.2.1

- <b>Commit Range: ➡️</b> [`v1.2.0...v1.2.1`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.0...v1.2.1 "View full commit range on GitHub")

### 🛠️ Bug Fixes

- [`63bfc89`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/63bfc89363da29f0d8194aa6e12c59a11da30947 "Diff: 2 files, +2 | -2") — Correct git-cliff release notes target <sub><em>(2 files, +2, -2)</em></sub>

### 🧹 Chores

- [`5b00ba7`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/5b00ba786fe0e0203c7baf0e29e28e763c5e1652 "Diff: 2 files, +3 | -3") — Release v1.2.1 <sub><em>(2 files, +3, -3)</em></sub>

- [`f9f1d0c`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/f9f1d0c6b09fd7291cd09bc099ff539f894258be "Diff: 3 files, +254 | -243") — 🔧 [chore] Update dependencies and ESLint rules <sub><em>(3 files, +254, -243)</em></sub>

- ⬆️ Upgrade @eslint-react/eslint-plugin from 5.8.5 to 5.8.6 for improved linting capabilities.

- 🔧 Update packageManager from npm@11.15.0 to npm@11.16.0 for better package management.

- 🔧 Modify ESLint rules in shared-config.ts:

- Set "vitest/prefer-to-be-falsy" to "off" to allow explicit checks for falsy values in tests.

- Set "vitest/prefer-to-be-truthy" to "off" to allow explicit checks for truthy values in tests.

- Set "vitest/require-test-timeout" to "off" to provide flexibility in test timeouts.

- Set "@typescript-eslint/prefer-readonly-parameter-types" to "off" to allow non-readonly parameter types.

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.2.0...v1.2.1

## What's Changed in v1.2.0

- <b>Commit Range: ➡️</b> [`v1.1.0...v1.2.0`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.1.0...v1.2.0 "View full commit range on GitHub")

### ✨ Features

- [`f7fd0fe`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/f7fd0fe5d9d1712073f95ba17b87d046bb6f2a55 "Diff: 1 file, +36 | -30") — ✨ [feat] Add timeout for fixture smoke test to enhance reliability <sub><em>(1 file, +36, -30)</em></sub>

- [`aa19a69`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/aa19a696aa73a11d96c3603d5333b4ae78f10008 "Diff: 12 files, +57 | -17") — ✨ [feat] Add new lint smoke test fixtures and configurations <sub><em>(12 files, +57, -17)</em></sub>

- Introduced new fixture files for lint smoke tests including:

- `.remarkrc.mjs` for remark configuration

- `home.pw.ts` for Playwright test of the home page

- `script.ts` for Island component

- `component.mdx` for MDX documentation

- `valid.css` for CSS fixture

- `pipeline.ts` for functional pipeline

- `preset.mjs` for ESLint preset configuration

- `rollup.config.fixture.mjs` for Rollup configuration

- `widget.vue.ts` for widget component

- Updated existing fixture paths to include new files for comprehensive testing.

### 🧹 Chores

- [`4eac722`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/4eac72243e76aa14429765280a32fda996cb700c "Diff: 2 files, +3 | -3") — Release v1.2.0 <sub><em>(2 files, +3, -3)</em></sub>

- [`d6a1f04`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/d6a1f04e9aff618065a686a1dc49a6f757a9da2c "Diff: 9 files, +545 | -532") — 🔧 [chore] Harden shared config presets and dependency metadata <sub><em>(9 files, +545, -532)</em></sub>

- validate optional JSON schema plugin rules before enabling them
- add typed plugin override declarations for the public config factory
- expose withoutGitHubActions2 while keeping withoutGithubActions2 as a deprecated alias
- cover withoutSdl2 Node plugin preservation in preset tests
- update eslint-comments and typescript-eslint dependency ranges
- adjust YAML schema directive formatting

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.1.0...v1.2.0

## What's Changed in v1.1.0

- <b>Commit Range: ➡️</b> [`v1.0.21...v1.1.0`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.21...v1.1.0 "View full commit range on GitHub")

### ✨ Features

- [`e9f4712`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/e9f471267d2f5d1c038b1f5d1b23c61be44510ba "Diff: 78 files, +7204 | -3642") — ✨ [feat] Add fixture workspace for lint smoke tests <sub><em>(78 files, +7204, -3642)</em></sub>

- 🎨 Create a CI workflow for linting with npm test

- 📝 Add reusable workflow template metadata

- 🧹 Introduce various configuration files including .gitignore, .pre-commit-config.yaml, and eslint.config.mjs

- ✨ Implement fixture components and pages in React, Vue, and Astro

- 🧪 Add tests for components and sample functionality

- 📄 Create documentation and example files in multiple formats (Markdown, HTML, etc.)

- 🔧 Set up Storybook for UI component development

- 🚜 Establish benchmarks for performance testing

- 🧑‍💻 Configure Vite and Nuxt for development

- 🧪 Add Playwright tests for end-to-end testing

### 🎨 Styling

- [`861b989`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/861b98996725653061b7b7518de8f6f4b7bf3e4d "Diff: 4 files, +52 | -83") — 🎨 [style] Update ESLint configuration and dependencies <sub><em>(4 files, +52, -83)</em></sub>

- Add "type-fest" as a dependency in package.json and package-lock.json

- Remove unnecessary ESLint disable comments in shared-config.ts

- Refactor code to improve clarity and maintainability

### 🧹 Chores

- [`4d8d7ea`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/4d8d7ea67f51932799de08f9ece98d41c6c4e1bd "Diff: 2 files, +3 | -3") — Release v1.1.0 <sub><em>(2 files, +3, -3)</em></sub>

- [`e2ed9ef`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/e2ed9ef6b8ea5d776099ace251782a6953626633 "Diff: 1 file, +0 | -2") — 🔧 [chore] Remove unused Nuxt ESLint configuration import <sub><em>(1 file, +0, -2)</em></sub>

- [`3faa6d9`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/3faa6d9f25a7ec5538d948bd698244cf1a12bf8e "Diff: 3 files, +297 | -437") — 🔧 [chore] Update dependencies and ESLint configurations <sub><em>(3 files, +297, -437)</em></sub>

- 📦 Upgrade @typescript-eslint/eslint-plugin and @typescript-eslint/parser to version 8.59.4 for improved TypeScript support.

- 📦 Upgrade eslint-plugin-package-json to version 1.1.0 for better package.json linting.

- 📦 Upgrade eslint-plugin-playwright to version 2.10.3 for the latest features and fixes.

- 📦 Upgrade @types/node to version 25.9.0 for updated type definitions.

- 🔧 Remove sonarjs plugin configurations from shared-config.ts to streamline ESLint rules.

- 🔧 Adjust various ESLint rules to be off, leveraging TypeScript's built-in checks for better type safety.

- 🔧 Add ignore patterns for secretlint configuration files to prevent linting errors.

- 🔧 Update rule configurations for better clarity and maintainability.

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.21...v1.1.0

## What's Changed in v1.0.21

- <b>Commit Range: ➡️</b> [`v1.0.20...v1.0.21`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.20...v1.0.21 "View full commit range on GitHub")

### ✨ Features

- [`5b294a4`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/5b294a465643a1494a638b134610946864add72a "Diff: 4 files, +259 | -172") — ✨ [feat] Update ESLint configuration and dependencies <sub><em>(4 files, +259, -172)</em></sub>

- 🔧 Upgrade "@eslint-react/eslint-plugin" to version "^5.8.1" for improved linting capabilities.

- 🔧 Upgrade "eslint-plugin-package-json" to version "^1.0.0" for enhanced package.json validation.

- 🔧 Upgrade "eslint-plugin-runtime-cleanup" to version "^1.2.10" for better runtime cleanup rules.

- 🔧 Upgrade "eslint-plugin-sdl-2" to version "^1.2.5" for updated SDL rules.

- 🔧 Upgrade "eslint-plugin-test-signal" to version "^1.2.10" for improved testing signals.

- 🔧 Upgrade "eslint-plugin-tsconfig" to version "^1.3.3" for better TypeScript configuration support.

- 📝 Enhance shared ESLint configuration with comments explaining parser project defaults and plugin overrides.

- 📝 Add specific rule configurations for "sonarjs/no-implicit-dependencies" to whitelist certain Docusaurus components.

- 🎨 Refactor ESLint configuration to improve organization and clarity, including naming updates for Docusaurus presets.

- 🧪 Add tests to ensure globals are excluded from parser options and validate browser and Node globals for Docusaurus workspace files.

### 🎨 Styling

- [`bc6a5a9`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/bc6a5a93550e17abc77cca2d1810aeb5e25836d1 "Diff: 2 files, +2 | -1") — 🎨 [style] Update package.json and shared-config to refine file exports and ESLint rules <sub><em>(2 files, +2, -1)</em></sub>

- Add "dist/preset.js" to the files array in package.json for better module exports

- Disable "package-json/no-redundant-files" rule in shared-config for improved linting flexibility

- [`696fb21`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/696fb21361c6851984b82c4f5b8819ac6db8cc84 "Diff: 3 files, +23 | -12") — 🎨 [style] Improve code formatting and ESLint rules in shared-config and tests <sub><em>(3 files, +23, -12)</em></sub>

- Refactor package.json to remove redundant file entry

- Update ESLint rules for better code quality and consistency

- Enhance test assertions for docusaurus globals

### 🧹 Chores

- [`7bb44e6`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/7bb44e65b020fe847461020785dda572fe602ac9 "Diff: 2 files, +3 | -3") — Release v1.0.21 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.20...v1.0.21

## What's Changed in v1.0.20

- <b>Commit Range: ➡️</b> [`v1.0.19...v1.0.20`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.19...v1.0.20 "View full commit range on GitHub")

### 🎨 Styling

- [`4059217`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/405921762a48ebf70db35c4fe276446a3c4b4940 "Diff: 2 files, +7 | -5") — 🎨 [style] Refactor code formatting for improved readability in shared-config and preset tests <sub><em>(2 files, +7, -5)</em></sub>

- Adjust line breaks for better alignment in casePoliceRecommendedConfigs and sdlRequiredConfigs

- Enhance clarity in getMissingEnabledRulePluginRegistrations by formatting localPluginNames

### 🧹 Chores

- [`ea1e6bd`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/ea1e6bd4ebc40fb253e1068b7b575492ae3a04c0 "Diff: 2 files, +3 | -3") — Release v1.0.20 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.19...v1.0.20

## What's Changed in v1.0.19

- <b>Commit Range: ➡️</b> [`v1.0.18...v1.0.19`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.18...v1.0.19 "View full commit range on GitHub")

### ✨ Features

- [`aa8e676`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/aa8e67686b2d4799fc51c1e6e60803e6e10bd5a2 "Diff: 4 files, +132 | -11") — ✨ [feat] Update ESLint configuration and add new rule plugins <sub><em>(4 files, +132, -11)</em></sub>

- Change package entry name to "Package source" and update paths to TypeScript files.

- Add eslint-comments plugin to shared-config and integrate it into existing configurations.

- Enhance test coverage by adding checks for enabled plugin rules in presets.

- Refine Vite configuration comments for clarity on coverage reporting.

- [`f1a540c`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/f1a540cd9fc98c4fff42066a335b609c51ea064d "Diff: 4 files, +126 | -121") — ✨ [feat] Add runtime cleanup and test signal ESLint plugins <sub><em>(4 files, +126, -121)</em></sub>

- Introduced `eslint-plugin-runtime-cleanup` and `eslint-plugin-test-signal` as dependencies in package.json and package-lock.json

- Updated shared ESLint configuration to include new plugins

- Enhanced tests to verify the presence of rules from the new plugins

- [`8c833e6`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/8c833e6fdd593b51041d21764c94e8202784daf9 "Diff: 6 files, +201 | -78") — ✨ [feat] Add new ESLint presets for runtime cleanup and test signal <sub><em>(6 files, +201, -78)</em></sub>

- Introduced `withoutRuntimeCleanup` preset to omit runtime-cleanup rules.

- Introduced `withoutTestSignal` preset to omit weak-test signal rules.

- Updated documentation to reflect new presets in migration guide and README.

- Refactored preset retrieval logic in tests for better maintainability.

### 📦 Dependencies

- [`03a7200`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/03a72001097486544884fa91d9116fd8ad289904 "Diff: 2 files, +10 | -10") — ⬆️ [build] Update eslint-plugin-runtime-cleanup and eslint-plugin-test-signal to version 1.2.9 <sub><em>(2 files, +10, -10)</em></sub>

### 🧹 Chores

- [`1560ade`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/1560ade0066cfa33d9bb3c4430126ed7ae7e388e "Diff: 2 files, +3 | -3") — Release v1.0.19 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.18...v1.0.19

## What's Changed in v1.0.18

- <b>Commit Range: ➡️</b> [`v1.0.17...v1.0.18`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.17...v1.0.18 "View full commit range on GitHub")

### 🚜 Refactor

- [`5fee761`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/5fee7615673b043eb9a4707888fbe98273b8ef2e "Diff: 1 file, +1 | -1") — 🚜 [refactor] Update changelog release notes command to use latest flag <sub><em>(1 file, +1, -1)</em></sub>

### 🧹 Chores

- [`667b248`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/667b2483e208adce4d4f1aaa32e6da6ac60fb1be "Diff: 2 files, +3 | -3") — Release v1.0.18 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.17...v1.0.18

## What's Changed in v1.0.17

- <b>Commit Range: ➡️</b> [`v1.0.16...v1.0.17`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.16...v1.0.17 "View full commit range on GitHub")

### ✨ Features

- [`5deab0b`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/5deab0b6b12ce00df13060cb012b565392643a93 "Diff: 10 files, +899 | -491") — ✨ [feat] Add new preset option for ESLint configuration <sub><em>(10 files, +899, -491)</em></sub>

- Introduced a new preset option "withoutRemark" to the ESLint configuration.

- Updated the `getPresetByName` function to return the corresponding configuration for "withoutRemark".

- Added test cases to ensure the new preset is recognized and functions correctly alongside existing presets.

### 🚜 Refactor

- [`7fce5b2`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/7fce5b2827520c8c3f243514dcf110d710d0c0b5 "Diff: 1 file, +15 | -7") — 🚜 [refactor] Improve config summary by sorting globals and options <sub><em>(1 file, +15, -7)</em></sub>

- Refactor `summarizeConfig` to use `sortStrings` for sorting globals, parser options, linter options, plugins, and settings for better readability and consistency.

- [`4899fcf`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/4899fcf25d97362973ce6c19f90c85e3d36d0eeb "Diff: 15 files, +17158 | -10132") — 🚜 [refactor] (vite.config.ts) Simplify configuration structure and improve readability <sub><em>(15 files, +17158, -10132)</em></sub>

- Refactored the configuration variables to use a more concise declaration style.

- Grouped related configurations together for better organization.

- Maintained existing functionality while enhancing code clarity.

- Updated test and coverage settings to ensure they align with the new structure.

### 🎨 Styling

- [`e0cb7fc`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/e0cb7fcf590f92025ddf8b7b0ef7ab9cb1746c07 "Diff: 1 file, +4 | -2") — 🎨 [style] Improve comment formatting for shared reporter list in vitest configuration <sub><em>(1 file, +4, -2)</em></sub>

### 🧹 Chores

- [`e924945`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/e92494552994e5c241d293bc25db0796595d4017 "Diff: 2 files, +3 | -3") — Release v1.0.17 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.16...v1.0.17

## What's Changed in v1.0.16

- <b>Commit Range: ➡️</b> [`v1.0.15...v1.0.16`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.15...v1.0.16 "View full commit range on GitHub")

### 🧹 Chores

- [`95abbf9`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/95abbf99a3a55eb580126bd76b7149f50e9865b7 "Diff: 2 files, +3 | -3") — Release v1.0.16 <sub><em>(2 files, +3, -3)</em></sub>

- [`d5716cd`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/d5716cd9159284d9278ad2906f99dcb1d7794e10 "Diff: 6 files, +1180 | -5") — 🧹 [chore] Excludes agent docs from linting <sub><em>(6 files, +1180, -5)</em></sub>

🧹 [chore] Adds agent-instruction documentation to global ignore patterns

- Reduces lint noise by skipping non-source markdown files during analysis.

🔧 [build] Updates a lint plugin to the latest patch release

- Keeps lint behavior aligned with recent tooling fixes and minor improvements.

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.15...v1.0.16

## What's Changed in v1.0.15

- <b>Commit Range: ➡️</b> [`v1.0.14...v1.0.15`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.14...v1.0.15 "View full commit range on GitHub")

### 🎨 Styling

- [`4dab3a1`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/4dab3a13f1cd35da06d6756551d10cd5b48080c3 "Diff: 1 file, +17 | -0") — 🎨 [style] Update ESLint rules to disable specific checks <sub><em>(1 file, +17, -0)</em></sub>

- Disable explicit function return type and prefer destructuring rules

- Turn off various other ESLint rules for improved flexibility

### 🧹 Chores

- [`34b04de`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/34b04de16af9ea18f0ace8b462cdfbb2df708627 "Diff: 2 files, +3 | -3") — Release v1.0.15 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.14...v1.0.15

## What's Changed in v1.0.14

- <b>Commit Range: ➡️</b> [`v1.0.13...v1.0.14`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.13...v1.0.14 "View full commit range on GitHub")

### 🎨 Styling

- [`1209bdd`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/1209bdd9ed48d174c6aff8cbf7d7f5d68220b01b "Diff: 2 files, +50 | -31") — 🎨 [style] Update ESLint disable rules in configuration files <sub><em>(2 files, +50, -31)</em></sub>

- Refactor ESLint disable comments in `shared-config.ts` to streamline rules.

- Remove unnecessary rules from the disable list for better clarity.

- Adjust `vite.config.ts` to simplify the ESLint disable comment.

### 🧹 Chores

- [`8c52edc`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/8c52edc0dce584656c16dd4a6711bfb9bc37a890 "Diff: 2 files, +3 | -3") — Release v1.0.14 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.13...v1.0.14

## What's Changed in v1.0.13

- <b>Commit Range: ➡️</b> [`v1.0.12...v1.0.13`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.12...v1.0.13 "View full commit range on GitHub")

### ✨ Features

- [`50d1484`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/50d1484e27a6c6aebe5af2445d117cda801c1c6e "Diff: 2 files, +430 | -0") — ✨ [feat] (dependencies) Add @codecov/bundle-analyzer and update devDependencies <sub><em>(2 files, +430, -0)</em></sub>

- Introduced @codecov/bundle-analyzer version 2.0.1 to enhance code coverage analysis.

- Updated package-lock.json to reflect new dependency structure and versions.

- [`d1ab7e8`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/d1ab7e818b2f4db7d7da457302fd9ccb4b9204d6 "Diff: 16 files, +1524 | -770") — ✨ [feat] (preset) Introduce getPresetByName function for dynamic preset retrieval <sub><em>(16 files, +1524, -770)</em></sub>

- Added a new function to retrieve ESLint presets by name, improving flexibility and maintainability.

- Updated tests to utilize the new function for fetching presets instead of direct access.

🎨 [style] (vite) Update eslint-disable comments for clarity

- Expanded eslint-disable comments in vite.config.ts to include additional rules for better code quality.

### 🛡️ Security

- [`2e7db87`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/2e7db873be802127b07991592c7eba801afb98c9 "Diff: 2 files, +484 | -494") — 🔧 [chore] Update dependencies in package.json <sub><em>(2 files, +484, -494)</em></sub>

- Upgraded @eslint-react/eslint-plugin from ^5.7.5 to ^5.7.6 for improved linting capabilities.

- Updated @typescript-eslint/eslint-plugin and @typescript-eslint/parser from ^8.59.2 to ^8.59.3 to incorporate the latest TypeScript features and fixes.

- [dependency] Updateed @types/node from ^25.6.2 to ^25.7.0 for better type definitions.

- Updated @vitest/coverage-v8 from ^4.1.5 to ^4.1.6 to ensure compatibility with the latest Vitest features.

- Upgraded vite from ^8.0.11 to ^8.0.12 for performance improvements and bug fixes.

- Ensured all dependencies are up-to-date for optimal performance and security.

- [`ae88352`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/ae883524c516489fdd4e2c7f55d5217a03d76f58 "Diff: 8 files, +11 | -11") — _(deps)_ [dependency] Update dependency group <sub><em>(8 files, +11, -11)</em></sub>

### 🧹 Chores

- [`b57408c`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/b57408ccdb26d439340dab15be1bce38e77d14e2 "Diff: 2 files, +3 | -3") — Release v1.0.13 <sub><em>(2 files, +3, -3)</em></sub>

- [`cdf73ac`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/cdf73ac7f5353fb40a6e3a3eb342e046268d621f "Diff: 4 files, +172 | -177") — 🔧 [chore] Update dependencies and improve scripts <sub><em>(4 files, +172, -177)</em></sub>

- 🔄 Update `eslint-plugin-etc-misc` from `^1.1.2` to `^1.1.3` in `package.json` and `package-lock.json`.

- 🛠️ Add `build:watch` script to `package.json` for easier development.

- 📝 Enhance documentation in `sync-node-version-files.mjs` for clarity and consistency.

- 🎨 Refactor ESLint rules in `shared-config.ts` for better organization and readability.

- ⚡️ Adjust various ESLint rule configurations to improve code quality and maintainability.

### 👷 CI/CD

- [`c5598cb`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/c5598cb9fd43764a019e88dc211c92519f5b9368 "Diff: 1 file, +2 | -1") — 👷 [ci] Update Codecov upload condition for Ubuntu environment <sub><em>(1 file, +2, -1)</em></sub>

- Change the condition for uploading bundle analysis to Codecov to trigger on 'ubuntu-latest' instead of 'windows-latest'

- Add 'continue-on-error: true' to allow the CI to proceed even if this step fails

- [`6d397a4`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/6d397a4c702d5866aca2bee2aa03bed7619e7052 "Diff: 1 file, +1 | -1") — 👷 [ci] Update Codecov upload condition for Windows environment <sub><em>(1 file, +1, -1)</em></sub>

- Change the condition for uploading bundle analysis to Codecov to trigger on 'windows-latest' instead of 'ubuntu-latest'

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.12...v1.0.13

## What's Changed in v1.0.12

- <b>Commit Range: ➡️</b> [`v1.0.11...v1.0.12`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.11...v1.0.12 "View full commit range on GitHub")

### ✨ Features

- [`42fc967`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/42fc9675961f73e7ac7df166354df8d9a0cc19c0 "Diff: 14 files, +6106 | -4299") — ✨ [feat] Update ESLint configuration and tests <sub><em>(14 files, +6106, -4299)</em></sub>

- Refactor preset tests to import from the new preset source

- Ensure all preset rules are correctly exposed and validated in tests

- Adjust TypeScript configuration to disable JS checks and enable isolated declarations

- Modify Vite configuration to include updated source files for coverage

- [`70faf9c`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/70faf9ca20644d9215b53c54a9dd8ad165a4748b "Diff: 3 files, +3361 | -1807") — ✨ [feat] (eslint) Add local ESLint inspector and update dependencies <sub><em>(3 files, +3361, -1807)</em></sub>

- Introduced a new script `build:eslint-inspector:local` to run ESLint configuration inspector.

- Updated various ESLint-related dependencies to their latest versions for improved linting capabilities.

- Enhanced compatibility with newer ESLint plugins and tools, ensuring better code quality and adherence to standards.

### 📦 Dependencies

- [`555001d`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/555001d616a05fb07f6f5e06a35a7c057c94f2d4 "Diff: 4 files, +33 | -7") — ✨ [feat] (dependabot) Enhance Dependabot configuration with npm groups <sub><em>(4 files, +33, -7)</em></sub>
  📝 [docs] (readme) Update README to include npm version badge
  ✨ [feat] (scripts) Add new lint commands for improved linting options
  🚜 [refactor] (shared-config) Refactor shared ESLint config to handle SDL plugins

- [`89f68eb`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/89f68eb01eb5122fc507758298d39cf88cebdf66 "Diff: 1 file, +3 | -3") — [dependency] Update fast-uri in the npm_and_yarn group across 1 directory <sub><em>(1 file, +3, -3)</em></sub>

[dependency] Updates the npm_and_yarn group with 1 update in the / directory: [fast-uri](https://github.com/fastify/fast-uri).

Updates `fast-uri` from 3.1.0 to 3.1.2

- [Release notes](https://github.com/fastify/fast-uri/releases)
- [Commits](https://github.com/fastify/fast-uri/compare/v3.1.0...v3.1.2)

---

updated-dependencies:

- dependency-name: fast-uri
  dependency-version: 3.1.2
  dependency-type: indirect
  dependency-group: npm_and_yarn
  ...

### 🧹 Chores

- [`b0d90a5`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/b0d90a5ea4c44a6ee4dfd129fc3ffd877e10a27b "Diff: 2 files, +3 | -3") — Release v1.0.12 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.11...v1.0.12

## What's Changed in v1.0.11

- <b>Commit Range: ➡️</b> [`v1.0.10...v1.0.11`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.10...v1.0.11 "View full commit range on GitHub")

### ✨ Features

- [`2bcb7b4`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/2bcb7b44bd3fa745fefc6e37021df7dff3c3f24d "Diff: 1 file, +54 | -10") — ✨ [feat] (tsconfig) Enhance exclusion patterns in tsconfig.eslint.json <sub><em>(1 file, +54, -10)</em></sub>

- Added comprehensive exclusion patterns for various build and cache directories

- Improved clarity and maintainability of the configuration

### 🧹 Chores

- [`13fd305`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/13fd3053604c5c87a7f35cc71885337db3ea414e "Diff: 2 files, +3 | -3") — Release v1.0.11 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.10...v1.0.11

## What's Changed in v1.0.10

- <b>Commit Range: ➡️</b> [`v1.0.9...v1.0.10`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.9...v1.0.10 "View full commit range on GitHub")

### ✨ Features

- [`0da0d6d`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/0da0d6d3d54c79d18a23a2b00f660d62846c0822 "Diff: 1 file, +12 | -2") — ✨ [feat] (migration) Update migration steps for eslint-config-nick2bad4u <sub><em>(1 file, +12, -2)</em></sub>

- Add `--force` option to npm install for shared config

- Enhance minimal config example with TypeScript type definition

- Include post-migration message for user guidance

- [`1f7852c`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/1f7852c2cd3d39953a779bbf2964fe2022c21b74 "Diff: 6 files, +300 | -408") — ✨ [feat] (lint) Migrate Secretlint configuration to CommonJS format <sub><em>(6 files, +300, -408)</em></sub>

- Introduced a new Secretlint configuration file `.secretlintrc.cjs` that extends a shared configuration.

- Removed the old JSON configuration file `.secretlintrc.json`.

- Updated the linting script in `package.json` to reference the new CommonJS configuration.

- Added a new Prettier configuration file `prettier.config.mjs` that imports a shared Prettier configuration.

- Updated dependencies in `package-lock.json` to include new configurations and removed unused Secretlint rules.

### 📝 Documentation

- [`dbe8cd5`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/dbe8cd524d15b841129b9eeec41801cf5e2b347c "Diff: 1 file, +13 | -0") — 📝 [docs] Update migration guide to address issues with d.mts files <sub><em>(1 file, +13, -0)</em></sub>

- Added instructions for including `stylelint.config.mjs` in `tsconfig.eslint.json`

- Clarified `files` and `include` lists for better file recognition

### 🧹 Chores

- [`cc4b07c`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/cc4b07c706c6e314649fb0f7f2235abb9c0db50a "Diff: 2 files, +3 | -3") — Release v1.0.10 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.9...v1.0.10

## What's Changed in v1.0.9

- <b>Commit Range: ➡️</b> [`v1.0.8...v1.0.9`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.8...v1.0.9 "View full commit range on GitHub")

### 🧹 Chores

- [`751186c`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/751186c950911ba8b31706c92b88ef1778fa403c "Diff: 2 files, +3 | -3") — Release v1.0.9 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.8...v1.0.9

## What's Changed in v1.0.8

- <b>Commit Range: ➡️</b> [`v1.0.7...v1.0.8`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.7...v1.0.8 "View full commit range on GitHub")

### ✨ Features

- [`8eb9263`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/8eb9263ef23ce2fdd8681a7b1b7843f0543d3503 "Diff: 5 files, +60 | -36") — ✨ [feat] (migration) Update migration guide and ESLint config for improved TypeScript support <sub><em>(5 files, +60, -36)</em></sub>

- Enhance `tsconfig.eslint.json` to use a single catch-all include pattern

- Simplify `tsconfigPaths` to only require `tsconfig.eslint.json`

- Update documentation to reflect changes in TypeScript project configuration

- Remove deprecated tsconfig paths from ESLint config

- [`3433dde`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/3433dded58d62e8664c9d38936794e8a7bd55ca4 "Diff: 1 file, +16 | -11") — ✨ [feat] (migration) Enhance tsconfig.eslint.json with improved include/exclude patterns <sub><em>(1 file, +16, -11)</em></sub>

- Add "allowJs" and "checkJs" options to compilerOptions

- Update include patterns to catch dotfiles

- Refine exclude patterns for better clarity

### 🧹 Chores

- [`3cd80b8`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/3cd80b8e0848da39199d6520f2ab1dbea9785e65 "Diff: 2 files, +3 | -3") — Release v1.0.8 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.7...v1.0.8

## What's Changed in v1.0.7

- <b>Commit Range: ➡️</b> [`v1.0.6...v1.0.7`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.6...v1.0.7 "View full commit range on GitHub")

### ✨ Features

- [`13e4b41`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/13e4b415ee48b7de3a091605e846d48b9ac9451a "Diff: 1 file, +2 | -60") — ✨ [feat] (config) Simplify ESLint config inclusion patterns <sub><em>(1 file, +2, -60)</em></sub>

- Streamlined the "include" section in tsconfig.eslint.json to use a more general pattern

- Removed specific file extensions and patterns for a cleaner configuration

- [`de29908`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/de299082b8df82b0690e469a63951c0ad623c33e "Diff: 5 files, +203 | -84") — ✨ [feat] (config) Enhance ESLint configuration with additional tsconfig paths and improved project glob handling <sub><em>(5 files, +203, -84)</em></sub>

- Update default TypeScript project paths to include `tsconfig.json`, `tsconfig.build.json`, and `tsconfig.js.json`.
- Remove `allowDefaultProjectGlobs` from options and adjust related documentation.
- Expand `tsconfig.eslint.json` to include more file types and directories for inclusion/exclusion.
- Introduce two configuration styles in the migration guide for better flexibility in project setups.

### 🛠️ Bug Fixes

- [`fe54d32`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/fe54d3211cb7cbbe670084fb42e9bf385b481af9 "Diff: 1 file, +0 | -42") — 🔥 [fix] Remove unused peer dependency range logic for eslint <sub><em>(1 file, +0, -42)</em></sub>

- Eliminated minimumSupportedEslintRange and resolvePeerFloorRange functions

- Streamlined code by removing unnecessary fallback logic

### 🧹 Chores

- [`843bafc`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/843bafc257c456bbfd150ebc1e1a7b3098938948 "Diff: 2 files, +3 | -3") — Release v1.0.7 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.6...v1.0.7

## What's Changed in v1.0.6

- <b>Commit Range: ➡️</b> [`v1.0.5...v1.0.6`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.5...v1.0.6 "View full commit range on GitHub")

### ✨ Features

- [`125eecd`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/125eecda86e3bb376db9c7c6e4cd09262cd13d45 "Diff: 3 files, +52 | -21") — ✨ [feat] (config) Add support for allowDefaultProjectGlobs in ESLint config <sub><em>(3 files, +52, -21)</em></sub>

- Introduced `allowDefaultProjectGlobs` option to merge additional glob patterns for project service.

- Updated `createConfig` function to handle new glob patterns for JS/MJS/CJS files outside tsconfig.

- Enhanced TypeScript definitions to include `allowDefaultProjectGlobs` in config options.

### 🧹 Chores

- [`7187045`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/7187045f2e652cf62f8dbd40df0d4ae9ea7dd09f "Diff: 2 files, +3 | -3") — Release v1.0.6 <sub><em>(2 files, +3, -3)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.5...v1.0.6

## What's Changed in v1.0.5

- <b>Commit Range: ➡️</b> [`v1.0.4...v1.0.5`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.4...v1.0.5 "View full commit range on GitHub")

### ✨ Features

- [`14d8932`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/14d893272e15d4be944e190b42e4b5e4b4c3c97b "Diff: 1 file, +20 | -2") — ✨ [feat] Enhance TypeScript project configuration in ESLint setup <sub><em>(1 file, +20, -2)</em></sub>

- Introduce projectService to allow default project for various config file types

- Update project handling to improve compatibility with root-level config files

- [`6082c09`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/6082c09d865331aeb489efa6b12c9983c3bd7145 "Diff: 4 files, +766 | -2") — ✨ [feat] Add synchronization scripts for Node.js and peer dependencies <sub><em>(4 files, +766, -2)</em></sub>

- Introduced `sync:node-version-files` script to manage `.node-version` and `.nvmrc` files.

- Added `sync:peer-eslint-range` script to align `peerDependencies.eslint` with `devDependencies.eslint`.

- Implemented `sync:peer-typescript-range` script to synchronize `peerDependencies.typescript` with `devDependencies.typescript`.

- Updated `update-deps` script to include new synchronization scripts.

- [dependency] Updateed TypeScript peer dependency range to `^6.0.3`.

### 🛡️ Security

- [`31abf3f`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/31abf3ff441eea367db1bbfd8b10b326274d711d "Diff: 9 files, +23 | -23") — _(deps)_ [dependency] Update dependency group <sub><em>(9 files, +23, -23)</em></sub>

### 📝 Documentation

- [`8e26d48`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/8e26d48c6833e08795b85b9eb1ffb8082989ee92 "Diff: 1 file, +274 | -0") — 📝 [docs] Add migration guide for transitioning to eslint-config-nick2bad4u <sub><em>(1 file, +274, -0)</em></sub>

- Provide prerequisites for migration including Node.js, ESLint, and TypeScript versions

- Outline steps for uninstalling plugins, installing the shared config, and replacing config files

- Include detailed instructions for verifying the setup and troubleshooting common issues

- Document available presets and their purposes for user reference

### 🧹 Chores

- [`e73aef6`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/e73aef6b025c428213fc96a5faa357c6fa7a8107 "Diff: 2 files, +3 | -3") — Release v1.0.5 <sub><em>(2 files, +3, -3)</em></sub>

- [`ca321cd`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/ca321cd759a1b951b2fb8903f14a69d13c265818 "Diff: 2 files, +282 | -213") — 🔧 [chore] Update dependencies in package.json <sub><em>(2 files, +282, -213)</em></sub>

- Upgraded "@docusaurus/eslint-plugin" from "^3.10.0" to "^3.10.1" for improved linting capabilities.

- Updated "@eslint-react/eslint-plugin" from "^5.6.0" to "^5.6.6" to incorporate recent fixes and enhancements.

- [dependency] Updateed "@eslint/css" from "^1.1.0" to "^1.2.0" for better CSS linting support.

- Increased "eslint-plugin-etc-misc" from "^1.0.8" to "^1.1.0" to include new rules and improvements.

- Upgraded "eslint-plugin-immutable-2" from "^1.1.0" to "^1.2.0" for enhanced immutability checks.

- Updated "eslint-plugin-sdl-2" from "^1.1.0" to "^1.2.0" for better SDL linting.

- [dependency] Updateed "eslint-plugin-tsdoc-require-2" from "^1.1.0" to "^1.2.0" for updated TSDoc requirements.

- Increased "eslint-plugin-typedoc" from "^1.2.0" to "^1.3.0" for improved TypeDoc support.

- Updated "eslint-plugin-write-good-comments-2" from "^1.1.0" to "^1.2.0" for better comment quality checks.

- [dependency] Updateed "eslint-plugin-yml" from "^3.3.1" to "^3.3.2" for YAML linting improvements.

- Upgraded "globals" from "^17.5.0" to "^17.6.0" to include new global variables.

- Updated "eslint" from "^10.2.1" to "^10.3.0" for the latest features and bug fixes.

- Adjusted peer dependency "eslint" from "^10.2.1" to "^10.3.0" to align with the updated version.

- [`62529c5`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/62529c51da4b628cc091f74f85dbe78a90e2a67e "Diff: 1 file, +0 | -21") — 🔧 [chore] Remove unused npm ecosystem configuration from Dependabot <sub><em>(1 file, +0, -21)</em></sub>

### New Contributors

- @dependabot[bot] made their first contribution

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.4...v1.0.5

## What's Changed in v1.0.4

- <b>Commit Range: ➡️</b> [`v1.0.3...v1.0.4`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.3...v1.0.4 "View full commit range on GitHub")

### 🧹 Chores

- [`04ffd37`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/04ffd3797db17c88eccc3ac35cf82c963482d580 "Diff: 2 files, +3 | -3") — Release v1.0.4 <sub><em>(2 files, +3, -3)</em></sub>

- [`6fcc61c`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/6fcc61cbe99b94ba7c8e974c3e5166950210e0ac "Diff: 1 file, +6 | -0") — 🔧 [chore] Disable unused ESLint plugins in configuration <sub><em>(1 file, +6, -0)</em></sub>

- Removed "file-progress", "github-actions", "immutable", "repo-compliance", "sdl", and "write-good-comments" plugins from various configurations to streamline ESLint setup.

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.3...v1.0.4

## What's Changed in v1.0.3

- <b>Commit Range: ➡️</b> [`v1.0.2...v1.0.3`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.2...v1.0.3 "View full commit range on GitHub")

### 🧹 Chores

- [`e7a2b20`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/e7a2b20d54dbad4e4328da13e7256abc0065f353 "Diff: 2 files, +3 | -3") — Release v1.0.3 <sub><em>(2 files, +3, -3)</em></sub>

- [`2c6a106`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/2c6a1060177b53a07de9a895c3c64482836d5aa6 "Diff: 1 file, +1 | -1") — 🔧 [chore] Update ESLint rule for extra spacing in HTML tags <sub><em>(1 file, +1, -1)</em></sub>

- Changed rule from "html/no-extra-spacing-attrs" to "html/no-extra-spacing-tags"

- Adjusted enforcement to ensure proper spacing before self-closing tags

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.2...v1.0.3

## What's Changed in v1.0.2

- <b>Commit Range: ➡️</b> [`v1.0.1...v1.0.2`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.1...v1.0.2 "View full commit range on GitHub")

### ✨ Features

- [`59b8731`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/59b8731f4c5ed6bb4dd6e135957635c4b161b2ca "Diff: 4 files, +19 | -11") — ✨ [feat] Update ESLint config exports to use 'presets' instead of 'configs' <sub><em>(4 files, +19, -11)</em></sub>

- Refactor index.d.ts and preset.mjs to rename 'configs' to 'presets'

- Update README.md to reflect new import style for presets

- Modify preset.test.ts to test against 'presets' instead of 'configs'

### 🧹 Chores

- [`a01e4fd`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/a01e4fd1f222e53f77e23ede1b18bc4b9b0eddc1 "Diff: 2 files, +3 | -3") — Release v1.0.2 <sub><em>(2 files, +3, -3)</em></sub>

- [`c575a49`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/c575a49ec34567b43559919f396230c595792bd6 "Diff: 3 files, +18 | -16") — 🔧 [chore] (eslint-config) Simplify TypeScript config resolution paths <sub><em>(3 files, +18, -16)</em></sub>

- Removed unused TypeScript config paths from DEFAULT_TSCONFIG_PATHS

- Updated documentation to reflect the change in default config path

- [`cc46f83`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/cc46f8353f6c4df56508bed00df8d7e4d04950eb "Diff: 1 file, +1 | -1") — 🔧 [chore] Update sonar.cpd.exclusions to include eslint.config.mjs <sub><em>(1 file, +1, -1)</em></sub>

**Full Changelog**: https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/v1.0.1...v1.0.2

## What's Changed in v1.0.1

- <b>Commit Range: ➡️</b> [`9db3014...v1.0.1`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/compare/9db301472401e0f11903f6dabc31db88809e9149...v1.0.1 "View full commit range on GitHub")

### ✨ Features

- [`f5548f1`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/f5548f103c9c7f4336e5047b71fd9b198eb4cbaa "Diff: 2 files, +3 | -3") — ✨ [feat] Update version to 1.0.0 in package.json and package-lock.json <sub><em>(2 files, +3, -3)</em></sub>

- [`804717c`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/804717c1eebb06805c9639b1b74bc2ce29646e6b "Diff: 13 files, +243 | -47") — ✨ [feat] (eslint-config) Add new presets to disable specific plugin rules <sub><em>(13 files, +243, -47)</em></sub>

- Introduced presets to disable rules for:

- ChunkyLint

- Docusaurus 2

- File Progress 2

- GitHub Actions 2

- Immutable 2

- Repo

- SDL 2

- Stylelint 2

- TSDoc Require 2

- TypeDoc

- Uptime Watcher

- Vite

- Write Good Comments 2

📝 [docs] Update README and add maintainer guide

- Removed outdated wording from README

- Added MAINTAINER_GUIDE.md for maintainers

- Historical changes documented in DIFF_NOTES.md

🔧 [chore] Update TypeScript configuration files

- Adjusted tsconfig settings for better compatibility

- Updated include paths in various tsconfig files

- [`9db3014`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/9db301472401e0f11903f6dabc31db88809e9149 "Diff: 79 files, +24916 | -0") — ✨ [feat] (eslint-config) Introduce eslint-config-nick2bad4u with presets and configuration <sub><em>(79 files, +24916, -0)</em></sub>

- Add `preset.mjs` for shared ESLint configurations, exposing various presets.

- Create `sonar-project.properties` for SonarCloud integration, defining project settings and exclusions.

- Implement tests in `preset.test.ts` to validate the behavior of the ESLint configurations.

- Add multiple TypeScript configuration files (`tsconfig.build.json`, `tsconfig.eslint.json`, `tsconfig.js.json`, `tsconfig.json`, `tsconfig.vitest-typecheck.json`) for different build and linting scenarios.

- Establish `vite.config.ts` for Vitest configuration, including coverage settings and test file patterns.

### 🧹 Chores

- [`f7070e0`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/f7070e0a68d25d3908609b6482a0060d9534d8aa "Diff: 2 files, +3 | -3") — Release v1.0.1 <sub><em>(2 files, +3, -3)</em></sub>

- [`e5aa58e`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/e5aa58e135a4c8d04dbde122d4fe348450ed7dbe "Diff: 2 files, +2 | -12") — 🔧 [chore] Remove actionlint from package.json and package-lock.json <sub><em>(2 files, +2, -12)</em></sub>

- [`9aa8403`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/9aa84037677c21692a706bbc525effa4c788f884 "Diff: 1 file, +0 | -113") — 🔥 [chore] Remove Docusaurus deployment workflow <sub><em>(1 file, +0, -113)</em></sub>

- [`6a567ee`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/6a567ee2788af6289a353bce5e3c18992ad68561 "Diff: 2 files, +2355 | -1029") — 🔧 [chore] Update eslint-import-resolver-node to version 0.3.10 <sub><em>(2 files, +2355, -1029)</em></sub>

- Upgraded the eslint-import-resolver-node dependency from version 0.3.9 to 0.3.10 to ensure compatibility with the latest features and improvements.

- [`dd28c08`](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/commit/dd28c0802262789a3721ad10fe99bad00e51aa9a "Diff: 2 files, +5 | -2") — 🔧 [chore] Update configuration for npm-check-updates <sub><em>(2 files, +5, -2)</em></sub>

- Set "workspaces" to false in .ncurc.json to disable workspace support

- Refine typecheck script in package.json to include additional TypeScript configuration files

- Add new scripts for type checking and dependency updates

### New Contributors

- @github-actions[bot] made their first contribution
- @Nick2bad4u made their first contribution

## ⭐ Contributors

Thanks to all the [contributors](https://github.com/Nick2bad4u/eslint-config-nick2bad4u/graphs/contributors) for their hard work!
_This changelog was automatically generated with [git-cliff](https://github.com/orhun/git-cliff)._
