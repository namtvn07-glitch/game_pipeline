import json
import base64
import os

project_dir = r'e:\_Project_2026\GamePipeline\game_pipeline\Assets\PlayableGameStudio\Projects\FlappyTrippy'
template_file = r'e:\_Project_2026\GamePipeline\game_pipeline\.agents\skills\game-playable-orchestrator\templates\phaser_base.html'
manifest_file = os.path.join(project_dir, 'assets_manifest.json')
logic_file = os.path.join(project_dir, 'logic_hook.js')
output_file = os.path.join(project_dir, 'index_local_test.html')

with open(template_file, 'r', encoding='utf-8') as f:
    html = f.read()

with open(logic_file, 'r', encoding='utf-8') as f:
    logic = f.read()

with open(manifest_file, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

# Convert mapped paths to Base64 data URIs
resolved_manifest = {'images': {}, 'audio': {}}
base_path = r'e:\_Project_2026\GamePipeline\game_pipeline\Assets\PlayableGameStudio\Projects\FlappyTrippy'

if 'images' in manifest:
    for key, rel_path in manifest['images'].items():
        full_path = os.path.join(base_path, rel_path.replace('/', '\\'))
        with open(full_path, 'rb') as img:
            b64 = base64.b64encode(img.read()).decode('utf-8')
        resolved_manifest['images'][key] = "data:image/webp;base64," + b64

manifest_js = f"window.ASSETS_MANIFEST = {json.dumps(resolved_manifest)};"

# Injection
html = html.replace('// The packager will inject window.ASSETS_MANIFEST = { images: {...}, audio: {...} } here.', manifest_js)
html = html.replace('// The packager will inject the Logic_Component.js containing class PlayScene and class EndScene here.', logic)

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(html)
print('Generated index_local_test.html')
