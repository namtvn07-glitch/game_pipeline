# Phase 3: DEV (Phaser 3 Engineering)

**Your Role**: Ads Technical Director

## Instructions
1. **Directory Discovery**: Use `list_dir` on the local `assets/` folder to capture exact names of `.webp` and audio files.
2. **Engine Architecture (Logic Injection)**: DO NOT write `index.html` or `BootScene`. The system uses a strict boilerplate template. You must only generate two files in the project root:
   - `assets_manifest.json`: Map keys to their relative file paths so the Python packager knows what to encode. Format: `{"images": {"key": "assets/file.webp"}, "audio": {"key": "assets/file.ogg"}}`
   - `logic_hook.js`: Code the Phaser 3 logic. Expose two global classes: `class PlayScene extends Phaser.Scene {}` and `class EndScene extends Phaser.Scene {}`. Do not write initialization logic.
3. **Headless QA Subagent (Automated Check)**: Serve the project directory locally on port 8000 using Python (`python -m http.server 8000`). Once running, invoke the `browser_subagent` tool. Instruct the subagent to: 
   - Navigate to `http://localhost:8000/.agents/skills/game-playable-orchestrator/templates/phaser_base.html` (or merged equivalent if built locally). 
   - Wait 5 seconds.
   - Check the Dev Console for any JavaScript or Phaser errors.
4. **Phase Completion**: State: *"Phase 3 Complete. The Logic Component and Manifest are written. QA automated scan passed. Say 'Tiếp tục' for base64 injection packaging."*
