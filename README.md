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
const stringGenerator = allstrgen.stringGenerator(count, uppercase, lowercase, number, symbols)

# usage
const stringGenerator = allstrgen.stringGenerator(8, true, true, false, true)
```

---

### Passphrase Generator
```bash
const allstrgen = require('all-str-gen')

# syntax
const sentenceGenerator = allstrgen.generatePassphrase(count)

# usage
const sentenceGenerator = allstrgen.generatePassphrase(5)
```

---

### Hash generator
```bash
const allstrgen = require('all-str-gen')

# syntax
const hashGenerator = allstrgen.generateHash(input)

# usage
const hashGenerator = allstrgen.generateHash('my string')
```

NOTE:
- You need crypto dependcy installed to use hash method run ```npm i crypto```