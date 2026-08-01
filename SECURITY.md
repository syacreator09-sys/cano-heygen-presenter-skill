# Security Policy

## Supported versions

Security fixes are applied to the latest release and the active `main` branch.

## Reporting a vulnerability

Do not publish exploits, provider credentials, private avatar identifiers, cloned-voice details or generated customer media in a public issue. Use GitHub private vulnerability reporting or a private Security Advisory when available.

## Security boundaries

- Mock mode is the default and performs no provider request.
- Live generation requires an explicit `--live` flag.
- API keys and real identity identifiers are read from the operator's environment.
- Provider content policies, consent controls and account restrictions must not be bypassed.

## Secret and identity handling

- Keep API keys, avatar IDs, voice IDs, training media, local profiles and outputs outside Git.
- Use `.runtime/` and ignored `*.local.json` profiles.
- Apply least privilege to provider keys and rotate any credential that may have leaked.
- Run `npm run audit:release` before sharing or publishing.
- Require human approval before identity use, provider spending and publication.

## Dependency and provider review

Review provider API changes, account permissions, SDK advisories and privacy terms before live production use.
