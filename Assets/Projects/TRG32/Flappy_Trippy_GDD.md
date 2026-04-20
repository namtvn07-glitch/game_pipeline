# TRG32: Flappy Trippy - Game Design Document

### 1. [CONCEPT]
```json
{
  "ProjectName": "Flappy_Trippy",
  "Genre": "2D Action / Endless Runner / Shoot 'em up",
  "TargetAudience": "Mass market (Hybrid-Casual)",
  "USP": "A hybrid-casual endless runner where the player actively shoots to clear obstacles, and the weapon's recoil acts as the core jump/flight mechanic."
}
```

### 2. [DISCARDED_FEATURES]
- **Complex Gacha & Multiple Currencies:** Stripped down to a simple coin collection and single skin unlock to keep it as an MVP prototype.
- **Intricate Daily Quests:** Kept to basic "Play 1 Game" or "Collect Coins" for MVP instead of a 9-day streak system.
- **Deep Shop Bundles:** Cut real-money IAP integration for MVP; strictly using in-game coins for boosters first.

### 3. [TECHNICAL_CONSTRAINTS]
- **Platform/Engine:** Unity Mobile (iOS/Android)
- **Orientation:** Portrait (9:16)
- **File Size/Memory Limits:** Under 50MB (Targeted for fast download / Hybrid-casual standard)

### 4. [CROSS_DEPARTMENT_SYNC]
- **Naming Conventions:** 
  - Art: `SPR_[Entity]_[State]` (e.g., `SPR_Trippybara_Idle`)
  - Audio: `SFX_[Action]_[Variation]` (e.g., `SFX_Shoot_01`)
  - VFX: `VFX_[Action]_[Variation]` (e.g., `VFX_Explosion_Small`)
  - UI: `UI_[Element]_[Name]` (e.g., `UI_Btn_Play`)
- **Communication Handshake:** Dev must use string tags matching exact Asset IDs. The game logic will trigger events that pass these string IDs to the `AudioManager` or `VFXManager`.

### 5. [CORE_GAMEPLAY]
The game uses an auto-scrolling portrait side-view camera. 
The player controls "Trippybara", a character that constantly falls due to gravity. The player taps the screen to fire a horizontal projectile entirely straight ahead. The physical recoil of this shot pushes Trippybara up (acting as a "flap" or jump mechanic). 
Pillars consisting of various vertical blocks appear from the right. Instead of just avoiding small gaps, the player is encouraged to blast away the blocks, whittling down their HP to create their own safe passage. The rhythm is frantic and action-oriented, demanding rapid tapping to shoot and maintain height while focusing fire on specific blocking targets.

### 6. [GAME_STATE_MACHINE]
- `Init`: The state when the game first loads (loading assets, initializing poolers). Transitions to `Home` when complete.
- `Home`: The state before the game starts. Shows UI Menu. Transitions to `Play` on `UI_Btn_Play` tap.
- `Play`: The active gameplay loop with scrolling obstacles and gravity enabled. Transitions to `GameOver` on death condition, or `Pause` on `UI_Btn_Pause` tap.
- `Pause`: The state when gameplay is interrupted. TimeScale set to 0. Transitions to `Play` on resume.
- `GameOver`: The state when the player reaches a Loss condition. Shows score and replay button. Transitions to `Play` on `UI_Btn_Replay` tap.

### 7. [SYSTEM_VARIABLES]
- `player_gravity` (float): The downward force applied to the player per frame.
- `recoil_impulse` (float): The upward force applied to the player upon tapping/shooting.
- `fire_cooldown` (float): Minimum time between consecutive shots.
- `projectile_speed` (float): Horizontal velocity of the fired bullet.
- `projectile_damage` (float): Base damage of the bullet (Default: 1.0).
- `scroll_speed` (float): The horizontal speed at which columns move leftwards.
- `block_base_hp` (float): Base HP for a standard block.
- `score_current` (int): Player's score for the current run.
- `coin_balance` (int): Player's hard currency for purchasing boosters.
- `obstacle_spawn_rate` (float): Time interval in seconds to randomly spawn the next obstacle column.
- `vertical_gap_size` (int): The minimum allowable number of empty blocks per column to ensure a passable gap.

