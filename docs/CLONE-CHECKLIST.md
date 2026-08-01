# Clone checklist

After cloning:

```bash
npm install
npm run init
npm run verify
node bin/cano-heygen.js doctor
node bin/cano-heygen.js render examples/cano-presenter.request.json --mock
```

Before live:

- configure API key, avatar ID and voice ID locally;
- copy the example profile to an ignored `*.local.json` file;
- run `estimate`;
- confirm identity authorization;
- set a conservative credit ceiling;
- review the generated MP4 before use.
