# Design Specification: Game Artist Auto Orchestrator Workflow

## 1. Overview
The `game-artist-auto-orchestrator` workflow automates the process of generating game assets matching a specific art style. It utilizes Retrieval-Augmented Generation (RAG) and Few-Shot prompting by leveraging the `StyleLibrary` and `DNA_Profile.md` (created by `compile-artist-style`). Additionally, it incorporates an interactive evaluation phase by a Vision Language Model (VLM), ensuring absolute stylistic adherence while keeping the human-artist in the ultimate decision loop.

## 2. Architecture & Triggers
- **Trigger**: User requests generation of a new asset or drawing based on a template.
- **Components**:
  - **Orchestrator LLM**: Decides RAG retrieval, constructs the prompts.
  - **Image Generation API**: Draws the actual asset.
  - **Evaluator VLM**: Reviews generated variations against the DNA_Profile and user prompt.
- **Storage**: Integrates with `<Workspace>/Assets/GameArtist/StyleLibrary/`.

## 3. Workflow Steps

### Phase 1: Retrieve & Prompt Engineering (RAG & Few-Shot)
1. **Hybrid RAG Selection**:
   - Explicit matching: Scans the user prompt for a specific `<style_name>`.
   - Semantic matching: If no explicit keyword exists, reads available `DNA_Profile.md` profiles to find the closest match.
2. **Context Assembly**:
   - Gathers the matched `DNA_Profile.md` to instruct the Image Gen API on constraints (line art, shapes, shading, colors).
3. **Dynamic Few-Shot Injection**:
   - Randomly selects 2-3 images from the matched `<style_name>` folder to inject into the Gen API payload as strict visual references.

### Phase 2: Generation & Interactive Self-Correction Loop
1. **Round 1 Generation (Parallel)**:
   - The Image Gen API creates 2 variations (Variant A and Variant B) concurrently.
2. **Evaluation & Scoring**:
   - The Evaluator VLM scores Variant A and B (0-100) based on strict adherence to the explicit prompt and the foundational `DNA_Profile.md`.
   - The Evaluator formulates a `Correction_Guidance` document detailing strengths and weaknesses for each.
3. **Human-In-The-Loop Checkpoint**:
   - The workflow pauses and presents the 2 variations and the VLM's analysis to the user.
   - The user is asked whether they approve one of these variants, or if the workflow should proceed to Round 2 using the correction guidance.
4. **Resolution or Round 2**:
   - If user chooses a variant: Output finalized, workflow terminates.
   - If user requests a retry: The `Correction_Guidance` is passed as negative/repair prompts into a final generation round producing new variations.

## 4. Design Decisions & Trade-offs
- **Batched Generation vs Sequential**: Generating 2 images in a batch utilizes more upfront compute but dramatically reduces wall-clock latency compared to waiting for a sequential loop.
- **Human-In-The-Loop vs Auto-Loop**: By mandating a user checkpoint after Round 1, the workflow avoids endless, expensive VLM retry loops and ensures the results align with human judgment.

## 5. Verification Plan
- **Verification Trigger**: Run a prompt `Draw a sci-fi healing potion` in a workspace containing a `SciFi_Props` DNA profile.
- **Expected RAG**: Workflow must audibly identify `SciFi_Props` and inject its DNA.
- **Expected Pause**: Workflow MUST pause and output 2 images with a scoring block before proceeding.
- **Expected Resumption**: Providing feedback should trigger the refinement round with modified prompts.
