# FlappyTrippy Final ASO Polish Prompts

This document combines the approved Sketches with their hyper-detailed Polishing Prompts. These prompts include the mandatory logic to enforce a 1:1 square canvas while maintaining the target aspect ratio in the generation tools.

## Global Design Rules
- **Aesthetic**: Premium plastic vinyl toy aesthetic, high-gloss specularity, soft gradients. Extremely vibrant neon colors against a dark starry space background. Soft, rounded, and chubby silhouettes with kawaii proportions. Clean edges.
- **Constraints**: 100% NO TEXT, NO UI, NO FONTS, NO WORDS.
- **Aspect Ratio Constraint (CRITICAL)**: Because the generator forces a 1:1 aspect ratio, YOU MUST naturally compose the central content within a specified inner bounding box (e.g. 1024x500 or 900x1600 ratio), and leave the remaining unused canvas areas (padding) as completely TRANSPARENT background. (Note: App Store Icon is naturally 1:1, so it does not need bounding box padding).

---

## 0. App Store Icon
**Target Aspect Ratio**: 512x512 (1:1 Square)
**Reference Sketch**: `Assets/GameArtist/Generated/ASO_Projects/FlappyTrippy/Sketches/Icon_Sketch.png`
**Polishing Prompt**:
> `A classic App Store Icon design inside a perfectly symmetrical box. Premium plastic vinyl toy aesthetic, high-gloss specularity, soft gradients. Extremely vibrant neon colors against a dark starry space background. Soft, rounded, and chubby silhouettes with kawaii proportions. A massive dynamic close-up portrait (head and shoulders) of a chubby capybara-like character (Trippybara) jumping. The character fills the 1:1 square icon frame perfectly and pops out with dynamic rim lighting. CRITICAL: If the image has a background border or frame, ALL FOUR corners MUST be equally rounded. Do NOT make the top rounded and bottom sharp. EXACTLY match the lighting, aesthetic, and neon colors of the reference screenshot (SS1) provided. Clean edges. Striking composition. ABSOLUTELY NO TEXT. NO TYPOGRAPHY. NO LOGOS. NO UI.`

---

## 1. Feature Graphic (Key Art Anchor)
**Target Aspect Ratio**: 1024x500 (Landscape)
**Reference Sketch**: `Assets/GameArtist/Generated/ASO_Projects/FlappyTrippy/Sketches/Feature_Graphic_Sketch.png`
**Polishing Prompt**:
> `A 2D orthographic side-scroller game scene. Premium plastic vinyl toy aesthetic, high-gloss specularity, soft gradients. Extremely vibrant neon colors against a dark starry space background. Soft, rounded, and chubby silhouettes with kawaii proportions. A wide cinematic composition showing a chubby capybara-like character (Trippybara) shooting a glowing projectile to fly through a retro-beveled colorful block obstacle course. Dynamic action, high contrast. CRITICAL: The actual content MUST be scaled down and composed tightly within a 1024x500 wide landscape bounding box at the center. The remaining vertical padding areas covering the top and bottom of the final 1:1 square canvas MUST be left transparent. ABSOLUTELY NO TEXT.`

---

## 2. Screenshot 1 - The Launch
**Target Aspect Ratio**: 900x1600 (Portrait)
**Reference Sketch**: `Assets/GameArtist/Generated/ASO_Projects/FlappyTrippy/Sketches/SS1_Sketch.png`
**Polishing Prompt**:
> `A 2D orthographic side-scroller game scene. Premium plastic vinyl toy aesthetic, high-gloss specularity, soft gradients. Extremely vibrant neon colors against a dark starry space background. Soft, rounded, and chubby silhouettes with kawaii proportions. Trippybara character taking off, shooting a glowing projectile forward in an empty dark space with stars. CRITICAL: Scale the content down to fit inside a vertical 900x1600 portrait bounding box centered in the frame. The remaining horizontal padding on the left and right sides of the 1:1 square canvas MUST be left transparent. ABSOLUTELY NO TEXT.`

---

## 3. Screenshot 2 - The Blockade
**Target Aspect Ratio**: 900x1600 (Portrait)
**Reference Sketch**: `Assets/GameArtist/Generated/ASO_Projects/FlappyTrippy/Sketches/SS2_Sketch.png`
**Polishing Prompt**:
> `A 2D orthographic side-scroller game scene. Premium plastic vinyl toy aesthetic, high-gloss specularity, soft gradients. Extremely vibrant neon colors against a dark starry space background. Soft, rounded, and chubby silhouettes with kawaii proportions. Trippybara shooting at a wall of bright, chunky, rounded blocks (yellow, cyan). CRITICAL: Scale the content down to fit inside a vertical 900x1600 portrait bounding box centered in the frame. The remaining horizontal left and right padding of the 1:1 square canvas MUST be left transparent. ABSOLUTELY NO TEXT.`

---

## 4. Screenshot 3 - Tactical Threat
**Target Aspect Ratio**: 900x1600 (Portrait)
**Reference Sketch**: `Assets/GameArtist/Generated/ASO_Projects/FlappyTrippy/Sketches/SS3_Sketch.png`
**Polishing Prompt**:
> `A 2D orthographic side-scroller game scene. Premium plastic vinyl toy aesthetic, high-gloss specularity, soft gradients. Extremely vibrant neon colors against a dark starry space background. Soft, rounded, and chubby silhouettes with kawaii proportions. Trippybara dodging a glowing red explosive block and dark metallic blocks in a tight gap. CRITICAL: Scale the content down to fit inside a vertical 900x1600 portrait bounding box centered in the frame. The remaining horizontal left and right padding of the 1:1 square canvas MUST be left transparent. ABSOLUTELY NO TEXT.`

---

## 5. Screenshot 4 - Fever Mode
**Target Aspect Ratio**: 900x1600 (Portrait)
**Reference Sketch**: `Assets/GameArtist/Generated/ASO_Projects/FlappyTrippy/Sketches/SS4_Sketch.png`
**Polishing Prompt**:
> `A 2D orthographic side-scroller game scene. Premium plastic vinyl toy aesthetic, high-gloss specularity, soft gradients. Extremely vibrant neon colors against a dark starry space background. Soft, rounded, and chubby silhouettes with kawaii proportions. Trippybara radiating emissive energy, shooting a massive laser beam that shatters multiple obstacles. CRITICAL: Scale the content down to fit inside a vertical 900x1600 portrait bounding box centered in the frame. The remaining horizontal left and right padding of the 1:1 square canvas MUST be left transparent. ABSOLUTELY NO TEXT.`

---

## 6. Screenshot 5 - Phase Up!
**Target Aspect Ratio**: 900x1600 (Portrait)
**Reference Sketch**: `Assets/GameArtist/Generated/ASO_Projects/FlappyTrippy/Sketches/SS5_Sketch.png`
**Polishing Prompt**:
> `A 2D orthographic side-scroller game scene. Premium plastic vinyl toy aesthetic, high-gloss specularity, soft gradients. Extremely vibrant neon colors against a dark starry space background. Soft, rounded, and chubby silhouettes with kawaii proportions. Trippybara flying past a broken heavy wall, the background shifting to a vibrant hot pink/purple galaxy. CRITICAL: Scale the content down to fit inside a vertical 900x1600 portrait bounding box centered in the frame. The remaining horizontal left and right padding of the 1:1 square canvas MUST be left transparent. ABSOLUTELY NO TEXT.`
