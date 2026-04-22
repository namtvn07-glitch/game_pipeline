import os
from PIL import Image
from rembg import remove

src = r"e:\_Project_2026\GamePipeline\game_pipeline\Assets\Projects\FlappyTrippy\GameAssets\cartoon\Characters\spr_trippybara_idle_2026-04-22.png"
dst = r"e:\_Project_2026\GamePipeline\game_pipeline\Assets\PlayableGameStudio\Projects\FlappyTrippy\assets\SPR_Trippybara_Idle.webp"
max_size = 512

img = Image.open(src)
# remove bg
img = remove(img)
# crop
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)
# resize
if img.width > max_size or img.height > max_size:
    img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
# save
img.save(dst, "webp", quality=85)
print("Asset Replaced!")
