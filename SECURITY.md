# Security policy

Security reports for `eslint-config-nick2bad4u` should be handled privately
until the issue is understood and a safe disclosure path exists.

## Supported versions

The latest published version receives security fixes. Older versions may receive
guidance when the fix is straightforward, but users should expect to upgrade to
the latest release for security patches.

## Reporting vulnerabilities

Report suspected vulnerabilities privately by emailing
[20943337+Nick2bad4u@users.noreply.github.com](mailto:20943337+Nick2bad4u@users.noreply.github.com).

Do not open a public issue, pull request, discussion, or social media thread with
exploit details before the report has been triaged.

Include as much of the following information as you can safely share:

- affected package version;
- Node.js, npm, ESLint, and TypeScript versions;
- operating system and shell when relevant;
- minimal `eslint.config.mjs` and `tsconfig.eslint.json` needed to reproduce;
- exact command and output;
- impact assessment, including whether the issue exposes secrets, executes
  untrusted code, corrupts generated files, or bypasses a security lint rule;
- proof of concept details, if sharing them is safe over email.

## Triage and disclosure

The maintainer will review private reports as availability allows and may ask for
additional reproduction details. If the report is valid, the preferred fix path
is a patched release plus public notes that describe impact and upgrade guidance
without publishing unnecessary exploit detail.

If the report is not a vulnerability, it may be redirected to a public issue for
normal support after sensitive details are removed.
