const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const gen = require('..');

test('typed tokens have exact lengths and the requested character sets', () => {
    for (const [type, method, pattern] of [
        ['alphanumeric', 'generateAlphanumericToken', /^[A-Za-z0-9]+$/],
        ['numeric', 'generateNumericToken', /^[0-9]+$/],
        ['alphabetic', 'generateAlphabeticToken', /^[A-Za-z]+$/]
    ]) {
        assert.equal(gen[method]().length, 32);
        for (const length of [1, 16, 256, 65536]) {
            for (const token of [gen[method](length), gen.generateToken({ type, length })]) {
                assert.equal(token.length, length);
                assert.match(token, pattern);
            }
        }
        for (const bad of [0, -1, 1.1, Infinity, NaN, '12', null, 65537]) assert.throws(() => gen[method](bad));
    }
    for (const opts of [{ type: 'unknown' }, { type: ['numeric'] }, { type: 'toString' }, { type: 'numeric', bytes: 32 }, { type: 'alphabetic', encoding: 'hex' }, { length: 20 }]) {
        assert.throws(() => gen.generateToken(opts));
    }
});

test('numeric tokens preserve leading zeros', t => {
    t.mock.method(crypto, 'randomInt', () => 0);
    assert.equal(gen.generateNumericToken(8), '00000000');
});

test('recovery codes are grouped and distinct within each batch', () => {
    const codes = gen.generateRecoveryCodes();
    assert.equal(codes.length, 10);
    assert.equal(new Set(codes).size, 10);
    for (const code of codes) assert.match(code, /^(?:[A-HJ-NP-Z2-9]{4}-){5}[A-HJ-NP-Z2-9]{4}$/);
    const custom = gen.generateRecoveryCodes({ count: 100, length: 17, groupSize: 5, separator: ' ' });
    assert.equal(new Set(custom).size, 100);
    for (const code of custom) assert.match(code, /^[A-HJ-NP-Z2-9]{5} [A-HJ-NP-Z2-9]{5} [A-HJ-NP-Z2-9]{5} [A-HJ-NP-Z2-9]{2}$/);
    assert.equal(gen.generateRecoveryCodes({ count: 1, length: 16, separator: '' })[0].length, 16);
    assert.equal(gen.generateRecoveryCodes({ count: 1, length: 128, groupSize: 128 })[0].length, 128);
    for (const opts of [null, [], { count: 0 }, { count: 1001 }, { length: 15 }, { length: 129 }, { groupSize: 0 }, { separator: 'A' }]) assert.throws(() => gen.generateRecoveryCodes(opts));
});

test('recovery collisions are retried and repeated collisions terminate', t => {
    let calls = 0;
    t.mock.method(crypto, 'randomInt', () => Math.floor(calls++ / 16) < 2 ? 0 : 1);
    const codes = gen.generateRecoveryCodes({ count: 2, length: 16, separator: '' });
    assert.deepEqual(codes, ['A'.repeat(16), 'B'.repeat(16)]);
    t.mock.restoreAll();
    t.mock.method(crypto, 'randomInt', () => 0);
    assert.throws(() => gen.generateRecoveryCodes({ count: 2 }), /too many duplicates/);
});

test('patterns support literals, all placeholders, repetitions and escaped braces', () => {
    assert.match(gen.generatePattern('INV-2026-{upper:4}-{digit:6}'), /^INV-2026-[A-Z]{4}-\d{6}$/);
    assert.match(gen.generatePattern('{lower:5}{alpha:5}{alnum:5}{hex:5}'), /^[a-z]{5}[A-Za-z]{5}[A-Za-z0-9]{5}[0-9a-f]{5}$/);
    assert.match(gen.generatePattern('{{{upper}}}'), /^\{[A-Z]\}$/);
    assert.equal(gen.generatePattern('literal {{text}}'), 'literal {text}');
    assert.equal(gen.generatePattern('\u{1f600}'), '\u{1f600}');
    assert.equal(gen.generatePattern('{digit:65536}').length, 65536);
    for (const pattern of ['', null, 12, '{}', '{digit:0}', '{digit:-1}', '{digit:1.5}', '{digit:01}', '{unknown}', '{constructor}', '{upper', '}', '{digit:65537}', '{digit:65536}x', 'x'.repeat(65537)]) {
        assert.throws(() => gen.generatePattern(pattern));
    }
});


test('public package exports support require, named import and default import', async () => {
    const cjs = require('all-str-gen');
    const esm = await import('all-str-gen');
    assert.deepEqual(Object.keys(esm).filter(key => key !== 'default').sort(), Object.keys(cjs).sort());
    assert.equal(esm.default, cjs);
    for (const key of Object.keys(cjs)) assert.equal(esm[key], cjs[key]);
    assert.match(esm.generatePattern('USER-{digit:4}'), /^USER-\d{4}$/);
    assert.equal(esm.default.generateRecoveryCodes({ count: 2 }).length, 2);
    assert.equal(require('all-str-gen/lib/stringGenerator.js').stringGenerator(4).length, 4);
});
