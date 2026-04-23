# UI Architecture: Flappy Trippy

Due to the "Zero-Friction" onboarding design, the traditional "Main Menu" screen does not exist. The application boots directly into the Gameplay loop.

#### A. Screen: Gameplay HUD (`UI_Screen_Gameplay`)
- **Layer:** Base UI Layer (Always active).
- **Contained Elements:**
  - `UI_Text_Score` (using `UI_Text_Font`): Top Center anchor. Displays current progression points.
  - `UI_Bar_Combo`: Top Center (under Score). Fills up to trigger Fever Mode.
  - `UI_Icon_Powerup`: Top Left. Displays current active power-up status.
  - `UI_Btn_Pause`: Top Right anchor. Action -> Freezes game, opens `UI_Popup_Pause`.
  - `UI_Btn_Booster`: Bottom Center anchor. Large, easily accessible area. Action -> Consumes booster to grant Player Shield.

#### B. Popup: Pause Menu (`UI_Popup_Pause`)
- **Layer:** Modal Overlay (Blocks gameplay input).
- **Background:** `UI_Panel_Backdrop` (Fullscreen semi-transparent dark tint).
- **Contained Elements:**
  - `UI_Text_Title` (using `UI_Text_Font`): Center top. Reads "PAUSED".
  - `UI_Btn_Resume`: Center anchor. Action -> Closes popup, resumes timescale.
  - `UI_Btn_Replay`: Center anchor (below Resume). Action -> Instantly resets `Play` state.

#### C. Popup: Game Over (`UI_Popup_GameOver`)
- **Layer:** Modal Overlay (Blocks gameplay input).
- **Background:** `UI_Panel_Backdrop` (Reused dark tint).
- **Contained Elements:**
  - `UI_Text_Title` (using `UI_Text_Font`): Center top. Reads "GAME OVER".
  - `UI_Btn_Replay`: Center anchor. Prominent button. Action -> Instantly resets `Play` state.

#### D. Overlay: Phase Alert (`UI_Overlay_PhaseAlert`)
- **Layer:** Top-most VFX Layer (Non-blocking, click-through).
- **Contained Elements:**
  - `UI_Flash_Warning` / `UI_Overlay_PhaseAlert`: Flashes screen edges red/yellow on Phase Up.
