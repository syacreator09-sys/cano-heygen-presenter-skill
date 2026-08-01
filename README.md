# CANO HeyGen Presenter Skill

Generate reusable presenter segments from JSON. Mock mode is dependency-free and live mode uses the configured HeyGen account through Node's built-in `fetch`.

## Quick start

```bash
npm install
npm run verify
node bin/cano-heygen.js doctor
node bin/cano-heygen.js validate examples/cano-presenter.request.json
node bin/cano-heygen.js estimate examples/cano-presenter.request.json
node bin/cano-heygen.js render examples/cano-presenter.request.json --mock
```

Copy `profiles/example.profile.json` to an ignored `profiles/<name>.local.json` and set provider identifiers through environment variables. Never commit private avatar IDs, voice IDs, API keys or training media.

## Documentation

- [Functional options](docs/OPTIONS.md)
- [Security](SECURITY.md)
- [Privacy](PRIVACY.md)
- [Responsible use](USAGE_POLICY.md)
- [Brand and identity rights](BRAND_AND_IDENTITY.md)
- [Third-party notices](THIRD_PARTY_NOTICES.md)
- [Contributing](CONTRIBUTING.md)
- [MIT License](LICENSE)

Verification is local only; this repository intentionally contains no GitHub Actions workflows.
