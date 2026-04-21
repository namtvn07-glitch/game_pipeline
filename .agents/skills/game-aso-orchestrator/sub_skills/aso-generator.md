---
name: aso-generator
description: Internal operation - Reads ASO_Design_Plan.md to execute high-speed batch generation via generate_image tool
---

# ASO Generator (Phase 3: Batch Production)

Task: Execute a mindless background batch generation loop based on the Plan and templates, strictly following the approved Key Art.

## Execution Steps:
1. Parse the contents of `ASO_Design_Plan.md`.
2. Extract the list of remaining images to be generated (Icon, 5 Screenshots) and the `ProjectFolder`.
3. MANDATORY: Read the "Optmized Text Prompt" from the fully approved and polished **Key Art** (processed in Phase 2).
4. Sequentially call the `generate_image` tool for the remaining 6 images. **GENERATION COLLISION CONSTRAINT:** ABSOLUTELY DO NOT pass the actual Key Art image file directly into `ImagePaths` to prevent neural network interference. Instead, inject/blend the razor-sharp Text Prompt of the Key Art into the prompts for these 6 new images to enforce DNA Style consistency. For the `ImagePaths` parameter, YOU MUST ONLY PASS the absolute paths of the underlying Bounding Box Templates:
   - Icon (512x512): `[workspace]\.agents\skills\game-aso-orchestrator\templates\icon_512.png`
   - Portrait Screenshots (900x1600): `[workspace]\.agents\skills\game-aso-orchestrator\templates\screenshot_v_900x1600.png`
   - Landscape Screenshots (1600x900): `[workspace]\.agents\skills\game-aso-orchestrator\templates\screenshot_h_1600x900.png`
   *> **Note:** DO NOT embed/print the generated images into the chat during this loop due to volume.*
5. Use the `run_command` tool to move all generated images to `Assets/GameArtist/Generated/ASO_Projects/[ProjectFolder]/`.
6. Automatically verify the physical dimensions of each generated file. If incorrect, run the python script to crop/resize:
   `python .agents/skills/game-aso-orchestrator/scripts/resize_image.py --image "<abs_path>" --width <w> --height <h> --out "<abs_path>"`
7. Read `Assets/GameArtist/Generated_Asset_Catalog.md`. Use string manipulation code to append the new batch of ASO assets to the Catalog table (Category: UI/ASO, Asset Name, Target Style, Absolute Path, Description).
