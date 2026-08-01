# Functional Options

## Commands

| Command | Purpose | Provider cost |
|---|---|---|
| `cano-heygen doctor` | Check Node, platform and API-key presence | None |
| `cano-heygen validate request.json` | Validate profile, format and segments | None |
| `cano-heygen estimate request.json` | Estimate duration and provider credits | None |
| `cano-heygen render request.json --mock` | Produce manifests without provider calls | None |
| `cano-heygen render request.json --live` | Submit authorized segments to the provider | Possible cost |

## Segment purposes

- `hook`
- `introduction`
- `explanation`
- `tip`
- `warning`
- `comparison`
- `transition`
- `conclusion`
- `cta`

## Supported formats

- 9:16 vertical
- 16:9 horizontal
- multiple short, replaceable segments per job

## Private configuration

Store provider keys and real identity identifiers outside Git:

```text
HEYGEN_API_KEY
HEYGEN_AVATAR_ID
HEYGEN_VOICE_ID
profiles/*.local.json
.runtime/
```

## Current limits

- Version 0.1 submits jobs but does not yet poll, download and normalize completed videos.
- Provider cost estimates are assumptions, not billing guarantees.
- Identity, consent, pronunciation and factual review remain human approval steps.
