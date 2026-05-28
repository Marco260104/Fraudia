# Design Document Review: Fraudia Visual Asset Pack (Re-Review After Revision)

**Reviewed by**: Senior Staff Engineer (Grok-assisted code exploration)  
**Review Date**: 2026-05-27 (Re-review)  
**Design Document**: `.design/11d136cb/design-doc.md` (52,596 bytes; updated post-revision)  
**Previous Review File**: `.design/11d136cb/review.md` (contained original 10 issues + writer's detailed Revision Summary table)  
**Summary**: `.design/11d136cb/summary.md`  
**Codebase Re-Explored (minimal, as-needed)**: requirements.txt (no Streamlit), src/app/main.py (confirmed 0 bytes), src/rules/fraud_rules.py:59 (citation accuracy), overall structure for contradictions.

---

### Summary

**Verdict: APPROVED — 0 OPEN ISSUES. Ready for Step 6 / final report and immediate implementation.**

All 10 issues from the initial review (5 major blocking + 5 minor/nit) have been **fully and cleanly addressed** in the revised design-doc.md with no new problems introduced, no contradictions with the existing pure-Python codebase, and no remaining gaps that would block a small team on `feature/FA-2-Arquitectura`.

The 5 major fixes directly resolve the previously identified blocking concerns:
- Clear **Streamlit-primary** recommendation (with concrete pseudocode, diagram updates, Key Decision 9, and narrowed PRs) eliminates frontend ambiguity.
- New dedicated "**## Risks & Mitigations**" section (8-row actionable table with Severity/Likelihood/Impact/Mitigation+Owner/Status) satisfies the checklist requirement.
- Realistic "**visually seamless**" language + SSIM ≥0.97-0.98 gates + post-processing + dedicated Risk row + human review make the seamless requirement executable.
- New "**### Asset Storage & Delivery**" subsection + **Performance Budgets table** (hard ≤1.6 MiB MP4s, CDN primary, Python Pillow + ffmpeg-python primary optimization path, resolved OQs #2/#6 with numbers + CI matrix) provides small-team executable guidance.
- **PR 7 narrowed** to a minimal one-widget (Score Gauge only) Streamlit prototype — now small, independently reviewable, and properly scoped.

All minors (citations fixed to `fraud_rules.py:59`, scripts/ creation note, branch standardization to "feature/FA-2-Arquitectura", Lottie Alternative 4 added with strong risk-mitigation rationale, expanded a11y/motion contract with concrete Streamlit pseudocode and bold "OFF BY DEFAULT" rule, dual-path tooling) were handled without introducing inconsistencies or bloat.

The revised document (now 52k+ bytes) preserves all original strengths (hyper-detailed prompts still 100% enforcing #FFFFFF + exact hex palette + no text/people/neon; accurate Strategy/threshold citations; self-contained generation + PR plan) while adding the missing production rigor. An engineer can immediately execute the 12 prompts and begin PR 1.

**No issues listed below** (all prior issues resolved per the writer's Revision Summary table, independently verified via targeted reads of the updated design-doc.md sections and minimal codebase checks).

---

### Verification of Major Fixes (Special Attention Areas)

**1. Frontend stack (former Issue 1)**: Fully resolved. Primary path locked to Streamlit for analyst MVP in Overview, Open Questions (now resolved #1), architecture diagram ("PRIMARY: Streamlit + custom components"; marketing deferred), Component Interface Sketch (full working `fraudia_asset()` Streamlit pseudocode with reduced_motion logic, st.video/st.image fallbacks, explicit "Motion OFF BY DEFAULT"), Key Decision 9 (new, with rationale citing confirmed pure-Python state: requirements.txt, 0-byte main.py, no Node artifacts), PR 6 (rewritten "Streamlit-first..."), and PR 7. Next.js explicitly deferred. Matches codebase reality (requirements.txt unchanged, no streamlit present; main.py still 0-byte stub — Streamlit is correctly additive via `pip install`).

**2. Risks section (former Issue 2)**: Fully resolved. New top-level "## Risks & Mitigations" (immediately after Alternatives, before Security) contains comprehensive 8-row table with exact columns requested (Risk | Severity | Likelihood | Impact | Mitigation + Owner | Status). Rows directly address prior concerns (generative seamless failure, MP4 bloat, analyst motion sensitivity, prompt leakage, skill gap for web layer, etc.). Most marked "Open (to be tracked in PRs)" or "Mitigated by design" — appropriate and actionable. Cross-references PRs, Alt 4, and other sections.

**3. Seamless loops (former Issue 3)**: Fully resolved realistically. All 5 MP4 prompts (and Key Decision 6) updated from "pixel-perfect" to "Visually seamless loop (to the naked eye at 1280x720 / 24 fps playback): ... Minor per-pixel generative variance is acceptable if it passes SSIM ≥ 0.97-0.98 validation and human review." PR 2 validation script explicitly includes "SSIM seamlessness gate ≥0.97-0.98 at 720p". PR 4 requires post-processing + gates + human review before commit. Dedicated High-severity row in Risks table with fallback to Alt 4. Integrated and practical.

**4. Asset storage/guidance (former Issue 4)**: Fully resolved with executable details. New "### Asset Storage & Delivery" subsection (under Proposed Design) specifies: CDN primary (Vercel/Cloudinary/S3), Git LFS fallback only; hard budgets ("Each MP4 loop: ≤ 1.6 MiB after optimization"); H.264 CRF 28 + optional WebM; Python-first optimization ("Pillow + imagequant/pngquant subprocess + ffmpeg-python two-pass"; sharp only as secondary for future Next.js). Full **Performance Budgets Table** (post-manifest JSON) with dimensions/fps (1280×720 @ 24 fps), sizes, CI validation (SSIM, ffprobe, Windows+Linux matrix). Open Questions #2 and #6 resolved with numbers. PRs 1/2/4/8 updated. Eliminates git bloat risk for the hackathon-style repo.

**5. PR 7 scope (former Issue 5)**: Fully resolved. Now titled and scoped as "Minimal Streamlit dashboard prototype — one widget only (Score Gauge)". Explicitly: "using RiskScorer on synthetic data + exactly one MP4 (`fraudia-score-gauge-loop.mp4`) + one PNG icon ... No network widget or multiple loops yet." Affected files and dependencies narrowed accordingly. "Small, independently reviewable" language retained. Perfectly aligned with Streamlit primary and incremental delivery.

**Minors (former Issues 6-10)**: All cleanly addressed with no contradictions or new gaps:
- Citation fixed to `src/rules/fraud_rules.py:59` (verified via re-read of source).
- PR 2 now includes "New `scripts/` directory (does not exist today)" note.
- All branch references standardized to "feature/FA-2-Arquitectura".
- Complete Alternative 4 (Lottie JSON + Canvas/SVG or Streamlit custom components) added with detailed pros/cons/trade-off strongly recommending parallel prototyping for the pure-Python team (directly mitigates bloat + seamless risks).
- a11y/motion substantially expanded in Key Decision 7 (5 concrete rules including bold "**OFF BY DEFAULT** on any internal/analyst/dashboard surface", poster fallback, keyboard/aria/WCAG 2.2) + full Streamlit pseudocode in Component sketch.
- Tooling dual-path clarified (Python primary everywhere; sharp secondary).
- Quantitative budgets + CI details added; all OQs resolved where actionable.

**No new issues identified**. Revisions are consistent, high-fidelity to prior feedback, and enhance (rather than bloat) the document. Prompts retain 100% of original strict constraints while adding necessary realism. Architecture diagram, PR plan, and integration points remain accurately tied to real codebase artifacts (RiskScorer, FraudRuleEngine at fraud_rules.py:59, etc.).

---

### Strengths (Unchanged from Prior Review; Enhanced by Revision)

- Outstanding codebase fidelity (all citations remain accurate or improved; new Streamlit guidance perfectly matches the confirmed pure-Python prototype state).
- Production-ready prompts (still the strongest element; now with realistic seamless language layered on top of the ironclad #FFFFFF / hex / no-text/people/neon rules).
- Actionable, small-team PR plan now even stronger with narrowed scopes and concrete guidance.
- Comprehensive production concerns now fully covered (Risks table, budgets, a11y pseudocode, storage strategy, Alt 4 evolution path).
- Self-contained and immediately executable.

---

**Recommendation**: The design is implementation-ready. Proceed directly to Step 6 / generation of the 12 assets using the prompts in the revised design-doc.md, followed by PR 1 on `feature/FA-2-Arquitectura`. The prior review's Revision Summary table (retained for history in the pre-rewrite review.md) documents the exact changes made.

**End of Re-Review**

*All findings verified via direct tool reads of the updated design-doc.md (targeted sections + prompts + PR plan + Risks table + Key Decisions + Component sketch) and minimal codebase inspection on 2026-05-27. No prior claims or new revisions accepted without verification.*