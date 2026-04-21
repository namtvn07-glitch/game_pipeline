import sys
from rembg import remove
from PIL import Image

def remove_background(input_path):
    print(f"Processing: {input_path}")
    input_image = Image.open(input_path)
    output_image = remove(input_image)
    output_image.save(input_path, "PNG")
    print(f"Background removed and saved: {input_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python remove_bg.py <image_path...>")
        sys.exit(1)
        
    for path in sys.argv[1:]:
        remove_background(path)
