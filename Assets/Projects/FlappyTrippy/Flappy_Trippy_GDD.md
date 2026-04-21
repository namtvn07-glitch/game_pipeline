# TRG32: Flappy Trippy - Game Design Document

### 1. [CONCEPT]
```json
{
  "ProjectName": "Flappy_Trippy",
  "Genre": "2D Action / Arcade Runner / Shoot 'em up",
  "TargetAudience": "Mass market (Hybrid-Casual)",
  "USP": "A hybrid-casual endless runner where the player actively shoots to clear obstacles, and the weapon's recoil acts as the core jump/flight mechanic."
}
```

### 2. [DISCARDED_FEATURES]
- **Complex UI Trees:** Cut deep nested menus. Everything connects back to a single `UI_Panel_Home` to adhere to zero-friction onboarding.
- **Complex RPG Pet Systems/Gacha:** Removed to avoid runtime hitbox clutter and progression bloat.
- **Save/Load State Interpolation:** Run-based loop only stores meta-progression currency (`coin_balance`), resetting level architecture on every boot.

### 3. [TECHNICAL_CONSTRAINTS]
- **Platform/Engine:** Unity Mobile (C#)
- **Orientation:** Portrait (9:16)
- **File Size/Memory Limits:** Under 50MB. Framerate: 60fps on standard low-end devices, mandating rigid Object Pooling implementation for all `VFX`, `Projectiles`, and `Blocks`.

### 4. [CROSS_DEPARTMENT_SYNC]
- **Naming Conventions:** 
  - Art: `SPR_[Entity]_[State]` (e.g., `SPR_Trippybara_Idle`)
  - Audio: `SFX_[Action]_[Variation]` (e.g., `SFX_Shoot_01`)
  - VFX: `VFX_[Action]_[Variation]` (e.g., `VFX_FeverAura`)
  - UI: `UI_[Element]_[Name]` (e.g., `UI_Btn_Play`)
- **Communication Handshake:** Dev must bind events using pure string identifiers mapping identically to the `id` field in Asset JSONs. System events broadcast strings to a decoupled `AudioManager` or `VFXManager`.

### 5. [CORE_GAMEPLAY]
The game engine continuously scrolls the environment horizontally across a portrait camera while applying vertical gravity to the player entity ("Trippybara").
Input is strictly atomic: tapping the screen triggers a horizontal projectile launch. The physical recoil (Newton's Third Law abstraction) of this launch imparts an upward vertical impulse to the player.
As the player moves, vertical arrangements of destructible blocks spawn organically. The player is forced to shoot blocking units to formulate safe geographical passages. 
**Pacing modifiers:** To prevent extreme fire-rate abuse, a Diminishing Recoil system reduces vertical lift during rapid-fire, shifting the player into a smooth hovering state. Destruction actions fill a Combo meter. Once maximized, Fever Mode triggers—fixing the player precisely to the viewport center with invincible status, replacing manual input with an auto-firing laser beam that destroys any entity, while dynamically pulling currency to the center. Surviving 50 column cycles increments the global Phase, altering scroll velocities and instantiating a "Warning Wall" hurdle.

### 6. [GAME_STATE_MACHINE]
- `Init`: System bootstrapper. Instantiates Object Pools, fetches player configuration DB. Transition -> `Home`.
- `Home`: Neutral wait state rendering `UI_Panel_Home`. TimeScale is nominal. Transition -> `Play` via `UI_Btn_Play` interaction.
- `Play`: Active progression state. Simulation time active. Collisions and bounds detection active. Transition -> `Pause` via `UI_Btn_Pause`, or `GameOver` upon fatal collision rules.
- `Pause`: Interrupt state. TimeScale = 0. Simulation frozen. Transition -> `Play` via `UI_Btn_Resume`, or `Home` via `UI_Btn_Quit`.
- `GameOver`: Run termination state. Stops scrolling. Evaluates metrics. Transition -> `Play` via `UI_Btn_Replay` or `Home` via `UI_Btn_Home_Return`.

### 7. [SYSTEM_VARIABLES]
- `gravity_acceleration` (float): Downward acceleration scalar applied to player Y-velocity per physics step.
- `recoil_impulse_base` (float): The default absolute Y-vector force applied upon projectile firing.
- `recoil_decay_factor` (float): Logarithmic decay multiplier (range 0.0 to 1.0) applied against `recoil_impulse_base` relative to the frequency of consecutive shots.
- `fire_cooldown_min` (float): Absolute minimum time boundary required between projectile instantiations.
- `projectile_velocity_x` (float): Linear speed of the player's bullet.
- `projectile_damage_base` (float): Base arithmetic deduction applied to hit entity HP.
- `global_scroll_speed` (float): Environmental and obstacle translation velocity along the negative X-axis.
- `block_hp_base` (float): Baseline structural integrity points for standard environmental blocks.
- `score_current` (int): Run-specific metric calculating total passed pillar geometries.
- `coin_balance` (int): Persistent metacurrency counter.
- `combo_current` (int): Run-specific consecutive block destruction sequence counter.
- `combo_max_threshold` (int): Target integer necessary to flip `is_fever_active`.
- `is_fever_active` (bool): Boolean lock preventing normal collision rules and input mappings.
- `fever_duration_sec` (float): Absolute timer constant defining Fever state length.
- `game_phase_current` (int): Incremental integer defining difficulty scaling tier.
- `pillars_passed_lifetime` (int): Raw counter of completely traversed vertical block structures.

### 8. [GAME_RULES]
- **Collision & Termination:** During execution, if `is_fever_active` == false, evaluating `player.y` against `viewport.top` or `viewport.bottom` strict boundaries OR evaluating a bounding box intersection against any Block geometry instantly shifts state to `GameOver`. If `is_fever_active` == true, bypass all bounding box evaluations.
- **Score Matrix:** Traversing the geometric X-axis bounds of a spawned pillar increments `score_current` and `pillars_passed_lifetime` by 1. Nullifying a block's HP grants +1 `combo_current` and tests a probability curve to spawn a Coin entity.
- **Diminishing Recoil Formula:** Consecutive inputs evaluated within `t < 0.2s` delta applies `recoil_decay_factor`. Upward vector calculation shifts asymptotically towards counterbalancing `gravity_acceleration` but explicitly limits maximum upward trajectory velocity, achieving visual hovering.
- **Block Taxonomy Behaviors:**
  - **Basic:** `HP = block_hp_base`. Destroy on `HP <= 0`.
  - **Armor:** Evaluates incoming damage as `projectile_damage_base * 0.5`.
  - **Moving:** Evaluates Y-position transform over time utilizing `Mathf.Sin(Time.time * frequency)`.
  - **Shield:** Enforces hit immunity constraint `hits == 1`. Initial collision sets immunity false (0 damage yield). Subsequent hits execute standard calculation.
  - **Explosive:** On destruction trigger, fires overlap sphere returning an array of adjacent blocks and applies 2.0 flat damage to all array indexes.
  - **Metal:** `is_destructible = false`. Collision normal determines angular deflection mapping, bouncing projectiles via inverted X/Y trajectory vectors.
  - **Ghost:** Evaluates a boolean toggler tied to a 1.5s modulo timer, alternating `collider.enabled` and alpha render states.
- **Fever Phase Resolution:** When `combo_current` >= `combo_max_threshold`, `is_fever_active` sets strictly true. Player transform Y linearly interpolates to viewport Y-center and locks. Auto-spawns continuous piercing beam. All spawned coin entities undergo transform translation toward player transform. Reverting after `fever_duration_sec` zeros the `combo_current`.
- **Phase Escalation:** If `pillars_passed_lifetime` % 50 == 0: Increment `game_phase_current`. Execute `global_scroll_speed = global_scroll_speed * 1.10`. Spawn "Warning Wall" entity (10-block height segment heavily weighted to yield 9 Metal blocks and 1 isolated Basic block). No separate Boss GameState is registered.

### 9. [EVENT_MATRIX]
| In-Game Event | Gameplay Result | Art/VFX Map (Asset_ID) | Sound Map (Asset_ID) |
| --- | --- | --- | --- |
| Valid Screen Tap | Spawns bullet, computes recoil Y-force | `SPR_Trippybara_Shoot`, `VFX_MuzzleFlash`| `SFX_Shoot_01` |
| Bullet intersects Block | Deduct block HP structure | `VFX_HitSpark` | `SFX_Hit_Block` |
| Bullet intersects Metal | Inverts bullet trajectory | `VFX_HitSpark` | `SFX_ShieldShatter` |
| Block HP <= 0 | Despawn block, +1 Combo | `VFX_BlockDestroy` | `SFX_BlockBreak` |
| Player bounds intersection | Terminate run -> `GameOver` | `SPR_Trippybara_Death`, `VFX_PlayerDeath` | `SFX_PlayerDeath` |
| Pillar transit finalized | +1 `score_current` | `UI_ScorePop` | `SFX_ScoreUp` |
| Coin entity intersect | +1 `coin_balance` | `VFX_CoinCollect` | `SFX_CoinPick` |
| `combo_current` full | Trigger `is_fever_active` execution | `VFX_FeverAura` | `SFX_FeverStart` |
| `pillars_passed` mod 50 | Trigger phase escalation routine | `VFX_PhaseTransition` | `SFX_PhaseUp` |

### 10. [UI_ARCHITECTURE]
- **Home Screen (`UI_Panel_Home`):** Center Viewport Anchor.
  - `UI_Btn_Play`: Bottom center geometry. Action: Prompts `Play` state entry.
  - `UI_Txt_Coins`: Top right topology. Action: Dynamically renders string associated with persistent `coin_balance`.
- **HUD Screen (`UI_Panel_HUD`):** Top Viewport Anchor.
  - `UI_Txt_Score`: Top Center. Action: Renders `score_current`.
  - `UI_Txt_Combo`: Top Left. Action: Visualizes `combo_current` progress against `combo_max_threshold`.
  - `UI_Btn_Pause`: Top Right. Action: Escalate `Pause` state flag.
  - `UI_Panel_PhaseUp`: Center dynamic popup. Action: Animated prompt overlay for `Phase Escalation`.
- **Pause Screen (`UI_Panel_Pause`):** Center Viewport Overlay.
  - `UI_Btn_Resume`: Center point. Action: Clears `Pause` state flag.
  - `UI_Btn_Quit`: Below Resume. Action: Terminate process tracking and enter `Home` state.
- **GameOver Screen (`UI_Panel_GameOver`):** Center Viewport Overlay.
  - `UI_Txt_FinalScore`: Mid-center. Action: Pulls final `score_current` scalar output.
  - `UI_Btn_Replay`: Bottom left alignment. Action: Rapid reload of `Play` context.
  - `UI_Btn_Home_Return`: Bottom right alignment. Action: Transition to `Home` mapping.

### 11. [ASSET_AGGREGATION_CHECKLIST]
```json
{
  "STATIC_ART": [
    { "id": "SPR_Trippybara_Idle", "description": "Player core idle geometry", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Trippybara_Shoot", "description": "Player weapon discharge sprite", "dimensions": "256x256", "format": "png", "animation_frames": 2 },
    { "id": "SPR_Trippybara_Death", "description": "Player fatal collision sprite", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Bullet", "description": "Projectile visual element", "dimensions": "64x64", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Basic", "description": "Base environmental block constraint", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Armor", "description": "Resistance-heavy block visual", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Moving", "description": "Dynamic translation block visual", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Shield", "description": "Dual-hit barrier block geometry", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Explosive", "description": "Volatile explosive entity visual", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Metal", "description": "Invincible static object geometry", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Ghost", "description": "Phasing entity logic visual", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Coin", "description": "Pickup currency item sprite", "dimensions": "128x128", "format": "png", "animation_frames": 1 },
    { "id": "SPR_BG_Layer1", "description": "Tiled parallax background layer", "dimensions": "1080x1920", "format": "jpg", "animation_frames": 1 },
    { "id": "SPR_Powerup_Generic", "description": "Default container for arbitrary buffs", "dimensions": "128x128", "format": "png", "animation_frames": 1 }
  ],
  "VFX_ASSETS": [
    { "id": "VFX_MuzzleFlash", "description": "Discharge origin particle emission", "duration_sec": 0.2, "particle_density": "Low" },
    { "id": "VFX_HitSpark", "description": "Projectile kinetic termination sequence", "duration_sec": 0.3, "particle_density": "Medium" },
    { "id": "VFX_BlockDestroy", "description": "Destruction logic visual payload", "duration_sec": 0.5, "particle_density": "High" },
    { "id": "VFX_PlayerDeath", "description": "Fatal constraint trigger payload", "duration_sec": 1.0, "particle_density": "High" },
    { "id": "VFX_Explosion_Area", "description": "Radius-based AOE kinetic payload", "duration_sec": 0.6, "particle_density": "High" },
    { "id": "VFX_ShieldBreak", "description": "Immunity negation state visual", "duration_sec": 0.4, "particle_density": "Medium" },
    { "id": "VFX_CoinCollect", "description": "Currency increment particle", "duration_sec": 0.3, "particle_density": "Low" },
    { "id": "VFX_FeverAura", "description": "Invincible logic persistent visual", "duration_sec": 5.0, "particle_density": "Medium" },
    { "id": "VFX_PhaseTransition", "description": "Environmental manipulation payload", "duration_sec": 1.0, "particle_density": "High" }
  ],
  "SOUND_ASSETS": [
    { "id": "SFX_Shoot_01", "description": "Recoil generation audio queue", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_Hit_Block", "description": "Kinetic termination collision audio", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_BlockBreak", "description": "Destruction threshold hit queue", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_PlayerDeath", "description": "Fatal bounds termination queue", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_ScoreUp", "description": "Pillar evaluation success logic audio", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_Explosion_Large", "description": "AOE evaluation logic audio queue", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_ShieldShatter", "description": "Immunity invalidation or metallic bounce queue", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_CoinPick", "description": "Currency modifier increment hit", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "BGM_MainLoop", "description": "Persistent active state audio base", "layer": "BGM", "loop_flag": true, "format": "mp3" },
    { "id": "SFX_FeverStart", "description": "Fever state initialization queue", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_PhaseUp", "description": "Phase index increment queue", "layer": "SFX", "loop_flag": false, "format": "wav" }
  ],
  "UI_ASSETS": [
    { "id": "UI_Btn_Play", "description": "State transition element (Init)", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "UI_Btn_Pause", "description": "State transition element (Halt)", "dimensions": "128x128", "format": "png", "animation_frames": 1 },
    { "id": "UI_Btn_Resume", "description": "State transition element (Resume)", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "UI_Btn_Quit", "description": "State transition element (Home routing)", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "UI_Btn_Replay", "description": "State transition element (Restart loop)", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "UI_Btn_Home_Return", "description": "State transition element (Post-game Home)", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "UI_Txt_Coins", "description": "Currency render geometry", "dimensions": "64x64", "format": "png", "animation_frames": 1 },
    { "id": "UI_Txt_Score", "description": "Metric calculation geometry layer", "dimensions": "512x128", "format": "png", "animation_frames": 1 },
    { "id": "UI_Panel_Home", "description": "Menu background topology", "dimensions": "1080x1920", "format": "png", "animation_frames": 1 },
    { "id": "UI_Panel_GameOver", "description": "Termination metric logic overlay", "dimensions": "800x800", "format": "png", "animation_frames": 1 },
    { "id": "UI_ScorePop", "description": "Dynamic evaluation metric text render", "dimensions": "128x64", "format": "png", "animation_frames": 1 },
    { "id": "UI_Txt_Combo", "description": "Consecutive evaluation metric render", "dimensions": "128x64", "format": "png", "animation_frames": 1 },
    { "id": "UI_Panel_PhaseUp", "description": "Phase escalation logic dynamic popup", "dimensions": "512x256", "format": "png", "animation_frames": 1 }
  ]
}
```
