# Design Specification: Compile Artist Style V2 (Data Pipeline Upgrade)

## 1. Overview
This design upgrades the `compile-artist-style` skill to act as a robust Data Ingestion Pipeline. Instead of producing a single, unstructured `DNA_Profile.md` file, it will vectorize and catalog style assets, and output divided rule formats, ensuring perfect compatibility with the `game-artist-auto-orchestrator`'s Semantic Few-Shot thresholds and Binary Checklist evaluation.

## 2. Architecture & Data Structures

### Output Files Generated per Style Folder:
1. **`Generation_DNA.md`**: Contains isolated prompt modifiers (positive/negative text blocks, stylistic tags, lighting parameters) explicitly formatted for an image generation API payload.
2. **`Evaluation_Rules.json`**: A machine-readable schema listing strict physical/aesthetic boundaries (e.g., `MUST_HAVE: ["high contrast"]`, `FORBIDDEN: ["black outlines"]`) to be used by the VLM Evaluator.
3. **`style_index.json`**: A local vector database mapping each asset in the folder.
   - Format: `{ "filename.png": { "caption": "...", "vector": [...], "is_archetype": bool } }`

## 3. Workflow Integrations & Execution Steps

### Step 1: VLM Tagging
- Process all `.png/.jpg` files in the `<style_name>` folder.
- Use a VLM to generate a dense semantic caption for each image, detailing both the physical object and the aesthetic properties.

### Step 2: Indexing & Archetype Selection
- Run an embedding script (`create_embeddings.py`) to convert text captions to numerical vectors.
- Save to `style_index.json`.
- The script calculates the mathematical "center" of the cluster and flags the 2 closest images as `is_archetype: true`.

### Step 3: DNA Synthesis
- Synthesize all captions into a cohesive style rule set.
- Output `Generation_DNA.md` and `Evaluation_Rules.json`.

### Step 4: Orchestrator Hook Update
- Modify `orchestrator-rag.md` to map to `Generation_DNA.md` + `style_index.json`.
- Modify `evaluator-vlm.md` to map to `Evaluation_Rules.json`.

## 4. Design Decisions & Trade-offs
- **Static Embeddings JSON over Dynamic RAG**: Calculating embeddings once during compilation saves compute and latency during the actual image generation loop.
- **Split DNA vs Single File**: Isolating Generation logic from Evaluation rules prevents the prompt-building LLM from ingesting confusing "negative evaluation" rules and passing them improperly to the image generator.
