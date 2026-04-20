# Game Designer Skill Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the `game-designer` subskills (`1_concept.md`, `2_rules.md`, `3_matrix.md`) to output a highly structured, Cross-Department System Blueprint (GDD) with deep technical constraints and rigid JSON schemas.

**Architecture:** We are updating the markdown instruction files located in `.agents/skills/game-designer/subskills/`. These files act as system prompts. The upgrade will replace the existing soft structures with rigorous technical blocks: `[TECHNICAL_CONSTRAINTS]`, `[CROSS_DEPARTMENT_SYNC]`, `[GAME_STATE_MACHINE]`, `[SYSTEM_VARIABLES]`, and an overhauled `[ASSET_AGGREGATION_CHECKLIST]`.

**Tech Stack:** Markdown (Prompt Engineering for AI Orchestrators), JSON.

---

### Task 1: Overhaul `1_concept.md` (Constraints & Handshake)

**Files:**
- Modify: `e:\_Project_2026\GamePipeline\game_pipeline\.agents\skills\game-designer\subskills\1_concept.md`

- [ ] **Step 1: Replace output structure in `1_concept.md`**
Rewrite the file to include `[TECHNICAL_CONSTRAINTS]` (Platform, Aspect Ratio, Target Engine, Size limits) and `[CROSS_DEPARTMENT_SYNC]` (Naming conventions, Sync protocols). Expand `[CORE_GAMEPLAY]` to force inclusion of Pacing, Vibe, and Camera rules.

- [ ] **Step 2: Commit**
```bash
git add .agents/skills/game-designer/subskills/1_concept.md
git commit -m "feat(game-designer): add technical constraints and cross-dept sync to concept phase"
```

### Task 2: Overhaul `2_rules.md` (Game Logic Blueprint)

**Files:**
- Modify: `e:\_Project_2026\GamePipeline\game_pipeline\.agents\skills\game-designer\subskills\2_rules.md`

- [ ] **Step 1: Replace output structure in `2_rules.md`**
Rewrite the file to replace generic rules with `[GAME_STATE_MACHINE]` (Init, MainMenu, Play, Pause, GameOver states) and `[SYSTEM_VARIABLES]` (Specific exact variables devs need like `player_gravity = X`). Keep Entity Behaviors but strictly tie them to these variables.

- [ ] **Step 2: Commit**
```bash
git add .agents/skills/game-designer/subskills/2_rules.md
git commit -m "feat(game-designer): upgrade rules to output system variables and state machine"
```

### Task 3: Overhaul `3_matrix.md` (Schema Enforcement & UI Flow)

**Files:**
- Modify: `e:\_Project_2026\GamePipeline\game_pipeline\.agents\skills\game-designer\subskills\3_matrix.md`

- [ ] **Step 1: Upgrade UI_ARCHITECTURE and EVENT_MATRIX**
Explicitly require UI Screen Flow mapping (from X to Y via Action Z). The Event Matrix must map directly using the Naming Conventions established in Phase 1.

- [ ] **Step 2: Rewrite `[ASSET_AGGREGATION_CHECKLIST]` JSON schemas**
Change the simple `{ "id": "...", "description": "..." }` to deep contracts.
- Art: `{ "id", "description", "dimensions", "format", "animation_frames" }`
- Audio: `{ "id", "description", "layer" (SFX/BGM), "loop_flag" }`
- VFX: `{ "id", "description", "duration", "particle_density" }`

- [ ] **Step 3: Commit**
```bash
git add .agents/skills/game-designer/subskills/3_matrix.md
git commit -m "feat(game-designer): enforce rigid JSON schemas for asset checklist and detail UI flow"
```
