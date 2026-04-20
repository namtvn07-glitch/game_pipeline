---
name: game-art-orchestrator
description: Automates the process of generating game assets matching a specific art style using RAG, Few-Shot visual prompting (via generate_image), and a Human-In-The-Loop VLM evaluation pipeline.
---

# Game Artist Auto Orchestrator
This skill provides a 2-phase pipeline for strictly adhering to a stylistic `Generation_DNA` and `Global_Design_System` when generating new game assets.

## Workflow Execution Steps

### Phase 1: Retrieve & Prompt Engineering (RAG & Few-Shot)
Whenever the user asks you to "draw", "generate", or "create" an asset, BEFORE generating the image, you MUST:
1. Identify the requested style from the prompt. If not explicitly specified, look at the workspace `Assets/GameArtist/StyleLibrary/` and pick the closest matching subfolder based on semantic meaning.
2. Read the `Global_Design_System.json`, `Generation_DNA.md` and `style_index.json` inside that style/root folder.
3. Select up to 3 contextually relevant image files from that same folder to use as `Semantic Few-Shot` references. **THRESHOLD RULE**: If no image achieves >60% semantic similarity to the requested object, fallback to using designated `Archetype` images for that style.
4. Assemble your payload per the instructions in `prompts/orchestrator-rag.md`. 
5. Execute the `generate_image` tool (Gemini Nanobanana integration), passing the DNA rules into `Prompt`, and the paths of the Few-shot images into `ImagePaths`. **IMPORTANT: Generate 2 different variations independently.**

### Phase 2: Generation & Interactive Self-Correction Loop
Once two variant images are generated and saved as artifacts:
1. (Optional) Run `python scripts/downscale_image.py <image_paths>` if the images are large and you anticipate Token Overflow when reading them.
2. Adopt the persona in `prompts/evaluator-vlm.md`. Look at both generated variants and evaluate them against the user's initial prompt, the `Global_Design_System`, and the `Evaluation_Rules.json`. Provide a **Binary Validation Checklist** followed by an Aesthetic Score (0-100) and `Correction_Guidance` for each.
3. **HUMAN-IN-THE-LOOP CHECKPOINT**: Stop your execution. Present the two variants and your Evaluator scoring to the user. Ask them:
   - "Do you approve one of these variants?" (If yes, stop and finalize).
   - "Should we proceed to Round 2 using the correction guidance?" 
   - "Would you like to manually override/add any text to the correction guidance before Round 2 runs?"
4. If the user requests Round 2, use the Orchestrator to perform a **Prompt Translation** on the updated `Correction_Guidance`. Convert the qualitative feedback into explicit technical parameters (update positive text, inject negative keywords, adjust weights) and run Phase 1 -> Phase 2 again.
