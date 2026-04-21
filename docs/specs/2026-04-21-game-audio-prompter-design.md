# Design Specification: Game Audio Prompter Skill

## 1. Overview
**Skill Name:** `game-audio-prompter`
**Purpose:** An AI-driven skill designed to construct a professional "Prompt Book" document. This prompt book translates game design mechanics and art styles into specialized audio engineering prompts (BGM and SFX) that can be seamlessly copy-pasted into external Audio generation LLMs (Udio, ElevenLabs, Suno, etc.).

## 2. Architecture
- **Location:** `e:\_Project_2026\GamePipeline\game_pipeline\.agents\skills\game-audio-prompter\`
- **Core File:** `SKILL.md` (Markdown-based system instructions).
- **Paradigm:** Pure LLM Workflow / Agent-Driven. No Python scripts are required. The skill relies entirely on the AI's natural language comprehension to bridge visual/mechanic tags into audio properties.

## 3. Data Flow & Execution Pipeline
When invoked via `@[game-audio-prompter]`, the agent MUST follow these strict sequential phases:

### Phase 1: Ingest (Context Gathering)
- The AI locates the target project directory.
- Read `<ProjectName>_GDD.md` to extract:
  - Core Mechanics (e.g., fast-paced, recoil-based)
  - Visual Art Style (e.g., line-art, 8-bit, minimalist, dark-fantasy)
  - Game Vibe & Target Audience (e.g., hybrid-casual, hyper-casual)
- Read `<ProjectName>_Audio_Assets.json` to extract the full list of required audio tasks, their IDs, layer priorities (BGM vs SFX), and loop flags.

### Phase 2: Translation (Multi-modal Mapping)
The AI applies hardcoded rules within the skill to map game design concepts to Audio Engineering terminology:
- **Visuals → Reverb/EQ:** e.g., "Line-art" or "Minimalist" -> "Crisp, zero reverb, bright high-end". "Pixel/Retro" -> "8-bit, synthwave, chiptune".
- **Mechanics → Envelope:** e.g., "Actions with extremely high trigger frequency (like shooting)" -> "Fast attack, instant decay, strictly non-fatiguing to the ear".
- **System Flags → Constraints:** e.g., `loop_flag: true` -> "MUST be a seamless loop, no fade-in/fade-out".

### Phase 3: Output Generation
Generate the `[ProjectName]_Audio_Prompt_Book.md` file and save it directly inside the target project directory.

## 4. Standardized Output Format
The resulting `Prompt_Book.md` MUST strictly follow this structure to ensure compatibility with audio generation LLMs:
1. **System Definition:** A global prompt chunk defining the AI role, overall game constraints (like Playable Ad "Budget Sentinel"), and general stylistic boundaries.
2. **BGM Specs:** Track length constraints, BPM, layered instrumentation, and emotional mood.
3. **SFX Breakdown:** Granular, ID-by-ID specs covering Gameplay Context, Trigger Frequency, and the precise Audio Envelope description.

## 5. Error Handling & Safety
- **Hard Stop Condition:** If the `GDD.md` or `Audio_Assets.json` are missing from the project directory, the skill MUST halt execution immediately. It must report the missing files to the user and categorically refuse to generate hallucinated audio prompts to maintain pipeline integrity.
