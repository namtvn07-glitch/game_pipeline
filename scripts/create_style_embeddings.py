import sys
import json
import os
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

def run():
    if len(sys.argv) < 2:
        print("Usage: python create_style_embeddings.py <style_directory>")
        sys.exit(1)
        
    style_dir = sys.argv[1]
    captions_path = os.path.join(style_dir, "captions.json")
    index_path = os.path.join(style_dir, "style_index.json")
    
    if not os.path.exists(captions_path):
        print(f"Error: {captions_path} not found.")
        sys.exit(1)
        
    with open(captions_path, 'r', encoding='utf-8') as f:
        captions = json.load(f)
        
    if not captions:
        print("No captions found.")
        sys.exit(0)
        
    print("Loading SentenceTransformer model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    texts_to_encode = [item['semantic_metadata'] for item in captions]
    embeddings = model.encode(texts_to_encode).tolist()
    
    for i, item in enumerate(captions):
        item['embedding'] = embeddings[i]
        item['is_archetype'] = False
        
    embeddings_np = np.array(embeddings)
    centroid = np.mean(embeddings_np, axis=0).reshape(1, -1)
    
    similarities = cosine_similarity(centroid, embeddings_np)[0]
    
    # closest 2 to centroid
    closest_indices = list(np.argsort(similarities)[-2:])
    
    for i, item in enumerate(captions):
        if "cartoon_6" in item["filename"]:
            closest_indices = [i] # Force cartoon_6 as the only archetype
            
    for idx in closest_indices:
        captions[idx]['is_archetype'] = True
        
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(captions, f, indent=2)
        
    print(f"Successfully embedded {len(captions)} chunks to {index_path}. Archetypes: {[captions[i]['filename'] for i in closest_indices]}")

if __name__ == "__main__":
    run()
