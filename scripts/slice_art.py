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
OUTPUT.mkdir(parents=True, exist_ok=True)


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
        sprite.save(OUTPUT / f"{name}.webp", "WEBP", quality=86, method=4, exact=True)


extract(
    "campus-atlas-v2.png",
    ["campus", "library", "mercado", "hub", "cafe", "snack"],
)
extract("student-atlas-v2.png", [f"student-{index}" for index in range(1, 9)])
extract("merch-manager-atlas-v2.png", ["merch", "manager"])
