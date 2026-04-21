# Unity Prototype Orchestrator Skill Design Spec

## Background 
The `unity-prototype-orchestrator` is a master coordinator skill designed to seamlessly bridge game design specifications (GDD and Asset Manifests) directly into a playable Unity prototype. Based on the vision outlined in `unity-dev-mcp.md`, this skill eliminates the need for manual Unity interaction by translating game documentation into highly descriptive Markdown tasks, which are then autonomously executed via MCP commands.

## Architecture

This pipeline follows an "Ahead-of-Time Generation" model paired with a "Fire-and-forget" execution mechanism.

### Phase 1: Ingestion & Verification
**Goal:** Ingest all input requirements and validate asset readiness without blocking execution.

- Reads the Game Design Document (GDD) and Asset Lists (JSON format).
- Cross-references specified 2D Assets and SFX against the local project directories.
- **Mocking/Placeholder Strategy:** If any asset is missing, rather than failing, the system automatically assigns a Placeholder (e.g., standard Unity white square sprite or default beep audio), enabling uninterrupted prototype development. It logs a warning to alert the user.

### Phase 2: Ahead-of-Time Task Generation (Critical Priority)
**Goal:** Transpile the GDD logic into explicit, technically rigorous, step-by-step instructions before any Unity execution begins.

- AI acts as the Lead Programmer, dividing the complete project into atomic `.md` task files.
- Files are saved directly into `Assets/.agents/tasks/` to maintain history (e.g. `task-01-scene.md`, `task-02-player-setup.md`).
- **Granular Detail Requirement:** Each task file MUST contain highly descriptive information required by Unity MCP, leaving NO ambiguity:
    - Target GameObject name and precise Transform coordinates.
    - Required Component names (RigidBody2D, BoxCollider2D, etc.) and explicit tuning parameters (Mass, Friction, Gravity Scale).
    - Resource paths to bind to components (e.g., Sprite paths, AudioClip paths).
    - Layer and Tag assignments.

### Phase 3: Automated MCP Execution (Fire-and-Forget)
**Goal:** Act on the generated task files sequentially with maximum speed.

- The system iterates over the task files within `Assets/.agents/tasks/` in numerical order.
- It parses the `.md` instructions and formulates precise MCP Unity tool calls.
- Actions performed include scene creation, instantiation, component configuration, and script scaffolding.
- The system proceeds to the next file immediately upon the success of the prior MCP call, entirely bypassing any human-in-the-loop review phases.

### Phase 4: Completion & Reporting
**Goal:** Summarize the operation smoothly.

- Concludes execution natively and emits a final `Assets/.agents/prototype_summary.md`.
- Summarizes instantiated features and enumerates any "Placeholder" variables used, guiding developers on where manual touch-ups are required.
