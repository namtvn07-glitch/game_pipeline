from PIL import Image

src = r"e:\_Project_2026\GamePipeline\game_pipeline\Assets\Projects\FlappyTrippy\GameAssets\cartoon\Environments\spr_bg_layer1_2026-04-22.png"
dst = r"e:\_Project_2026\GamePipeline\game_pipeline\Assets\PlayableGameStudio\Projects\FlappyTrippy\assets\SPR_BG_Layer1.webp"

img = Image.open(src).convert("RGB")
# Scale it down slightly but keep it a background (e.g., 540x960) to fit <3MB budget easily
img.thumbnail((540, 960), Image.Resampling.LANCZOS)
img.save(dst, "webp", quality=85)
print("BG fixed!")
