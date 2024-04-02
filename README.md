# All Strings Generator
This package provides functions for generating passphrases, random strings, random numbers and hashes

## Installation
Run ```npm i all-str-gen``` to install package to project

## Usage
### string Generator
Generate mixed strings with any length using true and false
- Generate usernames
- Generate password
- Generate control numbers
- Generate keys
```bash
const allstrgen = require('all-str-gen')

# syntax
const string = allstrgen.generateString(count, uppercase, lowercase, number, symbols)

# usage
const string = allstrgen.generateString(8, true, true, false, true)
```
   
---

### Passphrase Generator
Generate passphrases with a word count
- Generate passphrase
```bash
const allstrgen = require('all-str-gen')

# syntax
const passPhrase = allstrgen.generatePassphrase(count)

# usage
const passPhrase = allstrgen.generatePassphrase(5)
```

---

### Hash generator
create irevisible hash from string
#### NOTE:
- To use this function you need crypto package installed run ```npm i crypto``` to install
```bash
const allstrgen = require('all-str-gen')

# syntax
const hash = allstrgen.generateHash(input)

# usage
const hash = allstrgen.generateHash('my string')
```

[Documentation](https://matayo-ayo.github.io/all-str-gen)