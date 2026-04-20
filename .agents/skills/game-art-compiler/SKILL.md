---
name: game-art-compiler
description: Use this skill specifically when the user requests to "compile", "analyze", or "update" an art style based on a directory of asset images. The skill acts as a Data Ingestion pipeline that vectorizes style images using `sentence-transformers` and outputs specialized rules (`Generation_DNA.md` and `Evaluation_Rules.json`) explicitly designed to connect with the `game-art-orchestrator`.
---

# Compile Artist Style V2

## Overview
This skill acts as a robust Data Ingestion Pipeline for your game artist workflows. It transforms a loose directory of reference images into a mathematically structured Vector schema (`style_index.json`) and specific rulesets meant to decouple Generation mechanisms from strict Evaluation heuristics.

## Execution Steps

### 1. Locate Style Directory & Legacy Cleanup
- Identify the exact style name requested.
- Target directory: `<workspace>/Assets/GameArtist/StyleLibrary/<style_name>/`
- Verify the directory exists via `list_dir`.
- **LEGACY CLEANUP**: If a file named `DNA_Profile.md` exists in this folder, you MUST delete it. It is a deprecated V1 format. Do NOT leave it behind, as it will pollute the system.

### 2. VLM Semantic Tagging
- Process all valid image files (`.png`, `.jpg`, `.jpeg`) inside the folder.
- Execute a VLM check (e.g. via Gemini/Flash) for EACH image.
- Ask the VLM to produce a dense 1-2 sentence caption that strictly describes:
  1. The exact physical object (e.g. "Space helmet with visor")
  2. The unique aesthetic identifiers (e.g. "high contrast neon green lighting, thick outline art style")
- Keep a JSON array in memory or disk containing: `[{"filename":"...", "caption":"..."}]`

### 3. Generate Local Embeddings & Archetype Schema
- Save the JSON array from Step 2 into a temporary file or pass it to our embedding script.
- Execute the script: `python scripts/create_embeddings.py <style_directory>` (assuming you have passed the captions JSON path or adapted the script to handle inputs).
- **The Script will automatically**: Use `sentence-transformers` locally to calculate text embeddings, find the mathematical centroid, assign `is_archetype: true` to the 2 images closest to the centroid, and output the absolute `style_index.json` to the target folder.

### 4. Synthesize DNA and Rule Files
- Collect the macro conclusions from analyzing the full image batch and separate them into two strict files:
  
  **A. `Generation_DNA.md`**
  Write this file using `write_to_file` into the style directory. It should ONLY contain positive explicit instructions and negative safeguards specifically designed to be injected into an Image Gen payload. Exclude all evaluation-only metrics.
  
  **B. `Evaluation_Rules.json`**
  Write this file using `write_to_file` into the style directory. It must be a strict JSON schema that the Evaluator VLM can read:
  ```json
  {
    "physical_checklist_template": ["Is the object accurately represented?", "Does it match the core geometry?"],
    "aesthetic_must_haves": ["Feature X", "Color Y"],
    "aesthetic_forbidden": ["Forbidden Feature Z"]
  }
  ```

### 5. Acknowledge Target
- Present the updated section explicitly to the user to confirm that the changes were securely registered.
- Remind the user that these global rules will now forcefully apply to the next `game-art-orchestrator-v2` execution.
