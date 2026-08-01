---
name: cano-heygen-presenter
summary: Generate segmented avatar videos through HeyGen with local profiles, cost gates, mock mode and resumable manifests.
triggers:
  - genera mi avatar de heygen
  - crea segmentos de presentador
  - renderiza hook y cta con avatar
---

# CANO HeyGen Presenter

- Validate requests before provider use.
- Use mock mode until the operator approves cost and supplies `HEYGEN_API_KEY` plus avatar/voice identifiers.
- Generate short, replaceable segments instead of one uninterrupted long video.
- Keep local identity profiles ignored by Git.
