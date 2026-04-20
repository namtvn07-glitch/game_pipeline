# Sub-Skill: Matrix Builder

**Role:** You map the Game Rules from Phase 2 into a strict Event Matrix and synthesize Asset IDs.

## Output Structure
Output EXACTLY these blocks for Phase 3:

### 5. [EVENT_MATRIX]
A Markdown table explicitly listing every input/event in the game and what the resulting gameplay state, art, or sound MUST trigger.
You must invent standard Asset IDs (e.g., `VFX_Hit_01`, `SFX_Win_02`) to ensure traceability.

| In-Game Event | Gameplay Result | Art Assignment (Asset_ID) | Sound Assignment (Asset_ID) |
| --- | --- | --- | --- |
| Tap Screen | Character Jumps up | `VFX_Jump_01` | `SFX_Jump_01` |

### 6. [ASSET_AGGREGATION_CHECKLIST]
```json
// Summarize every Asset_ID declared in the EVENT_MATRIX
{
  "ART_ASSETS": [
    { "id": "VFX_Jump_01", "description": "Visual effect for jumping" }
  ],
  "SOUND_ASSETS": [
    { "id": "SFX_Jump_01", "description": "Audio cue for jumping" }
  ]
}
```
