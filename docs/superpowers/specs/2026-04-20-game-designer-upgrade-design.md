# Game Designer Skill Upgrade Design

## Overview
The `game-designer` skill currently generates a high-level MVP GDD but lacks deep technical structure, making it insufficient for automated sub-agents (like `game-art-orchestrator` or audio generators) and dev execution. This upgrade overhauls the 3 subskills (`1_concept.md`, `2_rules.md`, `3_matrix.md`) to output a "Single Source of Truth Blueprint" that enforces Cross-Department Synchronization.

## Components & Changes

### 1. `1_concept.md` (Concept & constraints)
**Goal:** Establish project vision, strict technical limits, and cross-department naming conventions.
**Output Additions:**
- `[TECHNICAL_CONSTRAINTS]`: Detailed metadata (Platform, Camera Orientation, Engine Target, File Size constraints).
- `[CROSS_DEPARTMENT_SYNC]`: Strict rules for naming conventions (e.g., `SPR_Character_State`) and workflow hooks.
- Extensively expanded `[CORE_GAMEPLAY]` to force mentioning pacing, visual atmosphere, and camera behavior.

### 2. `2_rules.md` (Game Logic Blueprint)
**Goal:** Transition from vague plaintext descriptions to definitive system logic for developers.
**Output Additions:**
- `[GAME_STATE_MACHINE]`: Explicit flow definition (e.g., Init -> Home -> Play -> Pause -> GameOver).
- `[SYSTEM_VARIABLES]`: Explicit list of exact variables Devs will need to implement (e.g., `player_gravity = X`, `spawn_rate_curve`, `jump_impulse`).

### 3. `3_matrix.md` (Matrix & Typed Outsource Checklists)
**Goal:** Define screen flows and deeply typed JSON schemas for specialized downstream skills.
**Output Additions:**
- `[EVENT_MATRIX]`: Improved to map directly against the logic defined in Phase 2.
- `[UI_ARCHITECTURE]`: Upgraded to include Screen Flow (Action -> Transition -> Target Screen).
- `[ASSET_AGGREGATION_CHECKLIST]`: Overhauled JSON models requiring strict department specs:
  - Art: must define `type`, `dimensions`, `animation_frames`.
  - Audio: must define `layer`, `loop_flag`.
  - VFX: must define `duration`, `particle_density`.

## Trade-offs
- The GDD output file will be significantly longer and more "code-like", which might be slightly heavier for humans to speed-read but infinitely better for LLM agents parsing it afterward.
