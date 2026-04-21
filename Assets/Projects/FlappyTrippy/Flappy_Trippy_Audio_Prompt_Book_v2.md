# 🎵 Flappy Trippy: Game Audio Generation Prompt Book

*Tài liệu này được định dạng chuyên biệt để bạn sao chép (copy-paste) vào các Audio LLM (ElevenLabs, Udio, Suno, v.v.).*

## 1. System Definition
- **System Prompt:** "Act as a professional Game Audio Designer. You are creating the audio soundscape for a Hybrid-Casual, Shoot-to-fly game with a Minimalist Line-art aesthetic. The audio must feel punchy, zero-friction, and highly kinetic."
- **Global Constraints:** Maintain a crisp, zero muddy-reverb aesthetic to match the Line-art graphic style. Strict adherence to maximum duration limits is required to avoid audio clutter in fast gameplay.

## 2. Background Music (BGM) Request
### BGM_MainLoop
- **Gameplay Context:** Persistent active state audio base during endless scrolling flight.
- **Duration Constraint:** ~15s to 30s seamless loop
- **Prompt Formulation:** "130 BPM, Upbeat retro Synthwave mixed with modern Chiptune. Punchy synthetic kick drum and driving 16th-note arpeggiators. Kinetic and focused mood to induce flow-state. MUST be a seamless looping track, no fade-in or fade-out."

## 3. Sound Effects (SFX) Breakdown

### SFX_Shoot_01
- **Gameplay Context:** Recoil generation. Player taps multiple times per second to fire laser and generate upward recoil.
- **Trigger Frequency:** Extremely High (Continuous)
- **Duration Constraint:** Max 0.2s
- **Audio Texture Prompt:** "Fast attack, instant decay envelope. Crisp, zero reverb, bright high-end 8-bit laser zap combined with a punchy low-end thud. Must be strictly non-fatiguing to the ear."

### SFX_Hit_Block
- **Gameplay Context:** Kinetic termination collision. Bullet hits a block without destroying it.
- **Trigger Frequency:** High
- **Duration Constraint:** Max 0.3s
- **Audio Texture Prompt:** "Fast attack, short decay. Dull metallic 'tink' or digitized thud. Needs to sound defensive but subtle, without masking the main shooting sound."

### SFX_BlockBreak
- **Gameplay Context:** Obstruction destruction threshold hit. Target pillar is destroyed.
- **Trigger Frequency:** High
- **Duration Constraint:** Max 0.5s
- **Audio Texture Prompt:** "Fast attack, short decay. Crunchy, rewarding 8-bit destruction sound (like digitized glass or voxel shatter). Crisp with zero muddy reverb tails."

### SFX_PlayerDeath
- **Gameplay Context:** Fatal bounds termination. Player hits a pillar or falls off-screen.
- **Trigger Frequency:** Low (Terminal)
- **Duration Constraint:** Max 1.5s
- **Audio Texture Prompt:** "Sudden, heavy crunchy retro synth impact. Descending 8-bit glissando that feels fatal and game-ending. No long reverb."

### SFX_ScoreUp
- **Gameplay Context:** Pillar evaluation success. Player successfully navigates past an obstacle pillar.
- **Trigger Frequency:** Medium
- **Duration Constraint:** Max 0.5s
- **Audio Texture Prompt:** "Quick, positive ascending dual-tone 8-bit chime. Bright and validating micro-achievement marker. Very short."

### SFX_Explosion_Large
- **Gameplay Context:** AOE evaluation logic. An explosive block detonates nearby targets.
- **Trigger Frequency:** Medium
- **Duration Constraint:** Max 1.2s
- **Audio Texture Prompt:** "Heavy, satisfying AOE retro explosion. Deeper bass impact with a slightly longer noise-burst decay compared to a regular block break, but still crisp."

### SFX_ShieldShatter
- **Gameplay Context:** Immunity invalidation bounce queue. Shield block's armor is cracked.
- **Trigger Frequency:** Medium
- **Duration Constraint:** Max 0.4s
- **Audio Texture Prompt:** "Sharp, high-pitched metallic crack or digital deflection ping. Must sound defensive and heavily armored being cracked open."

### SFX_CoinPick
- **Gameplay Context:** Currency modifier increment. Player collects a coin item.
- **Trigger Frequency:** Low to Medium
- **Duration Constraint:** Max 0.3s
- **Audio Texture Prompt:** "Classic arcade coin pickup sound modernized with a crisp synth bell tone. Very short, sweet, zero tail."

### SFX_FeverStart
- **Gameplay Context:** Fever state initialization. Player enters invincible sweeping laser mode.
- **Trigger Frequency:** Low (Special Event)
- **Duration Constraint:** Max 1.5s
- **Audio Texture Prompt:** "Ascending, energetic power-up siren. Synth sweep with slightly longer sustain to signal shift into overdrive. Bright timbre, highly empowering."

### SFX_PhaseUp
- **Gameplay Context:** Phase index increment. Game speed increases after passing 50 pillars.
- **Trigger Frequency:** Low (Milestone)
- **Duration Constraint:** Max 2.0s
- **Audio Texture Prompt:** "Resonant, triumphant transition milestone alert. Multi-layered retro synth chord that sustains slightly, signaling an increase in difficulty."
