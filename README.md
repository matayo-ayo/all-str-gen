# All Strings Generator
This package provides functions for generating random strings, numbers, hashes and sentences

## Installation
```bash
npm install all-str-gen
```

## Usage
### string Generator
```bash
const allstrgen = require('all-str-gen')

# syntax
const string = allstrgen.stringGenerator(count, uppercase, lowercase, number, symbols)

# usage
const string = allstrgen.stringGenerator(8, true, true, false, true)
```

---

### Passphrase Generator
```bash
const allstrgen = require('all-str-gen')

# syntax
const passPhrase = allstrgen.generatePassphrase(count)

# usage
const passPhrase = allstrgen.generatePassphrase(5)
```

---

### Hash generator
```bash
const allstrgen = require('all-str-gen')

# syntax
const hash = allstrgen.generateHash(input)

# usage
const hash = allstrgen.generateHash('my string')
```