### 8. [GAME_RULES]
- **Win/Loss Conditions:** The player transitions to `GameOver` if `player.y` < bottom bounds, or `player.y` > top bounds, or if the player's collider intersects with a block's collider.
- **Scoring & Progression:** The player earns points (+1) for every column of blocks successfully crossed. Passing a column increments `score_current`. Destroying a block grants +1 coin (chance-based).
- **Entity Behaviors:**
  - **Basic Block:** Dies when HP <= 0.
  - **Armor Block:** Modifies incoming damage (`projectile_damage` * 0.5).
  - **Moving Block:** Y-position oscillates using a sine wave function based on time and `scroll_speed`.
  - **Shield Block:** Has an independent `is_shielded` boolean. First hit sets `is_shielded = false` (no HP reduction). Subsequent hits reduce HP.
  - **Explosive Block:** On HP <= 0, triggers a blast radius that reduces HP of adjoining blocks by 2.
  - **Metal Block:** `is_invincible = true`. Cannot be destroyed; bullets bounce or despawn.
  - **Ghost Block:** Toggles `collider.enabled` and opacity based on a timer interval.
- **Recoil Mitigation (Anti-Ceiling Crash):** To prevent rapid-fire or multishot powerups from generating infinite upward thrust and crashing the player into the ceiling, `recoil_impulse` must explicitly contain an internal cooldown (e.g., max 1 impulse per 0.2s) regardless of fire rate, OR decouple jump from auto-fire.
- **Alternative Swipe Move:** In the event the player is trapped above a Metal Block, vertical Swipe Down triggers a `fast_fall` maneuver to drop quickly without firing.

### 9. [EVENT_MATRIX]
| In-Game Event | Gameplay Result | Art/VFX Map (Asset_ID) | Sound Map (Asset_ID) |
| --- | --- | --- | --- |
| Player Taps Screen | Spawn Projectile, apply `recoil_impulse` upwards | `SPR_Trippybara_Shoot`, `SPR_Bullet`, `VFX_MuzzleFlash` | `SFX_Shoot_01` |
| Projectile Hits Block | Reduce Block HP by Damage, destroy projectile | `VFX_HitSpark` | `SFX_Hit_Block` |
| Block HP <= 0 | Destroy Block entity | `VFX_BlockDestroy` | `SFX_BlockBreak` |
| Player Hits Block | Trigger `GameOver` state, stop scrolling | `SPR_Trippybara_Death`, `VFX_PlayerDeath` | `SFX_PlayerDeath` |
| Pass Pillar | Increment `score_current` | `UI_ScorePop` | `SFX_ScoreUp` |
| Break Explosive Block | Damage adjacent blocks by 2 | `VFX_Explosion_Area` | `SFX_Explosion_Large` |
| Hit Shield Block (Shield UP) | Remove shield, 0 HP damage | `VFX_ShieldBreak` | `SFX_ShieldShatter` |
| Player Collects Coin | Increment `coin_balance` | `VFX_CoinCollect` | `SFX_CoinPick` |
| Player Swipes Down | Trigger rapid descent (fast_fall) without firing | - | - |

### 10. [UI_ARCHITECTURE]
- **Home Screen (`UI_Panel_Home`):** Center Anchor.
  - `UI_Btn_Play`: Central play icon. Action: Transition to `UI_Panel_HUD` and trigger `Play` state.
  - `UI_Txt_Coins`: Top Right anchor. Action: Displays `coin_balance`.
- **HUD Screen (`UI_Panel_HUD`):** Top Anchor.
  - `UI_Txt_Score`: Top Center anchor. Action: Displays `score_current`.
  - `UI_Btn_Pause`: Top Right anchor. Action: Triggers `Pause` state and opens `UI_Panel_Pause`.
- **Pause Screen (`UI_Panel_Pause`):** Center Anchor.
  - `UI_Btn_Resume`: Center anchor. Action: Re-triggers `Play` state.
  - `UI_Btn_Quit`: Bottom anchor. Action: Triggers `Home` state.
- **GameOver Screen (`UI_Panel_GameOver`):** Center Anchor.
  - `UI_Txt_FinalScore`: Center anchor. Action: Displays final run score.
  - `UI_Btn_Replay`: Bottom anchor. Action: Reloads `Play` state directly.

