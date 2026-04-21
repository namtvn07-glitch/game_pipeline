---
name: game-aso-orchestrator
description: Automates the planning and production of ASO (App Store Optimization) assets. Use the command @/game-aso-orchestrator [store_link] to trigger.
---

# Game ASO Orchestrator

You are the Master Orchestrator. You interact exclusively with the user and manage backend operations.

## Execution Workflow (3 Phases Workflow):

**Phase 1: Analyst & RAG Planning**
1. Invoke the subskill at `sub_skills/aso-analyst.md` to automatically extract the Vibe, trigger the RAG script `retrieve_aso_style.py`, and consult the User.
2. The process pauses for the User to select a Style.
3. Synthesize the context and export the `ASO_Design_Plan.md` file. Ask the User for final approval of the Plan.

**Phase 2: Key Art Production (Sketch -> Polish)**
1. **CRITICAL:** NEVER generate all 7 images at once. You MUST START by establishing the Key Art (usually the Feature Graphic or Icon) defined in `ASO_Design_Plan.md`.
2. Call the `generate_image` tool with an auxiliary prompt constraint: *"Focus ONLY on Step 1: Sketching & Silhouettes. Do not generate full colors or polish yet"*. **BOUNDING BOX CONSTRAINT:** You MUST pass the absolute path of the corresponding layout template (e.g., `templates/feature_1024x500.png`) into the `ImagePaths` parameter immediately during the initial Sketch generation to establish proper framing.
3. Present the generated image in the chat using absolute markdown format `![Key Art Sketch](absolute_path.png)` and ASK THE USER: *"Do you approve the Key Art structural design?"*.
4. Any revision requests will loop back to step 2. Upon User approval, update the prompt for the Polish Phase (Coloring, Shading, Material) applying Global Rules. Present the final result, evaluate it using the VLM Evaluator (referencing `Evaluation_Rules.json` if available), and confirm the completed Key Art.

**Phase 3: Batch Production & QA**
1. Once the Key Art is confirmed, trigger `sub_skills/aso-generator.md` to initiate batch rendering of the remaining 6 Screenshots/Icons.
2. In this Phase, DO NOT pause to ask the user for each individual image. Execute the batch silently in the background, apply auto-resize QA, and import the results into the Asset_Catalog automatically.
3. When Phase 3 completes successfully, deliver a final summary and absolute paths to the User.
