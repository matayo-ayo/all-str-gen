# all-str-gen

**Passwords, usernames, tokens, codes and more — all in one package.**

`all-str-gen` provides simple generators for common application needs, with configurable options and secure random generation using Node.js built-in cryptographic randomness.

**Zero runtime dependencies** · **TypeScript support** · **CommonJS + ESM**

## Install

```bash
npm install all-str-gen
```

## Quick Start

### CommonJS

```js
const gen = require('all-str-gen');

console.log(gen.generatePassword());
console.log(gen.generateUsername());
console.log(gen.generatePIN());
console.log(gen.generateUUID());
```

### ES Modules

```js
import gen from 'all-str-gen';

console.log(gen.generatePassword());
console.log(gen.generateUsername());
console.log(gen.generatePIN());
console.log(gen.generateUUID());
```

## Generators

| Function                      | Description                   |
| ----------------------------- | ----------------------------- |
| `generatePassword()`          | Secure customizable passwords |
| `generateUsername()`          | Random usernames              |
| `generateRecoveryCodes()`     | Recovery/security codes       |
| `generatePattern()`           | Custom formatted strings      |
| `generateAlphanumericToken()` | Letters and numbers           |
| `generateNumericToken()`      | Numeric tokens                |
| `generateAlphabeticToken()`   | Alphabetic tokens             |
| `generateToken()`             | Random byte-based tokens      |
| `generatePIN()`               | Numeric PINs                  |
| `generatePassphrase()`        | Random word-based passphrases |
| `generateString()`            | Custom random strings         |
| `generateUUID()`              | UUID v4 identifiers           |
| `generateNumber()`            | Random numbers within a range |
| `generateHash()`              | SHA-256 hashes                |

## Examples

### Password

```js
gen.generatePassword({
  length: 24,
  excludeSimilar: true
});
```

### Username

```js
gen.generateUsername({
  prefix: 'player_',
  digits: 4
});
```

### Recovery Codes

```js
gen.generateRecoveryCodes({
  count: 5
});
```

### Custom Pattern

```js
gen.generatePattern('ORDER-{upper:3}-{digit:6}');

// Example: ORDER-KQM-048291
```

### Token

```js
gen.generateToken({
  type: 'alphanumeric',
  length: 32
});
```

### Passphrase

```js
gen.generatePassphrase(6);
```

## TypeScript

TypeScript declarations are included:

```ts
import {
  generatePassword,
  generateUUID
} from 'all-str-gen';

const password = generatePassword({
  length: 24
});

const id = generateUUID();
```

## Requirements

* Node.js 22 or newer
* Node.js environment (not intended for browsers)

## Security

Generators use Node.js cryptographic randomness where appropriate. Random output does not guarantee global uniqueness, so applications requiring unique values should enforce uniqueness when storing them.

Do not use generated hashes for password storage. Use a dedicated password-hashing algorithm instead.

## License

MIT
