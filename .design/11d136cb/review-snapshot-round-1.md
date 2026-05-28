# Design Document Review: Fraudia Visual Asset Pack

**Reviewed by**: Senior Staff Engineer (Grok-assisted code exploration)  
**Review Date**: 2026-05-27  
**Design Document**: `.design/11d136cb/design-doc.md` (39,135 bytes)  
**Summary**: `.design/11d136cb/summary.md` (3,380 bytes)  
**Codebase Explored**: Full repo via list_dir + targeted read_file/grep/run_terminal_command on README.md, src/scoring/*, src/rules/*, src/explainability/*, src/ai_agent/*, src/app/main.py, src/models/*, docs/*, reports/, requirements.txt, and all other top-level artifacts. All claims cross-checked against live source.

---

### Summary

**Verdict: NEEDS REVISION (one cycle)**

The design is exceptionally well-researched, with accurate, line-specific citations to the real codebase (Strategy pattern across 4 modules, exact 40/75 thresholds, 0-byte stubs, 10 RuleStrategies, 12,500 synthetic rows, empty docs/*.md). The 12 generation prompts are among the strongest seen — they rigorously enforce every constraint (pure #FFFFFF, exact hex palette, no text/people/neon, seamless technical requirements). Alternatives are fairly analyzed and PR plan is mostly well-scoped for incremental delivery.

However, **multiple major blocking issues** prevent immediate implementation readiness: unresolved frontend stack choice before proposing concrete code in PRs 6-7, absence of a consolidated Risks section, over-optimism on perfect seamless loops from generative tools, inadequate guidance on large binary asset management in git, and several production gaps (a11y specifics, file size budgets, optimization tool mismatch). The design is ~85% ready; one focused revision addressing the top 5 issues will make it implementation-ready for a small team.

All issues below have **Status: open**.

---

### Issue 1: Frontend stack decision deferred while PR plan and architecture diagrams commit to concrete web technology paths
- **Severity**: major
- **Section**: PR Plan (design-doc.md:449-457), High-Level Architecture Diagram (design-doc.md:99-102), Component Interface Sketch (design-doc.md:131-145), Open Questions (design-doc.md:267)
- **Description**: The design correctly identifies in Open Question #1 that "What is the target frontend stack... (Next.js monorepo..., or Python Streamlit/Dash for analyst MVP first)?" is unresolved. Despite this, PR 6 explicitly calls for `frontend/components/FraudiaAsset.tsx` (or "Python equivalent"), PR 7 for wiring into `src/app/main.py` (or `frontend/app/dashboard/page.tsx`), and the architecture diagram shows "Marketing Site (Next.js + Tailwind + Framer)" and "Internal Analyst Dashboard (React/Next or Streamlit)". This creates ambiguity for a small team on a pure-Python prototype (confirmed: requirements.txt contains only pandas/numpy/scikit/xgboost/lightgbm/matplotlib/joblib/faker; no package.json, no .github, no node tooling; src/app/main.py is exactly 0 bytes per `Get-Item` + Get-Content). Starting PR 6-7 without a decision risks wasted effort or premature architectural commitment. Design summary claims "design is complete" but leaves a core choice open.
- **Suggestion**: Resolve Open Question #1 in the design (recommend Streamlit or FastAPI + Jinja for analyst MVP first given current stack + empty main.py; defer full Next.js to a later FA-3 or separate marketing site epic). Update PR 6/7 descriptions and architecture diagram to have a single primary path + optional note. Add a new "Key Decision 9" locking the initial integration target.
- **Status**: open

### Issue 2: No dedicated "Risks" section with severity + mitigation (checklist requirement)
- **Severity**: major
- **Section**: Overall structure (design-doc.md:219-242 Security, 231-244 Observability, 247-262 Rollout, 265-273 Open Questions); no "Risks" or "Assumptions" heading
- **Description**: The review checklist explicitly requires "Risks: Are risks identified with severity and mitigation?" The document scatters good content (e.g., "Accessibility threat: Over-use of autoplay video..." at design-doc.md:224, supply chain at 223, brand inconsistency at 227, motion sickness for analysts at 224) but lacks a consolidated table or subsection (e.g., "Risk: Imperfect seamless loops from video_gen | Severity: High | Mitigation: ..."). Other high-impact risks are under-called: generative model non-determinism (text/people creeping in despite prompts), small-team skill gap for web introduction, git repository bloat from 5 MP4s, video autoplay policy violations in browsers, and long-term maintenance of generated rasters vs code-driven visuals.
- **Suggestion**: Add a new top-level "## Risks & Mitigations" section after Alternatives. Include at minimum 6-8 rows with Severity (High/Med/Low), Likelihood, Impact on timeline/quality, and concrete mitigation + owner (e.g., "Gen model violating no-text rule | High | PR3/4 human review + validation script must fail on OCR-detectable text"). Reference existing mitigations and elevate them.
- **Status**: open

### Issue 3: Overly optimistic feasibility claims for "pixel-perfect" seamless MP4 loops from generative tools
- **Severity**: major
- **Section**: Asset Inventory (design-doc.md:79-84), Production-Ready Asset Prompts (design-doc.md:333-356, esp. every MP4 prompt), Key Decision 6 (design-doc.md:412), PR 4 (design-doc.md:439-443)
- **Description**: All 5 video prompts contain strong language, e.g. "Perfect seamless loop: the exact position, rotation angle, scale, and glow intensity of every element at frame 180 (last) must be pixel-perfect identical to frame 1 (first) so looping is completely invisible and infinite" (hero sphere, design-doc.md:335); identical phrasing for network, gauge, document scan, AI chat. Key Decision 6 claims this is "Critical for professional polish" and "enforced via explicit... language". However, current generative video tools (including the environment's video_gen) produce stochastic output; perfect frame N == frame 1 at pixel level for complex multi-element motion (rotating 3D-ish sphere with floating docs/shields, traveling dots on network lines, dynamic appearing check/X marks) is not reliably achievable without heavy manual post-production in After Effects or similar. PR 2 only vaguely references "seamlessness heuristics" in validate-assets.py. This is a core quality risk for the 5 loops.
- **Suggestion**: Downgrade language from "pixel-perfect" to "visually seamless to the naked eye at target playback size/framerate". Add explicit post-processing step in PR 2/4 (ffmpeg loop-aware encoding, crossfade or optical flow repair if needed, or acceptance of near-seamless + poster fallback). Add a Risk entry (see Issue 2). Include concrete acceptance criteria in validation script (e.g., "SSIM(frame 0, frame N-1) > 0.98 at 720p").
- **Status**: open

### Issue 4: Insufficient guidance on large binary MP4 asset management (git, CDN, sizes)
- **Severity**: major
- **Section**: API / Interface Changes (manifest.json, design-doc.md:155-189), Rollout Plan (design-doc.md:249-262), PR 1 (design-doc.md:424-428), Observability (design-doc.md:237-238)
- **Description**: Design correctly calls for `.gitignore` updates in PR 1 and "Manifest checksums" + "CDN" in rollout. However, no file size budgets, no discussion of Git LFS vs. external storage (S3/Cloudinary/Vercel Blob), and no codec/fallback strategy (Open Question #6 at design-doc.md:272 remains open). 5x 6-7s 1280x720@30fps MP4s (even optimized) will be multi-MB each; committing to git (even with .gitignore exceptions for LFS) is poor practice for a hackathon-style repo and will break many CI environments. "sharp" is referenced for optimization (design-doc.md:96) but is a Node.js tool — mismatch with pure-Python project (requirements.txt confirmed).
- **Suggestion**: Add explicit "Asset Storage & Delivery" subsection: (a) recommended LFS or external CDN as primary, (b) hard size budgets (e.g. each MP4 <1.8 MB after ffmpeg two-pass + preset), (c) primary H.264 + optional WebM, (d) Python-only optimization path (imageio-ffmpeg + Pillow + pngquant via subprocess) if staying Streamlit-first. Update PR 1/2/8 accordingly. Resolve Open Question #2 and #6 here.
- **Status**: open

### Issue 5: PR 7 scope too large / insufficiently decomposed for "independently reviewable" small-team PRs
- **Severity**: major
- **Section**: PR Plan (design-doc.md:454-458)
- **Description**: PR 7 is described as "Wire basic risk gauge + network visualization into a dashboard prototype" affecting `src/app/main.py` (or new frontend files), "integration using RiskScorer output + FraudiaAsset", "minimal CSS/Tailwind", "Behind a feature flag". This is a substantial vertical slice (live data from RiskScorer.get_summary + FraudRuleEngine.evaluate + ScoreExplainer + new asset component + UI). For a small team (1-2 engineers) this is likely 3-5 days of work and touches multiple new concerns (state management, video playback controls, feature flag plumbing). Contradicts the goal of "Small, focused" PRs stated at design-doc.md:422. PRs 1-4 are excellent; 5-6 good; 7-8 jump in size.
- **Suggestion**: Split PR 7 into two: (7a) Minimal dashboard prototype stub + RiskScorer integration using only static PNG fallbacks (no video yet); (7b) Add MP4 loops + network widget + basic reduced-motion handling. Or narrow 7 to "one widget only (score gauge) using one MP4 + one PNG in a new Streamlit page". Update dependencies and description.
- **Status**: open

### Issue 6: Minor citation inaccuracies and missing repo structure notes
- **Severity**: minor
- **Section**: Background (design-doc.md:29), References (design-doc.md:281), PR 2 (design-doc.md:430)
- **Description**: Design states "`src/rules/fraud_rules.py:58`" for alerts list (design-doc.md:119). Actual source (verified via read_file + Select-String): `result_df["alerts"] = ...` occurs at line 59 (after the loop that populates at 58 in the per-row dict). Other citations are precise (e.g. scoring_strategies.py:52-58 for get_risk_level, fraud_rules.py:19 for FraudRuleEngine). PR 2 introduces `scripts/generate-fraudia-assets.sh` and `scripts/validate-assets.py` with no note that `scripts/` directory does not exist today (confirmed via list_dir + PowerShell). Also, branch is referenced inconsistently as "FA-2-Arquitectura" in design vs. "feature/FA-2-Arquitectura" in review instructions.
- **Suggestion**: Fix the line number. Add one sentence in PR 2: "New `scripts/` directory (does not exist today)." Standardize branch references to match actual ticket (e.g., "feature/FA-2-Arquitectura").
- **Status**: open

### Issue 7: Production accessibility and motion concerns lack concrete implementation details
- **Severity**: minor
- **Section**: Key Decision 7 (design-doc.md:414), Component sketch (design-doc.md:138), Security (design-doc.md:224), Rollout (design-doc.md:254)
- **Description**: The design correctly elevates `prefers-reduced-motion`, "decorative vs. meaningful", and analyst cognitive load. However, it provides no concrete code-level guidance: no example CSS (`@media (prefers-reduced-motion: reduce) { video { display:none } }` or React hook), no dashboard-specific policy (e.g., "all loops default paused in internal analyst context; autoplay only in marketing hero"), no keyboard controls for video widgets, no alternative text/transcript strategy for the 5 loops, and no WCAG 2.2 AA notes for motion content. "reducedMotionFallback" prop exists in sketch but is not elaborated.
- **Suggestion**: Add a 1-page "Motion & Accessibility Contract" appendix or expand the component interface section with 4-5 concrete rules + pseudocode examples for both Next.js and Streamlit paths. Make "motion off by default on any internal/dashboard surface" an explicit rule.
- **Status**: open

### Issue 8: Optimization and validation tooling references contain tech stack mismatch
- **Severity**: minor
- **Section**: Architecture diagram (design-doc.md:96 "pngquant + ffmpeg + sharp"), PR 2 (design-doc.md:431)
- **Description**: "sharp" (high-performance Node image processor) is listed alongside Python-native tools. The project has zero Node dependencies or tooling (confirmed via requirements.txt + absence of package.json + grep). If the team follows the Python/Streamlit path for early dashboard work (permitted by the design), the optimization story is incomplete.
- **Suggestion**: Provide dual paths in PR 2 and architecture: (primary for Python track) Pillow + imagequant-py + ffmpeg-python; (secondary) sharp when Next.js is chosen. Or remove "sharp" and standardize on cross-platform CLI tools + Python wrappers.
- **Status**: open

### Issue 9: Alternatives section is good but misses two high-value options for motion assets
- **Severity**: minor
- **Section**: Alternatives Considered (design-doc.md:200-216)
- **Description**: The three alternatives (pure SVG+CSS/JS, broader palette+dark variants, matplotlib reuse) are fairly evaluated with explicit trade-offs. However, two relevant options for a small team / Python-first project are absent: (a) Lottie / Bodymovin JSON + lottie-web (or Python lottie renderer) for the 5 loops — vector, tiny files, perfect reduced-motion control, designer-friendly; (b) Canvas/WebGL or SVG + Framer Motion (or Streamlit custom components) for the gauge and network specifically (only document-scan and sphere truly need raster video fidelity).
- **Suggestion**: Add "Alternative 4: Lottie JSON for loops + Canvas for gauge/network" with pros/cons. This would be especially valuable given the pure-Python starting point and would reduce the MP4 binary problem (Issue 4).
- **Status**: open

### Issue 10: Missing quantitative production details (budgets, dimensions, CI expectations)
- **Severity**: nit
- **Section**: Open Questions (design-doc.md:268-272), API manifest example (design-doc.md:176-181), Rollout (design-doc.md:261)
- **Description**: Open Questions #2 and #6 remain unresolved inside the design itself. No example manifest values for `durationSeconds`, `width/height`, bitrate hints, or "performance budgets" (mentioned only qualitatively). PR 8 references "performance budgets" without numbers. No guidance on CI matrix (Windows + Linux ffmpeg availability).
- **Suggestion**: Resolve the two open questions with concrete recommendations (e.g., "Target 1280x720 @ 24fps, H.264 CRF 28, each MP4 ≤ 1.5 MiB"). Add a small "Performance Budgets" table in the manifest section or Rollout. Minor because prompts already give good starting dimensions.
- **Status**: open

---

### Strengths

- **Outstanding codebase fidelity and citation quality**: Every major claim was verified correct via direct file reads (e.g., HybridScoringStrategy thresholds exactly `threshold_low: int = 40, threshold_high: int = 75` at scoring_strategies.py:28-29 and identical logic in RulesOnly; RiskScorer defaults to it at risk_scorer.py:10; FraudRuleEngine exactly 10 strategies at fraud_rules.py:24-35; ScoreExplainer + 3 ExplanationStrategy variants; 0-byte main.py and claims_agent.py and all docs/*.md except the design files; 23 Strategy subclasses total across modules via grep; exact README risk table 0-40/41-75/76-100; 12,500 rows, 200 providers, etc.). The writer's summary explicitly documents tool-driven exploration — rare and excellent.
- **Production-ready prompts (the strongest part of the document)**: All 12 prompts (design-doc.md:296-356) are copy-paste executable and repeatedly embed 100% of the required constraints: "Pure solid white #FFFFFF background", "exact Navy blue #1E3A5F", "No text, no numbers, no labels, no people, no faces", "No readable text or numbers — all abstract geometric forms only", specific accent hex for red/yellow/green in gauge + network + icons, "Perfect seamless loop: ... pixel-perfect identical to frame 1" language in every MP4 prompt, Awwwards-tier / anti-generic / anti-neon / anti-consumer qualifiers repeated for enforcement. PNGs consistently 1024x1024 square. This enables immediate generation work.
- **Strong PR decomposition for incremental value on a small team**: PR 1-4 deliver real assets quickly with no code risk. Dependencies are explicit. PRs are independently reviewable in principle (icons before loops, docs after assets exist). Feature-flag and rollback guidance is practical.
- **Good coverage of Strategy pattern alignment and integration points**: Direct, accurate mappings from assets to RiskScorer.get_summary / get_risk_level (scoring_strategies.py:52-58), FraudRuleEngine.evaluate + alerts (fraud_rules.py), ScoreExplainer (explain_score.py:18), document quality features (build_features.py:88-89), and the 5 process steps to pipeline stages. Mermaid diagrams are useful.
- **Thoughtful production & rollout thinking**: Manifest + versioning + v1/ directory, observability events (seamless_loop_count), CDN/rollback strategy, reduced-motion intent, and security (purely decorative, no PII) are all present and mostly correct. References section is comprehensive.
- **Honest current-state assessment**: Correctly calls out the prototype limitations (empty stubs, matplotlib-only visuals, no design system) without exaggeration.

---

**Recommendation**: Address Issues 1-5 (the majors) + quick fixes for 6-8 in one revision pass. The resulting document will be implementation-ready: an engineer can immediately execute the 12 prompts and begin PR 1 on the feature/FA-2-Arquitectura branch with clear guardrails. The prompt quality and research depth are already at senior-staff level.

**End of Review**

*All citations above were obtained by direct tool-assisted inspection of the live filesystem and source files on 2026-05-27. No claims were accepted at face value.*