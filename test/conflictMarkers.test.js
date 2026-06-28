const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = path.join(__dirname, '..');
const IGNORED_DIRS = new Set(['.git', 'node_modules', 'logs']);
const TEXT_EXTENSIONS = new Set(['.js', '.json', '.md', '.txt', '.yml', '.yaml']);

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(fullPath);
    else if (TEXT_EXTENSIONS.has(path.extname(entry.name))) yield fullPath;
  }
}

test('repository does not contain unresolved merge conflict markers', () => {
  const offenders = [];
  const markerPattern = /^(<<<<<<<|=======|>>>>>>>)\s?/m;

  for (const filePath of walk(ROOT)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (markerPattern.test(content)) {
      offenders.push(path.relative(ROOT, filePath));
    }
  }

  assert.deepEqual(offenders, []);
});
