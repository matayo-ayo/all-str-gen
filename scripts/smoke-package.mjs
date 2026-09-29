// Copy this file into a consumer project to check the installed package.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import api, * as esm from 'all-str-gen';

const require = createRequire(import.meta.url);
const cjs = require('all-str-gen');
assert.equal(api, cjs);
assert.equal(Object.keys(cjs).length, 14);
for (const [name, fn] of Object.entries(cjs)) assert.equal(esm[name], fn);
for (const gen of [api, cjs, esm]) {
    assert.equal(gen.generatePassword({ length: 24 }).length, 24);
    assert.match(gen.generateUsername(), /^[a-z]+_[a-z]+_\d{4}$/);
    assert.equal(gen.generateUsername({ alphabet: 'ab', length: 6 }), 'bababa');
    assert.equal(gen.generateRecoveryCodes({ count: 5 }).length, 5);
    assert.match(gen.generatePattern('REF-{digit:8}'), /^REF-\d{8}$/);
    assert.match(gen.generateAlphanumericToken(20), /^[A-Za-z0-9]{20}$/);
    assert.match(gen.generateNumericToken(20), /^\d{20}$/);
    assert.match(gen.generateAlphabeticToken(20), /^[A-Za-z]{20}$/);
    assert.match(gen.generateToken({ type: 'numeric', length: 12 }), /^\d{12}$/);
    assert.match(gen.generateToken(), /^[A-Za-z0-9_-]{43}$/);
    assert.match(gen.generatePIN(8), /^\d{8}$/);
    assert.equal(gen.generatePassphrase(6).split(' ').length, 6);
    assert.equal(gen.generateString(20).length, 20);
    assert.equal(gen.generateNumber(9, 9), 9);
    assert.match(gen.generateUUID(), /^[0-9a-f-]{36}$/);
    assert.equal(gen.generateHash('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
}
console.log('Installed package passed: all 14 generators through require, named import and default import.');
