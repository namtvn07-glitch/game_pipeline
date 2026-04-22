from PIL import Image

src = r"e:\_Project_2026\GamePipeline\game_pipeline\Assets\Projects\FlappyTrippy\GameAssets\cartoon\Characters\spr_trippybara_idle_2026-04-22.png"
dst = r"e:\_Project_2026\GamePipeline\game_pipeline\Assets\PlayableGameStudio\Projects\FlappyTrippy\assets\SPR_Trippybara_Idle.webp"

img = Image.open(src).convert("RGBA")
# Maintain the same 512 max size logic to keep it lightweight but skip rembg
img.thumbnail((512, 512), Image.Resampling.LANCZOS)
img.save(dst, "webp", quality=85)
print("Image replaced successfully!")
