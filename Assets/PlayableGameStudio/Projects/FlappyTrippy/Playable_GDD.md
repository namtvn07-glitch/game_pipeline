# Playable GDD: Flappy Trippy

## 1. Game Genre
Hybrid-Casual / 2D Action Endless Runner

## 2. Playable Mechanics: The 15-Second Hook
- **Gameloop**: The player character auto-scrolls to the right while constantly falling due to gravity. The user taps anywhere on the screen. Each tap fires a projectile forward and simultaneously applies an upward recoil impulse to the player. The goal is to navigate through an incoming wave of blocks, either by shooting them to create a path or navigating the gaps. 
- **Game Feel & Programmatic Juice (CRITICAL)**: To maximize impact without relying on extra art, the feeling of recoil and impact MUST be strictly programmed via Tweens and Camera effects:
  - **Player Recoil**: When tapping, the player sprite does NOT change frames; instead, it uses a Tween to rapidly pitch upwards (rotation), slightly squash/stretch, then smoothly interpolates back down under gravity.
  - **Camera Shake**: A sharp, low-duration camera shake event must trigger on every shot fired (micro-shake) and a heavy shake on block destruction or Game Over.
  - **Hit-Stops**: Freeze the game timescale for a few milliseconds upon destroying a block to make the impact feel visceral.
- **Map Generation & Physics Integrity**: 
  - **Asset Alignment**: All loaded images must be dynamically analyzed for precise pivots (usually Center) and cropped/scaled properly in code. Transparent padding in sprites must not extend the physics bounds.
  - **Block Attributes (HP & Type)**: 
    - `SPR_Block_Basic`: HP = 2.
    - `SPR_Block_Moving`: HP = 3, moves vertically on a sine wave.
    - `SPR_Block_Explosive`: HP = 1, triggers a massive particle explosion (camera shake x2) on death, destroying adjacent blocks.
    - `SPR_Block_Metal`: Indestructible.
  - **Accurate Hitboxes**: Physics colliders (`body.setSize`, `body.setOffset`) must be meticulously clamped to visual pixels, NOT the image bounds. 
  - **Level Design Validation**: Automatically ensure spawned blocks create mathematically viable vertical gaps so the player doesn't get soft-locked in an impossible layout.
- **Gameplay Limit**: The playable ad is time-boxed to 15 seconds of active gameplay or until the player completes a mini-challenge (e.g., scoring 10 points/destroying 10 blocks).
- **End Conditions**:
  - **Win**: Surviving for 15 seconds or reaching 10 points. Activates a visually rewarding "Fever Time" effect transitioning immediately into the CTA.
  - **Lose**: Hitting any block collider or falling off the bottom edge of the screen. Triggers a quick death impact effect and transitions to the CTA.

## 3. UI Flow & Structure
- **Header**: Contains a simple Combo/Score counter displayed in a bold, arcade-style font at the top center.
- **Body**: 
  - **Start State**: A translucent overlay with an animated hand icon (`UI_Icon_Tap`) and text "TAP TO SHOOT & FLY!"
  - **Core Game**: The active game area displaying the player, projectiles, and incoming blocks.
- **Footer/Overlay (End State)**:
  - **CTA Overlay**: Darkened semi-transparent background.
  - **Main Text**: "AWESOME FLIGHT!" (Win) or "NICE TRY!" (Lose).
  - **Button**: A pulsing CTA button with the text "PLAY NOW" (`UI_Btn_CTA`).
- **Hidden Visual Flow**: The user enters -> sees prompt -> taps to begin -> chaotic but satisfying short gameplay (hit stops, screen shakes) -> game ends abruptly to leave them wanting more -> explicit CTA button pulses to drive the store click.

## 4. Required Asset List
*(Total: 9 Sprites, highly optimized for < 2MB footprint. 0 BGM, 0 SFX per user instruction - Audio is pending)*

**A. Tận dụng Game Art có sẵn:**
1. `SPR_Player_Idle.png` 
2. `FX_G02_Bullet_001.png`
3. `SPR_Block_Basic.png`
4. `SPR_Block_Metal.png` (Làm tường cản cuối cùng)
5. `SPR_Block_Moving.png` (Block di chuyển)
6. `SPR_Block_Explosive.png` (Block gây nổ lây lan)
7. `SPR_BG_Layer1.png`

**B. Art cần bổ sung (Sẽ Auto-gen theo DNA đồ họa của dự án):**
6. `UI_Icon_Tap.png` *(Bàn tay chỉ dẫn hướng dẫn người chơi bấm)*
7. `UI_Btn_CTA.png` *(Nút bấm Play Now rực rỡ)*
8. `UI_Panel_Backdrop.png` *(Lớp nền tối mờ lúc Game Over/Win)*
9. `UI_Title_Logo.png` *(Logo Flappy Trippy nhỏ để ở cuối màn hình CTA)*

**C. Các Asset được Code-Hóa (Zero File-size & Programmatic Juice):**
- **Player Animation**: Không dùng sprite bắn súng; thay vào đó dùng Tween code để thay đổi `rotation` (góc nghiêng) và `scaleY/scaleX` (Squash & Stretch) mỗi lần giật lùi.
- **VFX Particle**: Thay vì dùng ảnh PNG cho `VFX_Hit_Spark`, `VFX_Block_Break`, `VFX_Player_Death`, sẽ dùng `Phaser.GameObjects.Graphics` vẽ các primitive viền phát sáng (Hình vuông vỡ nát nhiều màu) bắn tung toé bằng Emitter physics.
- **Font Text**: Chuyển sang Web Fonts mặc định (Arial Black / Impact chữ nổi viền đen) thay vì Bitmap Font.

## 5. Next Steps
Phase 1 Complete. `Playable_GDD.md` updated with optimization tweaks. If approved, say 'Tiếp tục'.
