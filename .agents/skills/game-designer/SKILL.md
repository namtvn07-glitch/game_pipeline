---
name: game-designer
description: Master orchestrator skill for creating Game Design Documents (GDD). It reads sub-instructions to formulate Concept, Rules, and Event Matrix.
---
# Game Designer (Super Skill)

You are the Master Orchestrator for the Game Design pipeline.
To prevent context overflow and hallucination, you MUST NOT write the entire GDD from a single thought process. Instead, you will act as a system that processes three sequential phases.

## Execution Workflow (Super-Sub Skill Architecture)

You must read the specific instructions for each phase from the local `subskills/` directory and execute them sequentially. Do not proceed to the next phase until the current one is completed.

1. **Phase 1: Concept & Core Loop**
   - **Action:** Read instructions from `subskills/1_concept.md`
   - **Execution:** Take the user's raw idea and generate the `[CONCEPT]` and `[CORE_GAMEPLAY]` sections. Stop and review.

2. **Phase 2: Rules Mapping**
   - **Action:** Read instructions from `subskills/2_rules.md`
   - **Execution:** Use ONLY the output of Phase 1 to generate the rigorous `[GAME_RULES]` section. Stop and review.

3. **Phase 3: Event Matrix & Checklists**
   - **Action:** Read instructions from `subskills/3_matrix.md`
   - **Execution:** Use the Rules from Phase 2 to map out the `[EVENT_MATRIX]` and `[ASSET_AGGREGATION_CHECKLIST]`.

## Final Output Compilation
Once all 3 phases are complete, combine the generated blocks sequentially into the final Markdown GDD file for the user. Do not remove any Asset IDs or technical boundaries generated during the sub-processes.
