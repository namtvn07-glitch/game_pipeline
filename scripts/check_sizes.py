from PIL import Image
import os
files = [f for f in os.listdir('e:\\_Project_2026\\GamePipeline\\game_pipeline\\Assets\\PlayableGameStudio\\Projects\\FlappyTrippy\\assets') if f.endswith('.webp')]
for file in files:
    img = Image.open(f'e:\\_Project_2026\\GamePipeline\\game_pipeline\\Assets\\PlayableGameStudio\\Projects\\FlappyTrippy\\assets\\{file}')
    print(f'{file}: {img.size}')
