import os
import glob

search_dir = r"e:\_Project_2026\GamePipeline\game_pipeline\Assets\Projects\FlappyTrippy"
matches = glob.glob(search_dir + "/**/spr_trippybara_idle*.png", recursive=True)
for match in matches:
    print(match)
