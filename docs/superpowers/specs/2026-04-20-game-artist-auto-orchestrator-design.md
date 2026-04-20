# Design Specification: Game Artist Auto Orchestrator Workflow

## 1. Overview
The `game-artist-auto-orchestrator` workflow automates the process of generating game assets matching a specific art style. It utilizes Retrieval-Augmented Generation (RAG) and Few-Shot prompting by leveraging the `StyleLibrary` and `DNA_Profile.md` (created by `compile-artist-style`). Additionally, it incorporates an interactive evaluation phase by a Vision Language Model (VLM), ensuring absolute stylistic adherence while keeping the human-artist in the ultimate decision loop.

## 2. Architecture & Triggers
- **Trigger**: User requests generation of a new asset or drawing based on a template.
- **Components**:
  - **Orchestrator LLM**: Decides RAG retrieval, constructs the prompts, and delegates.
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
3. **Semantic Few-Shot Injection**:
   - Instead of random selection, uses Semantic Search to select 2-3 images from the matched `<style_name>` folder that are most contextually relevant to the user's requested object.
   - **Confidence Threshold**: If no image matches with a similarity score > 60%, the system falls back to selecting designated **Style Archetype** images (pre-defined best representations of the style) rather than forcing an irrelevant match.
   - **Constraint**: These images are exclusively injected as a `Style Reference` (e.g. `--sref`) parameter to prevent the model from overfitting to structural shapes, thereby eliminating "Structure Confusion".

### Phase 2: Generation & Interactive Self-Correction Loop
1. **Round 1 Generation (Parallel)**:
   - The Image Gen API creates 2 variations (Variant A and Variant B) concurrently.
2. **Auto-Downscale & Evaluation Scoring**:
   - The variations are temporarily downscaled (e.g., to 512x512) before being sent to the VLM to prevent context window overflow (Token Overflow limit).
   - **Binary Validation Checklist**: The Evaluator first checks the image against a dynamic binary (Pass/Fail) checklist derived from the user's prompt (e.g., "Has 2 swords? [Pass]").
   - Only after passing physical requirements does it score Aesthetic Adherence (0-100) based on the `DNA_Profile.md`. It formulates a `Correction_Guidance` document detailing strengths and weaknesses.
3. **Human-In-The-Loop Checkpoint**:
   - The workflow pauses and presents the 2 High-Res variations and the VLM's analysis to the user.
   - The user is asked to choose between:
     - [Approve] a variant.
     - [Redo] using VLM's correction guidance.
     - **[Manual Override Redo]**: Allowing the user to append or manually rewrite the `Correction_Guidance` text before queuing Round 2.
4. **Prompt Translation & Round 2**:
   - If user chooses a variant: Output finalized, workflow terminates.
   - If user requests a retry: The active `Correction_Guidance` (VLM or Manual) is sent back to the Orchestrator.
   - **Prompt Translation**: The Orchestrator analyzes the guidance and translates it into technical API adjustments (e.g., modifying the base positive prompt, appending strong negative keywords, or adjusting stylistic weights if supported). This translated payload triggers the refinement generation round.

## 4. Design Decisions & Trade-offs
- **Batched Generation vs Sequential**: Generating 2 images in a batch utilizes more upfront compute but dramatically reduces wall-clock latency compared to waiting for a sequential loop.
- **Human-In-The-Loop vs Auto-Loop**: Mandating a user checkpoint guarantees alignment, avoids infinite loop costs, and allows human overrides when the VLM hallucination occurs.
- **Semantic Over Random Few-shot**: Reduces chaotic structural outputs at the cost of requiring an initial embedding/search step against the local `StyleLibrary`.

## 5. Verification Plan
- **Verification Trigger**: Run a prompt `Draw a sci-fi healing potion` in a workspace containing a `SciFi_Props` DNA profile.
- **Expected RAG**: Workflow must audibly identify `SciFi_Props`, inject its DNA, and semantically grab potion-related Few-shots.
- **Expected Eval**: The VLM should output a checklist (e.g. `[x] Is a potion, [x] Sci-fi element`) before its numeric score.
- **Expected Pause**: Workflow MUST pause and capture human feedback (Approve vs Redo vs Override).
