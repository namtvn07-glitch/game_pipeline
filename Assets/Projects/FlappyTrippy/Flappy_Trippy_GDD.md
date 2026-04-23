# Game Design Document: TRG32 - Flappy Trippy

### 1. [CONCEPT]
```json
{
  "ProjectName": "Flappy Trippy",
  "Genre": "Hybrid-Casual / 2D Action, Endless Runner",
  "TargetAudience": "Mass market",
  "USP": "Hybrid-Casual: Shoot-to-fly mechanics where weapon recoil propels the player, turning obstacle avoidance into real-time tactical combat."
}
```

### 2. [DISCARDED_FEATURES]
- Main Menu & Meta Progression UI (Eliminated to ensure a Zero-Friction instant gameplay experience).

### 3. [TECHNICAL_CONSTRAINTS]
- **Platform/Engine:** HTML5 Playable Ad (Phaser 3) or Unity Mobile
- **Orientation:** Portrait (9:16)
- **File Size/Memory Limits:** Monolithic Single-File Build < 5MB

### 4. [CROSS_DEPARTMENT_SYNC]
- **Naming Conventions:** Format for Art (`SPR_[Entity]_[State]`), VFX (`VFX_[Action]`), Audio (`SFX_[Action]_[Variation]`), UI (`UI_[Type]_[Name]`).
- **Communication Handshake:** Code triggers Art/Audio exclusively via string tags matching Asset IDs from the registry.

### 5. [CORE_GAMEPLAY]
- **Mechanics:** The player automatically scrolls right while falling under gravity. Tapping fires a projectile forward, and the weapon's recoil propels the player upward. Continuous rhythmic tapping allows hovering. Players must blast through HP-based blocks to create gaps while avoiding indestructible elements.
- **Pacing & Atmosphere:** Fast-paced, chaotic arcade action. Visual feedback is dense ("Juicy"), with heavy screenshake and hit-stops to emphasize impact.
- **Camera Behavior:** Auto-scrolling 2D Side-View locked horizontally relative to world progress, allowing the player to maneuver freely on the Y-axis.

---

### 6. [GAME_STATE_MACHINE]
- `Init`: The state when the game loads monolithic assets into memory pools.
- `Play`: The active gameplay loop; physics and inputs are active.
- `Pause`: Timescale set to 0. Triggered by UI button.
- `GameOver`: Triggered by a lethal collision physics event. Movement freezes.

### 7. [SYSTEM_VARIABLES]
- `player_gravity` (float), `jump_impulse_base` (float), `recoil_diminishing_factor` (float), `base_scroll_speed` (float), `block_base_hp` (int), `combo_meter_current` (int), `fever_threshold` (int), `phase_interval` (int).

### 8. [GAME_RULES]
**CRITICAL:** Visceral Feedbacks are strictly enforced for every entity.
- **Win/Loss Conditions:** Player transitions to `GameOver` upon touching any obstacle collider or falling off the screen.
- **Scoring & Progression:** Destroying blocks grants points and fills Combo. Reaching the `phase_interval` increases speed and shifts the level phase.
- **Entity Behaviors (Action-Reaction Schema):**
  - **Player Tap (Shoot/Jump):** The player fires and recoils. **Required Feedback:** `SPR_Player_Shoot` frame change, `VFX_MuzzleFlash`, `SFX_Shoot_01`.
  - **Basic Block:** Absorbs standard damage. **Required Feedback:** `VFX_Hit_Spark` on hit, `VFX_Block_Break` & `SFX_Block_Shatter` on death.
  - **Armor Block:** Modifies incoming damage (0.5x). **Required Feedback:** Distinct metallic spark and clink sound.
  - **Shield Block:** Absorbs the first hit completely. **Required Feedback:** `SPR_Block_Shield` visual. `VFX_Enemy_Shield_Shatter` and `SFX_Shield_Break` when the shield is removed.
  - **Moving Block:** Sine wave vertical movement.
  - **Explosive Block:** Explodes on death dealing 2 splash damage. **Required Feedback:** `SPR_Block_Explosive`, massive `VFX_Explosive_Blast`, and `SFX_Explosion`.
  - **Metal Block:** Infinite HP, indestructible. **Required Feedback:** Deflection spark and error sound when hit.
  - **Ghost Block:** Toggles alpha and collider.
  - **Warning Wall (Phase Up):** Unavoidable challenge. **Required Feedback:** `SPR_Warning_Wall`, `VFX_Warning_Alert` overlay, and `SFX_Warning_Alarm` siren.
  - **Fever Mode Activation:** Triggers when combo maxes out. Grants invincibility and a giant laser. **Required Feedback:** `SPR_Laser_Beam`, `VFX_Fever_Aura`, `SFX_Fever_Start`, and looping `SFX_Laser_Loop`.
  - **Active Booster (Shield):** Player activates HUD button for 1-hit protection. **Required Feedback:** `SPR_Player_Shield` appears, `SFX_Booster_Use`.

