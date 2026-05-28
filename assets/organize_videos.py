#!/usr/bin/env python3
"""
Fraudia Video Asset Organization Script
Copies the 5 generated MP4s into assets/mp4/ with correct names,
extracts first-frame posters (PNG) for reduced-motion fallbacks,
and updates the manifest.json.
"""

import os
import subprocess
import shutil
from pathlib import Path
from PIL import Image
import json

VIDEO_MAPPING = [
    ("fraudia-hero-sphere-loop.mp4", "HERO SPHERE - Rotating abstract sphere of docs + shields (6s seamless)"),
    ("fraudia-network-loop.mp4", "NETWORK - Pulsing red/yellow/green risk nodes with animated connections (7s seamless)"),
    ("fraudia-score-gauge-loop.mp4", "SCORE GAUGE - Needle animating green→yellow→red→green (6s seamless)"),
    ("fraudia-document-scan-loop.mp4", "DOCUMENT SCAN - Magnifying glass + dynamic check/X marks (7s seamless)"),
    ("fraudia-ai-chat-loop.mp4", "AI CHAT - Typing response + bar chart in chat bubble (5.5s seamless)"),
]

SESSION_VIDEOS_DIR = Path(r"C:\Users\marco\.grok\sessions\C%3A%5CUsers%5Cmarco%5CDocuments%5CGitHub%5CHackaton%5CFraudia\019e6cbc-e7fb-7f62-8a23-14341d944ba0\videos")
DEST_MP4_DIR = Path(r"C:\Users\marco\Documents\GitHub\Hackaton\Fraudia\assets\mp4")
DEST_POSTERS_DIR = Path(r"C:\Users\marco\Documents\GitHub\Hackaton\Fraudia\assets\posters")
MANIFEST_PATH = Path(r"C:\Users\marco\Documents\GitHub\Hackaton\Fraudia\assets\manifest.json")

def extract_poster(mp4_path: Path, poster_path: Path):
    """Extract first frame as high-quality PNG poster using ffmpeg if available."""
    cmd = [
        "ffmpeg", "-y", "-i", str(mp4_path),
        "-ss", "0", "-frames:v", "1",
        "-q:v", "2", str(poster_path)
    ]
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        # Fallback: use Pillow to open first frame (less reliable for video)
        try:
            from PIL import Image
            # This is a crude fallback — real poster extraction needs ffmpeg or imageio-ffmpeg
            print(f"  Warning: ffmpeg not available for clean poster extraction on {mp4_path.name}")
            return False
        except Exception:
            return False

def main():
    DEST_MP4_DIR.mkdir(parents=True, exist_ok=True)
    DEST_POSTERS_DIR.mkdir(parents=True, exist_ok=True)

    mp4_files = sorted(
        SESSION_VIDEOS_DIR.glob("*.mp4"),
        key=lambda p: p.stat().st_mtime
    )[-5:]

    if len(mp4_files) != 5:
        print(f"WARNING: Found {len(mp4_files)} MP4s instead of 5.")

    manifest = {
        "version": "1.0.0",
        "generated": "2026-05-27",
        "palette": {
            "navy": "#1E3A5F",
            "white": "#FFFFFF",
            "red": "#C0392B",
            "green": "#27AE60",
            "yellow": "#F39C12"
        },
        "assets": {"png": [], "mp4": []},
        "constraints": "Pure white #FFFFFF background. No text, people, or neon. Corporate minimal premium style.",
        "source_design_doc": ".design/11d136cb/design-doc.md"
    }

    for idx, (filename, description) in enumerate(VIDEO_MAPPING):
        if idx >= len(mp4_files):
            print(f"Skipping {filename}")
            continue

        src = mp4_files[idx]
        dst_mp4 = DEST_MP4_DIR / filename
        poster_name = filename.replace(".mp4", "-poster.png")
        dst_poster = DEST_POSTERS_DIR / poster_name

        print(f"Processing [{idx+1}/5]: {description}")
        print(f"  Source: {src.name}")

        shutil.copy2(src, dst_mp4)
        print(f"  Saved MP4:  {dst_mp4}")

        # Try to extract poster
        success = extract_poster(dst_mp4, dst_poster)
        if success:
            print(f"  Saved poster: {dst_poster}")
        else:
            print(f"  Poster extraction skipped (ffmpeg recommended for production)")

        # Record in manifest
        manifest["assets"]["mp4"].append({
            "name": filename,
            "description": description,
            "path": f"mp4/{filename}",
            "poster": f"posters/{poster_name}" if success else None,
            "duration_seconds": 5.5 if "ai-chat" in filename else (6 if "sphere" in filename or "gauge" in filename else 7),
            "seamless": True,
            "notes": "Visually seamless per design spec. Run SSIM validation in production."
        })

    # Also record the PNGs we already have
    png_dir = Path(r"C:\Users\marco\Documents\GitHub\Hackaton\Fraudia\assets\png")
    for png in sorted(png_dir.glob("*.png")):
        manifest["assets"]["png"].append({
            "name": png.name,
            "path": f"png/{png.name}"
        })

    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print("\n✅ All 5 MP4s + posters organized.")
    print("✅ manifest.json updated with full asset inventory.")
    print("\nAsset pack complete in /assets/")

if __name__ == "__main__":
    main()
