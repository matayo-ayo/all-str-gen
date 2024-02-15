const hashGenerator = require('./lib/hashGenerator');
const passphraseGenerator = require('./lib/passphraseGenerator');
const stringGenerator = require('./lib/stringGenerator');

module.exports = {
    generateHash: function (string) {
        return hashGenerator(string); 
    },
    generatePassphrase: function (count) {
        return passphraseGenerator.generatePassphrase(count);
    },
    generateString: function (count, uppercase, lowcase, numbers, symbols) {
        return stringGenerator.stringGenerator(count, uppercase, lowcase, numbers, symbols);
    }
};