# Fraudia Asset Pack — v1

Professional corporate insurance fraud detection visual assets for the Fraudia web application.

All assets strictly follow the specification:
- Pure white #FFFFFF background on every asset
- Exact palette: Navy #1E3A5F (primary), Red #C0392B, Green #27AE60, Yellow #F39C12
- No text, no numbers, no labels, no people, no faces, no neon
- Corporate, clean, minimal, premium SaaS / fintech insurance aesthetic
- Static images: PNG
- Animations: MP4 seamless loops (visually seamless — last frame connects to first with no perceptible cut)

## Folder Structure
- png/          — 7 static icons and background texture (high-resolution)
- mp4/          — 5 seamless loop animations (recommended 1280x720 @ 24fps)
- posters/      — First-frame still images for reduced-motion fallbacks and previews
- prompts/      — Exact generation prompts used (for reproducibility and future regeneration)

## Generation Notes
Generated using the refined prompts from the authoritative design document:
.design/11d136cb/design-doc.md

All prompts enforce 100% of the original restrictions plus practical production guidance (visually seamless + SSIM validation for loops).

## Integration
See the full design document for:
- RiskScorer / FraudRuleEngine mapping (SCORE GAUGE + NETWORK)
- Streamlit-first FraudiaAsset wrapper component
- PR plan for incremental integration (PR 3 = PNGs, PR 4 = MP4s)
- Accessibility (prefers-reduced-motion, decorative vs meaningful)
- Performance budgets and CDN recommendations

## Constraints (enforced on every asset)
Pure white #FFFFFF background always.
No dark backgrounds. No neon. No text or labels. No people.
