import os
import subprocess

def test_script_exists():
    script_path = ".agents/skills/game-art-orchestrator/scripts/retrieve_orchestrator_context.py"
    if not os.path.exists(script_path):
        print(f"FAIL: {script_path} does not exist.")
        exit(1)
    print("PASS")

if __name__ == "__main__":
    test_script_exists()
