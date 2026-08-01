# Contributing

- Use Node.js 20 or 22 and keep behavior portable across Windows, macOS and Linux.
- Add tests before changing request contracts, cost logic or provider behavior.
- Keep mock mode functional without credentials.
- Never commit API keys, avatar/voice identifiers, training media, generated videos, `.runtime/` or local profiles.
- Run `npm run verify` before opening a pull request.
- Document privacy, identity-consent and provider-cost impact in every relevant change.

Use conventional commit prefixes such as `feat:`, `fix:`, `docs:`, `test:` and `chore:`. Report vulnerabilities privately through GitHub Security Advisories or private vulnerability reporting when available.
