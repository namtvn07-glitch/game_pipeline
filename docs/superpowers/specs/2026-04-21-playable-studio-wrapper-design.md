# Playable Studio Integration Wrapper Design

## Overview
Playable Studio has been re-architected from a standalone game generator into an "Integration Wrapper". It receives a fully completed game project (Documentation and Assets) as its input, and distills it into a high-performance, single-file HTML5 Playable Ad using Phaser 3. 

The entire process is fully automated to enforce strict System Architecture guidelines (Under 3MB, single monolithic file, Base64 texture and audio encoding) while extracting only what is needed from the main game's directory.

## Core Transformation
- **Old Role:** Game Idea -> Generate Assets via nano-banana -> Dev Phaser 3 Game.
- **New Role:** Read Completed Game -> Distill Playable GDD -> Harvest & Optimize Existing Assets (Images + SFX) -> Dev Phaser 3 Game -> Package.

## The 4-Phase Architecture

### Phase 1: Ingest & Playable GDD Synthesis
- **Input:** Path to a source Game Project Directory containing a primary `GDD.md` and original game assets (`_Art_Assets.json`, `_Audio_Assets.json`, etc.).
- **Action:** Read the source GDD to understand the core game loop, character, and UI. Synthesize a new, aggressively distilled `Playable_GDD.md`.
- **Logic:** The playable ad will focus exclusively on a 15-20 second "Hook", a hyper-simple Win/Lose condition, and an explicit Call-To-Action (CTA) ending prompt. Complex narratives, meta-progression, or heavy physics mechanics from the source game are stripped out.

### Phase 2: Asset Harvesting & SFX Optimization
- **Input:** The required assets listed in `Playable_GDD.md`.
- **Action:** The system will locate these specific files within the source game's directories (e.g., `Sprites/`, `Audio/`).
- **Processing:** Copy the files to the Playable Ad's local `assets/` directory. Run an automated Python Optimizer script.
- **Optimization:** 
  - Images are compressed and converted to WebP (`.webp`) to strip trailing whitespace.
  - Audio files (SFX) are compressed to low-bitrate `.ogg` or `.mp3` formats.
  - This ensures the ad's rich multimedia payload stays well beneath the strict 3MB ad-network limit.

### Phase 3: DEV (Phaser 3 Engineering)
- **Input:** `Playable_GDD.md` + Local Optimized `assets/`.
- **Action:** Generate the main game logic inside `index.html`.
- **Structure:**
  - `BootScene`: Uses Phaser 3 to aggressively load textures and audio natively through base64 injection, skipping standard HTTP requests which fail on isolated ad networks. (`this.textures.addBase64`, handling Data-URIs for sounds).
  - `PlayScene`: Executes the core mechanic distilled in Phase 1, utilizing the SFX triggers for feedback.
  - `EndScene`: Locks gameplay and renders the CTA overlay.

### Phase 4: Packaging (Monolithic Build)
- **Input:** The `index.html` file and local `assets/`.
- **Action:** Execute `packager.py`.
- **Logic:** The packager uses Regex injection to scrape the Base64 strings of all WebP images and optimized sounds, splicing them directly into the HTML payload. Outputs the final, single-file Ad to `build/index.html`.
- **Validation:** Enforces the absolute <3MB filesize policy. The process completes only if the package size passes the check.

## Technical Constraints & Error Handling
- Remove out-of-date and inaccurate hardcoded IDE-specific absolute paths (e.g., `e:\_Project_2026\Test\...`). Path resolution must be handled relative to the active workspace to prevent broken logic on different environments.
- Enforce that the dev environment cleanly handles Base64 data injection for both visual and audio entities with seamless async playback.
