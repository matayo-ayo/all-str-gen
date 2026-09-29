// JavaScript runs directly in Node: validate release inputs without a transpiler.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

async function build() {
    const root = path.resolve(__dirname, '..');
    const cjs = require(root);
    const esm = await import(pathToFileURL(path.join(root, 'index.mjs')).href);
    assert.deepEqual(Object.keys(esm).filter(key => key !== 'default').sort(), Object.keys(cjs).sort());
    assert.equal(esm.default, cjs);
    const declarations = fs.readFileSync(path.join(root, 'index.d.ts'), 'utf8');
    for (const [name, generator] of Object.entries(cjs)) {
        assert.equal(typeof generator, 'function');
        assert.equal(esm[name], generator);
        assert.ok(declarations.includes(`export function ${name}(`), `Missing declaration: ${name}`);
    }
    for (const file of ['index.d.mts', 'README.md', 'LICENCE.md']) assert.ok(fs.statSync(path.join(root, file)).size > 0);
    assert.match(cjs.generatePassword(), /[A-Z]/);
    assert.equal(cjs.generateRecoveryCodes().length, 10);
    assert.match(cjs.generatePattern('ID-{digit:4}'), /^ID-\d{4}$/);
    console.log(`Build validated: ${Object.keys(cjs).length} generators, CommonJS, ESM, and declaration files. No transpilation required.`);
}
build().catch(error => { console.error(error); process.exitCode = 1; });
