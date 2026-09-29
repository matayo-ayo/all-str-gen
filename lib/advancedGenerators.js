const crypto = require('node:crypto');

const ALPHABETS = Object.freeze({
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    digit: '0123456789',
    alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    alnum: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    hex: '0123456789abcdef'
});
const RECOVERY_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function integer(value, name, min, max) {
    if (!Number.isSafeInteger(value) || value < min || value > max) {
        throw new RangeError(`${name} must be an integer between ${min} and ${max}`);
    }
    return value;
}

function options(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError('options must be an object');
    return value;
}

function sample(alphabet, length) {
    return Array.from({ length }, () => alphabet[crypto.randomInt(alphabet.length)]).join('');
}

function generateAlphanumericToken(length = 32) {
    return sample(ALPHABETS.alnum, integer(length, 'length', 1, 65536));
}

function generateNumericToken(length = 32) {
    return sample(ALPHABETS.digit, integer(length, 'length', 1, 65536));
}

function generateAlphabeticToken(length = 32) {
    return sample(ALPHABETS.alpha, integer(length, 'length', 1, 65536));
}

function generateRecoveryCodes(input = {}) {
    const opts = options(input);
    const count = integer(opts.count ?? 10, 'count', 1, 1000);
    const length = integer(opts.length ?? 24, 'length', 16, 128);
    const groupSize = integer(opts.groupSize ?? 4, 'groupSize', 1, 128);
    const separator = opts.separator ?? '-';
    if (typeof separator !== 'string' || !['-', ' ', ''].includes(separator)) {
        throw new TypeError('separator must be -, a space, or empty');
    }
    const codes = new Set();
    // Bound retries even if the random source unexpectedly keeps returning duplicates.
    for (let attempt = 0; codes.size < count && attempt < count * 10; attempt++) {
        const raw = sample(RECOVERY_ALPHABET, length);
        const groups = [];
        for (let i = 0; i < raw.length; i += groupSize) groups.push(raw.slice(i, i + groupSize));
        codes.add(groups.join(separator));
    }
    if (codes.size !== count) throw new Error('Unable to generate distinct recovery codes; random source returned too many duplicates');
    return [...codes];
}

function generatePattern(pattern) {
    if (typeof pattern !== 'string' || !pattern.length) throw new TypeError('pattern must be a non-empty string');
    integer(pattern.length, 'pattern length', 1, 65536);
    const parts = [];
    let outputLength = 0;
    // Parse and validate the entire pattern before generating any random output.
    for (let i = 0; i < pattern.length;) {
        let part;
        if (pattern.startsWith('{{', i) || pattern.startsWith('}}', i)) {
            part = { literal: pattern[i] };
            i += 2;
        } else if (pattern[i] === '{') {
            const end = pattern.indexOf('}', i);
            if (end === -1) throw new SyntaxError('Unclosed pattern placeholder');
            const match = /^([a-z]+)(?::([1-9][0-9]*))?$/.exec(pattern.slice(i + 1, end));
            if (!match || !Object.hasOwn(ALPHABETS, match[1])) throw new SyntaxError('Expected {upper}, {lower}, {digit}, {alpha}, {alnum}, or {hex}, optionally with :length');
            part = { alphabet: ALPHABETS[match[1]], length: integer(Number(match[2] ?? 1), 'placeholder length', 1, 65536) };
            i = end + 1;
        } else if (pattern[i] === '}') {
            throw new SyntaxError('Escape literal braces using {{ and }}');
        } else {
            part = { literal: String.fromCodePoint(pattern.codePointAt(i)) };
            i += part.literal.length;
        }
        outputLength += part.length ?? 1;
        integer(outputLength, 'output length', 1, 65536);
        parts.push(part);
    }
    return parts.map(part => part.literal ?? sample(part.alphabet, part.length)).join('');
}

module.exports = { generateRecoveryCodes, generatePattern, generateAlphanumericToken, generateNumericToken, generateAlphabeticToken };
