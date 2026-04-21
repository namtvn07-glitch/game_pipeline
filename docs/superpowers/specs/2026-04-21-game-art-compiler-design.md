# Design Spec: Game-Art-Compiler V2 (Asset vs UI & RAG Optimized)

## Goal
Update the `game-art-compiler` skill to definitively support three comprehensive pillars for AI generation and evaluation: (I) Visual DNA, (II) Product Logic, and (III) Technical Excellence. Crucially, the outputs must be inherently structured to dynamically adapt to Asset or UI generation and be highly optimized for Semantic Search, Embedding operations, and RAG ingestion.

## Architecture & Integration Changes

### 1. Data Ingestion & VLM Semantic Tagging (RAG Optimization)
Step 2 of the skill (`VLM Semantic Tagging`) will be rewritten to force generating captions that are "Embedding-Ready". 
Instead of loose sentences, the VLM must output highly dense, searchable textual metadata:
- **Semantic Keywords:** Extract explicitly the `Shape Language`, `Material`, `Complexity Level`, and `Color Palette`.
- **RAG Hook:** Embed descriptive tags that easily match semantic queries (e.g., `"tag: UI_Icon, material: metallic, rarity: epic, visibility: high_contrast"`).

### 2. Generation_DNA.md (Chunkable Constraints for RAG)
The structural format will be rigorously updated to use Markdown hierarchies that RAG text-splitters (like RecursiveCharacterTextSplitter) love.
It will include explicitly defined rules under the three pillars:
- **`# I. VISUAL DNA (THẨM MỸ & NHẬN DIỆN)`**
  - Consistency (Stroke, shadow).
  - Shape Language.
  - Color Script (Rarity).
  - Material Polish (Specular/Roughness).
- **`# II. PRODUCT LOGIC (TƯ DUY SẢN PHẨM & GAMEPLAY)`**
  - Readability (3-Second Rule).
  - Progression Logic (Level upgrades).
  - The Juice (Animation states).
  - UI Interaction / Visibility.
- **`# III. TECHNICAL EXCELLENCE (TIÊU CHUẨN KỸ THUẬT)`**
  - Mesh / Topology / Texel Density.
  - Modular / Recolor support.

*Why RAG Optimized?* By keeping strict Markdown Headings, a vector database can retrieve the exact rule chunk (e.g., "Color Script") without pulling irrelevant noise.

### 3. Evaluation_Rules.json (Schema Update)
The evaluation strict JSON will move from a basic array of checks to a nested mapping:
```json
{
  "semantic_metadata": {
    "supported_types": ["asset", "ui"],
    "vector_keywords": ["line-art", "hybrid-casual", "optimized"]
  },
  "evaluation_criteria": {
    "visual_dna": [ ... ],
    "product_logic": [ ... ],
    "technical_excellence": [ ... ]
  },
  "forbidden_elements": [ ... ]
}
```
*Why RAG Optimized?* The orchestration layer can parse `semantic_metadata` specifically when filtering through vector databases before submitting an evaluation prompt.

## Deployment Strategy
Modify `e:\_Project_2026\GamePipeline\game_pipeline\.agents\skills\game-art-compiler\SKILL.md` directly. Update the bullet points under `Step 2` (VLM Tagging) and `Step 4` (DNA & Rule synthesis) to explicitly command the AI to conform to this new structure.
