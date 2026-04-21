# I. VISUAL DNA
- **Consistency Rules**: Every asset must maintain a uniform line weight (e.g. 2px to 4px relative stroke). No faded, soft, or fuzzy edges.
- **Shape Language**: Sharp, geometric intersections with clean continuous contours. High-contrast silhouettes readable against both light and dark backgrounds.
- **Color Script (Rarity)**:
  - *Common*: Monochromatic with single vibrant accent.
  - *Rare*: Dual-tone vibrant accents.
  - *Epic*: Full-color vector fills with neon/high-key highlight outlines.
- **Material Polish**: All surfaces must represent a matte, non-metallic vector finish. Smooth cel-shaded digital ink rendering without textured gradients.

# II. PRODUCT LOGIC
- **Readability (3-Second Rule)**: The core function/identity of the asset must be understood within 3 seconds at a thumbnail scale (64x64px). Clean negative space is mandatory.
- **Progression Logic (Level upgrades)**: Upgrading asset level increases detail density within the bounding box but never breaks the main external silhouette contour.
- **The Juice (Animation states)**: Include distinct vector groups/layers for idle, action, and reaction states. State transitions should be sharp (frame-by-frame style) to match line-art aesthetics.
- **UI Interaction Rules**: Interactive elements require a high-brightness stroke variation (e.g., pure white or neon accent outline) for the hover/active state.

# III. TECHNICAL EXCELLENCE
- **Mesh / Topology Rules**: For 3D translation or 2.5D, maintain explicit edge loops around designated black outlines. Polygon count should prioritize silhouette accuracy over interior volume.
- **Texel Density**: High resolution (min 1024x1024 or vector SVG preferred). No artifacting on the black ink lines when scaled up by 200%.
- **Modular Design / Recolor Limits**: Base geometries must separate "Ink" layers from "Color Fill" layers to support automated palette switching in-engine. Max 4 distinct recolor zones per asset.
