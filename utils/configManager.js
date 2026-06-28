const fs = require('node:fs');
const path = require('node:path');

class ConfigManager {
  constructor(rootDir, logger = console) {
    this.rootDir = rootDir;
    this.logger = logger;
    this.cache = new Map();
    this.watchers = [];
  }

  resolve(name) {
    return name === 'config' ? path.join(this.rootDir, 'config.json') : path.join(this.rootDir, 'configs', `${name}.json`);
  }

  get(name, fallback = {}) {
    const filePath = this.resolve(name);
    if (this.cache.has(filePath)) return this.cache.get(filePath);
    const value = this.loadFile(filePath, fallback);
    this.cache.set(filePath, value);
    return value;
  }

  loadFile(filePath, fallback = {}) {
    try {
      if (!fs.existsSync(filePath)) return fallback;
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      this.logger.error?.(`Invalid JSON config: ${filePath}`, error);
      return this.cache.get(filePath) || fallback;
    }
  }

  setPath(name, dottedPath, value) {
    const filePath = this.resolve(name);
    const current = this.get(name, {});
    const parts = dottedPath.split('.');
    let cursor = current;
    for (const part of parts.slice(0, -1)) {
      if (!cursor[part] || typeof cursor[part] !== 'object') cursor[part] = {};
      cursor = cursor[part];
    }
    cursor[parts.at(-1)] = value;
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${JSON.stringify(current, null, 2)}\n`);
    this.cache.set(filePath, current);
    return current;
  }

  watch(names) {
    this.close();
    for (const name of names) {
      const filePath = this.resolve(name);
      if (!fs.existsSync(filePath)) continue;
      const watcher = fs.watch(filePath, { persistent: false }, () => {
        this.cache.set(filePath, this.loadFile(filePath, this.cache.get(filePath) || {}));
      });
      this.watchers.push(watcher);
    }
  }

  close() {
    for (const watcher of this.watchers) watcher.close();
    this.watchers = [];
  }
}

module.exports = ConfigManager;
