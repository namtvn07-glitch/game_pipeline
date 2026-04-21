# Design Specification: Game Art Configurator RAG Integration

## 1. Overview
The goal of this redesign is to evolve `game-art-configurator` from a passive JSON editor into an **Active Knowledge Management Agent**. It will leverage Semantic Search, Data Embeddings (Vectorization), and RAG (Retrieval-Augmented Generation) to manage the global aesthetic rules of the game art pipeline. 

By migrating from a monolithic JSON file to a Markdown-First architecture backed by a Vector Index, we ensure that:
1. Global rules are queryable using RAG for precise LLM context.
2. The Configurator can act defensively, detecting conflicts between newly proposed global rules and existing local style rules.
3. The ecosystem (`game-art-orchestrator`) avoids token overflow by fetching only the contextually relevant subset of global rules when generating assets.

## 2. Data Architecture Redesign (Markdown-First Truth)

### `Global_Design_System.json` -> `Global_DNA.md` & `global_index.json`
- **Deprecation**: `Assets/GameArtist/Global_Design_System.json` will be deprecated and deleted.
- **New Source of Truth**: `Assets/GameArtist/Global_DNA.md`. This file holds global design rules structured under explicit Markdown headings (e.g., `# I. GLOBAL LIGHTING`, `# II. DIMENSIONAL RULES`).
- **Vector Index**: `Assets/GameArtist/global_index.json`. This file stores the text chunks and their corresponding embeddings for all rules present in `Global_DNA.md`.

## 3. Skill Workflow Redesign

### `game-art-configurator` Workflow
The core loop of the configurator will now be:

1. **Parse Request**: Receive user prompt to add, modify, or remove a global rule.
2. **Markdown Manipulation**: Process the request and inject the rule under the appropriate heading in `Global_DNA.md`.
3. **Data Embedding (Vectorization)**: Trigger `scripts/create_global_embeddings.py` to chunk the `Global_DNA.md` and calculate embeddings using `sentence-transformers`, overwriting `global_index.json`.
4. **Conflict Resolution (Semantic RAG Search)**: 
   - Immediately after embedding, run a Cosine Similarity calculation between the new global rule vector and all existing `style_index.json` vectors within `Assets/GameArtist/StyleLibrary/*`.
   - If a high cosine similarity is found with contradictory intentions (e.g., Global says "No neon", but Local says "Use neon"), throw a text warning to the terminal for the user to resolve.

### Ecosystem Impact: `game-art-orchestrator` Workflow
The Orchestrator's dependency on the Global Design System must be updated to utilize RAG:

1. **Contextual Retrieval (RAG)**: Instead of reading the entire `Global_Design_System.json`, the orchestrator takes the target object's prompt (e.g., "UI Icon") and calculates a query vector.
2. **Semantic Search**: It queries `global_index.json` to retrieve the Top-N relevant global rules.
3. **Assembly**: The retrieved global rules are injected into the Prompt alongside the targeted Local Style's `Generation_DNA.md`, keeping the total payload token-efficient and highly contextual.

## 4. Error Handling and Edge Cases
- **Missing Scripts**: If the `sentence-transformers` environment is unavailable, fallback to updating `Global_DNA.md` while warning the user that vector sync is paused.
- **Empty Style Library**: If no styles exist, bypass Conflict Resolution and just build the global index.
- **Heading Conflicts**: If a user specifies a rule that doesn't fit existing headings, the Configurator must be smart enough to generate a new top-level heading in the Markdown file before embedding.

## 5. Testing and Validation
- **Unit Test**: Invoke Configurator with a blatantly conflicting rule ("All assets must be green") while a "red-only" style exists. Verify if the Warning triggers.
- **Integration Test**: Invoke Orchestrator to generate an asset and verify via debug logs that it only pulled <= 3 relevant Global Rules instead of the entire system document.
