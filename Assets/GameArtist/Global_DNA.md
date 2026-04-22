# I. GLOBAL LIGHTING
Flat or simple gradient lighting suitable for 2D parallax side-scrollers. Avoid heavy realistic volumetric shadows.

# II. BACKGROUND RULES
All generated isolated objects (Characters, Items, Obstacles, UI) MUST be generated with a perfectly transparent background. You must explicitly include the requirement for "transparent background" in your generation prompt.

# III. DIMENSION RULES
- **Icons**: Must occupy exactly 80% of the canvas framing, perfectly centered
- **Characters**: Full body visibility, drawn strictly from a side-view profile (facing right). Must visibly integrate a forward-facing weapon to support the core shoot-to-fly mechanic.
- **Obstacles**: Designed as modular, tileable blocks that stack vertically into pillars. Materials must distinctly communicate physical properties (e.g., glass for fragile, metal/plating for armored/indestructible).

# IV. PERSPECTIVE RULES
Strictly 2D side-profile (orthographic projection). Absolutely no 3D depth, isometric angles, or top-down perspective.

# V. RARITY COLOR CODES
- **Epic**: Purple, Magenta
- **Legendary**: Gold, Orange, Yellow

# VI. UI RULES
- **Overlays**: UI elements and popups must be designed as clean, lightweight overlays (semi-transparent backgrounds) to support zero-friction gameplay navigation without full screen reloads.

# VII. ART STYLE & AESTHETIC RULES
- **Linework**: Thick, bold black outlines defining all major shapes and characters to ensure high contrast and readability on small screens.
- **Coloring**: Bright, vibrant flat colors. Shading should be minimal (simple cel-shading) with almost no gradients or realistic textures.
- **Shapes & Proportions**: Cute, rounded, and expressive designs with highly stylized, exaggerated proportions (e.g., large eyes, soft edges) characteristic of casual 2D mobile games.
