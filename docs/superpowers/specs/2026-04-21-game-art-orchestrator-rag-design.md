# Game Art Orchestrator RAG Integration Spec

## 1. Overview
The `game-art-orchestrator` skill automates the process of generating game assets matching a specific art style. Previously, the Orchestrator (executed by an LLM) was instructed to manually interpret global index JSONs and estimate "60% semantic similarity" to select few-shot reference images. This process was nondeterministic and flawed for an AI agent acting without native vector-computation capabilities.

This design introduces a **Unified Context Retrieval** architecture. It implements a dedicated Python script that uses `sentence-transformers` to compute vector distances deterministically, offloading the mathematical RAG and Semantic Search logic from the LLM prompt to a backend script.

## 2. Architecture & Pipeline Update

The `game-art-orchestrator` Phase 1 will be restructured to follow a deterministic sequence:

1. **Parameter Parsing**: The agent extracts the user's intent (e.g., prompt, object to draw).
2. **Retrieve Context (Script Execution)**: The agent executes `scripts/retrieve_orchestrator_context.py` via terminal, passing the target style directory and user prompt as arguments.
3. **Synthesis**: The agent reads the deterministic STDOUT from the script, which outputs the exact Global Rules and Absolute Image Paths to use.
4. **Generation**: The agent combines the local `Generation_DNA.md` with the retrieved context and executes the `generate_image` tool directly.

This eliminates ambiguous instructions from the Orchestrator's prompt (like "find images that are 60% similar").

## 3. Retrieve Orchestrator Context Script (`retrieve_orchestrator_context.py`)

### 3.1 Functionality
The script acts as a bridging RAG engine for the agent. It performs semantic search across two independent embedding databases:
- **Text Vectors (`global_index.json`)**: Encoded Global Aesthetic Rules.
- **Image/Caption Vectors (`style_index.json`)**: Encoded Semantic Captions for local style images.

### 3.2 Inputs
- `style_directory`: The absolute or relative path to the requested style folder (contains `style_index.json`).
- `prompt`: The user's requested object prompt (e.g., "futuristic alien blaster").

### 3.3 Search Logic
- **Embedding Generation**: The script loads the `all-MiniLM-L6-v2` local model and encodes the `prompt` into a 384-dimensional vector.
- **Global Rules Retrieval**: 
  - Calculates Cosine Similarity against all entries in `Assets/GameArtist/global_index.json`.
  - Sorts and returns the **Top 2** or **Top 3** most relevant rules.
- **Few-Shot Image Retrieval**:
  - Calculates Cosine Similarity against all entries in the target style's `style_index.json`.
  - Applies a similarity threshold of **`0.60`**. 
  - If matches are found $\ge 0.60$, returns the absolute paths of the Top 3 highest-rated images.
  - If no matches $\ge 0.60$ are found, it triggers a **Fallback Routine** and returns the absolute paths of ALL images flagged as `is_archetype: true`.

### 3.4 Outbound Payload Format
To ensure the LLM agent can parse the results effortlessly, STDOUT will be printed as structured Markdown:

```markdown
=== ORCHESTRATOR CONTEXT PAYLOAD ===
[GLOBAL RULES RAG]
- Rule 1 text
- Rule 2 text

[FEW-SHOT REFERENCES]
C:\...\image1.png
C:\...\image2.png
====================================
```

## 4. SKILL.md Updates

The `SKILL.md` of `game-art-orchestrator` must be updated to strictly mandate the usage of the new script.

- Remove subjective search logic.
- Replace step 2 and 3 of **Phase 1** with instructions to run `python scripts/retrieve_orchestrator_context.py <relative_path_to_style> "<user_prompt>"`.
- Add a strict **Agent Safety Rule**: The agent must NEVER manually search for references or read index JSON files natively.

## 5. Success Criteria & Dependencies
- `sentence-transformers` is installed.
- `global_index.json` and `style_index.json` exist via the compilations of `game-art-configurator` and `game-art-compiler`.
- The Orchestrator's prompt size decreases while its precision identifying correct image archetypes increases.
