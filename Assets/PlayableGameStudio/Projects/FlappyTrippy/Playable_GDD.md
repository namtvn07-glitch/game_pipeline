# Playable GDD: FlappyTrippy

## 1. Game Genre
2D Action / Arcade Runner (Hybrid-Casual)

## 2. Playable Mechanics: The "Hook" (15-20 Seconds)
**Gameloop:** 
The game is an endless runner that scrolls horizontally. The player character ("Trippybara") falls vertically constantly due to gravity. The ONLY input is tapping the screen.
Tapping the screen fires a projectile `SPR_Bullet` to the right, and the recoil instantly pushes the player character UPWARDS.
The core mechanic is balancing the height using the fire recoil, while also shooting down vertical structures (Pillars) made of `SPR_Block_Basic` to clear a safe path.

**Gameplay Limit (Simplifications for Playable Ad):**
- Included Block Types:
  - `SPR_Block_Basic`: Standard destructible block.
  - `SPR_Block_Moving`: Evaluates Y-position transform over time utilizing `Mathf.Sin(Time.time * frequency)` or equivalent JS logic, actively obscuring paths.
  - `SPR_Block_Explosive`: On destruction trigger, fires overlap sphere returning an array of adjacent blocks and applies flat damage to all, clearing a large path.
- Removed Fever / Phase Escalation: Focus purely on the core physics hook for 15 seconds.
- Removed Coins: Only Score matters (passing a pillar gives +1).

**End Conditions:**
- **Lose:** The player collides with the top/bottom boundary, or physically collides with a Block.
- **Win / Hook Complete:** If the player survives for ~15 seconds OR passes 10 pillars.
- Upon any End Condition, immediately freeze gameplay, display the final score, and present the Call-To-Action (CTA) overlay.

## 3. UI Flow & Structure
- **Global Layout:**
  - **Header:** Score text rendered as pure stylized Phaser font tracking the current score.
  - **Body:** The viewport is centered around the character and scrolling background.
  - **Footer/Overlay (Home):** Before the first tap, a pulsing text overlay "Tap to Shoot & Fly!" implicitly instructs the player.
  - **Footer/Overlay (End):** Upon Win/Lose, an opaque dark overlay is drawn dynamically via Graphics API.

- **Explicit Element Payloads:**
  - Score Display: "Score: [N]"
  - CTA Button: `UI_Btn_Play` image acting as "Download Now" button.

- **Style & Hidden Visual Flow:**
  - Cartoon/Cute aesthetic with vibrant neon cyan bullets and warm natural colors for the capybara.
  - Upon Game Over, the screen gracefully darkens (modal background), drawing strict visual hierarchy and attention to the pulsing Download button located bottom-center.

## 4. Required Asset List (Strict Budget constraints applied)
**Sprites (Max 15) - Actual: 8**
1. `SPR_Trippybara_Idle.png`
2. `SPR_Trippybara_Death.png`
3. `SPR_Bullet.png`
4. `SPR_Block_Basic.png`
5. `SPR_BG_Layer1.jpg`
6. `UI_Btn_Play.png` (Used as the main CTA button)
7. `SPR_Block_Moving.png`
8. `SPR_Block_Explosive.png`

**BGM (Max 1) - Actual: 1**
1. `BGM-MainLoop.mp3`

**SFX (Max 3) - Actual: 3**
1. `SFX_Shoot_01.wav`
2. `SFX_BlockBreak.wav`
3. `SFX_PlayerDeath.wav`
