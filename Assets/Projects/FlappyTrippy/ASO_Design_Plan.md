# ASO Design Plan: Flappy Trippy

**ProjectFolder**: FlappyTrippy
**Core Vibe**: Hybrid-Casual Shoot-to-fly Endless Runner. High-tension, fast-paced but cute ("trippy") aesthetic. Focus on proactive defense rather than passive evasion.
**Global Camera & Environment Prefix**: 2D orthographic side-scroller, deep starry space/dark purple background providing high-visibility contrast.
**Art Style**: flappytrippy (Soft, rounded silhouettes, kawaii/plump proportions, vibrant neon primary colors against dark backgrounds, high-gloss specularity, premium plastic vinyl toy aesthetic).

---

## Asset Dimensions
- **Icon**: 512x512
- **Feature Graphic (Key Art Anchor)**: 1024x500
- **Screenshots 1-5**: 900x1600 (Portrait format, optimized for mobile vertical swiping/tapping).

## CRITICAL RULES
- **Tool Mandate**: ALL structural sketches MUST be generated using the internal `generate_image` tool using Bounding Box layout and Character Anchors.
- **No Text**: NO TEXT or typography should be hallucinated in any generated image.
- **Key Art Anchor**: The Feature Graphic (1024x500) will be generated FIRST and isolated in Phase 2 as the absolute Anchor to establish the frame and visual rules for the rest of the assets.

---

## Player Journey (Sequential Screen Narrative)
*The 5 screenshots follow a sequential gameplay narrative demonstrating the core loop:*

1. **Screenshot 1 - The Launch (Shoot-to-Fly)**
   Trippybara floating in the dark starry background, shooting a glowing projectile straight ahead to propel itself. Introduces the character and the core movement mechanic.
2. **Screenshot 2 - The Blockade (Basic & Moving Blocks)**
   Encountering a colorful wall of chunky, retro-beveled blocks. Trippybara is actively destroying a pathway through them.
3. **Screenshot 3 - Tactical Threat (Explosive & Armor Blocks)**
   Navigating a highly dangerous gap featuring a glowing red Explosive Block and metallic Armor Blocks. Showcases the need for precise timing and the "diminishing recoil" hovering tactic.
4. **Screenshot 4 - Fever Mode (Ultimate Power)**
   A massive blast of multi-directional lasers breaking through the obstacles. Trippybara is glowing with emissive energy (Shield/Fever state), automatically collecting glowing powerups.
5. **Screenshot 5 - Phase Up! (Milestone)**
   Trippybara flying victorious past a destroyed "Warning Wall", with the background shifting to a more intense, vibrant hue to indicate a new speed level phase.

---

## English Generation Prompts (Static Lockdown)
*These prompts will be injected into Phase 2 for Sketching and later Phase 3 for VLM Semantic Translation.*

**Global Base Prompt:**
`A 2D orthographic side-scroller game scene. Premium plastic vinyl toy aesthetic, high-gloss specularity, soft gradients. Extremely vibrant neon colors against a dark starry space background. Soft, rounded, and chubby silhouettes with kawaii proportions. Clean edges, no text.`

**Icon Prompt (512x512):**
`A classic App Store Icon design inside a perfectly symmetrical box. Premium plastic vinyl toy aesthetic, high-gloss specularity, soft gradients. Extremely vibrant neon colors against a dark starry space background. Soft, rounded, and chubby silhouettes with kawaii proportions. A massive dynamic close-up portrait (head and shoulders) of a chubby capybara-like character (Trippybara) jumping. The character fills the 1:1 square icon frame perfectly and pops out with dynamic rim lighting. CRITICAL: If the image has a background border or frame, ALL FOUR corners MUST be equally rounded. Do NOT make the top rounded and bottom sharp. EXACTLY match the lighting, aesthetic, and neon colors of the reference screenshot (SS1) provided. Clean edges. Striking composition. ABSOLUTELY NO TEXT. NO TYPOGRAPHY. NO LOGOS. NO UI.`

**Anchor Prompt (Feature Graphic 1024x500):**
`[Global Base Prompt] A wide cinematic composition showing a chubby capybara-like character (Trippybara) shooting a glowing projectile to fly through a retro-beveled colorful block obstacle course. Dynamic action, high contrast.`

**Screenshot 1-5 Prompts (900x1600):**
- **SS1**: `[Global Base Prompt] Trippybara character taking off, shooting a glowing projectile forward in an empty dark space with stars.`
- **SS2**: `[Global Base Prompt] Trippybara shooting at a wall of bright, chunky, rounded blocks (yellow, cyan).`
- **SS3**: `[Global Base Prompt] Trippybara dodging a glowing red explosive block and dark metallic blocks in a tight gap.`
- **SS4**: `[Global Base Prompt] Trippybara radiating emissive energy, shooting a massive laser beam that shatters multiple obstacles.`
- **SS5**: `[Global Base Prompt] Trippybara flying past a broken heavy wall, the background shifting to a vibrant hot pink/purple galaxy.`
