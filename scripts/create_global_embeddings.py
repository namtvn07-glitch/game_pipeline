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
    
    if len(sections) > 0 and sections[0].strip() == '':
        sections = sections[1:]
        
    for i in range(0, len(sections), 2):
        if i + 1 < len(sections):
            heading = sections[i].strip()
            text = sections[i+1].strip()
            if text:
                chunks.append({"heading": heading, "text": text})
                
    return chunks

def resolve_conflicts(new_chunks, new_embeddings):
    # This checks newly embedded global rules against style indexes
    base_dir = "Assets/GameArtist/StyleLibrary"
    if not os.path.exists(base_dir):
        return
        
    print("\n[Conflict Resolution] Checking for semantic conflicts against Local Styles...")
    for style_name in os.listdir(base_dir):
        style_path = os.path.join(base_dir, style_name)
        if not os.path.isdir(style_path):
            continue
            
        style_index_path = os.path.join(style_path, "style_index.json")
        if not os.path.exists(style_index_path):
            continue
            
        with open(style_index_path, 'r', encoding='utf-8') as f:
            style_data = json.load(f)
            
        if not style_data:
            continue
            
        # Extract embeddings if they exist (depending on the structure of style_index.json)
        # Assuming style_index.json has [{"embedding": [...]}]
        style_embeddings = []
        valid_style_items = []
        for item in style_data:
            if "embedding" in item:
                style_embeddings.append(item["embedding"])
                valid_style_items.append(item)
                
        if not style_embeddings:
            continue
            
        style_embeddings_np = np.array(style_embeddings)
        new_embeddings_np = np.array(new_embeddings)
        
        similarities = cosine_similarity(new_embeddings_np, style_embeddings_np)
        
        for i, new_chunk in enumerate(new_chunks):
            # Check for high similarity with possible conflicting nature
            # Actually, just flagging high similarity items for structural review
            max_sim = np.max(similarities[i])
            if max_sim > 0.85:
                closest_idx = np.argmax(similarities[i])
                closest_item = valid_style_items[closest_idx]
                print(f"[WARNING] Global rule '{new_chunk['heading']}' has {max_sim:.2f} similarity with Local Style '{style_name}'.")
                print(f"   -> Please review to ensure there are no contradictory directives.")

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
    
    # Run conflict resolution
    resolve_conflicts(chunks, embeddings)

if __name__ == "__main__":
    run()