---

### 9. [EVENT_MATRIX]

| In-Game Event | Gameplay Result | Art/VFX Map (Asset_ID) | Sound Map (Asset_ID) |
| --- | --- | --- | --- |
| Player Taps | Fires Bullet, Upward Recoil | `SPR_Player_Shoot`, `SPR_Proj_Base`, `VFX_MuzzleFlash` | `SFX_Shoot_01` |
| Bullet Hits Block | Deducts Block HP, visual hit | `VFX_Hit_Spark` | `SFX_Hit_Block` |
| Block Destroyed | +Combo, Explosion roll item | `VFX_Block_Break` | `SFX_Block_Shatter` |
| Explosive Block Dies| Deals splash damage | `VFX_Explosive_Blast` | `SFX_Explosion` |
| Combo Max Reached | Trigger Fever Mode | `VFX_Fever_Aura`, `SPR_Laser_Beam` | `SFX_Fever_Start`, `SFX_Laser_Loop` |
| Player Hits Block | GameOver state triggered | `VFX_Player_Death` | `SFX_Death` |
| Booster Used | Activate Shield Buff | `SPR_Player_Shield` | `SFX_Booster_Use` |
| Enemy Shield Hit | Negate Damage, Break Shield | `VFX_Enemy_Shield_Shatter` | `SFX_Shield_Break` |
| Player Shield Hit | Negate Death, Break Shield | `VFX_Shield_Shatter` | `SFX_Shield_Break` |
| Reach 50 cols | Phase up: Speed, Color, Wall | `SPR_Warning_Wall`, `VFX_Phase_Shift`, `VFX_Warning_Alert` | `SFX_Phase_Up`, `SFX_Warning_Alarm` |
| Pause Game | State -> Pause, Show Overlay | `UI_Panel_Backdrop` | `SFX_UI_Click` |

### 10. [UI_ARCHITECTURE]
*(Extracted to Flappy_Trippy_UI_Architecture.md as per Critical Export Step 3)*

### 11. [ASSET_AGGREGATION_CHECKLIST]

