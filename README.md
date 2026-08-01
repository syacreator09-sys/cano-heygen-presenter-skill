# CANO HeyGen Presenter Skill

Generate reusable presenter segments from JSON. Mock mode is dependency-free and live mode uses the HeyGen REST API through Node's built-in `fetch`.

```bash
node bin/cano-heygen.js doctor
node bin/cano-heygen.js validate examples/cano-presenter.request.json
node bin/cano-heygen.js render examples/cano-presenter.request.json --mock
```

Copy `profiles/example.profile.json` to an ignored `profiles/<name>.local.json` and set provider identifiers through environment variables. Never commit private avatar IDs or training media.
