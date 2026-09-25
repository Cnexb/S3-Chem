/**
 * Chapter packs must hold notes, tools, and summaries under content-packs.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packsRoot = path.join(repoRoot, "content-packs");

const directories = fs
  .readdirSync(packsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .toSorted();

assert.equal(directories.length, 15);

const scopes = new Set();
const slugs = new Set();

for (const directory of directories) {
  const manifestPath = path.join(packsRoot, directory, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  assert.equal(manifest.subject, "CHEM");
  assert.equal(manifest.published, true);
  assert.equal(typeof manifest.scope, "string");
  assert.equal(scopes.has(manifest.scope), false, manifest.scope);
  scopes.add(manifest.scope);
  assert.ok(Array.isArray(manifest.notes) && manifest.notes.length > 0);

  for (const note of manifest.notes) {
    assert.equal(fs.existsSync(path.join(repoRoot, note.files.en)), true, note.files.en);
  }

  for (const tool of manifest.tools ?? []) {
    assert.match(tool.slug, /^[a-z0-9-]+$/);
    assert.equal(slugs.has(tool.slug), false, tool.slug);
    slugs.add(tool.slug);
    const indexHtml = path.join(repoRoot, tool.path, "index.html");
    assert.equal(fs.existsSync(indexHtml), true, tool.path);
  }

  for (const summary of manifest.summaries ?? []) {
    assert.equal(fs.existsSync(path.join(repoRoot, summary.images.en)), true, summary.images.en);
    assert.equal(fs.existsSync(path.join(repoRoot, summary.images.zhHant)), true, summary.images.zhHant);
  }
}

assert.equal(scopes.size, 15);
assert.ok(slugs.has("bunsen"));
assert.ok(slugs.has("s3-mc"));
assert.ok(slugs.has("atom-builder"));
