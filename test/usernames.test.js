const { test } = require('node:test');
const assert = require('node:assert/strict');
const { generateUsername } = require('..');

test('custom usernames use only provided letters and alternate consonants/vowels', () => {
    for (const length of [2, 3, 6, 8, 31, 32]) {
        for (let i = 0; i < 30; i++) {
            const value = generateUsername({ alphabet: 'abeklmno', length });
            assert.equal(value.length, length);
            for (let j = 0; j < length; j++) assert.ok((j % 2 ? 'aeo' : 'bklmn').includes(value[j]));
        }
    }
    assert.equal(generateUsername('abeklmno').length, 8);
    assert.equal(generateUsername({ alphabet: 'AAAbbb', length: 7 }), 'bAbAbAb');
    assert.equal(generateUsername({ alphabet: 'AB', length: 4 }), 'BABA');
});

test('custom usernames reject impossible or ambiguous configuration', () => {
    for (const alphabet of ['', 'aeiou', 'bcdf', '123', 'ab1', 'a b', 'a-b', 'a😀', 'ébc', null, 12, []]) {
        assert.throws(() => generateUsername({ alphabet }));
    }
    for (const length of [0, 1, 33, -2, 1.5, NaN, Infinity, '8']) assert.throws(() => generateUsername({ alphabet: 'ab', length }));
    for (const option of [{ prefix: 'x' }, { digits: 0 }, { separator: '' }]) assert.throws(() => generateUsername({ alphabet: 'ab', ...option }));
    assert.throws(() => generateUsername({ length: 8 }));
});

test('custom usernames work with require and import; legacy usernames are preserved', async () => {
    const esm = await import('all-str-gen');
    const cjs = require('all-str-gen');
    for (const api of [esm, esm.default, cjs]) {
        assert.equal(api.generateUsername('ab'), 'babababa');
        assert.match(api.generateUsername(), /^[a-z]+_[a-z]+_\d{4}$/);
        assert.match(api.generateUsername({ prefix: 'user_', digits: 0 }), /^user_[a-z]+_[a-z]+$/);
    }
});
