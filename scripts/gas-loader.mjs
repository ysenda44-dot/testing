// gas/src の .js を、GAS と同じく「全ファイルが同じグローバルを共有する」形で読み込む。
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export function loadGas(files = ['build.js', 'parsers.js']) {
  const context = vm.createContext({ console });
  for (const f of files) {
    const code = readFileSync(join(root, 'gas', 'src', f), 'utf8');
    vm.runInContext(code, context, { filename: f });
  }
  return context;
}

export function loadWebLib() {
  const context = vm.createContext({ console });
  const code = readFileSync(join(root, 'web', 'public', 'lib.js'), 'utf8');
  vm.runInContext(code, context, { filename: 'lib.js' });
  return context.MoneyLib;
}

export function gasFiles() {
  return readdirSync(join(root, 'gas', 'src')).filter((f) => f.endsWith('.js'));
}

export const repoRoot = root;
