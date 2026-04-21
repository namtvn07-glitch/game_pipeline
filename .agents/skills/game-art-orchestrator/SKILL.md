---
name: game-art-orchestrator
description: Automates the process of generating game assets matching a specific art style using RAG, Few-Shot visual prompting (via generate_image), and a Human-In-The-Loop VLM evaluation pipeline.
---

# Game Artist Auto Orchestrator
This skill provides a 2-phase pipeline for strictly adhering to a stylistic `Generation_DNA` and Global rules when generating new game assets.

## Workflow Execution Steps

### Phase 1: Retrieve & Prompt Engineering (RAG & Few-Shot)
Whenever the user asks you to "draw", "generate", or "create" an asset, BEFORE generating the image, you MUST:
1. Identify the requested style from the prompt. If not explicitly specified, look at the workspace `Assets/GameArtist/StyleLibrary/` and pick the closest matching subfolder based on semantic meaning.
2. Read the `Generation_DNA.md` inside that style folder.
3. Automatically retrieve RAG context by executing the retrieval script via terminal:
   `python .agents/skills/game-art-orchestrator/scripts/retrieve_orchestrator_context.py <relative_path_to_style> "<user_prompt>"`
   *(For example: `python .agents/skills/game-art-orchestrator/scripts/retrieve_orchestrator_context.py Assets/GameArtist/StyleLibrary/SciFi "laser blaster"`)*
4. Read the `=== ORCHESTRATOR CONTEXT PAYLOAD ===` printed to the console by the script. **CRITICAL:** Do NOT attempt to manually parse the index JSON files or manually select reference images. You MUST strictly use the text rules and absolute image paths provided by the script.
5. Assemble your final payload by combining the local `Generation_DNA.md` with the retrieved Global RAG rules and Image paths.
6. Execute the `generate_image` tool (Gemini Nanobanana integration), passing the combined DNA rules into `Prompt`, and the paths of the Few-shot images into `ImagePaths`. **IMPORTANT: Generate 2 different variations independently.**

### Phase 2: Generation & Interactive Self-Correction Loop
Once two variant images are generated and saved as artifacts:
1. (Optional) Run `python scripts/downscale_image.py <image_paths>` if the images are large and you anticipate Token Overflow when reading them.
2. Adopt the persona in `prompts/evaluator-vlm.md`. Look at both generated variants and evaluate them against the user's initial prompt, the retrieved Global Rules, and the `Evaluation_Rules.json`. Provide a **Binary Validation Checklist** followed by an Aesthetic Score (0-100) and `Correction_Guidance` for each.
3. **HUMAN-IN-THE-LOOP CHECKPOINT**: Stop your execution. Present the two variants and your Evaluator scoring to the user. Ask them:
   - "Do you approve one of these variants?" (If yes, trigger Phase 3: Asset Finalization & Export).
   - "Should we proceed to Round 2 using the correction guidance?" 
   - "Would you like to manually override/add any text to the correction guidance before Round 2 runs?"
4. If the user requests Round 2, use the Orchestrator to perform a **Prompt Translation** on the updated `Correction_Guidance`. Convert the qualitative feedback into explicit technical parameters (update positive text, inject negative keywords, adjust weights) and run Phase 1 -> Phase 2 again.

### Phase 3: Asset Finalization & Export
When the user explicitly approves a generated variant:
1. Identify the semantic category of the asset (e.g., `Characters`, `Environments`, `Items`, `UI`, `Obstacles`).
2. Construct the absolute export directory path using this professional structure:
   `<workspace>/Assets/GameArtist/Generated/<Style_Name>/<Category>/`
3. Execute a copy/move command to transfer the approved image artifact from the `.gemini/artifacts/` folder into the target directory.
4. Rename the file to a clean, standardized format: `[object_name]_[YYYY-MM-DD].png` (e.g., `laser_pistol_2026-04-20.png`).
5. Read `Assets/GameArtist/Generated_Asset_Catalog.md`. Use your code editing tool to append a new row to the table in this file, logging the Category, Asset Name, Target Style, Absolute File Path, and a short 1-sentence prompt description.
6. Confirm completion by providing the user with the final absolute path to their new production-ready asset.
