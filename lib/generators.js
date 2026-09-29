const { randomInt, randomBytes, randomUUID } = require('node:crypto');
const CHARSETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789', symbols: '!@#$%^&*()_+[]{}|;:,.<>?'
};
const adjectives = require('../words/adjective.json').filter(w => /^[a-z]+$/.test(w));
const nouns = require('../words/noun.json').filter(w => /^[a-z]+$/.test(w));
const dictionary = [...new Set([...require('../words/adjective.json'), ...require('../words/noun.json'), ...require('../words/verb.json')]
    .map(word => word.trim()).filter(word => word && !/\s/.test(word)))];

function size(value, name = 'length', min = 1, max = 65536) {
    if (!Number.isSafeInteger(value) || value < min || value > max) throw new RangeError(`${name} must be an integer between ${min} and ${max}`);
    return value;
}
function options(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError('options must be an object');
    return value;
}
function sample(pool, length) {
    return Array.from({ length }, () => pool[randomInt(pool.length)]).join('');
}
function settings(input, password) {
    const opts = options(input);
    const length = size(opts.length ?? (password ? 20 : 16));
    if (opts.exclude !== undefined && typeof opts.exclude !== 'string') throw new TypeError('exclude must be a string');
    if (opts.excludeSimilar !== undefined && typeof opts.excludeSimilar !== 'boolean') throw new TypeError('excludeSimilar must be a boolean');
    const excluded = new Set(Array.from((opts.exclude ?? '') + (opts.excludeSimilar ? 'il1Lo0O' : '')));
    const groups = [];
    for (const [key, chars] of Object.entries(CHARSETS)) {
        if (opts[key] !== undefined && typeof opts[key] !== 'boolean') throw new TypeError(`${key} must be a boolean`);
        if (opts[key] ?? (key !== 'symbols' || password)) {
            const group = Array.from(chars).filter(char => !excluded.has(char));
            if (!group.length && password) throw new RangeError(`exclude removes all ${key} characters`);
            if (group.length) groups.push(group);
        }
    }
    if (opts.alphabet !== undefined && (typeof opts.alphabet !== 'string' || !opts.alphabet.length)) throw new TypeError('alphabet must be a non-empty string');
    const chars = opts.alphabet === undefined ? groups.flat() : [...new Set(Array.from(opts.alphabet))].filter(c => !excluded.has(c));
    if (!chars.length) throw new RangeError('At least one character must be available');
    return { length, groups, chars };
}
function generateString(length = 16, uppercase, lowercase, numbers, symbols) {
    const input = typeof length === 'object' ? length : arguments.length > 1
        ? { length, uppercase: uppercase ?? false, lowercase: lowercase ?? false, numbers: numbers ?? false, symbols: symbols ?? false }
        : { length };
    const config = settings(input, false);
    return sample(config.chars, config.length);
}
function generatePassword(input = {}) {
    if (typeof input === 'number') input = { length: input };
    options(input);
    if (input.alphabet !== undefined) throw new TypeError('Use generateString for custom alphabets');
    const { length, groups, chars } = settings(input, true);
    if (length < groups.length) throw new RangeError('length must fit every enabled character group');
    const result = groups.map(group => sample(group, 1));
    result.push(...Array.from(sample(chars, length - result.length)));
    for (let i = result.length - 1; i > 0; i--) {
        const j = randomInt(i + 1);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result.join('');
}
function generatePassphrase(input = 6) {
    const opts = typeof input === 'number' ? { length: input } : options(input);
    const length = size(opts.length ?? 6, 'length', 1, 1024);
    const separator = opts.separator ?? ' ';
    if (typeof separator !== 'string') throw new TypeError('separator must be a string');
    if (opts.capitalize !== undefined && typeof opts.capitalize !== 'boolean') throw new TypeError('capitalize must be a boolean');
    const words = opts.words ?? dictionary;
    if (!Array.isArray(words) || !words.length || words.some(w => typeof w !== 'string' || !w.trim())) throw new TypeError('words must be a non-empty array of non-empty strings');
    const pool = [...new Set(words)];
    return Array.from({ length }, () => {
        const word = sample(pool, 1);
        return opts.capitalize ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    }).join(separator);
}
function generatePIN(length = 6) { return sample(CHARSETS.numbers, size(length)); }
function generateUsername(input = {}) {
    if (typeof input === 'string') input = { alphabet: input };
    const opts = options(input);
    if (opts.alphabet !== undefined) {
        if (typeof opts.alphabet !== 'string' || !/^[a-zA-Z]+$/.test(opts.alphabet)) {
            throw new TypeError('username alphabet must contain only ASCII letters A-Z and a-z');
        }
        if (opts.prefix !== undefined || opts.separator !== undefined || opts.digits !== undefined) {
            throw new TypeError('Custom-alphabet usernames accept alphabet and length; prefix, separator and digits are for word-based usernames');
        }
        const chars = [...new Set(opts.alphabet)];
        const vowels = chars.filter(char => /[aeiou]/i.test(char));
        const consonants = chars.filter(char => !/[aeiou]/i.test(char));
        if (!vowels.length || !consonants.length) {
            throw new RangeError('username alphabet needs at least one vowel (a, e, i, o, u) and one consonant');
        }
        const length = size(opts.length ?? 8, 'length', 2, 32);
        return Array.from({ length }, (_, index) => sample(index % 2 ? vowels : consonants, 1)).join('');
    }
    if (opts.length !== undefined) throw new TypeError('username length requires a custom alphabet');
    const separator = opts.separator ?? '_';
    const prefix = opts.prefix ?? '';
    if (typeof separator !== 'string' || !/^[_-]?$/.test(separator)) throw new TypeError('separator must be empty, _ or -');
    if (typeof prefix !== 'string' || !/^[a-zA-Z0-9_-]*$/.test(prefix)) throw new TypeError('prefix must contain only letters, digits, _ or -');
    const digits = size(opts.digits ?? 4, 'digits', 0, 32);
    return prefix + sample(adjectives, 1) + separator + sample(nouns, 1) + (digits ? separator + generatePIN(digits) : '');
}
function generateToken(input = {}) {
    const opts = options(input);
    if (opts.type !== undefined) {
        const generators = {
            alphanumeric: require('./advancedGenerators').generateAlphanumericToken,
            numeric: require('./advancedGenerators').generateNumericToken,
            alphabetic: require('./advancedGenerators').generateAlphabeticToken
        };
        if (typeof opts.type !== 'string' || !Object.hasOwn(generators, opts.type)) throw new TypeError('type must be alphanumeric, numeric or alphabetic');
        if (opts.bytes !== undefined || opts.encoding !== undefined) throw new TypeError('Use length with type; bytes and encoding are for encoded tokens');
        return generators[opts.type](opts.length);
    }
    if (opts.length !== undefined) throw new TypeError('length requires a token type; use bytes for encoded tokens');
    const bytes = size(opts.bytes ?? 32, 'bytes');
    const encoding = opts.encoding ?? 'base64url';
    if (!['hex', 'base64', 'base64url'].includes(encoding)) throw new TypeError('encoding must be hex, base64 or base64url');
    return randomBytes(bytes).toString(encoding);
}
function generateNumber(min = 0, max = 100) {
    if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max || max - min >= 2 ** 48 - 1) throw new RangeError('min and max must be safe integers with min <= max and a range smaller than 2^48');
    return min + randomInt(max - min + 1);
}
module.exports = { generateString, generatePassword, generatePassphrase, generatePIN, generateUsername, generateToken, generateNumber, generateUUID: () => randomUUID() };
