"""Extract isolated sprites from generated transparent atlases.

The image model lays objects out consistently but does not guarantee strict cell
boundaries. Connected-component extraction prevents adjacent sprites from
bleeding into one another at runtime.
"""

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "dist" / "assets"
SOURCE = ROOT / "art-source"
OUTPUT = ASSETS / "v3"
EXTRACTED = SOURCE / "sprites-v3"
OUTPUT.mkdir(parents=True, exist_ok=True)
EXTRACTED.mkdir(parents=True, exist_ok=True)


def components(image: Image.Image, expected: int, downsample: int = 3):
    alpha = np.asarray(image.getchannel("A"))[::downsample, ::downsample]
    mask = alpha > 35
    height, width = mask.shape
    labels = np.zeros((height, width), dtype=np.uint16)
    found = []
    label = 0

    for y in range(height):
        for x in range(width):
            if not mask[y, x] or labels[y, x]:
                continue
            label += 1
            labels[y, x] = label
            queue = deque([(y, x)])
            min_x = max_x = x
            min_y = max_y = y
            area = 0
            while queue:
                py, px = queue.popleft()
                area += 1
                min_x, max_x = min(min_x, px), max(max_x, px)
                min_y, max_y = min(min_y, py), max(max_y, py)
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        ny, nx = py + dy, px + dx
                        if (
                            (dx or dy)
                            and 0 <= ny < height
                            and 0 <= nx < width
                            and mask[ny, nx]
                            and not labels[ny, nx]
                        ):
                            labels[ny, nx] = label
                            queue.append((ny, nx))
            if area > 200:
                found.append(
                    {
                        "label": label,
                        "area": area,
                        "bbox": (
                            min_x * downsample,
                            min_y * downsample,
                            min(image.width, (max_x + 1) * downsample),
                            min(image.height, (max_y + 1) * downsample),
                        ),
                    }
                )

    found = sorted(found, key=lambda item: item["area"], reverse=True)[:expected]
    if len(found) != expected:
        raise RuntimeError(f"Expected {expected} sprites, found {len(found)}")
    found.sort(key=lambda item: ((item["bbox"][1] + item["bbox"][3]) // 350, item["bbox"][0]))

    label_image = Image.fromarray(labels).resize(image.size, Image.Resampling.NEAREST)
    label_pixels = np.asarray(label_image)
    return found, label_pixels


def extract(source: str, names: list[str]):
    image = Image.open(SOURCE / source).convert("RGBA")
    found, labels = components(image, len(names))
    pixels = np.asarray(image).copy()
    sprites = {}

    for item, name in zip(found, names):
        x0, y0, x1, y1 = item["bbox"]
        pad = 10
        x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
        x1, y1 = min(image.width, x1 + pad), min(image.height, y1 + pad)
        component = Image.fromarray((labels == item["label"]).astype(np.uint8) * 255)
        component = component.filter(ImageFilter.MaxFilter(9))
        isolated = pixels.copy()
        isolated[:, :, 3] = np.minimum(isolated[:, :, 3], np.asarray(component))
        sprite = Image.fromarray(isolated[y0:y1, x0:x1], mode="RGBA")
        sprite.save(EXTRACTED / f"{name}.webp", "WEBP", quality=88, method=4, exact=True)
        sprites[name] = sprite
    return sprites


def pack(sprites, names, columns, cell_width, cell_height, filename):
    rows = (len(names) + columns - 1) // columns
    sheet = Image.new("RGBA", (columns * cell_width, rows * cell_height), (0, 0, 0, 0))
    for index, name in enumerate(names):
        sprite = sprites[name]
        scale = min((cell_width - 16) / sprite.width, (cell_height - 12) / sprite.height)
        size = (max(1, round(sprite.width * scale)), max(1, round(sprite.height * scale)))
        resized = sprite.resize(size, Image.Resampling.LANCZOS)
        column, row = index % columns, index // columns
        x = column * cell_width + (cell_width - resized.width) // 2
        y = (row + 1) * cell_height - resized.height - 5
        sheet.alpha_composite(resized, (x, y))
    sheet.save(OUTPUT / filename, "WEBP", quality=88, method=5, exact=True)


building_names = ["campus", "library", "mercado", "hub", "cafe", "snack"]
buildings = extract(
    "campus-atlas-v2.png",
    building_names,
)
student_names = [f"student-{index}" for index in range(1, 9)]
students = extract("student-atlas-v2.png", student_names)
feature_names = ["merch", "manager"]
features = extract("merch-manager-atlas-v2.png", feature_names)

pack(buildings, building_names, 3, 400, 320, "buildings.webp")
pack(students, student_names, 4, 128, 180, "characters.webp")
pack(features, feature_names, 2, 500, 420, "features.webp")
