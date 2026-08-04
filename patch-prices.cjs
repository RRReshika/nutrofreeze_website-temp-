const fs = require("fs");
const path = require("path");

const root = process.cwd();
const skipFolders = new Set(["node_modules", ".git", "dist", "build", ".next"]);
const validExts = new Set([".js", ".jsx", ".ts", ".tsx"]);

const priceExpr = "(product.variants?.[0]?.price ?? product.price)";
const currencyExpr = "(product.variants?.[0]?.currency ?? product.currency ?? 'SGD')";
const variantIdExpr = "(product.variants?.[0]?.id ?? product.variantId)";

let changed = [];

function shouldSkip(fullPath) {
  const rel = path.relative(root, fullPath).replaceAll("\\", "/");
  if (rel === "app/api" || rel.startsWith("app/api/")) return true;
  return rel.split("/").some(part => skipFolders.has(part));
}

function walk(dir) {
  if (shouldSkip(dir)) return;

  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full);
    } else if (validExts.has(path.extname(full))) {
      patchFile(full);
    }
  }
}

function patchFile(file) {
  let code = fs.readFileSync(file, "utf8");
  const original = code;

  code = code.split(/\r?\n/).map(line => {
    let updated = line;

    if (updated.includes("product.price") && !updated.includes("variants?.[0]?.price")) {
      updated = updated.replace(/\bproduct\.price\b/g, priceExpr);
    }

    if (updated.includes("product.currency") && !updated.includes("variants?.[0]?.currency")) {
      updated = updated.replace(/\bproduct\.currency\b/g, currencyExpr);
    }

    if (updated.includes("product.variantId") && !updated.includes("variants?.[0]?.id")) {
      updated = updated.replace(/\bproduct\.variantId\b/g, variantIdExpr);
    }

    return updated;
  }).join("\n");

  if (code !== original) {
    fs.writeFileSync(file + ".bak", original);
    fs.writeFileSync(file, code);
    changed.push(path.relative(root, file));
  }
}

walk(root);

console.log(changed.length ? "Patched files:\n" + changed.join("\n") : "No product.price found. Send me your ProductCard/ProductGrid file.");
