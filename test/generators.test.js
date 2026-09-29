const { test } = require('node:test');
const assert = require('node:assert/strict');
const gen = require('..');

test('legacy API and defaults', () => {
    assert.match(gen.generateString(50, false, false, true, false), /^\d{50}$/);
    assert.equal(gen.generateString().length, 16);
    assert.equal(gen.generatePassphrase(5).split(' ').length, 5);
    assert.equal(gen.generateHash('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    assert.equal(require('../lib/stringGenerator').stringGenerator(10).length, 10);
});
test('password policies always include enabled groups and respect exclusions', () => {
    for (let i = 0; i < 200; i++) {
        const password = gen.generatePassword({ length: 20, excludeSimilar: true, exclude: '!@' });
        assert.equal(password.length, 20);
        for (const pattern of [/[A-Z]/, /[a-z]/, /[0-9]/, /[^a-zA-Z0-9]/]) assert.match(password, pattern);
        assert.doesNotMatch(password, /[il1Lo0O!@]/);
        const minimal = gen.generatePassword(4);
        for (const pattern of [/[A-Z]/, /[a-z]/, /[0-9]/, /[^a-zA-Z0-9]/]) assert.match(minimal, pattern);
    }
    assert.match(gen.generatePassword({ uppercase: false, lowercase: false, symbols: false }), /^\d{20}$/);
});
test('custom alphabets support Unicode and exclusions', () => {
    const value = gen.generateString({ length: 12, alphabet: '😀😀x', exclude: 'x' });
    assert.equal(Array.from(value).length, 12);
    assert.equal(value, '😀'.repeat(12));
});
test('passphrase options and custom dictionary', () => {
    assert.equal(gen.generatePassphrase({ length: 3, words: ['hello'], separator: '-', capitalize: true }), 'Hello-Hello-Hello');
    assert.equal(gen.generatePassphrase().split(' ').length, 6);
});
test('usernames, PINs, tokens, UUIDs and inclusive numbers', () => {
    assert.match(gen.generateUsername(), /^[a-z]+_[a-z]+_\d{4}$/);
    assert.match(gen.generateUsername({ prefix: 'user_', separator: '-', digits: 0 }), /^user_[a-z]+-[a-z]+$/);
    assert.match(gen.generatePIN(), /^\d{6}$/);
    assert.match(gen.generateToken(), /^[a-zA-Z0-9_-]{43}$/);
    assert.match(gen.generateToken({ bytes: 16, encoding: 'hex' }), /^[0-9a-f]{32}$/);
    assert.equal(Buffer.from(gen.generateToken({ bytes: 17, encoding: 'base64' }), 'base64').length, 17);
    assert.match(gen.generateUUID(), /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    assert.equal(gen.generateNumber(7, 7), 7);
    assert.equal(gen.generateNumber(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER);
    for (let i = 0; i < 100; i++) assert.ok([-2, -1, 0, 1, 2].includes(gen.generateNumber(-2, 2)));
});
test('invalid configurations fail explicitly', () => {
    for (const value of [0, -1, 1.5, NaN, Infinity, 65537, '10']) {
        assert.throws(() => gen.generateString(value));
        assert.throws(() => gen.generatePIN(value));
    }
    for (const call of [
        () => gen.generateString(5, false, false, false, false),
        () => gen.generateString({ alphabet: '' }),
        () => gen.generateString({ alphabet: 'a', exclude: 'a' }),
        () => gen.generateString({ uppercase: 'yes' }),
        () => gen.generatePassword(3),
        () => gen.generatePassword({ exclude: '0123456789' }),
        () => gen.generatePassword({ alphabet: 'abc' }),
        () => gen.generatePassphrase({ words: [] }),
        () => gen.generatePassphrase({ words: [''] }),
        () => gen.generatePassphrase({ separator: 1 }),
        () => gen.generateUsername({ digits: -1 }),
        () => gen.generateUsername({ prefix: 'bad name' }),
        () => gen.generateToken({ encoding: 'utf8' }),
        () => gen.generateNumber(2, 1),
        () => gen.generateNumber(0, 2 ** 48),
        () => gen.generateNumber(0.5, 1)
    ]) assert.throws(call);
    for (const name of ['generateString', 'generatePassword', 'generatePassphrase', 'generateUsername', 'generateToken']) assert.throws(() => gen[name](null));
});
test('generation does not depend on Math.random', () => {
    const original = Math.random;
    Math.random = () => { throw new Error('Insecure randomness'); };
    try {
        for (const name of ['generateString', 'generatePassword', 'generatePassphrase', 'generateUsername', 'generateToken', 'generatePIN', 'generateUUID', 'generateNumber', 'generateRecoveryCodes', 'generateAlphanumericToken', 'generateNumericToken', 'generateAlphabeticToken']) gen[name]();
        gen.generatePattern('REF-{digit:6}');
    } finally { Math.random = original; }
});
test('ES module named imports work', async () => {
    const imported = await import('../index.js');
    assert.equal(imported.generatePassword(20).length, 20);
    for (const key of Object.keys(gen)) assert.equal(typeof imported[key], 'function');
});
