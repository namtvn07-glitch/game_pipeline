# Design Spec: Game Designer AI Skill (v3.0 - Gameplay & Rule Focused)

## Overview
An AI skill acting as a Lead Game Designer that converts ideas, trends, or reference materials into highly detailed, LLM-friendly Game Design Documents (GDD). Targeted primarily at rapid prototyping for hypercasual and puzzle mobile games. 
*Note: This specification deliberately omits technical DEV constraints (pseudo-code, engine specs) to focus purely on profound gameplay descriptions, mechanics, and asset synchronization.*

## Core Architecture & Mitigation Mechanisms

1. **Anti-Hallucination & Scope Control (Negative Constraint)**:
    - To prevent Scope Creep, the system enforces a `[DISCARDED_FEATURES]` block where the AI explicitly states features it excluded to maintain the MVP prototype scale.
2. **Unified Data Tracing (Asset ID Linking)**:
    - Eliminates data disconnects by enforcing a strict Unique ID naming convention (e.g., `VFX_Spark_01`, `SFX_Pop_001`) across rules and asset checklists.
3. **Deep Gameplay & Rule Definition**:
    - Instead of technical configuration variables, the AI constructs an exhaustive `[GAME_RULES]` block detailing explicit Win/Loss conditions, scoring math, and entity behaviors. The DEV interprets these rules independently.
4. **Generative-AI-Ready Art Specs**:
    - Art requirements are mapped generically and require inheriting DNA attributes from the project's `Global_Design_System` instead of relying on subjective human adjectives.

## Output Schema (LLM-Friendly Format)
The AI Skill will output the GDD strictly following this format:

1. **[CONCEPT]**
   - JSON block with `ProjectName`, `Genre`, `TargetAudience`, `USP`.
2. **[DISCARDED_FEATURES]**
   - Array of strings mapping out features that were actively removed/avoided to maintain prototype scope.
3. **[CORE_GAMEPLAY]**
   - Comprehensive textual breakdown of the Core Loop (`Init -> Action -> Feedback`).
4. **[GAME_RULES]**
   - Exhaustive definitions of Win/Loss conditions, Scoring principles, and Mechanics (e.g., "Matching 3 clears blocks, granting 10 points per block. Gravity pulls remaining blocks down").
5. **[EVENT_MATRIX]**
   - Core markdown table associating events with specific rules and Asset IDs.
   - Format: `| In-Game Event | Gameplay Result (What happens) | Art Assignment (Asset_ID) | Sound Assignment (Asset_ID) |`
6. **[ASSET_AGGREGATION_CHECKLIST]**
   - JSON array summarizing all `Asset_ID`s used in the Matrix, grouped by `ART` (Dimensions/Class) and `SOUND` (Duration/Type). DEV requirements are omitted.

## Implementation Rules
The `SKILL.md` file will act as the master prompt matrix incorporating the above schemas under heavy structural constraints, commanding the Agent to prioritize JSON structures and Unique Object References over descriptive storytelling.
