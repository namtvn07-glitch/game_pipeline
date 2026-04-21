# Game Art Configurator RAG Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `game-art-configurator` to an Active Knowledge Management Agent that uses RAG and Vectorization to structure global design rules and detect conflicts.

**Architecture:** We migrate `Global_Design_System.json` to `Global_DNA.md`. A new Python script embedded via `sentence-transformers` synchronizes the Markdown into a `global_index.json` vector database. The Configurator checks for conflicts against Style embeddings, and the Orchestrator retrieves from the global index via RAG instead of passing monolithic JSON text.

**Tech Stack:** Python, `sentence-transformers`, Markdown, JSON, Vector Search (Cosine Similarity).

---

### Task 1: Initialize Markdown-First Data Structure

**Files:**
- Create: `Assets/GameArtist/Global_DNA.md`
- Modify: `Assets/GameArtist/Global_Design_System.json` -> (Convert & Delete)

- [ ] **Step 1: Check existing JSON data**

Run: `cat Assets/GameArtist/Global_Design_System.json`
Expected: Outputs the legacy JSON rules.

- [ ] **Step 2: Create Global_DNA.md with legacy data**

```markdown
# I. GLOBAL LIGHTING
Flat or simple gradient lighting suitable for 2D parallax side-scrollers. Avoid heavy realistic volumetric shadows.

# II. BACKGROUND RULES
All generated isolated objects must sit on a pure #FFFFFF white or solid neutral gray background to easily key out.

# III. DIMENSION RULES
- **Icons**: Must occupy exactly 80% of the canvas framing, perfectly centered
- **Characters**: Full body visibility, drawn strictly from a side-view profile (facing right)
- **Obstacles**: Designed as vertical pillars expanding from top or bottom edges, with clear horizontal path gaps

# IV. PERSPECTIVE RULES
Strictly 2D side-profile (orthographic projection). Absolutely no 3D depth, isometric angles, or top-down perspective.

# V. RARITY COLOR CODES
- **Epic**: Purple, Magenta
- **Legendary**: Gold, Orange, Yellow
```
*(Use python or terminal to write this file)*

- [ ] **Step 3: Delete legacy JSON**

Run: `rm Assets/GameArtist/Global_Design_System.json`

- [ ] **Step 4: Commit Migration**

```bash
git add Assets/GameArtist/Global_DNA.md Assets/GameArtist/Global_Design_System.json
git commit -m "refactor: migrate Global_Design_System.json to Global_DNA.md"
```

### Task 2: Create Vectorization Script

**Files:**
- Create: `scripts/create_global_embeddings.py`

- [ ] **Step 1: Write the script**

```python
import sys
import json
import os
import re
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def chunk_markdown(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by headings
    sections = re.split(r'(?m)^#+\s+(.*)$', content)
    chunks = []
    
    if sections[0].strip() == '':
        sections = sections[1:]
        
    for i in range(0, len(sections), 2):
        if i + 1 < len(sections):
            heading = sections[i].strip()
            text = sections[i+1].strip()
            if text:
                chunks.append({"heading": heading, "text": text})
                
    return chunks

def run():
    dna_path = "Assets/GameArtist/Global_DNA.md"
    index_path = "Assets/GameArtist/global_index.json"
    
    if not os.path.exists(dna_path):
        print(f"Error: {dna_path} not found.")
        sys.exit(1)
        
    chunks = chunk_markdown(dna_path)
    if not chunks:
        print("No chunks found.")
        sys.exit(0)
        
    # Lazy load model
    print("Loading SentenceTransformer model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # Encode
    texts_to_encode = [f"{c['heading']}: {c['text']}" for c in chunks]
    embeddings = model.encode(texts_to_encode).tolist()
    
    for i, c in enumerate(chunks):
        c['embedding'] = embeddings[i]
        
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(chunks, f, indent=2)
        
    print(f"Successfully embedded {len(chunks)} chunks to {index_path}")

if __name__ == "__main__":
    run()
```

- [ ] **Step 2: Dry Run Script**

Run: `python scripts/create_global_embeddings.py`
Expected: Output showing successful embedding to `global_index.json`

- [ ] **Step 3: Commit Script**

```bash
git add scripts/create_global_embeddings.py Assets/GameArtist/global_index.json
git commit -m "feat: add global embedding script for design rules"
```

### Task 3: Update game-art-configurator SKILL.md

**Files:**
- Modify: `.agents/skills/game-art-configurator/SKILL.md`

- [ ] **Step 1: Update execution steps**

Update Steps 1-4 to reflect editing `Global_DNA.md`, running the python script, and executing Conflict Resolution via RAG. Remove JSON reconstruction steps.

- [ ] **Step 2: Commit Skill Update**

```bash
git add .agents/skills/game-art-configurator/SKILL.md
git commit -m "feat: update configurator workflow for RAG and Markdown"
```

### Task 4: Update game-art-orchestrator SKILL.md

**Files:**
- Modify: `.agents/skills/game-art-orchestrator/SKILL.md`

- [ ] **Step 1: Replace JSON Read with RAG Retrieval**

Update Phase 1 instructions so that the Orchestrator is instructed to query `global_index.json` using semantic search to retrieve only the top 2-3 most relevant rules based on the user's prompt, instead of reading the monolithic `Global_Design_System.json`.

- [ ] **Step 2: Commit Skill Update**

```bash
git add .agents/skills/game-art-orchestrator/SKILL.md
git commit -m "feat: switch orchestrator to use global RAG retrieval"
```
