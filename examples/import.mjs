import gen, {
    generateUsername, generatePassword, generateAlphanumericToken,
    generateNumericToken, generateAlphabeticToken, generatePIN,
    generatePassphrase, generatePattern, generateRecoveryCodes
} from 'all-str-gen';

console.log({
    username: generateUsername(),
    password: generatePassword({ length: 24 }),
    alphanumeric: generateAlphanumericToken(32),
    numeric: generateNumericToken(16),
    alphabetic: generateAlphabeticToken(32),
    pin: generatePIN(6),
    passphrase: generatePassphrase({ separator: '-' }),
    reference: generatePattern('INV-{upper:4}-{digit:6}'),
    recoveryCodes: generateRecoveryCodes({ count: 5 }),
    uuid: gen.generateUUID()
});
