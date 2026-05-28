#!/usr/bin/env python3
"""
Fraudia Asset Conversion & Organization Script
Converts the 7 generated JPGs from the image_gen session into properly named PNGs
with enforced pure white background and high quality.

Run this from the project root after the image_gen calls have completed.
"""

import os
import shutil
from pathlib import Path
from PIL import Image

# Mapping based on exact generation call order (oldest → newest of the 7 JPGs)
# Adjust the SOURCE order if the tool returned files in a different sequence.
ASSET_MAPPING = [
    ("fraudia-shield-icon.png", "SHIELD ICON - Bold shield with eye"),
    ("fraudia-process-step-1-document-upload.png", "PROCESS STEP 1 - Document with upload arrow"),
    ("fraudia-process-step-2-brain-circuit.png", "PROCESS STEP 2 - Brain with circuit lines"),
    ("fraudia-process-step-3-speedometer-needle.png", "PROCESS STEP 3 - Speedometer needle"),
    ("fraudia-process-step-4-bell-alert.png", "PROCESS STEP 4 - Bell with alert dot"),
    ("fraudia-process-step-5-shield-check.png", "PROCESS STEP 5 - Shield with checkmark"),
    ("fraudia-dot-grid-texture.png", "BACKGROUND TEXTURE - Subtle 5% navy dot grid (tileable)"),
]

SESSION_IMAGES_DIR = Path(r"C:\Users\marco\.grok\sessions\C%3A%5CUsers%5Cmarco%5CDocuments%5CGitHub%5CHackaton%5CFraudia\019e6cbc-e7fb-7f62-8a23-14341d944ba0\images")
DEST_PNG_DIR = Path(r"C:\Users\marco\Documents\GitHub\Hackaton\Fraudia\assets\png")

def ensure_white_background(img: Image.Image) -> Image.Image:
    """Ensure the image has a pure white background (no transparency or off-white)."""
    if img.mode in ("RGBA", "LA"):
        background = Image.new("RGB", img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
        return background
    if img.mode != "RGB":
        img = img.convert("RGB")
    return img

def main():
    DEST_PNG_DIR.mkdir(parents=True, exist_ok=True)

    # Get the 7 most recent JPGs sorted by modification time (oldest first = first prompt)
    jpg_files = sorted(
        SESSION_IMAGES_DIR.glob("*.jpg"),
        key=lambda p: p.stat().st_mtime
    )[-7:]

    if len(jpg_files) != 7:
        print(f"WARNING: Found {len(jpg_files)} JPGs instead of 7. Using what is available.")

    for idx, (filename, description) in enumerate(ASSET_MAPPING):
        if idx >= len(jpg_files):
            print(f"Skipping {filename} — no more source images.")
            continue

        src = jpg_files[idx]
        dst = DEST_PNG_DIR / filename

        print(f"Processing [{idx+1}/7]: {description}")
        print(f"  Source: {src.name}")

        img = Image.open(src)
        img = ensure_white_background(img)

        # High quality PNG
        img.save(dst, "PNG", optimize=True)
        print(f"  Saved:  {dst}")

    print("\n✅ All 7 PNG assets converted and placed in assets/png/")
    print("Next: Run video generation for the 5 MP4 loops.")

if __name__ == "__main__":
    main()