### 11. [ASSET_AGGREGATION_CHECKLIST]
```json
{
  "STATIC_ART": [
    { "id": "SPR_Trippybara_Idle", "description": "Main character idle sprite", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Trippybara_Shoot", "description": "Main character shooting action sprite", "dimensions": "256x256", "format": "png", "animation_frames": 2 },
    { "id": "SPR_Trippybara_Death", "description": "Main character death sprite", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Bullet", "description": "Standard projectile shot by player", "dimensions": "64x64", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Basic", "description": "Standard basic block pillar segment", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Armor", "description": "Armored block taking less damage", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Moving", "description": "Block that moves vertically", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Shield", "description": "Block protected by a shield", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Explosive", "description": "Block that explodes on destruction", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Metal", "description": "Indestructible metal block", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Block_Ghost", "description": "Block that toggles phase", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Coin", "description": "Currency item", "dimensions": "128x128", "format": "png", "animation_frames": 1 },
    { "id": "SPR_BG_Layer1", "description": "Parallax scrolling background", "dimensions": "1080x1920", "format": "jpg", "animation_frames": 1 },
    { "id": "SPR_Powerup_RapidFire", "description": "Rapid fire powerup drop item", "dimensions": "128x128", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Powerup_Multishot", "description": "Multishot powerup drop item", "dimensions": "128x128", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Booster_Shield", "description": "Bubble shield booster icon", "dimensions": "128x128", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Booster_Freeze", "description": "Freeze timer booster icon", "dimensions": "128x128", "format": "png", "animation_frames": 1 },
    { "id": "SPR_Booster_Magnet", "description": "Coin magnet booster icon", "dimensions": "128x128", "format": "png", "animation_frames": 1 }
  ],
  "VFX_ASSETS": [
    { "id": "VFX_MuzzleFlash", "description": "Flash effect at gun barrel when firing", "duration_sec": 0.2, "particle_density": "Low" },
    { "id": "VFX_HitSpark", "description": "Sparks flying when projectile connects with block", "duration_sec": 0.3, "particle_density": "Medium" },
    { "id": "VFX_BlockDestroy", "description": "Block shattering into pieces", "duration_sec": 0.5, "particle_density": "High" },
    { "id": "VFX_PlayerDeath", "description": "Player character crashing explosion", "duration_sec": 1.0, "particle_density": "High" },
    { "id": "VFX_Explosion_Area", "description": "Large area effect blast from explosive block", "duration_sec": 0.6, "particle_density": "High" },
    { "id": "VFX_ShieldBreak", "description": "Energy scattering when shield block loses shield", "duration_sec": 0.4, "particle_density": "Medium" },
    { "id": "VFX_CoinCollect", "description": "Sparkle effect when coin is gathered", "duration_sec": 0.3, "particle_density": "Low" }
  ],
  "SOUND_ASSETS": [
    { "id": "SFX_Shoot_01", "description": "Weapon fire sound", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_Hit_Block", "description": "Impact sound on block", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_BlockBreak", "description": "Block breaking completely", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_PlayerDeath", "description": "Impact/Death sound for player", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_ScoreUp", "description": "Positive chime for passing a pillar", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_Explosion_Large", "description": "Deep boom for explosive block", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_ShieldShatter", "description": "Glass/energy shattering sound", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "SFX_CoinPick", "description": "Coin pickup chime", "layer": "SFX", "loop_flag": false, "format": "wav" },
    { "id": "BGM_MainLoop", "description": "High tempo energetic gameplay music", "layer": "BGM", "loop_flag": true, "format": "mp3" }
  ],
  "UI_ASSETS": [
    { "id": "UI_Btn_Play", "description": "Play button", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "UI_Btn_Pause", "description": "Pause icon", "dimensions": "128x128", "format": "png", "animation_frames": 1 },
    { "id": "UI_Btn_Resume", "description": "Resume icon button", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "UI_Btn_Quit", "description": "Quit/Home icon button", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "UI_Btn_Replay", "description": "Restart/Replay icon button", "dimensions": "256x256", "format": "png", "animation_frames": 1 },
    { "id": "UI_Txt_Coins", "description": "Coin icon next to counter", "dimensions": "64x64", "format": "png", "animation_frames": 1 },
    { "id": "UI_Txt_Score", "description": "Score display background", "dimensions": "512x128", "format": "png", "animation_frames": 1 },
    { "id": "UI_Panel_Home", "description": "Main menu background panel", "dimensions": "1080x1920", "format": "png", "animation_frames": 1 },
    { "id": "UI_Panel_GameOver", "description": "GameOver popup background", "dimensions": "800x800", "format": "png", "animation_frames": 1 },
    { "id": "UI_ScorePop", "description": "Floating text effect for score or damage numbers", "dimensions": "128x64", "format": "png", "animation_frames": 1 }
  ]
}
```
