const gen = require('all-str-gen');

console.log({
    username: gen.generateUsername(),
    password: gen.generatePassword({ length: 24 }),
    alphanumeric: gen.generateAlphanumericToken(32),
    numeric: gen.generateNumericToken(16),
    alphabetic: gen.generateAlphabeticToken(32),
    pin: gen.generatePIN(6),
    passphrase: gen.generatePassphrase({ separator: '-' }),
    reference: gen.generatePattern('INV-{upper:4}-{digit:6}'),
    recoveryCodes: gen.generateRecoveryCodes({ count: 5 })
});
