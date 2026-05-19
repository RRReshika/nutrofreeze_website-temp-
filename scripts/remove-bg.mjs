/**
 * Batch white-background remover for NutroFreeze WB product images (jimp v4).
 * Corner flood-fill to find background, then removes with feathered edges.
 * Output: public/images/packets-nobg/<slug>.png
 */
import { Jimp } from "jimp";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// All WB front images to process
const SOURCES = [
    ["Mango", "WB Mango front.png"],
    ["Blueberry", "WB Blueberry Front .png"],
    ["Strawberry", "WB strawberry front.png"],
    ["Pineapple", "WB pineapple front.png"],
    ["Kiwi", "WB Kiwi front.png"],
    ["Banana", "WB Banana front.png"],
    ["Raspberry", "WB Raspberry front.png"],
    ["corn", "WB corn front.png"],
    ["Carrot", "WB Carrot Front.png"],
    ["Papaya", "WB Papaya Front.png"],
    ["Guava", "WB guava front.png"],
    ["Potato", "WB potato front.png"],
    ["GREEN Peas", "WB Peas front.png"],
    ["Jack Fruit", "WB jackfruit front.png"],
    ["Jamun", "WB Jamun front.png"],
    ["_GREEN Bellpepper", "WB green bell pepper front.png"],
    ["red Bellpepper", "WB Red bell pepper front.png"],
    ["zucchini", "WB Zucchini front.png"],
    ["Amla", "WB Amla Front.png"],
    ["Chikoo", "WB chikoo front.png"],
    ["Bitter gourd", "WB Bitter Gourd Front .png"],
    ["APPLE", "WB Apple  front png.png"],
    ["Custard apple", "WB Custard front.png"],
];

const OUT_DIR = path.join(ROOT, "public", "images", "packets-nobg");

const THRESHOLD = 42;

function colorDist(r1, g1, b1, r2, g2, b2) {
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function removeBg(img) {
    const w = img.width;
    const h = img.height;
    const data = img.bitmap.data; // flat RGBA Buffer, 4 bytes per pixel

    const byteIdx = (x, y) => (y * w + x) * 4;

    // Sample background colour from 4 corner 3x3 patches
    let rSum = 0, gSum = 0, bSum = 0, cnt = 0;
    const corners = [[0, 0], [w - 3, 0], [0, h - 3], [w - 3, h - 3]];
    for (const [cx, cy] of corners) {
        for (let dy = 0; dy < 3; dy++) {
            for (let dx = 0; dx < 3; dx++) {
                const i = byteIdx(Math.min(cx + dx, w - 1), Math.min(cy + dy, h - 1));
                rSum += data[i]; gSum += data[i + 1]; bSum += data[i + 2]; cnt++;
            }
        }
    }
    const bgR = rSum / cnt, bgG = gSum / cnt, bgB = bSum / cnt;

    const isBg = new Uint8Array(w * h);
    const visited = new Uint8Array(w * h);

    const isNearBg = (x, y) => {
        const i = byteIdx(x, y);
        return colorDist(data[i], data[i + 1], data[i + 2], bgR, bgG, bgB) < THRESHOLD;
    };

    // BFS flood fill from all border pixels
    const queue = [];
    let qi = 0;

    const enqueue = (x, y) => {
        if (x < 0 || x >= w || y < 0 || y >= h) return;
        const flat = y * w + x;
        if (visited[flat]) return;
        visited[flat] = 1;
        if (isNearBg(x, y)) { isBg[flat] = 1; queue.push(x, y); }
    };

    for (let x = 0; x < w; x++) { enqueue(x, 0); enqueue(x, h - 1); }
    for (let y = 0; y < h; y++) { enqueue(0, y); enqueue(w - 1, y); }

    while (qi < queue.length) {
        const x = queue[qi++]; const y = queue[qi++];
        enqueue(x + 1, y); enqueue(x - 1, y);
        enqueue(x, y + 1); enqueue(x, y - 1);
    }

    // Apply transparency
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const flat = y * w + x;
            if (!isBg[flat]) continue;
            const nTop = y > 0 && isBg[(y - 1) * w + x];
            const nBot = y < h - 1 && isBg[(y + 1) * w + x];
            const nLeft = x > 0 && isBg[y * w + (x - 1)];
            const nRight = x < w - 1 && isBg[y * w + (x + 1)];
            data[byteIdx(x, y) + 3] = (!nTop || !nBot || !nLeft || !nRight) ? 60 : 0;
        }
    }
}

// --- Main ---
async function main() {
    await fs.mkdir(OUT_DIR, { recursive: true });
    let ok = 0, fail = 0;

    for (const [folder, filename] of SOURCES) {
        const src = path.join(ROOT, "public", "images", folder, filename);
        const slug = folder.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
        const dest = path.join(OUT_DIR, slug + ".png");
        try {
            const img = await Jimp.read(src);
            removeBg(img);
            await img.write(dest);
            console.log(`  ${folder}`);
            ok++;
        } catch (e) {
            console.error(`  FAIL ${folder}: ${e.message}`);
            fail++;
        }
    }
    console.log(`\nDone: ${ok} ok, ${fail} failed`);
    console.log(`Output: ${OUT_DIR}`);
}

main().catch(console.error);
