# All Strings Generator
This package provides functions for generating random strings, numbers, hashes and sentences

## Installation
```bash
npm install all-str-gen
```

## Usage
#### string Generator
```bash
const allstrgen = require('all-str-gen')

# syntax
const stringGenerator = allstrgen.string(count, uppercase, lowercase, number, symbols)

# usage
const stringGenerator = allstrgen.string(8, true, true, false, true)
```

---

#### Sentence Generator
```bash
const allstrgen = require('all-str-gen')

# syntax
const sentenceGenerator = allstrgen.passphrase(count)

# usage
const sentenceGenerator = allstrgen.passphrase(5)
```

---

#### Hash generator
```bash
const allstrgen = require('all-str-gen')

# syntax
const hashGenerator = allstrgen.hash(input)

# usage
const hashGenerator = allstrgen.hash('my string')
```

NOTE:
- You need crypto dependcy installed to use hash method run ```npm i crypto```