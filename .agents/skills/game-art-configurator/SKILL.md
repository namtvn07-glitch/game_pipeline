---
name: game-art-configurator
description: A management skill to modify, query, or add rules to the Global_Design_System.json without requiring the artist to edit raw JSON code.
---

# Update Design System

## Overview
This skill acts as the Editor entity for the Master Configuration file governing global aesthetic physics (`Assets/GameArtist/Global_Design_System.json`). It ensures the JSON remains structurally sound and semantically clear.

## Execution Steps

### 1. Locate and Read
- Navigate to `<workspace>/Assets/GameArtist/Global_Design_System.json`.
- If the file is missing, halt and inform the user.
- Read the active JSON schema.

### 2. Parse User Request
- Identify the explicit modification requested (e.g. "Add a new rarity color for Mythic", "Change global lighting to front-facing").
- Analyze which JSON key this belongs to. If the key doesn't exist (e.g. "texture_resolution"), prepare to append a new top-level field.

### 3. Update & Write
- Carefully reconstruct the JSON object merging the old properties with the new override values.
- Ensure the output strictly respects JSON syntax.
- Write the updated file back to `Assets/GameArtist/Global_Design_System.json` using `write_to_file`.

### 4. Acknowledge Target
- Present the updated section explicitly to the user to confirm that the changes were securely registered.
- Remind the user that these global rules will now forcefully apply to the next `game-artist-auto-orchestrator` execution.