```json
{
  "STATIC_ART": [
    { "id": "SPR_Player_Idle", "description": "Main character idle sprite", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Player_Shoot", "description": "Main character shooting/recoil frame", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Player_Shield", "description": "Bubble shield around player", "dimensions": "300x300", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Proj_Base", "description": "Standard projectile", "dimensions": "64x64", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Proj_Special", "description": "Special powerup projectile (glow/color swapped)", "dimensions": "80x80", "format": "png", "animation_frames": 3 },
    { "id": "SPR_Laser_Beam", "description": "Fever mode screen laser", "dimensions": "800x128", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Basic", "description": "Standard breakable obstacle", "dimensions": "128x128", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Armor", "description": "Armored obstacle block", "dimensions": "128x128", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Metal", "description": "Indestructible obstacle block", "dimensions": "128x128", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Explosive", "description": "Exploding obstacle block", "dimensions": "128x128", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Ghost", "description": "Phasing obstacle block", "dimensions": "128x128", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Shield", "description": "Protective energy shield wrapping a block", "dimensions": "150x150", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Warning_Wall", "description": "Dangerous wall obstacle for phase transition", "dimensions": "128x512", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Powerup_Box", "description": "Generic powerup drop box", "dimensions": "100x100", "format": "png", "animation_frames": 1 },
    { "id": "SPR_BG_Layer1", "description": "Scrolling background layer", "dimensions": "1080x1920", "format": "jpg", "animation_frames": 1 }
  ],
  "VFX_ASSETS": [
    { "id": "VFX_MuzzleFlash", "description": "Spark when firing", "duration_sec": 0.2, "particle_density": "Low" },
    { "id": "VFX_Hit_Spark", "description": "Sparks on bullet hit", "duration_sec": 0.3, "particle_density": "Low" },
    { "id": "VFX_Block_Break", "description": "Debris when block dies", "duration_sec": 0.6, "particle_density": "Medium" },
    { "id": "VFX_Explosive_Blast", "description": "Large AoE blast from explosive block", "duration_sec": 0.8, "particle_density": "High" },
    { "id": "VFX_Player_Death", "description": "Player explosion", "duration_sec": 1.0, "particle_density": "High" },
    { "id": "VFX_Fever_Aura", "description": "Aura overlay during Fever", "duration_sec": 5.0, "particle_density": "Medium" },
    { "id": "VFX_Shield_Shatter", "description": "Player shield shatter effect", "duration_sec": 0.4, "particle_density": "Medium" },
    { "id": "VFX_Enemy_Shield_Shatter", "description": "Enemy block shield shatter effect", "duration_sec": 0.4, "particle_density": "Medium" },
    { "id": "VFX_Phase_Shift", "description": "Speed lines when leveling up", "duration_sec": 1.5, "particle_density": "Low" },
    { "id": "VFX_Warning_Alert", "description": "Red flashing alert for incoming wall", "duration_sec": 2.0, "particle_density": "Low" }
  ],
  "SOUND_ASSETS": [
    { "id": "SFX_Shoot_01", "description": "Base shooting sound", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_Hit_Block", "description": "Bullet hitting block", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_Block_Shatter", "description": "Block exploding sound", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_Explosion", "description": "Heavy explosion sound", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_Death", "description": "Player death sound", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_Fever_Start", "description": "Fever mode activation jump", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_Laser_Loop", "description": "Continuous laser beam sound", "layer": "SFX", "loop_flag": true, "format": "wav" },
    { "id": "SFX_Booster_Use", "description": "Activating active shield", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_Shield_Break", "description": "Shield shattering", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_Phase_Up", "description": "Leveling up transition", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_Warning_Alarm", "description": "Siren for warning wall", "layer": "SFX", "loop_flag": true, "format": "wav" },
    { "id": "SFX_UI_Click", "description": "Generic UI button click", "layer": "UI", "loop_flag": false, "format": "wav" }
  ],
  "UI_ASSETS": [
    { "id": "UI_Btn_Booster", "description": "HUD active shield button", "dimensions": "200x200", "format": "png", "animation_frames": 1 },
    { "id": "UI_Btn_Pause", "description": "HUD pause toggle button", "dimensions": "120x120", "format": "png", "animation_frames": 1 },
    { "id": "UI_Btn_Resume", "description": "Resume gameplay button in Pause popup", "dimensions": "300x120", "format": "png", "animation_frames": 1 },
    { "id": "UI_Btn_Replay", "description": "Retry button on Gameover/Pause popup", "dimensions": "300x120", "format": "png", "animation_frames": 1 },
    { "id": "UI_Icon_Powerup", "description": "Status icon indicating active powerup buff", "dimensions": "80x80", "format": "png", "animation_frames": 3 },
    { "id": "UI_Bar_Combo", "description": "Combo progress bar", "dimensions": "500x50", "format": "png", "animation_frames": 1 },
    { "id": "UI_Text_Font", "description": "General font spritesheet for Score/Title texts", "dimensions": "Auto", "format": "ttf", "animation_frames": 1 },
    { "id": "UI_Panel_Backdrop", "description": "Universal semi-transparent dark backdrop for popups", "dimensions": "1080x1920", "format": "png", "animation_frames": 1 },
    { "id": "UI_Overlay_PhaseAlert", "description": "Warning wall flash overlay", "dimensions": "1080x1920", "format": "png", "animation_frames": 1 }
  ]
}
```
