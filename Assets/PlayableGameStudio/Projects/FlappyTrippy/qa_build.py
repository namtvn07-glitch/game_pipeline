import json, base64, os

project_dir = r"e:\_Project_2026\GamePipeline\game_pipeline\Assets\PlayableGameStudio\Projects\FlappyTrippy"
with open(r"e:\_Project_2026\GamePipeline\game_pipeline\.agents\skills\game-playable-orchestrator\templates\phaser_base.html", "r", encoding="utf-8") as f:
    html = f.read()

with open(f"{project_dir}\\logic_hook.js", "r", encoding="utf-8") as f:
    logic = f.read()

with open(f"{project_dir}\\assets_manifest.json", "r", encoding="utf-8") as f:
    manifest = json.load(f)

out_manifest = {"images": {}, "audio": {}}
for k, rel_path in manifest["images"].items():
    full_path = os.path.join(project_dir, rel_path.split("/")[-1]) if "/" not in rel_path else os.path.join(project_dir, rel_path)
    if os.path.exists(full_path):
        with open(full_path, "rb") as img:
            b64 = base64.b64encode(img.read()).decode("utf-8")
            out_manifest["images"][k] = f"data:image/webp;base64,{b64}"

inject_manifest = "<script id=\"assets_manifest\">window.ASSETS_MANIFEST = " + json.dumps(out_manifest) + ";</script>"
inject_logic = "<script id=\"logic_hook\">\n" + logic + "\n</script>"

# Replace by tag id blocks
import re
html = re.sub(r'<script id="assets_manifest">.*?</script>', inject_manifest, html, flags=re.DOTALL)
html = re.sub(r'<script id="logic_hook">.*?</script>', inject_logic, html, flags=re.DOTALL)

with open(f"{project_dir}\\index_QA.html", "w", encoding="utf-8") as f:
    f.write(html)
